import { Order } from '../models/Order';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { NotificationEmailService } from './notificationEmail.service';

export class OrdersService {
  static async getOrders(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      const q = new RegExp(query.search as string, 'i');
      filter.$or = [{ orderNumber: q }, { customerName: q }, { customerEmail: q }];
    }
    const [data, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(page, limit, total) };
  }

  static async getOrderById(id: string) {
    const order = await Order.findById(id);
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    return order;
  }

  // Fields that must NEVER be mutated by admin actions.
  // paymentStatus and paypalOrderId are exclusively managed by the PayPal
  // webhook pipeline. Financial totals and order identity are immutable once created.
  private static readonly IMMUTABLE_FIELDS = new Set([
    'paymentStatus', 'paypalOrderId', 'paymentMethod',
    'total', 'subtotal', 'discount', 'tax',
    'items', 'orderNumber', 'customerId',
    'createdAt', 'updatedAt',
  ]);

  static async updateOrder(id: string, data: Partial<Record<string, unknown>>) {
    // Strip any protected fields — belt-and-suspenders on top of the validator
    const safe: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data)) {
      if (!OrdersService.IMMUTABLE_FIELDS.has(key)) {
        safe[key] = val;
      }
    }
    const order = await Order.findByIdAndUpdate(id, safe, { new: true, runValidators: true });
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    return order;
  }

  static async updateOrderStatus(id: string, status: string) {
    // Admin can only set workflow statuses — never pending/paid
    const ADMIN_ALLOWED = new Set(['processing', 'completed', 'failed', 'refunded', 'cancelled']);
    if (!ADMIN_ALLOWED.has(status)) {
      throw Object.assign(
        new Error('Pending/paid are payment-driven and cannot be set manually.'),
        { statusCode: 400 },
      );
    }

    // Ensure the order is actually paid before letting admin progress it.
    // (Refunded orders can still be marked 'refunded' — handled below.)
    const existing = await Order.findById(id).select('paymentStatus status').lean();
    if (!existing) throw Object.assign(new Error('Order not found'), { statusCode: 404 });

    if (existing.paymentStatus !== 'paid' && existing.paymentStatus !== 'refunded') {
      throw Object.assign(
        new Error(`Cannot change status on an unpaid order. Current payment status: ${existing.paymentStatus}.`),
        { statusCode: 400 },
      );
    }

    const update: Record<string, unknown> = { status };
    if (status === 'completed') update.completedAt = new Date();
    const order = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });

    // ── In-app notification (non-blocking) ──────────────────────────────────
    const notifyStatuses = ['completed', 'processing', 'cancelled', 'refunded'];
    if (notifyStatuses.includes(status)) {
      NotificationService.orderStatusChanged(
        order.orderNumber,
        status,
        order._id.toString(),
      ).catch(() => {});
    }

    // ── Email notifications (non-blocking) ──────────────────────────────────

    // 1. Admin email when order is completed
    if (status === 'completed') {
      NotificationEmailService.fireIfEnabled(
        'emailOnOrderComplete',
        `Order Completed — ${order.orderNumber}`,
        `
          <h2>Order Marked as Completed</h2>
          <p><strong>Order:</strong> ${order.orderNumber}</p>
          <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
          <p><strong>Device:</strong> ${order.brand} ${order.model}</p>
          <p><strong>Total:</strong> £${order.total.toFixed(2)}</p>
        `,
      ).catch(() => {});
    }

    // 2. Customer email: status update for all meaningful statuses
    if (notifyStatuses.includes(status) && order.customerEmail) {
      EmailService.sendOrderStatusUpdate(
        order.customerEmail,
        order.orderNumber,
        status,
      ).catch(() => {});
    }

    return order;
  }

  static async deleteOrder(id: string) {
    const order = await Order.findByIdAndDelete(id);
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  }

  static async getOrderNotes(id: string) {
    const order = await Order.findById(id).select('notes');
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    return order.notes;
  }

  static async addOrderNote(id: string, text: string) {
    const order = await Order.findByIdAndUpdate(
      id,
      { $push: { notes: { text, createdAt: new Date() } } },
      { new: true },
    );
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    return order.notes;
  }

  static async trackByOrderNumber(orderNumber: string) {
    const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase().trim() }).select(
      'orderNumber status customerName customerEmail customerPhone device brand model repairType items subtotal discount total createdAt completedAt',
    );
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    return order;
  }
}

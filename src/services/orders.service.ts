import { Order } from '../models/Order';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { NotificationService } from './notification.service';

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
    const update: Record<string, unknown> = { status };
    if (status === 'completed') update.completedAt = new Date();
    const order = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });

    // Notify on meaningful status transitions
    const notifyStatuses = ['completed', 'processing', 'cancelled', 'refunded'];
    if (notifyStatuses.includes(status)) {
      NotificationService.orderStatusChanged(
        order.orderNumber,
        status,
        order._id.toString(),
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

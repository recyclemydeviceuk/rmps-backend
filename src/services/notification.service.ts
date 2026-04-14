import { Notification, type NotificationType } from '../models/Notification';
import { Types } from 'mongoose';

const MAX_STORED = 200;

export class NotificationService {

  /** Create a notification and prune to MAX_STORED */
  static async create(payload: {
    type:         NotificationType;
    title:        string;
    message:      string;
    orderId?:     string | Types.ObjectId;
    orderNumber?: string;
  }) {
    const notification = await Notification.create({
      type:        payload.type,
      title:       payload.title,
      message:     payload.message,
      orderId:     payload.orderId,
      orderNumber: payload.orderNumber,
      read:        false,
    });

    // Prune oldest beyond MAX_STORED (fire-and-forget)
    Notification.countDocuments()
      .then(count => {
        if (count > MAX_STORED) {
          return Notification.find()
            .sort({ createdAt: 1 })
            .limit(count - MAX_STORED)
            .select('_id')
            .lean()
            .then(old => Notification.deleteMany({ _id: { $in: old.map(o => o._id) } }));
        }
      })
      .catch(() => {}); // never crash on cleanup

    return notification;
  }

  /** Get paginated notifications, newest first */
  static async getAll(page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(),
      Notification.countDocuments({ read: false }),
    ]);
    return { notifications, total, unreadCount, page, limit };
  }

  /** Mark a single notification as read */
  static async markRead(id: string) {
    const n = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!n) throw Object.assign(new Error('Notification not found'), { statusCode: 404 });
    return n;
  }

  /** Mark ALL notifications as read */
  static async markAllRead() {
    await Notification.updateMany({ read: false }, { read: true });
  }

  /** Delete a single notification */
  static async delete(id: string) {
    const n = await Notification.findByIdAndDelete(id);
    if (!n) throw Object.assign(new Error('Notification not found'), { statusCode: 404 });
  }

  // ── Convenience factory methods ──────────────────────────────────────────────

  static newOrder(orderNumber: string, model: string, repairType: string, orderId?: string) {
    return NotificationService.create({
      type:        'new_order',
      title:       'New Order Received',
      message:     `${orderNumber} — ${model} ${repairType}`,
      orderId,
      orderNumber,
    });
  }

  static paymentReceived(orderNumber: string, total: number, orderId?: string) {
    return NotificationService.create({
      type:        'payment_received',
      title:       'Payment Received',
      message:     `${orderNumber} — £${total.toFixed(2)} confirmed`,
      orderId,
      orderNumber,
    });
  }

  static paymentFailed(orderNumber: string, orderId?: string) {
    return NotificationService.create({
      type:        'payment_failed',
      title:       'Payment Failed',
      message:     `${orderNumber} — payment was declined`,
      orderId,
      orderNumber,
    });
  }

  static orderStatusChanged(orderNumber: string, status: string, orderId?: string) {
    const titles: Record<string, string> = {
      completed:   'Order Completed',
      processing:  'Order In Progress',
      cancelled:   'Order Cancelled',
      refunded:    'Order Refunded',
    };
    const types: Record<string, NotificationType> = {
      completed:  'order_completed',
      processing: 'order_processing',
      cancelled:  'order_cancelled',
      refunded:   'order_refunded',
    };
    const title = titles[status] ?? `Order ${status}`;
    const type  = types[status] ?? 'order_completed';

    return NotificationService.create({
      type,
      title,
      message:     `${orderNumber} status changed to ${status}`,
      orderId,
      orderNumber,
    });
  }
}

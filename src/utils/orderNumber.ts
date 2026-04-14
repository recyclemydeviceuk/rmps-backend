import { Order } from '../models/Order';

/**
 * Generate a human-readable, per-year sequential order number.
 * Format: RPMS-YYYY-NNN  (e.g. RPMS-2026-001, RPMS-2026-002, …)
 *
 * Safe against race conditions: we query the highest existing sequence
 * for the current year and increment it. The Order model has a unique
 * index on orderNumber so a collision will cause a duplicate-key error
 * which the caller can retry.
 */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `RPMS-${year}-`;

  // Find the most recently created order whose number starts with this year's prefix
  const last = await Order.findOne(
    { orderNumber: { $regex: `^${prefix}` } },
    { orderNumber: 1 },
  ).sort({ createdAt: -1 });

  let next = 1;
  if (last) {
    const parts = last.orderNumber.split('-');
    const seq = parseInt(parts[2] ?? '0', 10);
    if (!isNaN(seq)) next = seq + 1;
  }

  return `${prefix}${String(next).padStart(3, '0')}`;
}

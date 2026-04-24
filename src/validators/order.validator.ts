import { z } from 'zod';

/**
 * Statuses that an admin is allowed to transition an order to.
 *
 * `pending` and `paid` are deliberately EXCLUDED — they represent the
 * pre-fulfilment payment lifecycle and are driven exclusively by the
 * PayPal webhook (unpaid → pending order → paid once confirmed).
 *
 * Once an order is paid, the admin can progress it through the
 * fulfilment workflow: processing → completed / failed / cancelled /
 * refunded.
 */
const ADMIN_ALLOWED_STATUSES = ['processing', 'completed', 'failed', 'refunded', 'cancelled'] as const;

// Only the ORDER workflow status — never touches paymentStatus
export const updateOrderStatusSchema = z.object({
  status: z.enum(ADMIN_ALLOWED_STATUSES, {
    errorMap: () => ({
      message: 'Status can only be set to processing, completed, failed, refunded or cancelled. Pending/paid are derived from payment status.',
    }),
  }),
});

// General order update: only safe mutable fields are allowed.
// Payment-sensitive fields (paymentStatus, paypalOrderId, paymentMethod,
// total, subtotal, discount, tax, items, orderNumber) are intentionally
// excluded — they are either immutable or controlled exclusively by the
// PayPal webhook pipeline.
export const updateOrderSchema = z.object({
  customerName:  z.string().min(1).max(100).optional(),
  customerEmail: z.string().email().max(254).optional(),
  customerPhone: z.string().max(30).optional(),
  device:        z.string().max(100).optional(),
  brand:         z.string().max(100).optional(),
  model:         z.string().max(100).optional(),
  repairType:    z.string().max(100).optional(),
  postageType:   z.enum(['print-label', 'send-pack', 'send-your-own']).optional(),
});

export const addOrderNoteSchema = z.object({
  text: z.string().min(1, 'Note text is required').max(2000),
});

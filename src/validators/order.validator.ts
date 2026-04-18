import { z } from 'zod';

const ORDER_STATUSES = ['pending', 'paid', 'processing', 'completed', 'failed', 'refunded', 'cancelled'] as const;

// Only the ORDER workflow status — never touches paymentStatus
export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
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
  postageType:   z.enum(['print-label', 'send-pack', 'collection']).optional(),
});

export const addOrderNoteSchema = z.object({
  text: z.string().min(1, 'Note text is required').max(2000),
});

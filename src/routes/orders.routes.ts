import { Router } from 'express';
import {
  getOrders, getOrder, updateOrder,
  updateOrderStatus, deleteOrder,
  addOrderNote, getOrderNotes,
} from '../controllers/orders.controller';
import { validateBody } from '../middleware/validate';
import { updateOrderStatusSchema, updateOrderSchema, addOrderNoteSchema } from '../validators/order.validator';

const router = Router();

// GET    /api/orders
router.get('/',                  getOrders);
// GET    /api/orders/:id
router.get('/:id',               getOrder);
// PUT    /api/orders/:id  — validated to only allow safe mutable fields
router.put('/:id',               validateBody(updateOrderSchema), updateOrder);
// PATCH  /api/orders/:id/status — only workflow status, never paymentStatus
router.patch('/:id/status',      validateBody(updateOrderStatusSchema), updateOrderStatus);
// DELETE /api/orders/:id
router.delete('/:id',            deleteOrder);
// GET    /api/orders/:id/notes
router.get('/:id/notes',         getOrderNotes);
// POST   /api/orders/:id/notes
router.post('/:id/notes',        validateBody(addOrderNoteSchema), addOrderNote);

export default router;

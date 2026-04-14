import { Router } from 'express';
import {
  getCustomers, getCustomer,
  updateCustomer, deleteCustomer, getCustomerOrders,
} from '../controllers/customers.controller';
import { validateBody } from '../middleware/validate';
import { updateCustomerSchema } from '../validators/customer.validator';

const router = Router();

// GET    /api/customers
router.get('/',             getCustomers);
// GET    /api/customers/:id
router.get('/:id',          getCustomer);
// PUT    /api/customers/:id
router.put('/:id',          validateBody(updateCustomerSchema), updateCustomer);
// DELETE /api/customers/:id
router.delete('/:id',       deleteCustomer);
// GET    /api/customers/:id/orders
router.get('/:id/orders',   getCustomerOrders);

export default router;

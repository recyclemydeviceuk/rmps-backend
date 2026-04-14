import { Router } from 'express';
import { createCheckout } from '../controllers/checkout.controller';
import { validateBody } from '../middleware/validate';
import { checkoutSchema } from '../validators/checkout.validator';

const router = Router();

// POST /api/checkout
// Creates an order and returns the PayPal payment URL
router.post('/', validateBody(checkoutSchema), createCheckout);

export default router;

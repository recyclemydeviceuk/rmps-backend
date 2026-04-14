import { Router } from 'express';
import {
  initiatePayment, capturePayment,
  getPaymentStatus, paypalWebhook,
} from '../controllers/payment.controller';

const router = Router();

// POST /api/payment/initiate    — create PayPal order
router.post('/initiate',          initiatePayment);
// POST /api/payment/capture     — capture after buyer approves
router.post('/capture',           capturePayment);
// GET  /api/payment/status/:id  — poll payment status
router.get('/status/:orderId',    getPaymentStatus);
// POST /api/payment/webhook     — PayPal webhook events
router.post('/webhook/paypal',    paypalWebhook);

export default router;

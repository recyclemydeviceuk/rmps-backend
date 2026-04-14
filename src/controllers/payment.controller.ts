import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { PaymentService } from '../services/payment.service';

export const initiatePayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await PaymentService.createPayPalOrder(req.body);
  sendSuccess(res, result, 'PayPal order created');
});

export const capturePayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await PaymentService.capturePayPalOrder(req.body.paypalOrderId, req.body.orderId);
  sendSuccess(res, result, 'Payment captured');
});

export const getPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const status = await PaymentService.getStatus(req.params.orderId);
  sendSuccess(res, status, 'Payment status retrieved');
});

export const paypalWebhook = asyncHandler(async (req: Request, res: Response) => {
  // req.body is a raw Buffer here (set via express.raw() in app.ts for this route).
  // We pass the raw bytes to the service so it can verify PayPal's signature
  // before parsing or trusting any of the payload.
  const rawBody = req.body as Buffer;
  const payload = JSON.parse(rawBody.toString('utf8'));

  await PaymentService.handleWebhook(rawBody, req.headers as Record<string, string | undefined>, payload);
  sendSuccess(res, null, 'Webhook processed');
});

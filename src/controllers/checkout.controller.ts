import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated } from '../utils/apiResponse';
import { CheckoutService } from '../services/checkout.service';

export const createCheckout = asyncHandler(async (req: Request, res: Response) => {
  // Creates an Order document and initiates a PayPal payment
  const result = await CheckoutService.createCheckout(req.body);
  sendCreated(res, result, 'Order created — proceed to payment');
});

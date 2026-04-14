import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { OrdersService } from '../services/orders.service';

export const trackRepair = asyncHandler(async (req: Request, res: Response) => {
  const tracking = await OrdersService.trackByOrderNumber(req.params.orderNumber);
  sendSuccess(res, tracking, 'Repair status retrieved');
});

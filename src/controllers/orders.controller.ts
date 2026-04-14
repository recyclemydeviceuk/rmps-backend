import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendNoContent } from '../utils/apiResponse';
import { OrdersService } from '../services/orders.service';

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await OrdersService.getOrders(req.query);
  sendSuccess(res, result.data, 'Orders retrieved', 200, result.meta);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrdersService.getOrderById(req.params.id);
  sendSuccess(res, order, 'Order retrieved');
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrdersService.updateOrder(req.params.id, req.body);
  sendSuccess(res, order, 'Order updated');
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await OrdersService.updateOrderStatus(req.params.id, req.body.status);
  sendSuccess(res, order, 'Order status updated');
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  await OrdersService.deleteOrder(req.params.id);
  sendNoContent(res);
});

export const getOrderNotes = asyncHandler(async (req: Request, res: Response) => {
  const notes = await OrdersService.getOrderNotes(req.params.id);
  sendSuccess(res, notes, 'Notes retrieved');
});

export const addOrderNote = asyncHandler(async (req: Request, res: Response) => {
  const notes = await OrdersService.addOrderNote(req.params.id, req.body.text);
  sendSuccess(res, notes, 'Note added');
});

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendNoContent } from '../utils/apiResponse';
import { CustomersService } from '../services/customers.service';

export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const result = await CustomersService.getCustomers(req.query);
  sendSuccess(res, result.data, 'Customers retrieved', 200, result.meta);
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await CustomersService.getCustomerById(req.params.id);
  sendSuccess(res, customer, 'Customer retrieved');
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await CustomersService.updateCustomer(req.params.id, req.body);
  sendSuccess(res, customer, 'Customer updated');
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  await CustomersService.deleteCustomer(req.params.id);
  sendNoContent(res);
});

export const getCustomerOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await CustomersService.getCustomerOrders(req.params.id);
  sendSuccess(res, orders, 'Customer orders retrieved');
});

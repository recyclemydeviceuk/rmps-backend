import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { PricingService } from '../services/pricing.service';

export const getPricing = asyncHandler(async (req: Request, res: Response) => {
  const rules = await PricingService.getAll(req.query);
  sendSuccess(res, rules, 'Pricing rules retrieved');
});

export const getPricingRule = asyncHandler(async (req: Request, res: Response) => {
  const rule = await PricingService.getById(req.params.id);
  sendSuccess(res, rule, 'Pricing rule retrieved');
});

export const getPricingByModel = asyncHandler(async (req: Request, res: Response) => {
  const rules = await PricingService.getByModel(req.params.modelId);
  sendSuccess(res, rules, 'Model pricing retrieved');
});

export const createPricingRule = asyncHandler(async (req: Request, res: Response) => {
  const rule = await PricingService.create(req.body);
  sendCreated(res, rule, 'Pricing rule created');
});

export const updatePricingRule = asyncHandler(async (req: Request, res: Response) => {
  const rule = await PricingService.update(req.params.id, req.body);
  sendSuccess(res, rule, 'Pricing rule updated');
});

export const deletePricingRule = asyncHandler(async (req: Request, res: Response) => {
  await PricingService.delete(req.params.id);
  sendNoContent(res);
});

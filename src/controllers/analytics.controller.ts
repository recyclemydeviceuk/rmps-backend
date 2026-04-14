import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AnalyticsService } from '../services/analytics.service';

export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const data = await AnalyticsService.getFullAnalytics();
  sendSuccess(res, data, 'Analytics retrieved');
});

export const getAnalyticsSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await AnalyticsService.getSummary();
  sendSuccess(res, summary, 'Summary retrieved');
});

export const getRevenueChart = asyncHandler(async (req: Request, res: Response) => {
  const data = await AnalyticsService.getRevenueChart(req.query.period as string);
  sendSuccess(res, data, 'Revenue chart data retrieved');
});

export const getOrdersChart = asyncHandler(async (req: Request, res: Response) => {
  const data = await AnalyticsService.getOrdersChart(req.query.period as string);
  sendSuccess(res, data, 'Orders chart data retrieved');
});

export const getTopRepairs = asyncHandler(async (_req: Request, res: Response) => {
  const data = await AnalyticsService.getTopRepairs();
  sendSuccess(res, data, 'Top repairs retrieved');
});

export const getTopBrands = asyncHandler(async (_req: Request, res: Response) => {
  const data = await AnalyticsService.getTopBrands();
  sendSuccess(res, data, 'Top brands retrieved');
});

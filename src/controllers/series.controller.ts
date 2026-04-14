import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { SeriesService } from '../services/series.service';

export const getAllSeries = asyncHandler(async (req: Request, res: Response) => {
  const series = await SeriesService.getAll(req.query);
  sendSuccess(res, series, 'Series retrieved');
});

export const getSeries = asyncHandler(async (req: Request, res: Response) => {
  const series = await SeriesService.getById(req.params.id);
  sendSuccess(res, series, 'Series retrieved');
});

export const createSeries = asyncHandler(async (req: Request, res: Response) => {
  const series = await SeriesService.create(req.body);
  sendCreated(res, series, 'Series created');
});

export const updateSeries = asyncHandler(async (req: Request, res: Response) => {
  const series = await SeriesService.update(req.params.id, req.body);
  sendSuccess(res, series, 'Series updated');
});

export const deleteSeries = asyncHandler(async (req: Request, res: Response) => {
  await SeriesService.delete(req.params.id);
  sendNoContent(res);
});

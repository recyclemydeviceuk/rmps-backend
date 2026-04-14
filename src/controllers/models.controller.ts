import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { ModelsService } from '../services/models.service';

export const getModels = asyncHandler(async (req: Request, res: Response) => {
  const models = await ModelsService.getAll(req.query);
  sendSuccess(res, models, 'Models retrieved');
});

export const getModel = asyncHandler(async (req: Request, res: Response) => {
  const model = await ModelsService.getById(req.params.id);
  sendSuccess(res, model, 'Model retrieved');
});

export const createModel = asyncHandler(async (req: Request, res: Response) => {
  const model = await ModelsService.create(req.body);
  sendCreated(res, model, 'Model created');
});

export const updateModel = asyncHandler(async (req: Request, res: Response) => {
  const model = await ModelsService.update(req.params.id, req.body);
  sendSuccess(res, model, 'Model updated');
});

export const deleteModel = asyncHandler(async (req: Request, res: Response) => {
  await ModelsService.delete(req.params.id);
  sendNoContent(res);
});

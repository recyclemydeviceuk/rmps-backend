import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { RepairTypesService } from '../services/repairTypes.service';

export const getRepairTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await RepairTypesService.getAll();
  sendSuccess(res, types, 'Repair types retrieved');
});

export const getRepairType = asyncHandler(async (req: Request, res: Response) => {
  const type = await RepairTypesService.getById(req.params.id);
  sendSuccess(res, type, 'Repair type retrieved');
});

export const createRepairType = asyncHandler(async (req: Request, res: Response) => {
  const type = await RepairTypesService.create(req.body);
  sendCreated(res, type, 'Repair type created');
});

export const updateRepairType = asyncHandler(async (req: Request, res: Response) => {
  const type = await RepairTypesService.update(req.params.id, req.body);
  sendSuccess(res, type, 'Repair type updated');
});

export const deleteRepairType = asyncHandler(async (req: Request, res: Response) => {
  await RepairTypesService.delete(req.params.id);
  sendNoContent(res);
});

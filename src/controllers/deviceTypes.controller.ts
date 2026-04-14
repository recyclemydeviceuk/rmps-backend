import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { DeviceTypesService } from '../services/deviceTypes.service';

export const getDeviceTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await DeviceTypesService.getAll();
  sendSuccess(res, types, 'Device types retrieved');
});

export const getDeviceType = asyncHandler(async (req: Request, res: Response) => {
  const type = await DeviceTypesService.getById(req.params.id);
  sendSuccess(res, type, 'Device type retrieved');
});

export const createDeviceType = asyncHandler(async (req: Request, res: Response) => {
  const type = await DeviceTypesService.create(req.body);
  sendCreated(res, type, 'Device type created');
});

export const updateDeviceType = asyncHandler(async (req: Request, res: Response) => {
  const type = await DeviceTypesService.update(req.params.id, req.body);
  sendSuccess(res, type, 'Device type updated');
});

export const deleteDeviceType = asyncHandler(async (req: Request, res: Response) => {
  await DeviceTypesService.delete(req.params.id);
  sendNoContent(res);
});

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { AddonsService } from '../services/addons.service';

export const getAddons = asyncHandler(async (req: Request, res: Response) => {
  const addons = await AddonsService.getAll(req.query);
  sendSuccess(res, addons, 'Add-ons retrieved');
});

export const getAddon = asyncHandler(async (req: Request, res: Response) => {
  const addon = await AddonsService.getById(req.params.id);
  sendSuccess(res, addon, 'Add-on retrieved');
});

export const createAddon = asyncHandler(async (req: Request, res: Response) => {
  const addon = await AddonsService.create(req.body);
  sendCreated(res, addon, 'Add-on created');
});

export const updateAddon = asyncHandler(async (req: Request, res: Response) => {
  const addon = await AddonsService.update(req.params.id, req.body);
  sendSuccess(res, addon, 'Add-on updated');
});

export const deleteAddon = asyncHandler(async (req: Request, res: Response) => {
  await AddonsService.delete(req.params.id);
  sendNoContent(res);
});

export const reorderAddons = asyncHandler(async (req: Request, res: Response) => {
  await AddonsService.reorder(req.body.ids);
  sendSuccess(res, null, 'Add-ons reordered');
});

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { SettingsService } from '../services/settings.service';

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await SettingsService.getSettings();
  sendSuccess(res, settings, 'Settings retrieved');
});

export const updateGeneralSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsService.updateGeneral(req.body);
  sendSuccess(res, settings, 'General settings updated');
});

export const updateOperationsSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsService.updateOperations(req.body);
  sendSuccess(res, settings, 'Operations settings updated');
});

export const updateNotificationsSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsService.updateNotifications(req.body);
  sendSuccess(res, settings, 'Notification settings updated');
});

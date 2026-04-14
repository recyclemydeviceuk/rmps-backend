import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendNoContent } from '../utils/apiResponse';
import { NotificationService } from '../services/notification.service';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const page  = parseInt(req.query.page  as string) || 1;
  const limit = parseInt(req.query.limit as string) || 30;
  const result = await NotificationService.getAll(page, limit);
  sendSuccess(res, result, 'Notifications retrieved');
});

export const markOneRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await NotificationService.markRead(req.params.id);
  sendSuccess(res, notification, 'Marked as read');
});

export const markAllRead = asyncHandler(async (_req: Request, res: Response) => {
  await NotificationService.markAllRead();
  sendSuccess(res, null, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  await NotificationService.delete(req.params.id);
  sendNoContent(res);
});

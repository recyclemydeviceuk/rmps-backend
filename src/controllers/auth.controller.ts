import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AuthService } from '../services/auth.service';

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.sendOtp(req.body);
  // Always respond with 200 — don't reveal whether the email exists
  sendSuccess(res, null, 'If that email is registered, a one-time code has been sent.');
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.verifyOtp(req.body);
  sendSuccess(res, result, 'Login successful');
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, null, 'Logged out successfully');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const admin = await AuthService.getProfile(req.admin!.adminId);
  sendSuccess(res, admin, 'Profile retrieved');
});

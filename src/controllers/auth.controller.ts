import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AuthService } from '../services/auth.service';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  sendSuccess(res, result, 'Login successful');
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // JWT is stateless; client discards the token
  sendSuccess(res, null, 'Logged out successfully');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const admin = await AuthService.getProfile(req.admin!.adminId);
  sendSuccess(res, admin, 'Profile retrieved');
});

import { Request, Response, NextFunction } from 'express';

/**
 * Confirms the request has a valid authenticated admin session.
 * There is only one role: super-admin. All authenticated admins have full access.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.admin) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  next();
}

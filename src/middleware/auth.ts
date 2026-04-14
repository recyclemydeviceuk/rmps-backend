import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthPayload {
  adminId: string;
  email:   string;
}

// Extend Express Request to carry the decoded token
declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

/**
 * Verify the JWT in the Authorization header.
 * Attaches decoded payload to req.admin.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

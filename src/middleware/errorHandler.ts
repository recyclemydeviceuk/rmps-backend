import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error(err.message, { stack: err.stack });

  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors:  err.flatten().fieldErrors,
    });
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ success: false, message: `Invalid ID: ${err.value}` });
    return;
  }

  // Mongoose duplicate key
  if ((err as NodeJS.ErrnoException).code === '11000') {
    res.status(409).json({ success: false, message: 'Duplicate value — already exists' });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired' });
    return;
  }

  // Generic
  const status = (err as { statusCode?: number }).statusCode ?? 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error' : err.message,
  });
}

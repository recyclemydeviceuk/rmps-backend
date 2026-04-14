import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  errors?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse['meta'],
): Response {
  return res.status(statusCode).json({ success: true, message, data, ...(meta && { meta }) });
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendError(
  res: Response,
  message = 'Internal server error',
  statusCode = 500,
  errors?: unknown,
): Response {
  return res.status(statusCode).json({ success: false, message, ...(errors != null ? { errors } : {}) });
}

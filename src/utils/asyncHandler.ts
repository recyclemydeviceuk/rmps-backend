import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler and forwards any errors to Express's next()
 * so the global error handler can process them.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

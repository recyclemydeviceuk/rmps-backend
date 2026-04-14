import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validate req.body against a Zod schema.
 * Sends 400 with field errors on failure.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors:  result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

/**
 * Validate req.query against a Zod schema.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors:  result.error.flatten().fieldErrors,
      });
      return;
    }
    req.query = result.data as typeof req.query;
    next();
  };
}

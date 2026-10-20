import type { Request } from 'express';
import { ApiError } from './apiError.js';

// Reads a required route parameter. Express types params as string | undefined under strict settings.
export function routeParam(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new ApiError(400, 'INVALID_REQUEST', 'A required identifier is missing.');
  }
  return value;
}

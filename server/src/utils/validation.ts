import { z } from 'zod';
import { ApiError, type FieldError } from './apiError.js';

export function toFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.map(String).join('.') || 'form',
    message: issue.message,
  }));
}

// Parses untrusted input and converts failures into a 400 response with per-field messages.
export function parse<T extends z.ZodType>(schema: T, input: unknown): z.output<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the highlighted fields.', toFieldErrors(result.error));
  }
  return result.data;
}

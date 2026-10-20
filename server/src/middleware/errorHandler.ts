import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

// Consistent error shape for every API response: { error: { code, message, fields? } }.
export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'This endpoint does not exist.' } });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      error: { code: error.code, message: error.message, ...(error.fields && { fields: error.fields }) },
    });
    return;
  }

  // Unique-constraint and missing-record errors from Prisma become clear client errors.
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: { code: 'DUPLICATE', message: 'A record with the same unique value already exists.' } });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The requested record was not found.' } });
      return;
    }
  }

  // Malformed JSON and oversized bodies come from express.json().
  const type = (error as { type?: string } | undefined)?.type;
  if (type === 'entity.parse.failed') {
    res.status(400).json({ error: { code: 'INVALID_JSON', message: 'The request body is not valid JSON.' } });
    return;
  }
  if (type === 'entity.too.large') {
    res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request is too large.' } });
    return;
  }

  // Never leak internals. Log only the route and error name.
  logger.error('unhandled_error', {
    method: req.method,
    path: req.path,
    errorName: error instanceof Error ? error.name : 'UnknownError',
  });
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong on our side. Please try again shortly.' },
  });
};

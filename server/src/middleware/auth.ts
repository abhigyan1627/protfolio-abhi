import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { env } from '../config/env.js';
import { ADMIN_SESSION_COOKIE, CSRF_HEADER } from '../config/constants.js';
import type { AdminRole } from '../generated/prisma/client.js';
import { resolveSession, type AdminSessionContext } from '../services/authService.js';
import { ApiError } from '../utils/apiError.js';
import { safeEqual } from '../utils/crypto.js';

export const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function getAdminContext(res: Response): AdminSessionContext {
  const context = res.locals['admin'] as AdminSessionContext | undefined;
  if (!context) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Please sign in to continue.');
  }
  return context;
}

// Loads the admin session from the HTTP-only cookie. Every protected admin route must run this first.
export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (typeof token !== 'string' || token.length === 0) {
      throw new ApiError(401, 'UNAUTHENTICATED', 'Please sign in to continue.');
    }

    const context = await resolveSession(token);
    if (!context) {
      throw new ApiError(401, 'UNAUTHENTICATED', 'Your session has expired. Please sign in again.');
    }

    res.locals['admin'] = context;
    next();
  } catch (error) {
    next(error);
  }
};

export function requireRole(...allowed: AdminRole[]): RequestHandler {
  return (_req, res, next) => {
    try {
      const { principal } = getAdminContext(res);
      if (!allowed.includes(principal.role)) {
        throw new ApiError(403, 'FORBIDDEN', 'Your account does not have permission for this action.');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Rejects state-changing requests whose Origin header is not on the allowlist (defence in depth alongside SameSite).
export const requireAllowedOrigin: RequestHandler = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin');
  if (origin && !env.allowedOrigins.includes(origin.replace(/\/$/, ''))) {
    return next(new ApiError(403, 'ORIGIN_NOT_ALLOWED', 'This request came from an origin that is not allowed.'));
  }
  next();
};

// Synchronizer token: the header must match the token issued with the session.
export const requireCsrf: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (SAFE_METHODS.has(req.method)) return next();

  try {
    const { csrfToken } = getAdminContext(res);
    const provided = req.get(CSRF_HEADER);
    if (!provided || !safeEqual(provided, csrfToken)) {
      throw new ApiError(403, 'CSRF_INVALID', 'Your session security token is missing or outdated. Refresh and try again.');
    }
    next();
  } catch (error) {
    next(error);
  }
};

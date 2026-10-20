import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

const MINUTE = 60 * 1000;

interface LimitOptions {
  windowMs: number;
  limit: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}

function buildLimiter({ windowMs, limit, message, skipSuccessfulRequests = false }: LimitOptions) {
  return rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({ error: { code: 'RATE_LIMITED', message } });
    },
  });
}

export interface RateLimitSettings {
  // Failed sign-in attempts allowed per 15 minutes per IP address.
  loginFailures?: number;
  // Enquiry submissions allowed per window per IP address.
  enquiries?: number;
  enquiryWindowMs?: number;
}

export function createRateLimiters(settings: RateLimitSettings = {}) {
  return {
    api: buildLimiter({
      windowMs: 15 * MINUTE,
      limit: 300,
      message: 'Too many requests. Please wait a few minutes and try again.',
    }),
    login: buildLimiter({
      windowMs: 15 * MINUTE,
      limit: settings.loginFailures ?? 10,
      skipSuccessfulRequests: true,
      message: 'Too many sign-in attempts. Please wait 15 minutes before trying again.',
    }),
    enquiry: buildLimiter({
      windowMs: settings.enquiryWindowMs ?? 60 * MINUTE,
      limit: settings.enquiries ?? 10,
      message: 'You have sent several enquiries recently. Please wait a while or contact us on WhatsApp.',
    }),
  };
}

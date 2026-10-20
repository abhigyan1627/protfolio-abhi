import { Router } from 'express';
import type { createRateLimiters } from '../middleware/rateLimit.js';
import { createAdminRouter } from './adminRoutes.js';
import { createPublicRouter } from './publicRoutes.js';

export type RateLimiters = ReturnType<typeof createRateLimiters>;

export function createApiRouter(limiters: RateLimiters): Router {
  const router = Router();
  router.use(createPublicRouter(limiters));
  router.use('/admin', createAdminRouter(limiters));
  return router;
}

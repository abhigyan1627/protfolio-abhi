import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createRateLimiters, type RateLimitSettings } from './middleware/rateLimit.js';
import { createApiRouter } from './routes/index.js';
import { logger } from './utils/logger.js';

export function createApp(settings: RateLimitSettings = {}) {
  const app = express();

  app.disable('x-powered-by');
  // Render and other hosts sit behind a proxy. This lets rate limits and secure cookies see the real client.
  app.set('trust proxy', env.TRUST_PROXY_HOPS);

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || env.allowedOrigins.includes(origin)),
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on('finish', () => {
      if (req.path.startsWith('/api')) {
        logger.info('request', {
          method: req.method,
          path: req.path,
          status: res.statusCode,
          durationMs: Date.now() - startedAt,
        });
      }
    });
    next();
  });

  const limiters = createRateLimiters(settings);
  app.use('/api', limiters.api);
  app.use('/api', createApiRouter(limiters));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

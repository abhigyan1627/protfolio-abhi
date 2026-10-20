import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info('server_started', { port: env.PORT, environment: env.NODE_ENV });
});

function shutdown(signal: NodeJS.Signals) {
  logger.info('server_shutdown', { signal });
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  // Force exit if open connections do not close in time.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

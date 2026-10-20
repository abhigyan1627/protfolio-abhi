import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Prisma CLI configuration. Run all `prisma` commands from the server/ directory.
export default defineConfig({
  schema: '../prisma/schema.prisma',
  migrations: {
    path: '../prisma/migrations',
    seed: 'tsx src/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});

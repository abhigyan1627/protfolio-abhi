import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from './env.js';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// Prisma's built-in logging can echo query arguments, which contain personal data. Application logs are used instead.
export const prisma = new PrismaClient({ adapter, log: [] });

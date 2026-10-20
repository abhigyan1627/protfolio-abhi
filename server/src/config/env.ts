import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
    SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters long.'),
    CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
    COOKIE_SAME_SITE: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.enum(['lax', 'strict', 'none']).optional(),
    ),
    SESSION_TTL_HOURS: z.coerce.number().min(1).max(72).default(8),
    TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(1),
    // Initial business details, used only when the site settings row is first created.
    BUSINESS_NAME: z.string().trim().min(3).default('CA Mohit Agrawal'),
    BUSINESS_PHONE: z.string().trim().min(8).default('+91 62990 33454'),
    BUSINESS_WHATSAPP_NUMBER: z.string().trim().regex(/^[1-9]\d{7,14}$/).default('916299033454'),
    BUSINESS_EMAIL: z.string().trim().default(''),
    BUSINESS_ADDRESS: z.string().trim().min(10).default('Muskan, Kedia Lane, Town Thana, Gopalganj, Bihar 841428, India'),
    BUSINESS_PLUS_CODE: z.string().trim().default('FC7V+QC, Gopalganj'),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV === 'production' && value.SESSION_SECRET.startsWith('replace-with')) {
      ctx.addIssue({
        code: 'custom',
        path: ['SESSION_SECRET'],
        message: 'Replace the example SESSION_SECRET before running in production.',
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
  throw new Error(`Invalid server environment configuration:\n${details}`);
}

const values = parsed.data;
const isProduction = values.NODE_ENV === 'production';

export const env = {
  ...values,
  isProduction,
  allowedOrigins: values.CLIENT_ORIGIN.split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
  // Production defaults to SameSite=None so the admin cookie works when the frontend and API are on different domains.
  cookieSameSite: values.COOKIE_SAME_SITE ?? (isProduction ? 'none' : 'lax'),
};

// SameSite=None cookies must be Secure. Production is always Secure.
export const adminCookieSecure = isProduction || env.cookieSameSite === 'none';

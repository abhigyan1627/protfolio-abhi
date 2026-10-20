import { z } from 'zod';
import { AUDIENCES, BILLING_FREQUENCIES, SERVICE_CATEGORIES, SERVICE_ICON_KEYS } from '../config/constants.js';
import { slugSchema } from './common.js';

const lines = (max: number, itemMax = 240) => z.array(z.string().trim().min(1).max(itemMax)).max(max);

export const serviceDetailsSchema = z.object({
  overview: z.string().trim().min(20, 'Add a short overview (at least 20 characters).').max(4000),
  whoMayNeed: lines(12),
  documents: lines(30),
  deliverables: lines(20),
  exclusions: lines(20),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(5).max(200),
        answer: z.string().trim().min(5).max(1200),
      }),
    )
    .max(12),
});

export const serviceCreateSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: slugSchema.optional(),
  category: z.enum(SERVICE_CATEGORIES),
  description: z.string().trim().min(10).max(280),
  iconKey: z.enum(SERVICE_ICON_KEYS),
  details: serviceDetailsSchema,
  enabled: z.boolean(),
  published: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.number().int().min(0).max(9999),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const planCreateSchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: slugSchema.optional(),
  audience: z.enum(AUDIENCES),
  serviceCategory: z.enum(SERVICE_CATEGORIES),
  description: z.string().trim().min(10).max(400),
  // Null means "Contact for Quotation". Stored in paise (1 INR = 100 paise).
  priceInPaise: z.number().int().min(0).max(1_000_000_000).nullable(),
  currency: z.literal('INR'),
  billingFrequency: z.enum(BILLING_FREQUENCIES),
  additionalCharges: z
    .string()
    .trim()
    .max(600)
    .nullish()
    .transform((value) => (value ? value : null)),
  targetCustomer: z.string().trim().min(5).max(300),
  inclusions: lines(20),
  exclusions: lines(20),
  published: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.number().int().min(0).max(9999),
});

export const planUpdateSchema = planCreateSchema.partial();

export const servicesQuerySchema = z.object({
  category: z.enum(SERVICE_CATEGORIES).optional(),
});

export const plansQuerySchema = z.object({
  audience: z.enum(AUDIENCES).optional(),
  serviceCategory: z.enum(SERVICE_CATEGORIES).optional(),
});

import { z } from 'zod';
import { FAQ_SCOPES } from '../config/constants.js';
import { nullableText, nullableUrl, slugSchema } from './common.js';

export const resourceCreateSchema = z.object({
  title: z.string().trim().min(5).max(160),
  slug: slugSchema.optional(),
  category: z.string().trim().min(2).max(60),
  excerpt: z.string().trim().min(20).max(300),
  body: z.string().trim().min(40).max(30000),
  published: z.boolean(),
});

export const resourceUpdateSchema = resourceCreateSchema.partial();

export const faqCreateSchema = z.object({
  question: z.string().trim().min(5).max(240),
  answer: z.string().trim().min(5).max(2000),
  scope: z.enum(FAQ_SCOPES),
  published: z.boolean(),
  displayOrder: z.number().int().min(0).max(9999),
});

export const faqUpdateSchema = faqCreateSchema.partial();

export const faqsQuerySchema = z.object({
  scope: z.enum(FAQ_SCOPES).optional(),
});

export const settingsUpdateSchema = z
  .object({
    businessName: z.string().trim().min(3).max(120),
    profession: z.string().trim().min(3).max(120),
    hindiName: nullableText(2, 120),
    hindiNameApproved: z.boolean(),
    phone: z.string().trim().min(8).max(25),
    whatsappNumber: z
      .string()
      .trim()
      .regex(/^[1-9]\d{7,14}$/, 'Enter digits only in international format, for example 916299033454.'),
    email: z.email({ error: 'Enter a valid email address.' }).max(120).nullable(),
    address: z.string().trim().min(10).max(400),
    plusCode: nullableText(2, 60),
    businessHours: nullableText(2, 300),
    websiteUrl: nullableUrl,
    googleBusinessUrl: nullableUrl,
    googleMapsUrl: nullableUrl,
    mapEmbedUrl: nullableUrl,
    googleRating: z.number().min(0).max(5).nullable(),
    googleReviewCount: z.number().int().min(0).max(1_000_000).nullable(),
    showGoogleRating: z.boolean(),
  })
  .partial();

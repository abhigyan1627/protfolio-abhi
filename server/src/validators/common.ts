import { z } from 'zod';

export const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid identifier.');

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens only.');

// Converts empty strings from HTML forms into null, so optional fields can be cleared.
export const nullableText = (min: number, max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? null : value),
    z.string().trim().min(min).max(max).nullable(),
  );

export const nullableUrl = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? null : value),
  z.url({ error: 'Enter a full URL starting with https://' }).max(500).nullable(),
);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const booleanQuery = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

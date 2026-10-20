import { z } from 'zod';
import { CONTACT_METHODS, ENQUIRY_STATUSES } from '../config/constants.js';
import { paginationSchema } from './common.js';
import { normalizePhone } from '../utils/phone.js';

const emptyToUndefined = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max).optional(),
  );

const emailSchema = z.email({ error: 'Enter a valid email address.' }).max(120);

// Format checks live on the fields so every invalid field is reported in one response.
const phoneField = emptyToUndefined(20).refine((value) => value === undefined || normalizePhone(value) !== null, {
  error: 'Enter a valid Indian mobile number, or an international number starting with +.',
});

const emailField = emptyToUndefined(120).refine((value) => value === undefined || emailSchema.safeParse(value).success, {
  error: 'Enter a valid email address.',
});

export const enquiryInputSchema = z
  .object({
    name: z
      .string({ error: 'Please enter your name.' })
      .trim()
      .min(2, 'Please enter your name.')
      .max(80, 'Name must be 80 characters or fewer.'),
    contactMethod: z.enum(CONTACT_METHODS, { error: 'Choose how we should contact you.' }),
    phone: phoneField,
    email: emailField,
    serviceId: emptyToUndefined(60),
    planId: emptyToUndefined(60),
    message: emptyToUndefined(1000),
    consent: z.literal(true, { error: 'Please confirm that you have read the privacy notice.' }),
    // Honeypot: real visitors never see or fill this field.
    website: z.string().max(200).optional(),
    // Milliseconds between the form loading and submitting. Very fast submissions are treated as bots.
    formElapsedMs: z.number().int().min(0).max(24 * 60 * 60 * 1000).optional(),
  })
  // Required-ness depends on the chosen contact method, so it is checked once the fields themselves are valid.
  .superRefine((data, ctx) => {
    if (data.contactMethod === 'EMAIL' && !data.email) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'Enter an email address so we can reply.' });
    }

    if (data.contactMethod !== 'EMAIL' && !data.phone) {
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Enter a phone number so we can reach you on WhatsApp or by call.',
      });
    }
  });

export type EnquiryInput = z.output<typeof enquiryInputSchema>;

export const enquiryStatusUpdateSchema = z
  .object({
    status: z.enum(ENQUIRY_STATUSES).optional(),
    internalNote: z.string().trim().max(2000).nullable().optional(),
  })
  .refine((value) => value.status !== undefined || value.internalNote !== undefined, {
    message: 'Provide a status or an internal note to update.',
  });

export const enquiryListQuerySchema = paginationSchema.extend({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  q: z.string().trim().max(80).optional(),
});

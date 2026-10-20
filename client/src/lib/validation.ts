import { z } from 'zod';

// Mirrors the server rules for the public enquiry form. The server remains authoritative.
export function normalizePhoneInput(raw: string): string | null {
  const compact = raw.replace(/[\s\-().]/g, '');
  if (/^[6-9]\d{9}$/.test(compact)) return `+91${compact}`;
  if (/^0[6-9]\d{9}$/.test(compact)) return `+91${compact.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(compact)) return `+${compact}`;
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;
  return null;
}

const emailField = z
  .string()
  .trim()
  .max(120, 'Keep the email address under 120 characters.')
  .refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email address.');

const phoneField = z
  .string()
  .trim()
  .max(20, 'Keep the phone number under 20 characters.')
  .refine(
    (value) => value === '' || normalizePhoneInput(value) !== null,
    'Enter a valid Indian mobile number, or an international number starting with +.',
  );

export const enquiryFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Please enter your name.')
      .max(80, 'Name must be 80 characters or fewer.'),
    contactMethod: z.enum(['PHONE', 'WHATSAPP', 'EMAIL'], { error: 'Choose how we should contact you.' }),
    phone: phoneField,
    email: emailField,
    serviceId: z.string().optional(),
    planId: z.string().optional(),
    message: z.string().trim().max(1000, 'Keep your message under 1,000 characters.'),
    consent: z.boolean().refine((value) => value, 'Please confirm that you have read the privacy notice.'),
    website: z.string().optional(),
    formElapsedMs: z.number().int().nonnegative().optional(),
  })
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

export type EnquiryFormValues = z.input<typeof enquiryFormSchema>;

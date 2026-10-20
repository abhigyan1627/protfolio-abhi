import type { RequestHandler } from 'express';
import { createEnquiry } from '../services/enquiryService.js';
import { ApiError } from '../utils/apiError.js';
import { normalizePhone } from '../utils/phone.js';
import { logger } from '../utils/logger.js';
import { parse } from '../utils/validation.js';
import { enquiryInputSchema } from '../validators/enquiry.js';

const MIN_HUMAN_FORM_TIME_MS = 1000;
const SPAM_MESSAGE = 'We could not process this enquiry. Please call or WhatsApp us directly.';

export const createPublicEnquiry: RequestHandler = async (req, res) => {
  const input = parse(enquiryInputSchema, req.body);

  if (input.website) {
    logger.warn('enquiry_rejected', { reason: 'honeypot' });
    throw new ApiError(400, 'SPAM_SUSPECTED', SPAM_MESSAGE);
  }

  if (input.formElapsedMs !== undefined && input.formElapsedMs < MIN_HUMAN_FORM_TIME_MS) {
    logger.warn('enquiry_rejected', { reason: 'too_fast' });
    throw new ApiError(400, 'SPAM_SUSPECTED', SPAM_MESSAGE);
  }

  const phone = input.phone ? normalizePhone(input.phone) : null;
  // createEnquiry resolves only after the row is committed, so this response is a real confirmation.
  const stored = await createEnquiry(input, phone);

  logger.info('enquiry_created', { referenceCode: stored.referenceCode, contactMethod: input.contactMethod });

  res.status(201).json({
    referenceCode: stored.referenceCode,
    message:
      'Thank you. Your enquiry has been received. We will contact you using the method you selected.',
  });
};

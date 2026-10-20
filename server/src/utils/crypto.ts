import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

export const createSessionToken = (bytes = 32): string => randomBytes(bytes).toString('base64url');

// Sessions are stored by a keyed hash of the token, so a leaked database row cannot be replayed as a cookie.
export const hashSessionToken = (token: string): string =>
  createHmac('sha256', env.SESSION_SECRET).update(token).digest('base64url');

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

// No 0/O/1/I so codes can be read aloud or typed from a phone screen.
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function createReferenceCode(date: Date = new Date()): string {
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += REFERENCE_ALPHABET.charAt(randomInt(REFERENCE_ALPHABET.length));
  }
  return `CMA-${yy}${mm}-${suffix}`;
}

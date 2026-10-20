import type { CookieOptions } from 'express';
import { adminCookieSecure, env } from '../config/env.js';

// Path is limited to the API so the session cookie is never sent with other requests.
export function adminSessionCookieOptions(expires?: Date): CookieOptions {
  return {
    httpOnly: true,
    secure: adminCookieSecure,
    sameSite: env.cookieSameSite,
    path: '/api',
    ...(expires && { expires }),
  };
}

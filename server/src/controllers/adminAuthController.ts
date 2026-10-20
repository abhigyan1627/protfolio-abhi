import type { RequestHandler } from 'express';
import { ADMIN_SESSION_COOKIE } from '../config/constants.js';
import { authenticate, createSession, destroySession } from '../services/authService.js';
import { getAdminContext } from '../middleware/auth.js';
import { adminSessionCookieOptions } from '../utils/cookies.js';
import { logger } from '../utils/logger.js';
import { parse } from '../utils/validation.js';
import { loginSchema } from '../validators/auth.js';

export const login: RequestHandler = async (req, res) => {
  const input = parse(loginSchema, req.body);
  const principal = await authenticate(input.email, input.password);
  const session = await createSession(principal);

  res.cookie(ADMIN_SESSION_COOKIE, session.token, adminSessionCookieOptions(session.expiresAt));
  logger.info('admin_login', { role: principal.role });
  res.json({ user: principal, csrfToken: session.csrfToken, expiresAt: session.expiresAt });
};

export const logout: RequestHandler = async (req, res) => {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (typeof token === 'string') {
    await destroySession(token);
  }
  res.clearCookie(ADMIN_SESSION_COOKIE, adminSessionCookieOptions());
  res.status(204).end();
};

export const currentAdmin: RequestHandler = (_req, res) => {
  const { principal, csrfToken } = getAdminContext(res);
  res.json({ user: principal, csrfToken });
};

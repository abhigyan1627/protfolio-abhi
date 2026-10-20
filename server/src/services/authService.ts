import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import type { AdminRole } from '../generated/prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { createSessionToken, hashSessionToken } from '../utils/crypto.js';

const BCRYPT_COST = 12;
const MIN_PASSWORD_LENGTH = 12;

export interface AdminPrincipal {
  id: string;
  email: string;
  role: AdminRole;
}

export interface AdminSessionContext {
  principal: AdminPrincipal;
  csrfToken: string;
}

let placeholderHash: string | undefined;
// Compare against a real bcrypt hash when the email is unknown, so response timing does not reveal valid accounts.
const getPlaceholderHash = () => (placeholderHash ??= bcrypt.hashSync('placeholder-password-for-timing', BCRYPT_COST));

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export async function createAdminUser(input: { email: string; password: string; role: AdminRole }) {
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    throw new ApiError(400, 'WEAK_PASSWORD', `Use at least ${MIN_PASSWORD_LENGTH} characters for the admin password.`);
  }
  return prisma.adminUser.create({
    data: {
      email: input.email.trim().toLowerCase(),
      passwordHash: await hashPassword(input.password),
      role: input.role,
    },
    select: { id: true, email: true, role: true },
  });
}

export async function authenticate(email: string, password: string): Promise<AdminPrincipal> {
  const user = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
  const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? getPlaceholderHash());

  if (!user || !passwordMatches) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'The email or password is incorrect.');
  }

  return { id: user.id, email: user.email, role: user.role };
}

export async function createSession(principal: AdminPrincipal) {
  const token = createSessionToken();
  const csrfToken = createSessionToken(24);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    prisma.adminSession.create({
      data: { id: hashSessionToken(token), adminUserId: principal.id, csrfToken, expiresAt },
    }),
    prisma.adminUser.update({ where: { id: principal.id }, data: { lastLoginAt: new Date() } }),
  ]);

  return { token, csrfToken, expiresAt };
}

export async function resolveSession(token: string): Promise<AdminSessionContext | null> {
  const session = await prisma.adminSession.findUnique({
    where: { id: hashSessionToken(token) },
    include: { adminUser: true },
  });

  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.adminSession.deleteMany({ where: { id: session.id } });
    return null;
  }

  return {
    principal: { id: session.adminUser.id, email: session.adminUser.email, role: session.adminUser.role },
    csrfToken: session.csrfToken,
  };
}

export async function destroySession(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { id: hashSessionToken(token) } });
}

// One-time command to create the first admin account. There is no public registration endpoint.
// Usage (from server/):  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='long-passphrase' npm run admin:create
// Remove ADMIN_PASSWORD from your shell or environment after the account is created.
import { prisma } from '../config/prisma.js';
import { ADMIN_ROLES } from '../config/constants.js';
import { createAdminUser } from '../services/authService.js';

type Role = (typeof ADMIN_ROLES)[number];

async function main() {
  const email = process.env['ADMIN_EMAIL']?.trim().toLowerCase();
  const password = process.env['ADMIN_PASSWORD'];
  const roleInput = (process.env['ADMIN_ROLE'] ?? 'OWNER').toUpperCase();

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before running this command.');
  }
  if (!(ADMIN_ROLES as readonly string[]).includes(roleInput)) {
    throw new Error(`ADMIN_ROLE must be one of: ${ADMIN_ROLES.join(', ')}.`);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    console.log(`An admin account already exists for ${email}. No changes were made.`);
    return;
  }

  const created = await createAdminUser({ email, password, role: roleInput as Role });
  console.log(`Created ${created.role} account for ${created.email}. Remove ADMIN_PASSWORD from your environment now.`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Could not create the admin account.');
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

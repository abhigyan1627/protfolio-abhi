// Runs the backend test suite against a dedicated test database.
// Migrations are applied with `migrate deploy` (non-destructive). Each test file clears its own rows.
import { spawnSync } from 'node:child_process';

const databaseUrl =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/ca_mohit_agrawal_test?schema=public';

const databaseName = new URL(databaseUrl.replace(/^postgres(ql)?:/, 'http:')).pathname.replace('/', '');
if (!databaseName.endsWith('_test')) {
  console.error(`Refusing to run tests against "${databaseName}". The test database name must end with "_test".`);
  process.exit(1);
}

const env = {
  ...process.env,
  NODE_ENV: 'test',
  DATABASE_URL: databaseUrl,
  SESSION_SECRET: process.env.TEST_SESSION_SECRET ?? 'test-only-session-secret-with-more-than-32-chars',
};

const run = (command, args) => spawnSync(command, args, { stdio: 'inherit', env, shell: process.platform === 'win32' });

const migrate = run('npx', ['prisma', 'migrate', 'deploy']);
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

const tests = run(process.execPath, ['--import', 'tsx', '--test', '--test-concurrency=1', 'test/api.test.ts']);
process.exit(tests.status ?? 1);

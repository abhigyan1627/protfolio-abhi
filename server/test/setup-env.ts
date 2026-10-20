// Must be the first import in every test file so configuration is set before the app loads.
const databaseUrl = process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/ca_mohit_agrawal_test?schema=public';

// Safety net: tests delete rows, so they must never run against a non-test database.
if (!/\/[^/?]*_test(\?|$)/.test(databaseUrl)) {
  throw new Error('Tests must run against a database whose name ends in _test.');
}

process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = databaseUrl;
process.env['SESSION_SECRET'] ??= 'test-only-session-secret-with-more-than-32-chars';
process.env['CLIENT_ORIGIN'] = 'http://localhost:5173';

import './setup-env.js';
import { after, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';
import { ADMIN_SESSION_COOKIE } from '../src/config/constants.js';
import { clearDatabase, createAdmins, PASSWORD, seedFixtures } from './helpers.js';

const app = createApp({ enquiries: 500, loginFailures: 100 });

const validEnquiry = {
  name: 'Test Visitor',
  contactMethod: 'WHATSAPP',
  phone: '62990 33454',
  message: 'Please share the process.',
  consent: true,
};

async function signIn(email: string, password = PASSWORD) {
  const agent = request.agent(app);
  const response = await agent.post('/api/admin/auth/login').send({ email, password });
  return { agent, response, csrf: response.body.csrfToken as string };
}

describe('public catalogue', () => {
  beforeEach(async () => {
    await clearDatabase();
    await seedFixtures();
  });

  after(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  it('reports database connectivity from the health endpoint', async () => {
    const response = await request(app).get('/api/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.database, 'up');
  });

  it('lists only services that are both enabled and published', async () => {
    const response = await request(app).get('/api/services');
    const slugs = response.body.items.map((item: { slug: string }) => item.slug);
    assert.deepEqual(slugs, ['test-published-service']);
  });

  it('returns 404 for a service that is not published', async () => {
    const response = await request(app).get('/api/services/test-hidden-service');
    assert.equal(response.status, 404);
    assert.equal(response.body.error.code, 'NOT_FOUND');
  });

  it('lists only published plans', async () => {
    const response = await request(app).get('/api/plans');
    const slugs = response.body.items.map((item: { slug: string }) => item.slug);
    assert.deepEqual(slugs, ['test-plan-published']);
  });

  it('returns prices as integer paise', async () => {
    const response = await request(app).get('/api/plans/test-plan-published');
    assert.equal(response.body.priceInPaise, 150000);
    assert.equal(response.body.currency, 'INR');
  });

  it('hides the Google rating and unapproved Hindi branding from public settings', async () => {
    const response = await request(app).get('/api/site-settings/public');
    assert.equal(response.status, 200);
    assert.equal(response.body.googleRating, null);
    assert.equal(response.body.googleReviewCount, null);
    assert.equal(response.body.hindiName, null);
    assert.equal(response.body.whatsappNumber, '916299033454');
    assert.equal(Object.hasOwn(response.body, 'updatedAt'), false);
  });

  it('shows the Google rating only after the owner enables it', async () => {
    await prisma.siteSettings.update({ where: { id: 'singleton' }, data: { showGoogleRating: true } });
    const response = await request(app).get('/api/site-settings/public');
    assert.equal(response.body.googleRating, 4.9);
    assert.equal(response.body.googleReviewCount, 58);
    assert.ok(response.body.googleRatingNote);
  });

  it('excludes unpublished FAQs and draft resources', async () => {
    const faqs = await request(app).get('/api/faqs');
    assert.deepEqual(
      faqs.body.items.map((item: { question: string }) => item.question),
      ['Published FAQ?'],
    );

    const resources = await request(app).get('/api/resources');
    assert.deepEqual(
      resources.body.items.map((item: { slug: string }) => item.slug),
      ['test-published-article'],
    );
    const draft = await request(app).get('/api/resources/test-draft-article');
    assert.equal(draft.status, 404);
  });

  it('does not expose enquiry listings publicly', async () => {
    const publicList = await request(app).get('/api/enquiries');
    assert.equal(publicList.status, 404);

    const adminList = await request(app).get('/api/admin/enquiries');
    assert.equal(adminList.status, 401);
  });
});

describe('public enquiry submission', () => {
  beforeEach(async () => {
    await clearDatabase();
    await seedFixtures();
  });

  after(async () => {
    await clearDatabase();
  });

  it('stores a valid enquiry and returns a reference code', async () => {
    const response = await request(app).post('/api/enquiries').send(validEnquiry);

    assert.equal(response.status, 201);
    assert.match(response.body.referenceCode, /^CMA-\d{4}-[A-HJ-NP-Z2-9]{6}$/);

    const stored = await prisma.enquiry.findUniqueOrThrow({
      where: { referenceCode: response.body.referenceCode },
    });
    assert.equal(stored.phone, '+916299033454');
    assert.equal(stored.status, 'NEW');
    assert.ok(stored.consentedAt instanceof Date);
  });

  it('rejects invalid input with field-level messages', async () => {
    const response = await request(app)
      .post('/api/enquiries')
      .send({ name: 'A', contactMethod: 'PHONE', phone: 'not-a-number', consent: false });

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
    const fields = response.body.error.fields.map((item: { field: string }) => item.field);
    assert.ok(fields.includes('name'));
    assert.ok(fields.includes('phone'));
    assert.ok(fields.includes('consent'));
    assert.equal(await prisma.enquiry.count(), 0);
  });

  it('requires an email address when email is the chosen contact method', async () => {
    const response = await request(app)
      .post('/api/enquiries')
      .send({ ...validEnquiry, contactMethod: 'EMAIL', phone: undefined });

    assert.equal(response.status, 400);
    assert.ok(response.body.error.fields.some((item: { field: string }) => item.field === 'email'));
  });

  it('rejects an invalid email address', async () => {
    const response = await request(app)
      .post('/api/enquiries')
      .send({ ...validEnquiry, contactMethod: 'EMAIL', email: 'not-an-email', phone: '' });
    assert.equal(response.status, 400);
  });

  it('silently rejects honeypot submissions without storing them', async () => {
    const response = await request(app)
      .post('/api/enquiries')
      .send({ ...validEnquiry, website: 'http://spam.example' });

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'SPAM_SUSPECTED');
    assert.equal(await prisma.enquiry.count(), 0);
  });

  it('rejects submissions that arrive faster than a person could fill the form', async () => {
    const response = await request(app).post('/api/enquiries').send({ ...validEnquiry, formElapsedMs: 40 });
    assert.equal(response.body.error.code, 'SPAM_SUSPECTED');
    assert.equal(await prisma.enquiry.count(), 0);
  });

  it('rejects enquiries for services that are not published', async () => {
    const hidden = await prisma.service.findUniqueOrThrow({ where: { slug: 'test-hidden-service' } });
    const response = await request(app).post('/api/enquiries').send({ ...validEnquiry, serviceId: hidden.id });

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'INVALID_SERVICE');
  });

  it('rate limits repeated enquiry submissions', async () => {
    const limitedApp = createApp({ enquiries: 2 });
    await request(limitedApp).post('/api/enquiries').send(validEnquiry);
    await request(limitedApp).post('/api/enquiries').send(validEnquiry);
    const blocked = await request(limitedApp).post('/api/enquiries').send(validEnquiry);

    assert.equal(blocked.status, 429);
    assert.equal(blocked.body.error.code, 'RATE_LIMITED');
  });
});

describe('admin authentication and CSRF protection', () => {
  beforeEach(async () => {
    await clearDatabase();
    await seedFixtures();
    await createAdmins();
  });

  after(async () => {
    await clearDatabase();
  });

  it('rejects unauthenticated access to protected admin routes', async () => {
    const response = await request(app).get('/api/admin/dashboard');
    assert.equal(response.status, 401);
    assert.equal(response.body.error.code, 'UNAUTHENTICATED');
  });

  it('gives the same error for wrong passwords and unknown accounts', async () => {
    const wrongPassword = await signIn('owner@test.example', 'not-the-password-at-all');
    const unknownUser = await signIn('nobody@test.example', 'not-the-password-at-all');

    assert.equal(wrongPassword.response.status, 401);
    assert.equal(unknownUser.response.status, 401);
    assert.equal(wrongPassword.response.body.error.message, unknownUser.response.body.error.message);
  });

  it('issues an HTTP-only session cookie and a CSRF token on successful sign-in', async () => {
    const { agent, response, csrf } = await signIn('owner@test.example');

    assert.equal(response.status, 200);
    assert.ok(csrf.length > 20);
    const cookie = (response.headers['set-cookie'] as unknown as string[]).find((value) =>
      value.startsWith(`${ADMIN_SESSION_COOKIE}=`),
    );
    assert.ok(cookie, 'session cookie should be set');
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Lax/i);

    const me = await agent.get('/api/admin/auth/me');
    assert.equal(me.status, 200);
    assert.equal(me.body.user.email, 'owner@test.example');
  });

  it('stores only a keyed hash of the session token, never the token itself', async () => {
    const { response } = await signIn('owner@test.example');
    const cookie = (response.headers['set-cookie'] as unknown as string[])[0] ?? '';
    const token = decodeURIComponent(cookie.split(';')[0]?.split('=')[1] ?? '');

    const rows = await prisma.adminSession.findMany();
    assert.equal(rows.length, 1);
    assert.notEqual(rows[0]?.id, token);
    assert.ok(!rows.some((row) => row.id === token));
  });

  it('stores passwords as bcrypt hashes, never as plaintext', async () => {
    const admin = await prisma.adminUser.findUniqueOrThrow({ where: { email: 'owner@test.example' } });
    assert.match(admin.passwordHash, /^\$2[aby]\$12\$/);
    assert.notEqual(admin.passwordHash, PASSWORD);
  });

  it('rejects state-changing admin requests without the CSRF token', async () => {
    const { agent } = await signIn('owner@test.example');
    const response = await agent.post('/api/admin/services').send({});

    assert.equal(response.status, 403);
    assert.equal(response.body.error.code, 'CSRF_INVALID');
  });

  it('rejects state-changing admin requests from a disallowed origin', async () => {
    const { agent, csrf } = await signIn('owner@test.example');
    const response = await agent
      .patch('/api/admin/settings')
      .set('X-CSRF-Token', csrf)
      .set('Origin', 'https://evil.example')
      .send({ businessName: 'Hijacked Name' });

    assert.equal(response.status, 403);
    assert.equal(response.body.error.code, 'ORIGIN_NOT_ALLOWED');
  });

  it('invalidates the session on logout', async () => {
    const { agent, csrf } = await signIn('owner@test.example');
    const logout = await agent.post('/api/admin/auth/logout').set('X-CSRF-Token', csrf);
    assert.equal(logout.status, 204);

    const after = await agent.get('/api/admin/auth/me');
    assert.equal(after.status, 401);
  });

  it('locks login attempts after repeated failures', async () => {
    const limitedApp = createApp({ loginFailures: 3 });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await request(limitedApp).post('/api/admin/auth/login').send({ email: 'owner@test.example', password: 'wrong-password-value' });
    }
    const blocked = await request(limitedApp)
      .post('/api/admin/auth/login')
      .send({ email: 'owner@test.example', password: PASSWORD });

    assert.equal(blocked.status, 429);
    assert.equal(blocked.body.error.code, 'RATE_LIMITED');
  });
});

describe('role-based permissions', () => {
  beforeEach(async () => {
    await clearDatabase();
    await seedFixtures();
    await createAdmins();
  });

  after(async () => {
    await clearDatabase();
  });

  const newService = {
    name: 'Permission Test Service',
    category: 'GST',
    description: 'Created during a permission test.',
    iconKey: 'receipt',
    details: {
      overview: 'Overview text that is long enough for the validator.',
      whoMayNeed: [],
      documents: [],
      deliverables: [],
      exclusions: [],
      faqs: [],
    },
    enabled: true,
    published: false,
    featured: false,
    displayOrder: 99,
  };

  it('lets viewers read the dashboard but not change content', async () => {
    const { agent, csrf } = await signIn('viewer@test.example');

    const read = await agent.get('/api/admin/dashboard');
    assert.equal(read.status, 200);
    assert.ok('totals' in read.body);

    const write = await agent.post('/api/admin/services').set('X-CSRF-Token', csrf).send(newService);
    assert.equal(write.status, 403);
    assert.equal(write.body.error.code, 'FORBIDDEN');
  });

  it('lets editors manage services and plans but not site settings', async () => {
    const { agent, csrf } = await signIn('editor@test.example');

    const created = await agent.post('/api/admin/services').set('X-CSRF-Token', csrf).send(newService);
    assert.equal(created.status, 201);
    assert.equal(created.body.slug, 'permission-test-service');

    const updated = await agent
      .patch(`/api/admin/services/${created.body.id as string}`)
      .set('X-CSRF-Token', csrf)
      .send({ published: true });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.published, true);

    const settings = await agent.patch('/api/admin/settings').set('X-CSRF-Token', csrf).send({ businessHours: 'Mon-Sat' });
    assert.equal(settings.status, 403);
  });

  it('lets owners change site settings', async () => {
    const { agent, csrf } = await signIn('owner@test.example');
    const response = await agent
      .patch('/api/admin/settings')
      .set('X-CSRF-Token', csrf)
      .send({ showGoogleRating: true, businessHours: 'To be confirmed' });

    assert.equal(response.status, 200);
    assert.equal(response.body.settings.showGoogleRating, true);
  });

  it('prevents deleting a service that has enquiries, to keep history intact', async () => {
    const service = await prisma.service.findUniqueOrThrow({ where: { slug: 'test-published-service' } });
    await prisma.enquiry.create({
      data: {
        referenceCode: 'CMA-2601-TEST01',
        name: 'History Keeper',
        contactMethod: 'PHONE',
        phone: '+916299033454',
        serviceId: service.id,
        consentedAt: new Date(),
      },
    });

    const { agent, csrf } = await signIn('editor@test.example');
    const response = await agent.delete(`/api/admin/services/${service.id}`).set('X-CSRF-Token', csrf);

    assert.equal(response.status, 409);
    assert.equal(response.body.error.code, 'RECORD_IN_USE');
  });

  it('rejects invalid catalogue data and reports duplicate slugs clearly', async () => {
    const { agent, csrf } = await signIn('editor@test.example');

    const invalid = await agent
      .post('/api/admin/services')
      .set('X-CSRF-Token', csrf)
      .send({ ...newService, category: 'NOT_A_CATEGORY' });
    assert.equal(invalid.status, 400);
    assert.ok(invalid.body.error.fields.some((item: { field: string }) => item.field === 'category'));

    const duplicate = await agent
      .post('/api/admin/services')
      .set('X-CSRF-Token', csrf)
      .send({ ...newService, slug: 'test-published-service' });
    assert.equal(duplicate.status, 409);
  });

  it('rejects fractional prices so money is always stored as whole paise', async () => {
    const { agent, csrf } = await signIn('editor@test.example');
    const response = await agent.post('/api/admin/plans').set('X-CSRF-Token', csrf).send({
      name: 'Fractional price plan',
      audience: 'BUSINESS',
      serviceCategory: 'GST',
      description: 'A plan with an invalid fractional price.',
      priceInPaise: 1500.5,
      currency: 'INR',
      billingFrequency: 'MONTHLY',
      targetCustomer: 'Test customers',
      inclusions: [],
      exclusions: [],
      published: false,
      featured: false,
      displayOrder: 1,
    });
    assert.equal(response.status, 400);
  });
});

describe('admin enquiry management', () => {
  beforeEach(async () => {
    await clearDatabase();
    await seedFixtures();
    await createAdmins();
    await prisma.enquiry.createMany({
      data: [
        { referenceCode: 'CMA-2601-AAAAAA', name: 'Asha Verma', contactMethod: 'PHONE', phone: '+916299033454', consentedAt: new Date() },
        { referenceCode: 'CMA-2601-BBBBBB', name: 'Ravi Kumar', contactMethod: 'EMAIL', email: 'ravi@example.com', consentedAt: new Date(), status: 'CONTACTED' },
      ],
    });
  });

  after(async () => {
    await clearDatabase();
  });

  it('paginates, filters by status and searches by name or reference code', async () => {
    const { agent } = await signIn('viewer@test.example');

    const page = await agent.get('/api/admin/enquiries?pageSize=1');
    assert.equal(page.body.total, 2);
    assert.equal(page.body.items.length, 1);
    assert.equal(page.body.totalPages, 2);

    const filtered = await agent.get('/api/admin/enquiries?status=CONTACTED');
    assert.equal(filtered.body.total, 1);
    assert.equal(filtered.body.items[0].name, 'Ravi Kumar');

    const byReference = await agent.get('/api/admin/enquiries?q=cma-2601-aaaaaa');
    assert.equal(byReference.body.items[0].name, 'Asha Verma');
  });

  it('updates enquiry status and internal notes for editors', async () => {
    const enquiry = await prisma.enquiry.findFirstOrThrow({ where: { name: 'Asha Verma' } });
    const { agent, csrf } = await signIn('editor@test.example');

    const response = await agent
      .patch(`/api/admin/enquiries/${enquiry.id}`)
      .set('X-CSRF-Token', csrf)
      .send({ status: 'CLOSED', internalNote: 'Documents received on call.' });

    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'CLOSED');

    const stored = await prisma.enquiry.findUniqueOrThrow({ where: { id: enquiry.id } });
    assert.equal(stored.status, 'CLOSED');
    assert.equal(stored.internalNote, 'Documents received on call.');
  });

  it('rejects unknown statuses and viewer edits', async () => {
    const enquiry = await prisma.enquiry.findFirstOrThrow({ where: { name: 'Asha Verma' } });

    const editor = await signIn('editor@test.example');
    const invalid = await editor.agent
      .patch(`/api/admin/enquiries/${enquiry.id}`)
      .set('X-CSRF-Token', editor.csrf)
      .send({ status: 'DELETED' });
    assert.equal(invalid.status, 400);

    const viewer = await signIn('viewer@test.example');
    const forbidden = await viewer.agent
      .patch(`/api/admin/enquiries/${enquiry.id}`)
      .set('X-CSRF-Token', viewer.csrf)
      .send({ status: 'CLOSED' });
    assert.equal(forbidden.status, 403);
  });

  it('summarises enquiries on the dashboard', async () => {
    const { agent } = await signIn('owner@test.example');
    const response = await agent.get('/api/admin/dashboard');

    assert.equal(response.body.totals.enquiries, 2);
    assert.equal(response.body.byStatus.NEW, 1);
    assert.equal(response.body.byStatus.CONTACTED, 1);
    assert.equal(response.body.recentEnquiries.length, 2);
  });
});


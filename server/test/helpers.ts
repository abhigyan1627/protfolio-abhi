import { prisma } from '../src/config/prisma.js';
import { createAdminUser } from '../src/services/authService.js';

export const PASSWORD = 'correct-horse-battery-staple';

export async function clearDatabase(): Promise<void> {
  await prisma.enquiry.deleteMany();
  await prisma.adminSession.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.service.deleteMany();
  await prisma.faqEntry.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.siteSettings.deleteMany();
}

export async function seedFixtures() {
  await prisma.siteSettings.create({
    data: {
      id: 'singleton',
      businessName: 'CA Mohit Agrawal',
      hindiName: 'का मोहित अग्रवाल',
      hindiNameApproved: false,
      phone: '+91 62990 33454',
      whatsappNumber: '916299033454',
      address: 'Muskan, Kedia Lane, Town Thana, Gopalganj, Bihar 841428, India',
      showGoogleRating: false,
      googleRating: 4.9,
      googleReviewCount: 58,
    },
  });

  const detailsJson = {
    overview: 'A published test service with enough overview text to pass validation.',
    whoMayNeed: ['Test audience'],
    documents: ['Test document'],
    deliverables: ['Test deliverable'],
    exclusions: ['Test exclusion'],
    faqs: [],
  };

  const service = (slug: string, enabled: boolean, published: boolean) =>
    prisma.service.create({
      data: {
        name: `Service ${slug}`,
        slug,
        category: 'INCOME_TAX',
        description: 'A test service description.',
        details: detailsJson,
        enabled,
        published,
      },
    });

  const published = await service('test-published-service', true, true);
  await service('test-hidden-service', true, false);
  await service('test-disabled-service', false, true);

  await prisma.plan.create({
    data: {
      name: 'Published test plan',
      slug: 'test-plan-published',
      audience: 'INDIVIDUAL',
      serviceCategory: 'INCOME_TAX',
      description: 'A published plan for tests.',
      priceInPaise: 150000,
      billingFrequency: 'PER_FILING',
      targetCustomer: 'Test customers',
      inclusions: ['Included item'],
      exclusions: ['Excluded item'],
      published: true,
    },
  });
  await prisma.plan.create({
    data: {
      name: 'Hidden test plan',
      slug: 'test-plan-hidden',
      audience: 'INDIVIDUAL',
      serviceCategory: 'INCOME_TAX',
      description: 'An unpublished plan for tests.',
      targetCustomer: 'Test customers',
      inclusions: [],
      exclusions: [],
      published: false,
    },
  });

  await prisma.faqEntry.create({ data: { question: 'Published FAQ?', answer: 'Yes, published.', published: true } });
  await prisma.faqEntry.create({ data: { question: 'Draft FAQ?', answer: 'Not published.', published: false } });

  await prisma.resource.create({
    data: {
      title: 'Published test article',
      slug: 'test-published-article',
      category: 'Test',
      excerpt: 'A published article excerpt for tests.',
      body: 'A published article body that is long enough to pass validation rules.',
      published: true,
      publishedAt: new Date(),
    },
  });
  await prisma.resource.create({
    data: {
      title: 'Draft test article',
      slug: 'test-draft-article',
      category: 'Test',
      excerpt: 'A draft article excerpt for tests.',
      body: 'A draft article body that is long enough to pass validation rules.',
      published: false,
    },
  });

  return { publishedServiceId: published.id };
}

export async function createAdmins() {
  const owner = await createAdminUser({ email: 'owner@test.example', password: PASSWORD, role: 'OWNER' });
  const editor = await createAdminUser({ email: 'editor@test.example', password: PASSWORD, role: 'EDITOR' });
  const viewer = await createAdminUser({ email: 'viewer@test.example', password: PASSWORD, role: 'VIEWER' });
  return { owner, editor, viewer };
}

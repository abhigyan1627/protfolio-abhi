// Idempotent seed: creates missing proposed content but never overwrites edits made in the admin panel.
// Run with: npm run db:seed (from the server directory).
import { prisma } from './config/prisma.js';
import { seedFaqs, seedPlans, seedResources, seedServices } from './data/seedContent.js';
import { getSiteSettings } from './services/contentService.js';

// Proposed Hindi branding is stored but stays hidden on the site until the owner approves it in the admin panel.
const PROPOSED_HINDI_NAME = 'का मोहित अग्रवाल';
// Rating supplied with the project brief. Displayed only when the owner enables it after confirming it is current.
const SUPPLIED_GOOGLE_RATING = { googleRating: 4.9, googleReviewCount: 58 };

async function main() {
  await getSiteSettings();
  await prisma.siteSettings.updateMany({
    where: { id: 'singleton', hindiName: null },
    data: { hindiName: PROPOSED_HINDI_NAME, ...SUPPLIED_GOOGLE_RATING },
  });

  let createdServices = 0;
  for (const service of seedServices) {
    const existing = await prisma.service.findUnique({ where: { slug: service.slug }, select: { id: true } });
    if (!existing) {
      await prisma.service.create({ data: service });
      createdServices += 1;
    }
  }

  let createdPlans = 0;
  for (const plan of seedPlans) {
    const existing = await prisma.plan.findUnique({ where: { slug: plan.slug }, select: { id: true } });
    if (!existing) {
      await prisma.plan.create({ data: plan });
      createdPlans += 1;
    }
  }

  let createdFaqs = 0;
  for (const faq of seedFaqs) {
    const existing = await prisma.faqEntry.findFirst({ where: { question: faq.question }, select: { id: true } });
    if (!existing) {
      await prisma.faqEntry.create({ data: { ...faq, published: true } });
      createdFaqs += 1;
    }
  }

  let createdResources = 0;
  for (const resource of seedResources) {
    const existing = await prisma.resource.findUnique({ where: { slug: resource.slug }, select: { id: true } });
    if (!existing) {
      await prisma.resource.create({ data: { ...resource, published: true, publishedAt: new Date() } });
      createdResources += 1;
    }
  }

  console.log(
    JSON.stringify({
      message: 'Seed complete. Proposed content is unpublished or pending owner approval where noted.',
      created: { services: createdServices, plans: createdPlans, faqs: createdFaqs, resources: createdResources },
    }),
  );
}

main()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error instanceof Error ? error.message : 'unknown error');
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

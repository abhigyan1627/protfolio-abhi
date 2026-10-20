import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import type { FaqScope, SiteSettings } from '../generated/prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { slugify } from '../utils/slug.js';
import { mapWriteError } from './catalogService.js';

// ---------- FAQs ----------

export async function listPublicFaqs(scope?: FaqScope) {
  return prisma.faqEntry.findMany({
    where: { published: true, ...(scope && { scope }) },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, question: true, answer: true, scope: true, displayOrder: true },
  });
}

export const listAdminFaqs = () => prisma.faqEntry.findMany({ orderBy: [{ scope: 'asc' }, { displayOrder: 'asc' }] });

export const createFaq = (data: {
  question: string;
  answer: string;
  scope: FaqScope;
  published: boolean;
  displayOrder: number;
}) => prisma.faqEntry.create({ data });

export async function updateFaq(id: string, patch: Partial<Parameters<typeof createFaq>[0]>) {
  try {
    return await prisma.faqEntry.update({ where: { id }, data: patch });
  } catch (error) {
    throw mapWriteError(error, 'FAQ entry');
  }
}

export async function deleteFaq(id: string) {
  try {
    await prisma.faqEntry.delete({ where: { id } });
  } catch (error) {
    throw mapWriteError(error, 'FAQ entry');
  }
}

// ---------- Resources (articles) ----------

const resourceSummarySelect = {
  id: true,
  title: true,
  slug: true,
  category: true,
  excerpt: true,
  publishedAt: true,
  updatedAt: true,
} as const;

export async function listPublicResources() {
  return prisma.resource.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: resourceSummarySelect,
  });
}

export async function getPublicResource(slug: string) {
  const resource = await prisma.resource.findFirst({ where: { slug, published: true } });
  if (!resource) throw new ApiError(404, 'NOT_FOUND', 'Article not found.');
  return resource;
}

export const listAdminResources = () => prisma.resource.findMany({ orderBy: { updatedAt: 'desc' } });

export const createResource = (data: {
  title: string;
  slug?: string | undefined;
  category: string;
  excerpt: string;
  body: string;
  published: boolean;
}) =>
  prisma.resource.create({
    data: {
      ...data,
      slug: data.slug ?? slugify(data.title),
      publishedAt: data.published ? new Date() : null,
    },
  });

export async function updateResource(id: string, patch: Partial<Parameters<typeof createResource>[0]>) {
  try {
    const current = await prisma.resource.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!current) throw new ApiError(404, 'NOT_FOUND', 'Article not found.');
    // The first publish sets the publication date. Later edits only change updatedAt.
    const publishedAt = patch.published && !current.publishedAt ? new Date() : undefined;
    return await prisma.resource.update({ where: { id }, data: { ...patch, publishedAt } });
  } catch (error) {
    throw mapWriteError(error, 'Article');
  }
}

export async function deleteResource(id: string) {
  try {
    await prisma.resource.delete({ where: { id } });
  } catch (error) {
    throw mapWriteError(error, 'Article');
  }
}

// ---------- Site settings (singleton) ----------

const SETTINGS_ID = 'singleton';

// Creates the settings row from environment defaults the first time it is needed. Later edits in the admin panel win.
export async function getSiteSettings(): Promise<SiteSettings> {
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: {
      id: SETTINGS_ID,
      businessName: env.BUSINESS_NAME,
      phone: env.BUSINESS_PHONE,
      whatsappNumber: env.BUSINESS_WHATSAPP_NUMBER,
      email: env.BUSINESS_EMAIL || null,
      address: env.BUSINESS_ADDRESS,
      plusCode: env.BUSINESS_PLUS_CODE || null,
    },
  });
}

export async function updateSiteSettings(patch: Partial<Omit<SiteSettings, 'id' | 'updatedAt'>>) {
  await getSiteSettings();
  return prisma.siteSettings.update({ where: { id: SETTINGS_ID }, data: patch });
}

// Public view: hides unapproved branding and only exposes the Google rating once the owner has confirmed it.
export function toPublicSettings(settings: SiteSettings) {
  const showRating = settings.showGoogleRating;
  return {
    businessName: settings.businessName,
    profession: settings.profession,
    hindiName: settings.hindiNameApproved ? settings.hindiName : null,
    phone: settings.phone,
    whatsappNumber: settings.whatsappNumber,
    email: settings.email,
    address: settings.address,
    plusCode: settings.plusCode,
    businessHours: settings.businessHours,
    websiteUrl: settings.websiteUrl,
    googleBusinessUrl: settings.googleBusinessUrl,
    googleMapsUrl: settings.googleMapsUrl,
    mapEmbedUrl: settings.mapEmbedUrl,
    googleRating: showRating ? settings.googleRating : null,
    googleReviewCount: showRating ? settings.googleReviewCount : null,
    googleRatingNote: showRating
      ? 'Based on the Google Business Profile information supplied by the practice.'
      : null,
  };
}

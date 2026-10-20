import { prisma } from '../config/prisma.js';
import { Prisma } from '../generated/prisma/client.js';
import type { ServiceCategory, Audience, BillingFrequency } from '../generated/prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { slugify } from '../utils/slug.js';

const publicServiceFilter = { enabled: true, published: true } satisfies Prisma.ServiceWhereInput;

export async function listPublicServices(category?: ServiceCategory) {
  return prisma.service.findMany({
    where: { ...publicServiceFilter, ...(category && { category }) },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });
}

export async function getPublicService(slug: string) {
  const service = await prisma.service.findFirst({ where: { slug, ...publicServiceFilter } });
  if (!service) throw new ApiError(404, 'NOT_FOUND', 'Service not found.');
  return service;
}

export async function listAdminServices() {
  return prisma.service.findMany({
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { enquiries: true } } },
  });
}

export async function createService(data: {
  name: string;
  slug?: string | undefined;
  category: ServiceCategory;
  description: string;
  iconKey: string;
  details: Prisma.InputJsonValue;
  enabled: boolean;
  published: boolean;
  featured: boolean;
  displayOrder: number;
}) {
  return prisma.service.create({ data: { ...data, slug: data.slug ?? slugify(data.name) } });
}

export async function updateService(id: string, patch: Partial<Parameters<typeof createService>[0]>) {
  try {
    return await prisma.service.update({ where: { id }, data: patch });
  } catch (error) {
    throw mapWriteError(error, 'Service');
  }
}

export async function deleteService(id: string) {
  const usage = await prisma.enquiry.count({ where: { serviceId: id } });
  if (usage > 0) {
    throw new ApiError(
      409,
      'RECORD_IN_USE',
      'This service has enquiries attached to it. Unpublish it instead so the enquiry history stays intact.',
    );
  }
  try {
    await prisma.service.delete({ where: { id } });
  } catch (error) {
    throw mapWriteError(error, 'Service');
  }
}

export async function listPublicPlans(filter: { audience?: Audience; serviceCategory?: ServiceCategory }) {
  return prisma.plan.findMany({
    where: {
      published: true,
      ...(filter.audience && { audience: filter.audience }),
      ...(filter.serviceCategory && { serviceCategory: filter.serviceCategory }),
    },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });
}

export async function getPublicPlan(slug: string) {
  const plan = await prisma.plan.findFirst({ where: { slug, published: true } });
  if (!plan) throw new ApiError(404, 'NOT_FOUND', 'Plan not found.');
  return plan;
}

export async function listAdminPlans() {
  return prisma.plan.findMany({
    orderBy: [{ audience: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { enquiries: true } } },
  });
}

export async function createPlan(data: {
  name: string;
  slug?: string | undefined;
  audience: Audience;
  serviceCategory: ServiceCategory;
  description: string;
  priceInPaise: number | null;
  currency: 'INR';
  billingFrequency: BillingFrequency;
  additionalCharges: string | null;
  targetCustomer: string;
  inclusions: string[];
  exclusions: string[];
  published: boolean;
  featured: boolean;
  displayOrder: number;
}) {
  return prisma.plan.create({
    data: {
      ...data,
      inclusions: data.inclusions,
      exclusions: data.exclusions,
      slug: data.slug ?? slugify(data.name),
    },
  });
}

export async function updatePlan(id: string, patch: Partial<Parameters<typeof createPlan>[0]>) {
  try {
    return await prisma.plan.update({ where: { id }, data: patch });
  } catch (error) {
    throw mapWriteError(error, 'Plan');
  }
}

export async function deletePlan(id: string) {
  const usage = await prisma.enquiry.count({ where: { planId: id } });
  if (usage > 0) {
    throw new ApiError(
      409,
      'RECORD_IN_USE',
      'This plan has enquiries attached to it. Unpublish it instead so the enquiry history stays intact.',
    );
  }
  try {
    await prisma.plan.delete({ where: { id } });
  } catch (error) {
    throw mapWriteError(error, 'Plan');
  }
}

// Translates Prisma errors into API errors with clear messages.
export function mapWriteError(error: unknown, label: string): unknown {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') return new ApiError(404, 'NOT_FOUND', `${label} not found.`);
    if (error.code === 'P2002') return new ApiError(409, 'SLUG_TAKEN', `A ${label.toLowerCase()} with this slug already exists.`);
  }
  return error;
}

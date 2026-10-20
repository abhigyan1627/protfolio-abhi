import { prisma } from '../config/prisma.js';
import { Prisma } from '../generated/prisma/client.js';
import type { EnquiryStatus } from '../generated/prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { createReferenceCode } from '../utils/crypto.js';
import type { EnquiryInput } from '../validators/enquiry.js';

const MAX_REFERENCE_ATTEMPTS = 5;

export interface StoredEnquiry {
  referenceCode: string;
  createdAt: Date;
}

// Resolves only after the row is committed. Callers must not report success before this returns.
export async function createEnquiry(input: EnquiryInput, phone: string | null): Promise<StoredEnquiry> {
  if (input.serviceId) {
    const service = await prisma.service.findFirst({
      where: { id: input.serviceId, enabled: true, published: true },
      select: { id: true },
    });
    if (!service) {
      throw new ApiError(400, 'INVALID_SERVICE', 'The selected service is not available.', [
        { field: 'serviceId', message: 'Choose a service from the list.' },
      ]);
    }
  }

  if (input.planId) {
    const plan = await prisma.plan.findFirst({
      where: { id: input.planId, published: true },
      select: { id: true },
    });
    if (!plan) {
      throw new ApiError(400, 'INVALID_PLAN', 'The selected plan is not available.', [
        { field: 'planId', message: 'Choose a plan from the list.' },
      ]);
    }
  }

  for (let attempt = 1; attempt <= MAX_REFERENCE_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.enquiry.create({
        data: {
          referenceCode: createReferenceCode(),
          name: input.name,
          phone,
          email: input.email ?? null,
          contactMethod: input.contactMethod,
          serviceId: input.serviceId ?? null,
          planId: input.planId ?? null,
          message: input.message ?? null,
          consentedAt: new Date(),
        },
        select: { referenceCode: true, createdAt: true },
      });
    } catch (error) {
      // Reference codes are random; retry on the rare collision.
      if (isUniqueViolation(error, 'referenceCode') && attempt < MAX_REFERENCE_ATTEMPTS) continue;
      throw error;
    }
  }

  throw new ApiError(500, 'ENQUIRY_NOT_SAVED', 'We could not save your enquiry. Please try WhatsApp instead.');
}

export function isUniqueViolation(error: unknown, field: string): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002' &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes(field)
  );
}

export const enquiryListSelect = {
  id: true,
  referenceCode: true,
  name: true,
  phone: true,
  email: true,
  contactMethod: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  service: { select: { id: true, name: true } },
  plan: { select: { id: true, name: true } },
} satisfies Prisma.EnquirySelect;

export interface EnquiryListQuery {
  status?: EnquiryStatus | undefined;
  q?: string | undefined;
  page: number;
  pageSize: number;
}

export async function listEnquiries(query: EnquiryListQuery) {
  const where: Prisma.EnquiryWhereInput = {};
  if (query.status) where.status = query.status;
  if (query.q) {
    where.OR = [
      { referenceCode: { contains: query.q, mode: 'insensitive' } },
      { name: { contains: query.q, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: enquiryListSelect,
    }),
    prisma.enquiry.count({ where }),
  ]);

  return {
    items,
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

export async function getEnquiry(id: string) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    select: {
      ...enquiryListSelect,
      message: true,
      consentedAt: true,
      internalNote: true,
    },
  });
  if (!enquiry) throw new ApiError(404, 'NOT_FOUND', 'Enquiry not found.');
  return enquiry;
}

export async function updateEnquiry(
  id: string,
  patch: { status?: EnquiryStatus | undefined; internalNote?: string | null | undefined },
) {
  try {
    return await prisma.enquiry.update({
      where: { id },
      data: {
        ...(patch.status !== undefined && { status: patch.status }),
        ...(patch.internalNote !== undefined && { internalNote: patch.internalNote }),
      },
      select: enquiryListSelect,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new ApiError(404, 'NOT_FOUND', 'Enquiry not found.');
    }
    throw error;
  }
}

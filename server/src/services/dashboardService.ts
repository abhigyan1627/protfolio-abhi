import { prisma } from '../config/prisma.js';
import { ENQUIRY_STATUSES } from '../config/constants.js';

export async function getDashboard() {
  const [total, statusGroups, recentEnquiries, serviceGroups] = await Promise.all([
    prisma.enquiry.count(),
    prisma.enquiry.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        referenceCode: true,
        name: true,
        status: true,
        contactMethod: true,
        createdAt: true,
        service: { select: { name: true } },
      },
    }),
    prisma.enquiry.groupBy({
      by: ['serviceId'],
      where: { serviceId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 5,
    }),
  ]);

  const serviceIds = serviceGroups.flatMap((group) => (group.serviceId ? [group.serviceId] : []));
  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
    select: { id: true, name: true },
  });

  const byStatus: Record<string, number> = Object.fromEntries(ENQUIRY_STATUSES.map((status) => [status, 0]));
  for (const group of statusGroups) {
    byStatus[group.status] = group._count._all;
  }

  return {
    totals: { enquiries: total, new: byStatus['NEW'] ?? 0 },
    byStatus,
    recentEnquiries,
    topServices: serviceGroups.map((group) => ({
      serviceId: group.serviceId,
      name: services.find((service) => service.id === group.serviceId)?.name ?? 'Removed service',
      count: group._count._all,
    })),
  };
}

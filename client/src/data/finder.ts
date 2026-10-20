import type { Audience, Plan, Service } from '../types/api';

export const FINDER_AUDIENCES: { id: Audience; label: string; description: string }[] = [
  { id: 'INDIVIDUAL', label: 'Individual', description: 'Personal income tax, returns and tax questions.' },
  { id: 'BUSINESS', label: 'Business', description: 'GST, bookkeeping, accounting and ongoing compliance.' },
  { id: 'STARTUP', label: 'Startup or MSME', description: 'Company setup, registrations and early-stage compliance.' },
];

// Which catalogue services each audience sees in the Smart Service Finder, in display order.
export const FINDER_SERVICE_SLUGS: Record<Audience, string[]> = {
  INDIVIDUAL: ['itr-filing-assistance', 'tax-consultation', 'tax-planning-assistance', 'tax-documentation-support'],
  BUSINESS: [
    'gst-registration-assistance',
    'gst-return-filing',
    'gst-compliance-support',
    'gst-consultation',
    'bookkeeping',
    'accounting-support',
    'financial-reporting',
    'business-compliance',
    'tds-related-services',
  ],
  STARTUP: [
    'company-incorporation-assistance',
    'llp-registration-assistance',
    'startup-compliance-support',
    'msme-udyam-registration',
    'business-documentation',
    'ongoing-accounting-assistance',
  ],
};

export function servicesForAudience(audience: Audience, services: Service[]): Service[] {
  const bySlug = new Map(services.map((service) => [service.slug, service]));
  return FINDER_SERVICE_SLUGS[audience].flatMap((slug) => {
    const service = bySlug.get(slug);
    return service ? [service] : [];
  });
}

// Plans that fit the chosen audience and service category. Falls back to all plans for the audience.
export function plansForSelection(audience: Audience, service: Service, plans: Plan[]): Plan[] {
  const audiencePlans = plans.filter((plan) => plan.audience === audience);
  const matching = audiencePlans.filter((plan) => plan.serviceCategory === service.category);
  return matching.length > 0 ? matching : audiencePlans;
}

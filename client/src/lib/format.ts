import type {
  AdminRole,
  Audience,
  BillingFrequency,
  ContactMethod,
  EnquiryStatus,
  FaqScope,
  Plan,
  ServiceCategory,
} from '../types/api';

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  INCOME_TAX: 'Income Tax',
  GST: 'GST',
  BUSINESS_COMPANY: 'Business & Company',
  ACCOUNTING_FINANCE: 'Accounting & Finance',
  AUDIT_OTHER: 'Audit & Other',
};

export const CATEGORY_ORDER: ServiceCategory[] = [
  'INCOME_TAX',
  'GST',
  'BUSINESS_COMPANY',
  'ACCOUNTING_FINANCE',
  'AUDIT_OTHER',
];

export const AUDIENCE_LABELS: Record<Audience, string> = {
  INDIVIDUAL: 'Individual',
  BUSINESS: 'Business',
  STARTUP: 'Startup & MSME',
};

export const BILLING_LABELS: Record<BillingFrequency, string> = {
  ONE_TIME: 'one-time',
  PER_FILING: 'per filing',
  MONTHLY: 'per month',
  ANNUAL: 'per year',
  CUSTOM: 'as quoted',
};

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_PROGRESS: 'In progress',
  CLOSED: 'Closed',
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

const rupees = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

export function formatInrFromPaise(paise: number): string {
  return `₹${rupees.format(paise / 100)}`;
}

// Plans without an approved price show "Contact for Quotation" rather than an invented amount.
export function formatPlanPrice(plan: Pick<Plan, 'priceInPaise' | 'billingFrequency'>): {
  headline: string;
  suffix: string | null;
  isQuote: boolean;
} {
  if (plan.priceInPaise === null) {
    return { headline: 'Contact for Quotation', suffix: null, isQuote: true };
  }
  const suffix = plan.billingFrequency === 'CUSTOM' ? null : BILLING_LABELS[plan.billingFrequency];
  return { headline: formatInrFromPaise(plan.priceInPaise), suffix, isQuote: false };
}

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const CONTACT_LABELS: Record<ContactMethod, string> = {
  PHONE: 'Phone call',
  WHATSAPP: 'WhatsApp',
  EMAIL: 'Email',
};

export const FAQ_SCOPE_LABELS: Record<FaqScope, string> = {
  GENERAL: 'Everywhere',
  HOME: 'Homepage',
  SERVICES: 'Services page',
  PRICING: 'Pricing page',
};

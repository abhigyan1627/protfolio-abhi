export const SERVICE_CATEGORIES = [
  'INCOME_TAX',
  'GST',
  'BUSINESS_COMPANY',
  'ACCOUNTING_FINANCE',
  'AUDIT_OTHER',
] as const;

export const AUDIENCES = ['INDIVIDUAL', 'BUSINESS', 'STARTUP'] as const;
export const BILLING_FREQUENCIES = ['ONE_TIME', 'PER_FILING', 'MONTHLY', 'ANNUAL', 'CUSTOM'] as const;
export const CONTACT_METHODS = ['PHONE', 'WHATSAPP', 'EMAIL'] as const;
export const ENQUIRY_STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'] as const;
export const ADMIN_ROLES = ['OWNER', 'EDITOR', 'VIEWER'] as const;
export const FAQ_SCOPES = ['GENERAL', 'HOME', 'SERVICES', 'PRICING'] as const;

export const SERVICE_ICON_KEYS = [
  'file-text',
  'calculator',
  'receipt',
  'building',
  'landmark',
  'briefcase',
  'rocket',
  'book-open',
  'shield-check',
  'line-chart',
  'users',
  'file-check',
  'scale',
  'wallet',
] as const;

export const ADMIN_SESSION_COOKIE = 'cma_admin_session';
export const CSRF_HEADER = 'x-csrf-token';

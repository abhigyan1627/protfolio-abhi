import type { PublicSettings } from '../types/api';

// Contact configuration. Values here are the fallback used before settings load and if the API is unreachable.
// The owner can change them in the admin panel; the admin values take precedence once the API responds.
type EnvMap = Record<string, string | undefined>;
const env: EnvMap = (import.meta as ImportMeta & { env?: EnvMap }).env ?? {};

export const SITE_URL = (env['VITE_SITE_URL'] ?? '').replace(/\/$/, '');
export const API_BASE_URL = (env['VITE_API_BASE_URL'] ?? '/api').replace(/\/$/, '');

export const BUSINESS = {
  name: 'CA Mohit Agrawal',
  profession: 'Chartered Accountant',
  // Shown on the site only after the owner approves the Hindi branding in the admin panel.
  hindiName: 'का मोहित अग्रवाल',
  phone: '+91 62990 33454',
  whatsappNumber: '916299033454',
  email: null,
  address: 'Muskan, Kedia Lane, Town Thana, Gopalganj, Bihar 841428, India',
  city: 'Gopalganj',
  state: 'Bihar',
  postcode: '841428',
  plusCode: 'FC7V+QC, Gopalganj',
  tagline: 'Trusted Tax, GST & Business Compliance Services',
  heroHeadline: 'Clear Tax Advice. Confident Business Decisions.',
  heroSupport:
    'Your professional partner for taxation, GST, accounting and business compliance in Gopalganj, Bihar.',
} as const;

export const FALLBACK_SETTINGS: PublicSettings = {
  businessName: BUSINESS.name,
  profession: BUSINESS.profession,
  hindiName: null,
  phone: BUSINESS.phone,
  whatsappNumber: BUSINESS.whatsappNumber,
  email: BUSINESS.email,
  address: BUSINESS.address,
  plusCode: BUSINESS.plusCode,
  businessHours: null,
  websiteUrl: null,
  googleBusinessUrl: null,
  googleMapsUrl: null,
  mapEmbedUrl: null,
  googleRating: null,
  googleReviewCount: null,
  googleRatingNote: null,
};

export const absoluteUrl = (path: string): string => {
  const base = SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}${path}`;
};

export type ServiceCategory = 'INCOME_TAX' | 'GST' | 'BUSINESS_COMPANY' | 'ACCOUNTING_FINANCE' | 'AUDIT_OTHER';
export type Audience = 'INDIVIDUAL' | 'BUSINESS' | 'STARTUP';
export type BillingFrequency = 'ONE_TIME' | 'PER_FILING' | 'MONTHLY' | 'ANNUAL' | 'CUSTOM';
export type ContactMethod = 'PHONE' | 'WHATSAPP' | 'EMAIL';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';
export type AdminRole = 'OWNER' | 'EDITOR' | 'VIEWER';
export type FaqScope = 'GENERAL' | 'HOME' | 'SERVICES' | 'PRICING';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetails {
  overview: string;
  whoMayNeed: string[];
  documents: string[];
  deliverables: string[];
  exclusions: string[];
  faqs: ServiceFaq[];
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  iconKey: string;
  details: ServiceDetails;
  enabled: boolean;
  published: boolean;
  featured: boolean;
  displayOrder: number;
}

export interface AdminService extends Service {
  _count?: { enquiries: number };
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
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
}

export interface AdminPlan extends Plan {
  _count?: { enquiries: number };
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  scope: FaqScope;
  displayOrder: number;
}

export interface AdminFaq extends Faq {
  published: boolean;
}

export interface ResourceSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface Resource extends ResourceSummary {
  body: string;
}

export interface AdminResource extends Resource {
  published: boolean;
}

export interface PublicSettings {
  businessName: string;
  profession: string;
  hindiName: string | null;
  phone: string;
  whatsappNumber: string;
  email: string | null;
  address: string;
  plusCode: string | null;
  businessHours: string | null;
  websiteUrl: string | null;
  googleBusinessUrl: string | null;
  googleMapsUrl: string | null;
  mapEmbedUrl: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  googleRatingNote: string | null;
}

export interface AdminSettings extends Omit<PublicSettings, 'hindiName' | 'googleRatingNote'> {
  id: string;
  hindiName: string | null;
  hindiNameApproved: boolean;
  showGoogleRating: boolean;
  googleRating: number | null;
  googleReviewCount: number | null;
  updatedAt: string;
}

export interface EnquirySummary {
  id: string;
  referenceCode: string;
  name: string;
  phone: string | null;
  email: string | null;
  contactMethod: ContactMethod;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  service: { id: string; name: string } | null;
  plan: { id: string; name: string } | null;
}

export interface EnquiryDetail extends EnquirySummary {
  message: string | null;
  consentedAt: string;
  internalNote: string | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminDashboard {
  totals: { enquiries: number; new: number };
  byStatus: Record<EnquiryStatus, number>;
  recentEnquiries: (Pick<EnquirySummary, 'id' | 'referenceCode' | 'name' | 'status' | 'contactMethod' | 'createdAt'> & {
    service: { name: string } | null;
  })[];
  topServices: { serviceId: string | null; name: string; count: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

export interface EnquiryReceipt {
  referenceCode: string;
  message: string;
}

// Builds wa.me links. Links open only from a user click (rendered as anchors), never via automatic redirects.

export function normalizeWhatsAppNumber(input: string): string | null {
  // Strip spaces, +, dashes, dots and brackets before validating.
  const digits = input.replace(/[\s+\-().]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return digits;
}

export function buildWhatsAppUrl(number: string, message: string): string | null {
  const normalized = normalizeWhatsAppNumber(number);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

const BUSINESS_GREETING = 'Hello CA Mohit Agrawal';

// Sentence that tells the CA what information the visitor needs back, by service category.
export const CATEGORY_ASK: Record<string, string> = {
  INCOME_TAX: 'Please let me know the applicable fees, documents required and next steps.',
  GST: 'Please share the required documents, professional fees, applicable additional charges and process.',
  BUSINESS_COMPANY: 'Please share the required documents, applicable fees and next steps.',
  ACCOUNTING_FINANCE: 'Please share the scope, pricing, documentation requirements and onboarding process.',
  AUDIT_OTHER: 'Please confirm the scope, fees and next steps.',
};

export const whatsappMessages = {
  general: () =>
    `${BUSINESS_GREETING}, I visited your website and would like to enquire about your services. Please let me know the applicable fees, documents required and next steps.`,

  service: (service: { name: string; category: string }) => {
    const intro =
      service.category === 'ACCOUNTING_FINANCE'
        ? `I am interested in ${service.name}.`
        : `I visited your website and would like to enquire about ${service.name}.`;
    return `${BUSINESS_GREETING}, ${intro} ${CATEGORY_ASK[service.category] ?? CATEGORY_ASK['AUDIT_OTHER']}`;
  },

  plan: (plan: { name: string }, categoryLabel: string) =>
    `${BUSINESS_GREETING}, I would like to enquire about the ${plan.name} plan for ${categoryLabel}. Please confirm the current price, inclusions, exclusions and next steps.`,

  customQuote: (categoryLabel?: string) =>
    `${BUSINESS_GREETING}, I would like to request a custom quotation${categoryLabel ? ` for ${categoryLabel}` : ''}. Please share the scope, fees, documentation requirements and next steps.`,

  finder: (audienceLabel: string, serviceName: string, planName?: string) =>
    planName
      ? `${BUSINESS_GREETING}, I am a ${audienceLabel.toLowerCase()} looking for ${serviceName}. I am interested in the ${planName} plan. Please confirm the current price, inclusions, exclusions and next steps.`
      : `${BUSINESS_GREETING}, I am a ${audienceLabel.toLowerCase()} looking for ${serviceName}. Please share a quotation, the documents required and next steps.`,

  enquiryFollowUp: (referenceCode: string) =>
    `${BUSINESS_GREETING}, I submitted an enquiry on your website with reference ${referenceCode}. Please confirm the next steps.`,
};

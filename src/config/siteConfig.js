/**
 * Central firm configuration. This is the first file to edit when adapting the site for another CA firm.
 *
 * - Leave a contact field as '' while it is unknown. The site hides or disables that element and the
 *   development banner lists what still needs configuring.
 * - whatsappNumber must be digits only, in international format (country code + number), for example
 *   '919876543210'. Any value containing letters (such as the 'XX' placeholder) counts as not configured.
 */
export const siteConfig = {
  firmName: 'AUREVIA Chartered Accountants',
  shortName: 'AUREVIA',
  tagline: 'Clarity in Finance. Confidence in Every Decision.',
  description:
    'AUREVIA Chartered Accountants supports individuals, entrepreneurs and growing businesses with income tax, GST, accounting, TDS, business compliance and startup registrations.',

  logo: {
    monogram: 'A',
    wordmark: 'AUREVIA',
    subtitle: 'Chartered Accountants',
    // Optional image logo (for example '/logo.svg' placed in /public). When set, it replaces the monogram.
    image: '',
  },

  whatsappNumber: '91XXXXXXXXXX',
  phone: '',
  email: '',
  city: '',
  officeAddress: '',
  // Canonical base URL without a trailing slash, for example 'https://www.example-firm.in'.
  websiteUrl: '',
  businessHours: [{ days: 'Monday – Saturday', time: '' }],
  // Google Maps embed URL (https://www.google.com/maps/embed?pb=…) and a link to the office on Google Maps.
  mapEmbedUrl: '',
  mapLink: '',
  social: {
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
  },

  pricing: {
    // Shows a sample-price notice on the pricing page. Set to false after client-approved prices are entered.
    showSampleNotice: true,
  },

  legal: {
    // Shows a draft notice on the legal pages. Set to false after a qualified reviewer has approved the text.
    showDraftNotice: true,
    lastUpdated: '2026-10-20',
  },

  copyright: {
    year: 2026,
    holder: 'AUREVIA Chartered Accountants',
  },

  seo: {
    defaultTitle: 'AUREVIA Chartered Accountants | Tax, GST & Business Compliance',
    locale: 'en_IN',
    ogImage: '/og-image.png',
    twitterHandle: '',
  },
}

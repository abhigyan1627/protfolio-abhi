/**
 * Central firm configuration. This is the first file to edit when adapting the site for another CA firm.
 *
 * - Leave a contact field as '' while it is unknown. The site hides or disables that element and the
 *   development banner lists what still needs configuring.
 * - whatsappNumber must be digits only, in international format (country code + number), for example
 *   '919876543210'. Any value containing letters (such as the 'XX' placeholder) counts as not configured.
 */
export const siteConfig = {
  firmName: 'CA Mohit Agrawal',
  shortName: 'Mohit Agrawal',
  tagline: 'Chartered Accountant · Gopalganj, Bihar',
  description:
    'CA Mohit Agrawal, Chartered Accountant in Gopalganj, Bihar, supports individuals and businesses with income tax, GST, accounting, TDS and business compliance.',

  logo: {
    monogram: 'M',
    wordmark: 'MOHIT AGRAWAL',
    subtitle: 'Chartered Accountant',
    // Optional image logo (for example '/logo.svg' placed in /public). When set, it replaces the monogram.
    image: '',
  },

  // Not yet confirmed. The number listed on Google is a landline-style number, which may not be on WhatsApp.
  whatsappNumber: '91XXXXXXXXXX',
  // Shown as listed on the Google Business profile (062990 33454), written in international format.
  phone: '+91 62990 33454',
  email: '',
  city: 'Gopalganj, Bihar',
  officeAddress: 'Muskan, Kedia Lane, Town Thana, Gopalganj, Bihar 841428',
  // Canonical base URL without a trailing slash, for example 'https://www.example-firm.in'.
  websiteUrl: '',
  // Only the closing time is confirmed so far. Add the full weekly schedule once the firm provides it.
  businessHours: [{ days: 'Opening hours', time: 'Closes 6:30 pm (full schedule to be confirmed)' }],
  // Google Maps embed (Plus code FC7V+QC, Gopalganj) and a link to the office. Not yet checked in a browser.
  mapEmbedUrl: 'https://maps.google.com/maps?q=FC7V%2BQC+Gopalganj+Bihar&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=FC7V%2BQC+Gopalganj+Bihar',
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
    holder: 'CA Mohit Agrawal',
  },

  seo: {
    defaultTitle: 'CA Mohit Agrawal | Chartered Accountant, Gopalganj',
    locale: 'en_IN',
    ogImage: '/og-image.png',
    twitterHandle: '',
  },
}

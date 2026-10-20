// Every route on the site. Navigation, page metadata and the sitemap are generated from this list.
// Titles are page-specific; the firm name is appended automatically by useDocumentMeta.
export const sitePages = [
  {
    id: 'home',
    path: '/',
    nav: 'Home',
    title: 'Tax, GST & Business Compliance',
    description:
      'Chartered accountancy support for income tax, GST, accounting, TDS, business compliance and startup registrations, with clear scope and WhatsApp enquiries.',
    priority: '1.0',
  },
  {
    id: 'services',
    path: '/services',
    nav: 'Services',
    title: 'Services',
    description:
      'Income tax filing, GST registration and returns, accounting, TDS, company and LLP registration, and MSME support, with scope and eligibility notes for each service.',
    priority: '0.9',
  },
  {
    id: 'pricing',
    path: '/pricing',
    nav: 'Pricing',
    title: 'Plans & Pricing',
    description:
      'Compare individual, business and startup plans with inclusions, exclusions and additional-charge disclosures. Enquire on WhatsApp before you choose.',
    priority: '0.9',
  },
  {
    id: 'about',
    path: '/about',
    nav: 'About Us',
    title: 'About the Firm',
    description:
      'Learn about our specialisations, professional approach and how we work with individuals, entrepreneurs and growing businesses.',
    priority: '0.7',
  },
  {
    id: 'resources',
    path: '/resources',
    nav: 'Resources',
    title: 'Resources & Document Checklists',
    description:
      'Indicative document checklists, official government portals and answers to common questions about income tax, GST and company filings.',
    priority: '0.7',
  },
  {
    id: 'contact',
    path: '/contact',
    nav: 'Contact',
    title: 'Contact & Enquiry',
    description:
      'Contact the firm on WhatsApp, by phone or by email, or send a basic enquiry. Office location and business hours are listed here.',
    priority: '0.8',
  },
  {
    id: 'privacy',
    path: '/privacy',
    title: 'Privacy Policy',
    description: 'How enquiry details shared through this website and WhatsApp are collected, used and retained.',
    priority: '0.3',
  },
  {
    id: 'terms',
    path: '/terms',
    title: 'Terms of Use',
    description: 'Terms that apply when you use this website and contact the firm through its enquiry channels.',
    priority: '0.3',
  },
  {
    id: 'disclaimer',
    path: '/disclaimer',
    title: 'Disclaimer',
    description: 'General-information disclaimer for content on this website. It is not professional advice.',
    priority: '0.3',
  },
]

export const navItems = sitePages
  .filter((page) => page.nav)
  .map((page) => ({ label: page.nav, to: page.path }))

export const pageById = Object.fromEntries(sitePages.map((page) => [page.id, page]))

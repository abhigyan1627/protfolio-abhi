// Editorial copy used across the site: home-page strip, process, principles, about and resources.
// Keep claims factual. Do not add years of experience, client counts, awards or credentials until verified.

export const categoryStrip = [
  { label: 'Taxation', description: 'Income tax returns, consultation and planning', icon: 'Landmark', to: '/services#individuals' },
  { label: 'GST', description: 'Registration, return filing and support', icon: 'Calculator', to: '/services#businesses' },
  { label: 'Business Compliance', description: 'Recurring filings and statutory calendars', icon: 'ShieldCheck', to: '/services#startups' },
  { label: 'Accounting', description: 'Bookkeeping, reconciliation and reporting', icon: 'BookOpen', to: '/services#businesses' },
]

export const processSteps = [
  {
    number: '01',
    title: 'Choose Your Service',
    text: 'Explore the relevant services and plans, and note the scope and charges that apply to you.',
  },
  {
    number: '02',
    title: 'Discuss Your Requirements',
    text: 'Connect with the firm on WhatsApp so that your situation is understood before any work is agreed.',
  },
  {
    number: '03',
    title: 'Share Required Documents Securely',
    text: 'The firm explains the documents needed and the appropriate way to submit them.',
  },
  {
    number: '04',
    title: 'Receive Professional Assistance',
    text: 'The agreed service is delivered, and the firm communicates the relevant next steps as the work progresses.',
  },
]

export const principles = [
  {
    title: 'Clear communication',
    text: 'You receive plain-language explanations of what is being done, what is needed from you and what happens next.',
  },
  {
    title: 'Transparent scope and pricing',
    text: 'Inclusions, exclusions and additional charges are stated before work begins, not after.',
  },
  {
    title: 'Organised documentation',
    text: 'A checklist and an agreed way of sharing records keep your files complete and easy to find.',
  },
  {
    title: 'Professional assistance',
    text: 'Work is handled with the care and professional responsibility expected of a chartered accountancy practice.',
  },
  {
    title: 'Defined service processes',
    text: 'Each service follows a defined sequence, so you always know where your matter stands.',
  },
  {
    title: 'Support for individuals and businesses',
    text: 'Services are shaped for salaried individuals, professionals, established businesses and startups.',
  },
]

export const aboutContent = {
  intro: [
    'CA Mohit Agrawal works with individuals, entrepreneurs and growing businesses in Gopalganj on the financial and compliance work that needs to be right the first time.',
    'We keep the work organised, the scope clear and the communication simple, so that clients can focus on what they are building.',
  ],
  specialisations: [
    'Income tax for individuals',
    'GST registration and return support',
    'Accounting, bookkeeping and financial reporting',
    'TDS and business compliance',
    'Company, LLP and startup registrations',
    'MSME and Udyam support',
  ],
  approach:
    'We begin with a conversation about your requirements, confirm the scope and the documents needed, and only then start the work. Every engagement follows a defined process, so you always know what is happening and what we need from you.',
  philosophy:
    'Clarity is part of the service. Plain language, a clear scope and fees stated up front matter as much as the technical work behind them.',
}

// Partner profile. Keep verified=false until qualifications, membership and experience have been checked.
// When verified is false, the About page shows a placeholder instead of these details.
export const teamProfile = {
  name: 'CA Mohit Agrawal',
  role: 'Chartered Accountant',
  bio: 'A short introduction, including areas of focus and experience, will appear here once it has been confirmed with the firm.',
  qualifications: [],
  membership: '',
  verified: false,
}

export const resourceChecklists = [
  {
    id: 'itr-individuals',
    title: 'Income tax return (individuals)',
    intro: 'Documents commonly needed for an individual return. The firm confirms the exact list for your case.',
    items: [
      'PAN',
      'Mobile number and email linked to your tax records',
      'Form 16 or salary details',
      'Bank account details and statements',
      'TDS certificates, such as Form 16A',
      'Interest certificates and investment proofs',
      'Rent receipts or details of rental income, where applicable',
      'Previous year return acknowledgement, where available',
    ],
  },
  {
    id: 'gst-registration',
    title: 'GST registration',
    intro: 'Indicative documents for a GST registration application. Requirements vary by business type and state.',
    items: [
      'PAN of the business or proprietor',
      'Identity and address proof of the authorised signatory',
      'Proof of business address',
      'Bank account proof, such as a cancelled cheque or statement',
      'Photograph of the promoter or authorised signatory',
      'Incorporation or partnership documents, where applicable',
      'Authorisation letter or board resolution, where applicable',
    ],
  },
  {
    id: 'company-llp',
    title: 'Company and LLP registration',
    intro: 'Indicative documents for company or LLP incorporation. The firm confirms the requirements for your structure.',
    items: [
      'Identity and address proof of each proposed director or partner',
      'Digital signature certificates, where required',
      'Proof of registered office address and the owner’s consent',
      'Proposed name options',
      'Capital and shareholding or contribution details',
      'Bank account details for the entity',
    ],
  },
]

export const officialPortals = [
  {
    name: 'Income Tax e-Filing Portal',
    url: 'https://www.incometax.gov.in',
    purpose: 'Income tax e-filing and taxpayer services.',
  },
  {
    name: 'GST Portal',
    url: 'https://www.gst.gov.in',
    purpose: 'GST registration, returns and payments.',
  },
  {
    name: 'Ministry of Corporate Affairs (MCA)',
    url: 'https://www.mca.gov.in',
    purpose: 'Company and LLP registrations and filings.',
  },
  {
    name: 'Udyam Registration Portal',
    url: 'https://udyamregistration.gov.in',
    purpose: 'MSME (Udyam) registration.',
  },
]

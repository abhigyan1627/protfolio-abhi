// Service plans shown on the pricing page and in the service finder.
//
// IMPORTANT: every `price` below is an illustrative SAMPLE. Replace it with the client-approved fee before
// publishing, then set `pricing.showSampleNotice` to false in src/config/siteConfig.js.
//
// price:   number in INR, or null for a custom quotation.
// billing: 'one-time' | 'monthly' | 'annual' | 'custom'
// serviceIds: services this plan supports. Plans with no serviceIds appear under "Something else" in the finder.
export const plans = [
  {
    id: 'essential-itr',
    audience: 'individuals',
    serviceIds: ['itr-filing'],
    name: 'Essential ITR',
    summary: 'Basic income tax return filing assistance with a clear document checklist and filing-status updates.',
    targetCustomer: 'Individuals with a straightforward income profile and complete records.',
    price: 1499,
    billing: 'one-time',
    included: ['Basic ITR filing assistance', 'Document checklist', 'Filing-status communication'],
    excluded: [
      'Multiple or complex income sources',
      'Capital gains computation',
      'Responses to tax notices',
    ],
    additionalCharges: 'Government fees and third-party charges, where applicable, are disclosed before work begins.',
    enquiryIntro:
      'Hello, I visited your website and would like to enquire about the Essential ITR plan. Please share the eligibility requirements, documents required, applicable charges, and next steps.',
  },
  {
    id: 'itr-plus',
    audience: 'individuals',
    serviceIds: ['itr-filing'],
    name: 'ITR Plus',
    summary: 'ITR assistance for eligible additional income sources, with a document review based on the agreed scope.',
    targetCustomer:
      'Individuals with additional income sources, such as rental, capital gains or business income, as agreed in scope.',
    price: 2999,
    billing: 'one-time',
    included: [
      'ITR assistance for eligible additional income sources',
      'Document review based on the agreed scope',
      'Filing-related support',
      'Filing-status communication',
    ],
    excluded: ['Income sources outside the agreed scope', 'Responses to tax notices unless separately agreed'],
    additionalCharges: 'Additional income types beyond the agreed scope are quoted separately before work begins.',
    enquiryIntro:
      'Hello, I visited your website and would like to enquire about the ITR Plus plan. Please explain which additional income sources are covered, the document review process, and the applicable charges.',
  },
  {
    id: 'tax-consultation-plan',
    audience: 'individuals',
    serviceIds: ['tax-consultation'],
    name: 'Tax Consultation',
    summary: 'A consultation on one agreed tax-related question, with the scope and duration defined by the firm.',
    targetCustomer: 'Individuals who have a specific tax-related question.',
    price: 1999,
    billing: 'one-time',
    included: [
      'Consultation on one agreed tax question',
      'Scope and duration defined before the session',
      'Key points summarised where agreed',
    ],
    excluded: ['Preparation or filing of returns', 'Ongoing advisory after the session'],
    additionalCharges: 'Time beyond the agreed duration, or additional questions, are quoted separately.',
    enquiryIntro:
      'Hello, I visited your website and would like to book a Tax Consultation for a specific question. Please share the consultation scope, duration, applicable fees, and what I should prepare in advance.',
  },
  {
    id: 'gst-registration-plan',
    audience: 'businesses',
    serviceIds: ['gst-registration'],
    name: 'GST Registration',
    summary: 'Documentation assistance and application guidance for GST registration.',
    targetCustomer: 'Businesses and professionals that need to register for GST.',
    price: 2499,
    billing: 'one-time',
    included: [
      'Registration documentation assistance',
      'Application process guidance',
      'Review of details before submission',
    ],
    excluded: ['Ongoing GST return filing', 'Other registrations, such as trademarks or licences'],
    additionalCharges:
      'Government or professional charges, where applicable, are disclosed clearly before work begins.',
    enquiryIntro:
      'Hello, I visited your website and would like to enquire about the GST Registration plan. Please share the required documents, professional fees, applicable additional charges, and estimated process.',
  },
  {
    id: 'gst-compliance-plan',
    audience: 'businesses',
    serviceIds: ['gst-returns'],
    name: 'GST Compliance',
    summary: 'GST return preparation and filing assistance for an agreed monthly scope.',
    targetCustomer: 'Registered businesses with a defined monthly GST filing scope.',
    price: 1999,
    billing: 'monthly',
    included: [
      'GST return preparation within the agreed scope',
      'Defined monthly filing frequency',
      'Filing-status communication',
    ],
    excluded: ['Maintenance of books of accounts', 'Reconciliations beyond the agreed scope', 'Notices and assessments'],
    additionalCharges: 'Additional returns, higher data volumes or scope changes are quoted separately.',
    enquiryIntro:
      'Hello, I visited your website and am interested in the GST Compliance plan. Please explain the monthly filing scope, the return types covered, pricing, and the documents I need to share each month.',
  },
  {
    id: 'accounting-support-plan',
    audience: 'businesses',
    serviceIds: ['accounting-bookkeeping', 'startup-accounting'],
    name: 'Accounting Support',
    summary: 'Bookkeeping and accounting support within agreed transaction volumes and deliverables.',
    targetCustomer: 'Businesses that need monthly bookkeeping with a defined scope.',
    price: 3999,
    billing: 'monthly',
    included: [
      'Bookkeeping within agreed transaction limits',
      'Monthly ledger and bank reconciliation',
      'Monthly summary of agreed deliverables',
    ],
    excluded: ['Statutory audit', 'Transactions above the agreed volume', 'Tax assessments and notices'],
    additionalCharges: 'Transaction volume above the agreed limit is billed as an add-on.',
    enquiryIntro:
      'Hello, I visited your website and am interested in your Accounting Support plan. Please explain the monthly scope, transaction limits if applicable, pricing, and onboarding process.',
  },
  {
    id: 'startup-essentials-plan',
    audience: 'startups',
    serviceIds: ['company-incorporation', 'llp-registration'],
    name: 'Startup Essentials',
    summary: 'An initial compliance discussion, business registration guidance and a requirements checklist for new ventures.',
    targetCustomer: 'Founders planning to register a new business entity.',
    price: 4999,
    billing: 'one-time',
    included: ['Initial compliance discussion', 'Business registration guidance', 'Requirements checklist'],
    excluded: ['Government fees and stamp duty', 'Compliance after registration (see Startup Compliance)'],
    additionalCharges:
      'Government and registrar fees are disclosed separately and are not included in the professional fee.',
    enquiryIntro:
      'Hello, I visited your website and am planning to start a business. I am interested in the Startup Essentials plan. Please explain the initial compliance discussion, registration guidance, requirements checklist, and the government charges I should expect.',
  },
  {
    id: 'startup-compliance-plan',
    audience: 'startups',
    serviceIds: ['business-compliance'],
    name: 'Startup Compliance',
    summary: 'Agreed recurring compliance services for startups, with defined inclusions and exclusions.',
    targetCustomer: 'Startups and small companies with recurring statutory obligations.',
    price: 3499,
    billing: 'monthly',
    included: [
      'Agreed recurring compliance services',
      'Defined compliance calendar',
      'Monthly coordination of documents',
    ],
    excluded: ['Items outside the agreed compliance list', 'Statutory audit and certification'],
    additionalCharges: 'Additional compliance items are quoted in advance.',
    enquiryIntro:
      'Hello, I visited your website and am interested in the Startup Compliance plan. Please explain the recurring compliance services covered, the inclusions and exclusions, monthly pricing, and onboarding process.',
  },
  {
    id: 'business-advisory-plan',
    audience: 'startups',
    serviceIds: [],
    name: 'Business Advisory',
    summary: 'Consultation on agreed business or financial requirements, with a custom quotation when needed.',
    targetCustomer: 'Startups and businesses with specific financial, structuring or growth questions.',
    price: null,
    billing: 'custom',
    included: ['Consultation on agreed requirements', 'Custom quotation once the requirement is understood'],
    excluded: ['Implementation or execution unless separately agreed'],
    additionalCharges: 'Pricing is set after the requirement is understood.',
    enquiryIntro:
      'Hello, I visited your website and would like to discuss business advisory support. Please explain how the consultation works, what information you need from me, and whether a custom quotation is required.',
  },
]

export const planById = Object.fromEntries(plans.map((plan) => [plan.id, plan]))

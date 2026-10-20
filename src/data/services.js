// Services offered by the firm. Edit titles, copy, inclusions and scope notes here.
// `icon` must be a Lucide icon name registered in src/components/icons.js.
// `enquiryIntro` is the opening of the WhatsApp message for this service.
export const services = [
  {
    id: 'itr-filing',
    audience: 'individuals',
    title: 'Income Tax Return Filing',
    icon: 'FileText',
    summary:
      'Assistance with preparing and filing your income tax return, from the document checklist to a final review before submission.',
    intendedCustomer: 'Salaried individuals, professionals and individuals with more than one source of income.',
    inclusions: [
      'Document checklist tailored to your income sources',
      'Review of the details you share before filing',
      'Clear communication on filing status',
      'Guidance on the return form that applies to your case',
    ],
    scopeNote:
      'Eligibility, the applicable return form and the scope of work depend on your income sources. The firm confirms them before filing begins.',
    additionalCharges:
      'Government fees and third-party charges, where applicable, are disclosed before work begins.',
    enquiryIntro:
      'Hello, I would like to enquire about Income Tax Return Filing. Please share the documents required, the applicable charges, and the process for filing.',
  },
  {
    id: 'tax-consultation',
    audience: 'individuals',
    title: 'Tax Consultation',
    icon: 'MessageSquare',
    summary:
      'A focused consultation on a specific tax question, with the scope and duration agreed in advance.',
    intendedCustomer: 'Individuals and families who have a particular tax question to resolve.',
    inclusions: [
      'Agreed scope for the discussion',
      'Duration defined before the session',
      'Key points summarised where agreed',
    ],
    scopeNote:
      'A consultation covers the agreed question only. Guidance is based on the facts you share, and the firm may ask for documents before advising.',
    additionalCharges: 'Fees are confirmed before booking. Time beyond the agreed duration is quoted separately.',
    enquiryIntro:
      'Hello, I would like to enquire about a Tax Consultation. Please share the consultation scope, the duration, the applicable fees, and what I should prepare in advance.',
  },
  {
    id: 'tax-planning',
    audience: 'individuals',
    title: 'Tax Planning Assistance',
    icon: 'Compass',
    summary:
      'A planning discussion around your income, investments and deductions, based on the information you choose to share.',
    intendedCustomer: 'Individuals who want to plan their tax position ahead of the financial year.',
    inclusions: [
      'Review of the information you share',
      'Discussion of the options available to you',
      'Written action points, where agreed in scope',
    ],
    scopeNote:
      'Planning is general and depends on the information provided. It does not guarantee any particular tax outcome.',
    additionalCharges: 'Fees depend on the agreed scope and are confirmed before work begins.',
    enquiryIntro:
      'Hello, I would like to enquire about Tax Planning Assistance. Please explain how the planning process works, what information you need from me, and the applicable charges.',
  },
  {
    id: 'tds-individual',
    audience: 'individuals',
    title: 'TDS-Related Services',
    icon: 'Receipt',
    summary:
      'Help understanding tax deducted at source on your income and checking that TDS credits match your certificates.',
    intendedCustomer:
      'Salaried individuals, freelancers, professionals and landlords who have tax deducted at source.',
    inclusions: [
      'Review of the TDS certificates you share',
      'Reconciliation of TDS credits with your records',
      'Explanation of any differences found',
    ],
    scopeNote:
      'Reconciliation depends on the certificates and records available. Missing or incorrect entries usually need to be corrected by the deductor.',
    additionalCharges: 'The scope and fees are confirmed before work begins.',
    enquiryIntro:
      'Hello, I would like to enquire about TDS-related services for my income. Please share the documents I need, the scope of the review, and the applicable charges.',
  },
  {
    id: 'gst-registration',
    audience: 'businesses',
    title: 'GST Registration',
    icon: 'FileCheck',
    summary:
      'Documentation support and application guidance for GST registration, with a checklist and a review before submission.',
    intendedCustomer: 'Proprietors, partnerships, LLPs and companies that need GST registration.',
    inclusions: [
      'Registration document checklist',
      'Guidance on the application process',
      'Review of details before submission',
    ],
    scopeNote:
      'Whether registration is required depends on turnover, the nature of supply and state-specific rules. The firm confirms this for your case.',
    additionalCharges:
      'Government or portal charges, where applicable, and professional fees are disclosed separately.',
    enquiryIntro:
      'Hello, I would like to enquire about GST Registration services. Please share the required documents, professional fees, applicable additional charges, and estimated process.',
  },
  {
    id: 'gst-returns',
    audience: 'businesses',
    title: 'GST Return Filing',
    icon: 'Calculator',
    summary:
      'Preparation and filing assistance for GST returns, according to the agreed scope and filing frequency.',
    intendedCustomer: 'Registered businesses with regular GST filing obligations.',
    inclusions: [
      'Review of the sales and purchase data provided',
      'Return preparation within the agreed scope',
      'Filing-status communication',
    ],
    scopeNote: 'Scope depends on the return types, transaction volume and the quality of the data shared.',
    additionalCharges:
      'Fees are based on the agreed monthly scope. Additional returns or higher volumes are quoted separately.',
    enquiryIntro:
      'Hello, I would like to enquire about GST Return Filing. Please explain the return types covered, the monthly process, the documents I need to share, and pricing.',
  },
  {
    id: 'accounting-bookkeeping',
    audience: 'businesses',
    title: 'Accounting and Bookkeeping',
    icon: 'BookOpen',
    summary:
      'Recording of transactions and organised books of account, with the scope set by agreed transaction volumes.',
    intendedCustomer: 'Small and medium businesses that need organised, up-to-date books.',
    inclusions: [
      'Recording of transactions within the agreed scope',
      'Ledger and bank reconciliation',
      'Periodic summary of agreed deliverables',
    ],
    scopeNote: 'Transaction limits and deliverables are defined at onboarding.',
    additionalCharges: 'Transaction volume above the agreed limit may be charged as an add-on.',
    enquiryIntro:
      'Hello, I would like to enquire about Accounting and Bookkeeping. Please explain the monthly scope, transaction limits if applicable, pricing, and the onboarding process.',
  },
  {
    id: 'financial-reporting',
    audience: 'businesses',
    title: 'Financial Reporting',
    icon: 'TrendingUp',
    summary:
      'Financial statements and management reports prepared from your records, with a walkthrough of the key figures.',
    intendedCustomer:
      'Business owners who need regular reports for decisions, lenders or statutory requirements.',
    inclusions: [
      'Profit and loss statement and balance sheet preparation',
      'Management summary of key movements',
      'Walkthrough of the report with you',
    ],
    scopeNote: 'Reports depend on the completeness and timeliness of the records provided.',
    additionalCharges:
      'Statutory audit, certification and other assurance services are separate engagements.',
    enquiryIntro:
      'Hello, I would like to enquire about Financial Reporting. Please explain the reports included, the records I need to provide, pricing, and the process for preparing them.',
  },
  {
    id: 'tds-returns',
    audience: 'businesses',
    title: 'TDS Returns',
    icon: 'ClipboardList',
    summary:
      'Preparation and filing support for TDS returns for businesses that deduct tax at source.',
    intendedCustomer:
      'Businesses that pay salaries, rent, contractor or professional fees on which tax is deducted at source.',
    inclusions: [
      'Review of deduction records',
      'Return preparation within the agreed scope',
      'Guidance on challans and certificates',
    ],
    scopeNote: 'Filing depends on the timely availability of deduction and payment records.',
    additionalCharges:
      'Government fees, if any, are disclosed in advance. Interest or penalties for late deduction or payment are not part of the professional fee.',
    enquiryIntro:
      'Hello, I would like to enquire about TDS Return filing for my business. Please share the documents required, the process, and the applicable charges.',
  },
  {
    id: 'ongoing-compliance',
    audience: 'businesses',
    title: 'Ongoing Compliance Assistance',
    icon: 'CalendarCheck',
    summary:
      'Recurring support to keep your statutory obligations organised, based on a compliance list agreed in advance.',
    intendedCustomer: 'Growing businesses that want a structured compliance calendar and regular coordination.',
    inclusions: [
      'Agreed compliance calendar',
      'Reminders for the obligations in scope',
      'Coordinated collection of documents',
    ],
    scopeNote: 'Only the obligations listed in the agreed scope are covered.',
    additionalCharges: 'Additional obligations are quoted in advance.',
    enquiryIntro:
      'Hello, I would like to enquire about Ongoing Compliance Assistance. Please share the compliance list covered, how reminders and document collection work, and pricing.',
  },
  {
    id: 'company-incorporation',
    audience: 'startups',
    title: 'Company Incorporation Assistance',
    icon: 'Building2',
    summary:
      'Guidance and documentation support for incorporating a private limited company, from the name to the registration forms.',
    intendedCustomer: 'Founders planning to register a private limited company.',
    inclusions: [
      'Document and director details checklist',
      'Guidance on the incorporation process',
      'Coordination of the forms required',
    ],
    scopeNote:
      'Name availability and approval are decided by the authorities. The firm does not guarantee approval timelines.',
    additionalCharges:
      'Government filing fees, stamp duty and other statutory charges are disclosed separately.',
    enquiryIntro:
      'Hello, I would like to enquire about Company Incorporation Assistance. Please share the documents required, the process, the government charges, and your professional fees.',
  },
  {
    id: 'llp-registration',
    audience: 'startups',
    title: 'LLP Registration Assistance',
    icon: 'Users',
    summary:
      'Support for registering a Limited Liability Partnership, including the document checklist and process guidance.',
    intendedCustomer: 'Professionals and small business partners who prefer an LLP structure.',
    inclusions: [
      'Partner and document checklist',
      'Guidance on the registration process',
      'Review of details before filing',
    ],
    scopeNote:
      'Whether an LLP suits your plans depends on your business. The firm can discuss this during your enquiry.',
    additionalCharges: 'Government fees and filing charges are disclosed separately.',
    enquiryIntro:
      'Hello, I would like to enquire about LLP Registration Assistance. Please explain the documents required, the registration process, government charges, and professional fees.',
  },
  {
    id: 'business-compliance',
    audience: 'startups',
    title: 'Business Compliance',
    icon: 'ShieldCheck',
    summary:
      'Assistance with recurring compliance requirements for a registered business, within an agreed scope.',
    intendedCustomer: 'Startups and companies with ongoing statutory filings and records to maintain.',
    inclusions: [
      'Defined compliance list',
      'Coordination of documents',
      'Filing support for the agreed obligations',
    ],
    scopeNote: 'Inclusions and exclusions are set out in the agreed scope.',
    additionalCharges: 'Additional filings and one-time requirements are quoted separately.',
    enquiryIntro:
      'Hello, I would like to enquire about Business Compliance. Please share the compliance services included, the exclusions, the documents required, and pricing.',
  },
  {
    id: 'msme-udyam',
    audience: 'startups',
    title: 'MSME / Udyam Registration Assistance',
    icon: 'BadgeCheck',
    summary:
      'Help with Udyam registration, including the details to be entered and the documents to keep on record.',
    intendedCustomer: 'Micro, small and medium enterprises that want to register on the Udyam portal.',
    inclusions: [
      'Checklist of details and documents required',
      'Guidance on entering the registration details',
      'Review of the registration before submission',
    ],
    scopeNote:
      'Eligibility depends on the applicable enterprise classification criteria. The firm confirms this before registration.',
    additionalCharges: 'Professional fees are confirmed before work begins. Any government charges are disclosed separately.',
    enquiryIntro:
      'Hello, I would like to enquire about MSME / Udyam Registration Assistance. Please share the documents required, the registration process, and your professional fees.',
  },
  {
    id: 'startup-accounting',
    audience: 'startups',
    title: 'Startup Accounting Support',
    icon: 'Wallet',
    summary:
      'Bookkeeping and monthly accounting support designed around the needs and transaction volumes of early-stage businesses.',
    intendedCustomer: 'Early-stage startups with a defined set of transactions each month.',
    inclusions: [
      'Bookkeeping within agreed transaction limits',
      'Monthly ledger and bank reconciliation',
      'Monthly summary of agreed deliverables',
    ],
    scopeNote: 'Scope depends on transaction volume and the deliverables agreed at onboarding.',
    additionalCharges: 'Transaction volume above the agreed limit is billed as an add-on.',
    enquiryIntro:
      'Hello, I am a startup and would like to enquire about Startup Accounting Support. Please explain the monthly scope, transaction limits, pricing, and the onboarding process.',
  },
]

export const serviceById = Object.fromEntries(services.map((service) => [service.id, service]))

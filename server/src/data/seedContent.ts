// Proposed website content for CA Mohit Agrawal.
// Everything here is a draft for the owner to review and approve in the admin panel before launch.
// No prices, testimonials, qualifications, experience figures or statutory thresholds are included.
import type { Prisma } from '../generated/prisma/client.js';

type ServiceSeed = Prisma.ServiceUncheckedCreateInput;
type PlanSeed = Prisma.PlanUncheckedCreateInput;

const details = (
  overview: string,
  whoMayNeed: string[],
  documents: string[],
  deliverables: string[],
  exclusions: string[],
  faqs: { question: string; answer: string }[],
): Prisma.InputJsonValue => ({ overview, whoMayNeed, documents, deliverables, exclusions, faqs });

export const seedServices: ServiceSeed[] = [
  // Income Tax
  {
    name: 'ITR Filing Assistance',
    slug: 'itr-filing-assistance',
    category: 'INCOME_TAX',
    description: 'Organised preparation and filing support for individual income tax returns, with a clear document checklist.',
    iconKey: 'file-text',
    enabled: true,
    published: true,
    featured: true,
    displayOrder: 10,
    details: details(
      'We review the documents you share, confirm the applicable return form with you, prepare the return and assist with filing and the acknowledgement. Return details are confirmed with you before filing.',
      ['Salaried individuals with Form 16 and bank records', 'Individuals with business, rental or investment income to report', 'Taxpayers who want a documented review before filing'],
      ['PAN and Aadhaar-linked details (shared through our secure process, not this website)', 'Form 16 or salary statements, where applicable', 'Bank statements and interest certificates', 'Investment and deduction proofs', 'Details of any capital gains, rental or business income'],
      ['Document checklist and review notes', 'Prepared return for your confirmation', 'Filing assistance and acknowledgement copy'],
      ['Government fees and statutory charges', 'Notices or proceedings unless separately agreed', 'Tax outcomes or refunds, which depend on your facts and the law'],
      [
        { question: 'Do you guarantee a refund?', answer: 'No. Refunds and tax outcomes depend on your facts and the applicable law, so we do not guarantee them.' },
        { question: 'How should I share my documents?', answer: 'Do not send PAN, Aadhaar numbers, OTPs or bank credentials through this website. We will confirm a secure method when we follow up.' },
      ],
    ),
  },
  {
    name: 'Tax Consultation',
    slug: 'tax-consultation',
    category: 'INCOME_TAX',
    description: 'One-to-one consultation on tax questions about your income, investments or filings.',
    iconKey: 'landmark',
    enabled: true,
    published: true,
    featured: true,
    displayOrder: 20,
    details: details(
      'A structured discussion of your tax question, the facts involved and the points to consider. Advice is given after we review the relevant documents, and the scope is agreed in writing.',
      ['Individuals with a specific tax question', 'Families with several income sources', 'Anyone weighing a tax-related financial decision'],
      ['A short summary of your question', 'Relevant income and investment statements', 'Correspondence from the tax department, if relevant'],
      ['Summary of points discussed', 'Next steps agreed in writing where applicable'],
      ['Representation before tax authorities unless separately agreed', 'Written opinions for third parties', 'Fees, which are confirmed in your quotation'],
      [
        { question: 'Can you advise over WhatsApp?', answer: 'We can discuss scope and documents on WhatsApp. Detailed advice follows once the relevant documents are reviewed and the engagement is confirmed.' },
        { question: 'Will the advice be personalised?', answer: 'Yes, but it depends on the facts you provide. Please share complete and accurate information.' },
      ],
    ),
  },
  {
    name: 'Tax Planning Assistance',
    slug: 'tax-planning-assistance',
    category: 'INCOME_TAX',
    description: 'General tax planning support to help you understand options before making financial decisions.',
    iconKey: 'calculator',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 30,
    details: details(
      'We help you understand the tax implications of common financial decisions and the records that support them. Planning is based on your circumstances and the law in force at the time.',
      ['Individuals planning investments or major financial decisions', 'Business owners reviewing remuneration or drawings', 'Taxpayers who want a review during the year rather than at filing time'],
      ['Income projections', 'Existing investment statements', 'Details of planned transactions'],
      ['Planning notes covering options and their considerations', 'Checklist of records to maintain'],
      ['Arrangements designed to avoid compliance', 'Guaranteed savings', 'Statutory fees'],
      [
        { question: 'Does planning guarantee lower tax?', answer: 'No. Planning helps you understand options, but outcomes depend on your facts and the law.' },
        { question: 'When should I start?', answer: 'Planning discussions are useful at any point, but earlier is generally better for decisions that depend on timing.' },
      ],
    ),
  },
  {
    name: 'Tax Documentation Support',
    slug: 'tax-documentation-support',
    category: 'INCOME_TAX',
    description: 'Help organising tax records, certificates and supporting documents for filing and future reference.',
    iconKey: 'file-check',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 40,
    details: details(
      'We help you collect, sort and label the documents needed for your tax filings, and flag gaps early so nothing is missing when filing begins.',
      ['Individuals with several salary, bank or investment records', 'Taxpayers who receive many certificates each year', 'Families managing documents for more than one person'],
      ['Salary statements and Form 16, where applicable', 'Bank and investment statements', 'Certificates from banks, employers or institutions'],
      ['Organised document index', 'List of missing or unclear documents'],
      ['Verifying the authenticity of third-party documents', 'Preparation of returns unless separately engaged'],
      [
        { question: 'Do you keep my documents?', answer: 'We keep only the documents needed for the agreed service, in line with our privacy notice.' },
        { question: 'Is this the same as filing?', answer: 'No. It is the preparation step that makes filing easier. Filing can be added as a separate service.' },
      ],
    ),
  },
  {
    name: 'TDS-Related Services',
    slug: 'tds-related-services',
    category: 'INCOME_TAX',
    description: 'Support with TDS questions, records and reconciliation of certificates against your books.',
    iconKey: 'receipt',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 50,
    details: details(
      'We assist with understanding deduction obligations, reviewing TDS records and reconciling certificates against your books or tax records.',
      ['Businesses that deduct tax at source', 'Individuals receiving tax-deducted payments', 'Organisations reviewing their TDS records'],
      ['Payment and deduction details', 'TDS certificates received', 'Ledger or bank records for the relevant period'],
      ['Reconciliation summary', 'Notes on identified differences'],
      ['Filing of TDS returns unless separately agreed', 'Government fees'],
      [
        { question: 'Do you file TDS returns?', answer: 'Filing support is offered only where it is confirmed in your quotation.' },
        { question: 'Can you reconcile with my books?', answer: 'Yes, based on the records you provide.' },
      ],
    ),
  },

  // GST
  {
    name: 'GST Registration Assistance',
    slug: 'gst-registration-assistance',
    category: 'GST',
    description: 'Assistance preparing and submitting a GST registration application with the right documents.',
    iconKey: 'building',
    enabled: true,
    published: true,
    featured: true,
    displayOrder: 110,
    details: details(
      'We discuss your activity, check whether registration appears to apply at a general level, prepare the application details with you and help you gather the required documents. Whether registration is required depends on your turnover, supplies and the rules in force.',
      ['Traders and service providers starting a new business', 'Businesses that have crossed or expect to cross registration limits', 'Businesses considering voluntary registration where it is permitted'],
      ['PAN of the business or proprietor', 'Address proof for the place of business', 'Bank account details', 'Identity and photograph of the authorised signatory', 'Incorporation or partnership documents, where applicable'],
      ['Document checklist', 'Application details prepared for your review', 'Submission support and a record of the reference number'],
      ['Government fees, if any', 'Representation in GST proceedings unless agreed', 'Final eligibility decisions, which rest with the law and the authorities'],
      [
        { question: 'Do I always need GST registration?', answer: 'Not always. It depends on your turnover, the nature of your supplies and applicable rules. We can discuss your position.' },
        { question: 'How long does registration take?', answer: 'Timelines depend on the authorities and verification steps, so we cannot guarantee one.' },
      ],
    ),
  },
  {
    name: 'GST Return Filing',
    slug: 'gst-return-filing',
    category: 'GST',
    description: 'Periodic GST return preparation supported by organised sales and purchase records.',
    iconKey: 'receipt',
    enabled: true,
    published: true,
    featured: true,
    displayOrder: 120,
    details: details(
      'We reconcile sales and purchase records, prepare return details with you and assist with filing. The return frequency depends on your registration type.',
      ['Registered taxpayers who need regular return support', 'Businesses with high invoice volumes', 'Businesses that want reconciliation before filing'],
      ['Sales invoices for the period', 'Purchase invoices and input credit details', 'Credit and debit notes', 'Export or exempt supply records, where applicable'],
      ['Reconciliation summary', 'Return details for your review', 'Filing confirmation record'],
      ['Late fees, interest or penalties arising from delayed information', 'Government charges', 'Accuracy of information you supply'],
      [
        { question: 'What if my records are incomplete?', answer: 'We will list the gaps. Incomplete records can delay filing or affect the return.' },
        { question: 'Do you check my suppliers?', answer: 'We review the data you provide. Supplier compliance checks are scoped separately if required.' },
      ],
    ),
  },
  {
    name: 'GST Compliance Support',
    slug: 'gst-compliance-support',
    category: 'GST',
    description: 'Ongoing GST compliance support, including record checks, reminders and periodic reviews.',
    iconKey: 'shield-check',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 130,
    details: details(
      'We help you keep GST records, invoices and filings in order through the year, with periodic review of common compliance points.',
      ['Registered businesses wanting ongoing support', 'Businesses with frequent GST transactions', 'Businesses changing how they supply goods or services'],
      ['Invoice registers', 'Monthly purchase and sales data', 'Records of tax payments'],
      ['Periodic compliance checklist', 'Review notes', 'Filing steps for each period, with dates confirmed at the time'],
      ['Litigation or notices unless separately agreed', 'Government fees'],
      [
        { question: 'Is this the same as return filing?', answer: 'It can include filing, but it covers broader ongoing checks. Scope is confirmed in your quotation.' },
        { question: 'Do you handle notices?', answer: 'Responses to notices are handled only where separately agreed.' },
      ],
    ),
  },
  {
    name: 'GST-Related Consultation',
    slug: 'gst-consultation',
    category: 'GST',
    description: 'Consultation on GST questions such as invoicing, input credit and classification.',
    iconKey: 'book-open',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 140,
    details: details(
      'We discuss your GST question using the facts you provide and explain the points that need professional review. Advice is scoped in writing.',
      ['Businesses unsure about invoicing or input credit', 'Exporters and importers with questions', 'Businesses reviewing an existing GST position'],
      ['Summary of the transaction or question', 'Relevant invoices', 'Any notice or communication received, if applicable'],
      ['Consultation notes', 'Recommended next steps'],
      ['Guarantee of any tax position', 'Representation before authorities unless agreed'],
      [
        { question: 'Will the answer be final?', answer: 'Positions depend on current law and facts. Important decisions should be confirmed in writing before you act.' },
        { question: 'Can you review invoices?', answer: 'Yes, samples can be reviewed as part of the consultation.' },
      ],
    ),
  },

  // Business and Company
  {
    name: 'Company Incorporation Assistance',
    slug: 'company-incorporation-assistance',
    category: 'BUSINESS_COMPANY',
    description: 'Documentation support for registering a company, from name selection to incorporation filings.',
    iconKey: 'building',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 210,
    details: details(
      'We help you gather the documents and information needed to register a company, coordinate the filings and explain the steps after incorporation. Timelines depend on the registry.',
      ['Founders planning to register a company', 'Businesses converting from a partnership or sole proprietorship', 'Groups setting up a new entity'],
      ['Identity and address proof of directors and shareholders', 'Proposed company names', 'Registered office proof', 'Share capital and director details'],
      ['Document checklist', 'Filing support', 'Post-incorporation compliance checklist'],
      ['Registry and government fees', 'Digital signature certificates purchased from third parties', 'Drafting of shareholder or legal agreements, unless separately arranged with a suitable professional'],
      [
        { question: 'Do you guarantee name approval?', answer: 'No. The registry decides whether a name is approved.' },
        { question: 'What about GST and PAN?', answer: 'Registrations such as GST may be needed after incorporation depending on your activity. We can advise on them.' },
      ],
    ),
  },
  {
    name: 'LLP Registration Assistance',
    slug: 'llp-registration-assistance',
    category: 'BUSINESS_COMPANY',
    description: 'Support with LLP incorporation documents and initial filings for partners.',
    iconKey: 'users',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 220,
    details: details(
      'We help you gather partner details, registered office information and incorporation documents, then assist with filing.',
      ['Professionals and partners forming a limited liability partnership', 'Groups wanting limited liability with partnership flexibility'],
      ['Partner identity and address proof', 'Registered office proof', 'Details of the proposed LLP agreement'],
      ['Document checklist', 'Filing support'],
      ['Registry and government fees', 'Drafting of the LLP agreement unless separately arranged'],
      [
        { question: 'Do you draft the LLP agreement?', answer: 'Drafting legal agreements is outside our standard scope. We can coordinate with a suitable professional and review accounting and compliance terms.' },
        { question: 'Do LLPs need annual compliance?', answer: 'LLPs have ongoing filing obligations. We can outline them when we discuss your requirement.' },
      ],
    ),
  },
  {
    name: 'Business Compliance',
    slug: 'business-compliance',
    category: 'BUSINESS_COMPANY',
    description: 'Compliance support for businesses, covering statutory registers, filings and a practical compliance calendar.',
    iconKey: 'scale',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 230,
    details: details(
      'We review the compliance obligations relevant to your business and set up a practical checklist and routine so that filings are not missed.',
      ['Private companies and LLPs needing ongoing compliance', 'Proprietors with statutory registrations', 'Businesses that have had missed or late filings'],
      ['Registration certificates', 'Statutory register details', 'Records of previous filings'],
      ['Compliance checklist', 'Periodic review summary'],
      ['Penalties, additional fees or late charges', 'Legal representation before authorities'],
      [
        { question: 'Will you remind me of deadlines?', answer: 'Reminders can be part of the agreed routine. Deadlines are confirmed for each period.' },
        { question: 'Can you fix past missed filings?', answer: 'We can review the position and suggest steps. Any additional charges are the responsibility of the business.' },
      ],
    ),
  },
  {
    name: 'Startup Compliance Support',
    slug: 'startup-compliance-support',
    category: 'BUSINESS_COMPANY',
    description: 'Practical compliance support for early-stage businesses, from registrations to ongoing filings.',
    iconKey: 'rocket',
    enabled: true,
    published: true,
    featured: true,
    displayOrder: 240,
    details: details(
      'We help startups set up compliance foundations, track filing requirements and keep records organised as the business grows.',
      ['Early-stage founders', 'Startups preparing to hire or raise funds', 'Teams setting up their first compliance routine'],
      ['Incorporation documents', 'Bank account and capital details', 'Summary of contracts and invoices'],
      ['Startup compliance checklist', 'Basic record-keeping guidance'],
      ['Investor due diligence reports unless separately agreed', 'Government fees'],
      [
        { question: 'Do you work with early-stage founders?', answer: 'Yes. Scope and fees are discussed based on the stage and needs of the business.' },
        { question: 'Is this a one-time service?', answer: 'It can be one-time or ongoing. Your quotation will say which applies.' },
      ],
    ),
  },
  {
    name: 'MSME / Udyam Registration Assistance',
    slug: 'msme-udyam-registration',
    category: 'BUSINESS_COMPANY',
    description: 'Assistance with Udyam registration details and documents for micro, small and medium enterprises.',
    iconKey: 'briefcase',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 250,
    details: details(
      'We review your business details, help you prepare the registration information and confirm the documents needed. Eligibility is based on the criteria in force at the time.',
      ['Proprietors, partnerships and companies seeking MSME registration', 'Businesses wanting to check eligibility', 'Businesses updating existing registration details'],
      ['Identity details of the proprietor or authorised signatory (shared securely, not via this website)', 'PAN and business details', 'Bank account details', 'Description of business activity'],
      ['Document checklist', 'Registration details prepared for your review', 'Confirmation record'],
      ['Guarantee of eligibility', 'Government charges, if any', 'Benefits or scheme approvals, which are decided by the authorities'],
      [
        { question: 'Is Udyam registration free?', answer: 'Any government charges are not part of our fee. Please confirm the current position on the official portal before applying.' },
        { question: 'Can I update my details later?', answer: 'Updates can be assisted. Please enquire with your business details.' },
      ],
    ),
  },

  // Accounting and Finance
  {
    name: 'Bookkeeping',
    slug: 'bookkeeping',
    category: 'ACCOUNTING_FINANCE',
    description: 'Regular recording of business transactions so your books stay accurate and up to date.',
    iconKey: 'book-open',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 310,
    details: details(
      'We record bills, receipts, bank entries and adjustments from the records you provide, then reconcile accounts on an agreed schedule.',
      ['Small businesses without in-house accounts staff', 'Traders with high transaction volumes', 'Businesses needing cleaner records for compliance'],
      ['Bank statements', 'Sales and purchase bills', 'Expense receipts', 'Payroll summary, where applicable'],
      ['Updated books for the agreed period', 'Bank reconciliation', 'Monthly summary'],
      ['Stock valuation or audit of books unless agreed', 'Responsibility for source documents not provided'],
      [
        { question: 'Do I need accounting software?', answer: 'Software can be used if it suits your business. We can work with the records and format you already use.' },
        { question: 'How often are books updated?', answer: 'The schedule is agreed when we start, usually monthly.' },
      ],
    ),
  },
  {
    name: 'Accounting Support',
    slug: 'accounting-support',
    category: 'ACCOUNTING_FINANCE',
    description: 'Ongoing accounting support for day-to-day finance questions, reviews and year-end readiness.',
    iconKey: 'calculator',
    enabled: true,
    published: true,
    featured: true,
    displayOrder: 320,
    details: details(
      'We support your accounting with periodic reviews, ledger checks, closing support and answers to everyday accounting questions.',
      ['Businesses that need an accountant on call', 'Owners reviewing monthly results', 'Businesses preparing for year-end'],
      ['Ledger extracts', 'Bank statements', 'Invoices and expense records'],
      ['Review notes', 'Year-end readiness checklist', 'Summary of open items'],
      ['Audit assurance', 'Preparation of statutory audit reports'],
      [
        { question: 'Is this the same as an audit?', answer: 'No. Accounting support is not an audit and does not provide audit assurance.' },
        { question: 'Can I ask questions between reviews?', answer: 'Yes, within the scope agreed in your engagement.' },
      ],
    ),
  },
  {
    name: 'Financial Reporting',
    slug: 'financial-reporting',
    category: 'ACCOUNTING_FINANCE',
    description: 'Management and financial reports prepared from your books to support decisions and compliance.',
    iconKey: 'line-chart',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 330,
    details: details(
      'We prepare periodic financial statements and management reports in a clear format, with notes on significant movements.',
      ['Business owners wanting monthly management reports', 'Businesses preparing information for lenders or partners', 'Companies needing statements for compliance'],
      ['Trial balance or ledger data', 'Bank and loan details', 'Notes on significant transactions'],
      ['Financial statements summary', 'Management report pack', 'Notes on key movements'],
      ['Statutory audit opinion', 'Valuation reports unless separately agreed'],
      [
        { question: 'Can reports be customised?', answer: 'Yes. The format and frequency are agreed with you.' },
        { question: 'Are these audited?', answer: 'No. Reports prepared here are not audit opinions.' },
      ],
    ),
  },
  {
    name: 'Business Documentation',
    slug: 'business-documentation',
    category: 'ACCOUNTING_FINANCE',
    description: 'Preparation and organisation of business documents and record files for compliance and applications.',
    iconKey: 'file-check',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 340,
    details: details(
      'We help you assemble and organise documents needed for registrations, bank applications, tenders and compliance, and check that key details are consistent.',
      ['Businesses preparing documents for bank or government applications', 'Owners organising records for a transaction', 'Businesses needing consistent statements of accounts'],
      ['Registration certificates', 'Financial statements', 'Identity and address proof of directors or partners'],
      ['Document index', 'Consistency review notes'],
      ['Legal drafting', 'Certification of documents we have not verified'],
      [
        { question: 'Do you prepare legal agreements?', answer: 'No. We organise and check financial and compliance documentation.' },
        { question: 'Can you review my existing documents?', answer: 'Yes, for consistency and completeness.' },
      ],
    ),
  },
  {
    name: 'Ongoing Accounting Assistance',
    slug: 'ongoing-accounting-assistance',
    category: 'ACCOUNTING_FINANCE',
    description: 'A continuing arrangement combining bookkeeping, filing support and periodic reviews on a set schedule.',
    iconKey: 'wallet',
    enabled: true,
    published: true,
    featured: false,
    displayOrder: 350,
    details: details(
      'Ongoing assistance brings regular bookkeeping, compliance reminders and reporting into one agreed routine, scoped to your business.',
      ['Growing businesses wanting a dependable routine', 'Businesses that prefer predictable monthly support', 'Startups without in-house finance staff'],
      ['Monthly bank statements', 'Sales and purchase records', 'Expense receipts'],
      ['Monthly books and summary', 'Compliance reminders', 'Periodic review notes'],
      ['Fees for third-party software or subscriptions', 'Statutory fees'],
      [
        { question: 'Is there a fixed monthly fee?', answer: 'Fees are set out in your quotation. Plans that show a price state their billing frequency.' },
        { question: 'Can I cancel?', answer: 'Notice and exit terms are set out in the engagement letter.' },
      ],
    ),
  },

  // Audit and Other (disabled until the owner confirms the practice offers them)
  {
    name: 'Audit-Related Services',
    slug: 'audit-related-services',
    category: 'AUDIT_OTHER',
    description: 'Audit-related services, where offered by the practice. Hidden until the owner confirms the scope.',
    iconKey: 'shield-check',
    enabled: false,
    published: false,
    featured: false,
    displayOrder: 410,
    details: details(
      'Audit-related services are listed only after the practice confirms the scope it offers. Please enquire about current availability.',
      ['Owners asking about audit-related support'],
      ['To be confirmed by the practice'],
      ['To be confirmed by the practice'],
      ['To be confirmed by the practice'],
      [],
    ),
  },
  {
    name: 'Other Professional Services',
    slug: 'other-professional-services',
    category: 'AUDIT_OTHER',
    description: 'Other owner-approved professional services. Hidden until the owner adds the details.',
    iconKey: 'briefcase',
    enabled: false,
    published: false,
    featured: false,
    displayOrder: 420,
    details: details(
      'Additional professional services will be listed here once the practice has approved their scope and documentation.',
      ['To be confirmed by the practice'],
      ['To be confirmed by the practice'],
      ['To be confirmed by the practice'],
      ['To be confirmed by the practice'],
      [],
    ),
  },
];

export const seedPlans: PlanSeed[] = [
  // Individual
  {
    name: 'Essential ITR',
    slug: 'essential-itr',
    audience: 'INDIVIDUAL',
    serviceCategory: 'INCOME_TAX',
    description: 'Document review and ITR filing assistance for individuals with straightforward income sources.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'PER_FILING',
    additionalCharges: 'Government fees and statutory charges are extra. Additional documents or complex income types are quoted separately.',
    targetCustomer: 'Salaried individuals with standard income and deductions',
    inclusions: ['Review of documents you share', 'Preparation of return for your confirmation', 'Filing assistance and acknowledgement copy'],
    exclusions: ['Business or capital gains computations', 'Notices or proceedings', 'Government fees'],
    published: true,
    featured: true,
    displayOrder: 10,
  },
  {
    name: 'ITR Plus',
    slug: 'itr-plus',
    audience: 'INDIVIDUAL',
    serviceCategory: 'INCOME_TAX',
    description: 'Return filing for individuals with additional income sources such as rent, investments or capital gains.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'PER_FILING',
    additionalCharges: 'Government fees and statutory charges are extra. Complex capital gains or foreign reporting are quoted separately.',
    targetCustomer: 'Individuals with several income heads',
    inclusions: ['Everything in Essential ITR', 'Review of additional income schedules', 'Basic guidance on documents for capital transactions'],
    exclusions: ['Complex capital gains computations unless quoted', 'Foreign income and asset reporting unless quoted', 'Government fees'],
    published: true,
    featured: false,
    displayOrder: 20,
  },
  {
    name: 'Tax Consultation',
    slug: 'tax-consultation-plan',
    audience: 'INDIVIDUAL',
    serviceCategory: 'INCOME_TAX',
    description: 'Scheduled consultation on a specific tax question, with a written summary of points discussed.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'CUSTOM',
    additionalCharges: 'Filing support, if needed, is quoted separately.',
    targetCustomer: 'Individuals with a specific tax question',
    inclusions: ['One consultation session (duration agreed in advance)', 'Written summary of points discussed'],
    exclusions: ['Filing of returns', 'Representation before tax authorities'],
    published: true,
    featured: false,
    displayOrder: 30,
  },

  // Business
  {
    name: 'GST Registration Assistance',
    slug: 'gst-registration-plan',
    audience: 'BUSINESS',
    serviceCategory: 'GST',
    description: 'Application preparation and submission support for GST registration.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'ONE_TIME',
    additionalCharges: 'Government fees, if any, are extra.',
    targetCustomer: 'Traders and service providers registering for GST',
    inclusions: ['Eligibility discussion at a general level', 'Document checklist', 'Application details prepared for your review', 'Submission support'],
    exclusions: ['Government fees', 'Representation in GST proceedings'],
    published: true,
    featured: false,
    displayOrder: 10,
  },
  {
    name: 'GST Compliance',
    slug: 'gst-compliance-plan',
    audience: 'BUSINESS',
    serviceCategory: 'GST',
    description: 'Monthly GST return support with reconciliation and compliance checks.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'MONTHLY',
    additionalCharges: 'Government charges, late fees and penalties are not included.',
    targetCustomer: 'Registered businesses with regular GST filings',
    inclusions: ['Monthly reconciliation of sales and purchases', 'Return details prepared for review', 'Filing support', 'Compliance checklist'],
    exclusions: ['Late fees, interest or penalties', 'Notices or litigation', 'Government charges'],
    published: true,
    featured: true,
    displayOrder: 20,
  },
  {
    name: 'Monthly Accounting Support',
    slug: 'monthly-accounting-support',
    audience: 'BUSINESS',
    serviceCategory: 'ACCOUNTING_FINANCE',
    description: 'Monthly bookkeeping, reconciliation and summary reporting for small businesses.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'MONTHLY',
    additionalCharges: 'Accounting software subscriptions, if used, are not included.',
    targetCustomer: 'Small businesses that need monthly books',
    inclusions: ['Monthly recording of transactions', 'Bank reconciliation', 'Monthly summary report'],
    exclusions: ['Audit assurance', 'Stock valuation unless agreed', 'Software subscriptions'],
    published: true,
    featured: false,
    displayOrder: 30,
  },

  // Startup
  {
    name: 'Startup Essentials',
    slug: 'startup-essentials',
    audience: 'STARTUP',
    serviceCategory: 'BUSINESS_COMPANY',
    description: 'Core setup support for new startups: registration documents, an initial compliance checklist and record structure.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'ONE_TIME',
    additionalCharges: 'Registry fees, government charges and third-party costs are extra.',
    targetCustomer: 'Founders at the set-up stage',
    inclusions: ['Document checklist for setup', 'Initial compliance checklist', 'Basic record-keeping structure'],
    exclusions: ['Registry and government fees', 'Drafting of legal agreements'],
    published: true,
    featured: true,
    displayOrder: 10,
  },
  {
    name: 'Startup Compliance',
    slug: 'startup-compliance',
    audience: 'STARTUP',
    serviceCategory: 'BUSINESS_COMPANY',
    description: 'Ongoing statutory compliance tracking and filing support for growing startups.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'ANNUAL',
    additionalCharges: 'Government fees, late charges and penalties are not included.',
    targetCustomer: 'Startups with active compliance obligations',
    inclusions: ['Compliance calendar for the year', 'Filing support for agreed statutory returns', 'Periodic review notes'],
    exclusions: ['Government fees', 'Late charges or penalties', 'Investor due diligence'],
    published: true,
    featured: false,
    displayOrder: 20,
  },
  {
    name: 'Business Advisory',
    slug: 'business-advisory',
    audience: 'STARTUP',
    serviceCategory: 'ACCOUNTING_FINANCE',
    description: 'Advisory sessions on financial planning, structure and reporting for startups and owner-managed businesses.',
    priceInPaise: null,
    currency: 'INR',
    billingFrequency: 'CUSTOM',
    additionalCharges: 'Third-party reports or valuations are quoted separately.',
    targetCustomer: 'Startups and owner-managed businesses seeking structured guidance',
    inclusions: ['Scoped advisory sessions', 'Written notes of recommendations', 'Review of financial reporting'],
    exclusions: ['Investment or valuation reports unless quoted', 'Guarantee of commercial outcomes'],
    published: true,
    featured: false,
    displayOrder: 30,
  },
];

export const seedFaqs: { question: string; answer: string; scope: 'GENERAL' | 'HOME' | 'SERVICES' | 'PRICING'; displayOrder: number }[] = [
  {
    question: 'Do you publish fixed prices?',
    answer: 'Where a plan does not show a price, we quote after understanding your requirement, volume and documents. Every quotation states what is included, what is excluded, and any statutory fees or third-party costs.',
    scope: 'HOME',
    displayOrder: 10,
  },
  {
    question: 'Which documents will I need?',
    answer: 'Each service page lists a typical documentation checklist. We confirm the exact list after reviewing your situation.',
    scope: 'HOME',
    displayOrder: 20,
  },
  {
    question: 'What happens after I send an enquiry?',
    answer: 'We review your enquiry, reply using the contact method you selected, confirm documents and scope, and share a quotation before any work begins.',
    scope: 'SERVICES',
    displayOrder: 10,
  },
  {
    question: 'Can you guarantee a refund or a tax saving?',
    answer: 'No. Tax outcomes and refunds depend on your facts and the law in force. We provide professional guidance but do not guarantee specific results.',
    scope: 'GENERAL',
    displayOrder: 10,
  },
  {
    question: 'Is it safe to send my documents?',
    answer: 'Please do not send PAN or Aadhaar numbers, OTPs, bank passwords or other sensitive details through the website form or WhatsApp. We will explain the secure way to share documents when we follow up.',
    scope: 'GENERAL',
    displayOrder: 20,
  },
  {
    question: 'What do "Per filing" and "Monthly" mean on plans?',
    answer: 'Per filing plans are charged for each return or filing covered. Monthly and annual plans are charged for each period stated on the plan. Your quotation confirms the exact charges.',
    scope: 'PRICING',
    displayOrder: 10,
  },
  {
    question: 'Do you work with clients outside Gopalganj?',
    answer: 'Please enquire on WhatsApp. Whether a service can be handled remotely depends on the service and the documents involved, and we confirm this when we reply.',
    scope: 'GENERAL',
    displayOrder: 30,
  },
  {
    question: 'What are your office hours?',
    answer: 'Office hours are being confirmed. Please reach us on WhatsApp or by phone and we will confirm availability for your enquiry.',
    scope: 'GENERAL',
    displayOrder: 40,
  },
];

export const seedResources: {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
}[] = [
  {
    title: 'ITR documentation checklist (general guide)',
    slug: 'itr-documentation-checklist',
    category: 'Income Tax',
    excerpt: 'A general checklist of the records people often gather before filing an income tax return.',
    body: `Gathering records early makes filing smoother and reduces the chance of missing an item. This list is general. Your actual requirements depend on your income sources and the return form that applies to you.

## Commonly needed records

- PAN and identity details
- Salary statements and Form 16, where you are salaried
- Bank statements and interest certificates for the year
- Investment, insurance and deduction proofs
- Rent receipts and property details, if you have rental income
- Records of capital transactions, such as sales of shares or property
- Records of business or professional income, if applicable

## Before you start

Check that the details on your bank accounts and tax records match. Mismatches are a common cause of avoidable questions.

## Important

Forms, rules and limits change from year to year. Confirm the position for the year you are filing before you act on any of this information.`,
  },
  {
    title: 'GST registration: a general overview',
    slug: 'gst-registration-overview',
    category: 'GST',
    excerpt: 'How GST registration generally works, what to consider before applying, and when to ask for advice.',
    body: `GST registration depends on several factors, including turnover, the nature of supplies, whether supplies cross state borders, and any category-specific rules. Limits and categories are set by law and can change, so this guide does not state them.

## Questions to answer first

- Is your business making taxable supplies?
- Do your supplies cross state borders?
- Are you selling through an e-commerce platform or supplying to one?
- Do you have a clear place of business and bank account?

## Documents usually needed

- PAN of the business or proprietor
- Address proof for each place of business
- Bank account details
- Identity and photograph of authorised signatories
- Incorporation or partnership documents, where applicable

## Common mistakes

- Address or bank details that do not match official records
- Applying without checking whether registration is actually required
- Missing authorised signatory details

Speak to a professional before making a decision that depends on your specific facts.`,
  },
  {
    title: 'GST return filing: common documentation',
    slug: 'gst-return-documentation',
    category: 'GST',
    excerpt: 'The records that help GST returns get prepared accurately and on time.',
    body: `Accurate GST returns depend on complete and consistent records. Keeping them organised through the period makes the filing process much easier.

## Records to keep

- Sales invoices issued in the period
- Purchase invoices received, with supplier details
- Credit notes and debit notes
- Records of tax paid and payment challans
- Documentation for exports or exempt supplies, where applicable
- E-way bill records, where relevant to your goods movement

## Monthly routine

- Match purchase invoices against the GST data available to you
- Record credit and debit notes as they arise
- Reconcile sales with bank receipts
- Note any invoices that are incomplete or disputed

## Keep in mind

Filing frequency and forms depend on your registration type and the rules in force. Confirm the requirements for your return before filing.`,
  },
  {
    title: 'Basic accounting practices for small businesses',
    slug: 'basic-accounting-practices',
    category: 'Accounting',
    excerpt: 'Simple habits that keep a small business books accurate and easier to review.',
    body: `Good accounting is mostly about routine. A few consistent habits make a large difference to how easily your books can be reviewed.

## Habits that help

- Record transactions promptly, not at the end of the year
- Keep bills and receipts in one place, either physically or digitally
- Reconcile bank accounts at least monthly
- Keep personal and business expenses separate
- Review outstanding receivables and payables every month

## Why it matters

Clean records support tax filings, lender discussions and better business decisions. They also reduce the time needed for year-end work.

## Getting help

If you are unsure how to record a transaction, ask before the entry is made. Correcting entries later is usually more work than getting them right the first time.`,
  },
  {
    title: 'Business compliance checklist',
    slug: 'business-compliance-checklist',
    category: 'Compliance',
    excerpt: 'A general framework for tracking the registrations, records and filings most businesses must maintain.',
    body: `Most businesses have several compliance obligations that run on different schedules. Tracking them in one place helps prevent missed filings.

## Areas to track

- Business registrations and their renewals
- Tax registrations, returns and payments
- Statutory registers maintained by the company or LLP
- Employee-related records, where you employ staff
- Bank and accounting records supporting filings

## Setting up a routine

- Maintain a single compliance calendar with owners for each task
- Review the calendar at the start of each month
- Keep copies of every filing and acknowledgement

## Note

Due dates and requirements depend on your business type and location, and they change over time. Confirm them with your CA for your situation.`,
  },
];

// The three customer groups used by the pricing tabs, the services page and the service finder.
export const audiences = [
  {
    id: 'individuals',
    label: 'Individuals',
    finderLabel: 'Individual',
    finderHint: 'Your own return, a tax question, TDS or planning support.',
    servicesHeading: 'Individual Services',
    intro:
      'Income tax filing, tax consultation, planning and TDS support for salaried professionals, self-employed individuals and anyone with more than one source of income.',
  },
  {
    id: 'businesses',
    label: 'Businesses',
    finderLabel: 'Established Business',
    finderHint: 'GST, accounting, reporting and recurring compliance.',
    servicesHeading: 'Business Services',
    intro:
      'GST, accounting, financial reporting and recurring compliance for proprietors, partnerships, LLPs and companies that are already operating.',
  },
  {
    id: 'startups',
    label: 'Startups',
    finderLabel: 'Startup',
    finderHint: 'Company or LLP set-up, registrations and early compliance.',
    servicesHeading: 'Startup and Company Services',
    intro:
      'Entity formation, registrations and compliance set-up for founders who are starting out, with support as the business grows.',
  },
]

export const audienceById = Object.fromEntries(audiences.map((audience) => [audience.id, audience]))

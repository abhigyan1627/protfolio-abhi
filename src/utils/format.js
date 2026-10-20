const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const BILLING_DISPLAY = {
  'one-time': 'One-time',
  monthly: 'Monthly',
  annual: 'Annual',
  custom: 'Custom quote',
}

const BILLING_PHRASE = {
  'one-time': 'one-time',
  monthly: 'per month',
  annual: 'per year',
  custom: 'custom quotation',
}

/** Formats a plan price in INR, or "Custom quote" when the plan has no fixed price. */
export function formatPrice(plan) {
  return plan.price == null ? 'Custom quote' : rupees.format(plan.price)
}

/** Short billing label for display, such as "One-time" or "Monthly". */
export function billingDisplay(plan) {
  return BILLING_DISPLAY[plan.billing] ?? ''
}

/** Billing phrase for sentences, such as "per month". */
export function billingPhrase(plan) {
  return BILLING_PHRASE[plan.billing] ?? ''
}

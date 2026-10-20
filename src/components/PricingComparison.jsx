import { audienceById } from '../data/audiences'
import { plans } from '../data/plans'
import { billingDisplay, billingPhrase, formatPrice } from '../utils/format'
import { buildPlanMessage } from '../utils/whatsapp'
import WhatsAppCta from './WhatsAppCta'

/**
 * Side-by-side comparison of the plans for one customer group. On small screens the table scrolls inside its
 * own region, with the feature column held in place, so the page itself never scrolls sideways.
 */
export default function PricingComparison({ audience }) {
  const group = plans.filter((plan) => plan.audience === audience)
  const label = audienceById[audience].label

  const rows = [
    { label: 'Billing', render: (plan) => billingDisplay(plan) },
    {
      label: 'Price',
      render: (plan) => (
        <span className="font-semibold text-navy-900">
          {formatPrice(plan)}
          {plan.price != null && <span className="font-normal text-charcoal-700"> · {billingPhrase(plan)}</span>}
        </span>
      ),
    },
    { label: 'Target customer', render: (plan) => plan.targetCustomer },
    {
      label: 'Included',
      render: (plan) => (
        <ul className="list-disc space-y-1.5 pl-5">
          {plan.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      label: 'Not included',
      render: (plan) =>
        plan.excluded.length ? (
          <ul className="list-disc space-y-1.5 pl-5 text-charcoal-700">
            {plan.excluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <span className="text-charcoal-700">Nothing listed as excluded</span>
        ),
    },
    { label: 'Additional charges', render: (plan) => plan.additionalCharges },
    {
      label: 'Next step',
      render: (plan) => (
        <WhatsAppCta message={buildPlanMessage(plan)} variant="outline" className="min-h-10 px-4 text-xs">
          Ask on WhatsApp
        </WhatsAppCta>
      ),
    },
  ]

  return (
    <div>
      <p className="eyebrow">Compare</p>
      <h2 id="comparison-heading" className="mt-4 text-4xl sm:text-5xl">
        {label} plans side by side
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal-700">
        Scope and billing differ between plans. Compare what is covered before you choose.
      </p>

      <div
        role="region"
        aria-labelledby="comparison-heading"
        tabIndex={0}
        className="mt-12 overflow-x-auto rounded-sm border border-navy-900/10 bg-white"
      >
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm leading-relaxed">
          <caption className="sr-only">Comparison of {label.toLowerCase()} plans</caption>
          <thead>
            <tr className="border-b border-navy-900/10">
              <th scope="col" className="sticky left-0 z-10 w-44 bg-white p-6 text-xs font-semibold tracking-[0.2em] text-navy-900 uppercase">
                Feature
              </th>
              {group.map((plan) => (
                <th key={plan.id} scope="col" className="p-6 align-top font-display text-2xl font-semibold text-navy-900">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-navy-900/10">
                <th scope="row" className="sticky left-0 z-10 bg-white p-6 align-top font-semibold text-navy-900">
                  {row.label}
                </th>
                {group.map((plan) => (
                  <td key={plan.id} className="p-6 align-top text-charcoal-700">
                    {row.render(plan)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

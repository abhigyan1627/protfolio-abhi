import { useRef } from 'react'
import { Check, Minus } from 'lucide-react'
import { Link } from 'react-router'
import { audiences, audienceById } from '../data/audiences'
import { plans } from '../data/plans'
import { serviceById } from '../data/services'
import { billingDisplay, billingPhrase, formatPrice } from '../utils/format'
import { buildPlanMessage } from '../utils/whatsapp'
import WhatsAppCta from './WhatsAppCta'

const LABEL = 'text-xs font-semibold tracking-[0.2em] text-navy-900 uppercase'

function PlanCard({ plan }) {
  const related = plan.serviceIds.map((id) => serviceById[id]).filter(Boolean)

  return (
    <li
      id={`plan-${plan.id}`}
      className="flex scroll-mt-32 flex-col rounded-sm border border-navy-900/10 bg-white p-7 transition duration-300 ease-out hover:border-champagne-500/70 hover:shadow-[0_30px_60px_-36px_rgba(11,31,58,0.45)] motion-safe:hover:-translate-y-1 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-3xl leading-tight">{plan.name}</h3>
        <span className="shrink-0 rounded-sm bg-ivory-100 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.18em] text-champagne-700 uppercase">
          {billingDisplay(plan)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-charcoal-700">{plan.summary}</p>

      <div className="mt-7 flex flex-wrap items-baseline gap-x-2 border-y border-navy-900/10 py-6">
        <span className="font-display text-5xl font-semibold text-navy-900">{formatPrice(plan)}</span>
        {plan.price != null && <span className="text-sm text-charcoal-700">{billingPhrase(plan)}</span>}
      </div>

      <dl className="mt-6 space-y-6 text-sm leading-relaxed">
        <div>
          <dt className={LABEL}>Target customer</dt>
          <dd className="mt-2 text-charcoal-700">{plan.targetCustomer}</dd>
        </div>
        <div>
          <dt className={LABEL}>Included</dt>
          <dd className="mt-2">
            <ul className="space-y-2.5">
              {plan.included.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-champagne-700" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        {plan.excluded.length > 0 && (
          <div>
            <dt className={LABEL}>Not included</dt>
            <dd className="mt-2">
              <ul className="space-y-2.5 text-charcoal-700">
                {plan.excluded.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Minus className="mt-0.5 size-4 shrink-0 text-charcoal-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        <div>
          <dt className={LABEL}>Additional charges</dt>
          <dd className="mt-2 text-charcoal-700">{plan.additionalCharges}</dd>
        </div>
      </dl>

      {related.length > 0 && (
        <p className="mt-6 text-xs text-charcoal-500">
          Related service:{' '}
          {related.map((item, index) => (
            <span key={item.id}>
              {index > 0 && ', '}
              <Link to={`/services/${item.id}`} className="underline underline-offset-4 hover:text-navy-900">
                {item.title}
              </Link>
            </span>
          ))}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <WhatsAppCta message={buildPlanMessage(plan, { intent: 'choose' })} variant="navy" className="w-full">
          Choose This Plan
        </WhatsAppCta>
        <WhatsAppCta message={buildPlanMessage(plan)} variant="outline" className="w-full">
          Ask on WhatsApp
        </WhatsAppCta>
      </div>
    </li>
  )
}

function PricingOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {audiences.map((audience) => {
        const group = plans.filter((plan) => plan.audience === audience.id)
        return (
          <div key={audience.id} className="flex flex-col rounded-sm border border-navy-900/10 bg-white p-8">
            <p className="eyebrow">Plans</p>
            <h3 className="mt-3 text-3xl">{audience.label}</h3>
            <ul className="mt-8 divide-y divide-navy-900/10">
              {group.map((plan) => (
                <li key={plan.id} className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-semibold text-navy-900">{plan.name}</span>
                  <span className="shrink-0 text-sm text-charcoal-700">{formatPrice(plan)}</span>
                </li>
              ))}
            </ul>
            <Link to={`/pricing?audience=${audience.id}`} className="link-arrow mt-auto pt-8">
              View {audience.label.toLowerCase()} plans
            </Link>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Pricing plans for one customer group at a time. The tab list is keyboard accessible (arrow keys, Home and
 * End). `variant="overview"` shows a compact summary for the home page instead.
 */
export default function Pricing({ audience, onAudienceChange, variant = 'full' }) {
  const tabRefs = useRef({})

  if (variant === 'overview') return <PricingOverview />

  const ids = audiences.map((item) => item.id)

  const handleKeyDown = (event) => {
    const index = ids.indexOf(audience)
    let next = null
    if (event.key === 'ArrowRight') next = (index + 1) % ids.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + ids.length) % ids.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = ids.length - 1
    if (next === null) return

    event.preventDefault()
    onAudienceChange(ids[next])
    tabRefs.current[ids[next]]?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Customer type"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2 rounded-sm border border-navy-900/15 bg-white p-1.5 sm:inline-flex"
      >
        {audiences.map((item) => {
          const selected = item.id === audience
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[item.id] = element
              }}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="pricing-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => onAudienceChange(item.id)}
              className={`min-h-11 flex-1 rounded-sm px-6 text-sm font-semibold tracking-wide transition-colors sm:flex-none ${
                selected ? 'bg-navy-900 text-ivory' : 'text-navy-900 hover:bg-navy-900/5'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div id="pricing-panel" role="tabpanel" aria-labelledby={`tab-${audience}`} tabIndex={0} className="mt-12">
        <p className="max-w-2xl text-lg leading-relaxed text-charcoal-700">{audienceById[audience].intro}</p>
        <ul className="mt-10 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans
            .filter((plan) => plan.audience === audience)
            .map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
        </ul>
      </div>
    </div>
  )
}

import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { buildServiceMessage } from '../utils/whatsapp'
import { fallbackIcon, iconMap } from './icons'
import WhatsAppCta from './WhatsAppCta'

export function Details({ service, dark = false }) {
  const label = `text-xs font-semibold tracking-[0.2em] uppercase ${dark ? 'text-champagne-300' : 'text-navy-900'}`
  const body = dark ? 'text-ivory/75' : 'text-charcoal-700'
  const check = dark ? 'text-champagne-300' : 'text-champagne-700'

  return (
    <div className={`space-y-6 text-sm leading-relaxed ${body}`}>
      <div>
        <p className={label}>Intended for</p>
        <p className="mt-2">{service.intendedCustomer}</p>
      </div>
      <div>
        <p className={label}>Key inclusions</p>
        <ul className="mt-3 space-y-2.5">
          {service.inclusions.map((item) => (
            <li key={item} className="flex gap-3">
              <Check className={`mt-0.5 size-4 shrink-0 ${check}`} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`border-l-2 pl-4 ${dark ? 'border-champagne-400' : 'border-champagne-500'}`}>
        <p className={label}>Scope and eligibility</p>
        <p className="mt-2">{service.scopeNote}</p>
      </div>
      <p>
        <span className={`font-semibold ${dark ? 'text-ivory' : 'text-navy-900'}`}>Additional charges: </span>
        {service.additionalCharges}
      </p>
    </div>
  )
}

function Actions({ service, dark = false }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link to={`/services/${service.id}`} className={dark ? 'btn-outline-light' : 'btn-outline'}>
        Explore Service
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
      <WhatsAppCta message={buildServiceMessage(service)} variant={dark ? 'gold' : 'navy'}>
        Enquire on WhatsApp
      </WhatsAppCta>
    </div>
  )
}

/**
 * One service, in one of three compositions:
 * - "card": bordered card with the full detail stack (individuals)
 * - "row": editorial row with title, details and actions in columns (businesses)
 * - "feature": dark, two-column panel for the lead service (startups)
 */
export default function ServiceCard({ service, index = 0, variant = 'card' }) {
  const Icon = iconMap[service.icon] ?? fallbackIcon
  const number = String(index + 1).padStart(2, '0')
  const headingId = `service-${service.id}`

  if (variant === 'row') {
    return (
      <article aria-labelledby={headingId} className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="font-display text-4xl text-champagne-700">{number}</p>
          <h3 id={headingId} className="mt-3 text-3xl leading-tight">
            {service.title}
          </h3>
          <p className="mt-4 leading-relaxed text-charcoal-700">{service.summary}</p>
          <div className="mt-8 hidden lg:block">
            <Actions service={service} />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-6">
          <Details service={service} />
        </div>
        <div className="lg:hidden">
          <Actions service={service} />
        </div>
      </article>
    )
  }

  if (variant === 'feature') {
    return (
      <article
        aria-labelledby={headingId}
        className="on-dark grid gap-10 bg-navy-900 p-8 text-ivory sm:p-12 lg:grid-cols-12 lg:gap-14"
      >
        <div className="lg:col-span-5">
          <span className="flex size-12 items-center justify-center rounded-sm border border-champagne-400/40 text-champagne-300">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-8 font-display text-2xl text-champagne-300">{number}</p>
          <h3 id={headingId} className="mt-2 text-4xl leading-tight text-ivory">
            {service.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-ivory/80">{service.summary}</p>
          <div className="mt-10">
            <Actions service={service} dark />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Details service={service} dark />
        </div>
      </article>
    )
  }

  return (
    <article
      aria-labelledby={headingId}
      className="flex flex-col rounded-sm border border-navy-900/10 bg-white p-7 shadow-[0_1px_0_rgba(11,31,58,0.04)] transition duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-[0_28px_50px_-34px_rgba(11,31,58,0.4)] sm:p-9"
    >
      <div className="flex items-start justify-between gap-6">
        <span className="flex size-12 items-center justify-center rounded-sm bg-navy-900 text-champagne-300">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="font-display text-3xl text-champagne-700/80" aria-hidden="true">
          {number}
        </span>
      </div>
      <h3 id={headingId} className="mt-7 text-3xl leading-tight">
        {service.title}
      </h3>
      <p className="mt-3 leading-relaxed text-charcoal-700">{service.summary}</p>
      <div className="mt-7 border-t border-navy-900/10 pt-7">
        <Details service={service} />
      </div>
      <div className="mt-auto pt-9">
        <Actions service={service} />
      </div>
    </article>
  )
}

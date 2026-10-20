import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { audiences } from '../data/audiences'
import { services } from '../data/services'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import ServiceCard from './ServiceCard'

// Each customer group gets its own composition so the page reads as a set of distinct sections.
const LAYOUTS = {
  individuals: 'card',
  businesses: 'row',
  startups: 'feature',
}

function ServicesPreview() {
  return (
    <div className="grid overflow-hidden rounded-sm border border-navy-900/10 md:grid-cols-3 md:gap-px md:bg-navy-900/10">
      {audiences.map((audience) => {
        const items = services.filter((service) => service.audience === audience.id).slice(0, 4)
        return (
          <div key={audience.id} className="flex flex-col border-t border-navy-900/10 bg-ivory p-8 first:border-t-0 md:border-t-0 sm:p-10">
            <p className="eyebrow">{audience.label}</p>
            <h3 className="mt-3 text-3xl leading-tight">{audience.servicesHeading}</h3>
            <ul className="mt-8 divide-y divide-navy-900/10">
              {items.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.id}`}
                    className="group flex items-center justify-between gap-4 py-4 text-navy-900"
                  >
                    <span className="font-semibold transition-colors group-hover:text-champagne-700">{service.title}</span>
                    <ArrowRight
                      className="size-4 shrink-0 text-champagne-700 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link to={`/services#${audience.id}`} className="link-arrow mt-auto pt-8">
              See all {audience.label.toLowerCase()} services
            </Link>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Services grouped by customer type. `variant="preview"` shows a compact overview for the home page,
 * `variant="full"` shows every service with its details, scope and enquiry actions.
 */
export default function Services({ variant = 'full' }) {
  if (variant === 'preview') return <ServicesPreview />

  return (
    <div className="space-y-28">
      {audiences.map((audience, groupIndex) => {
        const items = services.filter((service) => service.audience === audience.id)
        const layout = LAYOUTS[audience.id] ?? 'card'
        const headingId = `${audience.id}-heading`

        return (
          <section key={audience.id} id={audience.id} aria-labelledby={headingId}>
            <Reveal>
              <SectionHeading
                eyebrow={`0${groupIndex + 1} · ${audience.label}`}
                title={audience.servicesHeading}
                id={headingId}
              >
                {audience.intro}
              </SectionHeading>
            </Reveal>

            {layout === 'card' && (
              <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2">
                {items.map((service, index) => (
                  <Reveal key={service.id} delay={index * 70} className="flex">
                    <ServiceCard service={service} index={index} variant="card" />
                  </Reveal>
                ))}
              </div>
            )}

            {layout === 'row' && (
              <div className="mt-14 divide-y divide-navy-900/10 border-y border-navy-900/10">
                {items.map((service, index) => (
                  <Reveal key={service.id}>
                    <ServiceCard service={service} index={index} variant="row" />
                  </Reveal>
                ))}
              </div>
            )}

            {layout === 'feature' && (
              <div className="mt-14 space-y-6">
                {items.slice(0, 1).map((service) => (
                  <Reveal key={service.id}>
                    <ServiceCard service={service} index={0} variant="feature" />
                  </Reveal>
                ))}
                <div className="grid items-stretch gap-6 md:grid-cols-2">
                  {items.slice(1).map((service, index) => (
                    <Reveal key={service.id} delay={index * 70} className="flex">
                      <ServiceCard service={service} index={index + 1} variant="card" />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

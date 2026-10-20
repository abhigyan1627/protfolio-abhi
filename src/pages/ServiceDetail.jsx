import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Details } from '../components/ServiceCard'
import NotFound from './NotFound'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import WhatsAppCta from '../components/WhatsAppCta'
import { audienceById } from '../data/audiences'
import { plans } from '../data/plans'
import { pageById } from '../data/pages'
import { serviceById } from '../data/services'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { billingDisplay, billingPhrase, formatPrice } from '../utils/format'
import { buildServiceMessage } from '../utils/whatsapp'

export default function ServiceDetailPage() {
  const { serviceId } = useParams()
  const service = serviceById[serviceId]
  const audience = service ? audienceById[service.audience] : null
  const relatedPlans = service ? plans.filter((plan) => plan.serviceIds.includes(service.id)) : []

  useDocumentMeta({
    title: service?.title ?? 'Service not found',
    description: service?.summary ?? pageById.services.description,
    path: `/services/${serviceId ?? ''}`,
  })

  if (!service) return <NotFound />

  return (
    <>
      <PageHeader
        eyebrow={audience.servicesHeading}
        title={service.title}
        intro={service.summary}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]}
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <WhatsAppCta message={buildServiceMessage(service)} variant="gold">
            Enquire on WhatsApp
          </WhatsAppCta>
          <Link to={`/pricing?audience=${audience.id}`} className="btn-outline-light">
            View {audience.label.toLowerCase()} plans
          </Link>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Details service={service} />
          </div>

          <aside aria-labelledby="related-plans-heading" className="lg:col-span-4 lg:col-start-9">
            <h2 id="related-plans-heading" className="text-3xl">
              Related plans
            </h2>
            {relatedPlans.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {relatedPlans.map((plan) => (
                  <li key={plan.id}>
                    <Link
                      to={`/pricing?audience=${plan.audience}#plan-${plan.id}`}
                      className="group block rounded-sm border border-navy-900/10 bg-white p-6 transition duration-300 hover:border-champagne-500/70 hover:shadow-[0_24px_50px_-34px_rgba(11,31,58,0.4)]"
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="font-display text-2xl text-navy-900 group-hover:text-champagne-700">{plan.name}</span>
                        <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-champagne-700 uppercase">
                          {billingDisplay(plan)}
                        </span>
                      </span>
                      <span className="mt-3 block text-sm text-charcoal-700">
                        <span className="font-semibold text-navy-900">{formatPrice(plan)}</span>
                        {plan.price != null && <span> · {billingPhrase(plan)}</span>}
                      </span>
                      <span className="mt-3 block text-sm leading-relaxed text-charcoal-700">{plan.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-sm bg-ivory-100 p-6 text-sm leading-relaxed text-charcoal-700">
                There is no standard plan for this service yet. The firm will confirm the scope and fees with you on
                WhatsApp.
              </div>
            )}
            <p className="mt-8 text-sm leading-relaxed text-charcoal-700">
              Need something that is not listed?{' '}
              <Link to="/pricing#custom-quote" className="font-semibold text-navy-900 underline underline-offset-4">
                Request a custom quotation
              </Link>
              .
            </p>
          </aside>
        </div>

        <div className="mt-20 border-t border-navy-900/10 pt-10">
          <Link to="/services" className="link-arrow">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to all services
          </Link>
        </div>
      </Section>
    </>
  )
}

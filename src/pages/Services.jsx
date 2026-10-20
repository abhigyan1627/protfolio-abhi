import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import Services from '../components/Services'
import WhatsAppCta from '../components/WhatsAppCta'
import { audiences } from '../data/audiences'
import { pageById } from '../data/pages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildGeneralMessage } from '../utils/whatsapp'

const page = pageById.services

export default function ServicesPage() {
  useDocumentMeta({ title: page.title, description: page.description, path: page.path })

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Services for individuals, businesses and startups"
        intro="Each service states who it suits, what is included, the scope and eligibility notes, and the charges that may apply in addition to professional fees."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      >
        <nav aria-label="Jump to a customer type" className="mt-10 flex flex-wrap gap-3">
          {audiences.map((audience) => (
            <Link
              key={audience.id}
              to={`#${audience.id}`}
              className="rounded-sm border border-ivory/25 px-4 py-2 text-sm font-medium text-ivory transition-colors hover:border-champagne-300 hover:text-champagne-300"
            >
              {audience.label}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <Section>
        <Services variant="full" />
      </Section>

      <Section tone="navy" labelledBy="services-cta-heading">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 id="services-cta-heading" className="text-4xl text-ivory sm:text-5xl">
              Not sure which service fits your situation?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/75">
              Use the service finder on the home page, or start a conversation on WhatsApp.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link to="/#finder" className="btn-outline-light">
              Use the service finder
            </Link>
            <WhatsAppCta message={buildGeneralMessage()} variant="gold">
              Discuss Your Requirements
            </WhatsAppCta>
          </div>
        </div>
      </Section>
    </>
  )
}

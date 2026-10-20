import { useSearchParams } from 'react-router'
import CustomQuote from '../components/CustomQuote'
import PageHeader from '../components/PageHeader'
import Pricing from '../components/Pricing'
import PricingComparison from '../components/PricingComparison'
import Section from '../components/Section'
import { siteConfig } from '../config/siteConfig'
import { audienceById } from '../data/audiences'
import { pageById } from '../data/pages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = pageById.pricing
const BILLING_NOTES = [
  {
    title: 'One-time plans',
    text: 'A one-time plan covers the scope written in its description, and nothing outside that scope.',
  },
  {
    title: 'Monthly plans',
    text: 'A monthly plan covers an agreed monthly scope. Changes to volume or scope are quoted in advance.',
  },
  {
    title: 'Government and third-party charges',
    text: 'Unless a plan says otherwise, government fees and third-party charges are disclosed separately.',
  },
]

export default function PricingPage() {
  useDocumentMeta({ title: page.title, description: page.description, path: page.path })

  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('audience')
  const audience = audienceById[requested] ? requested : 'individuals'

  const handleAudienceChange = (id) => {
    setSearchParams({ audience: id }, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="Plans & pricing"
        title="Choose a plan, then ask about what matters to you"
        intro="Every plan states what is included, what is not, and which charges may apply in addition. Choose a plan to start a conversation on WhatsApp, or ask a question first."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Pricing' }]}
      />

      <Section id="plans" labelledBy="plans-heading">
        {siteConfig.pricing.showSampleNotice && (
          <p role="note" className="mb-12 rounded-sm border border-champagne-500/40 bg-champagne-200/50 px-5 py-4 text-sm leading-relaxed text-navy-900">
            <span className="font-semibold">Sample prices.</span> The fees shown are illustrative. The firm confirms the
            final fee and scope with you before any engagement begins.
          </p>
        )}
        <h2 id="plans-heading" className="sr-only">
          Plans for {audienceById[audience].label.toLowerCase()}
        </h2>
        <Pricing audience={audience} onAudienceChange={handleAudienceChange} />
      </Section>

      <Section tone="light" labelledBy="comparison-heading">
        <PricingComparison audience={audience} />
      </Section>

      <CustomQuote />

      <Section labelledBy="billing-heading">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Billing</p>
            <h2 id="billing-heading" className="mt-4 text-4xl">
              How billing works
            </h2>
          </div>
          <dl className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {BILLING_NOTES.map((note) => (
              <div key={note.title} className="border-t-2 border-champagne-500 pt-6">
                <dt className="font-display text-2xl text-navy-900">{note.title}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-charcoal-700">{note.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  )
}

import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { siteConfig } from '../config/siteConfig'
import { legalPages } from '../data/legal'
import { pageById } from '../data/pages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const lastUpdated = new Date(siteConfig.legal.lastUpdated).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Renders a legal document from src/data/legal.js. The firm name is inserted from siteConfig. */
export default function LegalPage({ pageKey }) {
  const page = pageById[pageKey]
  const content = legalPages[pageKey]

  useDocumentMeta({ title: page.title, description: page.description, path: page.path })

  const withFirmName = (text) => text.replaceAll('{firmName}', siteConfig.firmName)

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={content.title}
        intro={`Last updated ${lastUpdated}.`}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: content.title }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {siteConfig.legal.showDraftNotice && (
            <p role="note" className="mb-12 rounded-sm border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              Draft text. This page must be reviewed by a qualified legal adviser before it is published.
            </p>
          )}

          <div className="space-y-12">
            {content.sections.map((section) => (
              <section key={section.heading} aria-labelledby={`legal-${section.heading.replace(/\W+/g, '-').toLowerCase()}`}>
                <h2
                  id={`legal-${section.heading.replace(/\W+/g, '-').toLowerCase()}`}
                  className="text-3xl"
                >
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-charcoal-700">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{withFirmName(paragraph)}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}

import { ExternalLink } from 'lucide-react'
import FAQ from '../components/FAQ'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { officialPortals, resourceChecklists } from '../data/content'
import { pageById } from '../data/pages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = pageById.resources

export default function ResourcesPage() {
  useDocumentMeta({ title: page.title, description: page.description, path: page.path })

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Document checklists and official portals"
        intro="Indicative guides to the documents commonly needed for each filing. The firm confirms the exact requirements for your situation."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources' }]}
      />

      <Section labelledBy="checklists-heading">
        <SectionHeading eyebrow="Checklists" title="Documents commonly needed" id="checklists-heading">
          These lists are indicative. Requirements change and depend on your circumstances, so please check with the firm
          before you collect documents.
        </SectionHeading>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {resourceChecklists.map((list) => (
            <article key={list.id} className="rounded-sm border border-navy-900/10 bg-white p-8">
              <h3 className="text-2xl leading-snug">{list.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-700">{list.intro}</p>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed">
                {list.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-champagne-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="light" labelledBy="portals-heading">
        <SectionHeading eyebrow="Official portals" title="Government websites you may need" id="portals-heading">
          Links to official government portals. These sites are not operated by the firm.
        </SectionHeading>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-navy-900/10 bg-navy-900/10 sm:grid-cols-2">
          {officialPortals.map((portal) => (
            <li key={portal.url} className="bg-white">
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-2 p-7 transition-colors hover:bg-ivory-100"
              >
                <span className="flex items-center gap-2 font-semibold text-navy-900 group-hover:text-champagne-700">
                  {portal.name}
                  <ExternalLink className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
                <span className="text-sm leading-relaxed text-charcoal-700">{portal.purpose}</span>
                <span className="text-xs break-all text-charcoal-500">{portal.url.replace('https://', '')}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" labelledBy="faq-heading">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" id="faq-heading" />
        <div className="mt-12">
          <FAQ />
        </div>
      </Section>
    </>
  )
}

import About from '../components/About'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import WhyChooseUs from '../components/WhyChooseUs'
import Contact from '../components/Contact'
import { pageById } from '../data/pages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = pageById.about

export default function AboutPage() {
  useDocumentMeta({ title: page.title, description: page.description, path: page.path })

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A chartered accountancy practice built on clarity"
        intro="We work with individuals, entrepreneurs and growing businesses on tax, compliance and financial reporting, with the scope and the process explained at every stage."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
      />

      <Section>
        <About variant="full" />
      </Section>

      <Section tone="light" labelledBy="principles-heading">
        <WhyChooseUs />
      </Section>

      <Section tone="navy" labelledBy="contact-heading">
        <Contact variant="compact" />
      </Section>
    </>
  )
}

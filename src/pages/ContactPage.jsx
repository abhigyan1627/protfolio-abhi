import Contact from '../components/Contact'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { pageById } from '../data/pages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = pageById.contact

export default function ContactPage() {
  useDocumentMeta({ title: page.title, description: page.description, path: page.path })

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact the firm"
        intro="Start on WhatsApp, call or email, or send a basic enquiry through the form. Please do not send passwords, OTPs, banking credentials or sensitive documents through this page."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />
      <Section>
        <Contact variant="full" />
      </Section>
    </>
  )
}

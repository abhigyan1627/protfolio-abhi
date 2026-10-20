import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function NotFound() {
  useDocumentMeta({
    title: 'Page not found',
    description: 'The page you requested could not be found.',
    path: '/404',
  })

  return (
    <>
      <PageHeader
        eyebrow="Error 404"
        title="This page could not be found"
        intro="The link may be out of date, or the page may have moved. Use the navigation or return to the home page."
      />
      <Section>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="btn-navy">
            Back to home
          </Link>
          <Link to="/services" className="btn-outline">
            View services
          </Link>
        </div>
      </Section>
    </>
  )
}

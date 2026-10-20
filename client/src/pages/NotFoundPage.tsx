import { Link } from 'react-router-dom';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { buttonClass } from '../components/ui/styles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function NotFoundPage({ title = 'Page not found' }: { title?: string }) {
  useDocumentMeta({
    title: 'Page not found | CA Mohit Agrawal',
    description: 'The page you were looking for could not be found.',
    path: '/404',
    noindex: true,
  });

  return (
    <>
      <PageHero title={title} description="The link may be out of date, or the page may have moved. You can continue from one of the pages below." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Not found' }]} />
      <Section title="Where would you like to go?" tone="ivory">
        <div className="flex flex-wrap gap-3">
          <Link to="/" className={buttonClass('primary')}>Home</Link>
          <Link to="/services" className={buttonClass('secondary')}>Services</Link>
          <Link to="/contact" className={buttonClass('secondary')}>Contact</Link>
        </div>
      </Section>
    </>
  );
}

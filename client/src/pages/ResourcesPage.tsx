import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ui/States';
import { cardClass, focusRing } from '../components/ui/styles';
import { useAsync } from '../hooks/useAsync';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatDate } from '../lib/format';
import { publicApi } from '../lib/publicApi';

export function ResourcesPage() {
  useDocumentMeta({
    title: 'Tax & Compliance Resources | CA Mohit Agrawal',
    description: 'General guides on ITR documentation, GST registration and returns, basic accounting practices and business compliance checklists.',
    path: '/resources',
  });

  const resources = useAsync((signal) => publicApi.resources(signal), []);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Practical guides for tax and business compliance"
        description="General information to help you prepare. Rules and deadlines change, so confirm the position for your situation before acting on anything here."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources' }]}
      />
      <Section title="Latest guides" tone="ivory">
        {resources.loading && <LoadingBlock label="Loading guides" />}
        {resources.error && <ErrorBlock message={resources.error} onRetry={resources.retry} />}
        {resources.data && resources.data.length === 0 && (
          <EmptyBlock title="Guides are being prepared" description="Check back soon, or contact us with the topic you need." />
        )}
        {resources.data && resources.data.length > 0 && (
          <ul className="grid gap-6 md:grid-cols-2">
            {resources.data.map((article) => (
              <li key={article.id}>
                <article className={`${cardClass} flex h-full flex-col`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">{article.category}</p>
                  <h3 className="mt-3 font-display text-xl font-bold text-navy">
                    <Link to={`/resources/${article.slug}`} className={`rounded-sm hover:underline underline-offset-4 ${focusRing}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{article.excerpt}</p>
                  <p className="mt-5 text-xs text-slate">
                    Published {formatDate(article.publishedAt)}
                    {article.updatedAt && article.publishedAt && formatDate(article.updatedAt) !== formatDate(article.publishedAt)
                      ? ` · Updated ${formatDate(article.updatedAt)}`
                      : ''}
                  </p>
                  <Link to={`/resources/${article.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 hover:underline">
                    Read the guide <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

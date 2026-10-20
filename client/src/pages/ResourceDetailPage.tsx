import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { PageHero } from '../components/ui/PageHero';
import { ErrorBlock, LoadingBlock } from '../components/ui/States';
import { containerClass, cardClass } from '../components/ui/styles';
import { WhatsAppLink } from '../components/whatsapp/WhatsAppLink';
import { useAsync } from '../hooks/useAsync';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatDate } from '../lib/format';
import { publicApi } from '../lib/publicApi';
import { whatsappMessages } from '../lib/whatsapp';
import { NotFoundPage } from './NotFoundPage';

export function ResourceDetailPage() {
  const { slug = '' } = useParams();
  const resource = useAsync((signal) => publicApi.resource(slug, signal), [slug]);

  useDocumentMeta({
    title: resource.data ? `${resource.data.title} | CA Mohit Agrawal` : 'Guide | CA Mohit Agrawal',
    description: resource.data?.excerpt ?? 'Practical tax and compliance guide from CA Mohit Agrawal.',
    path: `/resources/${slug}`,
    type: 'article',
  });

  if (resource.loading) return <div className={`${containerClass} py-20`}><LoadingBlock label="Loading guide" /></div>;
  if (resource.errorStatus === 404) return <NotFoundPage title="We could not find that guide" />;
  if (resource.error) return <div className={`${containerClass} py-20`}><ErrorBlock message={resource.error} onRetry={resource.retry} /></div>;
  if (!resource.data) return null;

  const article = resource.data;
  const updated = formatDate(article.updatedAt);
  const published = formatDate(article.publishedAt);

  return (
    <>
      <PageHero
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources', to: '/resources' }, { label: article.title }]}
      >
        <p className="mt-6 text-sm text-slate">
          {published && <>Published {published}</>}
          {updated && published !== updated && <> · Last updated {updated}</>}
        </p>
      </PageHero>

      <div className={`${containerClass} grid gap-12 py-14 lg:grid-cols-12`}>
        <article className="max-w-3xl text-[17px] leading-[1.75] text-ink lg:col-span-8 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h2:first-child]:mt-0 [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </article>
        <aside className="space-y-6 lg:col-span-4">
          <div className={cardClass}>
            <h2 className="font-display text-lg font-bold text-navy">Need help applying this?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              General guides cannot replace advice on your facts. Share your situation and we will explain what applies.
            </p>
            <div className="mt-5">
              <WhatsAppLink context={`resource:${article.slug}`} message={whatsappMessages.general()} label="Ask on WhatsApp" className="w-full" />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate">
            This article is general information and was current when published or last updated. Tax rules, limits and deadlines change. Confirm the current position before relying on it.
          </p>
        </aside>
      </div>
    </>
  );
}

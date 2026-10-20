import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Accordion } from '../components/ui/Accordion';
import { WhatsAppLink } from '../components/whatsapp/WhatsAppLink';
import { ServiceIcon } from '../components/services/ServiceIcon';
import { ServiceList } from '../components/services/ServiceList';
import { PlanCard } from '../components/pricing/PlanCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ErrorBlock, LoadingBlock } from '../components/ui/States';
import { buttonClass, cardClass, containerClass, eyebrowClass, headingClass } from '../components/ui/styles';
import { useAsync } from '../hooks/useAsync';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { publicApi } from '../lib/publicApi';
import { CATEGORY_LABELS } from '../lib/format';
import { whatsappMessages } from '../lib/whatsapp';
import { NotFoundPage } from './NotFoundPage';

function BulletList({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-navy">{label}</h3>
      <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceDetailPage() {
  const { slug = '' } = useParams();
  const service = useAsync((signal) => publicApi.service(slug, signal), [slug]);
  const plans = useAsync((signal) => publicApi.plans(signal), []);
  const related = useAsync((signal) => publicApi.services(signal), []);

  useDocumentMeta({
    title: service.data ? `${service.data.name} | CA Mohit Agrawal, Gopalganj` : 'Service | CA Mohit Agrawal',
    description: service.data?.description ?? 'Professional tax, GST and compliance service from CA Mohit Agrawal in Gopalganj, Bihar.',
    path: `/services/${slug}`,
  });

  if (service.loading) return <div className={`${containerClass} py-20`}><LoadingBlock label="Loading service" /></div>;

  if (service.error) {
    if (service.errorStatus === 404) return <NotFoundPage title="We could not find that service" />;
    return (
      <div className={`${containerClass} py-20`}>
        <ErrorBlock message={service.error} onRetry={service.retry} />
      </div>
    );
  }

  const item = service.data;
  if (!item) return <NotFoundPage title="We could not find that service" />;

  const categoryLabel = CATEGORY_LABELS[item.category];
  const relatedPlans = (plans.data ?? []).filter((plan) => plan.serviceCategory === item.category);
  const relatedServices = (related.data ?? []).filter((other) => other.category === item.category && other.id !== item.id).slice(0, 3);
  const faqItems = item.details.faqs.map((faq, index) => ({ id: `faq-${index}`, question: faq.question, answer: faq.answer }));

  return (
    <>
      <section className="border-b border-line bg-white" aria-labelledby="service-title">
        <div className={`${containerClass} py-12 sm:py-16`}>
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Services', to: '/services' },
              { label: categoryLabel, to: `/services?category=${item.category}` },
              { label: item.name },
            ]}
          />
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className={eyebrowClass}>{categoryLabel}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-navy text-white">
                  <ServiceIcon iconKey={item.iconKey} className="size-6" />
                </span>
                <h1 id="service-title" className={`${headingClass} text-4xl leading-[1.15] text-navy sm:text-5xl`}>
                  {item.name}
                </h1>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate sm:text-lg">{item.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className={`${containerClass} grid gap-12 py-14 lg:grid-cols-12 lg:py-20`}>
        <div className="space-y-12 lg:col-span-8">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="font-display text-2xl font-bold text-navy">Service overview</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink">{item.details.overview}</p>
          </section>

          <div className="grid gap-10 md:grid-cols-2">
            <BulletList label="Who may need it" items={item.details.whoMayNeed} />
            <BulletList label="Typical documentation checklist" items={item.details.documents} />
            <BulletList label="Scope and deliverables" items={item.details.deliverables} />
            <BulletList label="Important exclusions" items={item.details.exclusions} />
          </div>

          <p className="rounded-lg border border-line bg-white p-5 text-sm leading-relaxed text-slate">
            This page gives general information. It does not provide advice on your specific tax position. Please share your facts with us so we can discuss what applies to you.
          </p>

          {faqItems.length > 0 && (
            <section aria-labelledby="service-faq-heading">
              <h2 id="service-faq-heading" className="font-display text-2xl font-bold text-navy">Frequently asked questions</h2>
              <div className="mt-5">
                <Accordion items={faqItems} />
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:col-span-4 lg:self-start" aria-label="Enquire about this service">
          <div className={`${cardClass} space-y-4`}>
            <h2 className="font-display text-lg font-bold text-navy">Ready to enquire?</h2>
            <p className="text-sm leading-relaxed text-slate">
              Continue on WhatsApp with this service already filled in. We will confirm the documents, scope and fees before any work begins.
            </p>
            <WhatsAppLink
              context={`service-detail:${item.slug}`}
              message={whatsappMessages.service(item)}
              label="Enquire on WhatsApp"
              className="w-full"
            />
            <Link to={`/contact?service=${item.slug}`} className={buttonClass('secondary', 'w-full')}>
              Send an enquiry form
            </Link>
          </div>

          {relatedPlans.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-navy">Related plans</h2>
              {relatedPlans.slice(0, 2).map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
              <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 hover:underline">
                See all plans <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          )}
        </aside>
      </div>

      {relatedServices.length > 0 && (
        <section className="border-t border-line bg-white py-16" aria-labelledby="related-services-heading">
          <div className={containerClass}>
            <h2 id="related-services-heading" className="mb-8 font-display text-2xl font-bold text-navy">
              Related services
            </h2>
            <ServiceList status="success" services={relatedServices} error={null} onRetry={related.retry} />
          </div>
        </section>
      )}
    </>
  );
}

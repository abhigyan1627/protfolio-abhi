import { useSearchParams } from 'react-router-dom';
import { FaqSection } from '../components/faq/FaqSection';
import { ServiceList } from '../components/services/ServiceList';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useAsync } from '../hooks/useAsync';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/format';
import { publicApi } from '../lib/publicApi';
import type { ServiceCategory } from '../types/api';
import { focusRing } from '../components/ui/styles';
import { ServiceFinder } from '../components/finder/ServiceFinder';

export function ServicesPage() {
  useDocumentMeta({
    title: 'Tax, GST & Accounting Services | CA Mohit Agrawal, Gopalganj',
    description:
      'Explore income tax, GST, business compliance, accounting and audit-related services from CA Mohit Agrawal in Gopalganj, Bihar.',
    path: '/services',
  });

  const [params, setParams] = useSearchParams();
  const selected = CATEGORY_ORDER.find((category) => category === params.get('category')) ?? null;
  const services = useAsync((signal) => publicApi.services(signal), []);

  const choose = (category: ServiceCategory | null) =>
    setParams((current) => {
      const updated = new URLSearchParams(current);
      if (category) updated.set('category', category);
      else updated.delete('category');
      return updated;
    });

  const filtered = (services.data ?? []).filter((service) => !selected || service.category === selected);
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: filtered.filter((service) => service.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Taxation, GST, accounting and compliance services"
        description="Select a category to see the services available. Each service page explains the documents typically needed, what is included, and what is not."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      <Section title="Find the service you need" tone="ivory">
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter services by category">
          <button
            type="button"
            aria-pressed={!selected}
            onClick={() => choose(null)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${focusRing} ${
              !selected ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-navy'
            }`}
          >
            All services
          </button>
          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selected === category}
              onClick={() => choose(category)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${focusRing} ${
                selected === category ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-navy'
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        {selected || services.status !== 'success' ? (
          <ServiceList
            status={services.status}
            services={filtered}
            error={services.error}
            onRetry={services.retry}
            emptyTitle="No services in this category yet"
            emptyDescription="Choose another category, or contact us about your requirement."
          />
        ) : groups.length === 0 ? (
          <ServiceList status="success" services={[]} error={null} onRetry={services.retry} />
        ) : (
          <div className="space-y-14">
            {groups.map((group) => (
              <div key={group.category} aria-labelledby={`group-${group.category}`}>
                <h3 id={`group-${group.category}`} className="mb-6 font-display text-xl font-bold text-navy">
                  {CATEGORY_LABELS[group.category]}
                </h3>
                <ServiceList status="success" services={group.items} error={null} onRetry={services.retry} />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        id="finder"
        eyebrow="Smart Service Finder"
        title="Not sure which service you need?"
        description="Answer three quick questions and continue on WhatsApp with your selection already filled in. We never ask for PAN, Aadhaar, OTPs or bank details here."
        tone="white"
      >
        <ServiceFinder />
      </Section>

      <FaqSection scope="SERVICES" id="services-faq" title="About our services" tone="white" />
    </>
  );
}

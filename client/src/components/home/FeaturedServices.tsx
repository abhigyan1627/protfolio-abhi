import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../lib/publicApi';
import { useAsync } from '../../hooks/useAsync';
import { Section } from '../ui/Section';
import { buttonClass } from '../ui/styles';
import { ServiceList } from '../services/ServiceList';

export function FeaturedServices() {
  const services = useAsync((signal) => publicApi.services(signal), []);
  const featured = services.data?.filter((service) => service.featured) ?? [];
  const selection = (featured.length > 0 ? featured : (services.data ?? [])).slice(0, 6);

  return (
    <Section
      id="featured-services"
      eyebrow="Services"
      title="Where most clients start"
      description="Clear, documented support for the filings, registrations and decisions that matter most. Each service page explains what is included and what you will need to provide."
    >
      <ServiceList
        status={services.status}
        services={selection}
        error={services.error}
        onRetry={services.retry}
        emptyTitle="Services are being updated"
      />
      <div className="mt-10 flex justify-center">
        <Link to="/services" className={buttonClass('secondary')}>
          View all services <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </Section>
  );
}

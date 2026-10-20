import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { ServiceIcon } from './ServiceIcon';
import { CATEGORY_LABELS } from '../../lib/format';
import { whatsappMessages } from '../../lib/whatsapp';
import type { Service } from '../../types/api';
import { focusRing } from '../ui/styles';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-white p-6 transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex size-11 items-center justify-center rounded-md bg-navy text-white">
          <ServiceIcon iconKey={service.iconKey} />
        </span>
        <span className="text-xs font-medium text-slate">{CATEGORY_LABELS[service.category]}</span>
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-navy">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{service.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link
          to={`/services/${service.slug}`}
          className={`group inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-navy underline-offset-4 hover:underline ${focusRing}`}
        >
          Learn more
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          <span className="sr-only">about {service.name}</span>
        </Link>
        <WhatsAppLink
          variant="whatsapp"
          size="sm"
          context={`service-card:${service.slug}`}
          message={whatsappMessages.service(service)}
          label="Enquire"
        />
      </div>
    </article>
  );
}

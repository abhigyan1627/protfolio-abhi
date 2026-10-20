import { ErrorBlock, EmptyBlock, LoadingBlock } from '../ui/States';
import { buttonClass } from '../ui/styles';
import { Link } from 'react-router-dom';
import type { Service } from '../../types/api';
import { ServiceCard } from './ServiceCard';

interface ServiceListProps {
  status: 'loading' | 'success' | 'error';
  services: Service[] | undefined;
  error: string | null;
  onRetry: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

// Shared loading, error and empty handling for any list of service cards.
export function ServiceList({ status, services, error, onRetry, emptyTitle, emptyDescription }: ServiceListProps) {
  if (status === 'loading') return <LoadingBlock label="Loading services" />;
  if (status === 'error') return <ErrorBlock message={error ?? 'We could not load services.'} onRetry={onRetry} />;
  if (!services || services.length === 0) {
    return (
      <EmptyBlock
        title={emptyTitle ?? 'No services to show yet'}
        description={emptyDescription ?? 'Please contact us and we will point you to the right service.'}
        action={
          <Link to="/contact" className={buttonClass('secondary')}>
            Contact us
          </Link>
        }
      />
    );
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service.id} className="h-full">
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}

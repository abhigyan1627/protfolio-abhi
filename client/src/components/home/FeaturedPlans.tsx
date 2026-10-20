import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../lib/publicApi';
import { useAsync } from '../../hooks/useAsync';
import { Section } from '../ui/Section';
import { ErrorBlock, LoadingBlock } from '../ui/States';
import { buttonClass } from '../ui/styles';
import { PlanCard } from '../pricing/PlanCard';

export function FeaturedPlans() {
  const plans = useAsync((signal) => publicApi.plans(signal), []);
  const featured = (plans.data ?? []).filter((plan) => plan.featured).slice(0, 3);
  const selection = featured.length > 0 ? featured : (plans.data ?? []).slice(0, 3);

  return (
    <Section
      id="plans"
      eyebrow="Pricing"
      title="Transparent plans, quoted clearly"
      description="Where a price is not yet listed, we quote after understanding your requirement. Every plan states what is included and what is not."
      tone="white"
    >
      {plans.loading && <LoadingBlock label="Loading plans" />}
      {plans.error && <ErrorBlock message={plans.error} onRetry={plans.retry} />}
      {plans.data && selection.length > 0 && (
        <ul className="grid gap-6 lg:grid-cols-3">
          {selection.map((plan) => (
            <li key={plan.id} className="h-full">
              <PlanCard plan={plan} />
            </li>
          ))}
        </ul>
      )}
      <div className="mt-10 flex justify-center">
        <Link to="/pricing" className={buttonClass('secondary')}>
          Compare all plans <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </Section>
  );
}

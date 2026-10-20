import { FaqSection } from '../components/faq/FaqSection';
import { PricingExplorer } from '../components/pricing/PricingExplorer';
import { PageHero } from '../components/ui/PageHero';
import { ErrorBlock, LoadingBlock } from '../components/ui/States';
import { containerClass } from '../components/ui/styles';
import { useAsync } from '../hooks/useAsync';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { publicApi } from '../lib/publicApi';

export function PricingPage() {
  useDocumentMeta({
    title: 'Pricing & Plans | CA Mohit Agrawal, Gopalganj',
    description:
      'Compare individual, business and startup plans for ITR filing, GST, accounting and compliance. Where a price is not listed, request a quotation.',
    path: '/pricing',
  });

  const plans = useAsync((signal) => publicApi.plans(signal), []);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Plans for individuals, businesses and startups"
        description="Choose a customer type, then compare plans side by side. Where a price has not been listed, you will receive a written quotation before work begins."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Pricing' }]}
      />
      <section className={`${containerClass} py-14 sm:py-16`} aria-label="Plans">
        {plans.loading && <LoadingBlock label="Loading plans" />}
        {plans.error && <ErrorBlock message={plans.error} onRetry={plans.retry} />}
        {plans.data && <PricingExplorer plans={plans.data} />}
      </section>
      <FaqSection scope="PRICING" id="pricing-faq" title="Questions about pricing" tone="white" />
    </>
  );
}

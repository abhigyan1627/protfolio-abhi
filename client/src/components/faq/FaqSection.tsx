import { publicApi } from '../../lib/publicApi';
import type { FaqScope } from '../../types/api';
import { useAsync } from '../../hooks/useAsync';
import { Accordion } from '../ui/Accordion';
import { ErrorBlock, LoadingBlock } from '../ui/States';
import { Section } from '../ui/Section';

interface FaqSectionProps {
  scope: FaqScope;
  id?: string;
  title?: string;
  description?: string;
  tone?: 'ivory' | 'white';
}

// Shows published FAQs for a page. Hidden entirely when the owner has not published any for this scope.
export function FaqSection({ scope, id = 'faq', title = 'Frequently asked questions', description, tone = 'ivory' }: FaqSectionProps) {
  const faqs = useAsync((signal) => publicApi.faqs(signal, scope), [scope]);

  if (faqs.loading) {
    return (
      <Section id={id} eyebrow="FAQ" title={title} tone={tone}>
        <LoadingBlock label="Loading questions" />
      </Section>
    );
  }
  if (faqs.error) {
    return (
      <Section id={id} eyebrow="FAQ" title={title} tone={tone}>
        <ErrorBlock message={faqs.error} onRetry={faqs.retry} />
      </Section>
    );
  }
  if (!faqs.data || faqs.data.length === 0) return null;

  return (
    <Section id={id} eyebrow="FAQ" title={title} description={description} tone={tone}>
      <div className="max-w-3xl">
        <Accordion items={faqs.data.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
      </div>
    </Section>
  );
}

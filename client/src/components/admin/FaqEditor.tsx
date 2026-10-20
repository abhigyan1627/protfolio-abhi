import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { ApiRequestError } from '../../lib/api';
import type { AdminFaq, FaqScope } from '../../types/api';
import { Field, SelectInput, TextArea, TextInput } from '../ui/FormControls';
import { buttonClass } from '../ui/styles';
import { FormMessage } from './AdminPrimitives';

const SCOPES: { value: FaqScope; label: string }[] = [
  { value: 'GENERAL', label: 'Everywhere' },
  { value: 'HOME', label: 'Homepage' },
  { value: 'SERVICES', label: 'Services page' },
  { value: 'PRICING', label: 'Pricing page' },
];

const schema = z.object({
  question: z.string().trim().min(5, 'Enter a question of at least 5 characters.').max(240),
  answer: z.string().trim().min(5, 'Enter an answer of at least 5 characters.').max(2000),
  scope: z.enum(['GENERAL', 'HOME', 'SERVICES', 'PRICING']),
  published: z.boolean(),
  displayOrder: z.string().regex(/^\d{1,4}$/, 'Use a whole number from 0 to 9999.'),
});

type FaqFormValues = z.input<typeof schema>;

export function FaqEditor({ initial, onSaved, onCancel }: { initial?: AdminFaq; onSaved: () => void; onCancel: () => void }) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: initial?.question ?? '',
      answer: initial?.answer ?? '',
      scope: initial?.scope ?? 'GENERAL',
      published: initial?.published ?? true,
      displayOrder: String(initial?.displayOrder ?? 100),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const payload = {
      question: values.question.trim(),
      answer: values.answer.trim(),
      scope: values.scope,
      published: values.published,
      displayOrder: Number(values.displayOrder),
    };
    try {
      if (initial) await adminApi.updateFaq(initial.id, payload);
      else await adminApi.createFaq(payload);
      onSaved();
    } catch (error) {
      if (error instanceof ApiRequestError && error.fields) {
        for (const item of error.fields) {
          if (item.field in payload) setError(item.field as keyof FaqFormValues, { type: 'server', message: item.message });
        }
      }
      setFormError(error instanceof ApiRequestError ? error.message : 'The question could not be saved. Please try again.');
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {formError && <FormMessage kind="error">{formError}</FormMessage>}
      <Field id="faq-question" label="Question" required error={errors.question?.message}>
        <TextInput id="faq-question" invalid={!!errors.question} {...register('question')} />
      </Field>
      <Field id="faq-answer" label="Answer" required error={errors.answer?.message}>
        <TextArea id="faq-answer" rows={5} invalid={!!errors.answer} {...register('answer')} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="faq-scope" label="Shown on" error={errors.scope?.message}>
          <SelectInput id="faq-scope" {...register('scope')}>
            {SCOPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field id="faq-order" label="Display order" error={errors.displayOrder?.message}>
          <TextInput id="faq-order" inputMode="numeric" invalid={!!errors.displayOrder} {...register('displayOrder')} />
        </Field>
        <label className="inline-flex items-end gap-2 pb-2.5 text-sm">
          <input type="checkbox" className="size-4 accent-navy" {...register('published')} /> Published
        </label>
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={buttonClass('secondary')}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClass('primary')}>
          {isSubmitting ? 'Saving…' : initial ? 'Save changes' : 'Add question'}
        </button>
      </div>
    </form>
  );
}

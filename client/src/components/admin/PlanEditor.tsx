import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { ApiRequestError } from '../../lib/api';
import { arrayToLines, linesToArray, nullIfBlank, paiseToRupees, rupeesToPaise, toSlugInput } from '../../lib/adminForm';
import { AUDIENCE_LABELS, BILLING_LABELS, CATEGORY_LABELS, CATEGORY_ORDER } from '../../lib/format';
import type { AdminPlan } from '../../types/api';
import { Field, SelectInput, TextArea, TextInput } from '../ui/FormControls';
import { buttonClass } from '../ui/styles';
import { FormMessage } from './AdminPrimitives';

const schema = z.object({
  name: z.string().trim().min(3, 'Enter a plan name of at least 3 characters.').max(120),
  slug: z
    .string()
    .trim()
    .max(120)
    .refine((value) => value === '' || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), 'Use lowercase letters, numbers and hyphens only.'),
  audience: z.enum(['INDIVIDUAL', 'BUSINESS', 'STARTUP']),
  serviceCategory: z.enum(['INCOME_TAX', 'GST', 'BUSINESS_COMPANY', 'ACCOUNTING_FINANCE', 'AUDIT_OTHER']),
  description: z.string().trim().min(10, 'Add a short description (at least 10 characters).').max(400),
  price: z.string().refine((value) => rupeesToPaise(value) !== 'invalid', 'Enter the price in rupees, or leave blank for "Contact for Quotation".'),
  billingFrequency: z.enum(['ONE_TIME', 'PER_FILING', 'MONTHLY', 'ANNUAL', 'CUSTOM']),
  additionalCharges: z.string().max(600),
  targetCustomer: z.string().trim().min(5, 'Describe the target customer.').max(300),
  inclusions: z.string(),
  exclusions: z.string(),
  published: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.string().regex(/^\d{1,4}$/, 'Use a whole number from 0 to 9999.'),
});

type PlanFormValues = z.input<typeof schema>;

const FIELD_MAP: Record<string, keyof PlanFormValues> = {
  name: 'name',
  slug: 'slug',
  audience: 'audience',
  serviceCategory: 'serviceCategory',
  description: 'description',
  priceInPaise: 'price',
  billingFrequency: 'billingFrequency',
  additionalCharges: 'additionalCharges',
  targetCustomer: 'targetCustomer',
  inclusions: 'inclusions',
  exclusions: 'exclusions',
  published: 'published',
  featured: 'featured',
  displayOrder: 'displayOrder',
};

export function PlanEditor({ initial, onSaved, onCancel }: { initial?: AdminPlan; onSaved: () => void; onCancel: () => void }) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      audience: initial?.audience ?? 'INDIVIDUAL',
      serviceCategory: initial?.serviceCategory ?? 'INCOME_TAX',
      description: initial?.description ?? '',
      price: paiseToRupees(initial?.priceInPaise ?? null),
      billingFrequency: initial?.billingFrequency ?? 'CUSTOM',
      additionalCharges: initial?.additionalCharges ?? '',
      targetCustomer: initial?.targetCustomer ?? '',
      inclusions: arrayToLines(initial?.inclusions ?? []),
      exclusions: arrayToLines(initial?.exclusions ?? []),
      published: initial?.published ?? false,
      featured: initial?.featured ?? false,
      displayOrder: String(initial?.displayOrder ?? 100),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const paise = rupeesToPaise(values.price);
    if (paise === 'invalid') {
      setError('price', { type: 'manual', message: 'Enter the price in rupees, or leave blank for "Contact for Quotation".' });
      return;
    }
    const payload = {
      name: values.name.trim(),
      slug: toSlugInput(values.slug),
      audience: values.audience,
      serviceCategory: values.serviceCategory,
      description: values.description.trim(),
      priceInPaise: paise,
      currency: 'INR',
      billingFrequency: values.billingFrequency,
      additionalCharges: nullIfBlank(values.additionalCharges),
      targetCustomer: values.targetCustomer.trim(),
      inclusions: linesToArray(values.inclusions),
      exclusions: linesToArray(values.exclusions),
      published: values.published,
      featured: values.featured,
      displayOrder: Number(values.displayOrder),
    };
    try {
      if (initial) await adminApi.updatePlan(initial.id, payload);
      else await adminApi.createPlan(payload);
      onSaved();
    } catch (error) {
      if (error instanceof ApiRequestError && error.fields) {
        for (const item of error.fields) {
          const key = FIELD_MAP[item.field];
          if (key) setError(key, { type: 'server', message: item.message });
        }
      }
      setFormError(error instanceof ApiRequestError ? error.message : 'The plan could not be saved. Please try again.');
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {formError && <FormMessage kind="error">{formError}</FormMessage>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="plan-name" label="Plan name" required error={errors.name?.message}>
          <TextInput id="plan-name" invalid={!!errors.name} {...register('name')} />
        </Field>
        <Field id="plan-slug" label="URL slug" hint="Leave blank to generate from the name." error={errors.slug?.message}>
          <TextInput id="plan-slug" invalid={!!errors.slug} {...register('slug')} />
        </Field>
        <Field id="plan-audience" label="Customer type" required error={errors.audience?.message}>
          <SelectInput id="plan-audience" {...register('audience')}>
            {(Object.keys(AUDIENCE_LABELS) as (keyof typeof AUDIENCE_LABELS)[]).map((item) => (
              <option key={item} value={item}>
                {AUDIENCE_LABELS[item]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field id="plan-category" label="Service category" required error={errors.serviceCategory?.message}>
          <SelectInput id="plan-category" {...register('serviceCategory')}>
            {CATEGORY_ORDER.map((item) => (
              <option key={item} value={item}>
                {CATEGORY_LABELS[item]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field
          id="plan-price"
          label="Price in rupees (optional)"
          hint="Leave blank to show “Contact for Quotation”. Enter only approved prices."
          error={errors.price?.message}
        >
          <TextInput id="plan-price" inputMode="decimal" placeholder="e.g. 1500" invalid={!!errors.price} {...register('price')} />
        </Field>
        <Field id="plan-billing" label="Billing frequency" error={errors.billingFrequency?.message}>
          <SelectInput id="plan-billing" {...register('billingFrequency')}>
            {(Object.keys(BILLING_LABELS) as (keyof typeof BILLING_LABELS)[]).map((item) => (
              <option key={item} value={item}>
                {BILLING_LABELS[item]}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field id="plan-description" label="Short description" required error={errors.description?.message}>
        <TextArea id="plan-description" rows={2} invalid={!!errors.description} {...register('description')} />
      </Field>
      <Field id="plan-target" label="Target customer" required error={errors.targetCustomer?.message}>
        <TextInput id="plan-target" invalid={!!errors.targetCustomer} {...register('targetCustomer')} />
      </Field>
      <Field id="plan-inclusions" label="Included" hint="One item per line." error={errors.inclusions?.message}>
        <TextArea id="plan-inclusions" rows={4} invalid={!!errors.inclusions} {...register('inclusions')} />
      </Field>
      <Field id="plan-exclusions" label="Not included" hint="One item per line." error={errors.exclusions?.message}>
        <TextArea id="plan-exclusions" rows={3} invalid={!!errors.exclusions} {...register('exclusions')} />
      </Field>
      <Field
        id="plan-charges"
        label="Applicable additional charges"
        hint="For example: government fees, GST where applicable, third-party costs."
        error={errors.additionalCharges?.message}
      >
        <TextArea id="plan-charges" rows={2} invalid={!!errors.additionalCharges} {...register('additionalCharges')} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field id="plan-order" label="Display order" error={errors.displayOrder?.message}>
          <TextInput id="plan-order" inputMode="numeric" invalid={!!errors.displayOrder} {...register('displayOrder')} />
        </Field>
        <fieldset className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <legend className="sr-only">Visibility</legend>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 accent-navy" {...register('published')} /> Visible on website
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 accent-navy" {...register('featured')} /> Featured on homepage
          </label>
        </fieldset>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={buttonClass('secondary')}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClass('primary')}>
          {isSubmitting ? 'Saving…' : initial ? 'Save changes' : 'Create plan'}
        </button>
      </div>
    </form>
  );
}

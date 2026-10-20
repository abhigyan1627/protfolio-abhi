import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { ApiRequestError } from '../../lib/api';
import { arrayToLines, faqsToLines, linesToArray, parseFaqLines, toSlugInput } from '../../lib/adminForm';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../../lib/format';
import type { AdminService } from '../../types/api';
import { Field, SelectInput, TextArea, TextInput } from '../ui/FormControls';
import { buttonClass } from '../ui/styles';
import { FormMessage } from './AdminPrimitives';

const ICON_OPTIONS = ['file-text', 'calculator', 'receipt', 'building', 'landmark', 'briefcase', 'rocket', 'book-open', 'shield-check', 'line-chart', 'users', 'file-check', 'scale', 'wallet'];

const lineList = (max: number, label: string) =>
  z.string().refine((value) => linesToArray(value).length <= max, `${label}: keep to ${max} lines.`);

const schema = z.object({
  name: z.string().trim().min(3, 'Enter a service name of at least 3 characters.').max(120),
  slug: z
    .string()
    .trim()
    .max(120)
    .refine((value) => value === '' || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), 'Use lowercase letters, numbers and hyphens only.'),
  category: z.enum(['INCOME_TAX', 'GST', 'BUSINESS_COMPANY', 'ACCOUNTING_FINANCE', 'AUDIT_OTHER']),
  iconKey: z.string().min(1),
  description: z.string().trim().min(10, 'Add a short description (at least 10 characters).').max(280),
  overview: z.string().trim().min(20, 'Add an overview (at least 20 characters).').max(4000),
  whoMayNeed: lineList(12, 'Who may need it'),
  documents: lineList(30, 'Documents'),
  deliverables: lineList(20, 'Deliverables'),
  exclusions: lineList(20, 'Exclusions'),
  faqs: z.string(),
  enabled: z.boolean(),
  published: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.string().regex(/^\d{1,4}$/, 'Use a whole number from 0 to 9999.'),
});

type ServiceFormValues = z.input<typeof schema>;

const FIELD_MAP: Record<string, keyof ServiceFormValues> = {
  name: 'name',
  slug: 'slug',
  category: 'category',
  iconKey: 'iconKey',
  description: 'description',
  displayOrder: 'displayOrder',
  enabled: 'enabled',
  published: 'published',
  featured: 'featured',
  'details.overview': 'overview',
  'details.whoMayNeed': 'whoMayNeed',
  'details.documents': 'documents',
  'details.deliverables': 'deliverables',
  'details.exclusions': 'exclusions',
  'details.faqs': 'faqs',
};

export function ServiceEditor({ initial, onSaved, onCancel }: { initial?: AdminService; onSaved: () => void; onCancel: () => void }) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      category: initial?.category ?? 'INCOME_TAX',
      iconKey: initial?.iconKey ?? 'file-text',
      description: initial?.description ?? '',
      overview: initial?.details.overview ?? '',
      whoMayNeed: arrayToLines(initial?.details.whoMayNeed ?? []),
      documents: arrayToLines(initial?.details.documents ?? []),
      deliverables: arrayToLines(initial?.details.deliverables ?? []),
      exclusions: arrayToLines(initial?.details.exclusions ?? []),
      faqs: faqsToLines(initial?.details.faqs ?? []),
      enabled: initial?.enabled ?? true,
      published: initial?.published ?? false,
      featured: initial?.featured ?? false,
      displayOrder: String(initial?.displayOrder ?? 100),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const payload = {
      name: values.name.trim(),
      slug: toSlugInput(values.slug),
      category: values.category,
      iconKey: values.iconKey,
      description: values.description.trim(),
      details: {
        overview: values.overview.trim(),
        whoMayNeed: linesToArray(values.whoMayNeed),
        documents: linesToArray(values.documents),
        deliverables: linesToArray(values.deliverables),
        exclusions: linesToArray(values.exclusions),
        faqs: parseFaqLines(values.faqs),
      },
      enabled: values.enabled,
      published: values.published,
      featured: values.featured,
      displayOrder: Number(values.displayOrder),
    };
    try {
      if (initial) await adminApi.updateService(initial.id, payload);
      else await adminApi.createService(payload);
      onSaved();
    } catch (error) {
      if (error instanceof ApiRequestError && error.fields) {
        for (const item of error.fields) {
          const key = FIELD_MAP[item.field];
          if (key) setError(key, { type: 'server', message: item.message });
        }
      }
      setFormError(error instanceof ApiRequestError ? error.message : 'The service could not be saved. Please try again.');
    }
  });

  const area = (name: keyof ServiceFormValues, label: string, rows = 3, hint?: string) => (
    <Field id={`svc-${name}`} label={label} error={errors[name]?.message as string | undefined} hint={hint}>
      <TextArea id={`svc-${name}`} rows={rows} invalid={!!errors[name]} {...register(name)} />
    </Field>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {formError && <FormMessage kind="error">{formError}</FormMessage>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="svc-name" label="Name" required error={errors.name?.message}>
          <TextInput id="svc-name" invalid={!!errors.name} {...register('name')} />
        </Field>
        <Field id="svc-slug" label="URL slug" hint="Leave blank to generate from the name." error={errors.slug?.message}>
          <TextInput id="svc-slug" invalid={!!errors.slug} {...register('slug')} />
        </Field>
        <Field id="svc-category" label="Category" required error={errors.category?.message}>
          <SelectInput id="svc-category" {...register('category')}>
            {CATEGORY_ORDER.map((item) => (
              <option key={item} value={item}>
                {CATEGORY_LABELS[item]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field id="svc-icon" label="Icon" error={errors.iconKey?.message}>
          <SelectInput id="svc-icon" {...register('iconKey')}>
            {ICON_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field id="svc-description" label="Short description (listing cards)" required error={errors.description?.message}>
        <TextArea id="svc-description" rows={2} invalid={!!errors.description} {...register('description')} />
      </Field>

      {area('overview', 'Service overview', 4)}
      {area('whoMayNeed', 'Who may need it', 3, 'One item per line.')}
      {area('documents', 'Typical documentation checklist', 4, 'One item per line.')}
      {area('deliverables', 'Scope and deliverables', 3, 'One item per line.')}
      {area('exclusions', 'Important exclusions', 3, 'One item per line.')}
      {area('faqs', 'Frequently asked questions', 5, 'One per line, written as "Question :: Answer".')}

      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field id="svc-order" label="Display order" hint="Lower numbers appear first." error={errors.displayOrder?.message}>
          <TextInput id="svc-order" inputMode="numeric" invalid={!!errors.displayOrder} {...register('displayOrder')} />
        </Field>
        <fieldset className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <legend className="sr-only">Visibility</legend>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 accent-navy" {...register('enabled')} /> Provided by the practice
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 accent-navy" {...register('published')} /> Visible on website
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 accent-navy" {...register('featured')} /> Featured on homepage
          </label>
        </fieldset>
      </div>
      <p className="text-xs text-slate">A service appears on the website only when it is both provided and visible.</p>

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={buttonClass('secondary')}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClass('primary')}>
          {isSubmitting ? 'Saving…' : initial ? 'Save changes' : 'Create service'}
        </button>
      </div>
    </form>
  );
}

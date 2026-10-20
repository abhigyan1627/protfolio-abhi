import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { ApiRequestError } from '../../lib/api';
import { toSlugInput } from '../../lib/adminForm';
import type { AdminResource } from '../../types/api';
import { Field, TextArea, TextInput } from '../ui/FormControls';
import { buttonClass } from '../ui/styles';
import { FormMessage } from './AdminPrimitives';

const schema = z.object({
  title: z.string().trim().min(5, 'Enter a title of at least 5 characters.').max(160),
  slug: z
    .string()
    .trim()
    .max(120)
    .refine((value) => value === '' || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), 'Use lowercase letters, numbers and hyphens only.'),
  category: z.string().trim().min(2, 'Enter a category.').max(60),
  excerpt: z.string().trim().min(20, 'Add a summary of at least 20 characters.').max(300),
  body: z.string().trim().min(40, 'The article body needs at least 40 characters.').max(30000),
  published: z.boolean(),
});

type ResourceFormValues = z.input<typeof schema>;

export function ResourceEditor({ initial, onSaved, onCancel }: { initial?: AdminResource; onSaved: () => void; onCancel: () => void }) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      category: initial?.category ?? 'Income Tax',
      excerpt: initial?.excerpt ?? '',
      body: initial?.body ?? '',
      published: initial?.published ?? false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const payload = {
      title: values.title.trim(),
      slug: toSlugInput(values.slug),
      category: values.category.trim(),
      excerpt: values.excerpt.trim(),
      body: values.body.trim(),
      published: values.published,
    };
    try {
      if (initial) await adminApi.updateResource(initial.id, payload);
      else await adminApi.createResource(payload);
      onSaved();
    } catch (error) {
      if (error instanceof ApiRequestError && error.fields) {
        for (const item of error.fields) {
          if (item.field in payload) setError(item.field as keyof ResourceFormValues, { type: 'server', message: item.message });
        }
      }
      setFormError(error instanceof ApiRequestError ? error.message : 'The article could not be saved. Please try again.');
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {formError && <FormMessage kind="error">{formError}</FormMessage>}
      <Field id="res-title" label="Title" required error={errors.title?.message}>
        <TextInput id="res-title" invalid={!!errors.title} {...register('title')} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="res-slug" label="URL slug" hint="Leave blank to generate from the title." error={errors.slug?.message}>
          <TextInput id="res-slug" invalid={!!errors.slug} {...register('slug')} />
        </Field>
        <Field id="res-category" label="Category" required error={errors.category?.message}>
          <TextInput id="res-category" invalid={!!errors.category} {...register('category')} />
        </Field>
      </div>
      <Field id="res-excerpt" label="Summary" required error={errors.excerpt?.message}>
        <TextArea id="res-excerpt" rows={2} invalid={!!errors.excerpt} {...register('excerpt')} />
      </Field>
      <Field
        id="res-body"
        label="Article body"
        required
        error={errors.body?.message}
        hint="Markdown: use ## for section headings, - for bullet points, and blank lines between paragraphs. Include the date and any verification notes."
      >
        <TextArea id="res-body" rows={14} invalid={!!errors.body} className="font-mono text-sm" {...register('body')} />
      </Field>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" className="size-4 accent-navy" {...register('published')} /> Publish on the website
      </label>
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={buttonClass('secondary')}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClass('primary')}>
          {isSubmitting ? 'Saving…' : initial ? 'Save changes' : 'Create article'}
        </button>
      </div>
    </form>
  );
}

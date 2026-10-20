import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { adminApi } from '../../lib/adminApi';
import { ApiRequestError } from '../../lib/api';
import { nullIfBlank } from '../../lib/adminForm';
import type { AdminSettings } from '../../types/api';
import { Field, TextArea, TextInput } from '../ui/FormControls';
import { buttonClass, cardClass } from '../ui/styles';
import { FormMessage } from './AdminPrimitives';

const schema = z.object({
  businessName: z.string().trim().min(3, 'Enter the business name.').max(120),
  profession: z.string().trim().min(3).max(120),
  hindiName: z.string().max(120),
  hindiNameApproved: z.boolean(),
  phone: z.string().trim().min(8, 'Enter a phone number.').max(25),
  whatsappNumber: z.string().trim().regex(/^[1-9]\d{7,14}$/, 'Digits only, in international format (for example 916299033454).'),
  email: z.string().trim().max(120).refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email address.'),
  address: z.string().trim().min(10, 'Enter the full address.').max(400),
  plusCode: z.string().max(60),
  businessHours: z.string().max(300),
  websiteUrl: z.string().trim().max(500),
  googleBusinessUrl: z.string().trim().max(500),
  googleMapsUrl: z.string().trim().max(500),
  mapEmbedUrl: z.string().trim().max(500),
  showGoogleRating: z.boolean(),
  googleRating: z.string().refine((value) => value.trim() === '' || (Number(value) >= 0 && Number(value) <= 5), 'Enter a rating between 0 and 5.'),
  googleReviewCount: z.string().refine((value) => value.trim() === '' || /^\d{1,7}$/.test(value.trim()), 'Enter a whole number.'),
});

type SettingsFormValues = z.input<typeof schema>;

const URL_FIELDS = ['websiteUrl', 'googleBusinessUrl', 'googleMapsUrl', 'mapEmbedUrl'] as const;

export function SettingsForm({ settings, canEdit, onSaved }: { settings: AdminSettings; canEdit: boolean; onSaved: (next: AdminSettings) => void }) {
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: settings.businessName,
      profession: settings.profession,
      hindiName: settings.hindiName ?? '',
      hindiNameApproved: settings.hindiNameApproved,
      phone: settings.phone,
      whatsappNumber: settings.whatsappNumber,
      email: settings.email ?? '',
      address: settings.address,
      plusCode: settings.plusCode ?? '',
      businessHours: settings.businessHours ?? '',
      websiteUrl: settings.websiteUrl ?? '',
      googleBusinessUrl: settings.googleBusinessUrl ?? '',
      googleMapsUrl: settings.googleMapsUrl ?? '',
      mapEmbedUrl: settings.mapEmbedUrl ?? '',
      showGoogleRating: settings.showGoogleRating,
      googleRating: settings.googleRating === null ? '' : String(settings.googleRating),
      googleReviewCount: settings.googleReviewCount === null ? '' : String(settings.googleReviewCount),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    const payload = {
      businessName: values.businessName.trim(),
      profession: values.profession.trim(),
      hindiName: nullIfBlank(values.hindiName),
      hindiNameApproved: values.hindiNameApproved,
      phone: values.phone.trim(),
      whatsappNumber: values.whatsappNumber.trim(),
      email: nullIfBlank(values.email),
      address: values.address.trim(),
      plusCode: nullIfBlank(values.plusCode),
      businessHours: nullIfBlank(values.businessHours),
      websiteUrl: nullIfBlank(values.websiteUrl),
      googleBusinessUrl: nullIfBlank(values.googleBusinessUrl),
      googleMapsUrl: nullIfBlank(values.googleMapsUrl),
      mapEmbedUrl: nullIfBlank(values.mapEmbedUrl),
      showGoogleRating: values.showGoogleRating,
      googleRating: values.googleRating.trim() === '' ? null : Number(values.googleRating),
      googleReviewCount: values.googleReviewCount.trim() === '' ? null : Number(values.googleReviewCount),
    };
    try {
      const updated = await adminApi.updateSettings(payload);
      setMessage({ kind: 'success', text: 'Settings saved. The website now shows these details.' });
      onSaved(updated);
    } catch (error) {
      if (error instanceof ApiRequestError && error.fields) {
        for (const item of error.fields) {
          if (item.field in payload) setError(item.field as keyof SettingsFormValues, { type: 'server', message: item.message });
        }
      }
      setMessage({ kind: 'error', text: error instanceof ApiRequestError ? error.message : 'Settings could not be saved.' });
    }
  });

  const disabled = !canEdit || isSubmitting;

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8">
      {!canEdit && <FormMessage kind="error">Only the owner account can change website settings. You can view them here.</FormMessage>}
      {message && <FormMessage kind={message.kind}>{message.text}</FormMessage>}

      <fieldset disabled={disabled} className={`${cardClass} space-y-5 disabled:opacity-80`}>
        <legend className="font-display text-lg font-bold text-navy">Business details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="set-name" label="Business name" required error={errors.businessName?.message}>
            <TextInput id="set-name" invalid={!!errors.businessName} {...register('businessName')} />
          </Field>
          <Field id="set-profession" label="Profession" error={errors.profession?.message}>
            <TextInput id="set-profession" invalid={!!errors.profession} {...register('profession')} />
          </Field>
          <Field id="set-hindi" label="Hindi name" error={errors.hindiName?.message} hint="Hindi branding is shown only when approved below.">
            <TextInput id="set-hindi" lang="hi" invalid={!!errors.hindiName} {...register('hindiName')} />
          </Field>
          <label className="inline-flex items-end gap-2 pb-2.5 text-sm">
            <input type="checkbox" className="size-4 accent-navy" {...register('hindiNameApproved')} /> I approve the Hindi name for display
          </label>
        </div>
      </fieldset>

      <fieldset disabled={disabled} className={`${cardClass} space-y-5 disabled:opacity-80`}>
        <legend className="font-display text-lg font-bold text-navy">Contact and location</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="set-phone" label="Phone" required error={errors.phone?.message}>
            <TextInput id="set-phone" type="tel" invalid={!!errors.phone} {...register('phone')} />
          </Field>
          <Field id="set-whatsapp" label="WhatsApp number" required error={errors.whatsappNumber?.message} hint="International format, digits only. Confirm it is on WhatsApp before launch.">
            <TextInput id="set-whatsapp" inputMode="numeric" invalid={!!errors.whatsappNumber} {...register('whatsappNumber')} />
          </Field>
          <Field id="set-email" label="Business email" error={errors.email?.message}>
            <TextInput id="set-email" type="email" invalid={!!errors.email} {...register('email')} />
          </Field>
          <Field id="set-plus" label="Plus Code" error={errors.plusCode?.message}>
            <TextInput id="set-plus" invalid={!!errors.plusCode} {...register('plusCode')} />
          </Field>
        </div>
        <Field id="set-address" label="Address" required error={errors.address?.message}>
          <TextArea id="set-address" rows={2} invalid={!!errors.address} {...register('address')} />
        </Field>
        <Field id="set-hours" label="Office hours" error={errors.businessHours?.message} hint="Leave blank until confirmed. The website then says hours will be confirmed.">
          <TextInput id="set-hours" invalid={!!errors.businessHours} {...register('businessHours')} />
        </Field>
      </fieldset>

      <fieldset disabled={disabled} className={`${cardClass} space-y-5 disabled:opacity-80`}>
        <legend className="font-display text-lg font-bold text-navy">Links</legend>
        <p className="text-sm text-slate">Add links only after they have been verified. Leave blank to hide them.</p>
        <div className="grid gap-5">
          {URL_FIELDS.map((name) => (
            <Field key={name} id={`set-${name}`} label={labelFor(name)} error={errors[name]?.message}>
              <TextInput id={`set-${name}`} type="url" placeholder="https://" invalid={!!errors[name]} {...register(name)} />
            </Field>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={disabled} className={`${cardClass} space-y-5 disabled:opacity-80`}>
        <legend className="font-display text-lg font-bold text-navy">Google rating</legend>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" className="mt-1 size-4 accent-navy" {...register('showGoogleRating')} />
          <span>Show the rating on the website. Enable only after confirming the Google Business Profile details are current.</span>
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="set-rating" label="Rating (out of 5)" error={errors.googleRating?.message}>
            <TextInput id="set-rating" inputMode="decimal" invalid={!!errors.googleRating} {...register('googleRating')} />
          </Field>
          <Field id="set-reviews" label="Number of reviews" error={errors.googleReviewCount?.message}>
            <TextInput id="set-reviews" inputMode="numeric" invalid={!!errors.googleReviewCount} {...register('googleReviewCount')} />
          </Field>
        </div>
      </fieldset>

      {canEdit && (
        <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-4 border-t border-line bg-ivory px-5 py-4 sm:-mx-8 sm:px-8">
          <span className="text-sm text-slate">{isDirty ? 'You have unsaved changes.' : 'All changes saved.'}</span>
          <button type="submit" disabled={isSubmitting || !isDirty} className={buttonClass('primary')}>
            {isSubmitting ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      )}
    </form>
  );
}

function labelFor(name: (typeof URL_FIELDS)[number]): string {
  return {
    websiteUrl: 'Website address',
    googleBusinessUrl: 'Google Business Profile link',
    googleMapsUrl: 'Google Maps link',
    mapEmbedUrl: 'Map embed link',
  }[name];
}

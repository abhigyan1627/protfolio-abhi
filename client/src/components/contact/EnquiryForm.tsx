import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { ApiRequestError } from '../../lib/api';
import { publicApi } from '../../lib/publicApi';
import { trackEvent } from '../../lib/analytics';
import { enquiryFormSchema, type EnquiryFormValues } from '../../lib/validation';
import { whatsappMessages } from '../../lib/whatsapp';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { Field, SelectInput, TextArea, TextInput } from '../ui/FormControls';
import { buttonClass, cardClass, errorClass, focusRing } from '../ui/styles';
import type { ContactMethod, Plan, Service } from '../../types/api';

const METHOD_OPTIONS: { value: ContactMethod; label: string }[] = [
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'PHONE', label: 'Phone call' },
  { value: 'EMAIL', label: 'Email' },
];

interface Receipt {
  referenceCode: string;
  message: string;
}

export function EnquiryForm() {
  const formId = useId();
  const mountedAt = useRef(Date.now());
  const [params] = useSearchParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const services = useAsync((signal) => publicApi.services(signal), []);
  const plans = useAsync((signal) => publicApi.plans(signal), []);

  // Pre-select a service or plan when the visitor arrives from a service or pricing page.
  const serviceFromLink = useMemo(
    () => services.data?.find((service) => service.slug === params.get('service'))?.id ?? '',
    [services.data, params],
  );
  const planFromLink = useMemo(
    () => plans.data?.find((plan: Plan) => plan.slug === params.get('plan'))?.id ?? '',
    [plans.data, params],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: '',
      contactMethod: 'WHATSAPP',
      phone: '',
      email: '',
      serviceId: '',
      planId: '',
      message: '',
      consent: false,
      website: '',
    },
  });

  useEffect(() => {
    if (serviceFromLink) setValue('serviceId', serviceFromLink);
  }, [serviceFromLink, setValue]);

  useEffect(() => {
    if (planFromLink) setValue('planId', planFromLink);
  }, [planFromLink, setValue]);

  const contactMethod = watch('contactMethod');
  const serviceId = watch('serviceId');
  const selectedService: Service | undefined = services.data?.find((service) => service.id === serviceId);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      const result = await publicApi.submitEnquiry({
        name: values.name,
        contactMethod: values.contactMethod,
        phone: values.phone || undefined,
        email: values.email || undefined,
        serviceId: values.serviceId || undefined,
        planId: values.planId || undefined,
        message: values.message || undefined,
        consent: true,
        website: values.website ?? '',
        formElapsedMs: Math.max(0, Date.now() - mountedAt.current),
      });
      trackEvent('enquiry_submitted', { contact_method: values.contactMethod });
      setReceipt(result);
      reset();
    } catch (error) {
      if (error instanceof ApiRequestError && error.fields?.length) {
        for (const field of error.fields) {
          if (field.field in values) {
            setError(field.field as keyof EnquiryFormValues, { type: 'server', message: field.message });
          }
        }
      }
      setFormError(
        error instanceof ApiRequestError ? error.message : 'We could not send your enquiry. Please try again or contact us on WhatsApp.',
      );
    } finally {
      setSubmitting(false);
    }
  });

  if (receipt) {
    return (
      <div role="status" className={`${cardClass} text-center sm:p-10`}>
        <CheckCircle2 aria-hidden className="mx-auto size-10 text-whatsapp" />
        <h2 className="mt-4 font-display text-2xl font-bold text-navy">Thank you. Your enquiry is with us.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate">
          Your reference number is{' '}
          <strong className="font-semibold text-ink" translate="no">
            {receipt.referenceCode}
          </strong>
          . Please keep it for your records. We will reply using the contact method you chose.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <WhatsAppLink
            context="enquiry-receipt"
            message={whatsappMessages.enquiryFollowUp(receipt.referenceCode)}
            label="Share reference on WhatsApp"
          />
          <button type="button" onClick={() => setReceipt(null)} className={buttonClass('secondary')}>
            Send another enquiry
          </button>
        </div>
        <Link to="/services" className={`mt-5 inline-block text-sm font-semibold text-navy underline-offset-4 hover:underline ${focusRing}`}>
          Browse services while you wait
        </Link>
      </div>
    );
  }

  const showPhone = contactMethod !== 'EMAIL';

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={formError ? `${formId}-form-error` : undefined} className={`${cardClass} space-y-6 sm:p-8`}>
      {formError && (
        <div id={`${formId}-form-error`} role="alert" className="rounded-md border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-900">
          {formError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${formId}-name`} label="Full name" required error={errors.name?.message}>
          <TextInput
            id={`${formId}-name`}
            autoComplete="name"
            invalid={!!errors.name}
            {...register('name')}
          />
        </Field>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-ink">
            How should we contact you? <span className="text-red-800">*</span>
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {METHOD_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-md border px-3.5 py-2 text-sm transition-colors has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                  contactMethod === option.value ? '' : 'border-line bg-white text-ink hover:border-navy'
                }`}
              >
                <input type="radio" value={option.value} className="sr-only" {...register('contactMethod')} />
                {option.label}
              </label>
            ))}
          </div>
          {errors.contactMethod && <p className={errorClass}>{errors.contactMethod.message}</p>}
        </fieldset>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {showPhone && (
          <Field
            id={`${formId}-phone`}
            label="Mobile number"
            required
            error={errors.phone?.message}
            hint="Indian mobile numbers are fine as they are, for example 62990 33454."
          >
            <TextInput
              id={`${formId}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              invalid={!!errors.phone}
              {...register('phone')}
            />
          </Field>
        )}
        <Field
          id={`${formId}-email`}
          label={contactMethod === 'EMAIL' ? 'Email address' : 'Email (optional)'}
          required={contactMethod === 'EMAIL'}
          error={errors.email?.message}
        >
          <TextInput
            id={`${formId}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            invalid={!!errors.email}
            {...register('email')}
          />
        </Field>
      </div>

      <Field id={`${formId}-service`} label="Service of interest" hint={selectedService ? selectedService.description : 'Optional. Choose "General enquiry" if you are unsure.'}>
        <SelectInput id={`${formId}-service`} {...register('serviceId')}>
          <option value="">General enquiry</option>
          {(services.data ?? []).map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </SelectInput>
      </Field>

      {plans.data && plans.data.length > 0 && (
        <Field id={`${formId}-plan`} label="Plan of interest (optional)">
          <SelectInput id={`${formId}-plan`} {...register('planId')}>
            <option value="">No specific plan</option>
            {plans.data.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </SelectInput>
        </Field>
      )}

      <Field id={`${formId}-message`} label="Message (optional)" error={errors.message?.message} hint="Briefly describe your question. Please do not include PAN, Aadhaar numbers, OTPs or bank details.">
        <TextArea id={`${formId}-message`} rows={4} invalid={!!errors.message} {...register('message')} />
      </Field>

      {/* Honeypot: hidden from people and screen readers, filled only by automated form-fillers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink">
          <input
            type="checkbox"
            className="mt-1 size-4 accent-navy"
            aria-invalid={!!errors.consent || undefined}
            aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
            {...register('consent')}
          />
          <span>
            I have read the{' '}
            <Link to="/privacy-policy" className="font-semibold text-navy underline-offset-4 hover:underline">
              privacy notice
            </Link>{' '}
            and agree that CA Mohit Agrawal may contact me about this enquiry. <span className="text-red-800">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id={`${formId}-consent-error`} className={errorClass}>
            {errors.consent.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={submitting} className={buttonClass('primary')}>
          {submitting ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="text-xs text-slate">Prefer a faster reply? Use the WhatsApp button beside the form.</p>
      </div>
    </form>
  );
}

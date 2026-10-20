import { useState } from 'react'
import { Link } from 'react-router'
import { enquiryEndpoint } from '../config/env'
import { audiences } from '../data/audiences'
import { services, serviceById } from '../data/services'
import { CONTACT_METHODS, validateEnquiry } from '../utils/validation'
import { buildEnquiryMessage } from '../utils/whatsapp'
import WhatsAppCta from './WhatsAppCta'

const INITIAL = { name: '', service: '', contactMethod: 'whatsapp', contact: '', message: '', consent: false }
const MESSAGE_LIMIT = 600
const FIELD_ORDER = ['name', 'service', 'contact', 'message', 'consent']
const GENERAL = 'general'

function describedBy(id, { hint = false, error }) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
}

function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={`${id}-error`} className="mt-2 text-sm text-red-800">
      {children}
    </p>
  )
}

function serviceLabel(value) {
  if (value === GENERAL) return 'General enquiry'
  return serviceById[value]?.title ?? ''
}

/**
 * Basic enquiry form with inline validation. When VITE_ENQUIRY_FORM_ENDPOINT is set, it sends JSON to that
 * endpoint and only reports success on a 2xx response. When it is not set, nothing is sent: the form prepares
 * the enquiry for the visitor to send through WhatsApp. The UI states which of the two applies.
 */
export default function EnquiryForm() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed | prepared
  const delivered = Boolean(enquiryEndpoint)
  const isEmail = values.contactMethod === 'email'
  const whatsappFallback = buildEnquiryMessage({
    name: values.name,
    service: serviceLabel(values.service),
    contactMethod: CONTACT_METHODS.find((item) => item.value === values.contactMethod)?.label ?? '',
    contact: values.contact,
    message: values.message,
  })

  const update = (field, value) => {
    const next = { ...values, [field]: value }
    setValues(next)
    if (submitted) setErrors(validateEnquiry(next))
    if (status !== 'sending') setStatus('idle')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)

    const found = validateEnquiry(values)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    if (!delivered) {
      setStatus('prepared')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(enquiryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...values,
          name: values.name.trim(),
          contact: values.contact.trim(),
          message: values.message.trim(),
          source: 'website-enquiry-form',
        }),
      })
      if (!response.ok) throw new Error(`Enquiry endpoint responded with status ${response.status}`)
      setValues(INITIAL)
      setSubmitted(false)
      setErrors({})
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-sm border border-champagne-500/50 bg-champagne-200/40 p-6 sm:p-8">
        <p className="font-display text-2xl text-navy-900">Thank you. Your enquiry has been received.</p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-700">
          The firm will reply using the contact method you chose.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-outline mt-6">
          Send another enquiry
        </button>
      </div>
    )
  }

  if (status === 'prepared') {
    return (
      <div role="status" className="rounded-sm border border-navy-900/15 bg-ivory-100 p-6 sm:p-8">
        <p className="font-display text-2xl text-navy-900">Your enquiry is ready for WhatsApp.</p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-700">
          This form is not connected to a delivery service yet, so nothing has been sent from this page. Open WhatsApp
          with your details already written, then review the message and send it yourself.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <WhatsAppCta message={whatsappFallback} variant="navy">
            Open WhatsApp with my enquiry
          </WhatsAppCta>
          <button type="button" onClick={() => setStatus('idle')} className="btn-outline">
            Edit my enquiry
          </button>
        </div>
      </div>
    )
  }

  const hasErrors = submitted && Object.keys(errors).length > 0

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-7" aria-describedby="enquiry-notice">
      <p id="enquiry-notice" className="rounded-sm bg-ivory-100 p-4 text-sm leading-relaxed text-charcoal-700">
        {delivered
          ? 'Please don’t include PAN, Aadhaar, bank details, passwords or OTPs in this form.'
          : 'This form is not yet connected to a delivery service. Sending it prepares your enquiry for WhatsApp; it does not send it. Please don’t include PAN, Aadhaar, bank details, passwords or OTPs.'}
      </p>

      {hasErrors && (
        <p role="alert" className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          Please correct the highlighted fields.
        </p>
      )}

      {status === 'failed' && (
        <div role="alert" className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">We could not send your enquiry.</p>
          <p className="mt-1">Please try again, or continue on WhatsApp with your details already written.</p>
          <div className="mt-4">
            <WhatsAppCta message={whatsappFallback} variant="navy" className="min-h-10 px-4 text-xs">
              Continue on WhatsApp
            </WhatsAppCta>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-navy-900">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy('name', { error: errors.name })}
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          className="field mt-2"
        />
        <FieldError id="name">{errors.name}</FieldError>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-semibold text-navy-900">
          Service of interest
        </label>
        <select
          id="service"
          name="service"
          aria-required="true"
          aria-invalid={Boolean(errors.service)}
          aria-describedby={describedBy('service', { error: errors.service })}
          value={values.service}
          onChange={(event) => update('service', event.target.value)}
          className="field mt-2"
        >
          <option value="">Choose a service</option>
          {audiences.map((audience) => (
            <optgroup key={audience.id} label={audience.servicesHeading}>
              {services
                .filter((service) => service.audience === audience.id)
                .map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
            </optgroup>
          ))}
          <option value={GENERAL}>General enquiry</option>
        </select>
        <FieldError id="service">{errors.service}</FieldError>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-navy-900">Preferred contact method</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {CONTACT_METHODS.map((method) => (
            <label
              key={method.value}
              className="cursor-pointer rounded-sm border border-navy-900/20 bg-white px-4 py-2.5 text-sm font-medium text-navy-900 transition-colors hover:border-navy-900/50 has-checked:border-navy-900 has-checked:bg-navy-900 has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-navy-700"
            >
              <input
                type="radio"
                name="contactMethod"
                value={method.value}
                checked={values.contactMethod === method.value}
                onChange={(event) => update('contactMethod', event.target.value)}
                className="sr-only"
              />
              {method.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="contact" className="block text-sm font-semibold text-navy-900">
          {isEmail ? 'Email address' : 'Mobile number'}
        </label>
        <input
          id="contact"
          name="contact"
          type={isEmail ? 'email' : 'tel'}
          inputMode={isEmail ? 'email' : 'tel'}
          autoComplete={isEmail ? 'email' : 'tel-national'}
          aria-required="true"
          aria-invalid={Boolean(errors.contact)}
          aria-describedby={describedBy('contact', { hint: true, error: errors.contact })}
          value={values.contact}
          onChange={(event) => update('contact', event.target.value)}
          className="field mt-2"
        />
        <p id="contact-hint" className="mt-2 text-xs text-charcoal-500">
          {isEmail ? 'Used only to reply to your enquiry.' : '10-digit number. Used only to reply to your enquiry.'}
        </p>
        <FieldError id="contact">{errors.contact}</FieldError>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-navy-900">
          Message <span className="font-normal text-charcoal-500">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={MESSAGE_LIMIT}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message', { hint: true, error: errors.message })}
          value={values.message}
          onChange={(event) => update('message', event.target.value)}
          className="field mt-2"
        />
        <p id="message-hint" className="mt-2 text-xs text-charcoal-500">
          {values.message.length} of {MESSAGE_LIMIT} characters
        </p>
        <FieldError id="message">{errors.message}</FieldError>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            checked={values.consent}
            onChange={(event) => update('consent', event.target.checked)}
            className="mt-1 size-5 shrink-0 accent-navy-900"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-charcoal-700">
            I agree that the firm may contact me about this enquiry, as described in the{' '}
            <Link to="/privacy" className="font-semibold text-navy-900 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        <FieldError id="consent">{errors.consent}</FieldError>
      </div>

      <button type="submit" disabled={status === 'sending'} className="btn-navy w-full sm:w-auto">
        {status === 'sending' ? 'Sending…' : delivered ? 'Send Enquiry' : 'Prepare Enquiry for WhatsApp'}
      </button>
    </form>
  )
}

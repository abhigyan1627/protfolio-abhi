import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { audienceById } from '../data/audiences'
import { plans } from '../data/plans'
import { serviceById, services } from '../data/services'
import { billingDisplay, formatPrice } from '../utils/format'
import { validateRequirement } from '../utils/validation'
import {
  buildCustomQuoteMessage,
  buildGeneralMessage,
  buildPlanMessage,
  buildServiceMessage,
} from '../utils/whatsapp'
import WhatsAppCta from './WhatsAppCta'

const CUSTOM_SERVICE = 'something-else'
// Order follows the brief's wording: Individual, Startup, Established Business.
const FINDER_AUDIENCES = ['individuals', 'startups', 'businesses'].map((id) => audienceById[id])

function Choice({ name, value, checked, onChange, title, description }) {
  return (
    <label className="group flex cursor-pointer flex-col gap-1.5 rounded-sm border border-navy-900/15 bg-white p-5 transition duration-200 ease-out hover:border-navy-900/40 has-checked:border-navy-900 has-checked:bg-navy-900 has-checked:text-ivory has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-navy-700">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span className="font-semibold">{title}</span>
      {description && <span className="text-sm leading-relaxed opacity-80">{description}</span>}
    </label>
  )
}

function StepLabel({ step, children }) {
  return (
    <>
      <p className="text-xs font-semibold tracking-[0.2em] text-champagne-700 uppercase">Step {step} of 4</p>
      <p className="mt-2 font-display text-2xl text-navy-900">{children}</p>
    </>
  )
}

function Placeholder({ children }) {
  return (
    <div className="flex min-h-40 items-center rounded-sm border border-dashed border-navy-900/20 p-6 text-sm leading-relaxed text-charcoal-500">
      {children}
    </div>
  )
}

/**
 * Four-step service finder: customer type → service → matching plans → continue on WhatsApp.
 * It helps visitors find the right starting point. It does not calculate tax or assess eligibility.
 */
export default function ServiceFinder() {
  const [audienceId, setAudienceId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [planId, setPlanId] = useState('')
  const [note, setNote] = useState('')

  const audience = audienceById[audienceId]
  const isCustom = serviceId === CUSTOM_SERVICE
  const service = serviceById[serviceId]

  const serviceOptions = useMemo(
    () => services.filter((item) => item.audience === audienceId),
    [audienceId],
  )

  const matchingPlans = useMemo(() => {
    if (!audience || !serviceId) return []
    return isCustom
      ? plans.filter((plan) => plan.audience === audienceId && plan.serviceIds.length === 0)
      : plans.filter((plan) => plan.serviceIds.includes(serviceId))
  }, [audience, audienceId, serviceId, isCustom])

  const selectedPlan = matchingPlans.find((plan) => plan.id === planId)
  // An invalid note is not sent. The visitor is told why, and the message is still usable.
  const noteError = note.trim() ? validateRequirement(note) : ''
  const appliedNote = noteError ? '' : note

  let message = buildGeneralMessage()
  if (selectedPlan) message = buildPlanMessage(selectedPlan, { requirement: appliedNote })
  else if (isCustom && appliedNote) message = buildCustomQuoteMessage(appliedNote)
  else if (service) message = buildServiceMessage(service, appliedNote)

  const summary = [audience?.finderLabel, isCustom ? 'Something else' : service?.title, selectedPlan?.name].filter(Boolean)

  const chooseAudience = (id) => {
    setAudienceId(id)
    setServiceId('')
    setPlanId('')
  }

  const chooseService = (id) => {
    setServiceId(id)
    setPlanId('')
  }

  const togglePlan = (id) => setPlanId((current) => (current === id ? '' : id))

  const reset = () => {
    setAudienceId('')
    setServiceId('')
    setPlanId('')
    setNote('')
  }

  return (
    <div className="rounded-sm border border-navy-900/10 bg-white p-6 shadow-[0_1px_0_rgba(11,31,58,0.04)] sm:p-10 lg:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-900/10 pb-6">
        <p aria-live="polite" className="text-sm text-charcoal-700">
          {summary.length ? summary.join(' › ') : 'Answer a few short questions to see matching services and plans.'}
        </p>
        {audienceId && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-champagne-700"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Start again
          </button>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <fieldset className="lg:col-span-5">
          <legend className="sr-only">Who are you looking for services for?</legend>
          <StepLabel step={1}>Who are you looking for services for?</StepLabel>
          <div className="mt-6 grid gap-3">
            {FINDER_AUDIENCES.map((item) => (
              <Choice
                key={item.id}
                name="finder-audience"
                value={item.id}
                checked={audienceId === item.id}
                onChange={() => chooseAudience(item.id)}
                title={item.finderLabel}
                description={item.finderHint}
              />
            ))}
          </div>
        </fieldset>

        <div className="lg:col-span-7">
          {audience ? (
            <fieldset>
              <legend className="sr-only">What service do you need?</legend>
              <StepLabel step={2}>What service do you need?</StepLabel>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((item) => (
                  <Choice
                    key={item.id}
                    name="finder-service"
                    value={item.id}
                    checked={serviceId === item.id}
                    onChange={() => chooseService(item.id)}
                    title={item.title}
                  />
                ))}
                <Choice
                  name="finder-service"
                  value={CUSTOM_SERVICE}
                  checked={isCustom}
                  onChange={() => chooseService(CUSTOM_SERVICE)}
                  title="Something else"
                  description="Describe what you need and the firm will advise."
                />
              </div>
            </fieldset>
          ) : (
            <Placeholder>Choose who the services are for to see the options for that customer type.</Placeholder>
          )}
        </div>
      </div>

      {serviceId ? (
        <div className="mt-12 border-t border-navy-900/10 pt-10">
          <StepLabel step={3}>{isCustom ? 'Plans in this customer type' : `Plans for ${service.title}`}</StepLabel>

          {matchingPlans.length > 0 ? (
            <>
              <p className="mt-2 text-sm text-charcoal-700">
                {matchingPlans.length} {matchingPlans.length === 1 ? 'plan matches' : 'plans match'}. Select one if it
                fits, or continue without selecting.
              </p>
              <div role="group" aria-label="Matching plans" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {matchingPlans.map((plan) => {
                  const pressed = planId === plan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => togglePlan(plan.id)}
                      className={`flex flex-col gap-3 rounded-sm border p-6 text-left transition duration-200 ease-out ${
                        pressed
                          ? 'border-navy-900 bg-navy-900 text-ivory'
                          : 'border-navy-900/15 bg-white hover:border-navy-900/40'
                      }`}
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="font-display text-2xl leading-tight">{plan.name}</span>
                        <span
                          className={`shrink-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase ${
                            pressed ? 'text-champagne-300' : 'text-champagne-700'
                          }`}
                        >
                          {billingDisplay(plan)}
                        </span>
                      </span>
                      <span className="font-semibold">{formatPrice(plan)}</span>
                      <span className="text-sm leading-relaxed opacity-80">{plan.summary}</span>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-sm bg-ivory-100 p-6 text-sm leading-relaxed text-charcoal-700">
              <p className="font-semibold text-navy-900">
                No standard plan is listed for {isCustom ? 'this customer type' : 'this service'} yet.
              </p>
              <p className="mt-2">
                Continue on WhatsApp. The firm will confirm the scope, the documents needed and the fees with you.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {serviceId ? (
        <div className="mt-12 grid gap-8 border-t border-navy-900/10 pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-champagne-700 uppercase">Step 4 of 4</p>
            <label htmlFor="finder-note" className="mt-2 block font-display text-2xl text-navy-900">
              Add a note (optional)
            </label>
            <textarea
              id="finder-note"
              rows={3}
              maxLength={1000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-invalid={Boolean(noteError)}
              aria-describedby={noteError ? 'finder-note-hint finder-note-error' : 'finder-note-hint'}
              placeholder="For example: timing, the number of records, or a question you want answered"
              className="field mt-4"
            />
            <p id="finder-note-hint" className="mt-2 text-xs leading-relaxed text-charcoal-500">
              Please don’t include PAN, Aadhaar, bank details, passwords or OTPs.
            </p>
            {noteError && (
              <p id="finder-note-error" role="alert" className="mt-2 text-sm text-red-800">
                {noteError} Your message will go without this note until it is corrected.
              </p>
            )}
          </div>

          <div className="flex flex-col justify-end gap-4 lg:col-span-6">
            <p className="text-sm leading-relaxed text-charcoal-700">
              Your message opens in WhatsApp, already written. You review it and press send yourself.
            </p>
            <div>
              <WhatsAppCta message={message} variant="navy" className="w-full sm:w-auto">
                Continue on WhatsApp
              </WhatsAppCta>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-10 text-xs leading-relaxed text-charcoal-500">
        This finder helps you choose a starting point. It is not a tax calculator or an eligibility check, and it does
        not replace professional advice on your circumstances.
      </p>
    </div>
  )
}

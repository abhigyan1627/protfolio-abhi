import { useState } from 'react'
import { validateRequirement } from '../utils/validation'
import { buildCustomQuoteMessage } from '../utils/whatsapp'
import WhatsAppCta from './WhatsAppCta'

/** Custom quotation request. The visitor's own description is included in the WhatsApp message. */
export default function CustomQuote() {
  const [requirement, setRequirement] = useState('')
  const [touched, setTouched] = useState(false)

  const error = validateRequirement(requirement)
  const showError = touched && Boolean(error)

  return (
    <section
      id="custom-quote"
      aria-labelledby="custom-quote-heading"
      className="on-dark relative overflow-hidden bg-navy-900 text-ivory"
    >
      <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <p className="eyebrow text-champagne-300">Custom quotation</p>
          <h2 id="custom-quote-heading" className="mt-4 text-4xl leading-[1.1] text-ivory sm:text-5xl">
            Need something different? Tell us what your business requires.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ivory/75">
            Describe the work, the entities involved and the timing you have in mind. The firm will come back to you
            with the next steps and a quotation where one is needed.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-sm bg-ivory p-6 text-navy-900 sm:p-8">
            <label htmlFor="custom-requirement" className="block text-base font-semibold">
              Describe your requirement
            </label>
            <textarea
              id="custom-requirement"
              rows={6}
              maxLength={1000}
              value={requirement}
              onChange={(event) => setRequirement(event.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={showError}
              aria-describedby={showError ? 'custom-requirement-hint custom-requirement-error' : 'custom-requirement-hint'}
              placeholder="For example: monthly GST, TDS and accounting for two branches, with payroll support."
              className="field mt-3"
            />
            <p id="custom-requirement-hint" className="mt-2 text-xs leading-relaxed text-charcoal-500">
              At least 10 characters. Please don’t include PAN, Aadhaar, bank details, passwords or OTPs.
            </p>
            {showError && (
              <p id="custom-requirement-error" role="alert" className="mt-2 text-sm text-red-800">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <WhatsAppCta
                message={buildCustomQuoteMessage(requirement)}
                variant="navy"
                disabled={Boolean(error)}
                className="w-full sm:w-auto"
              >
                Get a Custom Quote
              </WhatsAppCta>
              {error && !showError && (
                <p className="text-xs text-charcoal-500">Describe your requirement to enable this button.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

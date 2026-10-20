import { processSteps } from '../data/content'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/** Four-step client journey with step indicators joined by a connecting line. */
export default function Process() {
  return (
    <div>
      <SectionHeading eyebrow="How it works" title="Four steps from enquiry to assistance" id="process-heading" />

      <ol className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-6">
        <span aria-hidden="true" className="absolute inset-y-6 left-6 w-px bg-navy-900/15 md:hidden" />
        {processSteps.map((step, index) => (
          <Reveal key={step.number} as="li" delay={index * 120} className="relative flex gap-6 md:block">
            <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-champagne-500 bg-ivory font-display text-lg font-semibold text-navy-900">
              {step.number}
            </span>
            {index < processSteps.length - 1 && (
              <span aria-hidden="true" className="absolute top-6 left-14 -right-12 hidden h-px bg-navy-900/15 md:block" />
            )}
            <div className="md:mt-7">
              <h3 className="text-2xl leading-snug">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-700">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

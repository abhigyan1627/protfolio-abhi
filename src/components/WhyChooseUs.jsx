import { aboutContent } from '../data/content'
import { principles } from '../data/content'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/** Editorial statement of the firm's service principles. Deliberately contains no claims or statistics. */
export default function WhyChooseUs() {
  return (
    <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
      <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <SectionHeading eyebrow="Our principles" title="The standards behind every engagement" id="principles-heading" />
        <blockquote className="mt-12 border-l border-champagne-500 pl-6 font-display text-2xl leading-snug text-navy-900 italic">
          {aboutContent.philosophy}
        </blockquote>
      </div>

      <ol className="divide-y divide-navy-900/10 border-y border-navy-900/10 lg:col-span-6 lg:col-start-7">
        {principles.map((principle, index) => (
          <Reveal key={principle.title} as="li" delay={index * 60} className="grid gap-3 py-8 sm:grid-cols-[3.5rem_1fr] sm:gap-6">
            <span className="font-display text-2xl text-champagne-700">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-2xl leading-snug">{principle.title}</h3>
              <p className="mt-2 leading-relaxed text-charcoal-700">{principle.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

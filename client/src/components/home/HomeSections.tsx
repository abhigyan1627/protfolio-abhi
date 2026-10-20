import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { whatsappMessages } from '../../lib/whatsapp';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { Section } from '../ui/Section';
import { buttonClass, cardClass } from '../ui/styles';
import { WHY_CHOOSE, WHO_WE_HELP, HOW_IT_WORKS } from '../../data/siteContent';

export function WhoWeHelp() {
  return (
    <Section id="who-we-help" eyebrow="Who we help" title="Support shaped around your situation" tone="white">
      <ul className="grid gap-6 lg:grid-cols-3">
        {WHO_WE_HELP.map((segment) => (
          <li key={segment.title} className={`${cardClass} flex h-full flex-col`}>
            <h3 className="font-display text-xl font-bold text-navy">{segment.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate">{segment.summary}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-ink">
              {segment.points.map((point) => (
                <li key={point} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-sm font-semibold">
              <Link to={segment.servicesTo} className="inline-flex items-center gap-1 text-navy underline-offset-4 hover:underline">
                Services <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link to={segment.plansTo} className="inline-flex items-center gap-1 text-navy underline-offset-4 hover:underline">
                Plans <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function WhyChoose() {
  return (
    <Section id="why-choose" eyebrow="Why choose us" title="Professional habits that make work easier to follow">
      <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE.map((item, index) => (
          <li key={item.title} className="border-t border-line pt-6">
            <span className="font-display text-sm font-bold text-gold-700">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 font-display text-lg font-bold text-navy">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{item.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" eyebrow="How it works" title="From first question to started work" tone="white">
      <ol className="grid gap-6 md:grid-cols-5">
        {HOW_IT_WORKS.map((step, index) => (
          <li key={step.title} className="relative rounded-lg border border-line bg-ivory p-5">
            <span className="flex size-9 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-navy">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function ContactCta() {
  return (
    <Section id="contact-cta" tone="navy" title="Have a Tax or Business Compliance Question?">
      <div className="flex flex-col gap-4 sm:flex-row">
        <WhatsAppLink
          context="contact-cta"
          message={whatsappMessages.general()}
          label="Enquire on WhatsApp"
          variant="whatsapp"
        />
        <Link to="/services" className={buttonClass('onDark')}>
          View All Services
        </Link>
      </div>
    </Section>
  );
}

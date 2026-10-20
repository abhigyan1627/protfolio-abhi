import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { buildGeneralMessage } from '../utils/whatsapp'
import HeroVisual from './HeroVisual'
import WhatsAppCta from './WhatsAppCta'

const TRUST_POINTS = [
  'Scope confirmed before work begins',
  'Charges disclosed in advance',
  'Organised document checklists',
]

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate overflow-hidden bg-navy-900 text-ivory"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900">
          <g fill="none" stroke="#d7bd84" strokeOpacity="0.13" strokeWidth="1">
            <path d="M-40 720 L520 260 L1000 640 L1480 180" />
            <path d="M-40 820 L560 340 L1040 720 L1480 300" strokeOpacity="0.07" />
            <path d="M0 150 H1440 M0 750 H1440" strokeOpacity="0.07" />
            <circle cx="1180" cy="260" r="180" />
            <circle cx="1180" cy="260" r="260" strokeOpacity="0.06" />
          </g>
        </svg>
      </div>

      <div className="container-page grid gap-16 pt-32 pb-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-40 lg:pb-28">
        <div className="lg:col-span-6">
          <p className="eyebrow animate-fade-up text-champagne-300">Chartered Accountants · Tax &amp; GST</p>
          <h1
            id="hero-title"
            className="animate-fade-up mt-6 font-display text-5xl leading-[1.02] font-medium text-ivory sm:text-6xl lg:text-[4.25rem]"
            style={{ animationDelay: '120ms' }}
          >
            Financial Clarity for <em className="font-normal text-champagne-300">Every Stage</em> of Your Journey.
          </h1>
          <p
            className="animate-fade-up mt-7 max-w-xl text-lg leading-relaxed text-ivory/80"
            style={{ animationDelay: '240ms' }}
          >
            From tax compliance to business advisory, we help individuals, entrepreneurs, and growing businesses
            navigate their financial responsibilities with clarity and confidence.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '360ms' }}
          >
            <Link to="/services" className="btn-gold">
              Explore Our Services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <WhatsAppCta message={buildGeneralMessage()} variant="light">
              Connect on WhatsApp
            </WhatsAppCta>
          </div>

          <ul
            className="animate-fade-up mt-14 grid gap-3 border-t border-ivory/10 pt-6 text-sm text-ivory/70 sm:grid-cols-3"
            style={{ animationDelay: '480ms' }}
          >
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-champagne-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}

import { Calculator, FileCheck2, Landmark, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BUSINESS } from '../../config/business';
import { whatsappMessages } from '../../lib/whatsapp';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { buttonClass, containerClass } from '../ui/styles';

const TRUST_ITEMS = [
  { label: 'Taxation Support', icon: Landmark },
  { label: 'GST & Compliance', icon: FileCheck2 },
  { label: 'Accounting Services', icon: Calculator },
  { label: 'Individual & Business Assistance', icon: Users },
];

// Abstract composition: a ledger panel, a rising trend and a completed checklist. Decorative, so it is hidden from assistive tech.
function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 440" className="h-auto w-full" aria-hidden="true" focusable="false">
      <rect x="40" y="36" width="440" height="368" rx="14" fill="#10233f" />
      <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1">
        {[112, 162, 212, 262, 312, 362].map((y) => (
          <line key={y} x1="80" x2="440" y1={y} y2={y} />
        ))}
      </g>
      <g fill="#ffffff" fillOpacity="0.16">
        <rect x="92" y="250" width="26" height="110" rx="3" />
        <rect x="136" y="218" width="26" height="142" rx="3" />
        <rect x="180" y="236" width="26" height="124" rx="3" />
        <rect x="224" y="186" width="26" height="174" rx="3" />
      </g>
      <rect x="268" y="162" width="26" height="198" rx="3" fill="#b89a62" fillOpacity="0.9" />
      <polyline
        points="105,300 149,258 193,272 237,212 281,226 325,176 369,148 405,118"
        fill="none"
        stroke="#b89a62"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="405" cy="118" r="6" fill="#faf8f3" stroke="#b89a62" strokeWidth="3" />
      <rect x="290" y="252" width="176" height="128" rx="10" fill="#faf8f3" />
      <rect x="312" y="274" width="112" height="8" rx="4" fill="#10233f" fillOpacity="0.85" />
      <rect x="312" y="294" width="140" height="6" rx="3" fill="#10233f" fillOpacity="0.15" />
      <rect x="312" y="310" width="120" height="6" rx="3" fill="#10233f" fillOpacity="0.15" />
      <circle cx="320" cy="346" r="11" fill="none" stroke="#b89a62" strokeWidth="2" />
      <path d="M315 346l3.5 3.5 7-7" fill="none" stroke="#b89a62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="342" y="342" width="100" height="6" rx="3" fill="#10233f" fillOpacity="0.15" />
    </svg>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-ivory">
      <div className={`${containerClass} grid items-center gap-12 pb-12 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-16`}>
        <div className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">{BUSINESS.tagline}</p>
          <h1 id="hero-heading" className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
            {BUSINESS.heroHeadline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate sm:text-lg">{BUSINESS.heroSupport}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/services" className={buttonClass('primary')}>
              Explore Our Services
            </Link>
            <WhatsAppLink
              context="hero"
              message={whatsappMessages.general()}
              label="Talk to Us on WhatsApp"
              variant="whatsapp"
            />
          </div>
        </div>
        <div className="lg:col-span-6">
          <HeroIllustration />
        </div>
      </div>

      <div className={containerClass}>
        <ul className="grid grid-cols-1 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {TRUST_ITEMS.map(({ label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-navy">
              <Icon aria-hidden className="size-5 shrink-0 text-gold-700" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

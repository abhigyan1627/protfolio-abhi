import { Check } from 'lucide-react'
import { Link } from 'react-router'
import { siteConfig } from '../config/siteConfig'
import { aboutContent, teamProfile } from '../data/content'
import { buildGeneralMessage } from '../utils/whatsapp'
import ContactList from './ContactList'
import { Monogram } from './Logo'
import SectionHeading from './SectionHeading'
import WhatsAppCta from './WhatsAppCta'

function Specialisations() {
  return (
    <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
      {aboutContent.specialisations.map((item) => (
        <li key={item} className="flex gap-3 border-b border-navy-900/10 pb-5">
          <Check className="mt-1 size-4 shrink-0 text-champagne-700" aria-hidden="true" />
          <span className="font-semibold text-navy-900">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function PartnerProfile() {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:items-center">
      <div className="md:col-span-4">
        {/* Placeholder only. Replace with a supplied portrait once the partner has provided one. */}
        <div className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-sm bg-navy-900 p-8 text-ivory">
          <Monogram letter={siteConfig.logo.monogram.slice(0, 1)} className="absolute top-8 left-8 size-16" />
          <p className="font-display text-2xl text-champagne-300">Portrait to be added</p>
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">A professional portrait will be published once supplied.</p>
        </div>
      </div>

      <div className="md:col-span-7 md:col-start-6">
        <p className="eyebrow">Partner profile</p>
        <h3 className="mt-3 text-4xl">{teamProfile.name}</h3>
        <p className="mt-2 text-sm font-semibold tracking-wide text-champagne-700 uppercase">{teamProfile.role}</p>
        <p className="mt-6 text-lg leading-relaxed text-charcoal-700">{teamProfile.bio}</p>

        {teamProfile.verified ? (
          <div className="mt-8 space-y-4">
            {teamProfile.qualifications.length > 0 && (
              <ul className="space-y-2 text-charcoal-700">
                {teamProfile.qualifications.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-champagne-700" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {teamProfile.membership && <p className="text-sm text-charcoal-700">{teamProfile.membership}</p>}
          </div>
        ) : (
          <p className="mt-8 rounded-sm border border-champagne-500/40 bg-champagne-200/40 p-4 text-sm leading-relaxed text-navy-900">
            Qualifications, membership and experience will be published once they have been verified.
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * About the firm. `variant="teaser"` is the short introduction used on the home page; `variant="full"` is
 * the About Us page with the partner profile, specialisations, approach and office details.
 */
export default function About({ variant = 'full' }) {
  if (variant === 'teaser') {
    return (
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow="About the firm" title="A practice built around clear, organised work" id="about-heading">
            <p>{aboutContent.intro[0]}</p>
          </SectionHeading>
          <Link to="/about" className="link-arrow mt-10">
            Read more about the firm
          </Link>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow mb-6">Areas of specialisation</p>
          <Specialisations />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow="Who we are" title="Chartered accountancy, explained plainly" id="about-intro-heading" />
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-charcoal-700 lg:col-span-5 lg:col-start-8">
          {aboutContent.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <PartnerProfile />

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Specialisations</p>
          <h3 className="mt-3 text-4xl">Where we focus</h3>
        </div>
        <div className="lg:col-span-7">
          <Specialisations />
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="border-t-2 border-champagne-500 pt-8">
          <h3 className="text-3xl">Our approach</h3>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-700">{aboutContent.approach}</p>
        </div>
        <div className="border-t-2 border-navy-900 pt-8">
          <h3 className="text-3xl">Client service philosophy</h3>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-700">{aboutContent.philosophy}</p>
        </div>
      </div>

      <div className="on-dark grid gap-12 rounded-sm bg-navy-900 p-8 text-ivory sm:p-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="eyebrow text-champagne-300">Office and contact</p>
          <h3 className="mt-3 text-4xl text-ivory">Visit the office or reach us directly</h3>
          <div className="mt-8">
            <ContactList tone="dark" />
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <WhatsAppCta message={buildGeneralMessage()} variant="gold" className="w-full">
            Discuss Your Requirements
          </WhatsAppCta>
        </div>
      </div>
    </div>
  )
}

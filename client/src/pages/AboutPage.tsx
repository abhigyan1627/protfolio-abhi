import { Link } from 'react-router-dom';
import { BUSINESS } from '../config/business';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { buttonClass, cardClass } from '../components/ui/styles';
import { useSiteSettings } from '../hooks/SiteSettingsProvider';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ABOUT_CONTENT } from '../data/siteContent';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/format';
import { whatsappMessages } from '../lib/whatsapp';
import { WhatsAppLink } from '../components/whatsapp/WhatsAppLink';

export function AboutPage() {
  const { settings } = useSiteSettings();
  useDocumentMeta({
    title: 'About | CA Mohit Agrawal, Chartered Accountant in Gopalganj',
    description: 'About CA Mohit Agrawal, a Chartered Accountant practice in Gopalganj, Bihar, and how we work with individuals, businesses and startups.',
    path: '/about',
  });

  return (
    <>
      <PageHero
        eyebrow="About"
        title={`${settings.businessName}, ${settings.profession} in ${BUSINESS.city}`}
        description={ABOUT_CONTENT.intro}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      <Section title="Our professional philosophy" tone="ivory">
        <div className="grid gap-12 lg:grid-cols-12">
          <p className="text-lg leading-relaxed text-ink lg:col-span-7">{ABOUT_CONTENT.philosophy}</p>
          <ul className="space-y-5 lg:col-span-5">
            {ABOUT_CONTENT.approach.map((item) => (
              <li key={item} className="border-l-2 border-gold pl-5 text-[15px] leading-relaxed text-slate">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Service categories" tone="white" description="We focus on the areas where clear, documented support makes the biggest difference.">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_ORDER.map((category) => (
            <li key={category}>
              <Link to={`/services?category=${category}`} className={`${cardClass} block h-full p-5 font-display text-base font-bold text-navy hover:border-navy`}>
                {CATEGORY_LABELS[category]}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Office and contact" tone="ivory">
        <div className="grid gap-8 md:grid-cols-2">
          <div className={cardClass}>
            <h3 className="font-display text-lg font-bold text-navy">Office address</h3>
            <address className="mt-3 not-italic leading-relaxed text-ink">
              {settings.businessName}
              <br />
              {settings.address}
              {settings.plusCode && (
                <>
                  <br />
                  Plus Code: {settings.plusCode}
                </>
              )}
            </address>
            <p className="mt-4 text-sm text-slate">
              Phone:{' '}
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-medium text-navy underline-offset-4 hover:underline">
                {settings.phone}
              </a>
            </p>
          </div>
          <div className={`${cardClass} border-dashed`}>
            <h3 className="font-display text-lg font-bold text-navy">Details to be confirmed</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              The following are placeholders until the CA confirms them. Nothing is claimed here until it has been verified.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink">
              {ABOUT_CONTENT.toConfirm.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-gold-700">[ ]</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink context="about" message={whatsappMessages.general()} label="Talk to Us on WhatsApp" variant="whatsapp" />
          <Link to="/contact" className={buttonClass('secondary')}>
            Go to contact page
          </Link>
        </div>
      </Section>
    </>
  );
}

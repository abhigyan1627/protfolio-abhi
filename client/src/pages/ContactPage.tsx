import { Mail, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import { EnquiryForm } from '../components/contact/EnquiryForm';
import { FaqSection } from '../components/faq/FaqSection';
import { LocalBusinessJsonLd } from '../components/seo/LocalBusinessJsonLd';
import { PageHero } from '../components/ui/PageHero';
import { cardClass, containerClass, focusRing } from '../components/ui/styles';
import { WhatsAppLink } from '../components/whatsapp/WhatsAppLink';
import { useSiteSettings } from '../hooks/SiteSettingsProvider';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { whatsappMessages } from '../lib/whatsapp';

export function ContactPage() {
  useDocumentMeta({
    title: 'Contact | CA Mohit Agrawal, Gopalganj',
    description: 'Contact CA Mohit Agrawal in Gopalganj, Bihar by WhatsApp, phone or enquiry form for tax, GST and business compliance support.',
    path: '/contact',
  });
  const { settings } = useSiteSettings();
  const phoneHref = `tel:${settings.phone.replace(/\s/g, '')}`;
  const showRating = settings.googleRating !== null && settings.googleReviewCount !== null;

  return (
    <>
      <LocalBusinessJsonLd />
      <PageHero
        eyebrow="Contact"
        title="Talk to CA Mohit Agrawal"
        description="Message us on WhatsApp for the quickest reply, call during working hours, or send the enquiry form. Tell us which reply method suits you."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className={`${containerClass} grid gap-10 py-14 lg:grid-cols-12 lg:py-20`} aria-label="Contact details and enquiry form">
        <div className="space-y-6 lg:col-span-5">
          <div className={`${cardClass} space-y-6`}>
            <div className="flex gap-4">
              <MessageCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-whatsapp" />
              <div>
                <p className="font-semibold text-navy">WhatsApp</p>
                <p className="text-sm text-slate">Fastest way to start a conversation.</p>
                <div className="mt-3">
                  <WhatsAppLink context="contact-page" message={whatsappMessages.general()} label="Message on WhatsApp" size="sm" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-navy" />
              <div>
                <p className="font-semibold text-navy">Phone</p>
                <a href={phoneHref} className={`text-ink underline-offset-4 hover:underline ${focusRing} rounded-sm`}>
                  {settings.phone}
                </a>
              </div>
            </div>

            {settings.email && (
              <div className="flex gap-4">
                <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-navy" />
                <div>
                  <p className="font-semibold text-navy">Email</p>
                  <a href={`mailto:${settings.email}`} className={`break-all text-ink underline-offset-4 hover:underline ${focusRing} rounded-sm`}>
                    {settings.email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-navy" />
              <address className="not-italic">
                <p className="font-semibold text-navy">Office</p>
                <p className="text-ink">{settings.address}</p>
                {settings.plusCode && <p className="text-sm text-slate">Plus Code: {settings.plusCode}</p>}
                {settings.googleMapsUrl && (
                  <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-block text-sm font-semibold text-navy underline-offset-4 hover:underline ${focusRing} rounded-sm`}>
                    Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </address>
            </div>

            <div>
              <p className="font-semibold text-navy">Office hours</p>
              <p className="text-sm text-slate">
                {settings.businessHours ?? 'To be confirmed. Please reach us on WhatsApp or by phone and we will confirm availability.'}
              </p>
            </div>
          </div>

          {showRating && (
            <div className={`${cardClass} space-y-3`}>
              <p className="flex items-center gap-2 font-display text-lg font-bold text-navy">
                <Star aria-hidden className="size-5 fill-gold text-gold" />
                {settings.googleRating} out of 5 on Google
              </p>
              <p className="text-sm text-slate">From {settings.googleReviewCount} reviews.</p>
              {settings.googleRatingNote && <p className="text-xs text-slate">{settings.googleRatingNote}</p>}
              {settings.googleBusinessUrl && (
                <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className={`inline-block text-sm font-semibold text-navy underline-offset-4 hover:underline ${focusRing} rounded-sm`}>
                  Read our Google reviews<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          )}

          {settings.mapEmbedUrl && (
            <div className="overflow-hidden rounded-lg border border-line bg-white">
              <iframe
                title={`Map showing the office of ${settings.businessName}`}
                src={settings.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <h2 className="mb-6 font-display text-2xl font-bold text-navy">Send an enquiry</h2>
          <EnquiryForm />
        </div>
      </section>

      <FaqSection scope="GENERAL" id="contact-faq" title="Before you get in touch" tone="white" />
    </>
  );
}

import { Link } from 'react-router'
import { siteConfig } from '../config/siteConfig'
import { buildGeneralMessage } from '../utils/whatsapp'
import ContactList from './ContactList'
import EnquiryForm from './EnquiryForm'
import SectionHeading from './SectionHeading'
import WhatsAppCta from './WhatsAppCta'

function OfficeMap() {
  if (!siteConfig.mapEmbedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-sm border border-dashed border-navy-900/25 bg-ivory-100 p-6 text-center text-sm leading-relaxed text-charcoal-700">
        Directions to the office are available on request. Message the firm on WhatsApp and we will share them.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-sm border border-navy-900/10 bg-white">
      <iframe
        title={`Map showing the office of ${siteConfig.firmName}`}
        src={siteConfig.mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="aspect-video w-full border-0"
      />
      {siteConfig.mapLink && (
        <div className="p-4">
          <a
            href={siteConfig.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow"
          >
            Open in Google Maps
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      )}
    </div>
  )
}

/**
 * Contact content. `variant="compact"` is the short band on the home page; `variant="full"` is the contact
 * page with the WhatsApp card, office details, map and the enquiry form.
 */
export default function Contact({ variant = 'full' }) {
  if (variant === 'compact') {
    return (
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow="Contact" title="Let’s talk about your requirements" id="contact-heading" tone="dark">
            Start on WhatsApp, or send a short enquiry through the contact page.
          </SectionHeading>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta message={buildGeneralMessage()} variant="gold">
              Connect on WhatsApp
            </WhatsAppCta>
            <Link to="/contact" className="btn-outline-light">
              Send an enquiry
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <ContactList tone="dark" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-16 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-5">
        <SectionHeading eyebrow="Get in touch" title="Start a conversation" id="contact-heading">
          <p>
            Message the firm on WhatsApp, call, or send a short enquiry. Nothing is sent from this page until you choose
            to send it.
          </p>
        </SectionHeading>

        <div className="on-dark rounded-sm bg-navy-900 p-8 text-ivory">
          <p className="font-display text-2xl text-ivory">Start on WhatsApp</p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/75">
            Your enquiry opens as a pre-written message. You review it and send it yourself.
          </p>
          <div className="mt-6">
            <WhatsAppCta message={buildGeneralMessage()} variant="gold" className="w-full sm:w-auto">
              Connect on WhatsApp
            </WhatsAppCta>
          </div>
        </div>

        <ContactList />
        <OfficeMap />
      </div>

      <div id="enquiry" className="scroll-mt-28 lg:col-span-6 lg:col-start-7">
        <div className="rounded-sm border border-navy-900/10 bg-white p-6 sm:p-10">
          <h3 className="text-3xl">Send a basic enquiry</h3>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-700">
            Share your name, the service you are interested in and how you would like to be contacted.
          </p>
          <div className="mt-8">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </div>
  )
}

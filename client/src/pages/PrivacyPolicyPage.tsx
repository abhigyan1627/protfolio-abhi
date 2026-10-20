import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { useSiteSettings } from '../hooks/SiteSettingsProvider';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function PrivacyPolicyPage() {
  useDocumentMeta({
    title: 'Privacy Policy | CA Mohit Agrawal',
    description: 'How CA Mohit Agrawal collects, uses and protects the personal information you share through this website.',
    path: '/privacy-policy',
  });
  const { settings } = useSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy notice"
        description="This notice explains what we collect when you contact us through this website, why we collect it, and your choices."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Privacy policy' }]}
      />
      <Section title="Our privacy commitments" tone="ivory">
        <div className="max-w-3xl space-y-8 text-[16px] leading-relaxed text-ink">
          <div className="rounded-lg border border-gold/40 bg-white p-5 text-sm text-slate">
            Draft for owner review. This notice must be reviewed and approved by the CA before the website goes live.
          </div>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">What we collect</h3>
            <p>When you use the enquiry form or contact us on WhatsApp, we may receive your name, phone number or email address, the service or plan you are interested in, any message you choose to write, and the time you accepted this notice.</p>
            <p>We ask you not to send sensitive identity or financial information through this website, such as PAN or Aadhaar numbers, one-time passwords, or bank login details.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">Why we use it</h3>
            <p>We use this information only to respond to your enquiry, explain our services and prepare a quotation. We do not sell your information or use it for unrelated marketing.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">How long we keep it</h3>
            <p>Enquiry records are kept only as long as needed to respond to you and, where you engage us, for the period required for the professional work and our records. The retention period is to be confirmed by the CA before launch.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">Who can access it</h3>
            <p>Access is limited to the practice team and to the technology providers that host this website and its database. Enquiry records are stored in a secured database and are never shown on the public website.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">WhatsApp and other channels</h3>
            <p>If you contact us on WhatsApp, the messages are also handled under WhatsApp&rsquo;s own privacy policy. Please avoid sharing sensitive documents in a chat.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">Your choices</h3>
            <p>You can ask us to see, correct or delete the information we hold about you by contacting us at {settings.phone} or through the contact page. You can withdraw consent for future contact at any time.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">Cookies and analytics</h3>
            <p>This website does not set advertising cookies. Any analytics added later will be described here before it is enabled.</p>
          </section>

          <p className="text-sm text-slate">Last updated: to be confirmed on approval.</p>
        </div>
      </Section>
    </>
  );
}

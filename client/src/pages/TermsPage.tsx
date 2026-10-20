import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { useSiteSettings } from '../hooks/SiteSettingsProvider';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function TermsPage() {
  useDocumentMeta({
    title: 'Terms of Use and Disclaimer | CA Mohit Agrawal',
    description: 'Terms of use for this website, and the disclaimer that applies to the information published on it.',
    path: '/terms',
  });
  const { settings } = useSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        description="Please read these terms before using this website. They explain what the information here is, and what it is not."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Terms' }]}
      />
      <Section title="Using this website" tone="ivory">
        <div className="max-w-3xl space-y-8 text-[16px] leading-relaxed text-ink">
          <div className="rounded-lg border border-gold/40 bg-white p-5 text-sm text-slate">
            Draft for owner review. These terms must be reviewed by the CA, and any jurisdiction clause confirmed, before the website goes live.
          </div>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">1. About these terms</h3>
            <p>By using {settings.businessName}&rsquo;s website, you agree to these terms. If you do not agree, please do not use the website.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">2. No professional relationship</h3>
            <p>Using this website, reading its content or sending an enquiry does not create a professional-client relationship. A relationship begins only when the scope, documents and fees are confirmed in writing.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">3. Quotations and fees</h3>
            <p>Plans with a listed price are indicative until confirmed in a quotation. Where a price is not listed, the fee is quoted separately. Government fees, statutory charges and third-party costs are not included unless stated.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">4. Accuracy of information</h3>
            <p>We aim to keep the information accurate and up to date, but tax law, forms, limits and deadlines change. We do not guarantee that any information is complete or current on the day you read it.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">5. Acceptable use</h3>
            <p>Do not use this website to send unlawful, misleading or harmful content, to attempt unauthorised access, or to submit automated or repeated enquiries.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">6. Links to other websites</h3>
            <p>This website may link to government portals, Google listings and other third-party sites. We do not control those sites and are not responsible for their content.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">7. Limitation of responsibility</h3>
            <p>To the extent permitted by law, we are not liable for any loss arising from reliance on general information on this website. Advice given in a formal engagement is governed by that engagement.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-xl font-bold text-navy">8. Governing law</h3>
            <p>These terms are governed by the laws of India. Jurisdiction: to be confirmed by the CA before launch.</p>
          </section>

          <section id="disclaimer" className="space-y-3 scroll-mt-24 rounded-lg border border-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-navy">Disclaimer</h3>
            <p>The content on this website, including guides, plan descriptions and FAQs, is general information only. It is not personal tax, legal or financial advice and should not be relied on without professional review of your specific facts. Results, refunds, approvals and savings are not guaranteed.</p>
          </section>
        </div>
      </Section>
    </>
  );
}

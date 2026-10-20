import { absoluteUrl, BUSINESS, SITE_URL } from '../../config/business';
import { useSiteSettings } from '../../hooks/SiteSettingsProvider';

// Local business markup uses verified details only. No ratings or reviews are included.
export function LocalBusinessJsonLd() {
  const { settings } = useSiteSettings();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${SITE_URL || absoluteUrl('/')}#business`,
    name: settings.businessName,
    description: `${settings.profession} in ${BUSINESS.city}, ${BUSINESS.state}, offering taxation, GST, accounting and business compliance services.`,
    url: SITE_URL || undefined,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Muskan, Kedia Lane, Town Thana',
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.state,
      postalCode: BUSINESS.postcode,
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'City', name: BUSINESS.city },
      { '@type': 'State', name: BUSINESS.state },
    ],
  };

  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

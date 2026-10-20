import { LocalBusinessJsonLd } from '../components/seo/LocalBusinessJsonLd';
import { FaqSection } from '../components/faq/FaqSection';
import { FeaturedPlans } from '../components/home/FeaturedPlans';
import { FeaturedServices } from '../components/home/FeaturedServices';
import { Hero } from '../components/home/Hero';
import { ContactCta, HowItWorks, WhoWeHelp, WhyChoose } from '../components/home/HomeSections';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function HomePage() {
  useDocumentMeta({
    title: 'CA Mohit Agrawal | Tax, GST & Business Compliance in Gopalganj',
    description:
      'Chartered Accountant in Gopalganj, Bihar. Income tax (ITR) filing, GST registration and returns, accounting and business compliance for individuals, businesses and startups.',
    path: '/',
  });

  return (
    <>
      <LocalBusinessJsonLd />
      <Hero />
      <FeaturedServices />
      <WhoWeHelp />
      <WhyChoose />
      <HowItWorks />
      <FeaturedPlans />
      <FaqSection scope="HOME" id="home-faq" title="Questions clients ask us first" />
      <ContactCta />
    </>
  );
}

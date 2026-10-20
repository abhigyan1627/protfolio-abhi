import { Link } from 'react-router'
import About from '../components/About'
import CategoryStrip from '../components/CategoryStrip'
import Contact from '../components/Contact'
import FAQ from '../components/FAQ'
import Hero from '../components/Hero'
import Pricing from '../components/Pricing'
import Process from '../components/Process'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import ServiceFinder from '../components/ServiceFinder'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import { pageById } from '../data/pages'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = pageById.home

export default function HomePage() {
  useDocumentMeta({ title: page.title, description: page.description, path: page.path })

  return (
    <>
      <Hero />
      <CategoryStrip />

      <Section id="services" labelledBy="services-overview-heading">
        <SectionHeading
          eyebrow="Services"
          title="Income tax, GST, compliance and startup support"
          id="services-overview-heading"
        >
          Choose the area that matches your situation. Each service states who it suits, what is included and which
          charges may apply in addition.
        </SectionHeading>
        <div className="mt-14">
          <Services variant="preview" />
        </div>
      </Section>

      <Section id="finder" tone="light" labelledBy="finder-heading">
        <SectionHeading eyebrow="Service finder" title="Find the right starting point" id="finder-heading">
          Answer four short questions. The finder suggests services and plans, then opens a WhatsApp message you can
          review and send. It is not a tax calculator or an eligibility check.
        </SectionHeading>
        <div className="mt-14">
          <ServiceFinder />
        </div>
      </Section>

      <Section id="pricing" labelledBy="pricing-overview-heading">
        <SectionHeading
          eyebrow="Plans & pricing"
          title="Plans for individuals, businesses and startups"
          id="pricing-overview-heading"
        >
          Every plan lists its inclusions, exclusions and additional charges before you enquire.
        </SectionHeading>
        <div className="mt-14">
          <Pricing variant="overview" />
        </div>
        <div className="mt-10">
          <Link to="/pricing" className="btn-outline">
            Compare all plans
          </Link>
        </div>
      </Section>

      <Section tone="light" labelledBy="process-heading">
        <Process />
      </Section>

      <Section labelledBy="principles-heading">
        <WhyChooseUs />
      </Section>

      <Section tone="light" labelledBy="about-heading">
        <About variant="teaser" />
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHeading eyebrow="Questions" title="Common questions" id="faq-heading" />
        <div className="mt-12">
          <FAQ limit={5} />
        </div>
        <div className="mt-10">
          <Link to="/resources#faq" className="link-arrow">
            See all questions
          </Link>
        </div>
      </Section>

      <Section tone="navy" labelledBy="contact-heading">
        <Contact variant="compact" />
      </Section>
    </>
  )
}

import { Link } from 'react-router'
import { siteConfig } from '../config/siteConfig'
import { navItems, sitePages } from '../data/pages'
import { services } from '../data/services'
import { audiences } from '../data/audiences'
import { buildGeneralMessage } from '../utils/whatsapp'
import ContactList from './ContactList'
import Logo from './Logo'
import WhatsAppCta from './WhatsAppCta'

const legalPages = sitePages.filter((page) => ['privacy', 'terms', 'disclaimer'].includes(page.id))
const footerServices = audiences.flatMap((audience) =>
  services.filter((service) => service.audience === audience.id).slice(0, 2),
)
const socialLinks = Object.entries(siteConfig.social).filter(([, url]) => url)

export default function Footer() {
  return (
    <footer className="on-dark bg-navy-950 text-ivory/75">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 font-display text-2xl italic text-champagne-300">{siteConfig.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{siteConfig.description}</p>
          {socialLinks.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4 text-sm">
              {socialLinks.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-champagne-300 hover:underline">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Services" className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold tracking-[0.22em] text-champagne-300 uppercase">Services</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {footerServices.map((service) => (
              <li key={service.id}>
                <Link to={`/services/${service.id}`} className="hover:text-champagne-300 hover:underline">
                  {service.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="font-semibold text-ivory hover:text-champagne-300">
                All services
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Quick links" className="lg:col-span-2">
          <h2 className="font-sans text-xs font-semibold tracking-[0.22em] text-champagne-300 uppercase">Quick links</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-champagne-300 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-xs font-semibold tracking-[0.22em] text-champagne-300 uppercase">Contact</h2>
          <div className="mt-5 space-y-6 text-sm">
            <ContactList tone="dark" />
            <WhatsAppCta message={buildGeneralMessage()} variant="gold" className="min-h-11 px-5 text-xs">
              Discuss on WhatsApp
            </WhatsAppCta>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.copyright.year} {siteConfig.copyright.holder}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {legalPages.map((page) => (
              <Link key={page.id} to={page.path} className="hover:text-champagne-300 hover:underline">
                {page.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

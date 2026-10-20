import { Link } from 'react-router-dom';
import { BUSINESS } from '../../config/business';
import { LEGAL_NAV, PRIMARY_NAV } from '../../config/navigation';
import { useSiteSettings } from '../../hooks/SiteSettingsProvider';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../../lib/format';
import { focusRing } from '../ui/styles';

export function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();
  const linkClass = `text-white/80 transition-colors hover:text-white ${focusRing}`;

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">{settings.businessName}</p>
          {settings.hindiName && <p className="mt-1 font-deva text-base text-white/85">{settings.hindiName}</p>}
          <p className="mt-3 text-sm text-white/75">{BUSINESS.tagline}</p>
        </div>

        <div className="text-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Contact</h2>
          <address className="space-y-2 not-italic text-white/80">
            <p>{settings.address}</p>
            {settings.plusCode && <p>Plus Code: {settings.plusCode}</p>}
            <p>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className={linkClass}>
                {settings.phone}
              </a>
            </p>
            {settings.email && (
              <p>
                <a href={`mailto:${settings.email}`} className={linkClass}>
                  {settings.email}
                </a>
              </p>
            )}
          </address>
        </div>

        <nav aria-label="Services footer" className="text-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Services</h2>
          <ul className="space-y-2">
            {CATEGORY_ORDER.map((category) => (
              <li key={category}>
                <Link to={`/services?category=${category}`} className={linkClass}>
                  {CATEGORY_LABELS[category]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer" className="text-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Explore</h2>
          <ul className="space-y-2">
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            {LEGAL_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {settings.businessName}. All rights reserved.
          </p>
          <p>General information only. Not a substitute for advice on your specific facts.</p>
        </div>
      </div>
    </footer>
  );
}

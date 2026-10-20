import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BUSINESS } from '../../config/business';
import { PRIMARY_NAV } from '../../config/navigation';
import { useSiteSettings } from '../../hooks/SiteSettingsProvider';
import { whatsappMessages } from '../../lib/whatsapp';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { focusRing } from '../ui/styles';

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  // Close the mobile menu whenever the visitor navigates.
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${focusRing} ${
      isActive ? 'text-navy' : 'text-slate hover:text-navy'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className={`group flex min-w-0 flex-col rounded-sm ${focusRing}`} aria-label={`${BUSINESS.name} home`}>
          <span className="font-display text-[17px] font-bold leading-tight text-navy sm:text-lg">{settings.businessName}</span>
          <span className="hidden text-xs text-slate sm:block">
            {settings.profession} · {BUSINESS.city}, {BUSINESS.state}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink
            context="header"
            message={whatsappMessages.general()}
            label="WhatsApp"
            size="sm"
            className="hidden md:inline-flex"
          />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`inline-flex size-11 items-center justify-center rounded-md border border-line bg-white text-navy lg:hidden ${focusRing}`}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <div id="mobile-navigation" hidden={!open} className="border-t border-line bg-ivory px-5 pb-6 pt-3 lg:hidden">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {PRIMARY_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between border-b border-line py-3.5 text-base font-medium ${focusRing} ${
                        isActive ? 'text-navy' : 'text-ink'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <WhatsAppLink
            context="mobile-menu"
            message={whatsappMessages.general()}
            label="Talk to Us on WhatsApp"
            className="mt-5 w-full"
          />
          <p className="mt-4 text-center text-sm text-slate">
            Call{' '}
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-medium text-navy underline-offset-4 hover:underline">
              {settings.phone}
            </a>
          </p>
      </div>
    </header>
  );
}

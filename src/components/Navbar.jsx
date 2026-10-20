import { useCallback, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'
import { navItems } from '../data/pages'
import { useScrolled } from '../hooks/useScrolled'
import { buildGeneralMessage } from '../utils/whatsapp'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import WhatsAppCta from './WhatsAppCta'

export default function Navbar() {
  const { pathname } = useLocation()
  const scrolled = useScrolled(16)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const toggleRef = useRef(null)

  // The header is transparent only over the home-page hero. It turns solid once the page scrolls.
  const overHero = pathname === '/' && !scrolled

  // Close the mobile menu whenever the route changes, including via the browser's back button.
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }, [])

  const closeMenuOnNavigate = useCallback(() => setMenuOpen(false), [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300 ease-out ${
        overHero
          ? 'on-dark text-ivory'
          : 'bg-ivory/95 text-navy-900 shadow-[0_1px_0_0_rgba(11,31,58,0.08)] backdrop-blur-md'
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Link to="/" aria-label={`${siteConfig.firmName}, go to home page`} className="rounded-sm">
          <Logo tone={overHero ? 'light' : 'dark'} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative py-2 text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? overHero
                      ? 'text-champagne-300'
                      : 'font-semibold text-navy-900'
                    : overHero
                      ? 'text-ivory/80 hover:text-ivory'
                      : 'text-navy-800 hover:text-navy-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-300 ${
                      overHero ? 'bg-champagne-400' : 'bg-champagne-600'
                    } ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden xl:block">
            <WhatsAppCta message={buildGeneralMessage()} variant={overHero ? 'gold' : 'navy'} className="min-h-11 px-5 text-xs">
              Discuss Your Requirements
            </WhatsAppCta>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex size-11 items-center justify-center rounded-sm transition-colors hover:bg-navy-900/5 xl:hidden"
          >
            {menuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <MobileMenu id="mobile-menu" open={menuOpen} onClose={closeMenu} onNavigate={closeMenuOnNavigate} />
    </header>
  )
}

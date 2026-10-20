import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { navItems } from '../data/pages'
import { buildGeneralMessage } from '../utils/whatsapp'
import WhatsAppCta from './WhatsAppCta'

const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * Full-screen navigation for screens below the xl breakpoint. Opens and closes with a fade and staggered
 * link reveal, locks page scroll while open, closes on Escape, and keeps keyboard focus inside the panel.
 */
export default function MobileMenu({ id, open, onClose, onNavigate }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    panelRef.current?.querySelector('a[href]')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <div
      id={id}
      ref={panelRef}
      inert={!open}
      className={`fixed inset-x-0 top-18 bottom-0 overflow-y-auto bg-navy-900 text-ivory transition-[opacity,visibility] duration-300 ease-out xl:hidden ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className="container-page flex min-h-full flex-col py-8">
        <nav aria-label="Mobile primary">
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li
                key={item.to}
                className={`transition-[opacity,transform] duration-500 ease-out ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
                style={{ transitionDelay: open ? `${100 + index * 60}ms` : '0ms' }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-b border-ivory/10 py-4 font-display text-3xl transition-colors ${
                      isActive ? 'text-champagne-300' : 'text-ivory hover:text-champagne-300'
                    }`
                  }
                >
                  {item.label}
                  <span className="text-sm font-sans text-champagne-400/70" aria-hidden="true">
                    0{index + 1}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-10">
          <WhatsAppCta message={buildGeneralMessage()} variant="gold" className="w-full">
            Discuss Your Requirements
          </WhatsAppCta>
          <p className="mt-4 text-sm leading-relaxed text-ivory/60">
            Your message opens in WhatsApp, already written. You review it and send it yourself.
          </p>
        </div>
      </div>
    </div>
  )
}

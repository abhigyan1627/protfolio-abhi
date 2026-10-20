import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import DevConfigBanner from './DevConfigBanner'
import Footer from './Footer'
import Navbar from './Navbar'
import WhatsAppButton from './WhatsAppButton'

/** Scrolls to the top on navigation, or to the target section when the URL has a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      target.scrollIntoView({ block: 'start' })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.getElementById('main')?.focus({ preventScroll: true })
    }
  }, [pathname, hash])

  return null
}

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-sm focus:bg-champagne-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy-950"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <DevConfigBanner />
    </div>
  )
}

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { focusRing } from '../components/ui/styles';

export function PublicLayout() {
  const location = useLocation();

  // Start each page at the top, unless the URL targets an in-page anchor.
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-dvh flex-col bg-ivory text-ink">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white ${focusRing}`}
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

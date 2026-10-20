import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { FALLBACK_SETTINGS } from '../config/business';
import { publicApi } from '../lib/publicApi';
import type { PublicSettings } from '../types/api';

interface SiteSettingsState {
  settings: PublicSettings;
  // "fallback" means the API has not answered, so the built-in contact details are in use.
  source: 'loading' | 'api' | 'fallback';
}

const SiteSettingsContext = createContext<SiteSettingsState>({ settings: FALLBACK_SETTINGS, source: 'loading' });

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteSettingsState>({ settings: FALLBACK_SETTINGS, source: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    publicApi
      .settings(controller.signal)
      .then((settings) => setState({ settings, source: 'api' }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ settings: FALLBACK_SETTINGS, source: 'fallback' });
      });
    return () => controller.abort();
  }, []);

  return <SiteSettingsContext.Provider value={state}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettingsState {
  return useContext(SiteSettingsContext);
}

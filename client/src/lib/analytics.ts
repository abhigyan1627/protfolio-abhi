type EventParams = Record<string, string | number | boolean>;

interface AnalyticsWindow extends Window {
  gtag?: (command: 'event', name: string, params: EventParams) => void;
  plausible?: (name: string, options: { props: EventParams }) => void;
}

// Privacy-conscious hook: sends only event names and non-personal context (for example a service slug).
// Never pass message text, names, phone numbers or emails here. Does nothing unless an analytics script is loaded.
export function trackEvent(name: string, params: EventParams = {}): void {
  try {
    if (typeof window === 'undefined') return;
    const analytics = window as AnalyticsWindow;
    analytics.gtag?.('event', name, params);
    analytics.plausible?.(name, { props: params });
  } catch {
    // Analytics must never interrupt the visitor.
  }
}

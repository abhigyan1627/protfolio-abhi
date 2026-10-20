import { MessageCircle } from 'lucide-react';
import { BUSINESS } from '../../config/business';
import { useSiteSettings } from '../../hooks/SiteSettingsProvider';
import { trackEvent } from '../../lib/analytics';
import { buildWhatsAppUrl, whatsappMessages } from '../../lib/whatsapp';
import { focusRing } from '../ui/styles';

export function FloatingWhatsApp() {
  const { settings } = useSiteSettings();
  const href = buildWhatsAppUrl(settings.whatsappNumber, whatsappMessages.general()) ??
    buildWhatsAppUrl(BUSINESS.whatsappNumber, whatsappMessages.general());

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with CA Mohit Agrawal on WhatsApp (opens in a new tab)"
      onClick={() => trackEvent('whatsapp_click', { context: 'floating' })}
      className={`fixed bottom-5 right-5 z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-whatsapp-dark motion-reduce:transition-none motion-reduce:hover:scale-100 ${focusRing}`}
    >
      <MessageCircle aria-hidden className="size-7" />
    </a>
  );
}

import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BUSINESS } from '../../config/business';
import { useSiteSettings } from '../../hooks/SiteSettingsProvider';
import { trackEvent } from '../../lib/analytics';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import { buttonClass, type ButtonSize, type ButtonVariant } from '../ui/styles';

interface WhatsAppLinkProps {
  message: string;
  label: string;
  // Where the click happened, for example "hero" or "service:gst-return-filing". Never personal data.
  context: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  showIcon?: boolean;
}

// A plain anchor: the WhatsApp chat opens only when the visitor clicks it.
export function WhatsAppLink({
  message,
  label,
  context,
  variant = 'whatsapp',
  size = 'md',
  className,
  showIcon = true,
}: WhatsAppLinkProps) {
  const { settings } = useSiteSettings();
  const href = buildWhatsAppUrl(settings.whatsappNumber, message) ?? buildWhatsAppUrl(BUSINESS.whatsappNumber, message);

  if (!href) {
    return (
      <Link to="/contact" className={buttonClass('secondary', className, size)}>
        Send an enquiry
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass(variant, className, size)}
      onClick={() => trackEvent('whatsapp_click', { context })}
    >
      {showIcon && <MessageCircle aria-hidden className="size-[18px]" />}
      <span>{label}</span>
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  );
}

import { MessageCircle } from 'lucide-react'
import { createWhatsAppLink } from '../utils/whatsapp'

const VARIANTS = {
  gold: 'btn-gold',
  navy: 'btn-navy',
  outline: 'btn-outline',
  light: 'btn-outline-light',
}

/**
 * A WhatsApp click-to-chat button. The link is built from a pre-written message and only opens when the
 * visitor clicks it. If the firm's number is not configured (or `disabled` is set), the button is disabled
 * instead of linking to a broken or incomplete address. A development warning explains what to fix.
 */
export default function WhatsAppCta({ message, variant = 'gold', className = '', disabled = false, children }) {
  const link = createWhatsAppLink(message)
  const classes = `${VARIANTS[variant]} ${className}`

  if (disabled || !link.configured) {
    return (
      <span className="inline-flex flex-col items-start gap-2">
        <button
          type="button"
          disabled
          className={classes}
          title={disabled ? undefined : "WhatsApp enquiries are available once the firm's number is configured."}
        >
          <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
          {children}
        </button>
        {import.meta.env.DEV && !disabled && (
          <span className="max-w-xs text-xs text-amber-800">
            Dev warning: {link.message} Set whatsappNumber in src/config/siteConfig.js.
          </span>
        )}
      </span>
    )
  }

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={classes}>
      <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
      {children}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  )
}

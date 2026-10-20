import { MessageCircle } from 'lucide-react'
import { buildGeneralMessage, createWhatsAppLink } from '../utils/whatsapp'

/** Floating WhatsApp entry point. Hidden in production until the firm's number is configured. */
export default function WhatsAppButton() {
  const link = createWhatsAppLink(buildGeneralMessage())
  const position = 'fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6'
  const surface =
    'inline-flex h-14 items-center gap-2 rounded-full bg-champagne-400 px-4 text-sm font-semibold text-navy-950 shadow-[0_16px_40px_-14px_rgba(7,20,38,0.6)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-champagne-300 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60'

  if (!link.configured) {
    if (!import.meta.env.DEV) return null
    return (
      <button type="button" disabled className={`${position} ${surface}`} aria-label="WhatsApp not configured">
        <MessageCircle className="size-5" aria-hidden="true" />
        <span className="hidden sm:inline">Not configured</span>
      </button>
    )
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with the firm on WhatsApp (opens in a new tab)"
      className={`${position} ${surface}`}
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  )
}

import { siteConfig } from '../config/siteConfig'
import { validateWhatsAppNumber } from './whatsapp'

/** Lists the configuration values that are still missing or placeholders. Used by the development banner. */
export function getConfigWarnings() {
  const warnings = []

  const whatsapp = validateWhatsAppNumber(siteConfig.whatsappNumber)
  if (!whatsapp.valid) warnings.push('WhatsApp number')
  if (!siteConfig.phone) warnings.push('phone')
  if (!siteConfig.email) warnings.push('email')
  if (!siteConfig.officeAddress) warnings.push('office address')
  if (!siteConfig.businessHours.some((hours) => hours.time)) warnings.push('business hours')
  if (!siteConfig.mapEmbedUrl) warnings.push('map embed URL')
  if (!siteConfig.websiteUrl) warnings.push('website URL (canonical links and sitemap)')
  if (siteConfig.pricing.showSampleNotice) warnings.push('approved prices (sample notice is still on)')

  return warnings
}

/** True when the value is non-empty and contains no placeholder characters. */
export function isFilled(value) {
  return Boolean(value && String(value).trim())
}

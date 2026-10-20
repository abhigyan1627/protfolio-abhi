import { siteConfig } from '../config/siteConfig'
import { billingPhrase, formatPrice } from './format'

const OPENING = 'Hello, I visited your website'

/** Removes spaces, brackets, dashes, dots and a leading plus sign from a phone-style value. */
export function sanitizeNumber(value = '') {
  return String(value).replace(/[\s()+\-.]/g, '')
}

function invalid(reason, message) {
  return { valid: false, number: '', reason, message }
}

/**
 * Checks a WhatsApp number before any click-to-chat link is generated.
 * Returns { valid, number, reason, message }. `number` is digits only, in international format.
 */
export function validateWhatsAppNumber(value = siteConfig.whatsappNumber) {
  const raw = String(value ?? '').trim()
  if (!raw) return invalid('empty', 'The WhatsApp number has not been set.')
  if (/[a-z]/i.test(raw)) return invalid('placeholder', 'The WhatsApp number still contains placeholder characters.')

  const digits = sanitizeNumber(raw)
  if (!/^\d+$/.test(digits)) return invalid('format', 'The WhatsApp number may contain only digits.')
  if (digits.length < 11 || digits.length > 15) {
    return invalid('length', 'Use the full international number, including the country code (11–15 digits).')
  }
  if (digits.startsWith('0')) return invalid('format', 'Use the international format, without a leading 0.')

  return { valid: true, number: digits, reason: 'ok', message: '' }
}

export function isWhatsAppConfigured(value = siteConfig.whatsappNumber) {
  return validateWhatsAppNumber(value).valid
}

/**
 * Builds an official click-to-chat link: https://wa.me/<number>?text=<encoded message>.
 * Nothing is opened here. The link is only followed when a visitor clicks it.
 */
export function createWhatsAppLink(message, value = siteConfig.whatsappNumber) {
  const check = validateWhatsAppNumber(value)
  if (!check.valid) {
    return { href: '', configured: false, reason: check.reason, message: check.message }
  }
  return {
    href: `https://wa.me/${check.number}?text=${encodeURIComponent(message)}`,
    configured: true,
    reason: 'ok',
    message: '',
  }
}

function appendRequirement(message, requirement = '') {
  const note = requirement.trim()
  return note ? `${message}\n\nAdditional details: ${note}` : message
}

/** Opening enquiry used by the navigation, hero, floating button and contact sections. */
export function buildGeneralMessage() {
  return `${OPENING} and would like to discuss my requirements. Please contact me with the next steps.`
}

/** Enquiry about a service, using the service-specific wording from src/data/services.js. */
export function buildServiceMessage(service, requirement = '') {
  return appendRequirement(service.enquiryIntro, requirement)
}

/**
 * Enquiry about a plan. `intent: 'enquire'` uses the plan's own questions (the "Ask on WhatsApp" action).
 * `intent: 'choose'` states that the visitor wants to proceed (the "Choose This Plan" action). Neither
 * implies a purchase: both start a conversation with the firm.
 */
export function buildPlanMessage(plan, { intent = 'enquire', requirement = '' } = {}) {
  const priceLine =
    plan.price == null
      ? 'The plan is priced as a custom quotation.'
      : `The plan is listed on your website at ${formatPrice(plan)}, ${billingPhrase(plan)}.`

  const body =
    intent === 'choose'
      ? `${OPENING} and would like to choose the ${plan.name} plan. ${priceLine} Please confirm the next steps, the documents I should prepare, and any additional charges before we begin.`
      : `${plan.enquiryIntro} ${priceLine}`

  return appendRequirement(body, requirement)
}

/** Custom quotation request. The visitor's own requirement is included verbatim. */
export function buildCustomQuoteMessage(requirement) {
  return `${OPENING} and would like assistance with the following requirements: ${requirement.trim()}. Please contact me with the next steps.`
}

/** Summary of the basic enquiry form, used only for the WhatsApp fallback. */
export function buildEnquiryMessage({ name, service, contactMethod, contact = '', message = '' }) {
  const lines = [
    `Hello, my name is ${name.trim()}.`,
    `I visited your website and would like to enquire about: ${service}.`,
    `Preferred contact method: ${contactMethod}${contact.trim() ? ` (${contact.trim()})` : ''}.`,
  ]
  if (message.trim()) lines.push(`Additional details: ${message.trim()}`)
  return lines.join('\n')
}

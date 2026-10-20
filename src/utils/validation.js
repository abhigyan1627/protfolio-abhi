export const CONTACT_METHODS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Phone call' },
  { value: 'email', label: 'Email' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/

// Patterns for sensitive data that must never be typed into a general enquiry.
const SENSITIVE_PATTERNS = [
  { label: 'PAN', pattern: /\b[A-Za-z]{5}\d{4}[A-Za-z]\b/ },
  { label: 'Aadhaar', pattern: /\b\d{4}\s?\d{4}\s?\d{4}\b/ },
  { label: 'bank account', pattern: /\b(account\s*(number|no\.?)|a\/c\s*no\.?|ifsc)\b/i },
  { label: 'password', pattern: /\b(password|passcode|cvv)\b/i },
  { label: 'OTP', pattern: /\botp\b/i },
]

/** Returns the name of the first sensitive data type found in the text, or '' when none is found. */
export function findSensitiveText(text = '') {
  return SENSITIVE_PATTERNS.find(({ pattern }) => pattern.test(text))?.label ?? ''
}

/** Strips the +91 prefix and any separators so that a mobile number can be checked. */
export function normalizePhone(value = '') {
  const digits = value.replace(/\D/g, '')
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits
}

/** Validates the basic enquiry form. Returns an object of field errors; an empty object means valid. */
export function validateEnquiry(values) {
  const errors = {}

  const name = values.name.trim()
  if (!name) errors.name = 'Please enter your name.'
  else if (name.length < 2) errors.name = 'Your name should be at least 2 characters.'
  else if (name.length > 80) errors.name = 'Please keep your name under 80 characters.'

  if (!values.service) errors.service = 'Please choose the service you are interested in.'

  const contact = values.contact.trim()
  if (values.contactMethod === 'email') {
    if (!contact) errors.contact = 'Please enter your email address.'
    else if (!EMAIL_PATTERN.test(contact)) errors.contact = 'Please enter a valid email address.'
  } else if (!contact) {
    errors.contact = 'Please enter your 10-digit mobile number.'
  } else if (!INDIAN_MOBILE_PATTERN.test(normalizePhone(contact))) {
    errors.contact = 'Please enter a valid 10-digit mobile number.'
  }

  const message = values.message.trim()
  const sensitive = findSensitiveText(message)
  if (message.length > 600) errors.message = 'Please keep your message under 600 characters.'
  else if (sensitive) errors.message = `Please do not include ${sensitive} details here. Share sensitive documents only through the secure method the firm confirms.`

  if (!values.consent) errors.consent = 'Please confirm that the firm may contact you about your enquiry.'

  return errors
}

/** Validates the free-text requirement used by the custom quotation and service finder notes. */
export function validateRequirement(value = '') {
  const text = value.trim()
  if (text.length < 10) return 'Please describe your requirement in at least 10 characters.'
  if (text.length > 1000) return 'Please keep your requirement under 1,000 characters.'
  const sensitive = findSensitiveText(text)
  if (sensitive) return `Please do not include ${sensitive} details here. Share sensitive documents only through the secure method the firm confirms.`
  return ''
}

import { describe, expect, it } from 'vitest'
import { findSensitiveText, normalizePhone, validateEnquiry, validateRequirement } from './validation'

const VALID = {
  name: 'Asha Verma',
  service: 'gst-registration',
  contactMethod: 'whatsapp',
  contact: '+91 98765 43210',
  message: 'Please share the checklist.',
  consent: true,
}

describe('validateEnquiry', () => {
  it('accepts a complete enquiry', () => {
    expect(validateEnquiry(VALID)).toEqual({})
  })

  it('requires a name of at least two characters', () => {
    expect(validateEnquiry({ ...VALID, name: '  ' }).name).toBe('Please enter your name.')
    expect(validateEnquiry({ ...VALID, name: 'A' }).name).toMatch(/at least 2/)
  })

  it('requires a service', () => {
    expect(validateEnquiry({ ...VALID, service: '' }).service).toBeDefined()
  })

  it('checks mobile numbers for WhatsApp and phone enquiries', () => {
    expect(validateEnquiry({ ...VALID, contact: '12345' }).contact).toMatch(/valid 10-digit/)
    expect(validateEnquiry({ ...VALID, contact: '' }).contact).toMatch(/10-digit mobile/)
    expect(validateEnquiry({ ...VALID, contactMethod: 'phone', contact: '9876543210' })).toEqual({})
  })

  it('checks email addresses when email is the chosen method', () => {
    expect(validateEnquiry({ ...VALID, contactMethod: 'email', contact: 'not-an-email' }).contact).toMatch(/valid email/)
    expect(validateEnquiry({ ...VALID, contactMethod: 'email', contact: 'asha@example.in' })).toEqual({})
  })

  it('requires consent before the firm may contact the visitor', () => {
    expect(validateEnquiry({ ...VALID, consent: false }).consent).toBeDefined()
  })

  it('refuses sensitive identifiers and secrets in the message', () => {
    expect(validateEnquiry({ ...VALID, message: 'My PAN is ABCDE1234F' }).message).toMatch(/PAN/)
    expect(validateEnquiry({ ...VALID, message: 'The OTP is 123456' }).message).toMatch(/OTP/)
    expect(validateEnquiry({ ...VALID, message: 'Aadhaar 1234 5678 9012' }).message).toMatch(/Aadhaar/)
  })

  it('limits the message length', () => {
    expect(validateEnquiry({ ...VALID, message: 'a'.repeat(601) }).message).toMatch(/600/)
  })
})

describe('normalizePhone', () => {
  it('removes the +91 prefix and separators', () => {
    expect(normalizePhone('+91 98765-43210')).toBe('9876543210')
    expect(normalizePhone('919876543210')).toBe('9876543210')
  })
})

describe('findSensitiveText', () => {
  it('returns an empty string for ordinary text', () => {
    expect(findSensitiveText('Please share the GST checklist.')).toBe('')
  })
})

describe('validateRequirement', () => {
  it('asks for a meaningful description', () => {
    expect(validateRequirement('GST')).toMatch(/at least 10/)
  })

  it('accepts a clear requirement', () => {
    expect(validateRequirement('Monthly GST and TDS compliance for two branches')).toBe('')
  })

  it('refuses sensitive details', () => {
    expect(validateRequirement('Share PAN ABCDE1234F for filing')).toMatch(/PAN/)
  })
})

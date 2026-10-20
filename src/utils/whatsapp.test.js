import { describe, expect, it } from 'vitest'
import { plans } from '../data/plans'
import { services } from '../data/services'
import {
  buildCustomQuoteMessage,
  buildEnquiryMessage,
  buildGeneralMessage,
  buildPlanMessage,
  buildServiceMessage,
  createWhatsAppLink,
  validateWhatsAppNumber,
} from './whatsapp'

const TEST_NUMBER = '919876543210'

describe('validateWhatsAppNumber', () => {
  it('rejects the placeholder number shipped in the template', () => {
    expect(validateWhatsAppNumber('91XXXXXXXXXX')).toMatchObject({ valid: false, reason: 'placeholder' })
  })

  it('rejects an empty value', () => {
    expect(validateWhatsAppNumber('')).toMatchObject({ valid: false, reason: 'empty' })
  })

  it('rejects a number without a country code', () => {
    expect(validateWhatsAppNumber('9876543210')).toMatchObject({ valid: false, reason: 'length' })
  })

  it('rejects a number with a leading zero', () => {
    expect(validateWhatsAppNumber('0919876543210')).toMatchObject({ valid: false, reason: 'format' })
  })

  it('accepts an international number and strips separators', () => {
    expect(validateWhatsAppNumber('+91 98765-43210')).toEqual({
      valid: true,
      number: TEST_NUMBER,
      reason: 'ok',
      message: '',
    })
  })
})

describe('createWhatsAppLink', () => {
  it('returns no link while the number is not configured', () => {
    const link = createWhatsAppLink('Hello')
    expect(link.configured).toBe(false)
    expect(link.href).toBe('')
  })

  it('builds an official click-to-chat URL with the encoded message', () => {
    const message = 'Hello & welcome?\nPlease share: ₹1,499 (one-time) 100% #1'
    const link = createWhatsAppLink(message, TEST_NUMBER)

    expect(link.configured).toBe(true)
    expect(link.href).toBe(`https://wa.me/${TEST_NUMBER}?text=${encodeURIComponent(message)}`)
    expect(new URL(link.href).searchParams.get('text')).toBe(message)
  })

  it('encodes characters that would otherwise break the query string', () => {
    const link = createWhatsAppLink('a&b=c #d ?e +f', TEST_NUMBER)
    expect(link.href).toContain('text=a%26b%3Dc%20%23d%20%3Fe%20%2Bf')
  })
})

describe('message builders', () => {
  it('gives every plan its own enquiry wording', () => {
    const messages = plans.map((plan) => buildPlanMessage(plan))
    expect(new Set(messages).size).toBe(plans.length)
    plans.forEach((plan, index) => {
      expect(messages[index]).toContain(plan.enquiryIntro)
    })
  })

  it('states the displayed price for a priced plan', () => {
    const plan = plans.find((item) => item.id === 'essential-itr')
    expect(buildPlanMessage(plan)).toContain('₹1,499, one-time')
  })

  it('describes a custom-priced plan as a custom quotation', () => {
    const plan = plans.find((item) => item.price === null)
    expect(buildPlanMessage(plan)).toContain('priced as a custom quotation')
  })

  it('uses a choose message that expresses intent without describing a purchase', () => {
    const plan = plans[0]
    const message = buildPlanMessage(plan, { intent: 'choose' })
    expect(message).toContain(`choose the ${plan.name} plan`)
    expect(message).not.toMatch(/checkout|payment|purchase|pay now/i)
  })

  it('gives every service its own enquiry wording', () => {
    const messages = services.map((service) => buildServiceMessage(service))
    expect(new Set(messages).size).toBe(services.length)
  })

  it('appends optional details on their own lines and skips blank notes', () => {
    const plain = buildServiceMessage(services[0], '   ')
    expect(plain).toBe(services[0].enquiryIntro)

    const withNote = buildServiceMessage(services[0], 'Two branches')
    expect(withNote).toBe(`${services[0].enquiryIntro}\n\nAdditional details: Two branches`)
  })

  it('includes the custom requirement verbatim in the custom quotation message', () => {
    const requirement = 'GST & TDS for two branches?'
    expect(buildCustomQuoteMessage(requirement)).toContain(`following requirements: ${requirement}.`)
  })

  it('builds the general navigation message', () => {
    expect(buildGeneralMessage()).toMatch(/discuss my requirements/)
  })

  it('summarises the enquiry form without empty optional fields', () => {
    const message = buildEnquiryMessage({
      name: ' Asha ',
      service: 'GST Registration',
      contactMethod: 'WhatsApp',
      contact: '',
      message: '',
    })
    expect(message).toBe(
      ['Hello, my name is Asha.', 'I visited your website and would like to enquire about: GST Registration.', 'Preferred contact method: WhatsApp.'].join('\n'),
    )
  })
})

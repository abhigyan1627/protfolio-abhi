import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppUrl, normalizeWhatsAppNumber, whatsappMessages } from './whatsapp';

describe('normalizeWhatsAppNumber', () => {
  it('removes formatting characters from a valid international number', () => {
    assert.equal(normalizeWhatsAppNumber('+91 62990 33454'), '916299033454');
    assert.equal(normalizeWhatsAppNumber('+91-(62990)-33454'), '916299033454');
    assert.equal(normalizeWhatsAppNumber('91.62990.33454'), '916299033454');
  });

  it('rejects national numbers with a trunk prefix, letters and too-short values', () => {
    assert.equal(normalizeWhatsAppNumber('06299033454'), null);
    assert.equal(normalizeWhatsAppNumber('62990 3345A'), null);
    assert.equal(normalizeWhatsAppNumber('1234'), null);
    assert.equal(normalizeWhatsAppNumber(''), null);
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with an encoded message', () => {
    const url = buildWhatsAppUrl('+91 62990 33454', 'Hello & welcome? Yes #1');
    assert.equal(url, 'https://wa.me/916299033454?text=Hello%20%26%20welcome%3F%20Yes%20%231');
  });

  it('returns null instead of an unusable link for an invalid number', () => {
    assert.equal(buildWhatsAppUrl('0629', 'Hello'), null);
  });
});

describe('whatsapp message templates', () => {
  it('matches the ITR example from the brief', () => {
    assert.equal(
      whatsappMessages.service({ name: 'ITR Filing Assistance', category: 'INCOME_TAX' }),
      'Hello CA Mohit Agrawal, I visited your website and would like to enquire about ITR Filing Assistance. Please let me know the applicable fees, documents required and next steps.',
    );
  });

  it('matches the GST example from the brief', () => {
    assert.equal(
      whatsappMessages.service({ name: 'GST Registration Assistance', category: 'GST' }),
      'Hello CA Mohit Agrawal, I visited your website and would like to enquire about GST Registration Assistance. Please share the required documents, professional fees, applicable additional charges and process.',
    );
  });

  it('matches the accounting example from the brief', () => {
    assert.equal(
      whatsappMessages.service({ name: 'Accounting Support', category: 'ACCOUNTING_FINANCE' }),
      'Hello CA Mohit Agrawal, I am interested in Accounting Support. Please share the scope, pricing, documentation requirements and onboarding process.',
    );
  });

  it('includes plan and category context for a selected plan', () => {
    assert.equal(
      whatsappMessages.plan({ name: 'Essential ITR' }, 'Income Tax'),
      'Hello CA Mohit Agrawal, I would like to enquire about the Essential ITR plan for Income Tax. Please confirm the current price, inclusions, exclusions and next steps.',
    );
  });

  it('never includes personal details in generated messages', () => {
    const message = whatsappMessages.enquiryFollowUp('CMA-2601-ABCDEF');
    assert.match(message, /CMA-2601-ABCDEF/);
    assert.doesNotMatch(message, /\+91|@/);
  });
});

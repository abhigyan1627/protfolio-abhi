import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { enquiryFormSchema, normalizePhoneInput } from './validation';

const base = { name: 'Test Visitor', contactMethod: 'WHATSAPP', phone: '62990 33454', email: '', message: '', consent: true, website: '' };

describe('normalizePhoneInput', () => {
  it('accepts Indian mobile numbers with or without formatting', () => {
    assert.equal(normalizePhoneInput('62990 33454'), '+916299033454');
    assert.equal(normalizePhoneInput('06299033454'), '+916299033454');
    assert.equal(normalizePhoneInput('+44 20 7946 0958'), '+442079460958');
  });

  it('rejects letters and short numbers', () => {
    assert.equal(normalizePhoneInput('abc'), null);
    assert.equal(normalizePhoneInput('12345'), null);
  });
});

describe('enquiryFormSchema', () => {
  it('accepts a complete WhatsApp enquiry', () => {
    assert.equal(enquiryFormSchema.safeParse(base).success, true);
  });

  it('requires consent', () => {
    const result = enquiryFormSchema.safeParse({ ...base, consent: false });
    assert.equal(result.success, false);
    assert.ok(result.error?.issues.some((issue) => issue.path[0] === 'consent'));
  });

  it('requires an email address when email is the chosen contact method', () => {
    const result = enquiryFormSchema.safeParse({ ...base, contactMethod: 'EMAIL', phone: '' });
    assert.equal(result.success, false);
    assert.ok(result.error?.issues.some((issue) => issue.path[0] === 'email'));
  });

  it('reports every invalid field at once', () => {
    const result = enquiryFormSchema.safeParse({ ...base, name: 'A', phone: 'x', consent: false });
    const paths = (result.error?.issues ?? []).map((issue) => issue.path[0]);
    assert.ok(paths.includes('name'));
    assert.ok(paths.includes('phone'));
    assert.ok(paths.includes('consent'));
  });
});

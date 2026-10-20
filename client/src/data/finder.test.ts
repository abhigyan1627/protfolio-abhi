import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { plansForSelection, servicesForAudience } from './finder';
import type { Plan, Service } from '../types/api';

const service = (slug: string, category: Service['category']): Service => ({
  id: slug,
  name: slug,
  slug,
  category,
  description: '',
  iconKey: 'file-text',
  details: { overview: '', whoMayNeed: [], documents: [], deliverables: [], exclusions: [], faqs: [] },
  enabled: true,
  published: true,
  featured: false,
  displayOrder: 0,
});

const plan = (slug: string, audience: Plan['audience'], serviceCategory: Plan['serviceCategory']): Plan => ({
  id: slug,
  name: slug,
  slug,
  audience,
  serviceCategory,
  description: '',
  priceInPaise: null,
  currency: 'INR',
  billingFrequency: 'CUSTOM',
  additionalCharges: null,
  targetCustomer: '',
  inclusions: [],
  exclusions: [],
  published: true,
  featured: false,
  displayOrder: 0,
});

describe('servicesForAudience', () => {
  it('returns only the services mapped to the audience, in mapped order', () => {
    const catalogue = [
      service('tax-consultation', 'INCOME_TAX'),
      service('gst-return-filing', 'GST'),
      service('itr-filing-assistance', 'INCOME_TAX'),
      service('unrelated-service', 'AUDIT_OTHER'),
    ];
    const result = servicesForAudience('INDIVIDUAL', catalogue).map((item) => item.slug);
    assert.deepEqual(result, ['itr-filing-assistance', 'tax-consultation']);
  });
});

describe('plansForSelection', () => {
  it('prefers plans that match both audience and service category', () => {
    const plans = [
      plan('gst-plan', 'BUSINESS', 'GST'),
      plan('accounting-plan', 'BUSINESS', 'ACCOUNTING_FINANCE'),
      plan('individual-plan', 'INDIVIDUAL', 'GST'),
    ];
    const result = plansForSelection('BUSINESS', service('x', 'GST'), plans).map((item) => item.slug);
    assert.deepEqual(result, ['gst-plan']);
  });

  it('falls back to all plans for the audience when none match the category', () => {
    const plans = [plan('accounting-plan', 'BUSINESS', 'ACCOUNTING_FINANCE')];
    const result = plansForSelection('BUSINESS', service('x', 'GST'), plans).map((item) => item.slug);
    assert.deepEqual(result, ['accounting-plan']);
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatPlanPrice } from './format';

describe('formatPlanPrice', () => {
  it('shows Contact for Quotation when no price is approved', () => {
    assert.deepEqual(formatPlanPrice({ priceInPaise: null, billingFrequency: 'MONTHLY' }), {
      headline: 'Contact for Quotation',
      suffix: null,
      isQuote: true,
    });
  });

  it('converts integer paise to rupees with the billing label', () => {
    assert.deepEqual(formatPlanPrice({ priceInPaise: 150000, billingFrequency: 'PER_FILING' }), {
      headline: '₹1,500',
      suffix: 'per filing',
      isQuote: false,
    });
  });

  it('keeps paise when they are present', () => {
    assert.equal(formatPlanPrice({ priceInPaise: 123456, billingFrequency: 'ONE_TIME' }).headline, '₹1,234.56');
  });
});

import { Check, Minus } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { AUDIENCE_LABELS, CATEGORY_LABELS, CATEGORY_ORDER, formatPlanPrice } from '../../lib/format';
import { whatsappMessages } from '../../lib/whatsapp';
import type { Audience, Plan, ServiceCategory } from '../../types/api';
import { PlanCard } from './PlanCard';
import { buttonClass, cardClass, focusRing } from '../ui/styles';

const AUDIENCES: Audience[] = ['INDIVIDUAL', 'BUSINESS', 'STARTUP'];
const MAX_COMPARE = 3;

function parseAudience(value: string | null): Audience {
  return AUDIENCES.find((audience) => audience === value) ?? 'INDIVIDUAL';
}

export function PricingExplorer({ plans }: { plans: Plan[] }) {
  const [params, setParams] = useSearchParams();
  const audience = parseAudience(params.get('audience'));
  const category = params.get('category') as ServiceCategory | null;
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const audiencePlans = useMemo(
    () => plans.filter((plan) => plan.audience === audience).sort((a, b) => a.displayOrder - b.displayOrder),
    [plans, audience],
  );

  const availableCategories = CATEGORY_ORDER.filter((item) =>
    audiencePlans.some((plan) => plan.serviceCategory === item),
  );

  const visiblePlans = category ? audiencePlans.filter((plan) => plan.serviceCategory === category) : audiencePlans;
  const comparePlans = compareIds
    .map((id) => plans.find((plan) => plan.id === id))
    .filter((plan): plan is Plan => Boolean(plan));

  const selectAudience = (next: Audience) => {
    setCompareIds([]);
    setParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set('audience', next);
      updated.delete('category');
      return updated;
    });
  };

  const selectCategory = (next: ServiceCategory | null) => {
    setParams((current) => {
      const updated = new URLSearchParams(current);
      if (next) updated.set('category', next);
      else updated.delete('category');
      return updated;
    });
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const nextIndex = (index + delta + AUDIENCES.length) % AUDIENCES.length;
    const next = AUDIENCES[nextIndex];
    if (next) {
      selectAudience(next);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_COMPARE) return current;
      return [...current, id];
    });
  }, []);

  return (
    <div>
      <div role="tablist" aria-label="Customer type" className="inline-flex flex-wrap gap-1 rounded-lg border border-line bg-white p-1">
        {AUDIENCES.map((item, index) => {
          const selected = item === audience;
          return (
            <button
              key={item}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              id={`tab-${item}`}
              type="button"
              aria-selected={selected}
              aria-controls="pricing-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectAudience(item)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${focusRing} ${
                selected ? 'bg-navy text-white' : 'text-slate hover:text-navy'
              }`}
            >
              {AUDIENCE_LABELS[item]}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter plans by service category">
        <button
          type="button"
          aria-pressed={!category}
          onClick={() => selectCategory(null)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${focusRing} ${
            !category ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-navy'
          }`}
        >
          All services
        </button>
        {availableCategories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => selectCategory(item)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${focusRing} ${
              category === item ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-navy'
            }`}
          >
            {CATEGORY_LABELS[item]}
          </button>
        ))}
      </div>

      <div id="pricing-panel" role="tabpanel" aria-labelledby={`tab-${audience}`} className="mt-8">
        {visiblePlans.length === 0 ? (
          <div className={`${cardClass} text-center`}>
            <p className="font-display text-lg font-bold text-navy">No plans in this category yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate">
              Tell us what you need and we will prepare a quotation for you.
            </p>
            <div className="mt-6">
              <WhatsAppLink
                context="pricing-empty"
                message={whatsappMessages.customQuote(category ? CATEGORY_LABELS[category] : undefined)}
                label="Request a custom quotation"
              />
            </div>
          </div>
        ) : (
          <ul className="grid gap-6 lg:grid-cols-3">
            {visiblePlans.map((plan) => {
              const selected = compareIds.includes(plan.id);
              return (
                <li key={plan.id} className="h-full">
                  <PlanCard
                    plan={plan}
                    compare={{
                      selected,
                      disabled: !selected && compareIds.length >= MAX_COMPARE,
                      onToggle: () => toggleCompare(plan.id),
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-sm text-slate" aria-live="polite">
          {compareIds.length >= MAX_COMPARE
            ? `You can compare up to ${MAX_COMPARE} plans at once.`
            : 'Tick "Compare this plan" on up to three plans to see them side by side.'}
        </p>
      </div>

      {comparePlans.length >= 2 && (
        <section aria-labelledby="compare-heading" className={`${cardClass} mt-10 overflow-x-auto p-0`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
            <h3 id="compare-heading" className="font-display text-lg font-bold text-navy">
              Plan comparison
            </h3>
            <button type="button" onClick={() => setCompareIds([])} className={buttonClass('secondary', '', 'sm')}>
              Clear comparison
            </button>
          </div>
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Side-by-side comparison of selected plans</caption>
            <thead>
              <tr className="border-b border-line bg-ivory">
                <th scope="col" className="w-40 px-6 py-4 font-semibold text-navy">
                  Detail
                </th>
                {comparePlans.map((plan) => (
                  <th key={plan.id} scope="col" className="px-6 py-4 font-display font-bold text-navy">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line align-top">
              <tr>
                <th scope="row" className="px-6 py-4 font-medium text-slate">Price</th>
                {comparePlans.map((plan) => {
                  const price = formatPlanPrice(plan);
                  return (
                    <td key={plan.id} className="px-6 py-4 text-ink">
                      {price.isQuote ? 'Contact for Quotation' : `${price.headline}${price.suffix ? ` ${price.suffix}` : ''}`}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <th scope="row" className="px-6 py-4 font-medium text-slate">Best for</th>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-ink">{plan.targetCustomer}</td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="px-6 py-4 font-medium text-slate">Included</th>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4">
                    <ul className="space-y-2">
                      {plan.inclusions.map((item) => (
                        <li key={item} className="flex gap-2 text-ink">
                          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-whatsapp" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="px-6 py-4 font-medium text-slate">Not included</th>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4">
                    <ul className="space-y-2 text-slate">
                      {plan.exclusions.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Minus aria-hidden className="mt-0.5 size-4 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="px-6 py-4 font-medium text-slate">Additional charges</th>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-slate">
                    {plan.additionalCharges ?? 'Confirmed in your quotation.'}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="px-6 py-4 font-medium text-slate">Enquire</th>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4">
                    <WhatsAppLink
                      size="sm"
                      context={`compare:${plan.slug}`}
                      message={whatsappMessages.plan(plan, CATEGORY_LABELS[plan.serviceCategory])}
                      label="WhatsApp"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      )}

      <section aria-labelledby="custom-quote-heading" className={`${cardClass} mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}>
        <div className="max-w-xl">
          <h3 id="custom-quote-heading" className="font-display text-xl font-bold text-navy">
            Need something different?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            If your requirement does not match a plan, describe it and we will prepare a custom quotation. Statutory fees, government charges and third-party costs are shown separately.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink
            context="custom-quote"
            message={whatsappMessages.customQuote(category ? CATEGORY_LABELS[category] : undefined)}
            label="Request custom quotation"
          />
          <Link to="/contact" className={buttonClass('secondary')}>
            Use the contact form
          </Link>
        </div>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-slate">
        Prices are shown only where they have been approved. Where a plan says "Contact for Quotation", we confirm the fee before any work begins. Government fees, GST where applicable, filing charges and third-party costs are not included unless a plan or quotation states otherwise.
      </p>
    </div>
  );
}

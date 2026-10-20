import { Check, Minus } from 'lucide-react';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { AUDIENCE_LABELS, CATEGORY_LABELS, formatPlanPrice } from '../../lib/format';
import { whatsappMessages } from '../../lib/whatsapp';
import type { Plan } from '../../types/api';
import { cardClass } from '../ui/styles';

interface PlanCardProps {
  plan: Plan;
  compare?: { selected: boolean; disabled: boolean; onToggle: () => void };
}

export function PlanCard({ plan, compare }: PlanCardProps) {
  const price = formatPlanPrice(plan);
  const headingId = `plan-${plan.slug}`;
  const categoryLabel = CATEGORY_LABELS[plan.serviceCategory];

  return (
    <article aria-labelledby={headingId} className={`${cardClass} flex h-full flex-col p-7`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">{AUDIENCE_LABELS[plan.audience]}</span>
        {plan.featured && <span className="rounded-full bg-ivory px-2.5 py-1 text-xs font-medium text-navy">Featured</span>}
      </div>

      <h3 id={headingId} className="mt-3 font-display text-xl font-bold text-navy">
        {plan.name}
      </h3>
      <p className="mt-1 text-sm text-slate">{categoryLabel}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink">{plan.description}</p>

      <div className="mt-6 border-y border-line py-5">
        {price.isQuote ? (
          <p className="font-display text-xl font-bold text-navy">Contact for Quotation</p>
        ) : (
          <p className="font-display text-3xl font-bold text-navy">
            {price.headline}
            {price.suffix && <span className="ml-2 text-sm font-medium text-slate">{price.suffix}</span>}
          </p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-slate">
          {plan.additionalCharges ?? 'Statutory fees and third-party costs are not included unless stated in your quotation.'}
        </p>
      </div>

      <p className="mt-5 text-sm text-ink">
        <span className="font-semibold">Best for:</span> {plan.targetCustomer}
      </p>

      <div className="mt-5">
        <p className="text-sm font-semibold text-navy">Included</p>
        <ul className="mt-2 space-y-2">
          {plan.inclusions.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-ink">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-whatsapp" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.exclusions.length > 0 && (
        <details className="group mt-5 text-sm">
          <summary className="cursor-pointer font-semibold text-navy underline-offset-4 hover:underline">Not included</summary>
          <ul className="mt-2 space-y-2 text-slate">
            {plan.exclusions.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Minus aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-auto flex flex-col gap-4 pt-7">
        <WhatsAppLink
          context={`plan:${plan.slug}`}
          message={whatsappMessages.plan(plan, categoryLabel)}
          label="Enquire about this plan"
          className="w-full"
        />
        {compare && (
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink has-[:disabled]:cursor-not-allowed has-[:disabled]:text-slate">
            <input
              type="checkbox"
              checked={compare.selected}
              disabled={compare.disabled}
              onChange={compare.onToggle}
              className="size-4 accent-navy"
            />
            Compare this plan
          </label>
        )}
      </div>
    </article>
  );
}

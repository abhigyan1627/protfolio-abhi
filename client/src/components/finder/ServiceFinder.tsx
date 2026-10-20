import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FINDER_AUDIENCES, plansForSelection, servicesForAudience } from '../../data/finder';
import { useAsync } from '../../hooks/useAsync';
import { publicApi } from '../../lib/publicApi';
import { CATEGORY_LABELS } from '../../lib/format';
import { whatsappMessages } from '../../lib/whatsapp';
import type { Audience, Plan, Service } from '../../types/api';
import { WhatsAppLink } from '../whatsapp/WhatsAppLink';
import { ErrorBlock, EmptyBlock, LoadingBlock } from '../ui/States';
import { buttonClass, cardClass, errorClass, focusRing } from '../ui/styles';
import { ServiceIcon } from '../services/ServiceIcon';

const STEP_TITLES = ['Who needs assistance?', 'What service do you need?', 'Choose a plan or request a quotation.', 'Continue on WhatsApp.'];
const CUSTOM_QUOTE = 'custom-quote';

type Selection = { audience?: Audience; serviceId?: string; planId?: string };

function OptionCard({
  name,
  checked,
  onChange,
  title,
  description,
  icon,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-lg border p-5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
        checked ? 'border-navy bg-white ring-1 ring-navy' : 'border-line bg-white hover:border-navy/50'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {icon && <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-navy text-white">{icon}</span>}
      <span className="min-w-0">
        <span className="block font-display text-base font-bold text-navy">{title}</span>
        {description && <span className="mt-1 block text-sm leading-relaxed text-slate">{description}</span>}
      </span>
    </label>
  );
}

export function ServiceFinder() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<Selection>({});
  const [error, setError] = useState<string | null>(null);
  const services = useAsync((signal) => publicApi.services(signal), []);
  const plans = useAsync((signal) => publicApi.plans(signal), []);

  const audienceServices = useMemo<Service[]>(
    () => (selection.audience && services.data ? servicesForAudience(selection.audience, services.data) : []),
    [selection.audience, services.data],
  );

  const chosenService = audienceServices.find((service) => service.id === selection.serviceId) ?? null;

  const audiencePlans: Plan[] = useMemo(
    () => (chosenService && selection.audience && plans.data ? plansForSelection(selection.audience, chosenService, plans.data) : []),
    [chosenService, selection.audience, plans.data],
  );

  const chosenPlan = audiencePlans.find((plan) => plan.id === selection.planId) ?? null;
  const audienceLabel = FINDER_AUDIENCES.find((item) => item.id === selection.audience)?.label ?? '';

  const goTo = (next: number) => {
    setError(null);
    setStep(next);
  };

  const reset = () => {
    setSelection({});
    setError(null);
    setStep(1);
  };

  const next = () => {
    if (step === 1 && !selection.audience) return setError('Choose who needs assistance to continue.');
    if (step === 2 && !selection.serviceId) return setError('Choose a service to continue.');
    if (step === 3 && !selection.planId) return setError('Choose a plan, or request a custom quotation, to continue.');
    goTo(step + 1);
  };

  const finderMessage = () => {
    if (!chosenService) return whatsappMessages.general();
    if (chosenPlan) return whatsappMessages.finder(audienceLabel, chosenService.name, chosenPlan.name);
    return whatsappMessages.finder(audienceLabel, chosenService.name);
  };

  const dataError = services.error ?? plans.error;
  const dataLoading = services.loading || plans.loading;

  return (
    <div className={`${cardClass} p-6 sm:p-10`}>
      <ol className="mb-8 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em]" aria-label="Progress">
        {STEP_TITLES.map((title, index) => {
          const number = index + 1;
          const active = number === step;
          const done = number < step;
          return (
            <li
              key={title}
              aria-current={active ? 'step' : undefined}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${active ? 'bg-navy text-white' : done ? 'bg-ivory text-navy' : 'text-slate'}`}
            >
              <span>{number}</span>
              <span className="hidden sm:inline">{title.replace(/[.?]$/, '')}</span>
            </li>
          );
        })}
      </ol>

      <h2 className="font-display text-2xl font-bold text-navy">{STEP_TITLES[step - 1]}</h2>

      <div className="mt-6">
        {step === 1 && (
          <fieldset>
            <legend className="sr-only">Who needs assistance?</legend>
            <div className="grid gap-4 md:grid-cols-3">
              {FINDER_AUDIENCES.map((item) => (
                <OptionCard
                  key={item.id}
                  name="audience"
                  checked={selection.audience === item.id}
                  onChange={() => {
                    setError(null);
                    setSelection({ audience: item.id });
                  }}
                  title={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <>
            {dataLoading && <LoadingBlock label="Loading services" />}
            {dataError && !dataLoading && <ErrorBlock message={dataError} onRetry={() => { services.retry(); plans.retry(); }} />}
            {!dataLoading && !dataError && audienceServices.length === 0 && (
              <EmptyBlock
                title="No matching services are published yet"
                description="Send us a short message and we will confirm what we can help with."
                action={<WhatsAppLink context="finder-empty" message={whatsappMessages.general()} label="Message us on WhatsApp" />}
              />
            )}
            {!dataLoading && !dataError && audienceServices.length > 0 && (
              <fieldset>
                <legend className="sr-only">What service do you need?</legend>
                <div className="grid gap-4 md:grid-cols-2">
                  {audienceServices.map((service) => (
                    <OptionCard
                      key={service.id}
                      name="service"
                      checked={selection.serviceId === service.id}
                      onChange={() => {
                        setError(null);
                        setSelection((current) => ({ ...current, serviceId: service.id, planId: undefined }));
                      }}
                      title={service.name}
                      description={CATEGORY_LABELS[service.category]}
                      icon={<ServiceIcon iconKey={service.iconKey} className="size-5" />}
                    />
                  ))}
                </div>
              </fieldset>
            )}
          </>
        )}

        {step === 3 && chosenService && (
          <>
            <p className="mb-5 text-sm text-slate">
              You selected <span className="font-semibold text-ink">{chosenService.name}</span>. Choose the plan that fits best, or ask for a quotation.
            </p>
            <fieldset>
              <legend className="sr-only">Choose a plan or request a quotation</legend>
              <div className="grid gap-4 md:grid-cols-2">
                {audiencePlans.map((plan) => (
                  <OptionCard
                    key={plan.id}
                    name="plan"
                    checked={selection.planId === plan.id}
                    onChange={() => {
                      setError(null);
                      setSelection((current) => ({ ...current, planId: plan.id }));
                    }}
                    title={plan.name}
                    description={plan.targetCustomer}
                  />
                ))}
                <OptionCard
                  name="plan"
                  checked={selection.planId === CUSTOM_QUOTE}
                  onChange={() => {
                    setError(null);
                    setSelection((current) => ({ ...current, planId: CUSTOM_QUOTE }));
                  }}
                  title="Request a custom quotation"
                  description="Share your requirement and receive a tailored quote."
                />
              </div>
            </fieldset>
          </>
        )}

        {step === 4 && chosenService && (
          <div className="rounded-lg border border-line bg-ivory p-6">
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-slate">Audience</dt>
                <dd className="mt-1 font-semibold text-navy">{audienceLabel}</dd>
              </div>
              <div>
                <dt className="text-slate">Service</dt>
                <dd className="mt-1 font-semibold text-navy">{chosenService.name}</dd>
              </div>
              <div>
                <dt className="text-slate">Plan</dt>
                <dd className="mt-1 font-semibold text-navy">{chosenPlan ? chosenPlan.name : 'Custom quotation'}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-slate">
              WhatsApp opens with your selection filled in. You can edit the message before sending. We will confirm documents, scope and fees before any work begins.
            </p>
            <div className="mt-6">
              <WhatsAppLink context="finder-complete" message={finderMessage()} label="Continue on WhatsApp" className="w-full sm:w-auto" />
            </div>
            <p className="mt-4 text-xs text-slate">
              Please do not share PAN, Aadhaar numbers, OTPs or bank credentials in this conversation. We will explain the secure way to share documents.
            </p>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <div className="flex gap-3">
          {step > 1 && step < 4 && (
            <button type="button" onClick={() => goTo(step - 1)} className={buttonClass('secondary', '', 'sm')}>
              <ArrowLeft aria-hidden className="size-4" /> Back
            </button>
          )}
          {step > 1 && (
            <button type="button" onClick={reset} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate hover:text-navy ${focusRing}`}>
              <RotateCcw aria-hidden className="size-4" /> Reset selection
            </button>
          )}
        </div>
        {step < 4 && (
          <button
            type="button"
            onClick={next}
            disabled={(step === 2 && dataLoading) || (step === 2 && !!dataError)}
            className={buttonClass('primary', '', 'sm')}
          >
            Next <ArrowRight aria-hidden className="size-4" />
          </button>
        )}
        {step === 4 && (
          <Link to="/services" className={`text-sm font-semibold text-navy underline-offset-4 hover:underline ${focusRing}`}>
            Browse all services
          </Link>
        )}
      </div>
    </div>
  );
}

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { focusRing } from './styles';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

// Each panel is controlled by its button through aria-controls and aria-expanded.
export function Accordion({ items, defaultOpenId }: { items: AccordionItem[]; defaultOpenId?: string }) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const baseId = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={`flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-ink hover:text-navy ${focusRing}`}
              >
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden
                  className={`size-5 shrink-0 text-slate transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="pb-5 pr-8 text-[15px] leading-relaxed text-slate">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import type { ReactNode } from 'react';
import { containerClass, eyebrowClass, headingClass } from './styles';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: 'ivory' | 'white' | 'navy';
  children: ReactNode;
}

const toneClass = {
  ivory: 'bg-ivory text-ink',
  white: 'bg-white text-ink',
  navy: 'bg-navy text-white',
};

export function Section({ id, eyebrow, title, description, tone = 'ivory', children }: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section aria-labelledby={headingId} className={`py-16 sm:py-20 ${toneClass[tone]}`} id={id}>
      <div className={containerClass}>
        <header className="mb-10 max-w-2xl">
          {eyebrow && <p className={tone === 'navy' ? 'text-xs font-semibold uppercase tracking-[0.18em] text-gold' : eyebrowClass}>{eyebrow}</p>}
          <h2 id={headingId} className={`${headingClass} mt-3 text-3xl sm:text-4xl ${tone === 'navy' ? 'text-white' : 'text-navy'}`}>
            {title}
          </h2>
          {description && (
            <p className={`mt-4 text-base leading-relaxed sm:text-lg ${tone === 'navy' ? 'text-white/80' : 'text-slate'}`}>
              {description}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

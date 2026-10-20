import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { containerClass, eyebrowClass, headingClass } from './styles';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: Crumb[];
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, breadcrumbs, children }: PageHeroProps) {
  return (
    <section className="border-b border-line bg-white" aria-labelledby="page-title">
      <div className={`${containerClass} py-12 sm:py-16`}>
        <Breadcrumbs items={breadcrumbs} />
        {eyebrow && <p className={`${eyebrowClass} mt-6`}>{eyebrow}</p>}
        <h1 id="page-title" className={`${headingClass} mt-3 max-w-3xl text-4xl leading-[1.15] sm:text-5xl`}>
          {title}
        </h1>
        {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate sm:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  );
}

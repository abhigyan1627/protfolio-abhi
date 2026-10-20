import { Link } from 'react-router'
import { categoryStrip } from '../data/content'
import { fallbackIcon, iconMap } from './icons'

/** Service-category strip shown directly below the hero. */
export default function CategoryStrip() {
  return (
    <section aria-label="Service categories" className="border-b border-navy-900/10 bg-ivory-100">
      <ul className="container-page grid sm:grid-cols-2 lg:grid-cols-4">
        {categoryStrip.map(({ label, description, icon, to }) => {
          const Icon = iconMap[icon] ?? fallbackIcon
          return (
            <li
              key={label}
              className="border-t border-navy-900/10 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 lg:border-t-0 lg:border-l lg:first:border-l-0"
            >
              <Link to={to} className="group flex h-full items-start gap-4 py-7 sm:px-6 lg:px-8">
                <Icon className="mt-0.5 size-6 shrink-0 text-champagne-700" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-navy-900 transition-colors group-hover:text-champagne-700">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-charcoal-700">{description}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

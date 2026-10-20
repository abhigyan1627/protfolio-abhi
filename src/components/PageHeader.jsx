import { Link } from 'react-router'

/** Top banner for inner pages. Includes an optional breadcrumb trail for deeper pages. */
export default function PageHeader({ eyebrow, title, intro, breadcrumbs, children }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-900 text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg className="h-full w-full" preserveAspectRatio="xMaxYMid slice" viewBox="0 0 1440 480">
          <g fill="none" stroke="#d7bd84" strokeOpacity="0.12">
            <circle cx="1280" cy="120" r="200" />
            <path d="M0 400 L560 80 L1440 360" />
          </g>
        </svg>
      </div>
      <div className="container-page pt-36 pb-16 lg:pt-44 lg:pb-20">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ivory/70">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-champagne-300 hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ivory">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow text-champagne-300">{eyebrow}</p>}
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] font-medium text-ivory sm:text-6xl">
          {title}
        </h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80">{intro}</p>}
        {children}
      </div>
    </section>
  )
}

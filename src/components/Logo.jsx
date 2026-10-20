import { siteConfig } from '../config/siteConfig'

/** Navy monogram tile with a champagne keyline. Reads its letter from siteConfig.logo. */
export function Monogram({ letter, className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="9.25" fill="#0b1f3a" stroke="#d7bd84" strokeWidth="1.5" />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fill="#e6d3a3"
        style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600 }}
      >
        {letter}
      </text>
    </svg>
  )
}

/** Firm wordmark. `tone="light"` is for dark backgrounds, `tone="dark"` for light backgrounds. */
export default function Logo({ tone = 'dark', className = '' }) {
  const { logo } = siteConfig
  const wordColor = tone === 'light' ? 'text-ivory' : 'text-navy-900'
  const subtitleColor = tone === 'light' ? 'text-champagne-300' : 'text-champagne-700'

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {logo.image ? (
        <img src={logo.image} alt="" width="40" height="40" className="h-10 w-auto" />
      ) : (
        <Monogram letter={logo.monogram.slice(0, 1)} className="size-10 shrink-0" />
      )}
      <span className="flex flex-col leading-none">
        <span className={`font-display text-xl font-semibold tracking-[0.2em] ${wordColor}`}>{logo.wordmark}</span>
        <span className={`mt-1.5 text-[0.6rem] font-semibold tracking-[0.28em] uppercase ${subtitleColor}`}>
          {logo.subtitle}
        </span>
      </span>
    </span>
  )
}

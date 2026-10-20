import { Check } from 'lucide-react'

const BAR_HEIGHTS = [38, 56, 44, 70, 52, 84, 62, 78]
const LEDGER_WIDTHS = [82, 64, 90]
const CHECKLIST = ['Income details', 'Deduction records', 'Filing review']

/**
 * Decorative report composition for the hero: a stylised financial overview with an animated line
 * and bars, a document checklist card and fine geometric linework. It carries no figures or claims.
 */
export default function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="animate-fade-up relative rounded-sm border border-champagne-400/25 bg-navy-800/70 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between border-b border-ivory/10 pb-5">
          <div className="space-y-2.5">
            <span className="block h-2 w-28 rounded-full bg-ivory/70" />
            <span className="block h-2 w-16 rounded-full bg-ivory/25" />
          </div>
          <span className="rounded-sm border border-champagne-400/40 px-2.5 py-1 text-[0.65rem] tracking-[0.2em] text-champagne-300 uppercase">
            Overview
          </span>
        </div>

        <svg viewBox="0 0 400 180" className="mt-8 h-44 w-full" fill="none">
          <path d="M0 40H400M0 90H400M0 140H400" stroke="#f6f1e4" strokeOpacity="0.08" />
          <path
            pathLength="1"
            d="M0 150 C50 130 80 140 110 110 S170 70 210 85 S280 40 320 50 S380 20 400 14"
            stroke="#e6d3a3"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="draw-path animate-draw"
          />
          <circle cx="210" cy="85" r="4" fill="#d7bd84" />
          <circle cx="320" cy="50" r="4" fill="#d7bd84" />
        </svg>

        <div className="mt-6 grid h-28 grid-cols-8 items-end gap-3">
          {BAR_HEIGHTS.map((height, index) => (
            <span
              key={index}
              className="animate-grow block origin-bottom rounded-t-sm bg-champagne-400/70"
              style={{ height: `${height}%`, animationDelay: `${500 + index * 90}ms` }}
            />
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {LEDGER_WIDTHS.map((width, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="size-2 shrink-0 rounded-full bg-champagne-400" />
              <span className="h-2 rounded-full bg-ivory/20" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-up absolute -bottom-8 left-2 w-60 rounded-sm bg-ivory p-5 text-navy-900 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:-left-8 sm:w-64" style={{ animationDelay: '600ms' }}>
        <p className="font-display text-xl font-semibold">Document checklist</p>
        <ul className="mt-4 space-y-3 text-sm">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-navy-900 text-champagne-300">
                <Check className="size-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute -top-10 -right-6 size-36 rounded-full border border-champagne-400/20" />
    </div>
  )
}

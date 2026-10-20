import { getConfigWarnings } from '../utils/config'

/** Development-only notice listing configuration values that are still missing. Never shown in production. */
export default function DevConfigBanner() {
  if (!import.meta.env.DEV) return null

  const warnings = getConfigWarnings()
  if (warnings.length === 0) return null

  return (
    <aside
      role="status"
      aria-label="Development configuration notice"
      className="fixed bottom-4 left-4 z-40 max-w-xs rounded-sm border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 shadow-lg"
    >
      <p className="font-semibold">Development notice: configuration pending</p>
      <p className="mt-1">Still to configure: {warnings.join(', ')}. Edit src/config/siteConfig.js.</p>
    </aside>
  )
}

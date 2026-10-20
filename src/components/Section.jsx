const TONES = {
  ivory: 'bg-ivory text-charcoal-900',
  light: 'bg-ivory-100 text-charcoal-900',
  navy: 'on-dark bg-navy-900 text-ivory',
  deep: 'on-dark bg-navy-950 text-ivory',
}

/** Page section wrapper that sets background tone, vertical rhythm and the page gutter. */
export default function Section({ id, tone = 'ivory', labelledBy, className = '', children }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-20 lg:py-28 ${TONES[tone]} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  )
}

/** Shared eyebrow, heading and intro block used at the top of each section. */
export default function SectionHeading({ eyebrow, title, children, id, tone = 'light', align = 'left', as: Heading = 'h2' }) {
  const dark = tone === 'dark'
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className={`eyebrow ${dark ? 'text-champagne-300' : ''}`}>{eyebrow}</p>}
      <Heading id={id} className={`mt-4 text-4xl leading-[1.1] sm:text-5xl ${dark ? 'text-ivory' : ''}`}>
        {title}
      </Heading>
      {children && (
        <div className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? 'text-ivory/75' : 'text-charcoal-700'}`}>
          {children}
        </div>
      )}
    </div>
  )
}

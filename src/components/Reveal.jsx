import { useEffect, useRef, useState } from 'react'

function startsRevealed() {
  if (typeof window === 'undefined') return false
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reducedMotion || !('IntersectionObserver' in window)
}

/**
 * Fades its content in once it scrolls into view. Content is never hidden permanently: reduced-motion
 * visitors and browsers without IntersectionObserver see it immediately.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(startsRevealed)

  useEffect(() => {
    const node = ref.current
    if (visible || !node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

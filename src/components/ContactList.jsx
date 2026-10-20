import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '../config/siteConfig'

/** Renders only the contact details that have been configured, so no empty or placeholder rows appear. */
export default function ContactList({ tone = 'light' }) {
  const dark = tone === 'dark'
  const labelClass = dark ? 'text-champagne-300' : 'text-champagne-700'
  const textClass = dark ? 'text-ivory/85' : 'text-charcoal-900'
  const linkClass = `${textClass} underline-offset-4 hover:underline`

  const rows = []
  if (siteConfig.phone) {
    rows.push({
      key: 'phone',
      icon: Phone,
      label: 'Phone',
      value: <a className={linkClass} href={`tel:${siteConfig.phone.replace(/[\s()-]/g, '')}`}>{siteConfig.phone}</a>,
    })
  }
  if (siteConfig.email) {
    rows.push({
      key: 'email',
      icon: Mail,
      label: 'Email',
      value: <a className={linkClass} href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>,
    })
  }
  if (siteConfig.officeAddress) {
    rows.push({
      key: 'address',
      icon: MapPin,
      label: 'Office',
      value: <span className={textClass}>{siteConfig.officeAddress}</span>,
    })
  }
  const hours = siteConfig.businessHours.filter((item) => item.days)
  if (hours.length) {
    rows.push({
      key: 'hours',
      icon: Clock,
      label: 'Business hours',
      value: (
        <ul className={`space-y-1 ${textClass}`}>
          {hours.map((item) => (
            <li key={item.days}>
              {item.days}: {item.time || 'To be confirmed'}
            </li>
          ))}
        </ul>
      ),
    })
  }

  if (!rows.length) return null

  return (
    <dl className="grid gap-6 sm:grid-cols-2">
      {rows.map(({ key, icon: Icon, label, value }) => (
        <div key={key} className="flex gap-4">
          <Icon className={`mt-1 size-5 shrink-0 ${labelClass}`} aria-hidden="true" />
          <div>
            <dt className={`text-xs font-semibold tracking-[0.2em] uppercase ${labelClass}`}>{label}</dt>
            <dd className="mt-1 text-base leading-relaxed">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

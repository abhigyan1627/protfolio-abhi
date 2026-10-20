import { useState } from 'react'
import { Plus } from 'lucide-react'
import { faqs } from '../data/faqs'

/**
 * Accessible accordion. Each question is a button that controls its answer panel through aria-expanded and
 * aria-controls. Closed panels are made inert so their text is not read or focused.
 */
export default function FAQ({ items = faqs, limit }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null)
  const visible = limit ? items.slice(0, limit) : items

  return (
    <div className="divide-y divide-navy-900/10 border-y border-navy-900/10">
      {visible.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                id={`faq-button-${item.id}`}
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold text-navy-900 transition-colors hover:text-champagne-700"
              >
                {item.question}
                <Plus
                  className={`size-5 shrink-0 text-champagne-700 transition-transform duration-300 ease-out ${open ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              inert={!open}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-6 leading-relaxed text-charcoal-700">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

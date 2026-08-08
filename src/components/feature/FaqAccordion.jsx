import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiSearch } from 'react-icons/fi'

/**
 * Searchable FAQ list. Multiple answers can stay open at once, and the search
 * box filters on both the question and the answer body.
 *
 * `items`: [{ q, a, tag? }]
 */
export function FaqAccordion({ items, searchable = true, placeholder = 'Search questions…' }) {
  const [openIds, setOpenIds] = useState([0])
  const [query, setQuery] = useState('')

  const toggle = (index) =>
    setOpenIds((current) => (current.includes(index) ? current.filter((id) => id !== index) : [...current, index]))

  const term = query.trim().toLowerCase()
  const visible = items
    .map((item, index) => ({ ...item, index }))
    .filter((item) => !term || item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term))

  return (
    <div className="space-y-3">
      {searchable ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft focus-within:border-brand/50">
          <FiSearch className="shrink-0 text-lg text-muted" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="shrink-0 text-xs font-bold text-brand-ink hover:text-brand-strong"
            >
              Clear
            </button>
          ) : null}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-surface px-5 py-8 text-center text-sm font-semibold text-muted">
          No questions match “{query}”. Try a different keyword.
        </p>
      ) : null}

      {visible.map((item) => {
        const open = openIds.includes(item.index)
        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-2xl border bg-surface transition-colors ${
              open ? 'border-brand/40 shadow-soft' : 'border-line'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[15px] font-bold leading-snug text-ink">{item.q}</span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                  open ? 'rotate-45 border-brand-strong bg-brand-strong text-white' : 'border-line text-body'
                }`}
              >
                <FiPlus />
              </span>
            </button>

            {open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="border-t border-line px-5 py-4">
                  <p className="text-sm leading-relaxed text-body">{item.a}</p>
                  {item.tag ? (
                    <span className="mt-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-ink">
                      {item.tag}
                    </span>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

import { FiSearch, FiX } from 'react-icons/fi'
import { Container } from '../common/Container/Container'

/**
 * Sticky toolbar that sits under the page nav: category chips with live
 * counts, a search field, and an optional slot on the right for sort controls
 * or view toggles.
 *
 * `chips`: [{ label, count }]
 */
export function FilterBar({
  chips = [],
  active,
  onChange,
  query = '',
  onQuery,
  placeholder = 'Search…',
  right,
  className = '',
}) {
  return (
    <div
      className={`sticky top-[108px] z-30 border-b border-line bg-surface/95 backdrop-blur-xl lg:top-[116px] ${className}`}
    >
      <Container>
        <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          {chips.length ? (
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5">
              {chips.map((chip) => {
                const isActive = active === chip.label
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => onChange(chip.label)}
                    aria-pressed={isActive}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'border-brand-strong bg-brand-strong text-white shadow-brand'
                        : 'border-line bg-cream text-ink hover:border-brand/40 hover:bg-surface-2 dark:bg-cream-2'
                    }`}
                  >
                    {chip.label}
                    <span className={`ml-1.5 ${isActive ? 'text-white/75' : 'text-muted'}`}>{chip.count}</span>
                  </button>
                )
              })}
            </div>
          ) : null}

          <div className="flex shrink-0 items-center gap-2.5">
            {onQuery ? (
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2 focus-within:border-brand/50 lg:w-64 dark:bg-cream-2">
                <FiSearch className="shrink-0 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => onQuery(event.target.value)}
                  placeholder={placeholder}
                  className="w-full min-w-0 bg-transparent text-xs font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => onQuery('')}
                    aria-label="Clear search"
                    className="shrink-0 text-muted transition-colors hover:text-ink"
                  >
                    <FiX />
                  </button>
                ) : null}
              </div>
            ) : null}

            {right}
          </div>
        </div>
      </Container>
    </div>
  )
}

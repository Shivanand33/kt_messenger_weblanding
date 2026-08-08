import { useEffect, useRef, useState } from 'react'
import { Container } from '../common/Container/Container'

const SCROLL_OFFSET = 128

/**
 * Sticky in-page section switcher for the long feature pages. Highlights the
 * section currently under the header and scrolls to it with the right offset
 * so headings never hide behind the sticky chrome.
 *
 * `items`: [{ id, label, icon? }] — each `id` must match a section's id.
 */
export function PageNav({ items, className = '' }) {
  const [active, setActive] = useState(items[0]?.id)
  const railRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + SCROLL_OFFSET + 8
      let current = items[0]?.id
      items.forEach((item) => {
        const node = document.getElementById(item.id)
        if (node && node.offsetTop <= line) current = item.id
      })
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    // Lazy-loaded images shift section offsets after first paint, so recheck
    // whenever the layout changes rather than only on scroll.
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  // Keep the active chip visible inside the horizontal rail on small screens.
  useEffect(() => {
    const rail = railRef.current
    const chip = rail?.querySelector(`[data-chip="${active}"]`)
    if (!rail || !chip) return
    const target = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2
    rail.scrollTo({ left: Math.max(target, 0), behavior: 'smooth' })
  }, [active])

  const goTo = (id) => {
    const node = document.getElementById(id)
    if (!node) return
    window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET, behavior: 'smooth' })
  }

  return (
    <nav
      aria-label="Page sections"
      className={`sticky top-16 z-40 border-b border-line bg-cream/90 backdrop-blur-xl lg:top-[72px] ${className}`}
    >
      <Container>
        <div ref={railRef} className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-2">
          {items.map((item) => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                data-chip={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-strong text-white shadow-brand'
                    : 'text-body hover:bg-surface-2 hover:text-ink'
                }`}
              >
                {item.icon ? <span className="text-sm">{item.icon}</span> : null}
                {item.label}
              </button>
            )
          })}
        </div>
      </Container>
    </nav>
  )
}

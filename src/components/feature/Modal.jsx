import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

/**
 * Themed dialog used across the feature pages. Closes on Escape and on
 * backdrop click, locks background scrolling while open, and moves focus into
 * the panel so keyboard users land in the right place.
 *
 * Deliberately rendered with a plain conditional rather than AnimatePresence:
 * on this React version AnimatePresence leaves the exiting node mounted, and a
 * full-screen overlay stuck at opacity 0 silently swallows every click on the
 * page underneath. Entry is still animated; closing is immediate.
 */
export function Modal({ open, onClose, title, eyebrow, size = 'lg', children, footer }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-surface shadow-float outline-none sm:max-h-[88vh] sm:rounded-[28px] ${sizes[size]}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
          <div className="min-w-0">
            {eyebrow ? (
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-ink">{eyebrow}</span>
            ) : null}
            {title ? <h3 className="truncate text-lg font-extrabold text-ink">{title}</h3> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-body transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-line bg-cream px-5 py-4 sm:px-7 dark:bg-cream-2">{footer}</div>
        ) : null}
      </motion.div>
    </div>
  )
}

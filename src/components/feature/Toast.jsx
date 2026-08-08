import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'

const tones = {
  success: {
    icon: <FiCheckCircle />,
    ring: 'border-emerald-300 dark:border-emerald-500/35',
    accent: 'bg-emerald-500',
  },
  info: {
    icon: <FiInfo />,
    ring: 'border-brand/40',
    accent: 'bg-brand-strong',
  },
  warning: {
    icon: <FiAlertCircle />,
    ring: 'border-amber-300 dark:border-amber-500/35',
    accent: 'bg-amber-500',
  },
}

/**
 * Floating confirmation for simulated actions (money sent, order placed, note
 * saved). Dismisses itself after `duration` ms, and can be closed by hand.
 *
 * Rendered with a plain conditional rather than AnimatePresence — see the note
 * in Modal.jsx: an exiting node that never unmounts would leave an invisible
 * click target floating over the page.
 */
export function Toast({ message, tone = 'success', duration = 4000, onClose }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const style = tones[tone] ?? tones.success

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
      className="fixed inset-x-4 bottom-24 z-[70] mx-auto w-auto max-w-md sm:inset-x-auto sm:bottom-8 sm:left-1/2 sm:w-full sm:-translate-x-1/2"
    >
      <div
        className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-surface p-4 pl-5 shadow-float ${style.ring}`}
      >
        <span className={`absolute left-0 top-0 h-full w-1.5 ${style.accent}`} />
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-lg text-brand-ink">
          {style.icon}
        </span>
        <p className="flex-1 text-sm font-bold leading-snug text-ink">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <FiX />
        </button>
      </div>
    </motion.div>
  )
}

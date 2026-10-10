import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiMoon, FiSun, FiX } from 'react-icons/fi'
import { PreviewPhoneFrame } from './PreviewPhoneFrame'
import { PreviewNavContext } from './previewNav'
import { SCREENS } from './previewScreens'
import { useLanguage } from '../../../context/LanguageContext'
import { useTheme } from '../../../hooks/useTheme'

/** How long each screen holds before the tour moves on by itself. */
const AUTOPLAY_MS = 4600

/**
 * Full-screen prototype of the KT Messenger app, opened from the hero.
 *
 * Rendered through a portal so it is never clipped by the hero card, and so the
 * device sits above the page rather than inside the layout. Arrow keys, the
 * side buttons, the dots, a horizontal drag and the app's own tabs, rows and
 * back arrows all move between screens; the self-running tour stops the moment
 * the visitor takes over.
 */
export function MobilePreviewModal({ isOpen, onClose }) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  // Direction feeds the slide animation so going back slides the other way.
  const [direction, setDirection] = useState(1)
  const [auto, setAuto] = useState(true)
  // The phone has its own light/dark setting, seeded from the site's theme so
  // the prototype matches the page it opened over, then free to differ.
  const [skin, setSkin] = useState('light')
  // True once there is room beside the device for the title and buttons.
  const [floating, setFloating] = useState(false)
  const dockRef = useRef(null)

  const go = useCallback((next, manual = false) => {
    if (manual) setAuto(false)
    setDirection(next > 0 ? 1 : -1)
    setIndex((i) => (i + next + SCREENS.length) % SCREENS.length)
  }, [])

  // Read inside `jump` so the direction can be worked out without calling one
  // setter from inside another's updater — React runs updaters twice in
  // development, and the double `setDirection` left the screen switcher wedged.
  const indexRef = useRef(0)
  indexRef.current = index

  const jump = useCallback((to) => {
    setAuto(false)
    setDirection(to > indexRef.current ? 1 : -1)
    setIndex(to)
  }, [])

  /** What the tabs, rows and back arrows inside the phone call. */
  const goTo = useCallback(
    (key) => {
      const to = SCREENS.findIndex((s) => s.key === key)
      if (to >= 0) jump(to)
    },
    [jump],
  )

  const nav = useMemo(() => ({ goTo }), [goTo])

  // Every open starts the tour from the first screen, in the site's theme.
  useEffect(() => {
    if (isOpen) {
      setIndex(0)
      setDirection(1)
      setAuto(true)
      setSkin(theme === 'dark' ? 'dark' : 'light')
    }
  }, [isOpen, theme])

  // Keyboard: arrows walk the tour, Escape closes it.
  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1, true)
      else if (e.key === 'ArrowLeft') go(-1, true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, go])

  // Hold the page still behind the overlay.
  useEffect(() => {
    if (!isOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Self-running tour. Reduced-motion visitors drive it themselves.
  useEffect(() => {
    if (!isOpen || !auto || reduced) return undefined
    const timer = setTimeout(() => go(1), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [isOpen, auto, reduced, index, go])

  // Keep the active dot visible in the scrolling dock.
  useEffect(() => {
    const dot = dockRef.current?.querySelector('[data-active="true"]')
    if (dot) dot.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' })
  }, [index, reduced])

  // Above this width the title and the two buttons move out of the column and
  // float in the margins beside the device, which lets the handset run from the
  // very top of the overlay. Narrower than that there are no margins to float
  // into, so they stay in the flow above it.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined
    const mq = window.matchMedia('(min-width: 640px)')
    const sync = () => setFloating(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (!isOpen || typeof document === 'undefined') return null

  const current = SCREENS[index]
  const { Screen } = current

  // The outgoing screen keeps covering the incoming one until its exit ends, so
  // it gives up pointer events the moment it starts leaving — otherwise a quick
  // second tap would land on the screen that is on its way out.
  const slide = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, pointerEvents: 'auto' },
        exit: { opacity: 0, pointerEvents: 'none' },
      }
    : {
        initial: { opacity: 0, x: direction * 60, scale: 0.98 },
        animate: { opacity: 1, x: 0, scale: 1, pointerEvents: 'auto' },
        exit: { opacity: 0, x: direction * -60, scale: 0.98, pointerEvents: 'none' },
      }

  const chrome =
    'grid shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-3 py-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={
            floating
              ? 'absolute inset-x-4 top-3 z-20 flex items-center gap-2'
              : 'relative z-10 flex w-full max-w-[560px] shrink-0 items-center gap-2 pb-1.5'
          }
        >
          <p className="min-w-0 flex-1 truncate text-[14px] font-bold leading-none text-white">
            {t(current.label)}
            <span className="pl-2 text-[11px] font-medium tabular-nums text-white/45">
              {index + 1}/{SCREENS.length}
            </span>
          </p>

          {/* Icon only — the word beside it read as a second line in the round
              button and cost height the device could use. */}
          <button
            type="button"
            onClick={() => setSkin((s) => (s === 'dark' ? 'light' : 'dark'))}
            aria-label={skin === 'dark' ? t('Switch the app to light mode') : t('Switch the app to dark mode')}
            title={skin === 'dark' ? t('Switch the app to light mode') : t('Switch the app to dark mode')}
            className={`${chrome} h-9 w-9`}
          >
            {skin === 'dark' ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
          </button>

          <button type="button" onClick={onClose} aria-label={t('Close preview')} className={`${chrome} h-9 w-9`}>
            <FiX className="text-lg" />
          </button>
        </motion.div>

        {/* Device row */}
        <PreviewNavContext.Provider value={nav}>
          <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-6">
            <button
              type="button"
              onClick={() => go(-1, true)}
              aria-label={t('Previous screen')}
              className={`${chrome} h-9 w-9 text-lg sm:h-11 sm:w-11`}
            >
              <FiChevronLeft />
            </button>

            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.9, rotateX: 14 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 20, mass: 0.9 }}
              style={{
                width: floating ? 'min(480px, calc(45.5vh - 14px), 56vw)' : 'min(460px, calc(45.5vh - 32px), 68vw)',
                perspective: 1200,
              }}
              className="shrink-0"
            >
              {/* Brand glow, so the handset lifts off the dark backdrop */}
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-brand-strong/25 blur-3xl" />

              <PreviewPhoneFrame time={current.time} tone={current.tone} skin={skin}>
                {/* Drag lives on a stable wrapper, the slide on the keyed child.
                    Putting both on one element lets the drag's own x motion value
                    swallow the enter animation, which leaves each screen parked
                    at opacity 0. */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.14}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -55) go(1, true)
                    else if (info.offset.x > 55) go(-1, true)
                  }}
                  className="relative h-full w-full"
                >
                  {/* The outgoing and incoming screens overlap while they cross,
                      which reads as one slide. "wait" mode was tried first and
                      would strand the new screen whenever an exit did not
                      report finishing, leaving the phone on the old one. */}
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={current.key}
                      {...slide}
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Screen />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </PreviewPhoneFrame>
            </motion.div>

            <button
              type="button"
              onClick={() => go(1, true)}
              aria-label={t('Next screen')}
              className={`${chrome} h-9 w-9 text-lg sm:h-11 sm:w-11`}
            >
              <FiChevronRight />
            </button>
          </div>
        </PreviewNavContext.Provider>

        {/* Dock: one dot per screen. The name moved up into the header row. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          ref={dockRef}
          className="relative z-10 flex w-full max-w-[560px] shrink-0 items-center justify-center gap-1.5 overflow-x-auto pt-2.5"
        >
          {SCREENS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              data-active={i === index}
              onClick={() => jump(i)}
              aria-label={t(s.label)}
              aria-current={i === index}
              className={`h-1.5 shrink-0 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  )
}

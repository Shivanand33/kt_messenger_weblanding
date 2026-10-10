import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiChevronRight, FiSearch, FiUsers } from 'react-icons/fi'
import { BsFillChatFill, BsNewspaper, BsPlayBtnFill, BsTelephoneFill, BsGearFill } from 'react-icons/bs'
import { img, imgAltOnly } from '../../../utils/imageOverrides'
import { useLanguage } from '../../../context/LanguageContext'
import { usePreviewNav } from './previewNav'

/** The app's accent. It is the one colour that does not change with the skin. */
export const BLUE = '#0a7cff'

const TONES = {
  sky: 'bg-[#2d8cff]',
  violet: 'bg-[#8b5cf6]',
  purple: 'bg-[#a855f7]',
  amber: 'bg-[#f59e0b]',
  orange: 'bg-[#f97316]',
  teal: 'bg-[#14b8a6]',
  emerald: 'bg-[#10b981]',
  slate: 'bg-[#64748b]',
}

/* ------------------------------------------------------------------ motion */

/**
 * Rows fade up one after another when a screen arrives. Written as variants on
 * a parent so a screen only has to wrap its list in <Stagger> and mark each row
 * with <Item>; the delay bookkeeping stays here.
 */
const listVariants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
}

export function Stagger({ className = '', children, ...rest }) {
  return (
    <motion.div variants={listVariants} initial="hidden" animate="shown" className={className} {...rest}>
      {children}
    </motion.div>
  )
}

export function Item({ className = '', children, ...rest }) {
  return (
    <motion.div variants={itemVariants} className={className} {...rest}>
      {children}
    </motion.div>
  )
}

/**
 * Steps 0,1,…,steps-1 every `ms`, which is how the screens keep something
 * moving without each one owning a timer. Parked on step 0 for visitors who
 * asked for reduced motion.
 */
export function useTick(ms, steps) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduced || steps < 2) return undefined
    const timer = setInterval(() => {
      if (document.hidden) return // a backgrounded tab holds its place
      setStep((s) => (s + 1) % steps)
    }, ms)
    return () => clearInterval(timer)
  }, [ms, steps, reduced])

  return step
}

/** A running call duration, formatted mm:ss. */
export function useCallTimer(startSeconds = 0) {
  const reduced = useReducedMotion()
  const [seconds, setSeconds] = useState(startSeconds)

  useEffect(() => {
    if (reduced) return undefined
    const timer = setInterval(() => {
      if (document.hidden) return
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [reduced])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

/* ------------------------------------------------------------------- atoms */

/**
 * Wraps a row that actually goes somewhere. Without a destination it renders a
 * plain div, so decorative rows cost nothing and never trap the keyboard.
 */
export function Tap({ to, onTap, className = '', style, label, children }) {
  const { goTo } = usePreviewNav()
  if (!to && !onTap) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  const fire = () => (onTap ? onTap() : goTo(to))

  // A div with button semantics rather than a real <button>: these rows nest
  // headings, paragraphs and images, which a <button> may not legally contain.
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      style={style}
      onClick={fire}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          fire()
        }
      }}
      className={`${className} cursor-pointer transition-[background-color,transform] duration-150 active:scale-[0.985] active:bg-[var(--p-surface2)]`}
    >
      {children}
    </div>
  )
}

/**
 * A contact tile: a photo when the demo cast has one, otherwise the initials
 * badge the app falls back to. `group` draws the multi-person glyph used for
 * group threads that have no picture set.
 */
export function Avatar({ src, initials, tone = 'slate', group = false, size = 44, ring = false, className = '' }) {
  const style = { width: size, height: size }
  const shell = `shrink-0 overflow-hidden rounded-full ${ring ? 'ring-2 ring-[var(--p-surface)]' : ''} ${className}`

  if (src) {
    return <img src={img(src)} alt={imgAltOnly(src)} loading="lazy" style={style} className={`${shell} object-cover`} />
  }
  if (group) {
    return (
      <span style={style} className={`${shell} grid place-items-center bg-[#2d8cff] text-white`}>
        <FiUsers style={{ fontSize: size * 0.44 }} />
      </span>
    )
  }
  return (
    <span
      style={style}
      className={`${shell} grid place-items-center ${TONES[tone] || TONES.slate} font-bold text-white`}
    >
      <span style={{ fontSize: size * 0.36 }}>{initials}</span>
    </span>
  )
}

/** Unread / count pill used by chat rows and channels. */
export function Badge({ value, pulse = false, className = '' }) {
  return (
    <motion.span
      animate={pulse ? { scale: [1, 1.14, 1] } : undefined}
      transition={pulse ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
      className={`grid h-[19px] min-w-[19px] place-items-center rounded-full px-1 text-[10px] font-bold text-white ${className}`}
      style={{ background: BLUE }}
    >
      {value}
    </motion.span>
  )
}

/** Large page title in the app's header style, with optional trailing icons. */
export function ScreenTitle({ title, right = null, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-2 px-5 pb-2 pt-12 ${className}`}>
      <h3 className="min-w-0 truncate text-[18px] font-bold leading-none tracking-tight text-[var(--p-text)]">
        {title}
      </h3>
      {right ? <div className="flex shrink-0 items-center gap-3.5 text-[16px] text-[var(--p-text)]">{right}</div> : null}
    </div>
  )
}

/** Back-arrow header used by every settings sub-screen. `to` makes it work. */
export function BackHeader({ title, icon, to, className = '' }) {
  const { goTo } = usePreviewNav()
  return (
    <div className={`flex items-center gap-3 px-4 pb-3 pt-12 ${className}`}>
      <button
        type="button"
        aria-label={`Back from ${title}`}
        onClick={() => to && goTo(to)}
        className="shrink-0 cursor-pointer text-[22px] text-[var(--p-text)] transition-opacity active:opacity-50"
      >
        {icon}
      </button>
      <h3 className="min-w-0 text-[14.5px] font-semibold leading-tight tracking-tight text-[var(--p-text)]">{title}</h3>
    </div>
  )
}

/** The rounded search field that sits under most list headers. */
export function SearchField({ placeholder, trailing = null, to }) {
  return (
    <Tap
      to={to}
      label={placeholder}
      className="mx-4 flex items-center rounded-full bg-[var(--p-surface)] px-3.5 py-2.5 shadow-[0_1px_2px_rgba(2,6,23,0.06)]"
    >
      <span className="flex w-full items-center gap-2.5">
        <FiSearch className="shrink-0 text-[15px] text-[var(--p-text2)]" />
        <span className="flex-1 truncate text-left text-[13px] text-[var(--p-text2)]">{placeholder}</span>
        {trailing}
      </span>
    </Tap>
  )
}

/** Grouped settings card, matching the app's inset list style. */
export function Group({ label, children, className = '' }) {
  return (
    <div className={className}>
      {label ? (
        <p className="px-6 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text3)]">
          {label}
        </p>
      ) : null}
      <div className="mx-3 overflow-hidden rounded-2xl bg-[var(--p-surface)]">{children}</div>
    </div>
  )
}

/** One row inside a <Group>: coloured icon tile, title, optional subtitle. */
export function SettingsRow({ icon, tone = 'bg-[#2d8cff]', title, subtitle, divider = true, chevron = true, to }) {
  return (
    <Tap to={to} label={title} className="flex w-full items-center gap-3 pl-3">
      {icon ? (
        <span className={`grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg text-[15px] text-white ${tone}`}>
          {icon}
        </span>
      ) : null}
      <span
        className={`flex min-w-0 flex-1 items-center gap-2 py-2.5 pr-3 ${divider ? 'border-b border-[var(--p-line2)]' : ''}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium leading-tight text-[var(--p-text)]">{title}</span>
          {subtitle ? (
            <span className="block truncate pt-[2px] text-[11px] leading-tight text-[var(--p-text3)]">{subtitle}</span>
          ) : null}
        </span>
        {chevron ? <FiChevronRight className="shrink-0 text-[15px] text-[var(--p-text4)]" /> : null}
      </span>
    </Tap>
  )
}

/** Radio row for the privacy and lock screens. */
export function RadioRow({ label, hint, checked, divider = true, filled = true }) {
  return (
    <div className="flex items-center gap-3 pl-4">
      <span
        className={`grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border-2 ${
          checked ? 'border-transparent' : 'border-[var(--p-border)]'
        }`}
        style={checked ? { background: filled ? BLUE : 'transparent', borderColor: BLUE } : undefined}
      >
        {checked ? <span className={`h-[7px] w-[7px] rounded-full ${filled ? 'bg-white' : ''}`} /> : null}
      </span>
      <div className={`min-w-0 flex-1 py-3 pr-4 ${divider ? 'border-b border-[var(--p-line2)]' : ''}`}>
        <p className="truncate text-[14px] font-medium leading-tight text-[var(--p-text)]">{label}</p>
        {hint ? <p className="truncate pt-[2px] text-[11px] leading-tight text-[var(--p-text3)]">{hint}</p> : null}
      </div>
    </div>
  )
}

/** iOS-style switch. Flips on tap, so the control is not just a picture. */
export function Switch({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`relative inline-flex h-[20px] w-[34px] shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        on ? '' : 'bg-[var(--p-border)]'
      }`}
      style={on ? { background: BLUE } : undefined}
    >
      <span
        className={`absolute h-[16px] w-[16px] rounded-full bg-white shadow transition-all duration-200 ${
          on ? 'left-[16px]' : 'left-[2px]'
        }`}
      />
    </button>
  )
}

/* ------------------------------------------------------------------ tabbar */

// Five tabs, not six: Updates was dropped from the bar. The Updates screen is
// still in the tour — reached from the arrows, the dots and the status rail —
// it just no longer owns a tab, so nothing lights up while you are on it.
const TABS = [
  { key: 'chats', icon: BsFillChatFill, label: 'Chats', badge: 21 },
  { key: 'news', icon: BsNewspaper, label: 'News', dot: true },
  { key: 'minis', icon: BsPlayBtnFill, label: 'Minis' },
  { key: 'calls', icon: BsTelephoneFill, label: 'Calls' },
  { key: 'settings', icon: BsGearFill, label: 'Settings' },
]

/**
 * The floating tab bar. It overlays the list rather than sitting below it, so
 * content scrolls underneath the frosted pill exactly as it does in the app —
 * and every tab really switches the prototype to that screen.
 */
export function TabBar({ active }) {
  const { t } = useLanguage()
  const { goTo } = usePreviewNav()

  return (
    <div className="absolute inset-x-2 bottom-[13px] z-30">
      {/* Frosted glass, the way the platform draws it: a mostly transparent
          fill over a heavy blur, the colours behind pushed a little so they
          still read through, a hairline rim, and light falling across the top
          edge. The fill has to stay this sheer — an opaque bar blurs nothing. */}
      <div className="relative overflow-hidden rounded-[24px] bg-[var(--p-glass)] shadow-[0_10px_30px_-10px_rgba(2,6,23,0.4),0_2px_10px_-4px_rgba(2,6,23,0.25)] ring-1 ring-inset ring-[var(--p-glass-edge)] backdrop-blur-2xl backdrop-saturate-150">
        {/* Light pooling at the top of the pane, falling off downwards */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, var(--p-glass-sheen), transparent 62%)', opacity: 0.5 }}
        />
        {/* Specular line along the very top edge */}
        <span
          className="pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, var(--p-glass-sheen), transparent)' }}
        />

        <div className="relative flex items-stretch justify-between p-1">
          {TABS.map(({ key, icon: Icon, label, badge, dot }) => {
            const on = key === active
            const ink = on ? BLUE : 'var(--p-text-mid)'
            return (
              <button
                key={key}
                type="button"
                onClick={() => goTo(key)}
                aria-label={t(label)}
                aria-current={on}
                className="relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-[18px] py-[5px] transition-transform active:scale-90"
                // The selected tab is its own small pane of tinted glass rather
                // than a flat chip, so it belongs to the bar it sits in.
                style={
                  on
                    ? { background: `${BLUE}24`, boxShadow: `inset 0 0 0 1px ${BLUE}2e, inset 0 1px 0 0 ${BLUE}1f` }
                    : undefined
                }
              >
                <span className="relative grid h-[16px] place-items-center">
                  <Icon className="text-[15px]" style={{ color: ink }} />
                  {badge ? (
                    <span
                      className="absolute -right-[9px] -top-[5px] grid h-[14px] min-w-[14px] place-items-center rounded-full px-[3.5px] text-[8px] font-bold leading-none text-white shadow-[0_1px_3px_rgba(2,6,23,0.4)] ring-[1.5px] ring-[var(--p-glass-edge)]"
                      style={{ background: BLUE }}
                    >
                      {badge}
                    </span>
                  ) : null}
                  {dot ? (
                    <span
                      className="absolute -right-[4px] -top-[2px] h-[6px] w-[6px] rounded-full ring-[1.5px] ring-[var(--p-glass-edge)]"
                      style={{ background: BLUE }}
                    />
                  ) : null}
                </span>
                <span className="text-[8.5px] font-semibold leading-none tracking-tight" style={{ color: ink }}>
                  {t(label)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

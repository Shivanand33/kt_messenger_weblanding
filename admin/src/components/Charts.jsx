import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Inbox, Maximize2, X } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
} from 'recharts'
import './Charts.css'

/* ══════════════════════════════════════════════════════════════════════════
   NOTHING IN THIS FILE INVENTS DATA.
   Every number rendered comes out of the `data` prop the caller handed in.
   Where a series is reshaped (e.g. one day's row turned into two bars) the
   values are copied straight across — no defaults, no samples, no filler.
   When there is nothing to plot an empty state is rendered instead.
   ══════════════════════════════════════════════════════════════════════════ */

// Type guard only — keeps a missing/non-numeric field from rendering NaN.
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)

const fmtNum = (v) =>
  typeof v === 'number' && Number.isFinite(v) ? v.toLocaleString() : v == null ? '—' : String(v)

// Short axis labels: 1200 -> 1.2k, 0.5 -> 0.5, 12 -> 12
const fmtAxis = (v) => {
  if (!Number.isFinite(v)) return ''
  if (Math.abs(v) >= 1e6) return `${+(v / 1e6).toFixed(1)}M`
  if (Math.abs(v) >= 1e3) return `${+(v / 1e3).toFixed(1)}k`
  return `${+v.toFixed(2)}`
}

/**
 * Pick a readable axis top + tick set for a set of real values.
 * Keeps a lone data point from floating in a huge empty grid: the top of the
 * axis tracks the largest real value (plus ~12% headroom) instead of some
 * fixed ceiling. Integer-only series get integer ticks.
 */
function axisScale(values, desiredTicks = 4) {
  const nums = (values || []).filter((v) => typeof v === 'number' && Number.isFinite(v))
  const max = nums.length ? nums.reduce((m, v) => (v > m ? v : m), -Infinity) : 0
  // Nothing positive to scale against: the smallest honest axis, no invented ceiling.
  if (!Number.isFinite(max) || max <= 0) return { top: 1, ticks: [0, 1] }

  const integral = nums.every((v) => Number.isInteger(v))
  const headroom = max * 1.12
  const raw = headroom / desiredTicks
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const n = raw / mag
  let step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag
  if (integral) step = Math.max(1, Math.round(step))

  const top = Math.ceil(headroom / step) * step
  const ticks = []
  for (let t = 0; t <= top + step / 1000; t += step) ticks.push(Math.round(t * 1000) / 1000)
  return { top: Math.round(top * 1000) / 1000, ticks }
}

/* ── Theme tokens ────────────────────────────────────────────────────────────
   Recharts writes colours into SVG presentation attributes, which do not
   resolve `var(--x)`. So the admin theme's CSS custom properties are read once
   at mount and re-read whenever <html data-theme> flips. Nothing here is a
   theme colour of its own — the fallbacks only cover a pre-paint read.
   ───────────────────────────────────────────────────────────────────────── */
const TOKEN_VARS = {
  surface: '--surface',
  surface2: '--surface-2',
  ink: '--ink',
  body: '--body',
  muted: '--muted',
  line: '--line',
  lineStrong: '--line-strong',
  brand: '--brand',
  brandStrong: '--brand-strong',
  success: '--success',
  warn: '--warn',
  purple: '--purple',
  danger: '--danger',
}

const TOKEN_FALLBACK = {
  surface: '#ffffff',
  surface2: '#f1f5f9',
  ink: '#0f172a',
  body: '#334155',
  muted: '#64748b',
  line: '#e2e8f0',
  lineStrong: '#cbd5e1',
  brand: '#2563eb',
  brandStrong: '#1d4ed8',
  success: '#10b981',
  warn: '#f59e0b',
  purple: '#8b5cf6',
  danger: '#ef4444',
  dark: false,
}

function readThemeTokens() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return TOKEN_FALLBACK
  const root = document.documentElement
  const cs = window.getComputedStyle(root)
  const out = { ...TOKEN_FALLBACK, dark: root.getAttribute('data-theme') === 'dark' }
  for (const key of Object.keys(TOKEN_VARS)) {
    const value = cs.getPropertyValue(TOKEN_VARS[key]).trim()
    if (value) out[key] = value
  }
  return out
}

const sameTokens = (a, b) =>
  Boolean(a) && Boolean(b) && a.dark === b.dark && Object.keys(TOKEN_VARS).every((k) => a[k] === b[k])

function useThemeTokens() {
  const [tokens, setTokens] = useState(readThemeTokens)

  useEffect(() => {
    // Keep the same object when nothing actually changed — a fresh identity
    // would restart every recharts entry animation for no reason.
    const sync = () => setTokens((prev) => {
      const next = readThemeTokens()
      return sameTokens(prev, next) ? prev : next
    })

    sync()
    if (typeof MutationObserver === 'undefined') return undefined
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return tokens
}

// React's useId contains ':' — strip it so it is safe inside url(#…).
const useSafeId = (prefix) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`

/* ── Shared pieces ───────────────────────────────────────────────────────── */

// Bars are painted with SVG gradients, so recharts hands the tooltip a
// `url(#…)` reference that CSS cannot use as a swatch. Fall back to the row's
// own colour, then to the chart's colour.
function swatchColor(entry, fallback) {
  for (const candidate of [entry.color, entry.fill, entry.payload?.color, entry.payload?.fill]) {
    if (typeof candidate === 'string' && candidate && !candidate.startsWith('url(')) return candidate
  }
  return fallback
}

function ChartTooltip({ active, payload, label, fallbackColor }) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null
  return (
    <div className="ktc-tip">
      {label !== undefined && label !== null && label !== '' ? (
        <div className="ktc-tip-label">{label}</div>
      ) : null}
      <div className="ktc-tip-rows">
        {payload.map((entry, index) => (
          <div className="ktc-tip-row" key={`${entry.dataKey ?? entry.name ?? 'row'}-${index}`}>
            <span
              className="ktc-tip-dot"
              style={{ background: swatchColor(entry, fallbackColor) }}
            />
            <span className="ktc-tip-name">{entry.name}</span>
            <span className="ktc-tip-val">{fmtNum(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartEmptyState({ message = 'No data recorded yet', hint }) {
  return (
    <div className="ktc-empty">
      <span className="ktc-empty-icon" aria-hidden="true">
        <Inbox size={22} strokeWidth={1.8} />
      </span>
      <p className="ktc-empty-msg">{message}</p>
      {hint ? <p className="ktc-empty-hint">{hint}</p> : null}
    </div>
  )
}

// 7D / 30D / 90D range pills. Rendered in the card header AND in the
// full-screen header, so switching range works from either place.
function RangePills({ range, onRangeChange, options = [7, 30, 90] }) {
  if (typeof onRangeChange !== 'function') return null
  return (
    <div className="pill-selector ktc-pills" role="group" aria-label="Select date range">
      {options.map((days) => (
        <button
          key={days}
          type="button"
          className={`pill-btn ${range === days ? 'active' : ''}`}
          aria-pressed={range === days}
          onClick={() => onRangeChange(days)}
        >
          {days}D
        </button>
      ))}
    </div>
  )
}

// Y-axis category tick that truncates long labels but keeps the full text in
// a native tooltip (search queries and event names can be long).
function CategoryTick({ x, y, payload, fill, maxChars = 22 }) {
  const raw = String(payload?.value ?? '')
  const text = raw.length > maxChars ? `${raw.slice(0, maxChars - 1)}…` : raw
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{raw}</title>
      <text x={-10} y={0} dy={4} textAnchor="end" fill={fill} fontSize={12} fontWeight={600}>
        {text}
      </text>
    </g>
  )
}

/**
 * Card shell shared by every chart: header, optional toolbar + legend, and the
 * expand / full-screen behaviour.
 *
 * `children` is a render prop called with `{ expanded }` so a chart can breathe
 * differently in full screen (denser ticks, thicker bars, bigger donut).
 */
function ChartFrame({
  title,
  subtitle,
  toolbar = null,
  legend = null,
  height = 300,
  bodyClassName = '',
  className = '',
  children,
}) {
  const [expanded, setExpanded] = useState(false)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const heading = title || 'Chart'

  const close = useCallback(() => setExpanded(false), [])

  useEffect(() => {
    if (!expanded || typeof document === 'undefined') return undefined

    const body = document.body
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      window.clearTimeout(focusTimer)
      body.style.overflow = previousOverflow
      // Send focus back to the expand button that opened this view.
      if (typeof triggerRef.current?.focus === 'function') triggerRef.current.focus()
    }
  }, [expanded, close])

  const renderHeader = (fullscreen) => (
    <div className="ktc-header">
      <div className="ktc-heading">
        <h3 className="ktc-title">{heading}</h3>
        {subtitle ? <p className="ktc-subtitle">{subtitle}</p> : null}
      </div>
      <div className="ktc-actions">
        {toolbar}
        {fullscreen ? (
          <button
            ref={closeRef}
            type="button"
            className="ktc-iconbtn ktc-iconbtn-close"
            onClick={close}
            aria-label={`Close the full screen view of ${heading}`}
            title="Close (Esc)"
          >
            <X size={17} strokeWidth={2.3} aria-hidden="true" />
          </button>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            className="ktc-iconbtn"
            onClick={() => setExpanded(true)}
            aria-label={`Expand ${heading} to full screen`}
            aria-haspopup="dialog"
            aria-expanded={expanded}
            title="Full screen"
          >
            <Maximize2 size={15} strokeWidth={2.3} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className={`card chart-card ktc-card ${className}`.trim()}>
        {renderHeader(false)}
        {legend}
        <div className={`ktc-body ${bodyClassName}`.trim()} style={{ height }}>
          {children({ expanded: false })}
        </div>
      </div>

      {expanded && typeof document !== 'undefined'
        ? createPortal(
            <div className="ktc-overlay" role="dialog" aria-modal="true" aria-label={`${heading} — full screen`}>
              <div className="ktc-backdrop" onClick={close} aria-hidden="true" />
              <div className="ktc-panel" ref={panelRef}>
                {renderHeader(true)}
                {legend}
                <div className={`ktc-body ktc-body-full ${bodyClassName}`.trim()}>
                  {children({ expanded: true })}
                </div>
                <p className="ktc-hint">
                  Press <kbd>Esc</kbd> or click outside to exit full screen
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

/* ── Sparkline (stat cards) ──────────────────────────────────────────────── */

/**
 * Draws only what it is given — never a placeholder curve. Two points are the
 * minimum: with one the x-step (idx / length - 1) divides by zero and every
 * coordinate comes out NaN.
 */
export function Sparkline({ data = [], color, isPositive = true }) {
  const t = useThemeTokens()
  const gid = useSafeId('ktspark')

  if (!Array.isArray(data) || data.length < 2) return null

  const values = data.map(num)
  const max = Math.max(values.reduce((m, v) => (v > m ? v : m), -Infinity), 1)
  const min = Math.min(values.reduce((m, v) => (v < m ? v : m), Infinity), 0)
  const range = max - min || 1

  const coords = values.map((val, idx) => ({
    x: (idx / (values.length - 1)) * 90 + 5,
    y: 32 - ((val - min) / range) * 24,
  }))
  const points = coords.map((p) => `${p.x},${p.y}`).join(' ')
  const last = coords[coords.length - 1]

  const strokeColor = color || (isPositive ? t.success : t.danger)

  return (
    <svg className="sparkline-svg ktc-spark" width="96" height="36" viewBox="0 0 100 36" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.34" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`5,35 ${points} 95,35`} fill={`url(#${gid})`} />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="2.6" fill={strokeColor} stroke={t.surface} strokeWidth="1.6" />
    </svg>
  )
}

/* ── Area chart: traffic & engagement over time ──────────────────────────── */

// One day's real row reshaped into two labelled bars. Both numbers are copied
// straight out of that row — this branch adds nothing of its own.
function SingleDayView({ row, series, tokens, gid, expanded }) {
  const bars = series.map((s) => ({ name: s.name, value: num(row[s.key]), color: s.color }))
  const scale = axisScale(bars.map((b) => b.value))

  return (
    <div className="ktc-single">
      <div className="ktc-single-head">
        <span className="ktc-daychip">{row.date}</span>
        <span className="ktc-single-note">
          One day recorded so far — the trend line appears as soon as a second day lands.
        </span>
      </div>
      <div className="ktc-single-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={bars}
            margin={{ top: 6, right: 56, left: 4, bottom: 4 }}
            barCategoryGap={expanded ? '42%' : '30%'}
          >
            <defs>
              {bars.map((b, i) => (
                <linearGradient key={b.name} id={`${gid}-day-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={b.color} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={b.color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid horizontal={false} strokeDasharray="4 8" stroke={tokens.line} />
            <XAxis
              type="number"
              domain={[0, scale.top]}
              ticks={scale.ticks}
              tickFormatter={fmtAxis}
              tick={{ fill: tokens.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              height={24}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={expanded ? 130 : 100}
              tick={<CategoryTick fill={tokens.body} maxChars={expanded ? 26 : 16} />}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: tokens.surface2, opacity: 0.55 }}
              content={<ChartTooltip fallbackColor={tokens.brand} />}
            />
            <Bar
              dataKey="value"
              name="Count"
              radius={[4, 12, 12, 4]}
              barSize={expanded ? undefined : 26}
              maxBarSize={expanded ? 76 : 26}
              animationDuration={850}
              animationEasing="ease-out"
            >
              {bars.map((b, i) => (
                <Cell key={b.name} fill={`url(#${gid}-day-${i})`} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                offset={12}
                formatter={fmtNum}
                fill={tokens.ink}
                fontSize={13}
                fontWeight={800}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function AreaChartCard({ title, subtitle, data, range, onRangeChange }) {
  const t = useThemeTokens()
  const gid = useSafeId('ktarea')

  // Only ever plots the rows it is handed. No placeholder series.
  const chartData = Array.isArray(data) ? data : []

  const series = useMemo(
    () => [
      { key: 'PageViews', name: 'Page Views', color: t.brand },
      { key: 'Downloads', name: 'Downloads', color: t.success },
    ],
    [t.brand, t.success],
  )

  // Sums of the real rows — derived totals, nothing invented.
  const totals = series.map((s) => chartData.reduce((sum, row) => sum + num(row[s.key]), 0))
  const scale = axisScale(chartData.flatMap((row) => series.map((s) => num(row[s.key]))))

  const legend =
    chartData.length > 0 ? (
      <div className="ktc-legend">
        {series.map((s, i) => (
          <span className="ktc-chip" key={s.key}>
            <span className="ktc-chip-dot" style={{ background: s.color }} />
            <span className="ktc-chip-name">{s.name}</span>
            <span className="ktc-chip-val">{fmtNum(totals[i])}</span>
          </span>
        ))}
        <span className="ktc-chip ktc-chip-quiet">
          <span className="ktc-chip-name">
            {chartData.length === 1 ? '1 day' : `${chartData.length} days`}
          </span>
        </span>
      </div>
    ) : null

  return (
    <ChartFrame
      title={title || 'Traffic & Engagement Metrics'}
      subtitle={subtitle}
      toolbar={<RangePills range={range} onRangeChange={onRangeChange} />}
      legend={legend}
      height={300}
    >
      {({ expanded }) => {
        if (chartData.length === 0) {
          return (
            <ChartEmptyState
              message="No page views or downloads recorded yet"
              hint="Traffic appears here as soon as the site starts reporting events."
            />
          )
        }

        if (chartData.length === 1) {
          return (
            <SingleDayView
              row={chartData[0]}
              series={series}
              tokens={t}
              gid={`${gid}-${expanded ? 'fs' : 'in'}`}
              expanded={expanded}
            />
          )
        }

        const maxLabels = expanded ? 16 : 8
        const xInterval =
          chartData.length <= maxLabels ? 0 : Math.ceil(chartData.length / maxLabels) - 1
        const dotLimit = expanded ? 24 : 14
        const dotFor = (color) =>
          chartData.length <= dotLimit
            ? {
                r: chartData.length <= 8 ? 4 : 3,
                fill: t.surface,
                stroke: color,
                strokeWidth: 2.2,
              }
            : false

        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 14, right: 16, left: 0, bottom: 0 }}>
              <defs>
                {series.map((s, i) => (
                  <linearGradient
                    key={s.key}
                    id={`${gid}-${expanded ? 'fs' : 'in'}-fill-${i}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.42} />
                    <stop offset="55%" stopColor={s.color} stopOpacity={0.13} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="4 8" vertical={false} stroke={t.line} />
              <XAxis
                dataKey="date"
                tick={{ fill: t.muted, fontSize: 11.5 }}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={xInterval}
                minTickGap={6}
              />
              <YAxis
                domain={[0, scale.top]}
                ticks={scale.ticks}
                tickFormatter={fmtAxis}
                width={44}
                tick={{ fill: t.muted, fontSize: 11.5 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: t.lineStrong, strokeWidth: 1.5, strokeDasharray: '4 5' }}
              />
              {series.map((s, i) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2.6}
                  fill={`url(#${gid}-${expanded ? 'fs' : 'in'}-fill-${i})`}
                  fillOpacity={1}
                  dot={dotFor(s.color)}
                  activeDot={{ r: 5.5, fill: s.color, stroke: t.surface, strokeWidth: 2.5 }}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )
      }}
    </ChartFrame>
  )
}

/* ── Donut chart: content distribution ───────────────────────────────────── */

export function DonutChartCard({ title = 'Content Distribution', data }) {
  const t = useThemeTokens()
  const [activeName, setActiveName] = useState(null)

  // Only ever plots the slices it is handed. No placeholder content mix.
  const slices = Array.isArray(data) ? data : []
  const total = slices.reduce((sum, item) => sum + num(item.value), 0)
  // Zero-value slices draw nothing but still eat `paddingAngle`, so keep them
  // out of the ring — they stay listed in the legend.
  const plotted = slices.filter((item) => num(item.value) > 0)
  const active = slices.find((item) => item.name === activeName) || null

  return (
    <ChartFrame title={title} height={278} bodyClassName="ktc-body-donut">
      {({ expanded }) => {
        if (slices.length === 0 || total === 0) {
          return (
            <ChartEmptyState
              message="Nothing published yet"
              hint="Blogs, help articles, FAQs and success stories show up here once created."
            />
          )
        }

        return (
          <div className={`ktc-donut ${expanded ? 'is-full' : ''}`}>
            <div className="ktc-donut-plot">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plotted}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={expanded ? '64%' : '60%'}
                    outerRadius={expanded ? '88%' : '84%'}
                    paddingAngle={plotted.length > 1 ? 2 : 0}
                    cornerRadius={5}
                    stroke={t.surface}
                    strokeWidth={3}
                    animationDuration={850}
                    animationEasing="ease-out"
                    onMouseEnter={(entry) => setActiveName(entry?.name ?? entry?.payload?.name ?? null)}
                    onMouseLeave={() => setActiveName(null)}
                  >
                    {plotted.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color || t.brand}
                        opacity={activeName === null || activeName === entry.name ? 1 : 0.3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="ktc-donut-center">
                <span className="ktc-donut-val">{fmtNum(active ? num(active.value) : total)}</span>
                <span className="ktc-donut-lbl">{active ? active.name : 'Total items'}</span>
              </div>
            </div>

            <div className="ktc-donut-legend donut-legend">
              {slices.map((item) => {
                const value = num(item.value)
                const pct = total ? Math.round((value / total) * 100) : 0
                return (
                  <div
                    key={item.name}
                    className={`ktc-lrow legend-row ${activeName === item.name ? 'is-active' : ''} ${
                      value === 0 ? 'is-zero' : ''
                    }`}
                    onMouseEnter={() => setActiveName(item.name)}
                    onMouseLeave={() => setActiveName(null)}
                  >
                    <span className="ktc-lrow-top">
                      <span className="ktc-lrow-name">
                        <span className="ktc-chip-dot" style={{ background: item.color || t.brand }} />
                        <span className="ktc-lrow-text" title={item.name}>
                          {item.name}
                        </span>
                      </span>
                      <span className="ktc-lrow-nums">
                        <strong>{fmtNum(value)}</strong>
                        <em>{pct}%</em>
                      </span>
                    </span>
                    <span className="ktc-lrow-track">
                      <span
                        className="ktc-lrow-fill"
                        style={{ width: `${pct}%`, background: item.color || t.brand }}
                      />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }}
    </ChartFrame>
  )
}

/* ── Bar chart: events, platforms, queries ───────────────────────────────── */

export function BarChartCard({ title, data, labelKey = 'label', valueKey = 'value', color }) {
  const t = useThemeTokens()
  const gid = useSafeId('ktbar')

  // Only ever plots the bars it is handed. No placeholder platform split.
  const chartData = Array.isArray(data) ? data : []
  const barColor = color || t.brand

  const values = chartData.map((row) => num(row[valueKey]))
  const scale = axisScale(values)
  const longestLabel = chartData.reduce(
    (max, row) => Math.max(max, String(row[labelKey] ?? '').length),
    0,
  )
  // Long names ("Newsletter Signup", search queries) collide as upright ticks —
  // lay those out as horizontal bars instead.
  const horizontal = longestLabel > 11 || chartData.length > 7
  const cardHeight = horizontal
    ? Math.min(420, Math.max(208, chartData.length * 42 + 28))
    : 240

  return (
    <ChartFrame title={title} height={cardHeight}>
      {({ expanded }) => {
        if (chartData.length === 0) {
          return <ChartEmptyState message="No data recorded yet" />
        }

        const gradientId = `${gid}-${expanded ? 'fs' : 'in'}-grad`

        if (horizontal) {
          const labelWidth = Math.min(
            expanded ? 260 : 150,
            Math.max(84, longestLabel * 6.9 + 20),
          )
          return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 6, right: 54, left: 4, bottom: 2 }}
                barCategoryGap="28%"
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={barColor} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={barColor} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal={false} strokeDasharray="4 8" stroke={t.line} />
                <XAxis
                  type="number"
                  domain={[0, scale.top]}
                  ticks={scale.ticks}
                  tickFormatter={fmtAxis}
                  tick={{ fill: t.muted, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  height={24}
                />
                <YAxis
                  type="category"
                  dataKey={labelKey}
                  width={labelWidth}
                  tick={<CategoryTick fill={t.body} maxChars={expanded ? 38 : 20} />}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: t.surface2, opacity: 0.55 }} content={<ChartTooltip fallbackColor={barColor} />} />
                <Bar
                  dataKey={valueKey}
                  name="Count"
                  fill={`url(#${gradientId})`}
                  radius={[4, 10, 10, 4]}
                  barSize={expanded ? 26 : 18}
                  maxBarSize={38}
                  animationDuration={850}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey={valueKey}
                    position="right"
                    offset={10}
                    formatter={fmtNum}
                    fill={t.ink}
                    fontSize={12}
                    fontWeight={800}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        }

        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 22, right: 14, left: 0, bottom: 0 }}
              barCategoryGap="24%"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={barColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={barColor} stopOpacity={0.42} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" vertical={false} stroke={t.line} />
              <XAxis
                dataKey={labelKey}
                tick={{ fill: t.muted, fontSize: 11.5 }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
              />
              <YAxis
                domain={[0, scale.top]}
                ticks={scale.ticks}
                tickFormatter={fmtAxis}
                width={44}
                tick={{ fill: t.muted, fontSize: 11.5 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: t.surface2, opacity: 0.55 }} content={<ChartTooltip fallbackColor={barColor} />} />
              <Bar
                dataKey={valueKey}
                name="Count"
                fill={`url(#${gradientId})`}
                radius={[10, 10, 4, 4]}
                maxBarSize={expanded ? 92 : 60}
                animationDuration={850}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey={valueKey}
                  position="top"
                  offset={9}
                  formatter={fmtNum}
                  fill={t.ink}
                  fontSize={12}
                  fontWeight={800}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      }}
    </ChartFrame>
  )
}

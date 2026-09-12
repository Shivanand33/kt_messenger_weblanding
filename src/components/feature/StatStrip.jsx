import { Container } from '../common/Container/Container'
import { useCountUp } from '../../hooks/useCountUp'
import { useLanguage } from '../../context/LanguageContext'

function Stat({ item, index }) {
  const { t } = useLanguage()
  const [ref, value] = useCountUp(item.value, { decimals: item.decimals ?? 0, duration: 1400 + index * 120 })
  const shown = item.decimals ? value.toFixed(item.decimals) : Math.round(value).toLocaleString('en-IN')

  return (
    <div
      ref={ref}
      className="group rounded-3xl border border-line bg-surface p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-card sm:p-6"
    >
      {item.icon ? (
        <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink transition-transform duration-300 group-hover:scale-110">
          {item.icon}
        </span>
      ) : null}
      <div className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
        {item.prefix}
        {shown}
        {item.suffix}
      </div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{t(item.label)}</div>
      {item.hint ? <p className="mt-2 text-xs leading-relaxed text-body">{t(item.hint)}</p> : null}
    </div>
  )
}

/**
 * Row of animated counters. Each number counts up once when it scrolls in.
 * `items`: [{ value, decimals?, prefix?, suffix?, label, icon?, hint? }]
 */
export function StatStrip() {
  return null
}

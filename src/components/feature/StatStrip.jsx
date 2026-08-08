import { Container } from '../common/Container/Container'
import { useCountUp } from '../../hooks/useCountUp'

function Stat({ item, index }) {
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
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{item.label}</div>
      {item.hint ? <p className="mt-2 text-xs leading-relaxed text-body">{item.hint}</p> : null}
    </div>
  )
}

/**
 * Row of animated counters. Each number counts up once when it scrolls in.
 * `items`: [{ value, decimals?, prefix?, suffix?, label, icon?, hint? }]
 */
export function StatStrip({ items, className = '', cols = 'sm:grid-cols-2 lg:grid-cols-4' }) {
  return (
    <section className={`border-y border-line bg-cream py-12 dark:bg-cream-2 ${className}`}>
      <Container>
        <div className={`grid grid-cols-2 gap-3 sm:gap-5 ${cols}`}>
          {items.map((item, index) => (
            <Stat key={item.label} item={item} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}

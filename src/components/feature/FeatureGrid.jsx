import { Reveal } from '../common/Reveal/Reveal'

/**
 * Icon + copy card grid used for the "what you get" blocks.
 * `items`: [{ icon, title, desc, badge? }]
 */
export function FeatureGrid({ items, cols = 'sm:grid-cols-2 lg:grid-cols-3', className = '' }) {
  return (
    <div className={`grid gap-5 ${cols} ${className}`}>
      {items.map((item, index) => (
        <Reveal key={item.title} from="up" delay={Math.min(index * 0.04, 0.24)} className="h-full">
          <article className="group flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-card">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>
              {item.badge ? (
                <span className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-muted dark:bg-cream-2">
                  {item.badge}
                </span>
              ) : null}
            </div>

            <h3 className="mt-5 text-lg font-extrabold leading-snug text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">{item.desc}</p>
          </article>
        </Reveal>
      ))}
    </div>
  )
}

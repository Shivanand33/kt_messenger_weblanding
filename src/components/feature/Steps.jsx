import { Reveal } from '../common/Reveal/Reveal'

/**
 * Numbered "how it works" rail. `items`: [{ title, desc, icon? }]
 */
export function Steps({ items, className = '' }) {
  return (
    <ol className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item, index) => (
        <Reveal as="li" key={item.title} from="up" delay={index * 0.06} className="h-full">
          <div className="relative flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 shadow-soft">
            <span className="absolute -top-3 left-6 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-black text-white shadow-brand">
              STEP {index + 1}
            </span>

            {item.icon ? (
              <span className="mt-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink">
                {item.icon}
              </span>
            ) : null}

            <h3 className="mt-4 text-base font-extrabold leading-snug text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">{item.desc}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}

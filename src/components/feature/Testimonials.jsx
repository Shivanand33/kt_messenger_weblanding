import { FiStar } from 'react-icons/fi'
import { Reveal } from '../common/Reveal/Reveal'

/**
 * Review cards. `items`: [{ quote, name, role, rating? }]
 */
export function Testimonials({ items, className = '' }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {items.map((item, index) => (
        <Reveal key={item.name} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
          <figure className="flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: item.rating ?? 5 }).map((_, star) => (
                <FiStar key={star} className="fill-current text-sm" />
              ))}
            </div>

            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-body">“{item.quote}”</blockquote>

            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-strong text-sm font-black text-white">
                {item.name.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold text-ink">{item.name}</span>
                <span className="block truncate text-xs font-semibold text-muted">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  )
}

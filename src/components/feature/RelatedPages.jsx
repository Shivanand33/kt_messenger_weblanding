import { useNavigate } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import { Reveal } from '../common/Reveal/Reveal'

/**
 * Cross-links to the sibling feature pages so a long page always offers a next
 * step. `items`: [{ to, label, desc, icon }]
 */
export function RelatedPages({ items, className = '' }) {
  const navigate = useNavigate()

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item, index) => (
        <Reveal key={item.to} from="up" delay={index * 0.05} className="h-full">
          <button
            type="button"
            onClick={() => {
              navigate(item.to)
              window.scrollTo(0, 0)
            }}
            className="group flex h-full w-full flex-col items-start rounded-[24px] border border-line bg-surface p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-card"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </span>

            <span className="mt-4 flex items-center gap-1.5 text-base font-extrabold text-ink">
              {item.label}
              <FiArrowUpRight className="text-sm text-brand-strong transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>

            <span className="mt-1.5 text-xs leading-relaxed text-body">{item.desc}</span>
          </button>
        </Reveal>
      ))}
    </div>
  )
}

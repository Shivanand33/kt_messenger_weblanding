import { FiArrowRight } from 'react-icons/fi'

/** Inline "Learn more →" link with a nudging arrow on hover. */
export function LinkArrow({ children = 'Learn more', href = '#', className = '' }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-ink transition-colors hover:text-brand-strong ${className}`}
    >
      {children}
      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  )
}

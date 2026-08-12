import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const BASE =
  'group inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-ink transition-colors hover:text-brand-strong'

/**
 * Inline "Learn more →" link with a nudging arrow on hover.
 *
 * Pass `to` for an in-app route so navigation stays client-side; `href` is for
 * anything off-site; `onClick` for an in-page action such as opening a modal.
 * Callers should always give one — without a destination the link renders as
 * plain text rather than a control that looks clickable but goes nowhere.
 */
export function LinkArrow({ children = 'Learn more', to, href, onClick, className = '' }) {
  const content = (
    <>
      {children}
      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`${BASE} ${className}`}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={`${BASE} ${className}`}>
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${BASE} ${className}`}>
        {content}
      </button>
    )
  }

  return <span className={`${BASE} ${className}`}>{content}</span>
}

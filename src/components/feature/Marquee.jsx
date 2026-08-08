/**
 * Seamless horizontal ticker. Children are rendered twice so the CSS loop has
 * no visible seam; hovering pauses the animation.
 */
export function Marquee({ children, duration = 42, className = '' }) {
  return (
    <div className={`no-scrollbar relative overflow-hidden ${className}`}>
      <div className="kt-marquee" style={{ '--marquee-duration': `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

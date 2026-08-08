export function Card({ children, className = '', hover = false, ...props }) {
  const hoverClasses = hover
    ? 'transition duration-300 hover:-translate-y-1 hover:shadow-card hover:border-brand/30'
    : ''
  return (
    <div
      className={`rounded-card border border-line bg-cream-2 p-6 shadow-soft ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

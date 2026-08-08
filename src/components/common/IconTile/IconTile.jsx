/** Rounded icon container used throughout feature blocks. */
export function IconTile({ children, className = '', size = 'md' }) {
  const sizes = {
    sm: 'h-10 w-10 rounded-xl text-lg',
    md: 'h-12 w-12 rounded-2xl text-xl',
    lg: 'h-14 w-14 rounded-2xl text-2xl',
  }
  return (
    <span
      className={`inline-flex items-center justify-center bg-brand-soft text-brand-ink ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}

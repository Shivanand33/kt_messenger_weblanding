const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 select-none'

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-[54px] px-8 text-base',
}

const variants = {
  primary:
    'bg-brand-strong text-white shadow-brand hover:-translate-y-0.5 hover:bg-brand-strong-hover hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.5)]',
  secondary: 'bg-surface text-ink border border-line hover:-translate-y-0.5 hover:bg-surface-2',
  ghost: 'text-ink hover:bg-surface-2',
  dark: 'bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
  white: 'bg-white text-slate-950 font-extrabold shadow-lg hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900',
  onDark: 'border-2 border-white/80 bg-white/10 text-white font-extrabold backdrop-blur-md hover:bg-white hover:text-slate-950 hover:-translate-y-0.5',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', href, ...props }) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

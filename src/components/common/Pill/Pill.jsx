/** Eyebrow chip used above section headings. */
export function Pill({ children, icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold tracking-tight text-brand-ink ${className}`}
    >
      {icon ? <span className="text-sm">{icon}</span> : null}
      {children}
    </span>
  )
}

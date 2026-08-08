export function SectionTitle({ eyebrow, title, description, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center'

  return (
    <div className={`mb-10 flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[#25D366]">{eyebrow}</span> : null}
      <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#111B21] sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-lg leading-8 text-[#667085]">{description}</p> : null}
    </div>
  )
}

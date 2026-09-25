import { Reveal } from '../common/Reveal/Reveal'
import { useLanguage } from '../../context/LanguageContext'

/**
 * Consistent heading block for every feature-page section: small coloured
 * eyebrow, headline, and an optional supporting line.
 */
export function SectionHead({ eyebrow, title, description, align = 'center', className = '', titleTag: TitleTag = 'h2', children }) {
  const { t } = useLanguage()
  const centered = align === 'center'
  return (
    <Reveal
      from="up"
      className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'} ${className}`}
    >
      {eyebrow ? (
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-ink`}
        >
          {t(eyebrow)}
        </span>
      ) : null}

      <TitleTag className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{t(title)}</TitleTag>

      {description ? <p className="mt-3 text-[15px] leading-relaxed text-body">{t(description)}</p> : null}

      {children}
    </Reveal>
  )
}

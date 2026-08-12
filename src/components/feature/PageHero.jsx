import { Container } from '../common/Container/Container'
import { Reveal } from '../common/Reveal/Reveal'

/**
 * Shared dark hero shell for the feature pages: glow + grid backdrop, badge,
 * headline with a highlighted word, supporting copy, action row, an optional
 * right-hand mockup panel, and a row of trust chips underneath.
 */
export function PageHero({
  badge,
  title,
  highlight,
  description,
  actions,
  aside,
  chips,
  children,
  id = 'overview',
}) {
  return (
    <section
      id={id}
      className="relative isolate overflow-hidden bg-cream dark:bg-[#070e1b] border-b border-line py-16 text-ink dark:text-white select-none lg:py-24 transition-colors"
    >
      <div className="kt-hero-glow absolute inset-0 -z-10 opacity-30 dark:opacity-100" aria-hidden="true" />
      <div className="kt-hero-grid absolute inset-0 -z-10 opacity-15 dark:opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-cream dark:from-[#070e1b] to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <Container>
        <div className={`grid items-center gap-12 [&>*]:min-w-0 ${aside ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''}`}>
          <div className={aside ? '' : 'max-w-3xl'}>
            <Reveal from="up">
              {badge ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-strong/20 dark:border-sky-400/30 bg-brand-soft dark:bg-sky-400/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-ink dark:text-sky-300 backdrop-blur">
                  {badge}
                </span>
              ) : null}

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink dark:text-white sm:text-6xl">
                {title} {highlight ? <span className="text-brand-strong dark:text-sky-400">{highlight}</span> : null}
              </h1>

              {description ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-body dark:text-slate-300 sm:text-lg">{description}</p>
              ) : null}
            </Reveal>

            {children ? (
              <Reveal from="up" delay={0.08}>
                {children}
              </Reveal>
            ) : null}

            {actions ? (
              <Reveal from="up" delay={0.14}>
                <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
              </Reveal>
            ) : null}

            {chips?.length ? (
              <Reveal from="up" delay={0.2}>
                <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {chips.map((chip) => (
                    <li key={chip.label} className="flex items-center gap-2 text-xs font-bold text-body dark:text-slate-300">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft dark:bg-white/10 text-brand-strong dark:text-sky-300">
                        {chip.icon}
                      </span>
                      {chip.label}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          {aside ? (
            <Reveal from="scale" delay={0.1}>
              {aside}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

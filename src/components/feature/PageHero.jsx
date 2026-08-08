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
      className="relative isolate overflow-hidden bg-[#070e1b] py-16 text-white select-none lg:py-24"
    >
      <div className="kt-hero-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="kt-hero-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#070e1b] to-transparent"
        aria-hidden="true"
      />

      <Container>
        <div className={`grid items-center gap-12 [&>*]:min-w-0 ${aside ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''}`}>
          <div className={aside ? '' : 'max-w-3xl'}>
            <Reveal from="up">
              {badge ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-sky-300 backdrop-blur">
                  {badge}
                </span>
              ) : null}

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
                {title} {highlight ? <span className="text-sky-400">{highlight}</span> : null}
              </h1>

              {description ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
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
                    <li key={chip.label} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-sky-300">
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

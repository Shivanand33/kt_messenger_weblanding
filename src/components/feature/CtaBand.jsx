import { Container } from '../common/Container/Container'
import { Reveal } from '../common/Reveal/Reveal'

/**
 * Closing call-to-action band. `points` renders as a short benefit list under
 * the action row.
 */
export function CtaBand({ eyebrow, title, description, actions, points, id }) {
  return (
    <section id={id} className="relative isolate overflow-hidden bg-[#070e1b] py-20 text-white">
      <div className="kt-hero-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="kt-hero-grid absolute inset-0 -z-10 opacity-50" aria-hidden="true" />

      <Container maxW="max-w-4xl">
        <Reveal from="up" className="text-center">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-sky-300">
              {eyebrow}
            </span>
          ) : null}

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">{title}</h2>

          {description ? (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>
          ) : null}

          {actions ? <div className="mt-9 flex flex-wrap justify-center gap-3">{actions}</div> : null}

          {points?.length ? (
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/10 pt-7">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>
      </Container>
    </section>
  )
}

import { Container } from '../../common/Container/Container'
import { Reveal } from '../../common/Reveal/Reveal'

const stats = [
  { value: '2B+', label: 'People connected' },
  { value: '100B+', label: 'Messages every day' },
  { value: '180+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime' },
]

export function TrustBar() {
  return (
    <section className="border-y border-line bg-cream-2/60">
      <Container className="py-9 lg:py-11">
        <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              from="up"
              delay={index * 0.06}
              className="text-center sm:border-l sm:border-line sm:first:border-l-0"
            >
              <p className="text-3xl font-extrabold tracking-tight text-ink lg:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-sm text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { FiMessageCircle, FiPhone, FiLock, FiCloud, FiBell, FiZap, FiStar } from 'react-icons/fi'
import { Section } from '../../common/Section/Section'
import { SectionHeading } from '../../common/SectionHeading/SectionHeading'
import { Card } from '../../common/Card/Card'
import { IconTile } from '../../common/IconTile/IconTile'
import { Reveal } from '../../common/Reveal/Reveal'

const features = [
  {
    icon: <FiMessageCircle />,
    title: 'Instant messaging',
    text: 'Texts, photos, voice notes, and files that arrive the moment you hit send.',
    to: '/messaging',
  },
  {
    icon: <FiPhone />,
    title: 'Voice & video calls',
    text: 'Free calls that stay clear, whether it is one friend or a full group.',
    to: '/calling',
  },
  {
    icon: <FiLock />,
    title: 'End-to-end encryption',
    text: 'Privacy that is on by default, for every chat and every call you make.',
    to: '/security',
  },
  {
    icon: <FiCloud />,
    title: 'Synced everywhere',
    text: 'Pick up any conversation on your phone, tablet, or computer instantly.',
    to: '/apps',
  },
  {
    icon: <FiBell />,
    title: 'Calm notifications',
    text: 'Meaningful alerts you can shape, so you stay present and in control.',
    to: '/messaging',
  },
  {
    icon: <FiZap />,
    title: 'Fast & lightweight',
    text: 'Built to feel instant, even on older phones and slower networks.',
    to: '/apps',
  },
]

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        align="center"
        eyebrow="Everything you need"
        eyebrowIcon={<FiStar />}
        title="One app for every kind of conversation."
        description="Thoughtfully designed, endlessly reliable, and private from the very first message."
        className="mx-auto max-w-2xl"
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {features.map((feature, index) => (
          <Reveal key={feature.title} from="up" delay={index * 0.05} className="h-full">
            <Link
              to={feature.to}
              className="block h-full rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <Card hover className="h-full cursor-pointer">
                <IconTile>{feature.icon}</IconTile>
                <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-body">{feature.text}</p>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

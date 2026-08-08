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
  },
  {
    icon: <FiPhone />,
    title: 'Voice & video calls',
    text: 'Free calls that stay clear, whether it is one friend or a full group.',
  },
  {
    icon: <FiLock />,
    title: 'End-to-end encryption',
    text: 'Privacy that is on by default, for every chat and every call you make.',
  },
  {
    icon: <FiCloud />,
    title: 'Synced everywhere',
    text: 'Pick up any conversation on your phone, tablet, or computer instantly.',
  },
  {
    icon: <FiBell />,
    title: 'Calm notifications',
    text: 'Meaningful alerts you can shape, so you stay present and in control.',
  },
  {
    icon: <FiZap />,
    title: 'Fast & lightweight',
    text: 'Built to feel instant, even on older phones and slower networks.',
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
            <Card hover className="h-full">
              <IconTile>{feature.icon}</IconTile>
              <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-body">{feature.text}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

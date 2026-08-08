import { FiUsers, FiBarChart2 } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import groupsImage from '../../../assets/images/group.jpg'

const avatars = ['A', 'J', 'S', 'M']

export function Groups() {
  return (
    <FeatureShowcase
      id="groups"
      eyebrow="Communities"
      eyebrowIcon={<FiUsers />}
      title="Bring your whole circle together."
      description="From close friends to big communities, keep everyone in sync with shared chats, events, and updates that never feel noisy."
      image={groupsImage}
      imageAlt="A group of friends laughing together"
      bullets={[
        { icon: <FiUsers />, title: 'Groups & Communities', text: 'Organize people into calm, focused spaces.' },
        { icon: <FiBarChart2 />, title: 'Polls & events', text: 'Decide together and plan it all in a single tap.' },
      ]}
      cta={<LinkArrow>Discover Communities</LinkArrow>}
      accent={
        <div className="absolute -bottom-4 -left-3 flex items-center gap-3 rounded-2xl border border-line bg-surface/95 p-3 pr-5 shadow-card backdrop-blur sm:-left-6">
          <div className="flex -space-x-2.5">
            {avatars.map((initial) => (
              <span
                key={initial}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-brand-soft text-xs font-bold text-brand-ink"
              >
                {initial}
              </span>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Weekend Trip</p>
            <p className="text-xs text-muted">12 online now</p>
          </div>
        </div>
      }
    />
  )
}

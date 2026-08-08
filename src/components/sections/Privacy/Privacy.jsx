import { FiShield, FiLock, FiClock } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import privacyImage from '../../../assets/images/security.jpg'

export function Privacy() {
  return (
    <FeatureShowcase
      id="privacy"
      reverse
      eyebrow="Privacy"
      eyebrowIcon={<FiShield />}
      title="Your conversations, locked to you."
      description="Every message and call is secured with end-to-end encryption by default. Not even KT Messengers can read them — only you and the people you're talking to."
      image={privacyImage}
      imageAlt="Someone reading a private message securely"
      bullets={[
        { icon: <FiLock />, title: 'End-to-end encryption', text: 'Locked the moment it leaves your device.' },
        { icon: <FiClock />, title: 'Disappearing messages', text: 'Set chats to auto-delete on your own schedule.' },
      ]}
      cta={<LinkArrow>How privacy works</LinkArrow>}
      accent={
        <div className="absolute -bottom-4 right-5 flex items-center gap-2.5 rounded-2xl border border-brand/25 bg-brand-soft p-3 pr-5 shadow-card sm:right-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <FiLock />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-ink">Encrypted</p>
            <p className="text-xs text-brand-ink/70">Only you two</p>
          </div>
        </div>
      }
    />
  )
}

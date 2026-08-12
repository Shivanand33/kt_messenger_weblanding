import { FiPhoneCall } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import { PhoneCallMockup } from '../../mockups/PhoneCallMockup'

export function Calling() {
  return (
    <FeatureShowcase
      id="calls"
      eyebrow="Voice & video"
      eyebrowIcon={<FiPhoneCall />}
      title="Never miss a moment."
      description="From a group call with friends to a quick check-in with family, feel like you are in the same room — with crisp, reliable voice and video on every device."
      media={<PhoneCallMockup />}
      cta={<LinkArrow to="/calling">Learn more about calls</LinkArrow>}
    />
  )
}

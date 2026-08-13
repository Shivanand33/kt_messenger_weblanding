import { FiZap } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import { BrowserCallMockup } from '../../mockups/BrowserCallMockup'

export function LoopWeb() {
  return (
    <FeatureShowcase
      id="web"
      reverse
      eyebrow="New · KT Web"
      eyebrowIcon={<FiZap />}
      title="Call right from your browser."
      description="Start or join a video or voice call — solo or with the whole group — straight from a browser tab. Nothing to install, nothing to set up."
      media={<BrowserCallMockup />}
      cta={<LinkArrow href="https://web.ktmessenger.com/chat/calls">Try KT Web</LinkArrow>}
    />
  )
}

import { FiZap } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import { BrowserCallMockup } from '../../mockups/BrowserCallMockup'
import { useLanguage } from '../../../context/LanguageContext'

export function LoopWeb() {
  const { t } = useLanguage()
  return (
    <FeatureShowcase
      id="web"
      reverse
      eyebrow={t('New · KT Web')}
      eyebrowIcon={<FiZap />}
      title={t('Call right from your browser.')}
      description={t('Start or join a video or voice call solo or with the whole group straight from a browser tab. Nothing to install, nothing to set up.')}
      media={<BrowserCallMockup />}
      cta={<LinkArrow href="https://web.ktmessenger.com/chat/calls">{t('Try KT Web')}</LinkArrow>}
    />
  )
}

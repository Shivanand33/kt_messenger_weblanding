import { FiPhoneCall } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import { PhoneCallMockup } from '../../mockups/PhoneCallMockup'
import { useLanguage } from '../../../context/LanguageContext'

export function Calling() {
  const { t } = useLanguage()
  return (
    <FeatureShowcase
      id="calls"
      eyebrow={t('Voice & video')}
      eyebrowIcon={<FiPhoneCall />}
      title={t('Voice And Video Calls For Better Connections')}
      description={t('Stay close to the people who matter with clear and reliable voice and video calling. Whether you are talking with family, friends, or colleagues, KT Messenger helps you communicate naturally through high quality voice calls, video calls, group calls, screen sharing, and cross device calling.')}
      media={<PhoneCallMockup />}
      cta={<LinkArrow to="/calling">{t('Learn more about calls')}</LinkArrow>}
    />
  )
}

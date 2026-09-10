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
      title={t('Never miss a moment.')}
      description={t('From a group call with friends to a quick check in with family, feel like you are in the same room with crisp, reliable voice and video on every device.')}
      media={<PhoneCallMockup />}
      cta={<LinkArrow to="/calling">{t('Learn more about calls')}</LinkArrow>}
    />
  )
}

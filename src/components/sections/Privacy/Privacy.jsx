import { FiShield, FiLock, FiClock } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import privacyImage from '../../../assets/images/footer.jpg'
import { useLanguage } from '../../../context/LanguageContext'

export function Privacy() {
  const { t } = useLanguage()
  return (
    <FeatureShowcase
      id="privacy"
      reverse
      eyebrow={t('Privacy')}
      eyebrowIcon={<FiShield />}
      title={t('Secure And Private Messaging')}
      description={t('Your personal conversations deserve protection. KT Messenger provides a secure environment where you can communicate confidently with friends, family, and teams.')}
      image={privacyImage}
      imageAlt={t('People gathered around a laptop using KT Messenger')}
      bullets={[
        { icon: <FiLock />, title: t('Private Conversations Made Simple'), text: t('Send messages instantly while keeping your conversations protected with privacy focused features.') },
        { icon: <FiClock />, title: t('Share More Than Text'), text: t('KT Messenger allows you to share photos, videos, documents, files, and voice messages to keep every conversation meaningful.') },
      ]}
      cta={<LinkArrow to="/privacy">{t('How privacy works')}</LinkArrow>}
      accent={
        <div className="absolute -bottom-4 right-5 flex items-center gap-2.5 rounded-2xl border border-brand/25 bg-brand-soft p-3 pr-5 shadow-card sm:right-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <FiLock />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-ink">{t('Encrypted')}</p>
            <p className="text-xs text-brand-ink/70">{t('Only you two')}</p>
          </div>
        </div>
      }
    />
  )
}

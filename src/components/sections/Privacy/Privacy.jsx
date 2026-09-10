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
      title={t('Your conversations, locked to you.')}
      description={t("Every message and call is secured with end to end encryption by default. Not even KT Messenger can read them only you and the people you're talking to.")}
      image={privacyImage}
      imageAlt={t('People gathered around a laptop using KT Messenger')}
      bullets={[
        { icon: <FiLock />, title: t('End to end encryption'), text: t('Locked the moment it leaves your device.') },
        { icon: <FiClock />, title: t('Disappearing messages'), text: t('Set chats to auto delete on your own schedule.') },
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

import { FiSmile, FiCamera } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import expressionImage from '../../../assets/images/footer.jpg'
import { useLanguage } from '../../../context/LanguageContext'

const reactions = ['❤️', '😂', '🎉', '👍']

export function Expression() {
  const { t } = useLanguage()
  return (
    <FeatureShowcase
      id="expression"
      reverse
      eyebrow={t('Status & stickers')}
      eyebrowIcon={<FiSmile />}
      title={t('Say it your way.')}
      description={t('Share the little moments with Status, and react with stickers, GIFs, and emoji that actually feel like you.')}
      image={expressionImage}
      imageAlt={t('A person sharing a happy everyday moment')}
      bullets={[
        { icon: <FiCamera />, title: t('Status'), text: t('Share moments that quietly vanish in 24 hours.') },
        { icon: <FiSmile />, title: t('Stickers & reactions'), text: t('Thousands of playful ways to react in an instant.') },
      ]}
      cta={<LinkArrow to="/status">{t('Explore expression')}</LinkArrow>}
      accent={
        <div className="absolute -right-2 bottom-10 flex items-center gap-1 rounded-full border border-line bg-surface/95 px-3 py-2 shadow-card backdrop-blur sm:-right-5">
          {reactions.map((reaction) => (
            <span key={reaction} className="text-lg">
              {reaction}
            </span>
          ))}
        </div>
      }
    />
  )
}

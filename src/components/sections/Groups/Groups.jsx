import { img } from '../../../utils/imageOverrides'
import { FiUsers, FiBarChart2 } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import { useLanguage } from '../../../context/LanguageContext'
import groupsImage from '../../../assets/images/group.jpg'
import nadiaAvatar from '../../../assets/images/nadia_avatar.png'
import femaleAvatar from '../../../assets/images/avatar_female_1.png'
import maleAvatar from '../../../assets/images/avatar_male_1.png'

// Decorative stack — the adjacent "Weekend Trip · 12 online now" carries the
// meaning, so the photos stay out of the accessibility tree. Three faces plus
// the +9 counter add up to the 12 quoted underneath.
const memberAvatars = [nadiaAvatar, maleAvatar, femaleAvatar]

export function Groups() {
  const { t } = useLanguage()
  return (
    <FeatureShowcase
      id="groups"
      eyebrow={t('Communities')}
      eyebrowIcon={<FiUsers />}
      title={t('Build Communities And Stay Connected')}
      description={t('Communication is better when people can come together. KT Messenger helps users create groups and communities where they can share ideas, updates, and important information.')}
      image={groupsImage}
      imageAlt={t('A group of friends laughing together')}
      bullets={[
        { icon: <FiUsers />, title: t('Create Meaningful Connections'), text: t('Use communities to share updates, collaborate with groups, exchange ideas, and build stronger connections.') },
        { icon: <FiBarChart2 />, title: t('Groups & Communities'), text: t('Organize people into calm, focused spaces for team collaboration and shared interests.') },
      ]}
      cta={<LinkArrow to="/groups">{t('Discover Communities')}</LinkArrow>}
      accent={
        <div className="absolute -bottom-4 -left-3 flex items-center gap-3 rounded-2xl border border-line bg-surface/95 p-3 pr-5 shadow-card backdrop-blur sm:-left-6">
          <div className="flex -space-x-2.5">
            {memberAvatars.map((src, index) => (
              <img
                key={index}
                src={img(src)}
                alt=""
                className="h-8 w-8 rounded-full border-2 border-surface object-cover"
              />
            ))}
            <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-brand-soft text-xs font-bold text-brand-ink">
              +9
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{t('Weekend Trip')}</p>
            <p className="text-xs text-muted">{t('12 online now')}</p>
          </div>
        </div>
      }
    />
  )
}

import { FiBriefcase, FiCheck } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import businessImage from '../../../assets/images/business.jpg'

export function Business() {
  return (
    <FeatureShowcase
      id="business"
      eyebrow="For business"
      eyebrowIcon={<FiBriefcase />}
      title="Grow closer to every customer."
      description="Meet customers where they already are. Answer questions, share catalogs, and build trust with a business presence people instantly recognize."
      image={businessImage}
      imageAlt="A small business owner replying to customers"
      stats={[
        { value: '2M+', label: 'Businesses on KT' },
        { value: '1B+', label: 'Chats every day' },
        { value: '3 min', label: 'Avg. reply time' },
      ]}
      cta={<LinkArrow>Explore KT Business</LinkArrow>}
      accent={
        <div className="absolute -bottom-4 left-5 flex items-center gap-2.5 rounded-2xl border border-line bg-surface/95 p-3 pr-5 shadow-card backdrop-blur sm:left-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <FiCheck />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Verified business</p>
            <p className="text-xs text-muted">Trusted profile</p>
          </div>
        </div>
      }
    />
  )
}

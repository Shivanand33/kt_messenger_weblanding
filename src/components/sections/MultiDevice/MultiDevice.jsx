import { FiMonitor, FiDownload, FiSmartphone, FiTablet } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { Button } from '../../common/Button/Button'
import { DesktopAppMockup } from '../../mockups/DesktopAppMockup'
import { useLanguage } from '../../../context/LanguageContext'

const surfaces = [
  { icon: <FiSmartphone />, label: 'iOS & Android' },
  { icon: <FiTablet />, label: 'Tablet' },
  { icon: <FiMonitor />, label: 'Mac & Windows' },
]

export function MultiDevice() {
  const { t } = useLanguage()
  return (
    <FeatureShowcase
      id="devices"
      reverse
      eyebrow={t('Desktop')}
      eyebrowIcon={<FiMonitor />}
      title={t('Get KT Messenger on your desktop.')}
      description={t('Chat and call on a larger screen with the KT Messenger desktop app everything stays perfectly in sync with your phone, even when it is asleep.')}
      media={<DesktopAppMockup />}
      cta={
        <Button>
          {t('Download desktop app')} <FiDownload />
        </Button>
      }
    >
      <div className="mt-7 flex flex-wrap gap-2.5">
        {surfaces.map((surface) => (
          <span
            key={surface.label}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-cream-2 px-3.5 py-2 text-sm font-medium text-body"
          >
            <span className="text-brand-ink">{surface.icon}</span>
            {t(surface.label)}
          </span>
        ))}
      </div>
    </FeatureShowcase>
  )
}

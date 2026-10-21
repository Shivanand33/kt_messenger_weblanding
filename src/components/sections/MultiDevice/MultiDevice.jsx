import { FiMonitor, FiDownload, FiSmartphone, FiTablet } from 'react-icons/fi'
import { FeatureShowcase } from '../FeatureShowcase/FeatureShowcase'
import { Button } from '../../common/Button/Button'
import { DesktopAppMockup } from '../../mockups/DesktopAppMockup'
import { useLanguage } from '../../../context/LanguageContext'
import { useModal } from '../../../context/ModalContext'

const surfaces = [
  { icon: <FiSmartphone />, label: 'iOS & Android' },
  { icon: <FiTablet />, label: 'Tablet' },
  { icon: <FiMonitor />, label: 'Mac & Windows' },
]

export function MultiDevice() {
  const { t } = useLanguage()
  const { downloadLink } = useModal()

  return (
    <FeatureShowcase
      id="devices"
      reverse
      eyebrow={t('Desktop')}
      eyebrowIcon={<FiMonitor />}
      title={t('Connect Across All Your Devices')}
      description={t('Your conversations should move with you. KT Messenger provides a seamless experience across mobile devices, desktop platforms, and web access. Start a conversation from one device and continue from another without losing connection.')}
      media={<DesktopAppMockup />}
      cta={
        <Button {...downloadLink}>
          {t('Download desktop app')} <FiDownload />
        </Button>
      }
    >
      {/* Each chip starts the same download as the button above it, so it
          needs the same markup: a link on iOS, a button everywhere else (see
          downloadLink). `text-body!` because the unlayered `a` rule would
          otherwise repaint the link form. */}
      <div className="mt-7 flex flex-wrap gap-2.5">
        {surfaces.map((surface) => {
          const Chip = downloadLink.href ? 'a' : 'button'
          return (
            <Chip
              key={surface.label}
              {...(downloadLink.href ? null : { type: 'button' })}
              {...downloadLink}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-cream-2 px-3.5 py-2 text-sm font-medium text-body! transition-colors hover:border-brand-strong hover:bg-white hover:shadow-sm cursor-pointer"
            >
              <span className="text-brand-ink">{surface.icon}</span>
              {t(surface.label)}
            </Chip>
          )
        })}
      </div>
    </FeatureShowcase>
  )
}


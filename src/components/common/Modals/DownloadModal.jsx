import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiDownload, FiExternalLink } from 'react-icons/fi'
import { FaAndroid, FaWindows, FaApple } from 'react-icons/fa'
import { useLanguage } from '../../../context/LanguageContext'
import { api } from '../../../services/apiClient'
import { useRemoteContent } from '../../../hooks/useRemoteContent'
import { trackDownload } from '../../../services/analytics'

// Mobile builds live on the app stores, so those rows link out rather than
// serving a file. These are the links the site shipped before the admin became
// the source of truth, and they remain the fallback if the API is unreachable.
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ogoul.kalamtime'
const APP_STORE_URL = 'https://apps.apple.com/in/app/kt-messenger/id6478195913'
const WINDOWS_EXE_URL = 'https://cdn1.ktmessenger.com/KT%20MESSENGER%20INSTALL.EXE'

// One class string for all call-to-actions so they stay identical in height and
// never wrap. `text-white!` is forced because the global `a { color: inherit }`
// rule is unlayered, and unlayered CSS outranks Tailwind's layered utilities —
// without it the store links render in the body colour instead of white.
const CTA_CLASS =
  'flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand-strong px-4 text-xs font-semibold text-white! shadow-sm transition-colors hover:bg-brand-strong-hover'

function AppleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.097 2.477-1.11.958-1.209.76-2.54.726-2.578zM13.045 10.406c-.228.496-.48.97-.754 1.42-.647 1.054-1.319 2.103-2.383 2.103-1.064 0-1.396-.69-2.528-.69-1.132 0-1.503.674-2.511.706-1.065.033-1.85-.989-2.497-2.043-1.325-2.155-2.336-6.096-.97-8.665.679-1.275 1.9-2.083 3.238-2.083 1.064 0 1.947.747 2.656.747.71 0 1.834-.844 3.093-.72a3.784 3.784 0 0 1 2.876 1.442 3.86 3.86 0 0 0-1.92 3.242c.007 2.562 2.127 3.513 2.15 3.523a4.015 4.015 0 0 0-.45 1.02z" />
    </svg>
  )
}

// Per-platform presentation. The admin owns the URLs and versions; the icon,
// wording and styling stay in code so the modal always looks the same.
const PLATFORM_UI = {
  ANDROID: {
    name: 'Android',
    source: 'Google Play Store',
    cta: 'Google Play',
    iconWrap: 'bg-emerald-100 text-emerald-600',
    icon: <FaAndroid className="text-xl" />,
    ctaIcon: <FiExternalLink />,
  },
  IOS: {
    name: 'iPhone & iPad',
    source: 'Apple App Store',
    cta: 'App Store',
    iconWrap: 'bg-stone-200 text-stone-800',
    icon: <AppleIcon className="text-xl" />,
    ctaIcon: <FiExternalLink />,
  },
  WINDOWS: {
    name: 'Windows PC',
    source: 'Direct download',
    cta: 'Download',
    iconWrap: 'bg-sky-100 text-sky-700',
    icon: <FaWindows className="text-xl" />,
    ctaIcon: <FiDownload />,
  },
  MAC: {
    name: 'macOS',
    source: 'Direct download',
    cta: 'Download',
    iconWrap: 'bg-stone-200 text-stone-800',
    icon: <FaApple className="text-xl" />,
    ctaIcon: <FiDownload />,
  },
}

// Analytics platform key expected by trackDownload().
const TRACK_KEY = { ANDROID: 'android', IOS: 'ios', WINDOWS: 'desktop', MAC: 'desktop' }

// The exact rows the modal shipped with, used until the API answers.
const FALLBACK_PLATFORMS = [
  { platform: 'ANDROID', url: PLAY_STORE_URL },
  { platform: 'IOS', url: APP_STORE_URL },
  { platform: 'WINDOWS', url: WINDOWS_EXE_URL },
]

/**
 * Turn /api/downloads rows into renderable entries.
 *
 * A platform is only shown when it has a link we can actually send someone to.
 * A store *homepage* (no path) is treated as a placeholder, not a real link —
 * otherwise an unfinished admin row would ship a download button that drops
 * users on apple.com instead of KT Messenger.
 */
const isUsableUrl = (url) => {
  if (!url || !/^https?:\/\//i.test(url)) return false
  try {
    return new URL(url).pathname.replace(/\/+$/, '').length > 0
  } catch {
    return false
  }
}

function toPlatforms(rows) {
  const list = (rows || [])
    .map((r) => {
      const platform = String(r.platform || '').toUpperCase()
      // A direct installer wins over a store page when both are present.
      const url = [r.downloadUrl, r.storeUrl].find(isUsableUrl)
      return PLATFORM_UI[platform] && url ? { platform, url, version: r.version } : null
    })
    .filter(Boolean)

  const merged = [...list]
  for (const fb of FALLBACK_PLATFORMS) {
    if (!merged.some((m) => m.platform === fb.platform)) {
      merged.push(fb)
    }
  }

  const order = ['ANDROID', 'IOS', 'WINDOWS', 'MAC']
  return merged.sort((a, b) => order.indexOf(a.platform) - order.indexOf(b.platform))
}

export function DownloadModal({ isOpen, onClose }) {
  const { t } = useLanguage()

  // Admin App Releases are the source of truth. If the API is unreachable or
  // returns nothing usable, the fallback rows stay on screen.
  const [platforms] = useRemoteContent(() => api.getDownloads().then(toPlatforms), FALLBACK_PLATFORMS)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-stone-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label={t('Close modal')}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            <FiX className="text-lg" />
          </button>

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
              <FiDownload className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#111b21]">{t('Download KT Messenger')}</h3>
            <p className="mt-1 text-xs text-stone-500">
              {t('Get the official app for Android, iOS, or Windows')}
            </p>
          </div>

          {/* Download Options */}
          <div className="mt-6 space-y-3">
            {platforms.map(({ platform, url }) => {
              const ui = PLATFORM_UI[platform]
              return (
                <div
                  key={platform}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 p-3.5 hover:border-brand-strong transition-all bg-stone-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ui.iconWrap}`}>
                      {ui.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-stone-900">{ui.name}</p>
                      <p className="text-[11px] text-stone-500">{ui.source}</p>
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackDownload(TRACK_KEY[platform] || 'desktop', url)}
                    className={CTA_CLASS}
                  >
                    {ui.ctaIcon} {ui.cta}
                  </a>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

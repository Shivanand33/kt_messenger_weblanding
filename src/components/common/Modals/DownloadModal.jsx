import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiDownload, FiCheck, FiMonitor, FiExternalLink } from 'react-icons/fi'
import { FaAndroid } from 'react-icons/fa'

// Mobile builds live on the app stores, so those rows link out rather than
// serving a file.
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ogoul.kalamtime'
const APP_STORE_URL = 'https://apps.apple.com/in/app/kt-messenger/id6478195913'

// One class string for all four call-to-actions so they stay identical in
// height and never wrap. `text-white!` is forced because the global
// `a { color: inherit }` rule is unlayered, and unlayered CSS outranks
// Tailwind's layered utilities — without it the two store links render in the
// body colour instead of white.
const CTA_CLASS =
  'flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand-strong px-4 text-xs font-semibold text-white! shadow-sm transition-colors hover:bg-brand-strong-hover'

function AppleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.097 2.477-1.11.958-1.209.76-2.54.726-2.578zM13.045 10.406c-.228.496-.48.97-.754 1.42-.647 1.054-1.319 2.103-2.383 2.103-1.064 0-1.396-.69-2.528-.69-1.132 0-1.503.674-2.511.706-1.065.033-1.85-.989-2.497-2.043-1.325-2.155-2.336-6.096-.97-8.665.679-1.275 1.9-2.083 3.238-2.083 1.064 0 1.947.747 2.656.747.71 0 1.834-.844 3.093-.72a3.784 3.784 0 0 1 2.876 1.442 3.86 3.86 0 0 0-1.92 3.242c.007 2.562 2.127 3.513 2.15 3.523a4.015 4.015 0 0 0-.45 1.02z" />
    </svg>
  )
}

export function DownloadModal({ isOpen, onClose }) {
  const [downloadingOS, setDownloadingOS] = useState(null)

  if (!isOpen) return null

  const handleDownload = (osName, filename) => {
    setDownloadingOS(osName)
    // Simulate instant file download action
    const element = document.createElement('a')
    const file = new Blob([`KT Messengers Installer for ${osName}`], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setTimeout(() => {
      setDownloadingOS(null)
    }, 2000)
  }

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
            aria-label="Close modal"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            <FiX className="text-lg" />
          </button>

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong">
              <FiDownload className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#111b21]">Download KT Messengers</h3>
            <p className="mt-1 text-xs text-stone-500">
              Get the official app for Windows, macOS, Android, or iOS
            </p>
          </div>

          {/* Download Options */}
          <div className="mt-6 space-y-3">
            {/* Windows */}
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 p-3.5 hover:border-brand-strong transition-all bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FiMonitor className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-stone-900">Windows PC</p>
                  <p className="text-[11px] text-stone-500">Windows 10/11 (64-bit)</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('Windows', 'KTMessengers-Setup.exe')}
                className={CTA_CLASS}
              >
                {downloadingOS === 'Windows' ? (
                  <>
                    <FiCheck className="text-sm" /> Downloaded
                  </>
                ) : (
                  <>
                    <FiDownload /> Download .exe
                  </>
                )}
              </button>
            </div>

            {/* macOS */}
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 p-3.5 hover:border-brand-strong transition-all bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-200 text-stone-800">
                  <AppleIcon className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-stone-900">macOS</p>
                  <p className="text-[11px] text-stone-500">macOS 11.0 or later (Apple Silicon / Intel)</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload('macOS', 'KTMessengers-macOS.dmg')}
                className={CTA_CLASS}
              >
                {downloadingOS === 'macOS' ? (
                  <>
                    <FiCheck className="text-sm" /> Downloaded
                  </>
                ) : (
                  <>
                    <FiDownload /> Download .dmg
                  </>
                )}
              </button>
            </div>

            {/* Android */}
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 p-3.5 hover:border-brand-strong transition-all bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <FaAndroid className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-stone-900">Android</p>
                  <p className="text-[11px] text-stone-500">Google Play Store</p>
                </div>
              </div>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                <FiExternalLink /> Google Play
              </a>
            </div>

            {/* iOS */}
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 p-3.5 hover:border-brand-strong transition-all bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-200 text-stone-800">
                  <AppleIcon className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-stone-900">iPhone &amp; iPad</p>
                  <p className="text-[11px] text-stone-500">Apple App Store</p>
                </div>
              </div>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                <FiExternalLink /> App Store
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

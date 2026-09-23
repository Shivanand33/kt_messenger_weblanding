import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FiCheck,
  FiChevronDown,
  FiGlobe,
} from 'react-icons/fi'
import { Container } from '../../common/Container/Container'
import { Logo } from '../../common/Logo/Logo'
import { Modal } from '../../feature/Modal'
import { useModal } from '../../../context/ModalContext'
import { api } from '../../../services/apiClient'
import { useRemoteContent } from '../../../hooks/useRemoteContent'
import { useLanguage } from '../../../context/LanguageContext'
import { SUPPORTED_LANGS } from '../../../i18n/translations'
import jaadoeIcon from '../../../assets/images/social/jaadoe.png'
import seezittIcon from '../../../assets/images/social/seezitt.svg'
import wnsocialIcon from '../../../assets/images/social/wnsocial.svg'
import omreIcon from '../../../assets/images/social/omre.png'
import werfieIcon from '../../../assets/images/social/werfie.png'
import vidmeroIcon from '../../../assets/images/social/vidmero.png'

// External KT Web app — same destination as the navbar Log In button.
const KT_WEB_URL = 'https://web.ktmessenger.com/auth/qr'

// KT Messenger's profile on each social platform, shown as a row of round
// buttons in the bottom bar. Each icon is that platform's own mark, saved in
// assets/images/social so nothing is fetched from their servers at runtime.
const SOCIAL_LINKS = [
  { name: 'Jaadoe', href: 'https://jaadoe.com/profile/ktmessenger', icon: jaadoeIcon },
  { name: 'Seezitt', href: 'https://seezitt.com/profile/ktmessenger', icon: seezittIcon },
  { name: 'WN Social', href: 'https://wnsocial.com/profile/d91d8611-eca9-4850-8273-5d232297a49c', icon: wnsocialIcon },
  { name: 'Omre', href: 'https://omre.ai/app/profile/ktmessenger', icon: omreIcon },
  { name: 'Werfie', href: 'https://werfie.com/profile/ktmessenger', icon: werfieIcon },
  { name: 'Vidmero', href: 'https://vidmero.com/@ktmessenger', icon: vidmeroIcon },
]

/**
 * Footer link targets:
 *  - `to: '/path'`    → client-side route change
 *  - `to: '#anchor'`  → home page section (navigates home first when needed)
 *  - `href: 'https://…'` → external URL (e.g. the KT Web app)
 *  - `action: 'download'` → opens the shared download modal
 * Every entry resolves to one of those, so no link is a dead anchor.
 */
const FALLBACK_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '#features' },
      { label: 'Calls', to: '/calling' },
      { label: 'Groups', to: '/groups' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Business', to: '/business' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Get KT Messenger',
    links: [
      { label: 'Android', action: 'download' },
      { label: 'iPhone', action: 'download' },
      { label: 'Mac & PC', action: 'download' },
      { label: 'KT Web', href: KT_WEB_URL },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Community', to: '/community' },
      { label: 'Status', to: '/status' },
    ],
  },
]

// Admin footer_links store only { label, href }. Translate that back into the
// three shapes this footer already knows how to handle, so behaviour is
// identical: the download modal, an external URL, or an internal route/anchor.
const DOWNLOAD_ACTION = '#download'
const toFooterLink = (row) => {
  if (row.href === DOWNLOAD_ACTION) return { label: row.label, action: 'download' }
  if (/^https?:\/\//i.test(row.href)) return { label: row.label, href: row.href }
  return { label: row.label, to: row.href }
}
// A bare "#" means the admin row exists but has no destination yet. Rendering
// it would put a dead link in the footer, so unconfigured rows are skipped
// (the row itself is left alone in the database) — and an empty section is
// dropped rather than shown as a heading with nothing under it.
const isConfigured = (row) => row.href && row.href.trim() !== '#'

// Admin locales -> the shape the picker renders. Only codes the i18n bundle
// actually supports are offered: an enabled row for a language with no
// translation table would switch the site to a code t() cannot resolve.
const toLanguages = (rows) =>
  (rows || [])
    .filter((l) => l.enabled !== false && SUPPORTED_LANGS.includes(l.code))
    .map((l) => ({ code: l.code, label: l.label, native: l.nativeLabel || l.label }))

const toFooterColumns = (rows) =>
  rows
    .map((s) => ({ title: s.title, links: (s.links || []).filter(isConfigured).map(toFooterLink) }))
    .filter((s) => s.links.length > 0)

const FALLBACK_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'nl', label: 'Dutch', native: 'Nederlands' },
  { code: 'pl', label: 'Polish', native: 'Polski' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'uk', label: 'Ukrainian', native: 'Українська' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'he', label: 'Hebrew', native: 'עברית' },
  { code: 'fa', label: 'Persian', native: 'فارسی' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'si', label: 'Sinhala', native: 'සිංහල' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली' },
  { code: 'th', label: 'Thai', native: 'ไทย' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Malay', native: 'Bahasa Melayu' },
  { code: 'fil', label: 'Filipino', native: 'Filipino' },
  { code: 'zh-Hans', label: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-Hant', label: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili' },
  { code: 'af', label: 'Afrikaans', native: 'Afrikaans' },
  { code: 'zu', label: 'Zulu', native: 'isiZulu' },
  { code: 'ha', label: 'Hausa', native: 'Hausa' },
  { code: 'yo', label: 'Yoruba', native: 'Yorùbá' },
  { code: 'am', label: 'Amharic', native: 'አማርኛ' },
  { code: 'sq', label: 'Albanian', native: 'Shqip' },
  { code: 'az', label: 'Azerbaijani', native: 'Azərbaycan' },
  { code: 'be', label: 'Belarusian', native: 'Беларуская' },
  { code: 'bg', label: 'Bulgarian', native: 'Български' },
  { code: 'ca', label: 'Catalan', native: 'Català' },
  { code: 'hr', label: 'Croatian', native: 'Hrvatski' },
  { code: 'cs', label: 'Czech', native: 'Čeština' },
  { code: 'da', label: 'Danish', native: 'Dansk' },
  { code: 'et', label: 'Estonian', native: 'Eesti' },
  { code: 'fi', label: 'Finnish', native: 'Suomi' },
  { code: 'ka', label: 'Georgian', native: 'ქართული' },
  { code: 'el', label: 'Greek', native: 'Ελληνικά' },
  { code: 'hu', label: 'Hungarian', native: 'Magyar' },
  { code: 'is', label: 'Icelandic', native: 'Íslenska' },
  { code: 'ga', label: 'Irish', native: 'Gaeilge' },
  { code: 'kk', label: 'Kazakh', native: 'Қазақ' },
  { code: 'lv', label: 'Latvian', native: 'Latviešu' },
  { code: 'lt', label: 'Lithuanian', native: 'Lietuvių' },
  { code: 'mk', label: 'Macedonian', native: 'Македонски' },
  { code: 'no', label: 'Norwegian', native: 'Norsk' },
  { code: 'ro', label: 'Romanian', native: 'Română' },
  { code: 'sr', label: 'Serbian', native: 'Српски' },
  { code: 'sk', label: 'Slovak', native: 'Slovenčina' },
]

const sitemap = [
  {
    group: 'Main',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Apps & downloads', to: '/apps' },
      { label: 'Blog', to: '/blog' },
      { label: 'Help Center', to: '/help' },
      { label: 'For Business', to: '/business' },
    ],
  },
  {
    group: 'Features',
    links: [
      { label: 'Messaging', to: '/messaging' },
      { label: 'Calling', to: '/calling' },
      { label: 'Groups', to: '/groups' },
      { label: 'Channels', to: '/channels' },
      { label: 'Status', to: '/status' },
      { label: 'KT AI', to: '/ai' },
      { label: 'KT Plus', to: '/plus' },
      { label: 'KT Minis', to: '/minis' },
      { label: 'Notes', to: '/notes' },
    ],
  },
  {
    group: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Community', to: '/community' },
    ],
  },
  {
    group: 'Trust',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Security', to: '/security' },
    ],
  },
]

export function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { openDownloadModal } = useModal()

  // Admin-managed footer, falling back to the hardcoded columns until the
  // API returns sections that actually contain links.
  // Admin-managed language list (Admin -> Locales).
  const [languages] = useRemoteContent(
    () => api.listLocales().then(toLanguages),
    FALLBACK_LANGUAGES,
  )

  const [columns] = useRemoteContent(
    () => api.getFooter().then(toFooterColumns),
    FALLBACK_COLUMNS,
    (data) => Array.isArray(data) && data.length > 0 && data.some((c) => c.links.length > 0),
  )
  const { lang, setLang, t } = useLanguage()

  const [langOpen, setLangOpen] = useState(false)
  const language = languages.find((option) => option.code === lang) || languages[0]
  const [sitemapOpen, setSitemapOpen] = useState(false)
  const langRef = useRef(null)

  // Close the language menu on an outside click or Escape.
  useEffect(() => {
    if (!langOpen) return undefined

    const onPointerDown = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLangOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [langOpen])

  /** Routes, home-page anchors and modals all funnel through here. */
  const go = (link) => {
    if (link.action === 'download') {
      openDownloadModal()
      return
    }

    if (link.href) {
      window.location.href = link.href
      return
    }

    const target = link.to

    if (target.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/')
        window.setTimeout(() => {
          document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    // Section deep-link on another route, e.g. /community#social
    const [path, hash] = target.split('#')

    if (location.pathname === path && !hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    navigate(path)

    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 320)
      return
    }

    window.scrollTo(0, 0)
  }

  const selectLanguage = (option) => {
    setLang(option.code)
    setLangOpen(false)
  }

  return (
    <footer id="footer" className="border-t border-line bg-cream-2 pt-16 pb-10 transition-colors duration-500 lg:pt-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <button onClick={() => go({ to: '/' })} aria-label={t('KT Messenger home')} className="block">
              <Logo />
            </button>

            <p className="mt-5 text-[15px] leading-7 text-body">
              {t('Simple, secure messaging and calling that keeps everyone you care about in the loop.')}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={t(column.title)} className="space-y-4">
              <h4 className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink">{t(column.title)}</h4>
              <ul className="space-y-3 text-[15px] text-body">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => go(link)}
                      className="text-left transition-colors hover:text-brand-ink"
                    >
                      {t(link.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            {/* LANGUAGE PICKER */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-medium text-body transition-colors hover:text-ink"
              >
                <FiGlobe /> {language.native}
                <FiChevronDown className={`text-xs transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen ? (
                <ul
                  role="listbox"
                  aria-label="Select language"
                  className="absolute bottom-full left-0 z-30 mb-2 max-h-[min(30rem,70vh)] w-[min(24rem,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-float"
                >
                  {languages.map((option) => {
                    const active = option.code === lang
                    return (
                      <li key={option.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => selectLanguage(option)}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                            active ? 'bg-brand-soft font-bold text-brand-ink' : 'text-body hover:bg-surface-2 hover:text-ink'
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">{option.native}</span>
                            <span className="block truncate text-[11px] text-muted">{option.label}</span>
                          </span>
                          {active ? <FiCheck className="shrink-0" /> : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>

            <button type="button" onClick={() => go({ to: '/privacy' })} className="transition-colors hover:text-ink">
              {t('Terms & Privacy Policy')}
            </button>

            <button type="button" onClick={() => setSitemapOpen(true)} className="transition-colors hover:text-ink">
              {t('Sitemap')}
            </button>

            {/* SOCIAL PROFILES. The chip is white in both themes: these marks
                are drawn for a light background, and two of them carry one of
                their own. */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition-colors hover:border-brand-strong"
                >
                  {/* The link already carries the platform name, so the icon is decorative. */}
                  <img src={social.icon} alt="" width="24" height="24" loading="lazy" className="h-6 w-6 object-contain" />
                </a>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted">{`© 2026 KT Messenger. ${t('All rights reserved.')}`}</p>
        </div>
      </Container>

      {/* SITEMAP */}
      <Modal
        open={sitemapOpen}
        onClose={() => setSitemapOpen(false)}
        eyebrow="Sitemap"
        title="Every page on this site"
        size="lg"
      >
        <div className="grid gap-8 sm:grid-cols-2">
          {sitemap.map((group) => (
            <div key={group.group}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">{group.group}</h4>
              <ul className="mt-3 space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <button
                      type="button"
                      onClick={() => {
                        setSitemapOpen(false)
                        go(link)
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-body transition-colors hover:bg-surface-2 hover:text-brand-ink"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Modal>
    </footer>
  )
}

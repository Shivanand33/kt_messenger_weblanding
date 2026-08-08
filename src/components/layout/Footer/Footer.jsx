import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FiCheck,
  FiChevronDown,
  FiFacebook,
  FiGlobe,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from 'react-icons/fi'
import { Container } from '../../common/Container/Container'
import { Logo } from '../../common/Logo/Logo'
import { Modal } from '../../feature/Modal'
import { useModal } from '../../../context/ModalContext'

/**
 * Footer link targets:
 *  - `to: '/path'`    → client-side route change
 *  - `to: '#anchor'`  → home page section (navigates home first when needed)
 *  - `action: 'download'` → opens the shared download modal
 * Every entry resolves to one of those, so no link is a dead anchor.
 */
const columns = [
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
      { label: 'Brand Center', to: '/brand' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Get KT Messengers',
    links: [
      { label: 'Android', action: 'download' },
      { label: 'iPhone', action: 'download' },
      { label: 'Mac & PC', action: 'download' },
      { label: 'KT Web', to: '#web' },
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

// Social icons open the Community page's verified-channels section, which is
// where every official account is listed.
const socials = [
  { icon: <FiTwitter />, label: 'X (Twitter)' },
  { icon: <FiInstagram />, label: 'Instagram' },
  { icon: <FiYoutube />, label: 'YouTube' },
  { icon: <FiFacebook />, label: 'Facebook' },
]

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
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
    ],
  },
  {
    group: 'In-chat surfaces',
    links: [
      { label: 'News', to: '/news' },
      { label: 'Markets', to: '/markets' },
      { label: 'Wallet', to: '/wallet' },
      { label: 'Marketplace', to: '/marketplace' },
      { label: 'Notes', to: '/notes' },
    ],
  },
  {
    group: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Brand Center', to: '/brand' },
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

  const [langOpen, setLangOpen] = useState(false)
  const [language, setLanguage] = useState(languages[0])
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
    setLanguage(option)
    setLangOpen(false)
    document.documentElement.lang = option.code
  }

  return (
    <footer id="footer" className="border-t border-line bg-cream-2 pt-16 pb-10 transition-colors duration-500 lg:pt-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <button onClick={() => go({ to: '/' })} aria-label="KT Messengers home" className="block">
              <Logo />
            </button>

            <p className="mt-5 text-[15px] leading-7 text-body">
              Simple, secure messaging and calling that keeps everyone you care about in the loop.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((social) => (
                <button
                  key={social.label}
                  type="button"
                  onClick={() => go({ to: '/community#social' })}
                  aria-label={`${social.label} — see our official channels`}
                  title={`${social.label} — see our official channels`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-body transition-colors hover:border-brand/40 hover:text-brand-ink"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="space-y-4">
              <h4 className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink">{column.title}</h4>
              <ul className="space-y-3 text-[15px] text-body">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => go(link)}
                      className="text-left transition-colors hover:text-brand-ink"
                    >
                      {link.label}
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
                  className="absolute bottom-full left-0 z-30 mb-2 max-h-64 w-56 overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-float"
                >
                  {languages.map((option) => {
                    const active = option.code === language.code
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
              Terms &amp; Privacy Policy
            </button>

            <button type="button" onClick={() => setSitemapOpen(true)} className="transition-colors hover:text-ink">
              Sitemap
            </button>
          </div>

          <p className="text-sm text-muted">© 2026 KT Messengers. All rights reserved.</p>
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

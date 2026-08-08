import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiArrowUpRight,
  FiDownload,
  FiPhone,
  FiMessageSquare,
  FiUsers,
  FiTv,
  FiZap,
  FiRadio,
  FiShield,
  FiStar,
  FiGlobe,
  FiTrendingUp,
  FiCreditCard,
  FiShoppingBag,
  FiEdit3
} from 'react-icons/fi'
import { Container } from '../../common/Container/Container'
import { Button } from '../../common/Button/Button'
import { Logo } from '../../common/Logo/Logo'
import { useModal } from '../../../context/ModalContext'

const featureItems = [
  { label: 'Calling', to: '/calling', icon: <FiPhone /> },
  { label: 'Messaging', to: '/messaging', icon: <FiMessageSquare /> },
  { label: 'Groups', to: '/groups', icon: <FiUsers /> },
  { label: 'Channels', to: '/channels', icon: <FiTv /> },
  { label: 'KT AI', to: '/ai', icon: <FiZap /> },
  { label: 'Status', to: '/status', icon: <FiRadio /> },
  { label: 'Security', to: '/security', icon: <FiShield /> },
  { label: 'KT Plus', to: '/plus', icon: <FiStar /> },
  { label: 'News', to: '/news', icon: <FiGlobe /> },
  { label: 'Markets', to: '/markets', icon: <FiTrendingUp /> },
  { label: 'Wallet', to: '/wallet', icon: <FiCreditCard /> },
  { label: 'Marketplace', to: '/marketplace', icon: <FiShoppingBag /> },
  { label: 'Notes', to: '/notes', icon: <FiEdit3 /> }
]

const navLinks = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Blog', to: '/blog' },
  { label: 'Apps', to: '/apps' },
  { label: 'Help Center', to: '/help', external: true },
  { label: 'For Business', to: '/business', external: true },
]

const SECTION_IDS = ['hero', 'web', 'devices', 'calls', 'privacy', 'groups', 'expression', 'business', 'features', 'download']

// Logging in hands off to the web client, which owns device linking.
const LOGIN_URL = 'https://web.ktmessenger.com/auth/qr'

export function Navbar() {
  const { openDownloadModal } = useModal()
  const [open, setOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [mobileFeatures, setMobileFeatures] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const featuresRef = useRef(null)
  const closeTimer = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [location.pathname])

  useEffect(() => {
    if (!featuresOpen) return undefined
    const onDocClick = (event) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) setFeaturesOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [featuresOpen])

  const go = (target) => {
    setOpen(false)
    setFeaturesOpen(false)
    setMobileFeatures(false)
    if (target.startsWith('/')) {
      if (location.pathname !== target) navigate(target)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (location.pathname !== '/') {
      navigate('/')
      window.setTimeout(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 280)
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const isActive = (href) => location.pathname === '/' && active === href.slice(1)
  const isRouteActive = (to) => location.pathname === to
  const featuresActive =
    featuresOpen ||
    featureItems.some((item) => (item.to ? isRouteActive(item.to) : isActive(item.href)))

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled
          ? 'border-line bg-cream/85 shadow-[0_10px_30px_-24px_rgba(17,27,33,0.55)]'
          : 'border-transparent bg-cream/60'
      }`}
    >
      <Container className="flex h-16 items-center justify-between lg:h-[72px]">
        <button onClick={() => go('#hero')} aria-label="KT Messengers home" className="shrink-0">
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            ref={featuresRef}
            onMouseEnter={() => { clearTimeout(closeTimer.current); setFeaturesOpen(true) }}
            onMouseLeave={() => { closeTimer.current = setTimeout(() => setFeaturesOpen(false), 130) }}
          >
            <button
              onClick={() => setFeaturesOpen((value) => !value)}
              aria-haspopup="true"
              aria-expanded={featuresOpen}
              className="relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink"
            >
              Features
              <FiChevronDown className={`text-xs transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`} />
              {featuresActive ? <span className="absolute inset-x-3.5 bottom-0.5 h-0.5 rounded-full bg-brand" /> : null}
            </button>

            {/* FEATURES DROPDOWN POPUP MENU
                Rendered with a plain conditional: AnimatePresence leaves the
                exiting panel mounted on this React version, and an invisible
                dropdown keeps intercepting clicks on the page beneath it. */}
            {featuresOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute left-0 top-full z-50 mt-2 w-60 max-h-[460px] overflow-y-auto rounded-2xl border border-[#2a3942] bg-[#111b21] p-2 shadow-2xl [scrollbar-width:thin]"
              >
                {featureItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => go(item.to || item.href)}
                    className="flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-left text-[14px] font-semibold text-[#e9edef] transition-colors hover:bg-[#1a2733] hover:text-[#2e90fa] group"
                  >
                    <span className="text-base text-brand-strong group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </motion.div>
            ) : null}
          </div>

          {navLinks.map((link) => {
            const linkActive = link.to ? isRouteActive(link.to) : isActive(link.href)
            return (
              <button
                key={link.label}
                onClick={() => go(link.to || link.href)}
                className="relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:text-brand-ink"
              >
                {link.label}
                {link.external ? <FiArrowUpRight className="text-xs" /> : null}
                {linkActive ? <span className="absolute inset-x-3.5 bottom-0.5 h-0.5 rounded-full bg-brand" /> : null}
              </button>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2.5 sm:flex">
          <Button variant="ghost" href={LOGIN_URL}>
            Log In <FiChevronRight className="text-xs" />
          </Button>
          <Button onClick={openDownloadModal}>
            Download <FiDownload />
          </Button>
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle Navigation"
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink lg:hidden"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </Container>

      {/* MOBILE MENU */}
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="overflow-hidden border-b border-line bg-cream lg:hidden"
        >
            <Container className="space-y-4 py-5">
              <div className="space-y-1">
                <button
                  onClick={() => setMobileFeatures((val) => !val)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-semibold text-ink hover:bg-surface-2"
                >
                  <span>Features</span>
                  <FiChevronDown className={`transition-transform ${mobileFeatures ? 'rotate-180' : ''}`} />
                </button>

                {mobileFeatures ? (
                  <div className="ml-3 space-y-1 border-l-2 border-brand/30 pl-3">
                    {featureItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => go(item.to || item.href)}
                        className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-body hover:bg-surface-2"
                      >
                        <span className="text-brand-strong">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => go(link.to || link.href)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-semibold text-ink hover:bg-surface-2"
                  >
                    <span>{link.label}</span>
                    {link.external ? <FiArrowUpRight className="text-xs" /> : null}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-line">
                <Button variant="ghost" href={LOGIN_URL} onClick={() => setOpen(false)} className="w-full justify-center">
                  Log In
                </Button>
                <Button onClick={openDownloadModal} className="w-full justify-center">
                  Download <FiDownload />
                </Button>
              </div>
          </Container>
        </motion.div>
      ) : null}
    </motion.header>
  )
}

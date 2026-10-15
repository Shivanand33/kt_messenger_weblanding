import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiChevronDown,
  FiBriefcase,
  FiShoppingBag,
  FiSend,
  FiBookOpen,
  FiFileText,
  FiTrendingUp,
  FiHelpCircle,
  FiLayers,
  FiLink,
  FiFilePlus,
  FiUserCheck,
  FiMenu,
  FiX,
} from 'react-icons/fi'
import { Logo } from '../../components/common/Logo/Logo'
import { useLanguage } from '../../context/LanguageContext'

const DARK = '#0b162c'

const triggerClass = (open) =>
  `inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
    open ? 'text-sky-400' : 'text-white/90 hover:text-white'
  }`

const chevronClass = (open) =>
  `text-xs transition-transform duration-200 ${open ? 'rotate-180 text-sky-400' : ''}`

const popAnim = {
  initial: { opacity: 0, y: 6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.98 },
  transition: { duration: 0.16 },
}

function MenuButton({ onClick, className = '', children }) {
  return (
    <button onClick={onClick} className={`block w-full text-left text-slate-700 hover:text-brand-strong transition-colors ${className}`}>
      {children}
    </button>
  )
}

/**
 * The KT Business top bar, shared by the Business pages. Same dark sticky
 * header, mega menus and destinations as the main Business page navbar.
 */
export function BusinessNavbar() {
  const navigate = useNavigate()
  const { t: tr } = useLanguage()
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const go = (path) => {
    setActiveMenu(null)
    setMobileMenuOpen(false)
    if (path.startsWith('/')) {
      navigate(path)
      window.scrollTo(0, 0)
    }
  }

  const hoverProps = (name) => ({
    className: 'relative',
    onMouseEnter: () => { clearTimeout(closeTimer.current); setActiveMenu(name) },
    onMouseLeave: () => { closeTimer.current = setTimeout(() => setActiveMenu(null), 150) },
  })

  const t = {
    navProducts: tr('Products'),
    navResources: tr('Resources'),
    navDevelopers: tr('Developers'),
    navPartners: tr('Partners'),
    btnGetStarted: tr('Get started'),
    btnDownloadApp: tr('Download app'),
    bizPlatform: tr('Business Platform'),
    bizApp: tr('Business App'),
    adsClick: tr('Ads that click to KT'),
    overview: tr('Overview'),
    features: tr('Features'),
    pricing: tr('Pricing'),
    flows: tr('KT Flows'),
    msgCategories: tr('Message categories:'),
    marketingMsg: tr('Marketing messages'),
    authMsg: tr('Authentication messages'),
    utilityMsg: tr('Utility messages'),
    serviceMsg: tr('Service messages'),
    howToStart: tr('How to get started'),
    bizAgent: tr('KT Business Agent'),
    howCreateAd: tr('How to create an ad'),
    adsStatusChannels: tr('Ads in Status and Channels'),
    resourceLib: tr('Resource Library'),
    blog: tr('Blog'),
    successStories: tr('Success Stories'),
    faqs: tr('FAQs'),
    platform: tr('Platform'),
    devHub: tr('Developer Hub'),
    comingSoon: tr('Coming soon'),
    devLinks: tr('Developer Links'),
    community: tr('Community'),
    devSupport: tr('Developer Support'),
    apiStatus: tr('API Status'),
    becomePartner: tr('Become a Partner'),
    findPartner: tr('Find a Partner'),
  }

  const mobileLinks = [
    { label: t.bizPlatform, to: '/business-messaging-app' },
    { label: t.bizApp, to: '/business/app-download' },
    { label: t.features, to: '/business/app-features' },
    { label: t.pricing, to: '/business/pricing' },
    { label: t.resourceLib, to: '/messaging-app-help' },
    { label: t.blog, to: '/messaging-social-media-blog' },
    { label: t.devHub, to: '/business/developer-hub' },
    { label: t.becomePartner, to: '/business/become-partner' },
  ]

  return (
    <header style={{ backgroundColor: DARK }} className="sticky top-0 z-50 border-b border-slate-800 text-white shadow-md select-none" ref={menuRef}>
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-3.5 lg:px-8 relative">
        <div className="flex items-center gap-8">
          <button onClick={() => go('/business-messaging-app')} className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            <Logo showWordmark={false} markClassName="h-9 w-9" />
            <span>KT Business</span>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            {/* PRODUCTS */}
            <div {...hoverProps('products')}>
              <button onClick={() => setActiveMenu(activeMenu === 'products' ? null : 'products')} className={triggerClass(activeMenu === 'products')}>
                <span>{t.navProducts}</span>
                <FiChevronDown className={chevronClass(activeMenu === 'products')} />
              </button>
              <AnimatePresence>
                {activeMenu === 'products' && (
                  <motion.div {...popAnim} className="absolute left-0 top-full pt-3 z-50 w-[940px] select-text">
                    <div className="relative rounded-[28px] bg-white text-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] p-8 border border-slate-100">
                      <div className="absolute -top-3 left-6 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
                      <h3 className="text-xl font-extrabold text-slate-900 border-b pb-3 mb-6">{t.navProducts}</h3>
                      <div className="grid grid-cols-3 gap-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-base">
                            <FiBriefcase className="text-brand-strong text-lg" />
                            <span>{t.bizPlatform}</span>
                          </div>
                          <div className="space-y-2 text-sm font-semibold">
                            <MenuButton onClick={() => go('/business-messaging-app')}>{t.overview}</MenuButton>
                            <MenuButton onClick={() => go('/business/features')}>{t.features}</MenuButton>
                            <MenuButton onClick={() => go('/business/pricing')}>{t.pricing}</MenuButton>
                            <MenuButton onClick={() => go('/business/flows')}>{t.flows}</MenuButton>
                            <div className="pt-2">
                              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">{t.msgCategories}</p>
                              <div className="pl-2 space-y-1.5 text-xs font-semibold text-slate-600">
                                <MenuButton onClick={() => go('/business/msg-marketing')} className="text-slate-600">{t.marketingMsg}</MenuButton>
                                <MenuButton onClick={() => go('/business/msg-authentication')} className="text-slate-600">{t.authMsg}</MenuButton>
                                <MenuButton onClick={() => go('/business/msg-utility')} className="text-slate-600">{t.utilityMsg}</MenuButton>
                                <MenuButton onClick={() => go('/business/msg-service')} className="text-slate-600">{t.serviceMsg}</MenuButton>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-base">
                            <FiShoppingBag className="text-brand-strong text-lg" />
                            <span>{t.bizApp}</span>
                          </div>
                          <div className="space-y-2 text-sm font-semibold">
                            <MenuButton onClick={() => go('/business/app-download')}>{t.overview}</MenuButton>
                            <MenuButton onClick={() => go('/business/app-features')}>{t.features}</MenuButton>
                            <MenuButton onClick={() => go('/business/get-started')}>{t.howToStart}</MenuButton>
                            <MenuButton onClick={() => go('/business/agent')}>{t.bizAgent}</MenuButton>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-base">
                            <FiSend className="text-brand-strong text-lg" />
                            <span>{t.adsClick}</span>
                          </div>
                          <div className="space-y-2 text-sm font-semibold">
                            <MenuButton onClick={() => go('/business/ads')}>{t.overview}</MenuButton>
                            <MenuButton onClick={() => go('/business/ads-create')}>{t.howCreateAd}</MenuButton>
                            <MenuButton onClick={() => go('/business/ads-status-channels')}>{t.adsStatusChannels}</MenuButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RESOURCES */}
            <div {...hoverProps('resources')}>
              <button onClick={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')} className={triggerClass(activeMenu === 'resources')}>
                <span>{t.navResources}</span>
                <FiChevronDown className={chevronClass(activeMenu === 'resources')} />
              </button>
              <AnimatePresence>
                {activeMenu === 'resources' && (
                  <motion.div {...popAnim} className="absolute -left-12 top-full pt-3 z-50 w-80 select-text">
                    <div className="relative rounded-[24px] bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] p-6 border border-slate-100">
                      <div className="absolute -top-3 left-16 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
                      <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2 mb-4">{t.navResources}</h3>
                      <div className="space-y-3">
                        <button onClick={() => go('/messaging-app-help')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
                          <FiBookOpen className="text-brand-strong text-xl shrink-0" />
                          <span className="font-bold text-slate-900 group-hover:text-brand-strong transition-colors text-sm">{t.resourceLib}</span>
                        </button>
                        <button onClick={() => go('/messaging-social-media-blog')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
                          <FiFileText className="text-brand-strong text-xl shrink-0" />
                          <span className="font-bold text-slate-900 group-hover:text-brand-strong transition-colors text-sm">{t.blog}</span>
                        </button>
                        <button onClick={() => go('/business-messaging-app')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
                          <FiTrendingUp className="text-brand-strong text-xl shrink-0" />
                          <span className="font-bold text-slate-900 group-hover:text-brand-strong transition-colors text-sm">{t.successStories}</span>
                        </button>
                        <button onClick={() => go('/messaging-app-help')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
                          <FiHelpCircle className="text-brand-strong text-xl shrink-0" />
                          <span className="font-bold text-slate-900 group-hover:text-brand-strong transition-colors text-sm">{t.faqs}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DEVELOPERS */}
            <div {...hoverProps('developers')}>
              <button onClick={() => setActiveMenu(activeMenu === 'developers' ? null : 'developers')} className={triggerClass(activeMenu === 'developers')}>
                <span>{t.navDevelopers}</span>
                <FiChevronDown className={chevronClass(activeMenu === 'developers')} />
              </button>
              <AnimatePresence>
                {activeMenu === 'developers' && (
                  <motion.div {...popAnim} className="absolute -left-16 top-full pt-3 z-50 w-[420px] select-text">
                    <div className="relative rounded-[24px] bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] p-6 border border-slate-100">
                      <div className="absolute -top-3 left-20 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
                      <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
                        {t.navDevelopers}
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">{t.comingSoon}</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-sm">
                            <FiLayers className="text-brand-strong text-lg" />
                            <span>{t.platform}</span>
                          </div>
                          <div className="space-y-2 text-xs font-semibold">
                            <MenuButton onClick={() => go('/business/developer-hub')} className="text-xs">{t.devHub}</MenuButton>
                            <MenuButton onClick={() => go('/business/developer-quickstart')} className="text-xs">{t.howToStart}</MenuButton>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-sm">
                            <FiLink className="text-brand-strong text-lg" />
                            <span>{t.devLinks}</span>
                          </div>
                          <div className="space-y-2 text-xs font-semibold">
                            <MenuButton onClick={() => go('/business/community')} className="text-xs">{t.community}</MenuButton>
                            <MenuButton onClick={() => go('/business/developer-support')} className="text-xs">{t.devSupport}</MenuButton>
                            <MenuButton onClick={() => go('/business/api-status')} className="text-xs">{t.apiStatus}</MenuButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PARTNERS */}
            <div {...hoverProps('partners')}>
              <button onClick={() => setActiveMenu(activeMenu === 'partners' ? null : 'partners')} className={triggerClass(activeMenu === 'partners')}>
                <span>{t.navPartners}</span>
                <FiChevronDown className={chevronClass(activeMenu === 'partners')} />
              </button>
              <AnimatePresence>
                {activeMenu === 'partners' && (
                  <motion.div {...popAnim} className="absolute -left-16 top-full pt-3 z-50 w-72 select-text">
                    <div className="relative rounded-[28px] bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] p-6 border border-slate-100">
                      <div className="absolute -top-3 left-20 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
                      <h3 className="text-lg font-extrabold text-slate-800 mb-4">{t.navPartners}</h3>
                      <div className="space-y-4">
                        <button onClick={() => go('/business/become-partner')} className="flex items-center gap-3.5 w-full text-left text-slate-800 hover:text-brand-strong font-bold transition-colors group">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-brand-strong border border-sky-200 group-hover:bg-brand-strong group-hover:text-white transition-colors">
                            <FiFilePlus className="text-lg" />
                          </div>
                          <span className="text-[15px]">{t.becomePartner}</span>
                        </button>
                        <button onClick={() => go('/business/find-partner')} className="flex items-center gap-3.5 w-full text-left text-slate-800 hover:text-brand-strong font-bold transition-colors group">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-brand-strong border border-sky-200 group-hover:bg-brand-strong group-hover:text-white transition-colors">
                            <FiUserCheck className="text-lg" />
                          </div>
                          <span className="text-[15px]">{t.findPartner}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go('/business/get-started')}
            className="rounded-full bg-brand-strong hover:bg-brand-strong-hover px-6 py-2.5 text-sm font-bold text-white shadow-brand transition-all hover:scale-105 active:scale-95"
          >
            {t.btnGetStarted}
          </button>
          <button onClick={() => go('/business/app-download')} className="hidden rounded-full bg-white px-6 py-2.5 text-sm font-extrabold transition-all hover:scale-105 sm:block" style={{ color: DARK }}>
            {t.btnDownloadApp}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-800 md:hidden"
          >
            <div className="space-y-1 px-5 py-4">
              {mobileLinks.map((l) => (
                <button
                  key={l.to + l.label}
                  onClick={() => go(l.to)}
                  className="block w-full rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

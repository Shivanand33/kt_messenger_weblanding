import { img, imgAlt } from '../../utils/imageOverrides'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowRight,
  FiSearch,
  FiX,
  FiPlus,
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
  FiMenu,
  FiFilePlus,
  FiUserCheck,
  FiZap,
  FiCheck,
  FiTag,
  FiLock,
  FiBarChart2,
  FiTarget
} from 'react-icons/fi'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Logo } from '../../components/common/Logo/Logo'
import { ThemeToggle } from '../../components/common/ThemeToggle/ThemeToggle'
import { Footer } from '../../components/layout/Footer/Footer'
import { useLanguage } from '../../context/LanguageContext'

import heroImg from '../../assets/images/online-marketplace-app-business.jpg'
import whyImg from '../../assets/images/messaging-app-private-chat.jpg'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useSeo } from '../../hooks/useSeo'

const DARK = '#0b162c'

function Sparkle({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 0l2.5 7.5L20 10l-7.5 2.5L10 20l-2.5-7.5L0 10l7.5-2.5z" />
    </svg>
  )
}

export function BusinessPage() {
  // Per-page SEO from admin (Website Content -> seo.business).
  // No block configured = unchanged behaviour.
  // Canonical for this page (follows the URL it is opened at).
  useSeo({
    title: 'KT Messenger for Business | Secure Team Messaging & Tools.',
    description: 'Run customer conversations, catalogs and automation with KT Messenger Business — secure messaging tools for teams and small businesses.',
    path: '/business-messaging-app',
  })
  useAdminSeo('business', '/business-messaging-app')

  const navigate = useNavigate()
  // The page follows the site language; its region chip switches English <-> Hindi.
  const { lang, setLang, t: tr } = useLanguage()
  const [topBannerClosed, setTopBannerClosed] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null) // 'products' | 'resources' | 'developers' | 'partners' | null
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openWhy, setOpenWhy] = useState(0)

  // GET STARTED ONBOARDING WIZARD MODAL STATE (BUSINESS WORKFLOW)
  const [getStartedOpen, setGetStartedOpen] = useState(false)
  const [leadForm, setLeadForm] = useState({ firstName: '', lastName: '', email: '', jobRole: '', company: '', employees: '', headquarters: '', infoType: '', consent: false })
  const [leadErrors, setLeadErrors] = useState({})
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isHindi = lang === 'hi'
  const toggleLang = () => setLang(isHindi ? 'en' : 'hi')

  const go = (path) => {
    setActiveMenu(null)
    setMobileMenuOpen(false)
    setSearchOpen(false)
    if (path.startsWith('/')) {
      navigate(path)
      window.scrollTo(0, 0)
    }
  }

  const openGetStarted = () => {
    setLeadSubmitted(false)
    setLeadErrors({})
    setGetStartedOpen(true)
  }

  const setLead = (key, value) => {
    setLeadForm((f) => ({ ...f, [key]: value }))
    setLeadErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submitLead = () => {
    const errors = {}
    if (!leadForm.firstName.trim()) errors.firstName = true
    if (!leadForm.lastName.trim()) errors.lastName = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email.trim())) errors.email = true
    if (!leadForm.jobRole) errors.jobRole = true
    if (!leadForm.company.trim()) errors.company = true
    if (!leadForm.employees) errors.employees = true
    if (!leadForm.headquarters) errors.headquarters = true
    if (!leadForm.infoType) errors.infoType = true
    if (!leadForm.consent) errors.consent = true
    setLeadErrors(errors)
    if (Object.keys(errors).length === 0) setLeadSubmitted(true)
  }

  const leadInputClass = (hasError) =>
    `w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:ring-2 ${hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-brand-strong focus:ring-sky-200'}`

  // Translation Dictionary
  const t = {
    topBannerText: tr('Did we select the right country/region?'),
    countryName: tr('Global'),
    announcementText: tr('Personalization at scale, in every KT conversation. Meet KT Business Agent.'),
    learnMore: tr('Learn more'),
    navProducts: tr('Products'),
    navResources: tr('Resources'),
    navDevelopers: tr('Developers'),
    navPartners: tr('Partners'),
    btnGetStarted: tr('Get started'),
    btnDownloadApp: tr('Download app'),

    // Hero Text
    heroTitle: tr('Turn conversations into customers'),
    heroDesc: tr('Reach and engage more than 2 billion people with AI powered messaging built for business.'),
    bubble1: tr('I need a small plant! 🌱'),
    bubble2: tr("You'll love our Mini Pothos 🪴"),
    bubble3: tr('Order #KT4821 confirmed ✓'),

    // Mega Menu Products
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

    // Mega Menu Resources
    resourceLib: tr('Resource Library'),
    blog: tr('Blog'),
    successStories: tr('Success Stories'),
    faqs: tr('FAQs'),

    // Mega Menu Developers
    platform: tr('Platform'),
    devHub: tr('Developer Hub'),
    devLinks: tr('Developer Links'),
    community: tr('Community'),
    devSupport: tr('Developer Support'),
    apiStatus: tr('API Status'),

    // Mega Menu Partners
    becomePartner: tr('Become a Partner'),
    findPartner: tr('Find a Partner')
  }

  const products = [
    {
      icon: '📱',
      title: tr('KT Business App'),
      desc: tr('For small business owners who manage customer conversations on their phone. Share a catalog, automate quick replies, and organize your chats.'),
      cta: tr('Learn about the app'),
      to: '/business/app-download'
    },
    {
      icon: '⚡',
      title: tr('KT Business Platform (API)'),
      desc: tr('For medium & large businesses looking to scale customer engagement via enterprise grade messaging APIs, AI tools, and CRM integrations.'),
      cta: tr('Explore Platform API'),
      to: '/secure-messaging-app'
    }
  ]

  // `desc` says what the feature is; `steps` say how it is actually used, in
  // the order an owner would do it. Both are kept to a similar length across
  // the eight, because the cards sit in a fixed four-up grid where one long
  // entry leaves its neighbours with a band of empty space.
  const features = [
    {
      icon: FiUserCheck,
      title: tr('Business profile'),
      desc: tr('Publish your hours, address, website and catalog on one verified profile, so customers know who they are buying from.'),
      steps: [
        tr('Add your hours, address and links'),
        tr('Verify your business phone number'),
        tr('Customers see it before they message'),
      ],
    },
    {
      icon: FiShoppingBag,
      title: tr('Product catalog'),
      desc: tr('Show your products and services inside the chat itself, so customers can browse, ask and order without leaving it.'),
      steps: [
        tr('Add each item with a photo and price'),
        tr('Share the catalog link in a chat'),
        tr('Customers browse and order from there'),
      ],
    },
    {
      icon: FiZap,
      title: tr('Quick replies & automation'),
      desc: tr('Save your common answers once and send them in a tap, with greetings for new chats and away notes after hours.'),
      steps: [
        tr('Save the answers you type most often'),
        tr('Set a greeting and an away message'),
        tr('Send a saved reply with one tap'),
      ],
    },
    {
      icon: FiTag,
      title: tr('Labels & organization'),
      desc: tr('Tag each chat by stage — new, paid, shipped — with color-coded labels, so no order is forgotten halfway through.'),
      steps: [
        tr('Create labels: new, paid and shipped'),
        tr('Tag each chat as the order moves on'),
        tr('Filter by label to see what is pending'),
      ],
    },
    {
      icon: FiSend,
      title: tr('Broadcast messages'),
      desc: tr('Send an offer or a restock notice to many customers at once, and it arrives in each chat as a personal message.'),
      steps: [
        tr('Pick the customers you want to reach'),
        tr('Write the offer or update once'),
        tr('Each one receives it as a private chat'),
      ],
    },
    {
      icon: FiLock,
      title: tr('Private by default'),
      desc: tr('Every message is encrypted end to end by the KT Encryption Protocol, so only you and your customer can read it.'),
      steps: [
        tr('Encryption turns itself on, always'),
        tr('The keys stay on the two devices'),
        tr('Nobody in between can read the chat'),
      ],
    },
    {
      icon: FiBarChart2,
      title: tr('Business analytics'),
      desc: tr('See what was sent, delivered, read and replied to, so you learn which messages bring customers back and which to drop.'),
      steps: [
        tr('Open the stats in your business tools'),
        tr('Read sent, delivered, read and replied'),
        tr('Repeat what worked, drop what did not'),
      ],
    },
    {
      icon: FiTarget,
      title: tr('Advertising that clicks to chat'),
      desc: tr('Run ads that open a chat the moment someone taps, so your ad spend starts a conversation instead of a page visit.'),
      steps: [
        tr('Create an ad with a chat button'),
        tr('One tap opens a chat with your shop'),
        tr('Reply and turn the click into an order'),
      ],
    },
  ]

  const whyItems = [
    {
      q: tr('Why should my business use KT Messenger?'),
      a: tr('KT Messenger connects you to over 2 billion global users on a platform they already check daily. With 98% open rates and instant 1-on-1 interaction, it outperforms traditional email and SMS.')
    },
    {
      q: tr('What is the difference between the KT Business App and Platform API?'),
      a: tr('The Business App is free and designed for small businesses using a single mobile device. The Platform API is built for larger teams requiring multi agent inboxes, automated AI workflows, and custom CRM integrations.')
    },
    {
      q: tr('Is customer data secure on KT Business?'),
      a: tr('Yes. All messages benefit from KT Encryption Protocol end to end encryption by default. Your business and customer communications remain private and protected.')
    }
  ]

  return (
    <div className="min-h-screen bg-cream text-ink dark:bg-surface font-sans" ref={menuRef}>
      
      {/* 1. TOP REGION SELECTOR BANNER */}
      {!topBannerClosed && (
        <div className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200 py-2 border-b border-line text-xs font-semibold select-none">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 lg:px-8">
            <div className="flex items-center gap-2">
              <span>{t.topBannerText}</span>
              <button
                onClick={toggleLang}
                className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-0.5 font-bold text-brand-strong hover:bg-sky-50 transition-all shadow-sm"
              >
                <span>{t.countryName}</span>
                <FiArrowRight className="text-[11px]" />
              </button>
            </div>
            <button
              onClick={() => setTopBannerClosed(true)}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* 2. STYLISH DARK HEADER NAVBAR FOR BUSINESS PAGE */}
      <header style={{ backgroundColor: DARK }} className="sticky top-0 z-50 border-b border-slate-800 text-white shadow-md select-none">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-3.5 lg:px-8 relative">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
              <Logo showWordmark={false} markClassName="h-9 w-9" />
              <span>KT Business</span>
            </button>

            {/* DESKTOP NAV WITH BLUE HOVER STATE */}
            <nav className="hidden items-center gap-7 md:flex">
              
              {/* PRODUCTS MENU TRIGGER */}
              <div
                className="relative"
                onMouseEnter={() => { clearTimeout(closeTimer.current); setActiveMenu('products') }}
                onMouseLeave={() => { closeTimer.current = setTimeout(() => setActiveMenu(null), 150) }}
              >
                <button
                  onClick={() => setActiveMenu(activeMenu === 'products' ? null : 'products')}
                  className={`inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                    activeMenu === 'products' ? 'text-sky-400' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>{t.navProducts}</span>
                  <FiChevronDown className={`text-xs transition-transform duration-200 ${activeMenu === 'products' ? 'rotate-180 text-sky-400' : ''}`} />
                </button>

                {/* PRODUCTS POPUP */}
                <AnimatePresence>
                  {activeMenu === 'products' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-0 top-full pt-3 z-50 w-[940px] select-text"
                    >
                      <div className="relative rounded-[28px] bg-white text-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] p-8 border border-slate-100">
                        <div className="absolute -top-3 left-6 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
                        
                        <h3 className="text-xl font-extrabold text-slate-900 border-b pb-3 mb-6">{t.navProducts}</h3>
                        
                        <div className="grid grid-cols-3 gap-8">
                          {/* COL 1 */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-base">
                              <FiBriefcase className="text-brand-strong text-lg" />
                              <span>{t.bizPlatform}</span>
                            </div>
                            <div className="space-y-2 text-sm font-semibold">
                              <button onClick={() => go('/business-messaging-app')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.overview}</button>
                              <button onClick={() => go('/business/features')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.features}</button>
                              <button onClick={() => go('/business/pricing')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.pricing}</button>
                              <button onClick={() => go('/business/flows')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.flows}</button>

                              <div className="pt-2">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">{t.msgCategories}</p>
                                <div className="pl-2 space-y-1.5 text-xs font-semibold text-slate-600">
                                  <button onClick={() => go('/business/msg-marketing')} className="block hover:text-brand-strong transition-colors">{t.marketingMsg}</button>
                                  <button onClick={() => go('/business/msg-authentication')} className="block hover:text-brand-strong transition-colors">{t.authMsg}</button>
                                  <button onClick={() => go('/business/msg-utility')} className="block hover:text-brand-strong transition-colors">{t.utilityMsg}</button>
                                  <button onClick={() => go('/business/msg-service')} className="block hover:text-brand-strong transition-colors">{t.serviceMsg}</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* COL 2 */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-base">
                              <FiShoppingBag className="text-brand-strong text-lg" />
                              <span>{t.bizApp}</span>
                            </div>
                            <div className="space-y-2 text-sm font-semibold text-slate-700">
                              <button onClick={() => go('/business/app-download')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.overview}</button>
                              <button onClick={() => go('/business/app-features')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.features}</button>
                              <button onClick={() => go('/business/get-started')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.howToStart}</button>
                              <button onClick={() => go('/business/agent')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.bizAgent}</button>
                            </div>
                          </div>

                          {/* COL 3 */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-base">
                              <FiSend className="text-brand-strong text-lg" />
                              <span>{t.adsClick}</span>
                            </div>
                            <div className="space-y-2 text-sm font-semibold text-slate-700">
                              <button onClick={() => go('/business/ads')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.overview}</button>
                              <button onClick={() => go('/business/ads-create')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.howCreateAd}</button>
                              <button onClick={() => go('/business/ads-status-channels')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.adsStatusChannels}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RESOURCES MENU TRIGGER */}
              <div
                className="relative"
                onMouseEnter={() => { clearTimeout(closeTimer.current); setActiveMenu('resources') }}
                onMouseLeave={() => { closeTimer.current = setTimeout(() => setActiveMenu(null), 150) }}
              >
                <button
                  onClick={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')}
                  className={`inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                    activeMenu === 'resources' ? 'text-sky-400' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>{t.navResources}</span>
                  <FiChevronDown className={`text-xs transition-transform duration-200 ${activeMenu === 'resources' ? 'rotate-180 text-sky-400' : ''}`} />
                </button>

                {/* RESOURCES POPUP */}
                <AnimatePresence>
                  {activeMenu === 'resources' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute -left-12 top-full pt-3 z-50 w-80 select-text"
                    >
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

              {/* DEVELOPERS MENU TRIGGER */}
              <div
                className="relative"
                onMouseEnter={() => { clearTimeout(closeTimer.current); setActiveMenu('developers') }}
                onMouseLeave={() => { closeTimer.current = setTimeout(() => setActiveMenu(null), 150) }}
              >
                <button
                  onClick={() => setActiveMenu(activeMenu === 'developers' ? null : 'developers')}
                  className={`inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                    activeMenu === 'developers' ? 'text-sky-400' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>{t.navDevelopers}</span>
                  <FiChevronDown className={`text-xs transition-transform duration-200 ${activeMenu === 'developers' ? 'rotate-180 text-sky-400' : ''}`} />
                </button>

                {/* DEVELOPERS POPUP */}
                <AnimatePresence>
                  {activeMenu === 'developers' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute -left-16 top-full pt-3 z-50 w-[420px] select-text"
                    >
                      <div className="relative rounded-[24px] bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] p-6 border border-slate-100">
                        <div className="absolute -top-3 left-20 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
                        
                        <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
                          {t.navDevelopers}
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">{tr('Coming soon')}</span>
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-sm">
                              <FiLayers className="text-brand-strong text-lg" />
                              <span>{t.platform}</span>
                            </div>
                            <div className="space-y-2 text-xs font-semibold text-slate-700">
                              <button onClick={() => go('/business/developer-hub')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.devHub}</button>
                              <button onClick={() => go('/business/developer-quickstart')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.howToStart}</button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-sm">
                              <FiLink className="text-brand-strong text-lg" />
                              <span>{t.devLinks}</span>
                            </div>
                            <div className="space-y-2 text-xs font-semibold text-slate-700">
                              <button onClick={() => go('/business/community')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.community}</button>
                              <button onClick={() => go('/business/developer-support')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.devSupport}</button>
                              <button onClick={() => go('/business/api-status')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.apiStatus}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PARTNERS MENU TRIGGER */}
              <div
                className="relative"
                onMouseEnter={() => { clearTimeout(closeTimer.current); setActiveMenu('partners') }}
                onMouseLeave={() => { closeTimer.current = setTimeout(() => setActiveMenu(null), 150) }}
              >
                <button
                  onClick={() => setActiveMenu(activeMenu === 'partners' ? null : 'partners')}
                  className={`inline-flex items-center gap-1 text-[15px] font-semibold transition-colors ${
                    activeMenu === 'partners' ? 'text-sky-400' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>{t.navPartners}</span>
                  <FiChevronDown className={`text-xs transition-transform duration-200 ${activeMenu === 'partners' ? 'rotate-180 text-sky-400' : ''}`} />
                </button>

                {/* PARTNERS POPUP */}
                <AnimatePresence>
                  {activeMenu === 'partners' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute -left-16 top-full pt-3 z-50 w-72 select-text"
                    >
                      <div className="relative rounded-[28px] bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] p-6 border border-slate-100">
                        <div className="absolute -top-3 left-20 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
                        
                        <h3 className="text-lg font-extrabold text-slate-800 mb-4">{t.navPartners}</h3>
                        
                        <div className="space-y-4">
                          <button
                            onClick={() => go('/business/become-partner')}
                            className="flex items-center gap-3.5 w-full text-left text-slate-800 hover:text-brand-strong font-bold transition-colors group"
                          >
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-brand-strong border border-sky-200 group-hover:bg-brand-strong group-hover:text-white transition-colors">
                              <FiFilePlus className="text-lg" />
                            </div>
                            <span className="text-[15px]">{t.becomePartner}</span>
                          </button>

                          <button
                            onClick={() => go('/business/find-partner')}
                            className="flex items-center gap-3.5 w-full text-left text-slate-800 hover:text-brand-strong font-bold transition-colors group"
                          >
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
              onClick={() => setSearchOpen(!searchOpen)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {searchOpen ? <FiX className="text-lg" /> : <FiSearch className="text-lg" />}
            </button>

            {/* BLUE VIBRANT GET STARTED BUTTON */}
            <button
              onClick={openGetStarted}
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
            >
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </header>

      {/* 4. ANNOUNCEMENT STRIP BAR (BLUE ACCENT) */}
      <div className="bg-[#e0f2fe] text-slate-900 py-3 border-b border-sky-200 select-none">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-2 px-5 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-sm font-semibold">{t.announcementText}</p>
          <button onClick={() => go('/ai-assistant-app')} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900 transition-colors">
            <span>{t.learnMore}</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-strong text-white text-[10px]">
              <FiArrowRight />
            </span>
          </button>
        </div>
      </div>

      {/* 5. BUSINESS "GET STARTED" CONTACT FORM MODAL */}
      <AnimatePresence>
        {getStartedOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <span>KT Business • {tr('Get started')}</span>
                </div>
                <button onClick={() => setGetStartedOpen(false)} className="rounded-full p-1 hover:bg-white/20 transition-colors">
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8">
                {leadSubmitted ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-100 text-brand-strong text-3xl font-black">
                      <FiCheck />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{tr('Thank you')}, {leadForm.firstName}!</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                      {tr('Your details have been received. Our KT Business team will reach out to you shortly at')} <strong>{leadForm.email}</strong>.
                    </p>
                    <div className="pt-4 flex flex-col gap-3">
                      <button
                        onClick={() => { setGetStartedOpen(false); navigate('/business/app-download') }}
                        className="w-full rounded-2xl bg-brand-strong hover:bg-brand-strong-hover py-3.5 text-base font-bold text-white shadow-brand transition-all"
                      >
                        {tr('Download KT Business App')}
                      </button>
                      <button
                        onClick={() => setGetStartedOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        {tr('Close')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">{tr('For businesses who want to get started, please fill out the form below.')}</p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{tr('First Name')}*</label>
                        <input type="text" value={leadForm.firstName} onChange={(e) => setLead('firstName', e.target.value)} className={leadInputClass(leadErrors.firstName)} />
                        {leadErrors.firstName && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{tr('Last Name')}*</label>
                        <input type="text" value={leadForm.lastName} onChange={(e) => setLead('lastName', e.target.value)} className={leadInputClass(leadErrors.lastName)} />
                        {leadErrors.lastName && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{tr('Work Email')}*</label>
                      <input type="email" value={leadForm.email} onChange={(e) => setLead('email', e.target.value)} placeholder="name@company.com" className={leadInputClass(leadErrors.email)} />
                      {leadErrors.email && <p className="mt-1 text-xs font-bold text-red-500">{tr('Enter a valid work email')}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{tr('Job Role')}*</label>
                      <select value={leadForm.jobRole} onChange={(e) => setLead('jobRole', e.target.value)} className={leadInputClass(leadErrors.jobRole)}>
                        <option value="" disabled>{tr('Select One')}</option>
                        <option>{tr('Business Owner / Founder')}</option>
                        <option>{tr('C-Level Executive')}</option>
                        <option>{tr('Manager')}</option>
                        <option>{tr('Marketing')}</option>
                        <option>{tr('Sales')}</option>
                        <option>{tr('Customer Support')}</option>
                        <option>{tr('Developer / IT')}</option>
                        <option>{tr('Other')}</option>
                      </select>
                      {leadErrors.jobRole && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{tr('Company Name')}*</label>
                      <input type="text" value={leadForm.company} onChange={(e) => setLead('company', e.target.value)} className={leadInputClass(leadErrors.company)} />
                      {leadErrors.company && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{tr('How many employees does your business have?')}*</label>
                      <select value={leadForm.employees} onChange={(e) => setLead('employees', e.target.value)} className={leadInputClass(leadErrors.employees)}>
                        <option value="" disabled>{tr('Select One')}</option>
                        <option>1–10</option>
                        <option>11–50</option>
                        <option>51–200</option>
                        <option>201–1,000</option>
                        <option>1,001+</option>
                      </select>
                      {leadErrors.employees && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{tr('Where is your business headquartered?')}*</label>
                      <select value={leadForm.headquarters} onChange={(e) => setLead('headquarters', e.target.value)} className={leadInputClass(leadErrors.headquarters)}>
                        <option value="" disabled>{tr('Select One')}</option>
                        <option>{tr('India')}</option>
                        <option>{tr('United States')}</option>
                        <option>{tr('United Kingdom')}</option>
                        <option>{tr('United Arab Emirates')}</option>
                        <option>{tr('Singapore')}</option>
                        <option>{tr('Canada')}</option>
                        <option>{tr('Australia')}</option>
                        <option>{tr('Germany')}</option>
                        <option>{tr('Other')}</option>
                      </select>
                      {leadErrors.headquarters && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{tr('What type of information are you looking for?')}*</label>
                      <select value={leadForm.infoType} onChange={(e) => setLead('infoType', e.target.value)} className={leadInputClass(leadErrors.infoType)}>
                        <option value="" disabled>{tr('Select One')}</option>
                        <option>{tr('KT Business App')}</option>
                        <option>{tr('KT Business Platform (API)')}</option>
                        <option>{tr('Ads that click to chat')}</option>
                        <option>{tr('Pricing & plans')}</option>
                        <option>{tr('Partnerships')}</option>
                        <option>{tr('Something else')}</option>
                      </select>
                      {leadErrors.infoType && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={leadForm.consent}
                          onChange={(e) => setLead('consent', e.target.checked)}
                          className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                        />
                        <span className="text-xs leading-5 text-slate-600">
                          <span className="font-bold text-slate-800">{tr('I agree')}* — </span>
                          {tr('By ticking this box, you agree to receive marketing related electronic communications from KT Messenger, including news, events, updates, and promotional emails. You may withdraw your consent and unsubscribe from these at any time, for example by clicking the unsubscribe link included in our emails.')}
                        </span>
                      </label>
                      {leadErrors.consent && <p className="mt-1 text-xs font-bold text-red-500">{tr('This field is required')}</p>}
                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        {tr('For more information about how KT Messenger handles your data please read our')}{' '}
                        <button
                          onClick={() => { setGetStartedOpen(false); go('/private-messaging-app') }}
                          className="font-semibold text-brand-strong hover:underline"
                        >
                          {tr('Privacy Policy')}
                        </button>.
                      </p>
                    </div>

                    <button
                      onClick={submitLead}
                      className="w-full rounded-2xl bg-brand-strong hover:bg-brand-strong-hover py-3.5 text-base font-bold text-white shadow-brand transition-all flex items-center justify-center gap-2"
                    >
                      <span>{tr('Submit')}</span>
                      <FiArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section style={{ backgroundColor: DARK }} className="text-white pb-12 pt-6 lg:pb-20 lg:pt-10">
        <div className="mx-auto grid max-w-[1320px] items-start gap-8 px-5 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div>
            <Reveal from="up">
              <h1 className="text-[3rem] font-extrabold leading-[1.02] tracking-tight text-[#38bdf8] sm:text-6xl lg:text-[4.7rem]">
                {t.heroTitle}
              </h1>
            </Reveal>
            <Reveal from="up" delay={0.06}>
              <p className="mt-6 max-w-md text-lg leading-8 text-white/85">
                {t.heroDesc}
              </p>
            </Reveal>
            <Reveal from="up" delay={0.12}>
              <div className="mt-9 flex flex-wrap gap-4">
                <button onClick={openGetStarted} className="rounded-full bg-brand-strong hover:bg-brand-strong-hover px-8 py-3.5 font-bold text-white shadow-brand transition-all hover:scale-105">
                  {t.btnGetStarted}
                </button>
                <button onClick={() => go('/business/app-download')} className="rounded-full bg-white text-slate-950 hover:bg-slate-100 px-8 py-3.5 font-extrabold shadow-lg transition-all hover:scale-105">
                  {t.btnDownloadApp}
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal from="scale" delay={0.1} className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <img src={img(heroImg)} alt={imgAlt(heroImg, tr('A small business owner helping a customer'))} className="h-[300px] w-full rounded-[28px] object-cover sm:h-[520px] shadow-2xl border border-slate-700" />

              <Sparkle className="absolute -right-2 -top-5 h-14 w-14 text-sky-400" />
              <Sparkle className="absolute right-10 top-6 h-7 w-7 text-sky-400/70" />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-3 top-12 flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 shadow-float sm:-left-6 text-slate-900 border border-slate-200"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-[10px] font-bold text-white">AN</span>
                <span className="text-sm font-bold">{t.bubble1}</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 9, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-2 top-40 rounded-2xl rounded-tr-sm bg-white px-4 py-2.5 shadow-float sm:-right-5 text-slate-900 border border-slate-200"
              >
                <p className="text-sm font-bold">{t.bubble2}</p>
                <span className="mt-0.5 block text-[10px] font-bold text-brand-strong">AI ✦</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 right-6 rounded-2xl rounded-tr-sm bg-white px-4 py-2.5 shadow-float text-slate-900 border border-slate-200"
              >
                <p className="text-sm font-bold">{t.bubble3}</p>
                <span className="mt-0.5 block text-[10px] font-bold text-brand-strong">AI ✦</span>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="biz-products" className="bg-surface py-20 lg:py-28 border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
          <Reveal from="up" className="text-center">
            <p className="text-sm font-bold text-brand-strong uppercase tracking-wider">{tr('KT business for any company size')}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-[1.9rem] font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {tr('KT Business products support companies of every size find the one that fits you best.')}
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {products.map((product, index) => (
              <Reveal key={product.title} from="up" delay={index * 0.06}>
                <div className="flex h-full flex-col rounded-[28px] border border-line bg-cream-2 p-8 shadow-card lg:p-10">
                  <span className="text-4xl text-ink">{product.icon}</span>
                  <h3 className="mt-8 text-2xl font-bold text-ink">{product.title}</h3>
                  <p className="mt-4 flex-1 text-[15px] leading-7 text-body">{product.desc}</p>
                  <div className="mt-8">
                    <button
                      onClick={() => (product.to ? navigate(product.to) : null)}
                      className="group inline-flex items-center gap-2.5 text-[15px] font-semibold text-brand-ink transition-colors hover:text-brand-strong"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-brand transition-colors group-hover:bg-brand-soft">
                        <FiArrowRight className="text-sm" />
                      </span>
                      {product.cta}
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="biz-features" className="bg-cream py-20 lg:py-28 dark:bg-surface border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <Reveal from="up" className="text-center">
            <p className="text-sm font-bold text-brand-strong uppercase tracking-wider">{tr('Built for small business')}</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-[1.9rem] font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {tr('Everything your small business needs, in one app')}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-body">
              {tr('Tools built for owners who run their business from their phone — simple to start, powerful as you grow.')}
            </p>
          </Reveal>

          {/* auto-rows-fr so both rows are the same height. Without it each row
              sizes to its own longest card and the two rows end up 24px apart,
              which reads as a mistake rather than a design. */}
          <div className="mt-14 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} from="up" delay={0.05 * (index % 4)} className="h-full">
                <div className="group flex h-full flex-col rounded-[28px] border border-line bg-cream-2 p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-brand">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-strong transition-colors duration-300 group-hover:bg-brand-strong group-hover:text-white">
                    <feature.icon className="text-xl" />
                  </div>
                  {/* Two lines of room whether the title needs them or not, so
                      every description in a row starts on the same line. The
                      one-line titles sit centred in that space, which splits
                      the spare 28px above and below instead of leaving it all
                      as a gap over the description. */}
                  <h3 className="mt-5 text-lg font-bold leading-7 text-ink lg:flex lg:min-h-14 lg:items-center">{feature.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-body">{feature.desc}</p>
                  {/* How the feature is actually used, under its own heading so
                      the rule reads as a divider between "what it is" and "how
                      you use it" rather than a stray line.

                      This was a filled, recessed footer panel for a while,
                      which looked better but could not be kept honest: its
                      height follows the steps, the steps wrap differently at
                      every card width and in all 63 languages, and a filled
                      block that starts 20px lower on one card makes the row
                      look broken. A hairline that shifts by the same 20px
                      barely registers, so the rule stays a rule. */}
                  <div className="mt-auto border-t border-line pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-strong">{tr('How it works')}</p>
                    <ol className="mt-3 space-y-2.5">
                      {feature.steps.map((step, stepIndex) => (
                        <li key={step} className="flex items-start gap-2.5 text-[13px] leading-5 text-body">
                          <span
                            aria-hidden="true"
                            className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-bold text-brand-strong transition-colors duration-300 group-hover:bg-brand-strong group-hover:text-white"
                          >
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="bg-cream py-20 lg:py-28 dark:bg-surface">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal from="left">
            <img src={img(whyImg)} alt={imgAlt(whyImg, tr('A business owner working on a laptop'))} className="h-[360px] w-full rounded-[28px] object-cover lg:h-[460px] shadow-card" />
          </Reveal>
          <Reveal from="right">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {tr('Why choose KT Messenger?')}
            </h2>
            <div className="mt-8 border-t border-line">
              {whyItems.map((item, index) => {
                const open = openWhy === index
                return (
                  <div key={item.q} className="border-b border-line">
                    <button
                      onClick={() => setOpenWhy(open ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="text-lg font-semibold text-ink">{item.q}</span>
                      <FiPlus className={`shrink-0 text-2xl text-brand-ink transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.26, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 text-[15px] leading-7 text-body">{item.a}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <ThemeToggle />
    </div>
  )
}

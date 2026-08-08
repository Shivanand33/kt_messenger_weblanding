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
  FiUsers,
  FiCheckCircle,
  FiFilePlus,
  FiUserCheck,
  FiZap,
  FiGlobe,
  FiSmartphone,
  FiCheck
} from 'react-icons/fi'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Logo } from '../../components/common/Logo/Logo'
import { ThemeToggle } from '../../components/common/ThemeToggle/ThemeToggle'
import { Footer } from '../../components/layout/Footer/Footer'
import { useModal } from '../../context/ModalContext'

import heroImg from '../../assets/images/business.jpg'
import whyImg from '../../assets/images/private.jpg'
import storyImg from '../../assets/images/multidevice.jpg'

const DARK = '#0b162c'

function Sparkle({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 0l2.5 7.5L20 10l-7.5 2.5L10 20l-2.5-7.5L0 10l7.5-2.5z" />
    </svg>
  )
}

function LinkArrow({ children, href = '#' }) {
  return (
    <a href={href} className="group inline-flex items-center gap-2 font-semibold text-brand-ink transition-colors hover:text-brand-strong">
      <span className="grid h-7 w-7 place-items-center rounded-full border border-brand transition-colors group-hover:bg-brand-soft">
        <FiArrowRight className="text-xs" />
      </span>
      <span>{children}</span>
    </a>
  )
}

export function BusinessPage() {
  const navigate = useNavigate()
  const { openDownloadModal } = useModal()
  const [lang, setLang] = useState('en') // 'en' or 'hi'
  const [topBannerClosed, setTopBannerClosed] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null) // 'products' | 'resources' | 'developers' | 'partners' | null
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openWhy, setOpenWhy] = useState(0)

  // GET STARTED ONBOARDING WIZARD MODAL STATE (WHATSAPP BUSINESS WORKFLOW)
  const [getStartedOpen, setGetStartedOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [selectedSolution, setSelectedSolution] = useState('app') // 'app' or 'api'
  const [bizForm, setBizForm] = useState({ name: '', category: 'Retail', phone: '', country: 'India' })

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
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))

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
    setWizardStep(1)
    setGetStartedOpen(true)
  }

  // Translation Dictionary
  const t = {
    topBannerText: isHindi ? 'क्या हमने सही देश/क्षेत्र चुना?' : 'Did we select the right country/region?',
    countryName: isHindi ? 'भारत 🇮🇳' : 'India 🇮🇳',
    announcementText: isHindi
      ? 'हर KT बातचीत में बड़े पैमाने पर पर्सनलाइजेशन. Meet KT Business Agent.'
      : 'Personalization at scale, in every KT conversation. Meet KT Business Agent.',
    learnMore: isHindi ? 'और जानें' : 'Learn more',
    navProducts: isHindi ? 'प्रोडक्ट' : 'Products',
    navResources: isHindi ? 'रिसोर्स' : 'Resources',
    navDevelopers: isHindi ? 'डेवलपर' : 'Developers',
    navPartners: isHindi ? 'पार्टनर' : 'Partners',
    btnGetStarted: isHindi ? 'शुरुआत करें' : 'Get started',
    btnDownloadApp: isHindi ? 'ऐप डाउनलोड करें' : 'Download app',

    // Hero Text
    heroTitle: isHindi ? 'बेहतर परिणाम पाने के लिए बातचीत का फ़ायदा उठाएं' : 'Turn conversations into customers',
    heroDesc: isHindi
      ? 'दुनिया भर में 2 बिलियन से ज़्यादा यूज़र के साथ प्लेटफ़ॉर्म पर AI की सुविधा वाला कस्टमर एंगेजमेंट बढ़ाएं।'
      : 'Reach and engage more than 2 billion people with AI-powered messaging built for business.',
    bubble1: isHindi ? 'मुझे एक छोटा पौधा चाहिए! 🌱' : 'I need a small plant! 🌱',
    bubble2: isHindi ? 'आपको हमारा मिनी पोथॉस पसंद आएगा 🪴' : "You'll love our Mini Pothos 🪴",
    bubble3: isHindi ? 'ऑर्डर #KT4821 कन्फर्म हो गया ✓' : 'Order #KT4821 confirmed ✓',

    // Mega Menu Products
    bizPlatform: isHindi ? 'बिज़नेस प्लेटफ़ॉर्म' : 'Business Platform',
    bizApp: isHindi ? 'बिज़नेस ऐप' : 'Business App',
    adsClick: isHindi ? 'क्लिक से KT पर ले जाने वाले विज्ञापन' : 'Ads that click to KT',
    overview: isHindi ? 'ओवरव्यू' : 'Overview',
    features: isHindi ? 'फ़ीचर' : 'Features',
    pricing: isHindi ? 'कीमत' : 'Pricing',
    flows: isHindi ? 'KT Flows' : 'KT Flows',
    msgCategories: isHindi ? 'मैसेज कैटेगरी:' : 'Message categories:',
    marketingMsg: isHindi ? 'मार्केटिंग मैसेज' : 'Marketing messages',
    authMsg: isHindi ? 'वेरिफ़िकेशन मैसेज' : 'Authentication messages',
    utilityMsg: isHindi ? 'यूटिलिटी मैसेज' : 'Utility messages',
    serviceMsg: isHindi ? 'सर्विस मैसेज' : 'Service messages',
    howToStart: isHindi ? 'शुरुआत कैसे करते हैं' : 'How to get started',
    bizAgent: isHindi ? 'KT Business Agent' : 'KT Business Agent',
    howCreateAd: isHindi ? 'विज्ञापन कैसे बनाते हैं' : 'How to create an ad',
    adsStatusChannels: isHindi ? "'स्टेटस' और 'चैनल' पर विज्ञापन" : 'Ads in Status and Channels',

    // Mega Menu Resources
    resourceLib: isHindi ? 'रिसोर्स लाइब्रेरी' : 'Resource Library',
    blog: isHindi ? 'ब्लॉग' : 'Blog',
    successStories: isHindi ? 'सक्सेस स्टोरीज़' : 'Success Stories',
    faqs: isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'FAQs',

    // Mega Menu Developers
    platform: isHindi ? 'प्लेटफ़ॉर्म' : 'Platform',
    devHub: isHindi ? 'डेवलपर हब' : 'Developer Hub',
    devLinks: isHindi ? 'डेवलपर लिंक' : 'Developer Links',
    community: isHindi ? 'कम्युनिटी' : 'Community',
    devSupport: isHindi ? 'डेवलपर सपोर्ट' : 'Developer Support',
    apiStatus: isHindi ? 'API स्टेटस' : 'API Status',

    // Mega Menu Partners
    becomePartner: isHindi ? 'पार्टनर बनें' : 'Become a Partner',
    findPartner: isHindi ? 'पार्टनर खोजें' : 'Find a Partner'
  }

  const products = [
    {
      icon: '📱',
      title: isHindi ? 'KT बिज़नेस ऐप' : 'KT Business App',
      desc: isHindi
        ? 'छोटे बिज़नेस मालिकों के लिए जो अपने फ़ोन पर कस्टमर बातचीत को मैनेज करते हैं।'
        : 'For small business owners who manage customer conversations on their phone. Share a catalog, automate quick replies, and organize your chats.',
      cta: isHindi ? 'ऐप के बारे में जानें' : 'Learn about the app',
      to: '/apps'
    },
    {
      icon: '⚡',
      title: isHindi ? 'KT बिज़नेस प्लेटफ़ॉर्म (API)' : 'KT Business Platform (API)',
      desc: isHindi
        ? 'मध्यम और बड़े बिज़नेस के लिए जो AI टूल और CRM इंटीग्रेशन के साथ बातचीत बढ़ाना चाहते हैं।'
        : 'For medium & large businesses looking to scale customer engagement via enterprise-grade messaging APIs, AI tools, and CRM integrations.',
      cta: isHindi ? 'प्लेटफ़ॉर्म API एक्सप्लोर करें' : 'Explore Platform API',
      to: '/security'
    }
  ]

  const whyItems = [
    {
      q: isHindi ? 'मेरे बिज़नेस को KT Messengers का उपयोग क्यों करना चाहिए?' : 'Why should my business use KT Messengers?',
      a: isHindi
        ? 'KT Messengers आपको दुनिया भर के 2 अरब से ज़्यादा यूज़र्स से जोड़ता है जिन्हें वे हर दिन चेक करते हैं।'
        : 'KT Messengers connects you to over 2 billion global users on a platform they already check daily. With 98% open rates and instant 1-on-1 interaction, it outperforms traditional email and SMS.'
    },
    {
      q: isHindi ? 'KT बिज़नेस ऐप और प्लेटफ़ॉर्म API में क्या अंतर है?' : 'What is the difference between the KT Business App and Platform API?',
      a: isHindi
        ? 'बिज़नेस ऐप फ्री है और छोटे बिज़नेस के लिए है। प्लेटफ़ॉर्म API बड़ी टीमों के लिए मल्टी-एजेंट इनबॉक्स प्रदान करता है।'
        : 'The Business App is free and designed for small businesses using a single mobile device. The Platform API is built for larger teams requiring multi-agent inboxes, automated AI workflows, and custom CRM integrations.'
    },
    {
      q: isHindi ? 'क्या KT बिज़नेस पर कस्टमर डेटा सुरक्षित है?' : 'Is customer data secure on KT Business?',
      a: isHindi
        ? 'हाँ। सभी मैसेज डिफ़ॉल्ट रूप से Signal Protocol एंड-टू-एंड एन्क्रिप्शन से सुरक्षित रहते हैं।'
        : 'Yes. All messages benefit from Signal Protocol end-to-end encryption by default. Your business and customer communications remain private and protected.'
    }
  ]

  const sampleSearchData = [
    { title: t.bizPlatform, desc: 'Enterprise Signal messaging API.', path: '/business' },
    { title: t.bizApp, desc: 'Mobile app for small business owners.', path: '/apps' },
    { title: t.flows, desc: 'Interactive form flows inside chat.', path: '/ai' },
    { title: t.resourceLib, desc: 'Guides, tutorials, and eBooks.', path: '/help' },
    { title: t.devHub, desc: 'API endpoints, webhooks, and SDKs.', path: '/security' }
  ]

  const searchResults = searchQuery.trim()
    ? sampleSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleSearchData

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
                              <button onClick={() => go('/business')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.overview}</button>
                              <button onClick={() => go('/messaging')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.features}</button>
                              <button onClick={() => go('/plus')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.pricing}</button>
                              <button onClick={() => go('/ai')} className="block w-full text-left text-slate-700 hover:text-brand-strong transition-colors">{t.flows}</button>

                              <div className="pt-2">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">{t.msgCategories}</p>
                                <div className="pl-2 space-y-1.5 text-xs font-semibold text-slate-600">
                                  <button onClick={() => go('/messaging')} className="block hover:text-brand-strong transition-colors">{t.marketingMsg}</button>
                                  <button onClick={() => go('/security')} className="block hover:text-brand-strong transition-colors">{t.authMsg}</button>
                                  <button onClick={() => go('/status')} className="block hover:text-brand-strong transition-colors">{t.utilityMsg}</button>
                                  <button onClick={() => go('/calling')} className="block hover:text-brand-strong transition-colors">{t.serviceMsg}</button>
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
                              <button onClick={() => go('/apps')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.overview}</button>
                              <button onClick={() => go('/groups')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.features}</button>
                              <button onClick={() => go('/help')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.howToStart}</button>
                              <button onClick={() => go('/ai')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.bizAgent}</button>
                            </div>
                          </div>

                          {/* COL 3 */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-base">
                              <FiSend className="text-brand-strong text-lg" />
                              <span>{t.adsClick}</span>
                            </div>
                            <div className="space-y-2 text-sm font-semibold text-slate-700">
                              <button onClick={() => go('/channels')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.overview}</button>
                              <button onClick={() => go('/help')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.howCreateAd}</button>
                              <button onClick={() => go('/status')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.adsStatusChannels}</button>
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
                          <button onClick={() => go('/help')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
                            <FiBookOpen className="text-brand-strong text-xl shrink-0" />
                            <span className="font-bold text-slate-900 group-hover:text-brand-strong transition-colors text-sm">{t.resourceLib}</span>
                          </button>
                          <button onClick={() => go('/blog')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
                            <FiFileText className="text-brand-strong text-xl shrink-0" />
                            <span className="font-bold text-slate-900 group-hover:text-brand-strong transition-colors text-sm">{t.blog}</span>
                          </button>
                          <button onClick={() => go('/business')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
                            <FiTrendingUp className="text-brand-strong text-xl shrink-0" />
                            <span className="font-bold text-slate-900 group-hover:text-brand-strong transition-colors text-sm">{t.successStories}</span>
                          </button>
                          <button onClick={() => go('/help')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group">
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
                        
                        <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2 mb-4">{t.navDevelopers}</h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-sm">
                              <FiLayers className="text-brand-strong text-lg" />
                              <span>{t.platform}</span>
                            </div>
                            <div className="space-y-2 text-xs font-semibold text-slate-700">
                              <button onClick={() => go('/help')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.devHub}</button>
                              <button onClick={() => go('/security')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.howToStart}</button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b pb-2 text-sm">
                              <FiLink className="text-brand-strong text-lg" />
                              <span>{t.devLinks}</span>
                            </div>
                            <div className="space-y-2 text-xs font-semibold text-slate-700">
                              <button onClick={() => go('/groups')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.community}</button>
                              <button onClick={() => go('/help')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.devSupport}</button>
                              <button onClick={() => go('/security')} className="block w-full text-left hover:text-brand-strong transition-colors">{t.apiStatus}</button>
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
                            onClick={() => go('/business')}
                            className="flex items-center gap-3.5 w-full text-left text-slate-800 hover:text-brand-strong font-bold transition-colors group"
                          >
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-brand-strong border border-sky-200 group-hover:bg-brand-strong group-hover:text-white transition-colors">
                              <FiFilePlus className="text-lg" />
                            </div>
                            <span className="text-[15px]">{t.becomePartner}</span>
                          </button>

                          <button
                            onClick={() => go('/security')}
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

            <button onClick={openDownloadModal} className="hidden rounded-full bg-white px-6 py-2.5 text-sm font-extrabold transition-all hover:scale-105 sm:block" style={{ color: DARK }}>
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
          <button onClick={() => go('/ai')} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900 transition-colors">
            <span>{t.learnMore}</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-strong text-white text-[10px]">
              <FiArrowRight />
            </span>
          </button>
        </div>
      </div>

      {/* 5. WHATSAPP BUSINESS "GET STARTED" ONBOARDING WIZARD MODAL (100% WORKING!) */}
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
                  <span className="grid h-7 w-7 place-items-center rounded-xl bg-brand-strong text-white font-black text-xs">KT</span>
                  <span>KT Business Setup • Step {wizardStep} of 3</span>
                </div>
                <button onClick={() => setGetStartedOpen(false)} className="rounded-full p-1 hover:bg-white/20 transition-colors">
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 sm:p-8 space-y-6">

                {/* STEP 1: SELECT SOLUTION */}
                {wizardStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-extrabold text-slate-900">Choose your Business Solution</h3>
                    <p className="text-sm text-slate-600">Select how you want to connect with your customers on KT Business.</p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div
                        onClick={() => setSelectedSolution('app')}
                        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                          selectedSolution === 'app' ? 'border-brand-strong bg-sky-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <FiSmartphone className="text-3xl text-brand-strong mb-3" />
                        <h4 className="font-extrabold text-slate-900 text-base">KT Business App</h4>
                        <p className="text-xs text-slate-600 mt-1">Best for small shops, freelancers, & local store owners.</p>
                      </div>

                      <div
                        onClick={() => setSelectedSolution('api')}
                        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                          selectedSolution === 'api' ? 'border-brand-strong bg-sky-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <FiZap className="text-3xl text-brand-strong mb-3" />
                        <h4 className="font-extrabold text-slate-900 text-base">Platform API & AI</h4>
                        <p className="text-xs text-slate-600 mt-1">Best for enterprise brands, multi-agent teams, & AI bots.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setWizardStep(2)}
                      className="w-full rounded-2xl bg-brand-strong hover:bg-brand-strong-hover py-3.5 text-base font-bold text-white shadow-brand transition-all flex items-center justify-center gap-2"
                    >
                      <span>Continue to Profile Setup</span>
                      <FiArrowRight />
                    </button>
                  </div>
                )}

                {/* STEP 2: BUSINESS DETAILS FORM */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-900">Enter Business Details</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Business Name</label>
                        <input
                          type="text"
                          value={bizForm.name}
                          onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                          placeholder="e.g. Acme Organic Store"
                          className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold outline-none focus:border-brand-strong focus:ring-2 focus:ring-sky-200"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Business Category</label>
                        <select
                          value={bizForm.category}
                          onChange={(e) => setBizForm({ ...bizForm, category: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold outline-none focus:border-brand-strong focus:ring-2 focus:ring-sky-200"
                        >
                          <option>Retail & E-commerce</option>
                          <option>Services & Consulting</option>
                          <option>Healthcare & Pharma</option>
                          <option>Financial & Banking</option>
                          <option>Education & Training</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Mobile / WhatsApp Number</label>
                        <input
                          type="text"
                          value={bizForm.phone}
                          onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold outline-none focus:border-brand-strong focus:ring-2 focus:ring-sky-200"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setWizardStep(1)}
                        className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setWizardStep(3)}
                        className="flex-1 rounded-2xl bg-brand-strong hover:bg-brand-strong-hover py-3 text-sm font-bold text-white shadow-brand transition-all flex items-center justify-center gap-2"
                      >
                        <span>Activate Business Account</span>
                        <FiCheckCircle />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: INSTANT SETUP COMPLETE */}
                {wizardStep === 3 && (
                  <div className="text-center space-y-4 py-4">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-100 text-brand-strong text-3xl font-black">
                      <FiCheck />
                    </div>

                    <h3 className="text-2xl font-extrabold text-slate-900">Account Activated Successfully!</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                      Welcome <strong>{bizForm.name || 'Your Business'}</strong>! Your KT Business profile is live with AI Chatbot support.
                    </p>

                    <div className="pt-4 flex flex-col gap-3">
                      <button
                        onClick={() => { setGetStartedOpen(false); navigate('/apps') }}
                        className="w-full rounded-2xl bg-brand-strong hover:bg-brand-strong-hover py-3.5 text-base font-bold text-white shadow-brand transition-all"
                      >
                        Launch KT Business Dashboard
                      </button>
                      <button
                        onClick={() => setGetStartedOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        Close Wizard
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section style={{ backgroundColor: DARK }} className="text-white py-12 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
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
                <button onClick={openDownloadModal} className="rounded-full bg-white text-slate-950 hover:bg-slate-100 px-8 py-3.5 font-extrabold shadow-lg transition-all hover:scale-105">
                  {t.btnDownloadApp}
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal from="scale" delay={0.1} className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <img src={heroImg} alt="A small business owner helping a customer" className="h-[420px] w-full rounded-[28px] object-cover sm:h-[520px] shadow-2xl border border-slate-700" />

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
            <p className="text-sm font-bold text-brand-strong uppercase tracking-wider">{isHindi ? 'हर कंपनी आकार के लिए KT बिज़नेस' : 'KT business for any company size'}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-[1.9rem] font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {isHindi ? 'KT बिज़नेस प्रोडक्ट हर आकार की कंपनियों का समर्थन करते हैं' : 'KT Business products support companies of every size — find the one that fits you best.'}
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

      {/* WHY CHOOSE SECTION */}
      <section className="bg-cream py-20 lg:py-28 dark:bg-surface">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal from="left">
            <img src={whyImg} alt="A business owner working on a laptop" className="h-[360px] w-full rounded-[28px] object-cover lg:h-[460px] shadow-card" />
          </Reveal>
          <Reveal from="right">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {isHindi ? 'KT Messengers क्यों चुनें?' : 'Why choose KT Messengers?'}
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
                          exit={{ opacity: 0, opacity: 0 }}
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

      {/* SUCCESS STORY */}
      <section id="biz-success" className="pb-24 pt-4 bg-surface">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <Reveal from="up">
            <div className="grid items-center gap-8 rounded-[32px] bg-brand-soft p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
              <img src={storyImg} alt="Nova Bank office" className="h-[300px] w-full rounded-[24px] object-cover lg:h-[380px] shadow-lg" />
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-ink lg:text-4xl">Nova Bank</h3>
                <p className="mt-4 max-w-md text-lg leading-8 text-body">
                  {isHindi
                    ? 'KT Messengers पर सुरक्षित वन-टाइम पासकोड भेजकर साइन-अप कन्वर्जन में सुधार करना।'
                    : 'Improving sign-up conversion by sending secure one-time passcodes over KT Messengers.'}
                </p>
                <div className="mt-6">
                  <LinkArrow>{isHindi ? 'सक्सेस स्टोरी देखें' : 'See success story'}</LinkArrow>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <ThemeToggle />
    </div>
  )
}

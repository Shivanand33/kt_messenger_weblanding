import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { NotFoundPage } from './pages/NotFound/NotFoundPage'
import { AnalyticsTracker } from './components/common/AnalyticsTracker/AnalyticsTracker'
import { api } from './services/apiClient'
import { IS_MOBILE } from './utils/mobileImage'

// Every page except Home is its own chunk, fetched the first time it is
// opened, so loading the home page no longer means downloading and parsing
// the code of every other page first. Navigation runs inside a transition
// (BrowserRouter), so the current page stays on screen while a chunk loads.
const pageLoaders = []
const page = (load, name) => {
  pageLoaders.push(load)
  return lazy(() => load().then((m) => ({ default: m[name] })))
}

const PrivacyPage = page(() => import('./pages/Privacy/PrivacyPage'), 'PrivacyPage')
const BlogPage = page(() => import('./pages/Blog/BlogPage'), 'BlogPage')
const AppsPage = page(() => import('./pages/Apps/AppsPage'), 'AppsPage')
const HelpPage = page(() => import('./pages/Help/HelpPage'), 'HelpPage')
const BusinessPage = page(() => import('./pages/Business/BusinessPage'), 'BusinessPage')
const BusinessSubPage = page(() => import('./pages/Business/BusinessSubPage'), 'BusinessSubPage')
const CallingPage = page(() => import('./pages/Calling/CallingPage'), 'CallingPage')
const MessagingPage = page(() => import('./pages/Messaging/MessagingPage'), 'MessagingPage')
const GroupsPage = page(() => import('./pages/Groups/GroupsPage'), 'GroupsPage')
const ChannelsPage = page(() => import('./pages/Channels/ChannelsPage'), 'ChannelsPage')
const KtAIPage = page(() => import('./pages/KtAI/KtAIPage'), 'KtAIPage')
const StatusPage = page(() => import('./pages/Status/StatusPage'), 'StatusPage')
const SecurityPage = page(() => import('./pages/Security/SecurityPage'), 'SecurityPage')
const KtPlusPage = page(() => import('./pages/KtPlus/KtPlusPage'), 'KtPlusPage')

// FOOTER / COMPANY PAGES
const AboutPage = page(() => import('./pages/About/AboutPage'), 'AboutPage')
const CareersPage = page(() => import('./pages/Careers/CareersPage'), 'CareersPage')
const ContactPage = page(() => import('./pages/Contact/ContactPage'), 'ContactPage')
const CommunityPage = page(() => import('./pages/Community/CommunityPage'), 'CommunityPage')

// NEW 5 FEATURE PAGES
const NewsPage = page(() => import('./pages/News/NewsPage'), 'NewsPage')
const MarketsPage = page(() => import('./pages/Markets/MarketsPage'), 'MarketsPage')
const WalletPage = page(() => import('./pages/Wallet/WalletPage'), 'WalletPage')
const MarketplacePage = page(() => import('./pages/Marketplace/MarketplacePage'), 'MarketplacePage')
const NotesPage = page(() => import('./pages/Notes/NotesPage'), 'NotesPage')
const MinisPage = page(() => import('./pages/Minis/MinisPage'), 'MinisPage')

// [component, label keywords, href keywords] — checked in this order.
const PAGE_RULES = [
  [CallingPage, ['call'], ['call', 'phone']],
  [MessagingPage, ['messag'], ['messag', 'chat']],
  [GroupsPage, ['group'], ['group']],
  [ChannelsPage, ['channel'], ['channel']],
  [KtAIPage, ['ai'], ['ai']],
  [StatusPage, ['status'], ['status']],
  [SecurityPage, ['secur'], ['secur']],
  [KtPlusPage, ['plus'], ['plus']],
  [NotesPage, ['note'], ['note']],
  [MinisPage, ['mini'], ['mini']],
  [NewsPage, ['news'], ['news']],
  [MarketsPage, ['market'], ['market']],
  [WalletPage, ['wallet'], ['wallet']],
  [PrivacyPage, ['privac'], ['privac']],
  [AboutPage, ['about'], ['about']],
  [CareersPage, ['career'], ['job']],
  [ContactPage, ['contact'], ['contact']],
  [CommunityPage, ['community'], ['community']],
  [BlogPage, ['blog'], ['blog']],
  [HelpPage, ['help'], ['help']],
  [AppsPage, ['app'], ['app']],
  [BusinessPage, ['business'], ['business']],
]

export function getComponentByLabelOrHref(item) {
  if (!item) return null
  const label = typeof item === 'string' ? '' : (item.label || '').toLowerCase().trim()
  const href = typeof item === 'string' ? item.toLowerCase().trim() : (item.href || item.to || '').toLowerCase().trim()

  // The label is checked first across every rule. SEO URLs are keyword-heavy
  // ("/group-chat-app", "/secure-messaging-app"), so matching the URL first let
  // an early rule like Messaging ("chat", "messag") capture pages that belong
  // elsewhere. The URL is only consulted when no label matches — which is
  // always the case for a bare path string, so that behaviour is unchanged.
  for (const [Page, labelKeys] of PAGE_RULES) {
    if (label && labelKeys.some((k) => label.includes(k))) return Page
  }
  for (const [Page, , hrefKeys] of PAGE_RULES) {
    if (hrefKeys.some((k) => href.includes(k))) return Page
  }
  return null
}

function App() {
  const [dynamicRoutes, setDynamicRoutes] = useState([])

  useEffect(() => {
    // Fetch all admin configured navigation items to dynamically map custom URLs
    Promise.all([
      api.getNavigation('features_menu').catch(() => []),
      api.getNavigation('header').catch(() => []),
      api.getNavigation('footer').catch(() => [])
    ]).then(([features, header, footer]) => {
      const allItems = [...(features || []), ...(header || []), ...(footer || [])]
      const routes = []
      for (const item of allItems) {
        if (item.href && item.href.startsWith('/')) {
          const Comp = getComponentByLabelOrHref(item)
          if (Comp) {
            routes.push({ path: item.href, Component: Comp })
          }
        }
      }
      setDynamicRoutes(routes)
    })
  }, [])

  // Desktop keeps the one-bundle feel: once the browser is idle every page
  // chunk is fetched, so later navigation is instant. Phones skip this and
  // download a page's code only when that page is opened.
  useEffect(() => {
    if (IS_MOBILE) return undefined
    const warm = () => pageLoaders.forEach((load) => load().catch(() => {}))
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(warm, 1500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <>
      <AnalyticsTracker />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/apps" element={<AppsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/business/:slug" element={<BusinessSubPage />} />
        <Route path="/calling" element={<CallingPage />} />
        <Route path="/messaging" element={<MessagingPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/ai" element={<KtAIPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/plus" element={<KtPlusPage />} />

        {/* FOOTER / COMPANY ROUTES */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/community" element={<CommunityPage />} />

        {/* NEW 5 FEATURE ROUTES */}
        <Route path="/news" element={<NewsPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/minis" element={<MinisPage />} />

        {/* DYNAMIC ADMIN NAVIGATION ROUTES */}
        {dynamicRoutes.map((r, index) => (
          <Route key={`${r.path}-${index}`} path={r.path} element={<r.Component />} />
        ))}

        {/* BUSINESS CONVERSATION CATEGORY DIRECT ALIASES */}
        <Route path="/products/conversation-categories/authentication" element={<SecurityPage />} />
        <Route path="/products/conversation-categories/marketing" element={<MessagingPage />} />
        <Route path="/products/conversation-categories/utility" element={<StatusPage />} />
        <Route path="/products/conversation-categories/service" element={<CallingPage />} />

        {/* CUSTOM 404 — handles remaining unknown routes or dynamic resolution */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </>
  )
}

export default App

import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { PrivacyPage } from './pages/Privacy/PrivacyPage'
import { BlogPage } from './pages/Blog/BlogPage'
import { AppsPage } from './pages/Apps/AppsPage'
import { HelpPage } from './pages/Help/HelpPage'
import { BusinessPage } from './pages/Business/BusinessPage'
import { BusinessSubPage } from './pages/Business/BusinessSubPage'
import { CallingPage } from './pages/Calling/CallingPage'
import { MessagingPage } from './pages/Messaging/MessagingPage'
import { GroupsPage } from './pages/Groups/GroupsPage'
import { ChannelsPage } from './pages/Channels/ChannelsPage'
import { KtAIPage } from './pages/KtAI/KtAIPage'
import { StatusPage } from './pages/Status/StatusPage'
import { SecurityPage } from './pages/Security/SecurityPage'
import { KtPlusPage } from './pages/KtPlus/KtPlusPage'

// FOOTER / COMPANY PAGES
import { AboutPage } from './pages/About/AboutPage'
import { CareersPage } from './pages/Careers/CareersPage'
import { ContactPage } from './pages/Contact/ContactPage'
import { CommunityPage } from './pages/Community/CommunityPage'

// NEW 5 FEATURE PAGES
import { NewsPage } from './pages/News/NewsPage'
import { MarketsPage } from './pages/Markets/MarketsPage'
import { WalletPage } from './pages/Wallet/WalletPage'
import { MarketplacePage } from './pages/Marketplace/MarketplacePage'
import { NotesPage } from './pages/Notes/NotesPage'
import { MinisPage } from './pages/Minis/MinisPage'
import { NotFoundPage } from './pages/NotFound/NotFoundPage'
import { AnalyticsTracker } from './components/common/AnalyticsTracker/AnalyticsTracker'
import { api } from './services/apiClient'

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

  return (
    <>
      <AnalyticsTracker />
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
    </>
  )
}

export default App

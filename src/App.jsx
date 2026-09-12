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

export function getComponentByLabelOrHref(item) {
  if (!item) return null
  const label = typeof item === 'string' ? '' : (item.label || '').toLowerCase().trim()
  const href = typeof item === 'string' ? item.toLowerCase().trim() : (item.href || item.to || '').toLowerCase().trim()

  if (label.includes('call') || href.includes('call') || href.includes('phone')) return CallingPage
  if (label.includes('messag') || href.includes('messag') || href.includes('chat')) return MessagingPage
  if (label.includes('group') || href.includes('group')) return GroupsPage
  if (label.includes('channel') || href.includes('channel')) return ChannelsPage
  if (label.includes('ai') || href.includes('ai')) return KtAIPage
  if (label.includes('status') || href.includes('status')) return StatusPage
  if (label.includes('secur') || href.includes('secur')) return SecurityPage
  if (label.includes('plus') || href.includes('plus')) return KtPlusPage
  if (label.includes('note') || href.includes('note')) return NotesPage
  if (label.includes('mini') || href.includes('mini')) return MinisPage
  if (label.includes('news') || href.includes('news')) return NewsPage
  if (label.includes('market') || href.includes('market')) return MarketsPage
  if (label.includes('wallet') || href.includes('wallet')) return WalletPage
  if (label.includes('privac') || href.includes('privac')) return PrivacyPage
  if (label.includes('about') || href.includes('about')) return AboutPage
  if (label.includes('career') || href.includes('job')) return CareersPage
  if (label.includes('contact') || href.includes('contact')) return ContactPage
  if (label.includes('community') || href.includes('community')) return CommunityPage
  if (label.includes('blog') || href.includes('blog')) return BlogPage
  if (label.includes('help') || href.includes('help')) return HelpPage
  if (label.includes('app') || href.includes('app')) return AppsPage
  if (label.includes('business') || href.includes('business')) return BusinessPage

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

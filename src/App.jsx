import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { PrivacyPage } from './pages/Privacy/PrivacyPage'
import { BlogPage } from './pages/Blog/BlogPage'
import { AppsPage } from './pages/Apps/AppsPage'
import { HelpPage } from './pages/Help/HelpPage'
import { BusinessPage } from './pages/Business/BusinessPage'
import { CallingPage } from './pages/Calling/CallingPage'
import { MessagingPage } from './pages/Messaging/MessagingPage'
import { GroupsPage } from './pages/Groups/GroupsPage'
import { ChannelsPage } from './pages/Channels/ChannelsPage'
import { KtAIPage } from './pages/KtAI/KtAIPage'
import { StatusPage } from './pages/Status/StatusPage'
import { SecurityPage } from './pages/Security/SecurityPage'
import { WhatsAppPlusPage } from './pages/WhatsAppPlus/WhatsAppPlusPage'

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/apps" element={<AppsPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/calling" element={<CallingPage />} />
      <Route path="/messaging" element={<MessagingPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/channels" element={<ChannelsPage />} />
      <Route path="/ai" element={<KtAIPage />} />
      <Route path="/status" element={<StatusPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/plus" element={<WhatsAppPlusPage />} />
      <Route path="/whatsapp-plus" element={<WhatsAppPlusPage />} />

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

      {/* WHATSAPP BUSINESS CONVERSATION CATEGORIES DIRECT ALIASES */}
      <Route path="/products/conversation-categories/authentication" element={<SecurityPage />} />
      <Route path="/products/conversation-categories/marketing" element={<MessagingPage />} />
      <Route path="/products/conversation-categories/utility" element={<StatusPage />} />
      <Route path="/products/conversation-categories/service" element={<CallingPage />} />
    </Routes>
  )
}

export default App

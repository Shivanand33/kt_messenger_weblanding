import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { NotFoundPage } from './pages/NotFound/NotFoundPage'
import { AnalyticsTracker } from './components/common/AnalyticsTracker/AnalyticsTracker'
import { FeatureCanonicalRedirect } from './components/FeatureCanonicalRedirect'
import { api } from './services/apiClient'
import { IS_MOBILE } from './utils/mobileImage'
import { loadPageDictionary } from './i18n/dictionaries'

// Every page except Home is its own chunk, fetched the first time it is
// opened, so loading the home page no longer means downloading and parsing
// the code of every other page first. Navigation runs inside a transition
// (BrowserRouter), so the current page stays on screen while a chunk loads.
// A page's translations (src/i18n/locales/<lang>/<Page>.json, named after its
// folder under src/pages/) load together with its code, so it first renders
// already in the page's language.
const pageLoaders = []
const page = (load, name, dictionary = name.replace(/Page$/, '')) => {
  pageLoaders.push(load)
  return lazy(() => Promise.all([load(), loadPageDictionary(dictionary)]).then(([m]) => ({ default: m[name] })))
}

const PrivacyPage = page(() => import('./pages/Privacy/PrivacyPage'), 'PrivacyPage')
const PrivacyPolicyPage = page(() => import('./pages/Legal/PrivacyPolicyPage'), 'PrivacyPolicyPage')
const BlogPage = page(() => import('./pages/Blog/BlogPage'), 'BlogPage')
const ProductsPage = page(() => import('./pages/Products/ProductsPage'), 'ProductsPage')
const AppsPage = page(() => import('./pages/Apps/AppsPage'), 'AppsPage')
const HelpPage = page(() => import('./pages/Help/HelpPage'), 'HelpPage')
const BusinessPage = page(() => import('./pages/Business/BusinessPage'), 'BusinessPage')
const BusinessAppDownloadPage = page(() => import('./pages/Business/BusinessAppDownloadPage'), 'BusinessAppDownloadPage', 'Business')
const BusinessSubPage = page(() => import('./pages/Business/BusinessSubPage'), 'BusinessSubPage', 'Business')
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

// Canonical admin-navigation URLs pinned to their page. These URLs are too
// close to each other for the keyword matching below — '/messaging' and
// '/messaging-app-download' both contain "messag" and "app" — so they are
// resolved by exact path first and can never swap pages.
const EXACT_PATH_TO_PAGE = {
  '/video-calling-app': CallingPage,
  '/messaging': MessagingPage,
  '/group-chat-app': GroupsPage,
  '/social-media-platform': ChannelsPage,
  '/ai-assistant-app': KtAIPage,
  '/social-feed-app': StatusPage,
  '/secure-messaging-app': SecurityPage,
  '/premium-messaging-app': KtPlusPage,
  '/notes-app': NotesPage,
  '/minis-short-video-app': MinisPage,
  '/private-messaging-app': PrivacyPage,
  '/messaging-social-media-blog': BlogPage,
  '/messaging-app-download': AppsPage,
  '/messaging-app-help': HelpPage,
  '/business-messaging-app': BusinessPage,
}

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

/**
 * Resolve a URL path to a page only when it is exactly one of the canonical
 * feature URLs. Unlike getComponentByLabelOrHref this never keyword-matches,
 * so a made-up URL that merely contains a keyword ("/messaging-app-xyz")
 * stays on the 404 page instead of rendering a page it is not.
 */
export function getComponentByExactPath(path) {
  const key = String(path || '').toLowerCase().split(/[?#]/)[0].replace(/\/+$/, '')
  return EXACT_PATH_TO_PAGE[key] || null
}

export function getComponentByLabelOrHref(item) {
  if (!item) return null
  const label = typeof item === 'string' ? '' : (item.label || '').toLowerCase().trim()
  const href = typeof item === 'string' ? item.toLowerCase().trim() : (item.href || item.to || '').toLowerCase().trim()

  // Canonical URLs resolve by exact path before any keyword guessing, so a
  // URL that merely contains another page's keyword ("/messaging-app-download"
  // contains "messag") still opens its own page.
  const exact = getComponentByExactPath(href)
  if (exact) return exact

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

/**
 * Older builds let Help Center URLs stack article slugs
 * (/messaging-app-help/a/b/c), so bookmarks and history from that era open a
 * path the :slug route never matches. The last segment is the article the
 * reader wanted — normalize to it at the canonical Help Center URL. Anything
 * that is not a clean slug falls through to the 404 page.
 */
function HelpDeepLink() {
  const { pathname } = useLocation()
  const last = pathname.split('/').filter(Boolean).pop()
  if (last && /^[a-z0-9-]+$/i.test(last)) {
    const target = `/messaging-app-help/${encodeURIComponent(last)}`
    // Never bounce to the path we are already on. /messaging-app-help ends in
    // its own last segment, so redirecting it here sent the browser to the
    // same URL over and over and left a blank page.
    if (target !== pathname) return <Navigate replace to={target} />
    return <HelpPage />
  }
  return <NotFoundPage />
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
            // The Help Center gives every article its own URL under its path.
            const path = Comp === HelpPage ? `${item.href.replace(/\/+$/, '')}/:slug?` : item.href
            routes.push({ path, Component: Comp })
          }
        }
      }
      setDynamicRoutes(routes)
    })
  }, [])

  // Desktop keeps the one-bundle feel: once the browser is idle every page
  // chunk is fetched, so later navigation is instant. Phones skip this and
  // download a page's code only when that page is opened.
  //
  // It waits for `load` first: these 30-odd chunks are worth nothing until the
  // visitor navigates, and fetching them while this page is still painting
  // takes bandwidth from the hero image and the rest of the first screen.
  useEffect(() => {
    if (IS_MOBILE) return undefined
    const warm = () => pageLoaders.forEach((load) => load().catch(() => {}))
    let cancel = () => {}
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(warm, { timeout: 3000 })
        cancel = () => window.cancelIdleCallback(id)
        return
      }
      const id = window.setTimeout(warm, 1500)
      cancel = () => window.clearTimeout(id)
    }
    if (document.readyState === 'complete') {
      schedule()
      return () => cancel()
    }
    window.addEventListener('load', schedule, { once: true })
    return () => {
      window.removeEventListener('load', schedule)
      cancel()
    }
  }, [])

  return (
    <>
      <AnalyticsTracker />
      <FeatureCanonicalRedirect />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* The legal policy. Kept distinct from /privacy, which is the
            marketing page about KT Messenger's privacy features. */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/apps" element={<AppsPage />} />
        <Route path="/help/:slug?" element={<HelpPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/business/app-download" element={<BusinessAppDownloadPage />} />
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

        {/* LEGACY HELP CENTER DEEP LINKS — stacked-slug URLs from older
            builds normalize to the article named by their last segment */}
        {/* The canonical Help Center URL, pinned here as well as built from
            admin Navigation: when that API returns no items the dynamic
            ":slug?" route is never registered, and without this the splat
            route below would be the only match. */}
        {/* The old self-redirect loop left /messaging-app-help doubled on
            itself in bookmarks, history and search results. Send those URLs
            back to the clean one instead of serving the Help Center — and its
            canonical tag — from a path that should never have existed. */}
        <Route path="/messaging-app-help/messaging-app-help" element={<Navigate replace to="/messaging-app-help" />} />

        <Route path="/messaging-app-help/:slug?" element={<HelpPage />} />

        <Route path="/help/*" element={<HelpDeepLink />} />
        <Route path="/messaging-app-help/*" element={<HelpDeepLink />} />

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

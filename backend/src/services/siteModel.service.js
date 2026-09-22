import { prisma } from '../config/db.js'
import { env } from '../config/env.js'

/**
 * The public website as the CMS currently describes it: every page with its
 * one canonical URL, plus the published business pages, blog posts and Help
 * Center articles. Shared by /sitemap.xml and /llms.txt so both always list
 * exactly the same URLs.
 *
 *   - one URL per page of the website (src/App.jsx). When the admin
 *     navigation gives a page a keyword-rich URL (e.g. /video-calling-app for
 *     the Calling page) that URL is used instead of the page's own route, so
 *     no page is ever listed twice;
 *   - published blog posts           -> /blog/<slug>
 *   - published Help Center articles -> <Help Center URL>/<slug>
 *   - published business pages       -> /business/<slug>
 *
 * New content appears on its own once the cache expires
 * (SITEMAP_CACHE_SECONDS). Nothing here writes to the database.
 */

const CACHE_MS = env.sitemap.cacheSeconds * 1000

/*
 * Public pages, mirroring the routes in src/App.jsx.
 *
 * `label` / `href` mirror PAGE_RULES in src/App.jsx, in the same order: that
 * is how the website decides which page an admin navigation URL opens, so the
 * same rules pick the page each navigation URL belongs to here.
 *
 * `content` names the website_content blocks behind the page (text.<name>,
 * seo.<name>, <name>.hero, <name>.content); their newest update is the page's
 * lastmod, and seo.<id> supplies its description when the admin has set one.
 *
 * `listed: false` keeps a page out: News, Markets, Wallet and Marketplace are
 * hidden from the site navigation (src/components/layout/Navbar/Navbar.jsx)
 * and their data files describe illustrative sample data. Such a page is
 * listed again as soon as the admin adds it to a menu.
 *
 * `name`, `group` and `about` are used by llms.txt only.
 */
const HOME = { id: 'home', path: '/', content: ['home', 'features'], changefreq: 'weekly', priority: 1.0, name: 'Home', group: 'main', about: 'Secure messaging and calling app for private chats, calls, AI features and communities.' }

const PAGES = [
  { id: 'calling', path: '/calling', label: ['call'], href: ['call', 'phone'], content: ['calling'], changefreq: 'monthly', priority: 0.8, name: 'Voice and Video Calling', group: 'features', about: 'Free voice and video calls, one-on-one and in groups.' },
  { id: 'messaging', path: '/messaging', label: ['messag'], href: ['messag', 'chat'], content: ['messaging'], changefreq: 'monthly', priority: 0.8, name: 'Messaging', group: 'features', about: 'Private, end-to-end encrypted chats with media, voice notes and files.' },
  { id: 'groups', path: '/groups', label: ['group'], href: ['group'], content: ['groups', 'communities'], changefreq: 'monthly', priority: 0.8, name: 'Group Chats', group: 'features', about: 'Group chats with polls, events and admin controls.' },
  { id: 'channels', path: '/channels', label: ['channel'], href: ['channel'], content: ['channels'], changefreq: 'monthly', priority: 0.8, name: 'Channels', group: 'features', about: 'One-way broadcast channels for sharing updates with followers.' },
  { id: 'ai', path: '/ai', label: ['ai'], href: ['ai'], content: ['ai'], changefreq: 'monthly', priority: 0.8, name: 'KT AI', group: 'features', about: 'KT AI, the assistant built into KT Messenger.' },
  { id: 'status', path: '/status', label: ['status'], href: ['status'], content: ['status'], changefreq: 'monthly', priority: 0.8, name: 'Status', group: 'features', about: 'Status updates that disappear after 24 hours.' },
  { id: 'security', path: '/security', label: ['secur'], href: ['secur'], content: ['security'], changefreq: 'monthly', priority: 0.8, name: 'Security', group: 'trust', about: 'How KT Messenger keeps conversations secure with end-to-end encryption.' },
  { id: 'plus', path: '/plus', label: ['plus'], href: ['plus'], content: ['plus'], changefreq: 'monthly', priority: 0.8, name: 'KT Plus', group: 'features', about: 'KT Plus premium features.' },
  { id: 'notes', path: '/notes', label: ['note'], href: ['note'], content: ['notes'], changefreq: 'monthly', priority: 0.8, name: 'Notes', group: 'features', about: 'Save messages, ideas and tasks as notes in KT Messenger.' },
  { id: 'minis', path: '/minis', label: ['mini'], href: ['mini'], content: ['minis'], changefreq: 'monthly', priority: 0.8, name: 'Minis', group: 'features', about: 'Watch, create and share short videos with KT Messenger Minis.' },
  { id: 'news', path: '/news', label: ['news'], href: ['news'], content: ['news'], listed: false, name: 'News', group: 'features' },
  { id: 'markets', path: '/markets', label: ['market'], href: ['market'], content: ['markets'], listed: false, name: 'Markets', group: 'features' },
  { id: 'wallet', path: '/wallet', label: ['wallet'], href: ['wallet'], content: ['wallet'], listed: false, name: 'Wallet', group: 'features' },
  { id: 'privacy', path: '/privacy', label: ['privac'], href: ['privac'], content: ['privacy'], changefreq: 'monthly', priority: 0.8, name: 'Privacy', group: 'trust', about: 'Privacy controls and how KT Messenger protects your information.' },
  { id: 'about', path: '/about', label: ['about'], href: ['about'], content: ['about'], changefreq: 'monthly', priority: 0.5, name: 'About KT Messenger', group: 'main', about: 'About KT Messenger and the team behind it.' },
  { id: 'careers', path: '/careers', label: ['career'], href: ['job'], content: ['careers'], changefreq: 'weekly', priority: 0.6, name: 'Careers', group: 'optional', about: 'Open roles and how the hiring process works.' },
  { id: 'contact', path: '/contact', label: ['contact'], href: ['contact'], content: ['contact'], changefreq: 'monthly', priority: 0.5, name: 'Contact', group: 'main', about: 'Contact the KT Messenger team for support, press, business and partnerships.' },
  { id: 'community', path: '/community', label: ['community'], href: ['community'], content: ['community', 'communities'], changefreq: 'monthly', priority: 0.5, name: 'Community', group: 'optional', about: 'Forums, events and the ambassador programme.' },
  { id: 'blog', path: '/blog', label: ['blog'], href: ['blog'], content: ['blog'], changefreq: 'daily', priority: 0.8, name: 'Blog', group: 'blog', about: 'News, guides and product updates from KT Messenger.' },
  { id: 'help', path: '/help', label: ['help'], href: ['help'], content: ['help'], changefreq: 'weekly', priority: 0.7, name: 'Help Center', group: 'help', about: 'Step-by-step guides and answers for using KT Messenger.' },
  { id: 'apps', path: '/apps', label: ['app'], href: ['app'], content: ['apps'], changefreq: 'monthly', priority: 0.9, name: 'Download KT Messenger', group: 'main', about: 'Download KT Messenger for Android, iPhone, Mac and Windows.' },
  { id: 'business', path: '/business', label: ['business'], href: ['business'], content: ['business'], changefreq: 'monthly', priority: 0.8, name: 'KT for Business', group: 'business', about: 'Tools for businesses to reach and support customers on KT Messenger.' },
]

// Routes with no navigation rule (never renamed by the admin navigation).
const EXTRA_ROUTES = [{ id: 'marketplace', path: '/marketplace', listed: false }]

const STATIC_PATHS = new Map([HOME, ...PAGES, ...EXTRA_ROUTES].map((p) => [p.path, p.id]))

// Detail pages, one per published CMS record.
export const DETAIL = {
  blogPost: { changefreq: 'monthly', priority: 0.7 },
  helpArticle: { changefreq: 'monthly', priority: 0.6 },
  businessPage: { changefreq: 'monthly', priority: 0.6 },
}

const SLUG = /^[a-z0-9-]+$/i
const HELP_PLACEHOLDER = /Manage the full content from the admin panel/i
// Admin form placeholder text and obvious test titles/slugs.
const TEST_CONTENT = /Your complete article content|lorem ipsum/i
const TEST_NAME = /\b(test|testing|dummy|leave[- ]blank)\b/i

/* ── helpers ──────────────────────────────────────────────────────────── */

export const newest = (...dates) => dates.flat().filter((d) => d instanceof Date && !Number.isNaN(d.getTime())).reduce((a, b) => (!a || b > a ? b : a), null)

// A site path as the website routes it: leading slash, no query, hash or
// trailing slash. Anything else (anchors, other hosts) is not a page URL.
function normalizePath(href) {
  const raw = String(href || '').trim()
  if (!raw.startsWith('/') || raw.startsWith('//')) return null
  const path = raw.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  return /^\/[A-Za-z0-9\-._~/%]*$/.test(path) ? path : null
}

export const absolute = (path) => `${env.siteUrl}${path}`

// Which page an admin navigation item opens — the same label-first matching
// as getComponentByLabelOrHref() in src/App.jsx.
function pageForNavItem(item) {
  const label = String(item.label || '').toLowerCase().trim()
  const href = String(item.href || '').toLowerCase().trim()
  for (const page of PAGES) if (label && page.label.some((k) => label.includes(k))) return page
  for (const page of PAGES) if (page.href.some((k) => href.includes(k))) return page
  return null
}

// Plain one-line text from HTML/markdown-ish CMS content.
const plain = (s) => String(s || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\{\{[^}]*\}\}/g, ' ')
  .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#0?39;|&apos;/gi, "'")
  .replace(/[#*_`>]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

// A body's first real paragraph as plain text — skipping lead-ins to a list
// ("...the following operating systems:") and very short lines.
const firstParagraph = (html) => {
  const paragraphs = [...String(html || '').matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => plain(m[1])).filter(Boolean)
  return paragraphs.find((p) => p.length >= 30 && !p.endsWith(':')) || paragraphs[0] || plain(html)
}

/* ── build ────────────────────────────────────────────────────────────── */

async function loadData() {
  const now = new Date()
  const [navItems, content, seoBlocks, posts, articles, helpCats, helpSubs, products, releases, jobs] = await Promise.all([
    // Top-level visible items of the three menus the website turns into
    // routes (src/App.jsx), header first so its URL wins for a page.
    prisma.navigationItem.findMany({ where: { visible: true, parentId: null, location: { in: ['header', 'features_menu', 'footer'] } }, orderBy: { order: 'asc' } }),
    prisma.websiteContent.findMany({ select: { key: true, updatedAt: true } }),
    prisma.websiteContent.findMany({ where: { key: { startsWith: 'seo.' } }, select: { key: true, data: true } }),
    prisma.blogPost.findMany({
      where: { OR: [{ status: 'PUBLISHED' }, { status: 'SCHEDULED', scheduledAt: { lte: now } }] },
      select: { slug: true, title: true, excerpt: true, seoDescription: true, body: true, publishedAt: true, scheduledAt: true, updatedAt: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.helpArticle.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, title: true, body: true, seoDescription: true, order: true, updatedAt: true, subcategory: { select: { title: true, order: true, category: { select: { title: true, order: true } } } } },
      orderBy: { order: 'asc' },
    }),
    prisma.helpCategory.findMany({ select: { updatedAt: true } }),
    prisma.helpSubcategory.findMany({ select: { updatedAt: true } }),
    prisma.businessProduct.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, title: true, subtitle: true, eyebrow: true, updatedAt: true }, orderBy: { order: 'asc' } }),
    prisma.appRelease.findMany({ where: { isCurrent: true }, select: { updatedAt: true } }),
    prisma.jobOpening.findMany({ where: { status: 'PUBLISHED' }, select: { updatedAt: true } }),
  ])
  return { navItems, content, seoBlocks, posts, articles, helpCats, helpSubs, products, releases, jobs }
}

export async function buildSiteModel() {
  const data = await loadData()

  const contentUpdated = new Map(data.content.map((c) => [c.key, c.updatedAt]))
  const pageContentDate = (page) =>
    newest((page.content || []).flatMap((n) => [`text.${n}`, `seo.${n}`, `${n}.hero`, `${n}.content`].map((k) => contentUpdated.get(k))))
  const seo = new Map(data.seoBlocks.map((b) => [b.key.slice(4), b.data && typeof b.data === 'object' ? b.data : {}]))
  // The admin's SEO description for a page, else the first sentence of its
  // SEO copy, else the built-in summary.
  const describe = (page) => {
    const block = seo.get(page.id) || {}
    const text = plain(block.description) || (plain(block.content).match(/^.*?[.!?](?=\s|$)/) || [])[0] || ''
    return text || page.about || ''
  }

  // The URL each page is published at: its admin navigation URL when it has
  // one (header, then features menu, then footer menu), otherwise its route.
  const urlFor = new Map()
  const byLocation = (loc) => data.navItems.filter((n) => n.location === loc)
  for (const item of [...byLocation('header'), ...byLocation('features_menu'), ...byLocation('footer')]) {
    const path = normalizePath(item.href)
    const page = path && pageForNavItem(item)
    if (!page || urlFor.has(page.id)) continue
    // A navigation URL equal to another page's own route renders that page.
    const owner = STATIC_PATHS.get(path)
    if (owner && owner !== page.id) continue
    urlFor.set(page.id, path)
  }

  const posts = data.posts
    .filter((p) => SLUG.test(p.slug))
    .map((p) => ({
      slug: p.slug,
      path: `/blog/${p.slug}`,
      title: plain(p.title),
      description: plain(p.seoDescription) || plain(p.excerpt),
      lastmod: newest(p.updatedAt, p.publishedAt, p.scheduledAt),
      test: TEST_CONTENT.test(p.body || '') || TEST_NAME.test(p.slug) || TEST_NAME.test(p.title || ''),
    }))

  const helpBase = urlFor.get('help') || '/help'
  const articles = data.articles
    .filter((a) => SLUG.test(a.slug))
    .map((a) => ({
      slug: a.slug,
      path: `${helpBase}/${a.slug}`,
      title: plain(a.title),
      description: plain(a.seoDescription) || (HELP_PLACEHOLDER.test(a.body || '') ? '' : firstParagraph(a.body)),
      category: plain(a.subcategory?.category?.title),
      categoryOrder: a.subcategory?.category?.order ?? 0,
      subcategoryOrder: a.subcategory?.order ?? 0,
      order: a.order ?? 0,
      lastmod: a.updatedAt,
      test: TEST_CONTENT.test(a.body || '') || TEST_NAME.test(a.slug) || TEST_NAME.test(a.title || ''),
    }))

  const business = data.products
    .filter((p) => SLUG.test(p.slug))
    .map((p) => ({
      slug: p.slug,
      path: `/business/${p.slug}`,
      title: plain(p.title),
      description: plain(p.subtitle),
      group: plain(p.eyebrow),
      lastmod: p.updatedAt,
      test: TEST_NAME.test(p.slug) || TEST_NAME.test(p.title || ''),
    }))

  const extraDates = {
    blog: newest(posts.map((p) => p.lastmod)),
    help: newest(data.articles.map((a) => a.updatedAt), data.helpCats.map((c) => c.updatedAt), data.helpSubs.map((s) => s.updatedAt)),
    business: newest(data.products.map((p) => p.updatedAt)),
    apps: newest(data.releases.map((r) => r.updatedAt)),
    careers: newest(data.jobs.map((j) => j.updatedAt)),
  }

  const pages = [{ ...HOME, path: '/', lastmod: pageContentDate(HOME), description: describe(HOME) }]
  for (const page of PAGES) {
    // A hidden page is listed as soon as the admin adds it to a navigation menu.
    if (page.listed === false && !urlFor.has(page.id)) continue
    pages.push({
      ...page,
      path: urlFor.get(page.id) || page.path,
      lastmod: newest(pageContentDate(page), extraDates[page.id]),
      changefreq: page.changefreq || 'monthly',
      priority: page.priority ?? 0.6,
      description: describe(page),
    })
  }

  return { pages, business, posts, articles, helpBase }
}

/* ── cache ────────────────────────────────────────────────────────────── */

let cache = null // { at, model }
let building = null

/** The current site model, cached for SITEMAP_CACHE_SECONDS; concurrent callers share one build. */
export async function getSiteModel() {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.model
  if (!building) {
    building = buildSiteModel()
      .then((model) => {
        cache = { at: Date.now(), model }
        return model
      })
      .finally(() => {
        building = null
      })
  }
  return building
}

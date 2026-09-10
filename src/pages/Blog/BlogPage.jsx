import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  FiSearch, FiArrowLeft, FiClock, FiArrowRight, FiX,
  FiCpu, FiRadio, FiPhone, FiMessageCircle, FiUsers, FiCamera, FiShield, FiBriefcase, FiCreditCard, FiShoppingBag,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { useLanguage } from '../../context/LanguageContext'
import { blogPosts as FALLBACK_POSTS } from './blogData'
import { api } from '../../services/apiClient'
import { trackBlogView } from '../../services/analytics'
import { useSeo } from '../../hooks/useSeo'
import footerImg from '../../assets/images/footer.jpg'
import multideviceImg from '../../assets/images/multidevice.jpg'
import privateImg from '../../assets/images/private.jpg'
import groupImg from '../../assets/images/group.jpg'
import heroImg from '../../assets/images/hero.jpg'
import businessImg from '../../assets/images/business.jpg'
import cyberpunkImg from '../../assets/images/cyberpunk_neon_city.png'
import securityImg from '../../assets/images/security.jpg'

const IMAGE_MAP = {
  footer: footerImg,
  multidevice: multideviceImg,
  private: privateImg,
  group: groupImg,
  hero: heroImg,
  business: businessImg,
  cyberpunk: cyberpunkImg,
  security: securityImg,
}
// Live posts carry a real coverUrl (from the DB / media library); hardcoded
// fallback posts carry an imageKey into the bundled asset map. Fall back to a
// bundled image so a missing cover never renders a broken <img>.
const imageFor = (post) => post.coverUrl || IMAGE_MAP[post.imageKey] || footerImg

// Bundled posts keyed by slug, so an opened article can render its full body
// instantly — with no network round-trip, even when the API is unreachable on
// deploy. This is what fixes "content shows on local but not on deploy".
const FALLBACK_BY_SLUG = new Map(FALLBACK_POSTS.map((p) => [p.slug, p]))

// Resolve `promise`, but give up after `ms` so a slow / hung request never
// leaves the blog stuck on a loading spinner.
const withTimeout = (promise, ms = 7000) => {
  let timer
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('request-timeout')), ms)
    }),
  ])
}

/* ────────────────────────────────────────────────────────────
 * API → view-model adapters. The DB is the source of truth; these map the
 * public API payload into the exact shape the existing design already renders,
 * so nothing about the layout / styling changes.
 * ──────────────────────────────────────────────────────────── */
const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const wordCount = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length
const readingTime = (text, floor = 2) => Math.max(floor, Math.round(wordCount(text) / 200))

// Turn a body into the {type} blocks the ArticleBody renderer expects.
// Supports markdown-ish bodies ("## heading", "- bullet", blank-line
// paragraphs) AND HTML bodies. HTML block tags are converted to the same
// markers and every remaining tag is stripped — we never inject raw HTML
// (no dangerouslySetInnerHTML), so author content cannot introduce XSS.
function parseBody(body) {
  let text = String(body || '')
  if (/<[a-z!/][\s\S]*>/i.test(text)) {
    text = text
      .replace(/<\s*(h[1-6])[^>]*>([\s\S]*?)<\s*\/\s*\1\s*>/gi, (_m, _tag, inner) => `\n## ${inner}\n`)
      .replace(/<\s*li[^>]*>([\s\S]*?)<\s*\/\s*li\s*>/gi, (_m, inner) => `\n- ${inner}\n`)
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      // Keep links: turn <a href="x">y</a> into markdown [y](x) before the
      // generic tag strip below removes it, so renderText can make it clickable.
      .replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\s*\/\s*a\s*>/gi, (_m, href, inner) => `[${inner.replace(/<[^>]+>/g, '').trim()}](${href.trim()})`)
      .replace(/<\s*\/\s*(p|div|section|article|ul|ol|h[1-6])\s*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;|&apos;/gi, "'")
  }
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let para = []
  let list = []
  const flushPara = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ').trim() }); para = [] } }
  const flushList = () => { if (list.length) { blocks.push({ type: 'ul', items: list.slice() }); list = [] } }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flushPara(); flushList(); continue }
    const h = line.match(/^#{1,6}\s+(.*)$/)
    if (h) { flushPara(); flushList(); blocks.push({ type: 'h', text: h[1].trim() }); continue }
    const li = line.match(/^[-*]\s+(.*)$/)
    if (li) { flushPara(); list.push(li[1].trim()); continue }
    flushList(); para.push(line)
  }
  flushPara(); flushList()
  return blocks
}

const normalizeCard = (p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category?.name || 'Blog',
  description: p.excerpt || '',
  date: formatDate(p.publishedAt),
  readMins: readingTime(p.excerpt),
  coverUrl: p.coverUrl || null,
  featured: !!p.featured,
  tags: p.tags || [],
  blocks: null, // filled in on demand when the article is opened
  _remote: true,
})

function normalizeDetail(p) {
  let blocks = parseBody(p.body)
  // Drop a leading heading that just repeats the title (many bodies start "# Title").
  if (blocks[0]?.type === 'h' && blocks[0].text.trim().toLowerCase() === String(p.title).trim().toLowerCase()) {
    blocks = blocks.slice(1)
  }
  if (!blocks.length && p.excerpt) blocks = [{ type: 'p', text: p.excerpt }]
  return {
    ...normalizeCard(p),
    readMins: readingTime(p.body || p.excerpt),
    blocks,
    // Carried through for the canonical/social tags — normalizeCard covers
    // only what the list view renders.
    seoTitle: p.seoTitle || null,
    seoDescription: p.seoDescription || null,
    ogImage: p.ogImage || null,
  }
}

// The `!` important flags override the global `a { color: inherit;
// text-decoration: none }` reset in index.css (an unlayered rule that would
// otherwise beat these Tailwind utilities), so blog links reliably show blue
// with an underline. Scoped to blog links only — other links are untouched.
const LINK_CLASS =
  'font-semibold !text-brand-strong !underline decoration-brand-strong/50 underline-offset-2 transition-colors hover:!text-brand-ink dark:!text-sky-300 dark:hover:!text-sky-200'

// A link written in a blog body — [text](/calling) or [text](https://…).
// Internal paths and same-site URLs use client-side routing (no full reload);
// external links open in a new tab. mailto:/tel:/#anchors render as plain <a>.
function BlogLink({ href, children }) {
  const url = String(href || '').trim()
  if (url.startsWith('/')) return <Link to={url} className={LINK_CLASS}>{children}</Link>
  if (/^https?:\/\//i.test(url)) {
    try {
      const u = new URL(url)
      if (typeof window !== 'undefined' && u.origin === window.location.origin) {
        return <Link to={u.pathname + u.search + u.hash} className={LINK_CLASS}>{children}</Link>
      }
    } catch {
      /* malformed URL — fall through to a plain external link */
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>{children}</a>
  }
  return <a href={url} className={LINK_CLASS}>{children}</a>
}

// Render inline **bold** highlights and [text](url) links inside a paragraph or
// bullet. Bold is a soft brand "marker"; links are clickable and route in-app
// for internal pages. box-decoration-clone keeps a highlight tidy across lines.
function renderText(text) {
  const nodes = []
  // Match either a markdown link [label](href) or a **bold** span.
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let key = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={key++}>{text.slice(last, m.index)}</span>)
    if (m[1] !== undefined) {
      nodes.push(<BlogLink key={key++} href={m[2]}>{m[1]}</BlogLink>)
    } else {
      nodes.push(
        <strong
          key={key++}
          className="rounded-[6px] box-decoration-clone bg-brand-soft/70 px-1.5 py-0.5 font-bold text-brand-strong dark:bg-brand-strong/20 dark:text-sky-300"
        >
          {m[3]}
        </strong>,
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) nodes.push(<span key={key++}>{text.slice(last)}</span>)
  return nodes
}

function ArticleBody({ blocks }) {
  const firstPara = blocks.findIndex((b) => b.type === 'p')
  return (
    <div>
      {blocks.map((block, i) => {
        if (block.type === 'h') {
          return (
            <h2
              key={i}
              className="mt-12 flex items-center gap-3.5 text-2xl font-extrabold tracking-tight text-ink sm:text-[1.8rem]"
            >
              <span
                aria-hidden
                className="h-7 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-brand-strong to-sky-400 shadow-[0_4px_12px_-2px_rgba(37,99,235,0.5)]"
              />
              {block.text}
            </h2>
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="mt-5 space-y-3">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="flex gap-3 rounded-2xl border border-transparent px-1 text-[17px] leading-8 text-body transition-colors"
                >
                  <span className="mt-[11px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-strong" />
                  </span>
                  <span>{renderText(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p
            key={i}
            className={`mt-5 text-[17px] leading-8 text-body ${
              i === firstPara
                ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:text-[3.4rem] first-letter:font-extrabold first-letter:leading-[0.72] first-letter:text-brand-strong'
                : ''
            }`}
          >
            {renderText(block.text)}
          </p>
        )
      })}
    </div>
  )
}

// Internal destinations a blog article can point readers to. Each entry lists
// keywords used to pick the most relevant pages for a given post, so the links
// are contextual and useful (and improve internal linking / discoverability).
const EXPLORE_PAGES = [
  { href: '/ai', label: 'KT AI', blurb: 'Your intelligent assistant, built right into every chat.', Icon: FiCpu, kw: ['ai', 'assistant', 'intelligent', 'smart', 'automation', 'bot', 'summar'] },
  { href: '/channels', label: 'Channels', blurb: 'Follow updates from the people and organizations you care about.', Icon: FiRadio, kw: ['channel', 'broadcast', 'follow', 'updates', 'creator', 'news', 'announcement'] },
  { href: '/calling', label: 'Voice & Video Calls', blurb: 'Crystal clear calls that live right inside your conversations.', Icon: FiPhone, kw: ['call', 'calling', 'voice', 'video', 'audio'] },
  { href: '/messaging', label: 'Messaging', blurb: 'Fast, private messaging for everything you want to share.', Icon: FiMessageCircle, kw: ['message', 'messaging', 'chat', 'text', 'conversation'] },
  { href: '/groups', label: 'Groups & Communities', blurb: 'Bring people together at any scale from close friends to communities.', Icon: FiUsers, kw: ['group', 'community', 'communities', 'team', 'event', 'poll'] },
  { href: '/status', label: 'Status', blurb: 'Share moments with photos, videos and text that disappear in 24 hours.', Icon: FiCamera, kw: ['status', 'story', 'stories', 'moment'] },
  { href: '/security', label: 'Security & Privacy', blurb: 'End to end encryption, on by default, for every conversation.', Icon: FiShield, kw: ['security', 'privacy', 'private', 'encryption', 'encrypted', 'safe', 'secure', 'authentication'] },
  { href: '/business', label: 'KT for Business', blurb: 'Turn conversations into lasting customer relationships.', Icon: FiBriefcase, kw: ['business', 'customer', 'marketing', 'commerce', 'sell', 'brand'] },
  { href: '/wallet', label: 'Wallet & Payments', blurb: 'Send and receive payments securely inside your chats.', Icon: FiCreditCard, kw: ['wallet', 'payment', 'pay', 'coin', 'money', 'transfer'] },
  { href: '/marketplace', label: 'Marketplace', blurb: 'Discover, buy and sell right where you already chat.', Icon: FiShoppingBag, kw: ['marketplace', 'buy', 'sell', 'shop', 'store', 'catalog'] },
]
const DEFAULT_EXPLORE = ['/ai', '/channels', '/calling']

// Pick up to 3 internal pages most relevant to a post (by category, tags, title
// and description), falling back to core pages so the section is always useful.
function relatedPages(post) {
  const hay = [post?.category, post?.title, post?.description, ...(post?.tags || []).map((t) => t?.name || t)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  const picks = EXPLORE_PAGES.map((p) => ({ p, score: p.kw.reduce((n, k) => n + (hay.includes(k) ? 1 : 0), 0) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.p)
  for (const href of DEFAULT_EXPLORE) {
    if (picks.length >= 3) break
    const d = EXPLORE_PAGES.find((p) => p.href === href)
    if (d && !picks.includes(d)) picks.push(d)
  }
  return picks.slice(0, 3)
}

function ArticleReader({ post, posts, onBack, onOpen }) {
  const { t } = useLanguage()
  const related = useMemo(() => {
    if (!posts.length) return []
    const start = posts.findIndex((p) => p.slug === post.slug)
    const base = start < 0 ? 0 : start
    const seen = new Set([post.slug])
    const out = []
    for (let offset = 1; offset <= posts.length && out.length < 3; offset += 1) {
      const rel = posts[(base + offset) % posts.length]
      if (rel && !seen.has(rel.slug)) { seen.add(rel.slug); out.push(rel) }
    }
    return out
  }, [post.slug, posts])

  // Show the intro paragraph above the hero image so readable content appears
  // immediately; the rest of the article follows below the image. Only lift the
  // lead out when there is more content after it — otherwise a short (single
  // paragraph) article would render nothing below the image.
  const hasLead = post.blocks.length > 1 && post.blocks[0]?.type === 'p'
  const bodyBlocks = hasLead ? post.blocks.slice(1) : post.blocks

  // Contextual internal links from this article to the most relevant KT pages.
  const explore = useMemo(() => relatedPages(post), [post])

  const BackButton = (
    <button
      type="button"
      onClick={onBack}
      className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-2 pr-5 text-sm font-bold text-ink shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand-strong hover:shadow-[0_14px_30px_-12px_rgba(37,99,235,0.5)]"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-brand-strong transition-all duration-300 group-hover:bg-brand-strong group-hover:text-white">
        <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-0.5" />
      </span>
      {t('Back to Blogs')}
    </button>
  )

  return (
    <Container className="py-10 lg:py-16">
      {BackButton}

      <Reveal from="up" className="mx-auto mt-8 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-brand-strong px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)]">
          {post.category}
        </span>
        <h1 className="mt-5 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.2rem]">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted">
          <span>{post.date}</span>
          <span className="h-1 w-1 rounded-full bg-muted/50" />
          <span className="inline-flex items-center gap-1.5">
            <FiClock /> {post.readMins} {t('min read')}
          </span>
        </div>
      </Reveal>

      {hasLead ? (
        <Reveal from="up" delay={0.03} className="mx-auto mt-7 max-w-3xl">
          <p className="border-l-4 border-brand-strong/70 pl-5 text-lg font-medium leading-8 text-ink sm:text-xl sm:leading-9">
            {renderText(post.blocks[0].text)}
          </p>
        </Reveal>
      ) : null}

      <Reveal from="up" delay={0.05} className="mx-auto mt-9 max-w-4xl">
        <div className="group overflow-hidden rounded-[28px] border border-line shadow-[0_30px_70px_-24px_rgba(37,99,235,0.45)]">
          {/* No fixed height: the hero takes its natural aspect ratio, so the
              whole cover shows instead of being cropped to a band. max-h with
              object-contain only kicks in for very tall images, which would
              otherwise push the article off the screen. */}
          <img
            src={imageFor(post)}
            alt={post.title}
            className="max-h-[760px] w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </Reveal>

      {/* amount="some" so long articles reveal as soon as any part scrolls into
          view — a tall body can never show 30% of itself at once, which would
          otherwise leave it stuck hidden (opacity 0). */}
      <Reveal from="up" delay={0.07} amount="some" className="mx-auto mt-10 max-w-3xl">
        <ArticleBody blocks={bodyBlocks} />
      </Reveal>

      {/* tags (only when the post has them) */}
      {post.tags?.length ? (
        <Reveal from="up" delay={0.12} className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((t) => (
              <span
                key={t.slug || t.name}
                className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink"
              >
                #{t.name}
              </span>
            ))}
          </div>
        </Reveal>
      ) : null}

      {/* related */}
      {related.length ? (
        <div className="mx-auto mt-16 max-w-4xl border-t border-line pt-12">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">{t('Related articles')}</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((rel) => (
              <button
                key={rel.slug}
                type="button"
                onClick={() => onOpen(rel.slug)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cream-2 text-left shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_24px_50px_-20px_rgba(37,99,235,0.45)]"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={imageFor(rel)}
                    alt={rel.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-ink">{rel.category}</span>
                  <h4 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-ink">{rel.title}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Explore on KT — contextual internal links to related feature pages */}
      {explore.length ? (
        <div className="mx-auto mt-14 max-w-4xl border-t border-line pt-12">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">{t('Explore on KT Messenger')}</h3>
          <p className="mt-1.5 text-sm leading-6 text-body">{t('Go deeper into the features this article touches on.')}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {explore.map(({ href, label, blurb, Icon }) => (
              <Link
                key={href}
                to={href}
                className="group flex flex-col rounded-2xl border border-line bg-cream-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_44px_-22px_rgba(37,99,235,0.5)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-strong">
                  <Icon className="text-lg" />
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-ink transition-colors group-hover:text-brand-ink">
                  {t(label)}
                  <FiArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 text-xs leading-5 text-body">{t(blurb)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto mt-12 max-w-4xl">{BackButton}</div>
    </Container>
  )
}

export function BlogPage() {
  // Start with the bundled posts already on screen so the blog renders instantly
  // — no loading spinner while the network responds.
  // The open article is driven by the URL (/blog/:slug) so it has a real,
  // shareable address and the browser Back button returns to the exact article
  // the reader came from (e.g. after tapping an in-article link to /ai).
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { slug: activeSlug = null } = useParams()
  const [posts, setPosts] = useState(FALLBACK_POSTS)
  const [loading] = useState(false)
  const [activePost, setActivePost] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  // Revalidate from the API (DB = source of truth) in the background. If it
  // returns published posts, swap them in; if it's slow / unreachable (deploy
  // with the DB down), the timeout fires and we simply keep the bundled posts,
  // so the page is never blank and never hangs on a spinner.
  useEffect(() => {
    let alive = true
    withTimeout(api.listBlog({ page: 1, pageSize: 30 }))
      .then(({ items }) => {
        if (!alive) return
        const mapped = (items || []).map(normalizeCard)
        if (mapped.length) setPosts(mapped)
      })
      .catch(() => {
        /* keep the bundled posts already shown */
      })
    return () => {
      alive = false
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSlug])

  // Guards against a slow background fetch (for a slug the reader has since
  // navigated away from) overwriting the article now on screen.
  const openSlugRef = useRef(null)

  // Load whenever the URL slug changes — on open, on a direct visit, and when
  // the Back button lands on /blog/:slug. Bundled/known articles show instantly,
  // then a background API fetch swaps in the latest DB version so admin edits
  // (including in-article links) appear.
  useEffect(() => {
    if (!activeSlug) {
      setActivePost(null)
      setArticleLoading(false)
      return
    }
    const slug = activeSlug
    openSlugRef.current = slug
    let cancelled = false
    const isCurrent = () => !cancelled && openSlugRef.current === slug
    const card = posts.find((p) => p.slug === slug)
    // Record the article read (once per slug — the guard above de-dupes).
    trackBlogView(slug, card?.title)
    const bundled = FALLBACK_BY_SLUG.get(slug)
    const instant = card?.blocks?.length ? card : bundled?.blocks?.length ? bundled : null
    if (instant) {
      setActivePost(instant)
      setArticleLoading(false)
      ;(async () => {
        try {
          const full = await withTimeout(api.getBlog(slug))
          if (isCurrent()) setActivePost(normalizeDetail(full))
        } catch {
          /* keep the instant copy */
        }
      })()
    } else {
      setActivePost(null)
      setArticleLoading(true)
      ;(async () => {
        try {
          const full = await withTimeout(api.getBlog(slug))
          if (isCurrent()) setActivePost(normalizeDetail(full))
        } catch {
          if (isCurrent())
            setActivePost(
              card
                ? { ...card, blocks: card.blocks?.length ? card.blocks : [{ type: 'p', text: card.description || '' }] }
                : bundled || null,
            )
        } finally {
          if (!cancelled) setArticleLoading(false)
        }
      })()
    }
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug])

  const openArticle = (slug) => navigate(`/blog/${slug}`)
  const closeArticle = () => navigate('/blog')

  // Canonical + social tags. The path is built from `activeSlug` — the slug in
  // the URL, which is the admin-defined slug stored in the database — so the
  // canonical link, the shared link and the stored slug are always one string.
  useSeo({
    enabled: !!activeSlug,
    path: activeSlug ? `/blog/${activeSlug}` : '/blog',
    type: 'article',
    title: activePost ? `${activePost.seoTitle || activePost.title} · KT Messenger Blog` : undefined,
    description: activePost?.seoDescription || activePost?.description || undefined,
    image: activePost?.ogImage || activePost?.coverUrl || undefined,
  })

  // Index page tags, so /blog itself is also canonical.
  useSeo({
    enabled: !activeSlug,
    path: '/blog',
    title: 'KT Messenger Blog',
    description: 'Everything KT can do, explained simply from messaging and calls to AI, payments, communities and business.',
  })

  if (activeSlug) {
    return (
      <MainLayout>
        {activePost ? (
          <ArticleReader post={activePost} posts={posts} onBack={closeArticle} onOpen={openArticle} />
        ) : (
          <Container className="py-24">
            <div className="flex flex-col items-center justify-center gap-3 text-muted">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-strong" />
              <p className="text-sm font-medium">{articleLoading ? t('Loading article…') : t('Article not found.')}</p>
              {!articleLoading ? (
                <button
                  type="button"
                  onClick={closeArticle}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand-ink"
                >
                  <FiArrowLeft /> {t('Back to Blogs')}
                </button>
              ) : null}
            </div>
          </Container>
        )}
      </MainLayout>
    )
  }

  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const query = search.trim().toLowerCase()
  const searching = query.length > 0
  const matchesQuery = (p) => {
    if (!query) return true
    const hay = [p.title, p.description, p.category, ...(Array.isArray(p.tags) ? p.tags : [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return hay.includes(query)
  }
  const inCategory = (p) => category === 'All' || p.category === category
  // In the default view the featured post is shown separately, so drop it from
  // the grid; when searching or filtering we want every match to appear.
  const gridSource = !searching && category === 'All' ? posts.filter((p) => p !== featuredPost) : posts
  const visible = gridSource.filter((p) => inCategory(p) && matchesQuery(p))

  return (
    <MainLayout>
      <Container className="py-14 lg:py-20">
        {/* search */}
        <div className="mb-10 flex justify-center lg:mb-14 lg:justify-end">
          <label className="group flex w-full max-w-md items-center gap-3 rounded-full border border-line bg-surface px-5 py-3 shadow-soft transition-all duration-200 focus-within:border-brand focus-within:shadow-card focus-within:ring-2 focus-within:ring-brand/15">
            <FiSearch className="shrink-0 text-lg text-muted transition-colors group-focus-within:text-brand-strong" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search the blog…')}
              className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted"
              aria-label={t('Search blog')}
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label={t('Clear search')}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <FiX className="text-sm" />
              </button>
            ) : null}
          </label>
        </div>

        {/* title */}
        <Reveal from="up">
          <h1 className="text-center text-[2.6rem] font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {t('KT Messenger Blog')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-body">
            {t('Everything KT can do, explained simply from messaging and calls to AI, payments, communities and business.')}
          </p>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-strong" />
            <p className="text-sm font-medium">{t('Loading articles…')}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-lg font-bold text-ink">{t('No articles published yet')}</p>
            <p className="max-w-md text-sm leading-6 text-body">
              {t('New stories from the KT Messenger team will appear here as soon as they go live.')}
            </p>
          </div>
        ) : (
          <>
            {/* featured (only on the unfiltered, non-search view) */}
            {category === 'All' && !searching && featuredPost ? (
              <Reveal from="up" delay={0.06} className="mt-14 lg:mt-20">
                <button
                  type="button"
                  onClick={() => openArticle(featuredPost.slug)}
                  className="group grid w-full overflow-hidden rounded-[30px] border border-line bg-cream-2 text-left shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-float lg:grid-cols-2"
                >
                  <div className="relative min-h-[260px] overflow-hidden lg:min-h-[360px]">
                    <img
                      src={imageFor(featuredPost)}
                      alt={featuredPost.title}
                      className="h-full w-full object-contain transition-transform duration-[600ms] ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-brand-strong px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-brand">
                      {t('Featured')}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">
                      <span>{featuredPost.category}</span>
                      <span className="h-1 w-1 rounded-full bg-muted/50" />
                      <span className="inline-flex items-center gap-1 text-muted">
                        <FiClock /> {featuredPost.readMins} {t('min read')}
                      </span>
                    </div>
                    <h2 className="mt-3.5 text-[1.7rem] font-bold leading-[1.15] text-ink lg:text-[2.1rem]">{featuredPost.title}</h2>
                    <p className="mt-4 text-[15px] leading-7 text-body">{featuredPost.description}</p>
                    <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-strong px-5 py-2.5 text-sm font-bold text-white shadow-brand transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-strong-hover">
                      {t('Read More')} <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ) : null}

            {/* category filter */}
            <div className="mt-12 flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    category === cat
                      ? 'bg-brand-strong text-white shadow-brand'
                      : 'border border-line bg-surface text-body hover:-translate-y-0.5 hover:border-brand/40 hover:text-ink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* search results count */}
            {searching ? (
              <p className="mt-8 text-sm font-semibold text-body">
                {visible.length} {visible.length === 1 ? t('result') : t('results')} {t('for')} “{search.trim()}”
              </p>
            ) : null}

            {/* no results */}
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                <p className="text-lg font-bold text-ink">{t('No articles found')}</p>
                <p className="max-w-md text-sm leading-6 text-body">
                  {searching
                    ? `Nothing matched “${search.trim()}”. Try a different keyword${category !== 'All' ? ' or category' : ''}.`
                    : t('No articles in this category yet.')}
                </p>
                {searching ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand-ink"
                  >
                    <FiX /> {t('Clear search')}
                  </button>
                ) : null}
              </div>
            ) : null}

            {/* article cards */}
            <div className="mt-10 grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post, index) => (
                <Reveal key={post.slug} from="up" delay={(index % 3) * 0.05} className="h-full">
                  <button
                    type="button"
                    onClick={() => openArticle(post.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-cream-2 text-left shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-float"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={imageFor(post)}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-[600ms] ease-out group-hover:scale-110"
                      />
                      <span className="absolute left-4 top-4 rounded-full border border-line bg-surface/90 px-3 py-1 text-[11px] font-bold text-brand-ink shadow-sm backdrop-blur">
                        {post.category}
                      </span>
                      <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-slate-950/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        <FiClock className="text-[11px]" /> {post.readMins} {t('min')}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-[11px] font-semibold text-muted">{post.date}</span>
                      <h3 className="mt-2 text-lg font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand-ink">
                        {post.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-body line-clamp-3">{post.description}</p>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink">
                        {t('Read More')} <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Container>
    </MainLayout>
  )
}

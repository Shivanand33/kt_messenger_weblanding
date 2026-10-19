import { img, imgAlt } from '../../utils/imageOverrides'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  FiSearch, FiArrowLeft, FiClock, FiArrowRight, FiX,
  FiChevronRight, FiMail, FiLink, FiCheck,
  FiCpu, FiRadio, FiPhone, FiMessageCircle, FiUsers, FiCamera, FiShield,
  FiBriefcase, FiCreditCard, FiShoppingBag,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { SOCIAL_LINKS } from '../../components/layout/Footer/Footer'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { useLanguage } from '../../context/LanguageContext'
import { blogPosts as FALLBACK_POSTS } from './blogData'
import { parseBody } from '../../utils/parseBody'
import { api } from '../../services/apiClient'
import { trackBlogView } from '../../services/analytics'
import { useSeo } from '../../hooks/useSeo'
import { JsonLd } from '../../components/common/JsonLd/JsonLd'
import { contentText } from '../../i18n/contentTranslations'
import { DEFAULT_LANG, currentLanguage } from '../../i18n/languageUrls'
import footerImg from '../../assets/images/social-networking-platform-footer.jpg'
import multideviceImg from '../../assets/images/multidevice.jpg'
import privateImg from '../../assets/images/messaging-app-private-chat.jpg'
import groupImg from '../../assets/images/group-chat-app-community.jpg'
import heroImg from '../../assets/images/ai-assistant-app-hero.jpg'
import businessImg from '../../assets/images/online-marketplace-app-business.jpg'
import cyberpunkImg from '../../assets/images/cyberpunk_neon_city.png'
import securityImg from '../../assets/images/security.jpg'
import { mediaUrl, mediaUrlsInHtml } from '../../utils/mediaUrl'

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

const imageFor = (post) => mediaUrl(post?.coverUrl) || IMAGE_MAP[post?.imageKey] || footerImg

const FALLBACK_BY_SLUG = new Map(FALLBACK_POSTS.map((p) => [p.slug, p]))

const withTimeout = (promise, ms = 7000) => {
  let timer
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('request-timeout')), ms)
    }),
  ])
}

const localized = (s) => (typeof s === 'string' && contentText(s)) || s
const localizedTag = (tag) => (tag && typeof tag === 'object' ? { ...tag, name: localized(tag.name) } : localized(tag))

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const { lang } = currentLanguage()
  return d.toLocaleDateString(lang === DEFAULT_LANG ? 'en-US' : lang, { year: 'numeric', month: 'long', day: 'numeric' })
}

const wordCount = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length
const readingTime = (text, floor = 2) => Math.max(floor, Math.round(wordCount(text) / 200))

const normalizeCard = (p) => ({
  slug: p.slug,
  title: localized(p.title),
  category: localized(p.category?.name) || 'Product',
  description: localized(p.excerpt || ''),
  date: formatDate(p.publishedAt),
  readMins: readingTime(p.excerpt),
  coverUrl: p.coverUrl || null,
  featured: !!p.featured,
  tags: (p.tags || []).map(localizedTag),
  blocks: null,
  _remote: true,
})

function normalizeDetail(p) {
  const body = mediaUrlsInHtml(localized(p.body))
  let blocks = parseBody(body)
  const first = (body === p.body ? blocks : parseBody(p.body))[0]
  if (first?.type === 'h' && blocks[0]?.type === 'h' && first.text.trim().toLowerCase() === String(p.title).trim().toLowerCase()) {
    blocks = blocks.slice(1)
  }
  if (!blocks.length && p.excerpt) blocks = [{ type: 'p', text: localized(p.excerpt) }]
  return {
    ...normalizeCard(p),
    readMins: readingTime(p.body || p.excerpt),
    blocks,
    seoTitle: localized(p.seoTitle) || null,
    seoDescription: localized(p.seoDescription) || null,
    ogImage: mediaUrl(p.ogImage) || null,
    schemaJson: typeof p.schemaJson === 'string' && p.schemaJson.trim() ? p.schemaJson.trim() : null,
    publishedAt: p.publishedAt || null,
    updatedAt: p.updatedAt || null,
  }
}

const SITE = 'https://ktmessenger.com'

/**
 * The Article schema for a post: whatever the admin wrote for it, or one built
 * from the post's own fields so that every article carries structured data.
 *
 * A custom block is re-serialised rather than passed through, which keeps a
 * stray trailing comma or a comment out of the document — and returns null if
 * it will not parse, because no schema beats a broken one.
 */
function articleSchema(post, path) {
  if (post.schemaJson) {
    try {
      return JSON.stringify(JSON.parse(post.schemaJson))
    } catch {
      return null
    }
  }

  const url = `${SITE}${path}`
  const org = { '@type': 'Organization', name: 'KT Messenger' }
  // Schema.org wants absolute URLs; a bundled fallback cover is site-relative.
  const image = post.ogImage || mediaUrl(post.coverUrl) || null
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    // The post's own title, not the SEO title: that field often holds a longer
    // search-result sentence, and a headline is meant to be the headline.
    headline: post.title,
    description: post.seoDescription || post.description || undefined,
    url,
    image: image ? (image.startsWith('/') ? `${SITE}${image}` : image) : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: org,
    publisher: org,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  })
}

const LINK_CLASS =
  'font-semibold !text-brand-strong !underline decoration-brand-strong/50 underline-offset-2 transition-colors hover:!text-brand-ink dark:!text-sky-300 dark:hover:!text-sky-200'

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
      /* ignore */
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>{children}</a>
  }
  return <a href={url} className={LINK_CLASS}>{children}</a>
}

function renderText(text) {
  const nodes = []
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
    <div className="prose-blog">
      {blocks.map((block, i) => {
        if (block.type === 'h') {
          return (
            <h2
              key={i}
              className="mt-12 text-2xl sm:text-3xl font-normal sm:font-medium tracking-tight text-ink"
            >
              {block.text}
            </h2>
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="mt-5 space-y-3 pl-5 list-disc text-body text-[17px] leading-8">
              {block.items.map((item, j) => (
                <li key={j}>
                  <span>{renderText(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'img') {
          // A side image takes three fifths of the reading column from lg up,
          // where there is room for it, and max-w-2xl stops it growing further
          // on very wide screens. Below lg it stays at half the column: a
          // phone only has ~335px of column, so a larger share would squeeze
          // the text wrapping beside it down to a few words per line.
          const alignClass =
            block.align === 'left'
              ? 'float-left mr-6 w-1/2 lg:w-3/5 max-w-2xl'
              : block.align === 'right'
                ? 'float-right ml-6 w-1/2 lg:w-3/5 max-w-2xl'
                : block.align === 'center'
                  ? 'mx-auto max-w-2xl'
                  : ''
          const floated = block.align === 'left' || block.align === 'right'
          return (
            <figure key={i} className={`mt-7 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft ${alignClass} ${floated ? 'my-3' : ''}`}>
              <img src={img(block.src)} alt={imgAlt(block.src, block.alt)} loading="lazy" className="w-full object-cover" />
              {block.alt ? (
                <figcaption className="px-4 py-2.5 text-xs font-medium text-muted">{block.alt}</figcaption>
              ) : null}
            </figure>
          )
        }
        if (block.type === 'quote') {
          return (
            <blockquote
              key={i}
              className="mt-7 border-l-4 border-ink/40 pl-5 text-[17px] font-normal leading-8 text-ink italic"
            >
              {renderText(block.text)}
            </blockquote>
          )
        }
        if (block.type === 'hr') {
          return <hr key={i} className="my-10 border-line" />
        }
        if (block.type === 'table') {
          return (
            <div key={i} className="mt-7 overflow-x-auto rounded-2xl border border-line shadow-soft">
              <table className="w-full text-left text-[15px]">
                <tbody>
                  {block.rows.map((row, r) => (
                    <tr key={r} className={r === 0 ? 'bg-cream-2 font-bold text-ink' : 'odd:bg-surface even:bg-cream dark:odd:bg-surface-2 dark:even:bg-surface'}>
                      {row.map((cell, c) => (
                        <td key={c} className="border-b border-line px-5 py-3 align-top text-body">
                          {renderText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return (
          <p
            key={i}
            className={`mt-5 text-[17px] sm:text-[18px] leading-8 text-body font-normal ${
              i === firstPara ? 'text-ink/90' : ''
            }`}
          >
            {renderText(block.text)}
          </p>
        )
      })}
    </div>
  )
}

const EXPLORE_PAGES = [
  { href: '/ai-assistant-app', label: 'KT AI', blurb: 'Your intelligent assistant, built right into every chat.', Icon: FiCpu, kw: ['ai', 'assistant', 'intelligent', 'smart', 'automation', 'bot', 'summar'] },
  { href: '/social-media-platform', label: 'Channels', blurb: 'Follow updates from the people and organizations you care about.', Icon: FiRadio, kw: ['channel', 'broadcast', 'follow', 'updates', 'creator', 'news', 'announcement'] },
  { href: '/video-calling-app', label: 'Voice & Video Calls', blurb: 'Crystal clear calls that live right inside your conversations.', Icon: FiPhone, kw: ['call', 'calling', 'voice', 'video', 'audio'] },
  { href: '/messaging', label: 'Messaging', blurb: 'Fast, private messaging for everything you want to share.', Icon: FiMessageCircle, kw: ['message', 'messaging', 'chat', 'text', 'conversation'] },
  { href: '/group-chat-app', label: 'Groups & Communities', blurb: 'Bring people together at any scale from close friends to communities.', Icon: FiUsers, kw: ['group', 'community', 'communities', 'team', 'event', 'poll'] },
  { href: '/social-feed-app', label: 'Status', blurb: 'Share moments with photos, videos and text that disappear in 24 hours.', Icon: FiCamera, kw: ['status', 'story', 'stories', 'moment'] },
  { href: '/secure-messaging-app', label: 'Security & Privacy', blurb: 'End to end encryption, on by default, for every conversation.', Icon: FiShield, kw: ['security', 'privacy', 'private', 'encryption', 'encrypted', 'safe', 'secure', 'authentication'] },
  { href: '/business-messaging-app', label: 'KT for Business', blurb: 'Turn conversations into lasting customer relationships.', Icon: FiBriefcase, kw: ['business', 'customer', 'marketing', 'commerce', 'sell', 'brand'] },
  { href: '/wallet', label: 'Wallet & Payments', blurb: 'Send and receive payments securely inside your chats.', Icon: FiCreditCard, kw: ['wallet', 'payment', 'pay', 'coin', 'money', 'transfer'] },
  { href: '/marketplace', label: 'Marketplace', blurb: 'Discover, buy and sell right where you already chat.', Icon: FiShoppingBag, kw: ['marketplace', 'buy', 'sell', 'shop', 'store', 'catalog'] },
]
const DEFAULT_EXPLORE = ['/ai-assistant-app', '/social-media-platform', '/video-calling-app']

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

/* KT Ecosystem Mini Platform Icons (Jaadoe, Seezitt, WN Social, Omre, Werfie, Vidmero) */
function KtPlatformsRow() {
  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
          aria-label={item.name}
          className="grid h-7 w-7 place-items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white shadow-xs transition-all hover:scale-110 hover:border-ink hover:shadow-sm"
        >
          <img src={item.icon} alt={item.name} className="h-4 w-4 object-contain rounded-full" loading="lazy" />
        </a>
      ))}
    </div>
  )
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

  const hasLead = post.blocks && post.blocks.length > 1 && post.blocks[0]?.type === 'p'
  const bodyBlocks = hasLead ? post.blocks.slice(1) : (post.blocks || [])
  const explore = useMemo(() => relatedPages(post), [post])

  return (
    <Container className="py-10 lg:py-16 max-w-4xl">
      {/* Top Back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-ink transition-colors"
      >
        <FiArrowLeft className="text-base transition-transform group-hover:-translate-x-1" />
        <span>{t('Back to Blog')}</span>
      </button>

      {/* Article Header */}
      <div className="mt-8">
        {/* Date and Social Share Row */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-body">{post.date}</span>
          <KtPlatformsRow />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-normal sm:font-medium leading-[1.2] tracking-tight text-ink">
          {post.title}
        </h1>
      </div>

      {/* Cover Image Banner */}
      <div className="mt-8 overflow-hidden rounded-[28px] sm:rounded-[36px]">
        <img
          src={img(imageFor(post))}
          alt={imgAlt(imageFor(post), post.title)}
          className="w-full max-h-[600px] object-cover"
        />
      </div>

      {/* Lead Paragraph */}
      {hasLead ? (
        <div className="mt-8 text-lg sm:text-xl font-normal leading-relaxed text-ink">
          {renderText(post.blocks[0].text)}
        </div>
      ) : null}

      {/* Main Body */}
      <div className="mt-8">
        <ArticleBody blocks={bodyBlocks} />
      </div>

      {/* Related Stories */}
      {related.length ? (
        <div className="mt-20 border-t border-line pt-12">
          <h3 className="text-2xl font-normal text-ink">{t('More from KT Messenger')}</h3>
          <div className="mt-8 space-y-12">
            {related.map((rel) => (
              <div
                key={rel.slug}
                onClick={() => onOpen(rel.slug)}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 cursor-pointer items-center"
              >
                <div className="md:col-span-4 aspect-[16/10] overflow-hidden rounded-2xl">
                  <img
                    src={img(imageFor(rel))}
                    alt={imgAlt(imageFor(rel), rel.title)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="md:col-span-8">
                  <span className="text-xs text-body">{rel.date}</span>
                  <h4 className="mt-1 text-lg sm:text-xl font-normal leading-snug text-ink group-hover:underline">
                    {rel.title}
                  </h4>
                  <p className="mt-2 text-sm text-body line-clamp-2">{rel.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:underline">
                    {t('Learn more')} <FiChevronRight className="text-xs" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Explore Internal Links */}
      {explore.length ? (
        <div className="mt-16 border-t border-line pt-12">
          <h3 className="text-xl font-normal text-ink">{t('Explore KT Features')}</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {explore.map(({ href, label, blurb, Icon }) => (
              <Link
                key={href}
                to={href}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-all hover:border-gray-400 hover:shadow-soft"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream-2 text-ink">
                  <Icon className="text-lg" />
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:underline">
                  {t(label)} <FiChevronRight className="text-xs" />
                </span>
                <span className="mt-1 text-xs leading-5 text-body">{t(blurb)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Bottom Back Button */}
      <div className="mt-14 text-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-gray-400 dark:border-gray-600 bg-surface px-6 py-2.5 text-sm font-medium text-ink hover:border-ink transition-colors"
        >
          <FiArrowLeft /> {t('Back to Blog')}
        </button>
      </div>
    </Container>
  )
}

export function BlogPage() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { slug: activeSlug = null } = useParams()
  const [posts, setPosts] = useState(FALLBACK_POSTS)
  const [activePost, setActivePost] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Revalidate from public API
  useEffect(() => {
    let alive = true
    withTimeout(api.listBlog({ page: 1, pageSize: 50 }))
      .then(({ items }) => {
        if (!alive) return
        const mapped = (items || []).map(normalizeCard)
        if (mapped.length) setPosts(mapped)
      })
      .catch(() => {
        /* keep bundled posts */
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSlug])

  const openSlugRef = useRef(null)

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
    trackBlogView(slug, card?.title)
    const bundled = FALLBACK_BY_SLUG.get(slug)
    const instant = card?.blocks?.length ? card : lang === DEFAULT_LANG && bundled?.blocks?.length ? bundled : null

    if (instant) {
      setActivePost(instant)
      setArticleLoading(false)
      ;(async () => {
        try {
          const full = await withTimeout(api.getBlog(slug))
          if (isCurrent()) setActivePost(normalizeDetail(full))
        } catch {
          /* keep instant */
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

  // Structured data for the open article — the admin's own block when they
  // wrote one, otherwise generated from the post.
  const articleJsonLd = activePost && activeSlug ? articleSchema(activePost, `/blog/${activeSlug}`) : null

  const openArticle = (slug) => navigate(`/blog/${slug}`)
  const closeArticle = () => navigate('/messaging-social-media-blog')

  useSeo({
    enabled: !!activeSlug,
    hreflang: Boolean(activePost),
    path: activeSlug ? `/blog/${activeSlug}` : '/messaging-social-media-blog',
    type: 'article',
    title: activePost ? `${activePost.seoTitle || activePost.title} · ${t('KT Messenger Blog')}` : undefined,
    description: activePost?.seoDescription || activePost?.description || undefined,
    image: activePost?.ogImage || activePost?.coverUrl || undefined,
  })

  useSeo({
    enabled: !activeSlug,
    path: '/messaging-social-media-blog',
    title: 'KT Messenger Blog | News, Updates & Stories',
    description: 'Explore the official KT Messenger blog for product updates, account security, new features, and communication tips.',
  })

  if (activeSlug) {
    return (
      <MainLayout>
        {activePost ? (
          <>
            {articleJsonLd ? <JsonLd id={`blog-${activeSlug}`} json={articleJsonLd} /> : null}
            <ArticleReader post={activePost} posts={posts} onBack={closeArticle} onOpen={openArticle} />
          </>
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
                  <FiArrowLeft /> {t('Back to Blog')}
                </button>
              ) : null}
            </div>
          </Container>
        )}
      </MainLayout>
    )
  }

  const query = search.trim().toLowerCase()
  const searching = query.length > 0

  const matchesQuery = (p) => {
    if (!query) return true
    const hay = [p.title, p.description, p.category, ...(Array.isArray(p.tags) ? p.tags.map((t) => t?.name || t) : [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return hay.includes(query)
  }

  // Top featured post
  const featuredPost = posts.find((p) => p.featured) || posts[0]

  // In default view, the top post is rendered as the main featured story;
  // subsequent posts appear below in the 2-column layout.
  // In search view, all matching posts are displayed.
  const visible = searching ? posts.filter(matchesQuery) : posts
  const secondaryPosts = searching ? visible : visible.filter((p) => p !== featuredPost)

  return (
    <MainLayout>
      <Container className="py-8 sm:py-12 max-w-5xl">
        {/* Top Minimalist Search Bar (WhatsApp style: Search blog: ______ Q) */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2 border-b border-gray-400 dark:border-gray-600 pb-1.5 w-full max-w-[280px] focus-within:border-ink transition-colors">
            <span className="text-sm text-body whitespace-nowrap">{t('Search blog:')}</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-ink outline-none px-1"
              aria-label={t('Search blog')}
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-muted hover:text-ink text-xs p-0.5"
              >
                <FiX />
              </button>
            ) : null}
            <FiSearch className="text-base text-ink/70 shrink-0" />
          </div>
        </div>

        {/* Big Centered Headline: WhatsApp Blog model */}
        <div className="text-center my-10 sm:my-14">
          <h1 className="text-4xl sm:text-6xl lg:text-[4.2rem] font-normal tracking-tight text-ink font-sans">
            {t('KT Messenger Blog')}
          </h1>
        </div>

        {/* Searching feedback banner */}
        {searching && (
          <div className="mb-10 flex items-center justify-between border-b border-line pb-3">
            <span className="text-sm text-body">
              {visible.length} {visible.length === 1 ? t('story found') : t('stories found')} {t('for')} “{search.trim()}”
            </span>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-semibold text-brand-strong hover:underline"
            >
              {t('Clear search')}
            </button>
          </div>
        )}

        {/* No Search Results */}
        {searching && visible.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-normal text-ink">{t('No stories found')}</p>
            <p className="text-sm text-body mt-1">{t('Try searching with a different term.')}</p>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:underline"
            >
              <FiX className="text-xs" /> {t('Clear search')}
            </button>
          </div>
        )}

        {/* HERO ARTICLE (Screenshot 2 model) */}
        {!searching && featuredPost && (
          <Reveal from="up">
            <article className="group cursor-pointer" onClick={() => openArticle(featuredPost.slug)}>
              {/* Date & Social Share Row */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-body">{featuredPost.date}</span>
                <KtPlatformsRow />
              </div>

              {/* Title */}
              <h2 className="mt-3.5 text-2xl sm:text-4xl lg:text-[2.6rem] font-normal leading-[1.2] text-ink group-hover:underline">
                {featuredPost.title}
              </h2>

              {/* Hero Image Banner */}
              <div className="mt-6 overflow-hidden rounded-[28px] sm:rounded-[36px]">
                <img
                  src={img(imageFor(featuredPost))}
                  alt={imgAlt(imageFor(featuredPost), featuredPost.title)}
                  className="max-h-[520px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>

              {/* Excerpt */}
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-body max-w-4xl">
                {featuredPost.description}
              </p>

              {/* Learn more > */}
              <div className="mt-4">
                <span className="inline-flex items-center gap-1 text-sm sm:text-base font-semibold text-ink group-hover:underline">
                  {t('Learn more')} <FiChevronRight className="text-sm" />
                </span>
              </div>
            </article>
          </Reveal>
        )}

        {/* SUBSEQUENT ARTICLES (Screenshot 1 model: 2-column horizontal list) */}
        <div className={`space-y-16 sm:space-y-24 ${!searching ? 'mt-16 sm:mt-24 pt-16 sm:pt-20 border-t border-line' : 'mt-8'}`}>
          {secondaryPosts.map((post) => (
            <Reveal key={post.slug} from="up">
              <article
                onClick={() => openArticle(post.slug)}
                className="group grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center cursor-pointer"
              >
                {/* Left Column: Image in rounded container */}
                <div className="md:col-span-5 lg:col-span-5">
                  <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] aspect-[16/10] sm:aspect-[4/3]">
                    <img
                      src={img(imageFor(post))}
                      alt={imgAlt(imageFor(post), post.title)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Right Column: Date + Share Icons, Title, Excerpt, Learn more > */}
                <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-center">
                  {/* Date & Share Row */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-body">{post.date}</span>
                    <KtPlatformsRow />
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-2xl sm:text-3xl lg:text-[2rem] font-normal sm:font-medium leading-snug text-ink group-hover:underline">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-body line-clamp-4">
                    {post.description}
                  </p>

                  {/* Learn more > */}
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 text-sm sm:text-base font-semibold text-ink group-hover:underline">
                      {t('Learn more')} <FiChevronRight className="text-sm" />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* KT on Every Platform */}
        <Reveal from="up" className="mt-20 sm:mt-28 border-t border-line pt-12">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-normal text-ink">
              {t('KT on every platform')}
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="grid h-10 w-10 place-items-center rounded-full border border-gray-400/80 dark:border-gray-600 bg-white shadow-sm transition-all hover:border-ink hover:scale-105"
                >
                  <img src={social.icon} alt="" width="20" height="20" loading="lazy" className="h-5 w-5 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </MainLayout>
  )
}

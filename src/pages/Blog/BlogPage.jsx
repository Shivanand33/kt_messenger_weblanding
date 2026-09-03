import { useEffect, useMemo, useState } from 'react'
import { FiSearch, FiArrowLeft, FiClock, FiArrowRight } from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { blogPosts as FALLBACK_POSTS } from './blogData'
import { api } from '../../services/apiClient'
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
  }
}

// Render **bold** highlights inside a paragraph or bullet.
function renderText(text) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ink">{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function ArticleBody({ blocks }) {
  return (
    <div>
      {blocks.map((block, i) => {
        if (block.type === 'h') {
          return (
            <h2 key={i} className="mt-10 text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
              {block.text}
            </h2>
          )
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="mt-4 space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[17px] leading-8 text-body">
                  <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-strong" />
                  <span>{renderText(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="mt-5 text-[17px] leading-8 text-body">
            {renderText(block.text)}
          </p>
        )
      })}
    </div>
  )
}

function ArticleReader({ post, posts, onBack, onOpen }) {
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

  const BackButton = (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand-ink"
    >
      <FiArrowLeft /> Back to Blogs
    </button>
  )

  return (
    <Container className="py-10 lg:py-16">
      {BackButton}

      <Reveal from="up" className="mx-auto mt-8 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">
          {post.category}
        </span>
        <h1 className="mt-5 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.2rem]">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted">
          <span>{post.date}</span>
          <span className="h-1 w-1 rounded-full bg-muted/50" />
          <span className="inline-flex items-center gap-1.5">
            <FiClock /> {post.readMins} min read
          </span>
        </div>
      </Reveal>

      {hasLead ? (
        <Reveal from="up" delay={0.04} className="mx-auto mt-6 max-w-3xl">
          <p className="text-lg font-medium leading-8 text-ink sm:text-xl sm:leading-9">
            {renderText(post.blocks[0].text)}
          </p>
        </Reveal>
      ) : null}

      <Reveal from="up" delay={0.08} className="mx-auto mt-8 max-w-4xl">
        <div className="overflow-hidden rounded-block border border-line shadow-card">
          <img src={imageFor(post)} alt={post.title} className="h-60 w-full object-cover sm:h-80 lg:h-[420px]" />
        </div>
      </Reveal>

      <Reveal from="up" delay={0.1} className="mx-auto mt-10 max-w-3xl">
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
          <h3 className="text-xl font-bold text-ink sm:text-2xl">Related articles</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((rel) => (
              <button
                key={rel.slug}
                type="button"
                onClick={() => onOpen(rel.slug)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cream-2 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={imageFor(rel)}
                    alt={rel.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

      <div className="mx-auto mt-12 max-w-4xl">{BackButton}</div>
    </Container>
  )
}

export function BlogPage() {
  // Start with the bundled posts already on screen so the blog renders instantly
  // — no loading spinner while the network responds.
  const [posts, setPosts] = useState(FALLBACK_POSTS)
  const [loading] = useState(false)
  const [activeSlug, setActiveSlug] = useState(null)
  const [activePost, setActivePost] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [category, setCategory] = useState('All')

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

  const openArticle = async (slug) => {
    setActiveSlug(slug)
    const card = posts.find((p) => p.slug === slug)
    const bundled = FALLBACK_BY_SLUG.get(slug)
    // Content we can render with no network: the card's own body (bundled list)
    // or the bundled copy of this slug. Bundled articles therefore open
    // instantly and stay fully readable even when the API is down on deploy.
    const instant = card?.blocks?.length ? card : bundled?.blocks?.length ? bundled : null
    if (instant) {
      setActivePost(instant)
      return
    }
    // A DB-only article with no bundled copy — fetch it, but with a timeout so a
    // slow API shows a brief spinner instead of hanging forever.
    setActivePost(null)
    setArticleLoading(true)
    try {
      const full = await withTimeout(api.getBlog(slug))
      setActivePost(normalizeDetail(full))
    } catch {
      setActivePost(
        card
          ? { ...card, blocks: card.blocks?.length ? card.blocks : [{ type: 'p', text: card.description || '' }] }
          : bundled || null,
      )
    } finally {
      setArticleLoading(false)
    }
  }

  const closeArticle = () => {
    setActiveSlug(null)
    setActivePost(null)
  }

  if (activeSlug) {
    return (
      <MainLayout>
        {activePost ? (
          <ArticleReader post={activePost} posts={posts} onBack={closeArticle} onOpen={openArticle} />
        ) : (
          <Container className="py-24">
            <div className="flex flex-col items-center justify-center gap-3 text-muted">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-strong" />
              <p className="text-sm font-medium">{articleLoading ? 'Loading article…' : 'Article not found.'}</p>
              {!articleLoading ? (
                <button
                  type="button"
                  onClick={closeArticle}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand-ink"
                >
                  <FiArrowLeft /> Back to Blogs
                </button>
              ) : null}
            </div>
          </Container>
        )}
      </MainLayout>
    )
  }

  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const rest = posts.filter((p) => p !== featuredPost)
  const visible = category === 'All' ? rest : posts.filter((p) => p.category === category)

  return (
    <MainLayout>
      <Container className="py-14 lg:py-20">
        {/* search */}
        <div className="mb-10 flex justify-end lg:mb-14">
          <label className="flex items-center gap-3 border-b-2 border-line pb-2 text-muted transition-colors focus-within:border-brand">
            <span className="text-sm font-medium">Search blog:</span>
            <input
              type="text"
              className="w-32 bg-transparent text-sm text-ink outline-none placeholder:text-muted sm:w-44"
              aria-label="Search blog"
            />
            <FiSearch />
          </label>
        </div>

        {/* title */}
        <Reveal from="up">
          <h1 className="text-center text-[2.6rem] font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            KT Messenger Blog
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-8 text-body">
            Everything KT can do, explained simply — from messaging and calls to AI, payments, communities and business.
          </p>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-strong" />
            <p className="text-sm font-medium">Loading articles…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-lg font-bold text-ink">No articles published yet</p>
            <p className="max-w-md text-sm leading-6 text-body">
              New stories from the KT Messenger team will appear here as soon as they go live.
            </p>
          </div>
        ) : (
          <>
            {/* featured (only on the unfiltered view) */}
            {category === 'All' && featuredPost ? (
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
                      className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                    <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-brand-strong px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-brand">
                      Featured
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">
                      <span>{featuredPost.category}</span>
                      <span className="h-1 w-1 rounded-full bg-muted/50" />
                      <span className="inline-flex items-center gap-1 text-muted">
                        <FiClock /> {featuredPost.readMins} min read
                      </span>
                    </div>
                    <h2 className="mt-3.5 text-[1.7rem] font-bold leading-[1.15] text-ink lg:text-[2.1rem]">{featuredPost.title}</h2>
                    <p className="mt-4 text-[15px] leading-7 text-body">{featuredPost.description}</p>
                    <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-strong px-5 py-2.5 text-sm font-bold text-white shadow-brand transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-strong-hover">
                      Read More <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
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
                        className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full border border-line bg-surface/90 px-3 py-1 text-[11px] font-bold text-brand-ink shadow-sm backdrop-blur">
                        {post.category}
                      </span>
                      <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-slate-950/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        <FiClock className="text-[11px]" /> {post.readMins} min
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-[11px] font-semibold text-muted">{post.date}</span>
                      <h3 className="mt-2 text-lg font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand-ink">
                        {post.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-body line-clamp-3">{post.description}</p>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink">
                        Read More <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
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

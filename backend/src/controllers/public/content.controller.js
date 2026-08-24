import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, ApiError } from '../../utils/apiResponse.js'
import { parsePagination, pageMeta } from '../../utils/pagination.js'

// Content is publicly visible when PUBLISHED, or SCHEDULED with a past date.
function publishedWhere(extra = {}) {
  return {
    OR: [
      { status: 'PUBLISHED' },
      { status: 'SCHEDULED', scheduledAt: { lte: new Date() } },
    ],
    ...extra,
  }
}

const blogCard = (p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  coverUrl: p.coverUrl,
  author: p.authorName,
  featured: p.featured,
  publishedAt: p.publishedAt || p.createdAt,
  category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
  tags: (p.tags || []).map((t) => ({ name: t.name, slug: t.slug })),
})

/* ── Blog ───────────────────────────────────────────────── */
export const listBlog = asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = parsePagination(req.query, { defaultSize: 6 })
  const where = publishedWhere({ locale: req.query.locale || undefined })
  if (req.query.category) where.category = { slug: String(req.query.category) }
  if (req.query.tag) where.tags = { some: { slug: String(req.query.tag) } }
  if (req.query.search) {
    where.AND = [{ OR: [{ title: { contains: String(req.query.search), mode: 'insensitive' } }, { excerpt: { contains: String(req.query.search), mode: 'insensitive' } }] }]
  }

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({ where, include: { category: true, tags: true }, orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }], skip, take }),
    prisma.blogPost.count({ where }),
  ])
  return ok(res, items.map(blogCard), pageMeta({ page, pageSize, total }))
})

export const getFeaturedBlog = asyncHandler(async (_req, res) => {
  const post = await prisma.blogPost.findFirst({
    where: publishedWhere({ featured: true }),
    include: { category: true, tags: true },
    orderBy: [{ publishedAt: 'desc' }],
  })
  return ok(res, post ? blogCard(post) : null)
})

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findFirst({
    where: publishedWhere({ slug: req.params.slug }),
    include: { category: true, tags: true },
  })
  if (!post) throw ApiError.notFound('Article not found')
  return ok(res, { ...blogCard(post), body: post.body, seoTitle: post.seoTitle, seoDescription: post.seoDescription, ogImage: post.ogImage })
})

/* ── Help Center ────────────────────────────────────────── */
export const getHelpTree = asyncHandler(async (req, res) => {
  const cats = await prisma.helpCategory.findMany({
    where: { locale: req.query.locale || undefined },
    orderBy: { order: 'asc' },
    include: {
      subcategories: {
        orderBy: { order: 'asc' },
        include: {
          articles: {
            where: publishedWhere(),
            orderBy: { order: 'asc' },
            select: { title: true, slug: true, popular: true },
          },
        },
      },
    },
  })
  const tree = cats.map((c) => ({
    label: c.title,
    slug: c.slug,
    icon: c.icon,
    subs: c.subcategories.map((s) => ({
      label: s.title,
      slug: s.slug,
      icon: s.icon,
      articles: s.articles.map((a) => ({ title: a.title, slug: a.slug })),
    })),
  }))
  return ok(res, tree)
})

export const getHelpArticle = asyncHandler(async (req, res) => {
  const article = await prisma.helpArticle.findFirst({
    where: publishedWhere({ slug: req.params.slug }),
    include: { subcategory: { include: { category: true } } },
  })
  if (!article) throw ApiError.notFound('Help article not found')
  return ok(res, {
    id: article.id,
    slug: article.slug,
    title: article.title,
    body: article.body,
    platforms: article.platforms,
    category: article.subcategory?.category?.title,
    subcategory: article.subcategory?.title,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
  })
})

export const getPopularArticles = asyncHandler(async (_req, res) => {
  const articles = await prisma.helpArticle.findMany({
    where: publishedWhere({ popular: true }),
    orderBy: { order: 'asc' },
    take: 10,
    select: { title: true, slug: true },
  })
  return ok(res, articles)
})

/* ── FAQs ───────────────────────────────────────────────── */
export const listFaqs = asyncHandler(async (req, res) => {
  const where = publishedWhere({ locale: req.query.locale || undefined })
  if (req.query.page) where.page = String(req.query.page)
  const faqs = await prisma.faq.findMany({ where, orderBy: { order: 'asc' }, select: { id: true, question: true, answer: true, page: true } })
  return ok(res, faqs)
})

/* ── Success stories ────────────────────────────────────── */
export const listSuccessStories = asyncHandler(async (req, res) => {
  const stories = await prisma.successStory.findMany({
    where: publishedWhere({ locale: req.query.locale || undefined }),
    orderBy: { order: 'asc' },
  })
  return ok(res, stories.map((s) => ({ id: s.id, slug: s.slug, company: s.company, logoUrl: s.logoUrl, imageUrl: s.imageUrl, summary: s.summary, metrics: s.metrics })))
})

export const getSuccessStory = asyncHandler(async (req, res) => {
  const story = await prisma.successStory.findFirst({ where: publishedWhere({ slug: req.params.slug }) })
  if (!story) throw ApiError.notFound('Story not found')
  return ok(res, story)
})

/* ── Downloads / app releases ───────────────────────────── */
export const getDownloads = asyncHandler(async (_req, res) => {
  const releases = await prisma.appRelease.findMany({ where: { isCurrent: true }, orderBy: { platform: 'asc' } })
  return ok(res, releases.map((r) => ({ platform: r.platform, version: r.version, minOs: r.minOs, downloadUrl: r.downloadUrl, storeUrl: r.storeUrl, notes: r.notes, releaseDate: r.releaseDate })))
})

/* ── Locales ────────────────────────────────────────────── */
export const listLocales = asyncHandler(async (_req, res) => {
  const locales = await prisma.locale.findMany({ where: { enabled: true }, orderBy: { code: 'asc' } })
  return ok(res, locales.map((l) => ({ code: l.code, label: l.label, isDefault: l.isDefault })))
})

/* ── Navigation & footer ────────────────────────────────── */
export const getNavigation = asyncHandler(async (req, res) => {
  const items = await prisma.navigationItem.findMany({
    where: { visible: true, location: req.query.location || undefined, parentId: null },
    orderBy: { order: 'asc' },
    include: { children: { where: { visible: true }, orderBy: { order: 'asc' } } },
  })
  return ok(res, items)
})

export const getFooter = asyncHandler(async (req, res) => {
  const sections = await prisma.footerSection.findMany({
    where: { locale: req.query.locale || undefined },
    orderBy: { order: 'asc' },
    include: { links: { orderBy: { order: 'asc' } } },
  })
  return ok(res, sections.map((s) => ({ title: s.title, links: s.links.map((l) => ({ label: l.label, href: l.href })) })))
})

/* ── Website content blocks ─────────────────────────────── */
export const getContentBlock = asyncHandler(async (req, res) => {
  const block = await prisma.websiteContent.findFirst({ where: { key: req.params.key, locale: req.query.locale || 'en-US' } })
  if (!block) throw ApiError.notFound('Content block not found')
  return ok(res, block.data)
})

export const getPageContent = asyncHandler(async (req, res) => {
  const blocks = await prisma.websiteContent.findMany({ where: { page: req.params.page, locale: req.query.locale || 'en-US' } })
  const map = {}
  for (const b of blocks) map[b.key] = b.data
  return ok(res, map)
})

import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok } from '../../utils/apiResponse.js'
import { parsePagination, pageMeta } from '../../utils/pagination.js'

const published = { OR: [{ status: 'PUBLISHED' }, { status: 'SCHEDULED', scheduledAt: { lte: new Date() } }] }
const ci = (q) => ({ contains: q, mode: 'insensitive' })

// GET /api/search?q=&type=blog|help|business|all&page=&pageSize=
export const search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim()
  const type = String(req.query.type || 'all')
  const { page, pageSize, skip, take } = parsePagination(req.query, { defaultSize: 10 })

  if (q.length < 2) return ok(res, [], pageMeta({ page, pageSize, total: 0 }))

  const results = []

  if (type === 'blog' || type === 'all') {
    const posts = await prisma.blogPost.findMany({
      where: { AND: [published, { OR: [{ title: ci(q) }, { excerpt: ci(q) }, { body: ci(q) }] }] },
      select: { title: true, slug: true, excerpt: true },
      take: 25,
    })
    results.push(...posts.map((p) => ({ type: 'blog', title: p.title, slug: p.slug, excerpt: p.excerpt, url: `/blog/${p.slug}` })))
  }

  if (type === 'help' || type === 'all') {
    const arts = await prisma.helpArticle.findMany({
      where: { AND: [published, { OR: [{ title: ci(q) }, { body: ci(q) }] }] },
      select: { title: true, slug: true, body: true },
      take: 25,
    })
    results.push(...arts.map((a) => ({ type: 'help', title: a.title, slug: a.slug, excerpt: a.body.slice(0, 160), url: `/help?article=${a.slug}` })))
  }

  if (type === 'business' || type === 'all') {
    const stories = await prisma.successStory.findMany({
      where: { AND: [published, { OR: [{ company: ci(q) }, { summary: ci(q) }, { body: ci(q) }] }] },
      select: { company: true, slug: true, summary: true },
      take: 25,
    })
    results.push(...stories.map((s) => ({ type: 'business', title: s.company, slug: s.slug, excerpt: s.summary, url: `/business` })))
  }

  const total = results.length
  const items = results.slice(skip, skip + take)

  // fire-and-forget analytics
  prisma.analyticsEvent.create({ data: { type: 'search_performed', meta: { q, type, total } } }).catch(() => {})

  return ok(res, items, pageMeta({ page, pageSize, total }))
})

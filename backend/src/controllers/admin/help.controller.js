import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok } from '../../utils/apiResponse.js'
import { writeAudit } from '../../utils/audit.js'

// GET /api/admin/help/tree  — full tree incl. drafts, for the management UI
export const adminTree = asyncHandler(async (_req, res) => {
  const cats = await prisma.helpCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      subcategories: {
        orderBy: { order: 'asc' },
        include: {
          articles: { orderBy: { order: 'asc' }, select: { id: true, title: true, slug: true, status: true, popular: true, order: true } },
        },
      },
    },
  })
  return ok(res, cats)
})

// GET /api/admin/help/subcategories?categoryId=
export const listSubcategories = asyncHandler(async (req, res) => {
  const where = req.query.categoryId ? { categoryId: String(req.query.categoryId) } : {}
  const subs = await prisma.helpSubcategory.findMany({ where, orderBy: { order: 'asc' }, include: { category: { select: { title: true } } } })
  return ok(res, subs)
})

// GET /api/admin/help/articles?subcategoryId=&search=&status=
export const listArticles = asyncHandler(async (req, res) => {
  const where = {}
  if (req.query.subcategoryId) where.subcategoryId = String(req.query.subcategoryId)
  if (req.query.status) where.status = req.query.status
  if (req.query.search) where.title = { contains: String(req.query.search), mode: 'insensitive' }
  const articles = await prisma.helpArticle.findMany({
    where,
    orderBy: { order: 'asc' },
    include: { subcategory: { select: { title: true, category: { select: { title: true } } } } },
  })
  return ok(res, articles)
})

// PATCH /api/admin/help/reorder  { type: 'category'|'subcategory'|'article', items:[{id, order}] }
export const reorder = asyncHandler(async (req, res) => {
  const { type, items } = req.body
  const model = { category: 'helpCategory', subcategory: 'helpSubcategory', article: 'helpArticle' }[type]
  if (!model || !Array.isArray(items)) return ok(res, { updated: 0 })
  await prisma.$transaction(items.map((it) => prisma[model].update({ where: { id: it.id }, data: { order: Number(it.order) || 0 } })))
  await writeAudit({ req, action: `help.reorder.${type}`, entity: model })
  return ok(res, { updated: items.length })
})

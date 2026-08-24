import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, created, ApiError } from '../../utils/apiResponse.js'
import { parsePagination, pageMeta } from '../../utils/pagination.js'
import { uniqueSlug } from '../../utils/slug.js'
import { writeAudit } from '../../utils/audit.js'

const include = { category: true, tags: true, createdBy: { select: { name: true } } }

// GET /api/admin/blogs
export const list = asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = parsePagination(req.query)
  const where = {}
  if (req.query.search) where.OR = [{ title: { contains: String(req.query.search), mode: 'insensitive' } }, { excerpt: { contains: String(req.query.search), mode: 'insensitive' } }]
  if (req.query.status) where.status = req.query.status
  if (req.query.categoryId) where.categoryId = String(req.query.categoryId)
  if (req.query.featured === 'true') where.featured = true

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({ where, include, orderBy: { updatedAt: 'desc' }, skip, take }),
    prisma.blogPost.count({ where }),
  ])
  return ok(res, items, pageMeta({ page, pageSize, total }))
})

// GET /api/admin/blogs/:id
export const getOne = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id }, include })
  if (!post) throw ApiError.notFound('Blog post not found')
  return ok(res, post)
})

function derivePublishedAt(status, publishedAt) {
  if (status === 'PUBLISHED') return publishedAt || new Date()
  return publishedAt || null
}

// POST /api/admin/blogs
export const create = asyncHandler(async (req, res) => {
  const { tagIds = [], slug, title, status, publishedAt, ...rest } = req.body
  const post = await prisma.blogPost.create({
    data: {
      ...rest,
      title,
      status: status || 'DRAFT',
      slug: await uniqueSlug('blogPost', slug || title),
      publishedAt: derivePublishedAt(status || 'DRAFT', publishedAt),
      createdById: req.admin?.id || null,
      tags: tagIds.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
    },
    include,
  })
  await writeAudit({ req, action: 'blog.create', entity: 'BlogPost', entityId: post.id, meta: { title: post.title } })
  return created(res, post)
})

// PUT /api/admin/blogs/:id
export const update = asyncHandler(async (req, res) => {
  const { tagIds, slug, status, publishedAt, ...rest } = req.body
  const data = { ...rest }
  if (slug) data.slug = await uniqueSlug('blogPost', slug, { ignoreId: req.params.id })
  if (status) {
    data.status = status
    data.publishedAt = derivePublishedAt(status, publishedAt)
  } else if (publishedAt !== undefined) {
    data.publishedAt = publishedAt
  }
  if (tagIds) data.tags = { set: tagIds.map((id) => ({ id })) }

  const post = await prisma.blogPost.update({ where: { id: req.params.id }, data, include })
  await writeAudit({ req, action: 'blog.update', entity: 'BlogPost', entityId: post.id })
  return ok(res, post)
})

// PATCH /api/admin/blogs/:id/status  { status }
export const setStatus = asyncHandler(async (req, res) => {
  const status = req.body.status
  if (!['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'].includes(status)) throw ApiError.badRequest('Invalid status')
  const post = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: { status, publishedAt: derivePublishedAt(status, undefined) },
    include,
  })
  await writeAudit({ req, action: `blog.${status.toLowerCase()}`, entity: 'BlogPost', entityId: post.id })
  return ok(res, post)
})

// DELETE /api/admin/blogs/:id
export const remove = asyncHandler(async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } })
  await writeAudit({ req, action: 'blog.delete', entity: 'BlogPost', entityId: req.params.id })
  return ok(res, { id: req.params.id, deleted: true })
})

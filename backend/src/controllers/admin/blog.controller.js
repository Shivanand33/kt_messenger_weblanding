import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, created, ApiError } from '../../utils/apiResponse.js'
import { parsePagination, pageMeta } from '../../utils/pagination.js'
import { uniqueSlug, resolveAdminSlug, slugify, isSlugAvailable } from '../../utils/slug.js'
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
      // An admin-supplied slug is honoured exactly, or rejected as a duplicate.
      // Only a blank slug falls back to auto-generating from the title, and
      // that happens once, at creation.
      slug: slug && slug.trim()
        ? await resolveAdminSlug('blogPost', slug)
        : await uniqueSlug('blogPost', title),
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
  // Only touch the slug when one was actually supplied. A blank/omitted slug
  // leaves the saved slug alone — renaming the title must never silently
  // change a URL that is already published and shared.
  if (slug && slug.trim()) {
    data.slug = await resolveAdminSlug('blogPost', slug, { ignoreId: req.params.id })
  }
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

/**
 * GET /api/admin/blogs/slug-check?slug=calling&id=<postId>
 *
 * Lets the editor tell an admin a slug is taken while they are still typing,
 * instead of failing the save. `id` is the post being edited, so its own slug
 * does not read as a conflict. Advisory only — create/update re-check on write.
 */
export const slugCheck = asyncHandler(async (req, res) => {
  const requested = String(req.query.slug || '')
  const normalized = slugify(requested)
  if (!normalized) {
    return ok(res, {
      requested,
      normalized: '',
      available: false,
      reason: 'Slug must contain at least one letter or number',
    })
  }
  const available = await isSlugAvailable('blogPost', normalized, { ignoreId: req.query.id || undefined })
  return ok(res, {
    requested,
    normalized,
    available,
    reason: available ? null : 'That slug is already in use',
  })
})

// DELETE /api/admin/blogs/:id
export const remove = asyncHandler(async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } })
  await writeAudit({ req, action: 'blog.delete', entity: 'BlogPost', entityId: req.params.id })
  return ok(res, { id: req.params.id, deleted: true })
})

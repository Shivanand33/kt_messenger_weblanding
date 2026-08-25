import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, created, ApiError } from '../../utils/apiResponse.js'
import { parsePagination, pageMeta } from '../../utils/pagination.js'
import { storage, safeFilename } from '../../services/storage.service.js'
import { writeAudit } from '../../utils/audit.js'

// GET /api/admin/media
export const list = asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = parsePagination(req.query, { defaultSize: 24 })
  const where = {}
  if (req.query.folder) where.folder = String(req.query.folder)
  if (req.query.search) where.originalName = { contains: String(req.query.search), mode: 'insensitive' }
  const [items, total] = await Promise.all([
    prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.media.count({ where }),
  ])
  return ok(res, items, pageMeta({ page, pageSize, total }))
})

// POST /api/admin/media  (multipart: file, folder?, alt?)
export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded (field name must be "file")')
  const folder = (req.body.folder || 'general').replace(/[^a-z0-9-_]/gi, '').toLowerCase() || 'general'
  const filename = safeFilename(req.file.originalname)
  const { url } = await storage.save({
    buffer: req.file.buffer,
    filename,
    folder,
    contentType: req.file.mimetype,
  })

  const media = await prisma.media.create({
    data: {
      filename,
      originalName: req.file.originalname,
      url,
      mimeType: req.file.mimetype,
      size: req.file.size,
      alt: req.body.alt || null,
      folder,
      uploadedById: req.admin?.id || null,
    },
  })
  await writeAudit({ req, action: 'media.upload', entity: 'Media', entityId: media.id })
  return created(res, media)
})

// PATCH /api/admin/media/:id  { alt }
export const update = asyncHandler(async (req, res) => {
  const media = await prisma.media.update({ where: { id: req.params.id }, data: { alt: req.body.alt ?? null } })
  return ok(res, media)
})

// DELETE /api/admin/media/:id
export const remove = asyncHandler(async (req, res) => {
  const media = await prisma.media.findUnique({ where: { id: req.params.id } })
  if (!media) throw ApiError.notFound('Media not found')
  // best-effort file removal
  try {
    const key = `${media.folder}/${media.filename}`
    await storage.remove(key)
  } catch {
    /* ignore */
  }
  await prisma.media.delete({ where: { id: req.params.id } })
  await writeAudit({ req, action: 'media.delete', entity: 'Media', entityId: req.params.id })
  return ok(res, { id: req.params.id, deleted: true })
})

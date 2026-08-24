import { prisma } from '../config/db.js'
import { asyncHandler } from './asyncHandler.js'
import { ok, created, ApiError } from './apiResponse.js'
import { parsePagination, pageMeta } from './pagination.js'
import { writeAudit } from './audit.js'
import { uniqueSlug } from './slug.js'

// Generates list/getOne/create/update/remove handlers for a Prisma model.
// Used for the many "simple scalar" resources so they behave identically
// (pagination, search, filtering, sorting, audit, slug uniqueness).
export function crudFactory({
  model,
  entityName,
  searchable = [],
  defaultOrderBy = { createdAt: 'desc' },
  include,
  slugFrom,
  stampCreatedBy = false,
  transform,
  parseFilters,
}) {
  const shape = (r) => (transform ? transform(r) : r)

  const list = asyncHandler(async (req, res) => {
    const { page, pageSize, skip, take } = parsePagination(req.query)
    const where = {}
    if (req.query.search && searchable.length) {
      where.OR = searchable.map((f) => ({ [f]: { contains: String(req.query.search), mode: 'insensitive' } }))
    }
    if (req.query.status) where.status = req.query.status
    if (req.query.locale) where.locale = req.query.locale
    if (parseFilters) Object.assign(where, parseFilters(req.query))

    let orderBy = defaultOrderBy
    if (req.query.sort) {
      const [field, dir] = String(req.query.sort).split(':')
      if (field) orderBy = { [field]: dir === 'asc' ? 'asc' : 'desc' }
    }

    const [items, total] = await Promise.all([
      prisma[model].findMany({ where, include, orderBy, skip, take }),
      prisma[model].count({ where }),
    ])
    return ok(res, items.map(shape), pageMeta({ page, pageSize, total }))
  })

  const getOne = asyncHandler(async (req, res) => {
    const record = await prisma[model].findUnique({ where: { id: req.params.id }, include })
    if (!record) throw ApiError.notFound(`${entityName} not found`)
    return ok(res, shape(record))
  })

  const create = asyncHandler(async (req, res) => {
    const data = { ...req.body }
    if (slugFrom) data.slug = await uniqueSlug(model, data.slug || data[slugFrom])
    if (stampCreatedBy && req.admin?.id) data.createdById = req.admin.id
    const record = await prisma[model].create({ data, include })
    await writeAudit({ req, action: `${entityName}.create`, entity: entityName, entityId: record.id })
    return created(res, shape(record))
  })

  const update = asyncHandler(async (req, res) => {
    const data = { ...req.body }
    if (slugFrom && data.slug) data.slug = await uniqueSlug(model, data.slug, { ignoreId: req.params.id })
    const record = await prisma[model].update({ where: { id: req.params.id }, data, include })
    await writeAudit({ req, action: `${entityName}.update`, entity: entityName, entityId: record.id })
    return ok(res, shape(record))
  })

  const remove = asyncHandler(async (req, res) => {
    await prisma[model].delete({ where: { id: req.params.id } })
    await writeAudit({ req, action: `${entityName}.delete`, entity: entityName, entityId: req.params.id })
    return ok(res, { id: req.params.id, deleted: true })
  })

  return { list, getOne, create, update, remove }
}

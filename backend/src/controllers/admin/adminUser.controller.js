import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, created, ApiError } from '../../utils/apiResponse.js'
import { parsePagination, pageMeta } from '../../utils/pagination.js'
import { hashPassword } from '../../utils/password.js'
import { writeAudit } from '../../utils/audit.js'

// Never expose passwordHash.
const select = {
  id: true, name: true, email: true, status: true, lastLoginAt: true, createdAt: true,
  role: { select: { id: true, name: true } },
}

// GET /api/admin/admins
export const list = asyncHandler(async (req, res) => {
  const { page, pageSize, skip, take } = parsePagination(req.query)
  const where = {}
  if (req.query.search) where.OR = [{ name: { contains: String(req.query.search), mode: 'insensitive' } }, { email: { contains: String(req.query.search), mode: 'insensitive' } }]
  const [items, total] = await Promise.all([
    prisma.admin.findMany({ where, select, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.admin.count({ where }),
  ])
  return ok(res, items, pageMeta({ page, pageSize, total }))
})

// POST /api/admin/admins
export const create = asyncHandler(async (req, res) => {
  const { name, email, password, roleId, status } = req.body
  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) throw ApiError.badRequest('Invalid role')
  const admin = await prisma.admin.create({
    data: { name, email, roleId, status: status || 'ACTIVE', passwordHash: await hashPassword(password) },
    select,
  })
  await writeAudit({ req, action: 'admin_user.create', entity: 'Admin', entityId: admin.id, meta: { email } })
  return created(res, admin)
})

// PUT /api/admin/admins/:id
export const update = asyncHandler(async (req, res) => {
  const { password, ...rest } = req.body
  const data = { ...rest }
  if (password) data.passwordHash = await hashPassword(password)
  // Prevent an admin from disabling their own account and locking themselves out.
  if (req.params.id === req.admin.id && data.status === 'DISABLED') throw ApiError.badRequest('You cannot disable your own account')
  const admin = await prisma.admin.update({ where: { id: req.params.id }, data, select })
  await writeAudit({ req, action: 'admin_user.update', entity: 'Admin', entityId: admin.id })
  return ok(res, admin)
})

// DELETE /api/admin/admins/:id
export const remove = asyncHandler(async (req, res) => {
  if (req.params.id === req.admin.id) throw ApiError.badRequest('You cannot delete your own account')
  const target = await prisma.admin.findUnique({ where: { id: req.params.id }, include: { role: true } })
  if (!target) throw ApiError.notFound('Admin not found')
  if (target.role.name === 'super_admin') {
    const superAdmins = await prisma.admin.count({ where: { role: { name: 'super_admin' } } })
    if (superAdmins <= 1) throw ApiError.badRequest('Cannot delete the last super admin')
  }
  await prisma.admin.delete({ where: { id: req.params.id } })
  await writeAudit({ req, action: 'admin_user.delete', entity: 'Admin', entityId: req.params.id })
  return ok(res, { id: req.params.id, deleted: true })
})

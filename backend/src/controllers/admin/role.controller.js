import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, created, ApiError } from '../../utils/apiResponse.js'
import { writeAudit } from '../../utils/audit.js'

// GET /api/admin/roles
export const listRoles = asyncHandler(async (_req, res) => {
  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
    include: { permissions: { select: { key: true } }, _count: { select: { admins: true } } },
  })
  return ok(res, roles.map((r) => ({
    id: r.id, name: r.name, description: r.description, isSystem: r.isSystem,
    admins: r._count.admins, permissionKeys: r.permissions.map((p) => p.key),
  })))
})

// GET /api/admin/permissions
export const listPermissions = asyncHandler(async (_req, res) => {
  const perms = await prisma.permission.findMany({ orderBy: { key: 'asc' } })
  // Group by resource for a nicer admin UI (e.g. blog -> [read, write, ...])
  const grouped = {}
  for (const p of perms) {
    const [resource, action] = p.key.split(':')
    grouped[resource] = grouped[resource] || []
    grouped[resource].push({ key: p.key, action, description: p.description })
  }
  return ok(res, { permissions: perms.map((p) => p.key), grouped })
})

// POST /api/admin/roles
export const createRole = asyncHandler(async (req, res) => {
  const { name, description, permissionKeys = [] } = req.body
  const role = await prisma.role.create({
    data: { name, description, permissions: { connect: permissionKeys.map((key) => ({ key })) } },
    include: { permissions: { select: { key: true } } },
  })
  await writeAudit({ req, action: 'role.create', entity: 'Role', entityId: role.id, meta: { name } })
  return created(res, { ...role, permissionKeys: role.permissions.map((p) => p.key) })
})

// PUT /api/admin/roles/:id
export const updateRole = asyncHandler(async (req, res) => {
  const existing = await prisma.role.findUnique({ where: { id: req.params.id } })
  if (!existing) throw ApiError.notFound('Role not found')
  const { name, description, permissionKeys } = req.body
  const data = {}
  if (name && !existing.isSystem) data.name = name
  if (description !== undefined) data.description = description
  if (permissionKeys) data.permissions = { set: permissionKeys.map((key) => ({ key })) }
  const role = await prisma.role.update({ where: { id: req.params.id }, data, include: { permissions: { select: { key: true } } } })
  await writeAudit({ req, action: 'role.update', entity: 'Role', entityId: role.id })
  return ok(res, { ...role, permissionKeys: role.permissions.map((p) => p.key) })
})

// DELETE /api/admin/roles/:id
export const deleteRole = asyncHandler(async (req, res) => {
  const role = await prisma.role.findUnique({ where: { id: req.params.id }, include: { _count: { select: { admins: true } } } })
  if (!role) throw ApiError.notFound('Role not found')
  if (role.isSystem) throw ApiError.badRequest('System roles cannot be deleted')
  if (role._count.admins > 0) throw ApiError.badRequest('Reassign admins before deleting this role')
  await prisma.role.delete({ where: { id: req.params.id } })
  await writeAudit({ req, action: 'role.delete', entity: 'Role', entityId: req.params.id })
  return ok(res, { id: req.params.id, deleted: true })
})

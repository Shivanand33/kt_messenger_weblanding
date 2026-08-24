import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, ApiError } from '../../utils/apiResponse.js'
import { verifyPassword, hashPassword } from '../../utils/password.js'
import { signToken } from '../../utils/jwt.js'
import { writeAudit } from '../../utils/audit.js'
import { env } from '../../config/env.js'

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.isProd,
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
}

const publicAdmin = (a) => ({
  id: a.id,
  name: a.name,
  email: a.email,
  role: a.role?.name,
  permissions: a.role?.permissions?.map((p) => p.key) || [],
  status: a.status,
})

// POST /api/admin/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const admin = await prisma.admin.findUnique({ where: { email }, include: { role: { include: { permissions: true } } } })
  // Constant-ish response — never reveal which part failed.
  if (!admin || admin.status !== 'ACTIVE') throw ApiError.unauthorized('Invalid email or password')
  const good = await verifyPassword(password, admin.passwordHash)
  if (!good) throw ApiError.unauthorized('Invalid email or password')

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } })
  const token = signToken({ sub: admin.id })
  await writeAudit({ req, action: 'admin.login', entity: 'Admin', entityId: admin.id })

  res.cookie('kt_admin_token', token, cookieOpts)
  return ok(res, { token, admin: publicAdmin(admin) })
})

// POST /api/admin/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('kt_admin_token', { path: '/' })
  return ok(res, { loggedOut: true })
})

// GET /api/admin/auth/me
export const me = asyncHandler(async (req, res) => {
  const admin = await prisma.admin.findUnique({ where: { id: req.admin.id }, include: { role: { include: { permissions: true } } } })
  if (!admin) throw ApiError.unauthorized()
  return ok(res, publicAdmin(admin))
})

// PATCH /api/admin/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const admin = await prisma.admin.update({
    where: { id: req.admin.id },
    data: req.body,
    include: { role: { include: { permissions: true } } },
  })
  return ok(res, publicAdmin(admin))
})

// POST /api/admin/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } })
  const good = await verifyPassword(currentPassword, admin.passwordHash)
  if (!good) throw ApiError.badRequest('Current password is incorrect')
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(newPassword) } })
  await writeAudit({ req, action: 'admin.change_password', entity: 'Admin', entityId: admin.id })
  return ok(res, { updated: true })
})

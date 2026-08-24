import { prisma } from '../config/db.js'
import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Reads a Bearer token (or httpOnly cookie), loads the admin + role + permissions,
// and attaches a normalised `req.admin` for downstream RBAC checks.
export const requireAuth = asyncHandler(async (req, _res, next) => {
  let token = null
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) token = header.slice(7)
  if (!token && req.cookies?.kt_admin_token) token = req.cookies.kt_admin_token
  if (!token) throw ApiError.unauthorized()

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('Session expired or invalid token')
  }

  const admin = await prisma.admin.findUnique({
    where: { id: payload.sub },
    include: { role: { include: { permissions: true } } },
  })
  if (!admin || admin.status !== 'ACTIVE') throw ApiError.unauthorized('Account not found or disabled')

  req.admin = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role.name,
    isSuperAdmin: admin.role.name === 'super_admin',
    permissions: admin.role.permissions.map((p) => p.key),
  }
  next()
})

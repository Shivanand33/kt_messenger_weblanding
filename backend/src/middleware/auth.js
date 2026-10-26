import { prisma } from '../config/db.js'
import { verifyToken, TOKEN_PURPOSE } from '../utils/jwt.js'
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

  // Only a finished sign-in opens the admin API. The token handed out between
  // the password and the emailed code is signed by the same secret, so without
  // this line it would pass straight through here and 2FA would protect
  // nothing. Tokens issued before 2FA existed carry no purpose at all; they
  // are sessions, and treating them as such keeps everyone signed in across
  // the deploy that adds this.
  if (payload.purpose && payload.purpose !== TOKEN_PURPOSE.SESSION) {
    throw ApiError.unauthorized('Two-factor authentication is not complete')
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

/**
 * Guards the second step of a 2FA sign-in: the caller must present the
 * short-lived token issued once their password was accepted.
 *
 * It deliberately does not fill `req.admin` — nothing downstream should treat
 * a half-finished sign-in as a signed-in admin. The account is published as
 * `req.mfaAdmin`, and its id as `req.mfaAdminId` so the per-account rate
 * limiter (../middleware/rateLimit.js) can charge the right bucket.
 */
export const requireMfaChallenge = asyncHandler(async (req, _res, next) => {
  const token = typeof req.body?.challengeToken === 'string' ? req.body.challengeToken : null
  if (!token) throw ApiError.unauthorized('Sign in again to continue')

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('This sign-in attempt has expired. Please sign in again.')
  }
  if (payload.purpose !== TOKEN_PURPOSE.MFA) throw ApiError.unauthorized('Sign in again to continue')

  const admin = await prisma.admin.findUnique({
    where: { id: payload.sub },
    include: { role: { include: { permissions: true } } },
  })
  // Re-checked here, not just at the password step: an account can be
  // suspended in the minutes between the two.
  if (!admin || admin.status !== 'ACTIVE') throw ApiError.unauthorized('Account not found or disabled')

  req.mfaAdmin = admin
  req.mfaAdminId = admin.id
  next()
})

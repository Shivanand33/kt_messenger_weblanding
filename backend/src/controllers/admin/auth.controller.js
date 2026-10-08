import crypto from 'node:crypto'
import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, ApiError } from '../../utils/apiResponse.js'
import { verifyPassword, hashPassword } from '../../utils/password.js'
import { signToken } from '../../utils/jwt.js'
import { writeAudit } from '../../utils/audit.js'
import { sendMail } from '../../services/email.service.js'
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

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour
const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

// POST /api/admin/auth/forgot-password
// Always answers the same way whether or not the email exists, so the
// endpoint cannot be used to enumerate admin accounts.
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const admin = await prisma.admin.findUnique({ where: { email } })

  if (admin && admin.status === 'ACTIVE') {
    const token = crypto.randomBytes(32).toString('hex')
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetTokenHash: hashResetToken(token),
        resetTokenExp: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    })

    const resetUrl = `${env.adminUrl}/reset-password?token=${token}`
    try {
      await sendMail({
        to: admin.email,
        subject: 'Reset your KT Messenger Admin password',
        text: [
          `Hi ${admin.name},`,
          '',
          'We received a request to reset the password of your KT Messenger Admin account.',
          '',
          `Reset your password: ${resetUrl}`,
          '',
          'This link is valid for 1 hour and can be used only once.',
          'If you did not request this, you can ignore this email — your password will not change.',
        ].join('\n'),
      })
    } catch (err) {
      // A broken mailbox must not leak account existence or lock the admin
      // out silently — log it so ops can see the delivery failure.
      // eslint-disable-next-line no-console
      console.error(`[forgot-password] email to ${admin.email} failed:`, err.message)
    }
    await writeAudit({ req, action: 'admin.forgot_password', entity: 'Admin', entityId: admin.id })
  }

  return ok(res, { message: 'If an account with that email exists, a password reset link has been sent.' })
})

// POST /api/admin/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body
  const admin = await prisma.admin.findFirst({
    where: { resetTokenHash: hashResetToken(token), resetTokenExp: { gt: new Date() } },
  })
  if (!admin || admin.status !== 'ACTIVE') {
    throw ApiError.badRequest('This reset link is invalid or has expired. Please request a new one.')
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await hashPassword(newPassword), resetTokenHash: null, resetTokenExp: null },
  })
  await writeAudit({ req, action: 'admin.reset_password', entity: 'Admin', entityId: admin.id })
  return ok(res, { message: 'Password has been reset. You can now sign in with your new password.' })
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

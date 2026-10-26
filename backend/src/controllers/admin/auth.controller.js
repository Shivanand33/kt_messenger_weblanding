import crypto from 'node:crypto'
import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, ApiError } from '../../utils/apiResponse.js'
import { verifyPassword, hashPassword } from '../../utils/password.js'
import { signToken, TOKEN_PURPOSE } from '../../utils/jwt.js'
import { writeAudit } from '../../utils/audit.js'
import { sendMail } from '../../services/email.service.js'
import { env } from '../../config/env.js'
import * as twoFactor from '../../services/twofactor.service.js'

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
  twoFactorEnabled: twoFactor.isEnabled(a),
  twoFactorEmail: a.twoFactorEmail || null,
  recoveryCodesLeft: twoFactor.unusedRecoveryCount(a),
})

// Finishes a sign-in: session cookie, token, audit line.
async function grantSession(req, res, admin, { action = 'admin.login' } = {}) {
  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } })
  const token = signToken({ sub: admin.id })
  await writeAudit({ req, action, entity: 'Admin', entityId: admin.id })
  res.cookie('kt_admin_token', token, cookieOpts)
  return ok(res, { token, admin: publicAdmin(admin) })
}

// POST /api/admin/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const admin = await prisma.admin.findUnique({ where: { email }, include: { role: { include: { permissions: true } } } })
  // Constant-ish response — never reveal which part failed.
  if (!admin || admin.status !== 'ACTIVE') throw ApiError.unauthorized('Invalid email or password')
  const good = await verifyPassword(password, admin.passwordHash)
  if (!good) throw ApiError.unauthorized('Invalid email or password')

  if (twoFactor.isEnabled(admin)) return startTwoFactor(req, res, admin)

  return grantSession(req, res, admin)
})

/**
 * Second factor required: email a code and hand back a token that can do
 * nothing except finish this sign-in.
 *
 * No session is created here. The token carries purpose 'mfa', which
 * requireAuth rejects, so the admin API stays shut until the code is right.
 */
async function startTwoFactor(req, res, admin) {
  const code = await twoFactor.issueChallenge(admin.id)

  let masked
  try {
    ({ masked } = await twoFactor.sendCodeEmail({ admin, code, req }))
  } catch (err) {
    // The code is useless now — drop it rather than leave a live challenge
    // nobody can answer.
    await twoFactor.clearChallenge(admin.id)
    await writeAudit({ req, action: 'admin.2fa_send_failed', entity: 'Admin', entityId: admin.id })
    throw new ApiError(503, `Could not send your sign-in code. ${err.message}`, 'MFA_EMAIL_FAILED')
  }

  await writeAudit({ req, action: 'admin.2fa_sent', entity: 'Admin', entityId: admin.id })
  return ok(res, {
    mfaRequired: true,
    challengeToken: signToken({ sub: admin.id, purpose: TOKEN_PURPOSE.MFA }, { expiresIn: '10m' }),
    maskedEmail: masked,
    expiresInSeconds: Math.round(twoFactor.CODE_TTL_MS / 1000),
    recoveryCodesLeft: twoFactor.unusedRecoveryCount(admin),
  })
}

// POST /api/admin/auth/2fa/verify   (challenge token, not a session)
export const verifyTwoFactor = asyncHandler(async (req, res) => {
  const admin = req.mfaAdmin
  const result = await twoFactor.verifyChallenge(admin, req.body.code)

  if (!result.ok) {
    await writeAudit({
      req, action: 'admin.2fa_failed', entity: 'Admin', entityId: admin.id, meta: { reason: result.reason },
    })
    if (result.reason === 'expired') throw ApiError.badRequest('That code has expired. Please sign in again.')
    if (result.reason === 'locked') throw ApiError.badRequest('Too many wrong codes. Please sign in again.')
    if (result.reason === 'none') throw ApiError.badRequest('No code is waiting. Please sign in again.')
    throw ApiError.badRequest(
      result.attemptsLeft === 1
        ? 'That code is not right. One more try before you have to sign in again.'
        : `That code is not right. ${result.attemptsLeft} tries left.`,
    )
  }

  return grantSession(req, res, admin)
})

// POST /api/admin/auth/2fa/resend   (challenge token)
export const resendTwoFactor = asyncHandler(async (req, res) => {
  const admin = req.mfaAdmin
  if (!twoFactor.isEnabled(admin)) throw ApiError.badRequest('Two-factor authentication is not enabled')

  const wait = twoFactor.resendWaitMs(admin)
  if (wait > 0) {
    throw new ApiError(429, `Please wait ${Math.ceil(wait / 1000)} seconds before asking for another code.`, 'RATE_LIMITED')
  }

  const code = await twoFactor.issueChallenge(admin.id)
  let masked
  try {
    ({ masked } = await twoFactor.sendCodeEmail({ admin, code, req }))
  } catch (err) {
    await twoFactor.clearChallenge(admin.id)
    throw new ApiError(503, `Could not send your sign-in code. ${err.message}`, 'MFA_EMAIL_FAILED')
  }

  await writeAudit({ req, action: 'admin.2fa_resent', entity: 'Admin', entityId: admin.id })
  return ok(res, { sent: true, maskedEmail: masked, retryAfterSeconds: Math.round(twoFactor.RESEND_COOLDOWN_MS / 1000) })
})

// POST /api/admin/auth/2fa/recovery   (challenge token)
export const recoveryTwoFactor = asyncHandler(async (req, res) => {
  const admin = req.mfaAdmin
  if (!twoFactor.isEnabled(admin)) throw ApiError.badRequest('Two-factor authentication is not enabled')

  const { ok: used, codesLeft } = await twoFactor.consumeRecoveryCode(admin, req.body.recoveryCode)
  if (!used) {
    await writeAudit({ req, action: 'admin.2fa_recovery_failed', entity: 'Admin', entityId: admin.id })
    throw ApiError.badRequest('That recovery code is not valid, or it has already been used.')
  }

  await twoFactor.notify({
    admin,
    subject: 'A KT Messenger Admin recovery code was used',
    lines: [
      'One of your recovery codes was just used to sign in.',
      `${codesLeft} of your ${twoFactor.RECOVERY_CODE_COUNT} codes are left.`,
      '',
      "If this wasn't you, change your password immediately.",
    ],
  })
  return grantSession(req, res, admin, { action: 'admin.2fa_recovery_used' })
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
    data: {
      passwordHash: await hashPassword(newPassword),
      resetTokenHash: null,
      resetTokenExp: null,
      // As in changePassword: a sign-in halfway through under the old
      // password must not survive the password changing.
      mfaCodeHash: null,
      mfaCodeExp: null,
      mfaAttempts: 0,
      mfaSentAt: null,
    },
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
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      passwordHash: await hashPassword(newPassword),
      // Any sign-in half-finished under the old password dies with it.
      mfaCodeHash: null,
      mfaCodeExp: null,
      mfaAttempts: 0,
      mfaSentAt: null,
    },
  })
  await writeAudit({ req, action: 'admin.change_password', entity: 'Admin', entityId: admin.id })
  return ok(res, { updated: true })
})

/* ── Two-factor setup (signed in) ─────────────────────────────────────── */

const loadSelf = (id) =>
  prisma.admin.findUnique({ where: { id }, include: { role: { include: { permissions: true } } } })

/**
 * POST /api/admin/auth/2fa/send-test
 *
 * Emails a code to the address 2FA would use, before it is switched on. An
 * address that cannot receive mail must never become someone's second factor
 * — that is how an admin panel is lost for good.
 */
export const sendTwoFactorTest = asyncHandler(async (req, res) => {
  const admin = await loadSelf(req.admin.id)
  if (twoFactor.isEnabled(admin)) throw ApiError.badRequest('Two-factor authentication is already on')

  const { email } = req.body
  const target = { ...admin, twoFactorEmail: email || admin.twoFactorEmail }
  const code = await twoFactor.issueChallenge(admin.id)

  let masked
  try {
    ({ masked } = await twoFactor.sendCodeEmail({ admin: target, code, req, subjectPrefix: 'setup' }))
  } catch (err) {
    await twoFactor.clearChallenge(admin.id)
    throw new ApiError(503, `Could not send the test code. ${err.message}`, 'MFA_EMAIL_FAILED')
  }
  return ok(res, { sent: true, maskedEmail: masked, expiresInSeconds: Math.round(twoFactor.CODE_TTL_MS / 1000) })
})

/**
 * POST /api/admin/auth/2fa/enable
 *
 * Turns 2FA on once the test code comes back, and returns the ten recovery
 * codes. They are shown this once and stored only as hashes — nobody,
 * including this API, can print them again.
 */
export const enableTwoFactor = asyncHandler(async (req, res) => {
  const admin = await loadSelf(req.admin.id)
  if (twoFactor.isEnabled(admin)) throw ApiError.badRequest('Two-factor authentication is already on')

  const result = await twoFactor.verifyChallenge(admin, req.body.code)
  if (!result.ok) {
    if (result.reason === 'expired') throw ApiError.badRequest('That code has expired. Send a new one.')
    if (result.reason === 'locked') throw ApiError.badRequest('Too many wrong codes. Send a new one.')
    if (result.reason === 'none') throw ApiError.badRequest('Send yourself a test code first.')
    throw ApiError.badRequest('That code is not right.')
  }

  const plain = twoFactor.generateRecoveryCodes()
  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: {
      twoFactorEnabledAt: new Date(),
      twoFactorEmail: req.body.email || admin.twoFactorEmail || null,
      recoveryCodes: await twoFactor.hashRecoveryCodes(plain),
    },
    include: { role: { include: { permissions: true } } },
  })

  await writeAudit({ req, action: 'admin.2fa_enabled', entity: 'Admin', entityId: admin.id })
  await twoFactor.notify({
    admin: updated,
    subject: 'Two-factor authentication is on for your KT Messenger Admin account',
    lines: [
      'From now on, signing in also needs a code emailed to this address.',
      'Keep your recovery codes somewhere safe — they are the way back in if this mailbox is ever unreachable.',
    ],
  })
  return ok(res, { enabled: true, recoveryCodes: plain, admin: publicAdmin(updated) })
})

/**
 * POST /api/admin/auth/2fa/disable
 *
 * Password and a fresh emailed code, both. Whoever turns the second factor
 * off has to prove they still hold both factors.
 */
export const disableTwoFactor = asyncHandler(async (req, res) => {
  const admin = await loadSelf(req.admin.id)
  if (!twoFactor.isEnabled(admin)) throw ApiError.badRequest('Two-factor authentication is already off')

  if (!(await verifyPassword(req.body.password, admin.passwordHash))) {
    throw ApiError.badRequest('That password is not right')
  }
  const result = await twoFactor.verifyChallenge(admin, req.body.code)
  if (!result.ok) throw ApiError.badRequest('That code is not right, or it has expired.')

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: { twoFactorEnabledAt: null, twoFactorEmail: null, recoveryCodes: null },
    include: { role: { include: { permissions: true } } },
  })

  await writeAudit({ req, action: 'admin.2fa_disabled', entity: 'Admin', entityId: admin.id })
  await twoFactor.notify({
    admin,
    subject: 'Two-factor authentication is off for your KT Messenger Admin account',
    lines: ['Your account is now protected by its password alone.', "If this wasn't you, change your password immediately."],
  })
  return ok(res, { enabled: false, admin: publicAdmin(updated) })
})

/**
 * POST /api/admin/auth/2fa/send-code
 *
 * The code needed to disable 2FA — the signed-in counterpart of a login
 * challenge.
 */
export const sendTwoFactorCode = asyncHandler(async (req, res) => {
  const admin = await loadSelf(req.admin.id)
  if (!twoFactor.isEnabled(admin)) throw ApiError.badRequest('Two-factor authentication is off')

  const wait = twoFactor.resendWaitMs(admin)
  if (wait > 0) throw new ApiError(429, `Please wait ${Math.ceil(wait / 1000)} seconds.`, 'RATE_LIMITED')

  const code = await twoFactor.issueChallenge(admin.id)
  let masked
  try {
    ({ masked } = await twoFactor.sendCodeEmail({ admin, code, req }))
  } catch (err) {
    await twoFactor.clearChallenge(admin.id)
    throw new ApiError(503, `Could not send the code. ${err.message}`, 'MFA_EMAIL_FAILED')
  }
  return ok(res, { sent: true, maskedEmail: masked })
})

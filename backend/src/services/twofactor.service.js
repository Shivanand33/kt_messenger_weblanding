import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '../config/db.js'
import { env } from '../config/env.js'
import { sendMail } from './email.service.js'
import { clientIp } from '../utils/audit.js'

/**
 * Two-factor authentication for the admin panel, by emailed code.
 *
 * The second factor is a six-digit code sent to the admin's mailbox, so it
 * needs nothing installed and nothing configured beyond the email the site
 * already sends. What it defends against is a stolen or guessed password,
 * which is how admin panels are actually lost; it cannot help if the mailbox
 * itself is taken, and neither can the password reset that already goes
 * there.
 *
 * Everything here is optional per admin. An account that has never enabled it
 * signs in exactly as before.
 */

/** A code is alive for ten minutes — long enough for a slow inbox. */
export const CODE_TTL_MS = 10 * 60 * 1000

/**
 * Wrong guesses allowed against one code.
 *
 * Six digits is a million combinations: without a ceiling, a script walks
 * them. Five is enough for a person who mistypes and far too few for anyone
 * else.
 */
export const MAX_ATTEMPTS = 5

/** Stops the "resend" button being used to flood someone's inbox. */
export const RESEND_COOLDOWN_MS = 60 * 1000
export const MAX_SENDS_PER_CHALLENGE = 3

export const RECOVERY_CODE_COUNT = 10

/** On/off switch — the timestamp doubles as the flag. */
export const isEnabled = (admin) => Boolean(admin?.twoFactorEnabledAt)

/** Codes go to the separate address when one is set, otherwise the account's. */
export const targetEmail = (admin) => admin?.twoFactorEmail || admin?.email || ''

/**
 * "ad***@ktmessenger.com" — enough for the admin to know which inbox to open
 * without printing the address to anyone who reaches the login screen.
 */
export function maskEmail(email) {
  const [user, domain] = String(email || '').split('@')
  if (!user || !domain) return ''
  const head = user.slice(0, 2)
  return `${head}${'*'.repeat(Math.max(user.length - 2, 1))}@${domain}`
}

/**
 * The stored code is a hash, so a database dump cannot be signed in with.
 *
 * Salted with the admin id (two admins with the same code get different
 * hashes) and peppered with JWT_SECRET, which production already has — this
 * feature adds no new environment variable to get wrong at deploy time.
 *
 * sha256 rather than bcrypt on purpose: this runs on every sign-in, the input
 * is not a human-chosen secret, and it survives only ten minutes behind an
 * attempt limit. Recovery codes, which live for months, are bcrypt below.
 */
const hashCode = (code, adminId) =>
  crypto.createHash('sha256').update(`${adminId}:${code}:${env.jwtSecret}`).digest('hex')

/** Equal-length hex compared in constant time, so timing says nothing. */
function sameHash(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

/** crypto.randomInt, never Math.random — a predictable code is no factor. */
const newCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')

/**
 * Start (or restart) a challenge for this admin and return the plain code to
 * email. Only one challenge is alive at a time: signing in again replaces the
 * previous code rather than leaving two valid.
 */
export async function issueChallenge(adminId) {
  const code = newCode()
  await prisma.admin.update({
    where: { id: adminId },
    data: {
      mfaCodeHash: hashCode(code, adminId),
      mfaCodeExp: new Date(Date.now() + CODE_TTL_MS),
      mfaAttempts: 0,
      mfaSentAt: new Date(),
    },
  })
  return code
}

/** Forget the current code — after a win, a giveaway, or a disable. */
export async function clearChallenge(adminId) {
  await prisma.admin.update({
    where: { id: adminId },
    data: { mfaCodeHash: null, mfaCodeExp: null, mfaAttempts: 0, mfaSentAt: null },
  })
}

/**
 * Check a submitted code.
 *
 * Returns { ok } or { ok: false, reason }, where reason is one of
 * 'none' | 'expired' | 'locked' | 'wrong'. A wrong code spends an attempt and
 * the fifth one destroys the challenge, so a failed run always ends at the
 * password step rather than leaving a code to keep guessing at.
 */
export async function verifyChallenge(admin, code) {
  if (!admin.mfaCodeHash || !admin.mfaCodeExp) return { ok: false, reason: 'none' }
  if (admin.mfaCodeExp.getTime() < Date.now()) {
    await clearChallenge(admin.id)
    return { ok: false, reason: 'expired' }
  }
  if (admin.mfaAttempts >= MAX_ATTEMPTS) {
    await clearChallenge(admin.id)
    return { ok: false, reason: 'locked' }
  }

  if (!sameHash(admin.mfaCodeHash, hashCode(String(code), admin.id))) {
    const attempts = admin.mfaAttempts + 1
    if (attempts >= MAX_ATTEMPTS) {
      await clearChallenge(admin.id)
      return { ok: false, reason: 'locked' }
    }
    await prisma.admin.update({ where: { id: admin.id }, data: { mfaAttempts: attempts } })
    return { ok: false, reason: 'wrong', attemptsLeft: MAX_ATTEMPTS - attempts }
  }

  await clearChallenge(admin.id)
  return { ok: true }
}

/** How long until this admin may ask for another code. 0 when they may now. */
export function resendWaitMs(admin) {
  if (!admin.mfaSentAt) return 0
  const waited = Date.now() - admin.mfaSentAt.getTime()
  return waited >= RESEND_COOLDOWN_MS ? 0 : RESEND_COOLDOWN_MS - waited
}

/* ── Recovery codes ───────────────────────────────────────────────────── */

/**
 * Ten one-time codes, shown once and stored as bcrypt hashes.
 *
 * The way back in when the mailbox cannot be reached — a changed job, a
 * locked account, a mail provider having a bad day. Without these, 2FA on an
 * unreachable inbox locks the panel permanently.
 */
export function generateRecoveryCodes() {
  const plain = Array.from({ length: RECOVERY_CODE_COUNT }, () => {
    // 10 hex characters, printed as "a1b2c-3d4e5" so they can be read aloud
    // and typed without losing the place.
    const raw = crypto.randomBytes(5).toString('hex')
    return `${raw.slice(0, 5)}-${raw.slice(5)}`
  })
  return plain
}

export async function hashRecoveryCodes(plainCodes) {
  const hashes = await Promise.all(plainCodes.map((c) => bcrypt.hash(c, 12)))
  return hashes.map((hash) => ({ hash, usedAt: null }))
}

const normalizeRecovery = (code) => String(code || '').trim().toLowerCase().replace(/\s+/g, '')

/**
 * Spend a recovery code. Returns { ok, codesLeft }.
 *
 * A used code is kept with its `usedAt` rather than deleted, so the admin can
 * still see how many of the ten are gone.
 */
export async function consumeRecoveryCode(admin, code) {
  const entries = Array.isArray(admin.recoveryCodes) ? admin.recoveryCodes : []
  const candidate = normalizeRecovery(code)
  if (!candidate || !entries.length) return { ok: false, codesLeft: 0 }

  for (const entry of entries) {
    if (entry.usedAt) continue
    // eslint-disable-next-line no-await-in-loop -- one match ends the loop;
    // bcrypt is deliberately slow, so comparing in parallel would spend far
    // more CPU on a wrong guess than on a right one.
    if (await bcrypt.compare(candidate, entry.hash)) {
      entry.usedAt = new Date().toISOString()
      await prisma.admin.update({
        where: { id: admin.id },
        data: { recoveryCodes: entries, mfaCodeHash: null, mfaCodeExp: null, mfaAttempts: 0, mfaSentAt: null },
      })
      return { ok: true, codesLeft: entries.filter((e) => !e.usedAt).length }
    }
  }
  return { ok: false, codesLeft: entries.filter((e) => !e.usedAt).length }
}

export const unusedRecoveryCount = (admin) =>
  (Array.isArray(admin?.recoveryCodes) ? admin.recoveryCodes : []).filter((e) => !e.usedAt).length

/* ── Email ────────────────────────────────────────────────────────────── */

const when = () =>
  new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })

/**
 * Email one code.
 *
 * Throws when delivery fails, and the caller turns that into a visible error:
 * a sign-in that silently waits for a code no provider ever accepted is worse
 * than one that says so. (The password-reset endpoint swallows the same error
 * on purpose — there, speaking up would reveal which addresses have accounts.
 * Here the password has already been accepted, so there is nothing left to
 * give away.)
 */
export async function sendCodeEmail({ admin, code, req, subjectPrefix = 'sign-in' }) {
  const to = targetEmail(admin)
  const agent = req?.headers?.['user-agent'] || 'unknown device'
  const lines = [
    `Hi ${admin.name},`,
    '',
    `Your KT Messenger Admin ${subjectPrefix} code is:`,
    '',
    `    ${code}`,
    '',
    `It expires in ${Math.round(CODE_TTL_MS / 60000)} minutes and can be used once.`,
    '',
    'Attempt details:',
    `  Time:    ${when()} UTC`,
    `  IP:      ${req ? clientIp(req) || 'unknown' : 'unknown'}`,
    `  Browser: ${agent}`,
    '',
    "If this wasn't you, someone knows your password. Change it now:",
    `${env.adminUrl}/forgot-password`,
  ]

  const { delivered, provider } = await sendMail({
    to,
    subject: `Your KT Messenger Admin code: ${code}`,
    text: lines.join('\n'),
  })

  // The "log" provider prints the mail and reports success at the transport
  // level while delivering nothing. Treated as a failure here, because an
  // admin waiting for a code that only exists in a server log is locked out.
  if (!delivered) {
    throw new Error(
      `Email is not configured for delivery (provider: ${provider}), so the sign-in code could not be sent.`,
    )
  }
  return { to, masked: maskEmail(to) }
}

/**
 * Tell an admin that something changed about their own 2FA.
 *
 * Never throws: these are after-the-fact notices, and a mail outage must not
 * undo an action the admin already took.
 */
export async function notify({ admin, subject, lines }) {
  try {
    await sendMail({
      to: targetEmail(admin),
      subject,
      text: [`Hi ${admin.name},`, '', ...lines, '', `Time: ${when()} UTC`].join('\n'),
    })
  } catch {
    /* best effort */
  }
}

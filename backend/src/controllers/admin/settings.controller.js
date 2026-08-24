import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, ApiError } from '../../utils/apiResponse.js'
import { writeAudit } from '../../utils/audit.js'
import { sendMail } from '../../services/email.service.js'

const ENV_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env')

// Only these keys may be written from the admin UI.
const ALLOWED = ['EMAIL_PROVIDER', 'EMAIL_FROM', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS']

function writeEnv(updates) {
  let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : ''
  for (const [key, raw] of Object.entries(updates)) {
    if (!ALLOWED.includes(key)) continue
    const value = String(raw)
    const line = `${key}="${value.replace(/"/g, '')}"`
    const re = new RegExp(`^${key}=.*$`, 'm')
    env = re.test(env) ? env.replace(re, line) : `${env.trimEnd()}\n${line}\n`
    // Apply immediately so no restart is needed.
    process.env[key] = value
  }
  fs.writeFileSync(ENV_PATH, env)
}

// GET /api/admin/settings/email — password is never returned, only whether it is set.
export const getEmailSettings = asyncHandler(async (_req, res) => {
  const pass = process.env.SMTP_PASS || ''
  const isPlaceholder = /^replace_with_app_password$/i.test(pass)
  return ok(res, {
    provider: process.env.EMAIL_PROVIDER || 'log',
    from: process.env.EMAIL_FROM || '',
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || '587',
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    passwordSet: !!pass && !isPlaceholder,
    passwordLength: pass && !isPlaceholder ? pass.length : 0,
  })
})

// PUT /api/admin/settings/email
export const updateEmailSettings = asyncHandler(async (req, res) => {
  const { provider, from, host, port, secure, user, password } = req.body
  const updates = {}
  if (provider) updates.EMAIL_PROVIDER = provider
  if (from) updates.EMAIL_FROM = from
  if (host) updates.SMTP_HOST = host
  if (port) updates.SMTP_PORT = String(port)
  // TLS mode is decided by the port — 465 is implicit TLS, everything else is
  // STARTTLS. Deriving it removes a very easy way to break the connection.
  const effPort = Number(port || process.env.SMTP_PORT || 587)
  updates.SMTP_SECURE = effPort === 465 ? 'true' : 'false'
  void secure
  if (user) updates.SMTP_USER = user
  // Blank password = keep the existing one.
  if (password) {
    const clean = String(password).replace(/\s+/g, '')
    if (/^replace_with_app_password$/i.test(clean)) throw ApiError.badRequest('That is the placeholder, not a real password')
    const effHost = String(host || process.env.SMTP_HOST || '')
    if (/gmail|google/i.test(effHost) && /^SG./.test(clean)) {
      throw ApiError.badRequest('That is a SendGrid API key, but the host is Gmail. For Gmail use the 16-character App Password from myaccount.google.com/apppasswords.')
    }
    if (/sendgrid/i.test(effHost) && !/^SG./.test(clean)) {
      throw ApiError.badRequest('SendGrid keys start with "SG.". Paste the API key from sendgrid.com > Settings > API Keys.')
    }
    if (/gmail|google/i.test(effHost) && clean.length !== 16) {
      throw ApiError.badRequest(`A Gmail App Password is exactly 16 characters — you pasted ${clean.length}. Get it from myaccount.google.com/apppasswords.`)
    }
    updates.SMTP_PASS = clean
  }

  writeEnv(updates)
  await writeAudit({ req, action: 'settings.email.update', entity: 'Settings', entityId: 'email' })
  return ok(res, { saved: true, passwordSet: !!process.env.SMTP_PASS && !/^replace_with_app_password$/i.test(process.env.SMTP_PASS) })
})

// POST /api/admin/settings/email/test  { to }
export const testEmailSettings = asyncHandler(async (req, res) => {
  const fromAddr = (process.env.EMAIL_FROM || '').match(/<([^>]+)>/)?.[1] || process.env.EMAIL_FROM
  const to = req.body.to || (String(process.env.SMTP_USER || '').includes('@') ? process.env.SMTP_USER : fromAddr)
  if (!to) throw ApiError.badRequest('No recipient to test with')
  try {
    const result = await sendMail({
      to,
      subject: 'KT Messenger — test email',
      text: 'Your KT Messenger email settings work. Admin replies will now be delivered.',
      html: '<p>Your KT Messenger email settings work.</p><p>Admin replies will now be delivered.</p>',
    })
    return ok(res, { ...result, to })
  } catch (err) {
    throw ApiError.badRequest(err.message || 'Test email failed')
  }
})

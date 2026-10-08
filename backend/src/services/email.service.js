import fsSync from 'node:fs'
import pathMod from 'node:path'
import { fileURLToPath as toPath } from 'node:url'
import { env } from '../config/env.js'

// Re-read .env right before sending so edits take effect without a restart.
const ENV_FILE = pathMod.join(pathMod.dirname(toPath(import.meta.url)), '..', '..', '.env')
function reloadEnv() {
  try {
    const txt = fsSync.readFileSync(ENV_FILE, 'utf8')
    for (const rawLine of txt.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq < 1) continue
      const key = line.slice(0, eq).trim()
      if (!key.startsWith('SMTP_') && !key.startsWith('EMAIL_') && !key.startsWith('SENDGRID_')) continue
      let val = line.slice(eq + 1).trim()
      const q = val[0]
      if ((q === '"' || q === "'") && val[val.length - 1] === q) val = val.slice(1, -1)
      process.env[key] = val
    }
  } catch { /* file missing -> keep whatever is already loaded */ }
}

// Values people leave in .env before wiring up a real mailbox.
const PLACEHOLDERS = ['replace_with_app_password', 'replace_with_mailbox_password', 'changeme', 'dummy', 'test', 'xxxxxxxxxxxxxxxx', 'your-app-password', 'app-password']
const isPlaceholder = (v) => !!v && PLACEHOLDERS.includes(String(v).trim().toLowerCase())

// What kind of secret this host expects — keeps error messages accurate.
function credName(host = '') {
  if (/gmail|google/i.test(host)) return '16-character App Password'
  if (/sendgrid/i.test(host)) return 'SendGrid API key'
  return 'mailbox password'
}

/**
 * Send an email using the configured provider.
 *
 * - "log" (default): prints the email to the server console. Nothing is actually
 *   delivered — used in development / when no provider is configured.
 * - "sendgrid": delivers via the SendGrid Web API v3 (HTTPS, no SMTP ports or
 *   relay needed). Set EMAIL_PROVIDER=sendgrid and SENDGRID_API_KEY (a key with
 *   "Mail Send" permission). EMAIL_FROM must be a verified sender identity.
 * - "smtp": delivers via nodemailer. Install it (`npm i nodemailer`) and set
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS (and EMAIL_PROVIDER=smtp) to
 *   send real email. nodemailer is imported lazily so "log" mode needs no dep.
 *
 * Returns { delivered, provider } so callers can tell the user the truth
 * (never claim an email was sent when it was only logged).
 */

// "KT Messenger <no-reply@ktmessenger.com>" -> { name, email } for the SendGrid API.
function parseFrom(from) {
  const m = String(from || '').match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  return m ? { name: m[1], email: m[2] } : { email: String(from || '') }
}

export async function sendMail({ to, subject, text, html }) {
  reloadEnv()
  // Read provider/from live so .env edits (and admin Email Settings writes)
  // apply without a restart — env.js only snapshots them once at startup.
  const provider = process.env.EMAIL_PROVIDER || env.email.provider
  const from = process.env.EMAIL_FROM || env.email.from

  if (provider === 'sendgrid') {
    const apiKey = process.env.SENDGRID_API_KEY

    if (!apiKey) throw new Error('Email not sent: SENDGRID_API_KEY is not set in backend/.env')
    if (isPlaceholder(apiKey)) {
      throw new Error(`Email not sent: SENDGRID_API_KEY in backend/.env is still a placeholder ("${apiKey}"). Paste the real API key from sendgrid.com > Settings > API Keys.`)
    }

    const content = []
    if (text) content.push({ type: 'text/plain', value: text })
    if (html) content.push({ type: 'text/html', value: html })

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: parseFrom(from),
        subject,
        content,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const sgMsg = body?.errors?.[0]?.message
      if (res.status === 401 || res.status === 403) {
        throw new Error(
          `Email not sent: SendGrid rejected the request (${res.status}). ${sgMsg || ''} ` +
          'Check that SENDGRID_API_KEY is a valid key with "Mail Send" permission, and that EMAIL_FROM is a verified sender ' +
          '(sendgrid.com > Settings > Sender Authentication).',
        )
      }
      throw new Error(`Email not sent: SendGrid error ${res.status}${sgMsg ? ` — ${sgMsg}` : ''}`)
    }
    return { delivered: true, provider }
  }

  if (provider === 'smtp') {
    const host = process.env.SMTP_HOST
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    // Fail with an actionable message rather than a cryptic auth error.
    if (!host) throw new Error('Email not sent: SMTP_HOST is not set in backend/.env')
    if (user && !pass) {
      throw new Error(
        `Email not sent: SMTP_PASS is empty in backend/.env. Add the ${credName(host)} for ${user}, then restart the backend.`,
      )
    }
    // A placeholder is still "not configured" — say so plainly instead of letting
    // the provider bounce it back as a confusing authentication failure.
    if (user && isPlaceholder(pass)) {
      throw new Error(
        `Email not sent: SMTP_PASS in backend/.env is still a placeholder ("${pass}"). Replace it with the real ${credName(host)} for ${user}, then restart the backend.`,
      )
    }

    const nodemailer = (await import('nodemailer')).default
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: user ? { user, pass } : undefined,
    })

    try {
      await transport.sendMail({ from, to, subject, text, html })
    } catch (err) {
      // Translate the most common provider rejections into plain guidance.
      const code = err?.responseCode || err?.code
      if (code === 535 || code === 534 || code === 451 || code === 'EAUTH' || /invalid login|authentication failed|not accepted/i.test(err?.message || '')) {
        // Guidance differs per provider — say the right thing for this host.
        let how
        if (/sendgrid/i.test(host)) {
          how = 'SMTP_USER must be the literal word "apikey", and SMTP_PASS a SendGrid API key that has "Mail Send" permission. If the key was revoked, create a new one: sendgrid.com > Settings > API Keys > Create API Key (Full Access).'
        } else if (/gmail|google/i.test(host)) {
          how = 'Use a 16-character App Password (2-Step Verification must be on), not the account password.'
        } else {
          how = `Check that SMTP_USER (${user}) and its mailbox password are correct on ${host}.`
        }
        throw new Error(`Email not sent: ${host} rejected the login for "${user}". ${how}`)
      }
      if (code === 'ECONNECTION' || code === 'ETIMEDOUT' || code === 'ESOCKET') {
        const port = Number(process.env.SMTP_PORT || 587)
        const secureFlag = process.env.SMTP_SECURE === 'true'
        // The classic mix-up: implicit TLS on a STARTTLS port (or the reverse).
        if (secureFlag && port !== 465) {
          throw new Error(`Email not sent: SMTP_SECURE is on but port is ${port}. Use port 465 with SSL, or port ${port} with SSL off.`)
        }
        if (!secureFlag && port === 465) {
          throw new Error('Email not sent: port 465 needs SSL enabled. Turn on SSL, or use port 587 instead.')
        }
        throw new Error(`Email not sent: could not connect to ${host}:${port}. Check the host/port and your network.`)
      }
      throw new Error(`Email not sent: ${err?.message || 'SMTP error'}`)
    }
    return { delivered: true, provider }
  }

  // "log" provider — safe default, delivers nothing.
  // eslint-disable-next-line no-console
  console.log(
    [
      '\n──────── EMAIL (log provider — not actually delivered) ────────',
      `From:    ${from}`,
      `To:      ${to}`,
      `Subject: ${subject}`,
      'Message:',
      text || html || '',
      '───────────────────────────────────────────────────────────────\n',
    ].join('\n'),
  )
  return { delivered: false, provider: 'log' }
}

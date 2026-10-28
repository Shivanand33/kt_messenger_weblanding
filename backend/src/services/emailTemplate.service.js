import { prisma } from '../config/db.js'

/**
 * Editable transactional email templates.
 *
 * Every template has a complete default here in code. The database only ever
 * holds an *override*, so a missing row, an unmigrated database or a failing
 * query all fall back to a correct email rather than blocking a sign-in — a
 * 2FA code that cannot be sent locks an admin out of the panel, and no
 * cosmetic feature is worth that.
 *
 * Admins edit fields, not markup: the layout below is table-based and
 * inline-styled because that is what Outlook and Gmail actually render. A raw
 * HTML escape hatch exists (`useCustomHtml`) for anyone who wants the whole
 * canvas.
 */

/* ── Keys ─────────────────────────────────────────────────────────────── */

export const TWO_FACTOR_CODE = 'admin.2fa_code'
export const TEMPLATE_KEYS = [TWO_FACTOR_CODE]

/* ── Placeholders ─────────────────────────────────────────────────────── */

/**
 * What an admin may type into any field. Shown in the editor, and the only
 * tokens `fill` replaces — an unknown `{{thing}}` is left as typed rather than
 * silently blanked, so a misspelling is visible instead of invisible.
 */
export const PLACEHOLDERS = [
  { token: '{{code}}', label: 'The 6-digit code' },
  { token: '{{name}}', label: "The admin's name" },
  { token: '{{email}}', label: 'Where the code was sent' },
  { token: '{{minutes}}', label: 'Minutes until the code expires' },
  { token: '{{purpose}}', label: 'sign-in or setup' },
  { token: '{{time}}', label: 'Time of the attempt (UTC)' },
  { token: '{{ip}}', label: 'IP address of the attempt' },
  { token: '{{browser}}', label: 'Browser / device of the attempt' },
  { token: '{{brandName}}', label: 'Your brand name' },
  { token: '{{resetUrl}}', label: 'Link to the password-reset page' },
  { token: '{{year}}', label: 'Current year' },
]

/* ── Defaults ─────────────────────────────────────────────────────────── */

const TWO_FACTOR_DEFAULT = {
  subject: 'Your {{brandName}} admin code: {{code}}',
  data: {
    brandName: 'KT Messenger',
    brandColor: '#1570ef',
    logoUrl: '',
    preheader: 'Your {{purpose}} code is {{code}} — it expires in {{minutes}} minutes.',
    heading: 'Your {{purpose}} code',
    intro: 'Hi {{name}}, enter this code to finish signing in to the {{brandName}} admin panel.',
    expiryNote: 'This code expires in {{minutes}} minutes and can only be used once.',
    showDetails: true,
    detailsTitle: 'Where this came from',
    securityNote: "If this wasn't you, someone may already know your password. Change it now.",
    buttonLabel: 'Change my password',
    buttonUrl: '{{resetUrl}}',
    footerNote: 'This is an automated message from the {{brandName}} admin panel. Please do not reply.',
  },
}

const DEFAULTS = {
  [TWO_FACTOR_CODE]: TWO_FACTOR_DEFAULT,
}

/** A fresh, unshared copy — callers edit what they get back. */
export function defaultsFor(key) {
  const base = DEFAULTS[key]
  if (!base) throw new Error(`Unknown email template: ${key}`)
  return { subject: base.subject, data: { ...base.data }, customHtml: '', useCustomHtml: false }
}

/* ── Load ─────────────────────────────────────────────────────────────── */

/**
 * The stored template merged over the defaults.
 *
 * Merged field by field so a template saved before a new field existed keeps
 * working: anything the row is missing comes from the default.
 */
export async function getTemplate(key) {
  const fallback = defaultsFor(key)
  let row = null
  try {
    row = await prisma.emailTemplate.findUnique({ where: { key } })
  } catch {
    // Table not migrated yet, or the database is unreachable. The defaults are
    // a complete email — never let this stop one being sent.
    return { ...fallback, key, isDefault: true, updatedAt: null }
  }
  if (!row) return { ...fallback, key, isDefault: true, updatedAt: null }

  const stored = row.data && typeof row.data === 'object' ? row.data : {}
  return {
    key,
    subject: row.subject || fallback.subject,
    data: { ...fallback.data, ...stored },
    customHtml: row.customHtml || '',
    useCustomHtml: !!row.useCustomHtml,
    isDefault: false,
    updatedAt: row.updatedAt,
  }
}

/* ── Substitution ─────────────────────────────────────────────────────── */

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** `{{token}}` to value. Unknown tokens are left as typed. */
function fill(template, vars) {
  return String(template ?? '').replace(/\{\{\s*(\w+)\s*\}\}/g, (whole, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name] ?? '') : whole,
  )
}

/**
 * Same, for HTML output.
 *
 * The admin's own text is escaped first, so a stray `<` in a sentence shows as
 * a `<` instead of eating the rest of the email, and each value is escaped as
 * it goes in. Placeholders survive escaping because `{{name}}` holds no
 * special characters. Newlines become `<br>`: people press Enter in a textarea
 * and expect a line break.
 */
function fillHtml(template, vars) {
  return escapeHtml(template)
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (whole, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? escapeHtml(vars[name]) : whole,
    )
    .replace(/\r?\n/g, '<br>')
}

/**
 * A URL safe to put in an href.
 *
 * Only http(s) and mailto survive; anything else (javascript:, data:) comes
 * back empty and the link is dropped. The editor is super-admin only, but a
 * link target is exactly the field worth being strict about.
 */
function safeUrl(template, vars) {
  const raw = fill(template, vars).trim()
  if (!raw) return ''
  if (!/^(https?:\/\/|mailto:)/i.test(raw)) return ''
  return escapeHtml(raw)
}

/** A `#rrggbb` colour, or the fallback when the field holds junk. */
function safeColor(value, fallbackColor = '#1570ef') {
  const v = String(value || '').trim()
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(v) ? v : fallbackColor
}

/* ── Rendering ────────────────────────────────────────────────────────── */

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace"

/** Email-client-safe HTML for the two-factor code: tables and inline styles. */
function renderTwoFactorHtml({ data, subject, vars }) {
  const brand = safeColor(data.brandColor)
  const brandName = fillHtml(data.brandName, vars) || 'KT Messenger'
  const logo = safeUrl(data.logoUrl, vars)
  const buttonUrl = safeUrl(data.buttonUrl, vars)
  const buttonLabel = fillHtml(data.buttonLabel, vars)
  const code = escapeHtml(vars.code)

  const detailRow = (label, value) => `
                      <tr>
                        <td class="kt-row" style="padding:7px 0;border-bottom:1px solid #eef2f7;font:400 13px/18px ${SANS};color:#64748b;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
                        <td class="kt-row kt-meta" style="padding:7px 0 7px 14px;border-bottom:1px solid #eef2f7;font:400 13px/18px ${SANS};color:#334155;word-break:break-word;vertical-align:top;">${escapeHtml(value)}</td>
                      </tr>`

  const details = data.showDetails
    ? `
                <tr>
                  <td class="kt-pad" style="padding:4px 40px 0 40px;">
                    <p style="margin:0 0 6px 0;font:600 12px/16px ${SANS};letter-spacing:.6px;text-transform:uppercase;color:#94a3b8;">${fillHtml(data.detailsTitle, vars)}</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${detailRow('Time', `${vars.time} UTC`)}
${detailRow('IP address', vars.ip)}
${detailRow('Browser', vars.browser)}
                    </table>
                  </td>
                </tr>`
    : ''

  const button = buttonUrl && buttonLabel
    ? `
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 0 0;">
                      <tr>
                        <td align="center" bgcolor="${brand}" style="border-radius:8px;mso-padding-alt:12px 22px;">
                          <a href="${buttonUrl}" style="display:inline-block;padding:12px 22px;border-radius:8px;background:${brand};font:600 14px/18px ${SANS};color:#ffffff;text-decoration:none;">${buttonLabel}</a>
                        </td>
                      </tr>
                    </table>`
    : ''

  const header = logo
    ? `<img src="${logo}" alt="${brandName}" height="32" style="display:block;height:32px;max-height:32px;width:auto;border:0;">`
    : `<span class="kt-brand" style="font:700 17px/22px ${SANS};color:#0f172a;letter-spacing:-.2px;">${brandName}</span>`

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<style>
  /* Clients that honour this get a dark card; everywhere else keeps the light
     one, which is why every colour is also set inline. */
  @media (prefers-color-scheme: dark) {
    .kt-bg { background:#0b1220 !important; }
    .kt-card { background:#111c2e !important; border-color:#1f2b3f !important; }
    .kt-head, .kt-brand { color:#f8fafc !important; }
    .kt-text { color:#cbd5e1 !important; }
    .kt-code { background:#0b1424 !important; border-color:#243049 !important; color:#f8fafc !important; }
    .kt-meta { color:#cbd5e1 !important; }
    .kt-row { border-color:#1f2b3f !important; }
    .kt-rule { background:#1f2b3f !important; }
  }
  @media only screen and (max-width:600px) {
    .kt-pad { padding-left:24px !important; padding-right:24px !important; }
    .kt-code { font-size:30px !important; letter-spacing:8px !important; text-indent:8px !important; }
  }
</style>
</head>
<body class="kt-bg" style="margin:0;padding:0;width:100%;background:#eef2f7;">
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${fillHtml(data.preheader, vars)}</div>
  <table role="presentation" class="kt-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef2f7;">
    <tr>
      <td align="center" style="padding:32px 14px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:18px;">${header}</td>
          </tr>
          <tr>
            <td class="kt-card" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:4px;line-height:4px;font-size:0;background:${brand};">&nbsp;</td>
                </tr>
                <tr>
                  <td class="kt-pad" style="padding:34px 40px 0 40px;">
                    <h1 class="kt-head" style="margin:0 0 10px 0;font:700 22px/28px ${SANS};color:#0f172a;letter-spacing:-.3px;">${fillHtml(data.heading, vars)}</h1>
                    <p class="kt-text" style="margin:0;font:400 15px/23px ${SANS};color:#475569;">${fillHtml(data.intro, vars)}</p>
                  </td>
                </tr>
                <tr>
                  <td class="kt-pad" style="padding:22px 40px 0 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="kt-code" align="center" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 12px;font-family:${MONO};font-size:34px;font-weight:700;line-height:40px;letter-spacing:10px;text-indent:10px;color:#0f172a;">${code}</td>
                      </tr>
                    </table>
                    <p class="kt-text" style="margin:12px 0 0 0;text-align:center;font:400 13px/19px ${SANS};color:#64748b;">${fillHtml(data.expiryNote, vars)}</p>
                  </td>
                </tr>
                <tr>
                  <td class="kt-pad" style="padding:24px 40px 20px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td class="kt-rule" style="height:1px;line-height:1px;font-size:0;background:#eef2f7;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>
${details}
                <tr>
                  <td class="kt-pad" style="padding:20px 40px 34px 40px;">
                    <p class="kt-text" style="margin:0;font:400 14px/21px ${SANS};color:#475569;">${fillHtml(data.securityNote, vars)}</p>${button}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 10px 0 10px;">
              <p style="margin:0;font:400 12px/18px ${SANS};color:#94a3b8;">${fillHtml(data.footerNote, vars)}</p>
              <p style="margin:6px 0 0 0;font:400 12px/18px ${SANS};color:#94a3b8;">&copy; ${escapeHtml(vars.year)} ${brandName}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * The plain-text part, built from the same fields.
 *
 * Always sent alongside the HTML: some clients show it instead, and a code is
 * the one thing that must never arrive as an empty message.
 */
function renderTwoFactorText({ data, vars }) {
  const url = fill(data.buttonUrl, vars).trim()
  const out = [
    fill(data.heading, vars),
    '',
    fill(data.intro, vars),
    '',
    `    ${vars.code}`,
    '',
    fill(data.expiryNote, vars),
  ]
  if (data.showDetails) {
    out.push(
      '',
      `${fill(data.detailsTitle, vars)}:`,
      `  Time:    ${vars.time} UTC`,
      `  IP:      ${vars.ip}`,
      `  Browser: ${vars.browser}`,
    )
  }
  out.push('', fill(data.securityNote, vars))
  if (url) out.push(url)
  out.push('', fill(data.footerNote, vars))
  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

/**
 * Build one email.
 *
 * `override` renders an unsaved draft for the admin editor. The preview runs
 * through this same function, so what the preview shows is what the mailbox
 * gets — a preview built separately would drift from the real send.
 */
export async function render({ key, vars = {}, override = null }) {
  const base = defaultsFor(key)
  const template = override
    ? { ...base, ...override, data: { ...base.data, ...(override.data || {}) } }
    : await getTemplate(key)

  const merged = {
    year: String(new Date().getFullYear()),
    brandName: template.data.brandName || base.data.brandName,
    ...vars,
  }

  const subject = fill(template.subject, merged).trim() || fill(base.subject, merged)
  const text = renderTwoFactorText({ data: template.data, vars: merged })

  // Custom HTML is the admin's canvas: placeholders are filled, nothing else
  // is touched. An empty box falls back to the built-in layout rather than
  // sending a blank email.
  const html = template.useCustomHtml && String(template.customHtml || '').trim()
    ? fill(template.customHtml, merged)
    : renderTwoFactorHtml({ data: template.data, subject, vars: merged })

  return { subject, html, text }
}

/**
 * A short branded notice — "2FA was turned on", "someone reset it for you".
 *
 * Not separately editable: it borrows the brand name, colour, logo and footer
 * from the code template so every mail the panel sends looks like the same
 * sender, without adding a second thing to keep in sync.
 */
export async function renderNotice({ heading, lines = [], footerLine = '' }) {
  let data
  try {
    ;({ data } = await getTemplate(TWO_FACTOR_CODE))
  } catch {
    data = defaultsFor(TWO_FACTOR_CODE).data
  }

  const vars = { year: String(new Date().getFullYear()), brandName: data.brandName }
  const brand = safeColor(data.brandColor)
  const brandName = fillHtml(data.brandName, vars) || 'KT Messenger'
  const logo = safeUrl(data.logoUrl, vars)
  const header = logo
    ? `<img src="${logo}" alt="${brandName}" height="32" style="display:block;height:32px;max-height:32px;width:auto;border:0;">`
    : `<span class="kt-brand" style="font:700 17px/22px ${SANS};color:#0f172a;letter-spacing:-.2px;">${brandName}</span>`

  const body = lines
    .map(
      (line) =>
        `<p class="kt-text" style="margin:0 0 12px 0;font:400 15px/23px ${SANS};color:#475569;">${fillHtml(line, vars)}</p>`,
    )
    .join('\n                    ')

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(heading)}</title>
<style>
  @media (prefers-color-scheme: dark) {
    .kt-bg { background:#0b1220 !important; }
    .kt-card { background:#111c2e !important; border-color:#1f2b3f !important; }
    .kt-head, .kt-brand { color:#f8fafc !important; }
    .kt-text { color:#cbd5e1 !important; }
  }
  @media only screen and (max-width:600px) {
    .kt-pad { padding-left:24px !important; padding-right:24px !important; }
  }
</style>
</head>
<body class="kt-bg" style="margin:0;padding:0;width:100%;background:#eef2f7;">
  <table role="presentation" class="kt-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef2f7;">
    <tr>
      <td align="center" style="padding:32px 14px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
          <tr><td align="center" style="padding-bottom:18px;">${header}</td></tr>
          <tr>
            <td class="kt-card" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:4px;line-height:4px;font-size:0;background:${brand};">&nbsp;</td></tr>
                <tr>
                  <td class="kt-pad" style="padding:32px 40px 34px 40px;">
                    <h1 class="kt-head" style="margin:0 0 12px 0;font:700 20px/26px ${SANS};color:#0f172a;letter-spacing:-.3px;">${fillHtml(heading, vars)}</h1>
                    ${body}
                    ${footerLine ? `<p style="margin:18px 0 0 0;font:400 13px/19px ${SANS};color:#94a3b8;">${fillHtml(footerLine, vars)}</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 10px 0 10px;">
              <p style="margin:0;font:400 12px/18px ${SANS};color:#94a3b8;">${fillHtml(data.footerNote, vars)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [fill(heading, vars), '', ...lines.map((l) => fill(l, vars))]
    .concat(footerLine ? ['', fill(footerLine, vars)] : [])
    .join('\n')

  return { html, text }
}

/** Stand-in values for the editor's preview, so nothing renders empty. */
export const SAMPLE_VARS = {
  code: '418275',
  name: 'Alex',
  email: 'al***@ktmessenger.com',
  minutes: '10',
  purpose: 'sign-in',
  time: '27 Oct 2026, 14:05',
  ip: '203.0.113.42',
  browser: 'Chrome 141 on Windows',
  resetUrl: 'https://admin.ktmessenger.com/forgot-password',
}

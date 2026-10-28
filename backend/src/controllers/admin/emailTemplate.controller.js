import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, ApiError } from '../../utils/apiResponse.js'
import { writeAudit } from '../../utils/audit.js'
import { sendMail } from '../../services/email.service.js'
import * as templates from '../../services/emailTemplate.service.js'
import { CODE_TTL_MS, targetEmail } from '../../services/twofactor.service.js'

/**
 * The two-factor code email, editable from the admin panel.
 *
 * Preview, test and the real sign-in all go through
 * emailTemplate.service.render, so the picture in the editor is the email that
 * actually arrives — a preview built on its own would drift the first time
 * either side changed.
 */

const KEY = templates.TWO_FACTOR_CODE

/** The draft an editor sends up, narrowed to the fields we store. */
const draftFrom = (body) => ({
  subject: body.subject,
  data: body.data,
  customHtml: body.customHtml ?? '',
  useCustomHtml: !!body.useCustomHtml,
})

// GET /api/admin/email-templates/2fa
export const getTwoFactorTemplate = asyncHandler(async (_req, res) => {
  const template = await templates.getTemplate(KEY)
  return ok(res, {
    ...template,
    // Shipped alongside so the editor can offer "reset to default" and list
    // the placeholders without hard-coding either of them in the UI.
    defaults: templates.defaultsFor(KEY),
    placeholders: templates.PLACEHOLDERS,
    sample: templates.SAMPLE_VARS,
    expiresInMinutes: Math.round(CODE_TTL_MS / 60000),
  })
})

// PUT /api/admin/email-templates/2fa
export const updateTwoFactorTemplate = asyncHandler(async (req, res) => {
  const draft = draftFrom(req.body)

  // Refuse a template the placeholder is missing from. Without {{code}} the
  // email is delivered, looks fine, and signs nobody in.
  const carriesCode = draft.useCustomHtml
    ? /\{\{\s*code\s*\}\}/.test(draft.customHtml || '')
    : true
  if (!carriesCode) {
    throw ApiError.badRequest('Your custom HTML must include {{code}} somewhere, or the email arrives without the code.')
  }

  await prisma.emailTemplate.upsert({
    where: { key: KEY },
    update: { ...draft, updatedById: req.admin.id },
    create: { key: KEY, ...draft, updatedById: req.admin.id },
  })

  await writeAudit({ req, action: 'email_template.update', entity: 'EmailTemplate', entityId: KEY })
  const saved = await templates.getTemplate(KEY)
  return ok(res, saved)
})

// POST /api/admin/email-templates/2fa/preview — renders a draft, sends nothing.
export const previewTwoFactorTemplate = asyncHandler(async (req, res) => {
  const override = req.body?.subject !== undefined ? draftFrom(req.body) : null
  const rendered = await templates.render({
    key: KEY,
    override,
    vars: { ...templates.SAMPLE_VARS, minutes: String(Math.round(CODE_TTL_MS / 60000)) },
  })
  return ok(res, rendered)
})

/**
 * POST /api/admin/email-templates/2fa/test — sends the draft for real.
 *
 * Only ever to the signed-in admin's own address. Checking your own template
 * needs no other recipient, and anything else would turn the panel into a way
 * of mailing strangers from a verified sender.
 */
export const testTwoFactorTemplate = asyncHandler(async (req, res) => {
  const me = await prisma.admin.findUnique({ where: { id: req.admin.id } })
  const to = targetEmail(me)
  if (!to) throw ApiError.badRequest('Your account has no email address to send to')

  const override = req.body?.subject !== undefined ? draftFrom(req.body) : null
  const { subject, html, text } = await templates.render({
    key: KEY,
    override,
    vars: {
      ...templates.SAMPLE_VARS,
      name: me.name,
      email: to,
      minutes: String(Math.round(CODE_TTL_MS / 60000)),
      time: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }),
      browser: req.headers['user-agent'] || 'unknown device',
    },
  })

  let result
  try {
    result = await sendMail({ to, subject: `[Test] ${subject}`, text, html })
  } catch (err) {
    throw ApiError.badRequest(err.message || 'Test email failed')
  }
  // The "log" provider reports success at the transport level and delivers
  // nothing — say so rather than let the admin wait for mail that never left.
  if (!result.delivered) {
    throw ApiError.badRequest(
      `Email is not configured for delivery (provider: ${result.provider}). Set it up in Email Settings first.`,
    )
  }
  await writeAudit({ req, action: 'email_template.test', entity: 'EmailTemplate', entityId: KEY })
  return ok(res, { ...result, to })
})

// POST /api/admin/email-templates/2fa/reset — drop the override, back to the built-in.
export const resetTwoFactorTemplate = asyncHandler(async (req, res) => {
  await prisma.emailTemplate.deleteMany({ where: { key: KEY } })
  await writeAudit({ req, action: 'email_template.reset', entity: 'EmailTemplate', entityId: KEY })
  return ok(res, await templates.getTemplate(KEY))
})

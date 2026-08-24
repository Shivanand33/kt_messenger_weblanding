import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, ApiError } from '../../utils/apiResponse.js'
import { sendMail } from '../../services/email.service.js'
import { writeAudit } from '../../utils/audit.js'

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// POST /api/admin/contact/:id/reply   { subject?, body }
// Emails the person who submitted the form and stores the reply on the record.
export const reply = asyncHandler(async (req, res) => {
  const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } })
  if (!message) throw ApiError.notFound('Contact message not found')

  const body = req.body.body
  const subject = req.body.subject?.trim() || `Re: ${message.subject || 'Your message to KT Messenger'}`

  const text = [
    `Hi ${message.name},`,
    '',
    body,
    '',
    '---',
    'Your original message:',
    message.message,
    '',
    '— KT Messenger Support',
  ].join('\n')

  const html = [
    `<p>Hi ${escapeHtml(message.name)},</p>`,
    `<div style="white-space:pre-wrap">${escapeHtml(body)}</div>`,
    '<hr style="border:none;border-top:1px solid #e5e9f0;margin:20px 0">',
    '<p style="color:#667085;font-size:13px">Your original message:</p>',
    `<blockquote style="color:#667085;font-size:13px;white-space:pre-wrap;margin:0;padding-left:12px;border-left:3px solid #e5e9f0">${escapeHtml(message.message)}</blockquote>`,
    '<p style="color:#667085;font-size:13px">— KT Messenger Support</p>',
  ].join('')

  // deliver:false = the admin is sending it from their own mail client; we only
  // record it. Otherwise send first: if delivery fails we do NOT mark the message
  // as replied, and the admin sees exactly why (ApiError keeps the message intact).
  let result
  if (req.body.deliver === false) {
    result = { delivered: false, provider: 'manual' }
  } else {
    try {
      result = await sendMail({ to: message.email, subject, text, html })
    } catch (err) {
      throw ApiError.badRequest(err.message || 'Email could not be sent')
    }
  }

  const updated = await prisma.contactMessage.update({
    where: { id: message.id },
    data: {
      replyBody: body,
      repliedAt: new Date(),
      repliedById: req.admin?.id || null,
      status: 'RESOLVED',
    },
  })

  await writeAudit({ req, action: 'contact.reply', entity: 'ContactMessage', entityId: message.id, meta: { to: message.email } })

  return ok(res, {
    id: updated.id,
    status: updated.status,
    repliedAt: updated.repliedAt,
    to: message.email,
    delivered: result.delivered,
    provider: result.provider,
  })
})

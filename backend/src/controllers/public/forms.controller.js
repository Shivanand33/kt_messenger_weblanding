import crypto from 'node:crypto'
import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok, created, ApiError } from '../../utils/apiResponse.js'
import { clientIp } from '../../utils/audit.js'
import { env } from '../../config/env.js'

function hashIp(req) {
  const ip = clientIp(req)
  if (!ip) return null
  return crypto.createHash('sha256').update(ip + env.jwtSecret).digest('hex').slice(0, 32)
}

// POST /api/subscribe
export const subscribe = asyncHandler(async (req, res) => {
  const { email, sourcePage, locale, consent, website } = req.body
  if (website) throw ApiError.badRequest('Rejected') // honeypot tripped
  const subscriber = await prisma.subscriber.upsert({
    where: { email },
    update: { status: 'SUBSCRIBED', sourcePage: sourcePage || undefined, consent },
    create: { email, sourcePage, locale, consent, status: 'SUBSCRIBED' },
  })
  prisma.analyticsEvent.create({ data: { type: 'subscribe', path: sourcePage, meta: { email } } }).catch(() => {})
  return created(res, { id: subscriber.id, email: subscriber.email })
})

// POST /api/contact
export const contact = asyncHandler(async (req, res) => {
  const { name, email, subject, message, sourcePage, website } = req.body
  if (website) throw ApiError.badRequest('Rejected')
  const msg = await prisma.contactMessage.create({ data: { name, email, subject, message, sourcePage, status: 'NEW' } })
  prisma.analyticsEvent.create({ data: { type: 'contact_submitted', path: sourcePage } }).catch(() => {})
  return created(res, { id: msg.id, received: true })
})

// POST /api/feedback  ("Was this article helpful?")
export const feedback = asyncHandler(async (req, res) => {
  const { articleId, pagePath, vote, comment } = req.body
  let validArticleId = null
  if (articleId) {
    const exists = await prisma.helpArticle.findUnique({ where: { id: articleId }, select: { id: true } })
    validArticleId = exists?.id || null
  }
  const record = await prisma.feedback.create({ data: { articleId: validArticleId, pagePath, vote, comment } })
  prisma.analyticsEvent.create({ data: { type: 'feedback_submitted', path: pagePath, meta: { vote } } }).catch(() => {})
  return created(res, { id: record.id, recorded: true })
})

// POST /api/track/download
export const trackDownload = asyncHandler(async (req, res) => {
  const { platform, page, target, sessionId } = req.body
  await prisma.downloadEvent.create({ data: { platform, page, target, sessionId, ipHash: hashIp(req) } })
  return ok(res, { tracked: true })
})

// POST /api/track/event   (generic analytics)
export const trackEvent = asyncHandler(async (req, res) => {
  const { type, path, meta, sessionId } = req.body
  await prisma.analyticsEvent.create({ data: { type, path, meta, sessionId } })
  return ok(res, { tracked: true })
})

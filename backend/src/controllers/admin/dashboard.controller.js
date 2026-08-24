import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok } from '../../utils/apiResponse.js'

// GET /api/admin/dashboard
export const dashboard = asyncHandler(async (_req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    blogsTotal, blogsPublished, blogsDraft,
    helpArticles, faqs, successStories,
    subscribers, contactsNew, feedbackTotal,
    downloads30, pageViews30,
    recentActivity, recentContacts,
    downloadByPlatform,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    prisma.blogPost.count({ where: { status: 'DRAFT' } }),
    prisma.helpArticle.count(),
    prisma.faq.count(),
    prisma.successStory.count(),
    prisma.subscriber.count({ where: { status: 'SUBSCRIBED' } }),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.feedback.count(),
    prisma.downloadEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { type: 'page_view', createdAt: { gte: since } } }),
    prisma.auditLog.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { admin: { select: { name: true } } } }),
    prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.downloadEvent.groupBy({ by: ['platform'], _count: { platform: true }, where: { createdAt: { gte: since } } }),
  ])

  return ok(res, {
    stats: {
      blogsTotal, blogsPublished, blogsDraft,
      helpArticles, faqs, successStories,
      subscribers, contactsNew, feedbackTotal,
      downloads30, pageViews30,
    },
    recentActivity: recentActivity.map((a) => ({
      id: a.id, action: a.action, entity: a.entity, entityId: a.entityId,
      admin: a.admin?.name || 'System', createdAt: a.createdAt,
    })),
    recentContacts: recentContacts.map((c) => ({ id: c.id, name: c.name, email: c.email, subject: c.subject, status: c.status, createdAt: c.createdAt })),
    downloadByPlatform: downloadByPlatform.map((d) => ({ platform: d.platform, count: d._count.platform })),
  })
})

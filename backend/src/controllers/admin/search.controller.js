import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok } from '../../utils/apiResponse.js'

/**
 * Global admin search + the notification feed.
 *
 * Both endpoints read live rows only — nothing here is sampled, cached or
 * invented. An empty result set means the database genuinely has no match.
 *
 * Permissions are enforced per resource rather than on the route as a whole:
 * an editor who cannot read admin users simply gets no "Admin Users" group
 * back, instead of the whole search 403-ing.
 */

// Mirrors requirePermission(): super admins bypass every check.
const allowed = (req, perm) => !!req.admin && (req.admin.isSuperAdmin || req.admin.permissions.includes(perm))

const insensitive = (q) => ({ contains: q, mode: 'insensitive' })

// Trim a long body down to something that fits on one dropdown row.
const snippet = (text, max = 90) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
}

/**
 * GET /api/admin/search?q=...
 *
 * Returns results grouped by resource. Each item carries the admin-app route
 * to open, so the UI can navigate without knowing anything about the models.
 */
export const search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim()
  const take = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 20)

  // Below two characters every query matches almost everything, which is just
  // noise in a dropdown — return empty rather than hammering the database.
  if (q.length < 2) return ok(res, { query: q, total: 0, groups: [] })

  const can = {
    blog: allowed(req, 'blog:read'),
    help: allowed(req, 'help:read'),
    faq: allowed(req, 'faq:read'),
    story: allowed(req, 'success_story:read'),
    contact: allowed(req, 'contact:read'),
    subscriber: allowed(req, 'subscriber:read'),
    adminUser: allowed(req, 'admin_user:read'),
    media: allowed(req, 'media:read'),
  }

  const none = () => Promise.resolve([])

  const [blogs, helpArticles, faqs, stories, contacts, subscribers, adminUsers, media] = await Promise.all([
    can.blog
      ? prisma.blogPost.findMany({
          where: { OR: [{ title: insensitive(q) }, { excerpt: insensitive(q) }, { slug: insensitive(q) }] },
          select: { id: true, title: true, slug: true, status: true },
          take,
          orderBy: { updatedAt: 'desc' },
        })
      : none(),
    can.help
      ? prisma.helpArticle.findMany({
          where: { OR: [{ title: insensitive(q) }, { slug: insensitive(q) }] },
          select: { id: true, title: true, slug: true, status: true },
          take,
          orderBy: { updatedAt: 'desc' },
        })
      : none(),
    can.faq
      ? prisma.faq.findMany({
          where: { OR: [{ question: insensitive(q) }, { answer: insensitive(q) }] },
          select: { id: true, question: true, page: true },
          take,
          orderBy: { updatedAt: 'desc' },
        })
      : none(),
    can.story
      ? prisma.successStory.findMany({
          where: { OR: [{ company: insensitive(q) }, { summary: insensitive(q) }, { slug: insensitive(q) }] },
          select: { id: true, company: true, status: true },
          take,
          orderBy: { updatedAt: 'desc' },
        })
      : none(),
    can.contact
      ? prisma.contactMessage.findMany({
          where: {
            OR: [{ name: insensitive(q) }, { email: insensitive(q) }, { subject: insensitive(q) }, { message: insensitive(q) }],
          },
          select: { id: true, name: true, email: true, subject: true, status: true },
          take,
          orderBy: { createdAt: 'desc' },
        })
      : none(),
    can.subscriber
      ? prisma.subscriber.findMany({
          where: { email: insensitive(q) },
          select: { id: true, email: true, status: true },
          take,
          orderBy: { createdAt: 'desc' },
        })
      : none(),
    can.adminUser
      ? prisma.admin.findMany({
          where: { OR: [{ name: insensitive(q) }, { email: insensitive(q) }] },
          select: { id: true, name: true, email: true },
          take,
          orderBy: { createdAt: 'desc' },
        })
      : none(),
    can.media
      ? prisma.media.findMany({
          where: { originalName: insensitive(q) },
          select: { id: true, originalName: true, url: true },
          take,
          orderBy: { createdAt: 'desc' },
        })
      : none(),
  ])

  const groups = [
    {
      type: 'blog',
      label: 'Blogs',
      icon: 'blogs',
      items: blogs.map((b) => ({ id: b.id, title: b.title, subtitle: b.status, to: `/blogs/${b.id}` })),
    },
    {
      type: 'help',
      label: 'Help Articles',
      icon: 'help',
      items: helpArticles.map((a) => ({ id: a.id, title: a.title, subtitle: a.status, to: '/help' })),
    },
    {
      type: 'faq',
      label: 'FAQs',
      icon: 'faqs',
      items: faqs.map((f) => ({ id: f.id, title: f.question, subtitle: f.page, to: '/faqs' })),
    },
    {
      type: 'story',
      label: 'Success Stories',
      icon: 'success',
      items: stories.map((s) => ({ id: s.id, title: s.company, subtitle: s.status, to: '/success-stories' })),
    },
    {
      type: 'contact',
      label: 'Contact Messages',
      icon: 'contact',
      items: contacts.map((c) => ({
        id: c.id,
        title: c.subject || snippet(c.name),
        subtitle: `${c.name} · ${c.email}`,
        to: '/contact',
      })),
    },
    {
      type: 'subscriber',
      label: 'Subscribers',
      icon: 'subscribers',
      items: subscribers.map((s) => ({ id: s.id, title: s.email, subtitle: s.status, to: '/subscribers' })),
    },
    {
      type: 'admin',
      label: 'Admin Users',
      icon: 'admins',
      items: adminUsers.map((a) => ({ id: a.id, title: a.name, subtitle: a.email, to: '/admins' })),
    },
    {
      type: 'media',
      label: 'Media',
      icon: 'media',
      items: media.map((m) => ({ id: m.id, title: m.originalName, subtitle: null, to: '/media' })),
    },
  ].filter((g) => g.items.length > 0)

  return ok(res, { query: q, total: groups.reduce((sum, g) => sum + g.items.length, 0), groups })
})

/**
 * GET /api/admin/notifications
 *
 * A live feed built from real rows: unread contact messages, new subscribers
 * and recent help-article feedback. `unreadCount` drives the bell dot, so the
 * dot disappears on its own once the queue is actually clear.
 */
export const notifications = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const canContact = allowed(req, 'contact:read')
  const canSubscriber = allowed(req, 'subscriber:read')
  const canFeedback = allowed(req, 'feedback:read')
  const none = () => Promise.resolve([])

  const [newContacts, newSubscribers, recentFeedback, unreadContacts] = await Promise.all([
    canContact
      ? prisma.contactMessage.findMany({
          where: { status: 'NEW' },
          select: { id: true, name: true, email: true, subject: true, message: true, createdAt: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        })
      : none(),
    canSubscriber
      ? prisma.subscriber.findMany({
          where: { status: 'SUBSCRIBED', createdAt: { gte: since } },
          select: { id: true, email: true, sourcePage: true, createdAt: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        })
      : none(),
    canFeedback
      ? prisma.feedback.findMany({
          where: { createdAt: { gte: since } },
          select: { id: true, vote: true, comment: true, pagePath: true, createdAt: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        })
      : none(),
    canContact ? prisma.contactMessage.count({ where: { status: 'NEW' } }) : Promise.resolve(0),
  ])

  const items = [
    ...newContacts.map((c) => ({
      id: `contact:${c.id}`,
      kind: 'contact',
      icon: 'contact',
      title: c.subject ? `New message: ${c.subject}` : `New message from ${c.name}`,
      body: snippet(c.message),
      meta: `${c.name} · ${c.email}`,
      to: '/contact',
      unread: true,
      createdAt: c.createdAt,
    })),
    ...newSubscribers.map((s) => ({
      id: `subscriber:${s.id}`,
      kind: 'subscriber',
      icon: 'subscribers',
      title: 'New newsletter subscriber',
      body: s.email,
      meta: s.sourcePage ? `via ${s.sourcePage}` : null,
      to: '/subscribers',
      unread: false,
      createdAt: s.createdAt,
    })),
    ...recentFeedback.map((f) => ({
      id: `feedback:${f.id}`,
      kind: 'feedback',
      icon: 'feedback',
      title: f.vote === 'DOWN' ? 'Negative article feedback' : 'Positive article feedback',
      body: snippet(f.comment) || f.pagePath || 'No comment left',
      meta: f.pagePath || null,
      to: '/feedback',
      unread: false,
      createdAt: f.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return ok(res, { unreadCount: unreadContacts, total: items.length, items: items.slice(0, 15) })
})

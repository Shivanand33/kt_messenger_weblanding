import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok } from '../../utils/apiResponse.js'

// Anyone seen in the last 5 minutes counts as "online right now".
const ACTIVE_WINDOW_MINUTES = 5

/**
 * GET /api/admin/analytics?days=30
 *
 * Every figure here is computed from the analytics_events / download_events
 * tables (plus contact_messages and subscribers). Nothing is estimated or
 * hardcoded — if no traffic has been recorded yet, the counts are genuinely 0.
 *
 * Visitor identity: the public site sends an anonymous, first-party
 * `visitorId` (persistent, localStorage) inside `meta`, and a `sessionId`
 * (per tab session). No IP, no PII, no third-party tracker.
 *   • Total Visitors  = distinct sessions  (i.e. visits)
 *   • Unique Visitors = distinct visitorId (i.e. people)
 *   • Active Now      = distinct sessions seen in the last 5 minutes
 */
export const overview = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const activeSince = new Date(Date.now() - ACTIVE_WINDOW_MINUTES * 60 * 1000)

  const [
    byType,
    downloadsByPlatform,
    topSearches,
    dailyRaw,
    totalsRaw,
    activeRaw,
    topPagesRaw,
    downloadsByDayRaw,
    contactLeads,
    newsletterSubscribers,
    contactLeadsTotal,
    newsletterTotal,
  ] = await Promise.all([
    prisma.analyticsEvent.groupBy({ by: ['type'], _count: { type: true }, where: { createdAt: { gte: since } } }),
    prisma.downloadEvent.groupBy({ by: ['platform'], _count: { platform: true }, where: { createdAt: { gte: since } } }),
    prisma.analyticsEvent.findMany({ where: { type: 'search_performed', createdAt: { gte: since } }, select: { meta: true }, take: 500, orderBy: { createdAt: 'desc' } }),
    prisma.$queryRaw`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as day, count(*)::int as count
                     FROM analytics_events WHERE type = 'page_view' AND "createdAt" >= ${since}
                     GROUP BY day ORDER BY day ASC`,
    // Visits (distinct sessions) and people (distinct anonymous visitorId).
    prisma.$queryRaw`SELECT
                       count(DISTINCT "sessionId")::int              AS "totalVisitors",
                       count(DISTINCT (meta ->> 'visitorId'))::int   AS "uniqueVisitors"
                     FROM analytics_events
                     WHERE "createdAt" >= ${since}`,
    prisma.$queryRaw`SELECT count(DISTINCT "sessionId")::int AS "activeNow"
                     FROM analytics_events
                     WHERE "createdAt" >= ${activeSince}`,
    prisma.$queryRaw`SELECT path, count(*)::int AS count
                     FROM analytics_events
                     WHERE type = 'page_view' AND "createdAt" >= ${since} AND path IS NOT NULL
                     GROUP BY path ORDER BY count DESC LIMIT 10`,
    prisma.$queryRaw`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as day, count(*)::int as count
                     FROM download_events WHERE "createdAt" >= ${since}
                     GROUP BY day ORDER BY day ASC`,
    prisma.contactMessage.count({ where: { createdAt: { gte: since } } }),
    prisma.subscriber.count({ where: { status: 'SUBSCRIBED', createdAt: { gte: since } } }),
    prisma.contactMessage.count(),
    prisma.subscriber.count({ where: { status: 'SUBSCRIBED' } }),
  ])

  // Top search queries (from the meta blob).
  const queryCounts = {}
  for (const row of topSearches) {
    const q = row.meta?.q
    if (q) queryCounts[q] = (queryCounts[q] || 0) + 1
  }
  const topQueries = Object.entries(queryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([q, count]) => ({ query: q, count }))

  const eventsByType = byType.map((e) => ({ type: e.type, count: e._count.type }))
  const countOf = (type) => eventsByType.find((e) => e.type === type)?.count || 0
  const downloads = downloadsByPlatform.map((d) => ({ platform: d.platform, count: d._count.platform }))

  return ok(res, {
    days,
    activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    totals: {
      totalVisitors: totalsRaw[0]?.totalVisitors || 0,
      uniqueVisitors: totalsRaw[0]?.uniqueVisitors || 0,
      activeNow: activeRaw[0]?.activeNow || 0,
      pageViews: countOf('page_view'),
      blogViews: countOf('blog_view'),
      downloadClicks: downloads.reduce((sum, d) => sum + d.count, 0),
      contactLeads,
      newsletterSubscribers,
      contactLeadsTotal,
      newsletterTotal,
    },
    eventsByType,
    downloadsByPlatform: downloads,
    topPages: topPagesRaw,
    topQueries,
    pageViewsByDay: dailyRaw,
    downloadsByDay: downloadsByDayRaw,
  })
})

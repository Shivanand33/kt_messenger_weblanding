import { prisma } from '../../config/db.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok } from '../../utils/apiResponse.js'

// GET /api/admin/analytics?days=30
export const overview = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [byType, downloadsByPlatform, topSearches, dailyRaw] = await Promise.all([
    prisma.analyticsEvent.groupBy({ by: ['type'], _count: { type: true }, where: { createdAt: { gte: since } } }),
    prisma.downloadEvent.groupBy({ by: ['platform'], _count: { platform: true }, where: { createdAt: { gte: since } } }),
    prisma.analyticsEvent.findMany({ where: { type: 'search_performed', createdAt: { gte: since } }, select: { meta: true }, take: 500, orderBy: { createdAt: 'desc' } }),
    prisma.$queryRaw`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as day, count(*)::int as count
                    FROM analytics_events WHERE type = 'page_view' AND "createdAt" >= ${since}
                    GROUP BY day ORDER BY day ASC`,
  ])

  // top search queries
  const queryCounts = {}
  for (const row of topSearches) {
    const q = row.meta?.q
    if (q) queryCounts[q] = (queryCounts[q] || 0) + 1
  }
  const topQueries = Object.entries(queryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([q, count]) => ({ query: q, count }))

  return ok(res, {
    days,
    eventsByType: byType.map((e) => ({ type: e.type, count: e._count.type })),
    downloadsByPlatform: downloadsByPlatform.map((d) => ({ platform: d.platform, count: d._count.platform })),
    topQueries,
    pageViewsByDay: dailyRaw,
  })
})

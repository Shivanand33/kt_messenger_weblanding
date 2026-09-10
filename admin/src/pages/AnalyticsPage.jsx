import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, StatCard } from '../components/ui.jsx'
import { AreaChartCard, BarChartCard } from '../components/Charts.jsx'
import { Icon } from '../components/Icon.jsx'

// The API stores platforms lowercase ('android' | 'ios' | 'desktop').
const PLATFORM_LABELS = { android: 'Android', ios: 'iOS', desktop: 'Desktop' }

// 'page_view' -> 'Page View'
const prettyEvent = (type) =>
  String(type || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

// '2026-09-10' -> 'Sep 10'
const shortDay = (day) => {
  const d = new Date(`${day}T00:00:00`)
  return Number.isNaN(d.getTime()) ? day : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Type guard only — the API always sends real counts, this just keeps a
// missing/!number field from rendering as blank or NaN. It never invents a value.
const toNum = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)

// Daily counts -> plain number array for the StatCard sparkline.
const daySeries = (rows) => (rows || []).map((r) => toNum(r.count))

/**
 * Merge the two real daily series returned by the API into one timeline.
 * A day present in only one series counts as 0 in the other.
 */
function mergeDaily(pageViewsByDay, downloadsByDay) {
  const byDay = new Map()
  for (const row of pageViewsByDay || []) {
    byDay.set(row.day, { day: row.day, PageViews: toNum(row.count), Downloads: 0 })
  }
  for (const row of downloadsByDay || []) {
    const existing = byDay.get(row.day) || { day: row.day, PageViews: 0, Downloads: 0 }
    existing.Downloads = toNum(row.count)
    byDay.set(row.day, existing)
  }
  return [...byDay.values()]
    .sort((a, b) => a.day.localeCompare(b.day))
    .map((r) => ({ date: shortDay(r.day), PageViews: r.PageViews, Downloads: r.Downloads }))
}

// Chart-shaped placeholder shown when the API genuinely returned no rows.
function ChartEmpty({ title, subtitle, height = 240, message = 'No data recorded yet' }) {
  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle ? <p className="chart-subtitle">{subtitle}</p> : null}
        </div>
      </div>
      <div
        className="empty"
        style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <Icon name="inbox" size={24} color="var(--muted)" />
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{message}</div>
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    setLoading(true)
    api
      .get('/admin/analytics', { params: { days } })
      .then((res) => setData(res.data.data))
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  if (loading) return <Loading label={`Gathering analytics for the last ${days} days...`} />
  if (!data) return null

  const t = data.totals || {}
  const activeWindow = toNum(data.activeWindowMinutes)

  const eventsData = (data.eventsByType || []).map((e) => ({
    label: prettyEvent(e.type),
    value: toNum(e.count),
  }))

  const platformData = (data.downloadsByPlatform || []).map((p) => ({
    label: PLATFORM_LABELS[p.platform] || p.platform || 'Unknown',
    value: toNum(p.count),
  }))

  const queriesData = (data.topQueries || []).map((q) => ({
    label: q.query,
    value: toNum(q.count),
  }))

  const topPages = (data.topPages || []).map((p) => ({ path: p.path, count: toNum(p.count) }))
  const topPageMax = topPages.reduce((max, p) => Math.max(max, p.count), 0)

  const timelineData = mergeDaily(data.pageViewsByDay, data.downloadsByDay)

  return (
    <div>
      <PageHeader
        title="Analytics & Insights"
        subtitle={`Detailed user engagement & traffic data over the last ${days} days.`}
        actions={
          <select
            className="select"
            style={{ width: 160, borderRadius: 10, padding: '8px 12px', background: 'var(--surface)' }}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        }
      />

      {/* Row 1 — audience */}
      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        <StatCard iconName="admins" value={toNum(t.totalVisitors)} label="Total Visitors" trend={null} sparklineData={[]} />
        <StatCard iconName="profile" value={toNum(t.uniqueVisitors)} label="Unique Visitors" trend={null} sparklineData={[]} />
        <StatCard
          iconName="clock"
          value={toNum(t.activeNow)}
          label={`Active Users Now (in the last ${activeWindow} min)`}
          trend={null}
          sparklineData={[]}
        />
        <StatCard
          iconName="analytics"
          value={toNum(t.pageViews)}
          label="Page Views"
          trend={null}
          sparklineData={daySeries(data.pageViewsByDay)}
        />
      </div>

      {/* Row 2 — conversions */}
      <div className="grid cols-4" style={{ marginBottom: 24 }}>
        <StatCard
          iconName="download"
          value={toNum(t.downloadClicks)}
          label="Download Clicks"
          trend={null}
          sparklineData={daySeries(data.downloadsByDay)}
        />
        <StatCard
          iconName="contact"
          value={toNum(t.contactLeads)}
          label={`Contact Leads (${toNum(t.contactLeadsTotal)} all time)`}
          trend={null}
          sparklineData={[]}
        />
        <StatCard
          iconName="subscribers"
          value={toNum(t.newsletterSubscribers)}
          label={`Newsletter Subscribers (${toNum(t.newsletterTotal)} all time)`}
          trend={null}
          sparklineData={[]}
        />
        <StatCard iconName="blogs" value={toNum(t.blogViews)} label="Blog Views" trend={null} sparklineData={[]} />
      </div>

      {/* Main Timeline Chart — real page_view / download_event counts per day */}
      <div style={{ marginBottom: 24 }}>
        {timelineData.length === 0 ? (
          <ChartEmpty
            title="Engagement Timeline"
            subtitle={`Page views and app download clicks per day over the last ${days} days.`}
            height={310}
            message="No page views or downloads recorded yet"
          />
        ) : (
          <AreaChartCard
            title="Engagement Timeline"
            subtitle={`Page views and app download clicks per day over the last ${days} days.`}
            data={timelineData}
          />
        )}
      </div>

      {/* 3 Columns Charts */}
      <div className="grid cols-3" style={{ marginBottom: 24 }}>
        {eventsData.length === 0 ? (
          <ChartEmpty title="Events by Type" />
        ) : (
          <BarChartCard title="Events by Type" data={eventsData} color="#2563eb" />
        )}

        {platformData.length === 0 ? (
          <ChartEmpty title="Downloads by Platform" />
        ) : (
          <BarChartCard title="Downloads by Platform" data={platformData} color="#10b981" />
        )}

        {queriesData.length === 0 ? (
          <ChartEmpty title="Top Search Queries" />
        ) : (
          <BarChartCard title="Top Search Queries" data={queriesData} color="#8b5cf6" />
        )}
      </div>

      {/* Top Pages — the 10 most viewed paths */}
      <div className="card chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Top Pages</h3>
            <p className="chart-subtitle">Most viewed paths over the last {days} days.</p>
          </div>
        </div>

        {topPages.length === 0 ? (
          <div
            className="empty"
            style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Icon name="inbox" size={24} color="var(--muted)" />
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>No data recorded yet</div>
          </div>
        ) : (
          <div className="donut-legend">
            {topPages.map((p) => (
              <div key={p.path}>
                <div className="legend-row">
                  <span
                    className="legend-name"
                    title={p.path}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '78%' }}
                  >
                    {p.path}
                  </span>
                  <strong className="legend-val">{p.count.toLocaleString()}</strong>
                </div>
                <div style={{ marginTop: 6, height: 6, borderRadius: 999, background: 'var(--surface-2)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${topPageMax ? (p.count / topPageMax) * 100 : 0}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: '#1570ef',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

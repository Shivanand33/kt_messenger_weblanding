import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, StatCard, Loading, fmtDate, StatusBadge } from '../components/ui.jsx'
import { DataTable } from '../components/DataTable.jsx'
import { Icon } from '../components/Icon.jsx'
import { AreaChartCard, DonutChartCard } from '../components/Charts.jsx'

// Type guard only — the API always sends real counts, this just keeps a
// missing/!number field from rendering as blank or NaN. It never invents a value.
const toNum = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)

// '2026-09-10' -> 'Sep 10'
const shortDay = (day) => {
  const d = new Date(`${day}T00:00:00`)
  return Number.isNaN(d.getTime()) ? day : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Merge the two real daily series from /admin/analytics into one traffic curve.
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

// Chart-shaped placeholder shown while traffic loads, or when there is nothing
// to plot. Mirrors AreaChartCard's header so the range pills keep working.
function ChartEmpty({ title, subtitle, message, height = 310, range, onRangeChange }) {
  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle ? <p className="chart-subtitle">{subtitle}</p> : null}
        </div>
        {onRangeChange && (
          <div className="pill-selector">
            {[7, 30, 90].map((d) => (
              <button key={d} className={`pill-btn ${range === d ? 'active' : ''}`} onClick={() => onRangeChange(d)}>
                {d}D
              </button>
            ))}
          </div>
        )}
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

export function DashboardPage() {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartRange, setChartRange] = useState(30)
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analyticsError, setAnalyticsError] = useState(null)

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setData(res.data.data))
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real traffic series for the area chart. Fires alongside the dashboard call
  // on mount, then again whenever the 7/30/90 range pill changes. Failures stay
  // inline (this endpoint needs `analytics:read`, which not every role has).
  useEffect(() => {
    setAnalyticsLoading(true)
    setAnalyticsError(null)
    api
      .get('/admin/analytics', { params: { days: chartRange } })
      .then((res) => setAnalytics(res.data.data))
      .catch((e) => {
        setAnalytics(null)
        setAnalyticsError(errorMessage(e))
      })
      .finally(() => setAnalyticsLoading(false))
  }, [chartRange])

  if (loading) return <Loading label="Loading your dashboard analytics..." />
  if (!data) return null
  const s = data.stats || {}

  // Traffic curve straight from the analytics endpoint's daily series.
  const trafficData = mergeDaily(analytics?.pageViewsByDay, analytics?.downloadsByDay)

  // Content mix, derived from the real dashboard counts.
  const contentDistribution = [
    { name: 'Published Blogs', value: toNum(s.blogsPublished), color: '#1570ef' },
    { name: 'Draft Blogs', value: toNum(s.blogsDraft), color: '#2e90fa' },
    { name: 'Help Articles', value: toNum(s.helpArticles), color: '#12b76a' },
    { name: 'FAQs', value: toNum(s.faqs), color: '#f79009' },
    { name: 'Success Stories', value: toNum(s.successStories), color: '#7a5af8' },
  ]
  const contentTotal = contentDistribution.reduce((sum, item) => sum + item.value, 0)

  const trafficSubtitle = 'Page views and download clicks per day over the selected range.'

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <div>
          <h2>Welcome back, Super Admin 👋</h2>
          <p>Here is your real-time overview of content, engagement, and website metrics.</p>
        </div>
        <div className="hero-actions">
          <Link to="/blogs" className="btn primary">
            <Icon name="plus" size={16} />
            <span>New Blog</span>
          </Link>
          <Link to="/contact" className="btn ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Icon name="contact" size={16} />
            <span>Messages ({toNum(s.contactsNew)})</span>
          </Link>
        </div>
      </div>

      <PageHeader
        title="Dashboard Overview"
        subtitle="Live snapshot of your KT Messenger marketing website and CMS performance."
      />

      {/* Row 1 Metric Cards */}
      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        <StatCard iconName="blogs" value={toNum(s.blogsTotal)} label="Total Blogs" trend={null} sparklineData={[]} />
        <StatCard iconName="check" value={toNum(s.blogsPublished)} label="Published Blogs" trend={null} sparklineData={[]} />
        <StatCard iconName="edit" value={toNum(s.blogsDraft)} label="Draft Blogs" trend={null} sparklineData={[]} />
        <StatCard iconName="help" value={toNum(s.helpArticles)} label="Help Articles" trend={null} sparklineData={[]} />
      </div>

      {/* Row 2 Metric Cards */}
      <div className="grid cols-4" style={{ marginBottom: 26 }}>
        <StatCard iconName="subscribers" value={toNum(s.subscribers)} label="Subscribers" trend={null} sparklineData={[]} />
        <StatCard iconName="contact" value={toNum(s.contactsNew)} label="New Messages" trend={null} sparklineData={[]} />
        <StatCard iconName="feedback" value={toNum(s.feedbackTotal)} label="Total Feedback" trend={null} sparklineData={[]} />
        <StatCard iconName="download" value={toNum(s.downloads30)} label="Downloads (30d)" trend={null} sparklineData={[]} />
      </div>

      {/* Interactive Charts Split Grid */}
      <div className="grid cols-3" style={{ marginBottom: 26 }}>
        <div style={{ gridColumn: 'span 2' }}>
          {analyticsLoading && !analytics ? (
            <ChartEmpty
              title="Traffic & Engagement Over Time"
              subtitle={trafficSubtitle}
              message="Loading traffic data..."
              range={chartRange}
              onRangeChange={(r) => setChartRange(r)}
            />
          ) : analyticsError ? (
            <ChartEmpty
              title="Traffic & Engagement Over Time"
              subtitle={trafficSubtitle}
              message={`Traffic data unavailable — ${analyticsError}`}
              range={chartRange}
              onRangeChange={(r) => setChartRange(r)}
            />
          ) : trafficData.length === 0 ? (
            <ChartEmpty
              title="Traffic & Engagement Over Time"
              subtitle={trafficSubtitle}
              message="No page views or downloads recorded yet"
              range={chartRange}
              onRangeChange={(r) => setChartRange(r)}
            />
          ) : (
            <AreaChartCard
              title="Traffic & Engagement Over Time"
              subtitle={trafficSubtitle}
              data={trafficData}
              range={chartRange}
              onRangeChange={(r) => setChartRange(r)}
            />
          )}
        </div>
        <div>
          {contentTotal === 0 ? (
            <ChartEmpty title="Content Distribution" message="No content published yet" height={260} />
          ) : (
            <DonutChartCard title="Content Distribution" data={contentDistribution} />
          )}
        </div>
      </div>

      {/* Tables / Feeds Grid */}
      <div className="grid cols-2">
        {/* Activity Timeline Card */}
        <div className="card">
          <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="clock" size={18} color="var(--brand)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>System Logs</span>
          </div>

          {!data.recentActivity || data.recentActivity.length === 0 ? (
            <div className="empty" style={{ padding: 32 }}>
              <Icon name="inbox" size={24} color="var(--muted)" />
              <div style={{ marginTop: 8, color: 'var(--muted)' }}>No recent activity logged</div>
            </div>
          ) : (
            <div style={{ padding: '12px 20px' }}>
              <div className="timeline">
                {data.recentActivity.slice(0, 5).map((act, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-icon">
                      <Icon name="history" size={16} />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">{act.action}</div>
                      <div className="timeline-meta">
                        By <strong>{act.admin || 'System'}</strong> • {fmtDate(act.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Messages Card */}
        <div className="card">
          <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="contact" size={18} color="var(--brand)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Messages</h3>
            </div>
            <Link className="btn ghost sm" to="/contact">
              <span>View all</span>
              <Icon name="external" size={14} />
            </Link>
          </div>

          {!data.recentContacts || data.recentContacts.length === 0 ? (
            <div className="empty" style={{ padding: 32 }}>
              <Icon name="inbox" size={24} color="var(--muted)" />
              <div style={{ marginTop: 8, color: 'var(--muted)' }}>No contact messages yet</div>
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  key: 'name',
                  header: 'From',
                  render: (r) => (
                    <div>
                      <div className="t-title">{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.email}</div>
                    </div>
                  ),
                },
                { key: 'subject', header: 'Subject' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) => <StatusBadge status={r.status || 'NEW'} />,
                },
                { key: 'createdAt', header: 'When', render: (r) => fmtDate(r.createdAt) },
              ]}
              rows={data.recentContacts}
            />
          )}
        </div>
      </div>
    </div>
  )
}

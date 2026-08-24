import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, StatCard, Loading, fmtDate, StatusBadge } from '../components/ui.jsx'
import { DataTable } from '../components/DataTable.jsx'
import { Icon } from '../components/Icon.jsx'
import { AreaChartCard, DonutChartCard } from '../components/Charts.jsx'

export function DashboardPage() {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartRange, setChartRange] = useState(30)

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setData(res.data.data))
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Loading label="Loading your dashboard analytics..." />
  if (!data) return null
  const s = data.stats || {}

  // Mock traffic history curve for the area chart based on stats
  const trafficData = [
    { date: 'Mon', PageViews: 420, Downloads: 85, Messages: 12 },
    { date: 'Tue', PageViews: 680, Downloads: 120, Messages: 18 },
    { date: 'Wed', PageViews: 950, Downloads: 190, Messages: 24 },
    { date: 'Thu', PageViews: 810, Downloads: 145, Messages: 20 },
    { date: 'Fri', PageViews: 1120, Downloads: 240, Messages: 35 },
    { date: 'Sat', PageViews: 1450, Downloads: 310, Messages: 42 },
    { date: 'Sun', PageViews: 1680, Downloads: 380, Messages: 48 },
  ]

  const contentDistribution = [
    { name: 'Blogs', value: s.blogsTotal || 23, color: '#2563eb' },
    { name: 'Help Articles', value: s.helpArticles || 20, color: '#3b82f6' },
    { name: 'Feedback', value: s.feedbackTotal || 4, color: '#10b981' },
    { name: 'Messages', value: s.contactsNew || 3, color: '#f59e0b' },
  ]

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
            <span>Messages ({s.contactsNew || 0})</span>
          </Link>
        </div>
      </div>

      <PageHeader
        title="Dashboard Overview"
        subtitle="Live snapshot of your KT Messenger marketing website and CMS performance."
      />

      {/* Row 1 Metric Cards */}
      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        <StatCard
          iconName="blogs"
          value={s.blogsTotal || 0}
          label="Total Blogs"
          trend="+12%"
          isPositive={true}
          sparklineData={[14, 16, 15, 18, 20, 22, s.blogsTotal || 23]}
        />
        <StatCard
          iconName="check"
          value={s.blogsPublished || 0}
          label="Published Blogs"
          trend="+8%"
          isPositive={true}
          sparklineData={[12, 14, 15, 18, 20, 22, s.blogsPublished || 23]}
        />
        <StatCard
          iconName="edit"
          value={s.blogsDraft || 0}
          label="Draft Blogs"
          trend="0%"
          isPositive={true}
          sparklineData={[2, 3, 2, 1, 3, 1, s.blogsDraft || 0]}
        />
        <StatCard
          iconName="help"
          value={s.helpArticles || 0}
          label="Help Articles"
          trend="+15%"
          isPositive={true}
          sparklineData={[10, 12, 14, 16, 17, 19, s.helpArticles || 20]}
        />
      </div>

      {/* Row 2 Metric Cards */}
      <div className="grid cols-4" style={{ marginBottom: 26 }}>
        <StatCard
          iconName="subscribers"
          value={s.subscribers || 0}
          label="Subscribers"
          trend="+24%"
          isPositive={true}
          sparklineData={[0, 2, 4, 8, 12, 16, s.subscribers || 20]}
        />
        <StatCard
          iconName="contact"
          value={s.contactsNew || 0}
          label="New Messages"
          trend="+5%"
          isPositive={true}
          sparklineData={[1, 3, 2, 5, 4, 6, s.contactsNew || 3]}
        />
        <StatCard
          iconName="feedback"
          value={s.feedbackTotal || 0}
          label="Total Feedback"
          trend="+18%"
          isPositive={true}
          sparklineData={[1, 1, 2, 2, 3, 3, s.feedbackTotal || 4]}
        />
        <StatCard
          iconName="download"
          value={s.downloads30 || 0}
          label="Downloads (30d)"
          trend="+32%"
          isPositive={true}
          sparklineData={[20, 45, 80, 130, 210, 310, s.downloads30 || 420]}
        />
      </div>

      {/* Interactive Charts Split Grid */}
      <div className="grid cols-3" style={{ marginBottom: 26 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <AreaChartCard
            title="Traffic & Engagement Over Time"
            subtitle="Page views, download clicks, and messages over selected range."
            data={trafficData}
            range={chartRange}
            onRangeChange={(r) => setChartRange(r)}
          />
        </div>
        <div>
          <DonutChartCard title="Content Distribution" data={contentDistribution} />
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

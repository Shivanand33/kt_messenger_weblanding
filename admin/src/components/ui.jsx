import React from 'react'
import { Icon } from './Icon.jsx'
import { Sparkline } from './Charts.jsx'

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div> : null}
    </div>
  )
}

export function StatCard({
  iconName = 'dashboard',
  value,
  label,
  trend = null,
  isPositive = true,
  sparklineData = [],
}) {
  return (
    <div className="stat-card-v2">
      <div className="stat-card-head">
        <div className="stat-card-icon">
          <Icon name={iconName} size={20} />
        </div>
        {trend && (
          <div className={`trend-pill ${isPositive ? 'positive' : 'negative'}`}>
            <Icon name={isPositive ? 'upTrend' : 'downTrend'} size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <div>
          <div className="stat-card-val">{value}</div>
          <div className="stat-card-lbl">{label}</div>
        </div>
        <Sparkline data={sparklineData} isPositive={isPositive} />
      </div>
    </div>
  )
}

export function Badge({ tone = 'gray', children }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

const STATUS_TONE = {
  PUBLISHED: 'green',
  DRAFT: 'gray',
  SCHEDULED: 'blue',
  ARCHIVED: 'amber',
  NEW: 'blue',
  READ: 'gray',
  RESOLVED: 'green',
  SPAM: 'red',
  SUBSCRIBED: 'green',
  UNSUBSCRIBED: 'gray',
  ACTIVE: 'green',
  DISABLED: 'red',
  UP: 'green',
  DOWN: 'red',
}

export function StatusBadge({ status }) {
  if (!status) return null
  return <Badge tone={STATUS_TONE[status] || 'gray'}>{String(status).toLowerCase()}</Badge>
}

export function Loading({ label = 'Loading analytics...' }) {
  return (
    <div className="loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
      <div className="spinner" />
      <div style={{ color: 'var(--muted)', fontWeight: 500, fontSize: 13 }}>{label}</div>
    </div>
  )
}

export function Empty({ title = 'Nothing here yet', hint, action }) {
  return (
    <div className="empty" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: 14, background: 'var(--surface-2)', color: 'var(--muted)', marginBottom: 12 }}>
        <Icon name="inbox" size={24} />
      </div>
      <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 15 }}>{title}</div>
      {hint ? <div style={{ marginTop: 4, color: 'var(--muted)', fontSize: 13 }}>{hint}</div> : null}
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  )
}

export function Pagination({ meta, onPage }) {
  if (!meta || meta.totalPages <= 1) return null
  const { page, totalPages } = meta
  const pages = []
  const push = (n) => pages.push(n)
  push(1)
  if (page > 3) pages.push('…')
  for (let n = Math.max(2, page - 1); n <= Math.min(totalPages - 1, page + 1); n++) push(n)
  if (page < totalPages - 2) pages.push('…')
  if (totalPages > 1) push(totalPages)

  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} style={{ padding: '0 4px', color: 'var(--muted)' }}>…</span>
        ) : (
          <button key={p} className={p === page ? 'active' : ''} onClick={() => onPage(p)}>{p}</button>
        ),
      )}
      <button disabled={page >= totalPages} onClick={() => onPage(page + 1)}>›</button>
    </div>
  )
}

export function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

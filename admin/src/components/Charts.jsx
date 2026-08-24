import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts'

// Custom Tooltip component for Recharts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="tooltip-row">
            <span className="dot" style={{ backgroundColor: entry.color }} />
            <span className="name">{entry.name}:</span>
            <span className="val">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Sparkline for Stat Cards
export function Sparkline({ data = [12, 18, 14, 22, 28, 24, 32], color = '#1570ef', isPositive = true }) {
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 90 + 5
      const max = Math.max(...data, 1)
      const min = Math.min(...data, 0)
      const range = max - min || 1
      const y = 32 - ((val - min) / range) * 24
      return `${x},${y}`
    })
    .join(' ')

  const strokeColor = isPositive ? '#12b76a' : '#f04438'
  const fillColor = isPositive ? 'url(#sparkline-green)' : 'url(#sparkline-red)'

  return (
    <svg className="sparkline-svg" width="96" height="36" viewBox="0 0 100 36">
      <defs>
        <linearGradient id="sparkline-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12b76a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#12b76a" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="sparkline-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f04438" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f04438" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={`5,35 ${points} 95,35`} fill={fillColor} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Main Traffic & Engagement Area Chart
export function AreaChartCard({ title, subtitle, data, range, onRangeChange }) {
  const sampleData = data || [
    { date: 'Mon', PageViews: 420, Messages: 12, Downloads: 85 },
    { date: 'Tue', PageViews: 680, Messages: 18, Downloads: 120 },
    { date: 'Wed', PageViews: 950, Messages: 24, Downloads: 190 },
    { date: 'Thu', PageViews: 810, Messages: 20, Downloads: 145 },
    { date: 'Fri', PageViews: 1120, Messages: 35, Downloads: 240 },
    { date: 'Sat', PageViews: 1450, Messages: 42, Downloads: 310 },
    { date: 'Sun', PageViews: 1680, Messages: 48, Downloads: 380 },
  ]

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title || 'Traffic & Engagement Metrics'}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
        {onRangeChange && (
          <div className="pill-selector">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                className={`pill-btn ${range === days ? 'active' : ''}`}
                onClick={() => onRangeChange(days)}
              >
                {days}D
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 310 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1570ef" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1570ef" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#12b76a" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#12b76a" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f79009" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f79009" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" opacity={0.6} />
            <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="PageViews" name="Page Views" stroke="#1570ef" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPageViews)" />
            <Area type="monotone" dataKey="Downloads" name="Downloads" stroke="#12b76a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDownloads)" />
            <Area type="monotone" dataKey="Messages" name="Messages" stroke="#f79009" strokeWidth={2} fillOpacity={1} fill="url(#colorMessages)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Donut Chart for Content Distribution
export function DonutChartCard({ title = 'Content Distribution', data }) {
  const defaultData = data || [
    { name: 'Blogs', value: 23, color: '#1570ef' },
    { name: 'Help Articles', value: 20, color: '#2e90fa' },
    { name: 'Feedback', value: 4, color: '#12b76a' },
    { name: 'Releases', value: 6, color: '#7a5af8' },
  ]

  const total = defaultData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, height: 260 }}>
        <div style={{ width: '55%', height: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={defaultData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={86}
                paddingAngle={4}
                dataKey="value"
              >
                {defaultData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <span className="donut-val">{total}</span>
            <span className="donut-lbl">Total Items</span>
          </div>
        </div>

        <div className="donut-legend" style={{ width: '45%' }}>
          {defaultData.map((item, idx) => {
            const pct = Math.round((item.value / (total || 1)) * 100)
            return (
              <div key={idx} className="legend-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot" style={{ backgroundColor: item.color }} />
                  <span className="legend-name">{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <strong className="legend-val">{item.value}</strong>
                  <span className="legend-pct">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Vertical / Horizontal Bar Chart
export function BarChartCard({ title, data, labelKey = 'label', valueKey = 'value', color = '#1570ef' }) {
  const chartData = data || [
    { label: 'Android', value: 450 },
    { label: 'iOS', value: 380 },
    { label: 'Windows', value: 290 },
    { label: 'Mac', value: 160 },
  ]

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
      </div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" opacity={0.5} />
            <XAxis dataKey={labelKey} stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={valueKey} fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

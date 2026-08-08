import { useId } from 'react'

/**
 * Tiny inline price chart. `data` is a plain array of numbers; the line is
 * green when the series closes above where it opened, red otherwise (or force
 * it with the `up` prop).
 */
export function Sparkline({ data, up, width = 120, height = 40, className = '' }) {
  const gradientId = useId()

  if (!data?.length) return null

  const rising = up ?? data[data.length - 1] >= data[0]
  const stroke = rising ? '#10b981' : '#f43f5e'

  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const stepX = width / (data.length - 1 || 1)

  const points = data.map((value, index) => {
    const x = index * stepX
    const y = height - ((value - min) / span) * (height - 6) - 3
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label={rising ? 'Trending up' : 'Trending down'}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.32" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      <polygon fill={`url(#${gradientId})`} points={`0,${height} ${points.join(' ')} ${width},${height}`} />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(' ')}
      />
    </svg>
  )
}

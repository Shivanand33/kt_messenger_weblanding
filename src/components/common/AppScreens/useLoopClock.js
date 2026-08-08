import { useEffect, useRef, useState } from 'react'

/**
 * Drives the looping in-phone app animations.
 *
 * Returns a 0–100 `progress` value that loops every `durationMs`, plus a
 * `phase` index derived from `phaseStops` (progress percentages at which the
 * next phase begins). Ticking on an interval rather than requestAnimationFrame
 * keeps the re-render cost low — these screens are decorative, and 10fps is
 * plenty for a progress bar whose width is CSS-transitioned anyway.
 *
 * Honours `prefers-reduced-motion` by parking on the first phase.
 */
export function useLoopClock({ durationMs = 12000, phaseStops = [] } = {}) {
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (!isPlaying || reduced.current) return undefined

    const step = (100 / durationMs) * 100 // percent gained per 100ms tick
    const timer = setInterval(() => {
      setProgress((current) => (current + step >= 100 ? 0 : current + step))
    }, 100)

    return () => clearInterval(timer)
  }, [isPlaying, durationMs])

  const restart = () => {
    setProgress(0)
    setIsPlaying(true)
  }

  const phase = phaseStops.reduce((acc, stop, index) => (progress >= stop ? index + 1 : acc), 0)

  return {
    progress,
    phase,
    isPlaying,
    togglePlay: () => setIsPlaying((playing) => !playing),
    restart,
  }
}

import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 up to `target` the first time the returned ref scrolls into
 * view. Returns `[ref, value]`; attach the ref to the element that should
 * trigger the animation.
 *
 * Respects `prefers-reduced-motion` by jumping straight to the final value.
 */
export function useCountUp(target, { duration = 1500, decimals = 0 } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setValue(target)
      return undefined
    }

    let frame = 0
    let started = false

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || started) return
        started = true
        observer.disconnect()

        const startedAt = performance.now()
        const step = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Number((target * eased).toFixed(decimals)))
          if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration, decimals])

  return [ref, value]
}

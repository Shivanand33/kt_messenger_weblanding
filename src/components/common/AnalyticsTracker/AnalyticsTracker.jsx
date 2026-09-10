import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackHeartbeat } from '../../../services/analytics'

// How often an open tab reports that it is still there. This is what makes
// "active users now" (a 5-minute window server-side) accurate.
const HEARTBEAT_MS = 60_000

/**
 * Renders nothing. Mounted once inside the Router, it records a page view on
 * every route change and a heartbeat while the tab is visible. All calls are
 * fire-and-forget, so a slow or offline API never affects the page.
 */
export function AnalyticsTracker() {
  const { pathname } = useLocation()
  const lastPath = useRef(null)

  // One page view per route change (StrictMode double-mounts are de-duped by
  // comparing against the last path we sent).
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    trackPageView(pathname)
  }, [pathname])

  // Heartbeat only while the tab is actually visible, so a backgrounded tab
  // is not counted as an active user.
  useEffect(() => {
    const beat = () => {
      if (document.visibilityState === 'visible') trackHeartbeat(window.location.pathname)
    }
    const timer = window.setInterval(beat, HEARTBEAT_MS)
    document.addEventListener('visibilitychange', beat)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', beat)
    }
  }, [])

  return null
}

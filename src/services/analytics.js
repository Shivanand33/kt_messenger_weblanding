// ─────────────────────────────────────────────────────────────
// KT Messenger — first-party, anonymous analytics.
//
// What is stored: a random visitor id (localStorage, persistent) and a random
// session id (sessionStorage, per tab). No IP, no email, no name, no
// third-party tracker, no cross-site cookie. The ids are opaque randoms that
// mean nothing outside this site, and clearing site data resets them.
//
// Every call is fire-and-forget: if the API is unreachable the UI never
// blocks, never throws, and nothing is queued or retried.
// ─────────────────────────────────────────────────────────────

import { api } from './apiClient'

const VISITOR_KEY = 'kt_visitor_id'
const SESSION_KEY = 'kt_session_id'

function randomId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  } catch {
    /* fall through to the Math.random path */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

// Persistent across visits — identifies a returning browser ("unique visitor").
export function getVisitorId() {
  try {
    let id = window.localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = randomId()
      window.localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return 'anonymous'
  }
}

// Per tab session — identifies one visit, and powers "active users now".
export function getSessionId() {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = randomId()
      window.sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return 'anonymous'
  }
}

/** Record any product event. Never throws. */
export function trackEvent(type, path, meta = {}) {
  try {
    api.trackEvent({
      type,
      path: path ?? window.location.pathname,
      sessionId: getSessionId(),
      meta: { ...meta, visitorId: getVisitorId() },
    })
  } catch {
    /* analytics must never break the page */
  }
}

/** Record a page view for a route. */
export function trackPageView(path) {
  trackEvent('page_view', path)
}

/** Heartbeat so "active users now" reflects people still on the page. */
export function trackHeartbeat(path) {
  trackEvent('heartbeat', path)
}

/** Record a blog article being opened. */
export function trackBlogView(slug, title) {
  trackEvent('blog_view', `/blog/${slug}`, { slug, title })
}

/**
 * Record a store/download click.
 * `platform` is one of: android | ios | desktop
 */
export function trackDownload(platform, target) {
  try {
    api.trackDownload({
      platform,
      page: window.location.pathname,
      target,
      sessionId: getSessionId(),
    })
    // Mirror it as an event too, so it shows up in the events timeline.
    trackEvent('download_clicked', undefined, { platform, target })
  } catch {
    /* never break the download */
  }
}

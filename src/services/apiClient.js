// ─────────────────────────────────────────────────────────────
// KT Messenger — public website API client.
//
// This is the ONLY new file the public website needs in order to talk to the
// backend. It is intentionally decoupled: importing it changes nothing until a
// page actually calls it, so the existing UI keeps working exactly as before.
//
// Integration pattern (per module — see README):
//   const [posts, setPosts] = useState(FALLBACK)          // keep hardcoded data
//   useEffect(() => { api.listBlog().then(setPosts).catch(() => {}) }, [])
// If the API is unreachable, the catch keeps the original content on screen.
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LANG, currentLanguage } from '../i18n/languageUrls'
import { addContentTranslations } from '../i18n/contentTranslations'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Two components asking for the same URL at the same moment share one request
// (the header and the route table both read the features menu). The entry is
// dropped as soon as it settles, so nothing is cached between renders and a
// later call still goes to the API. Everyone after the first gets a copy, so
// no caller can see another's changes.
const inFlight = new Map()

async function request(path, { method = 'GET', body, params, signal } = {}) {
  let url = `${BASE}${path}`
  // On a page in another language, content reads ask for its translations too.
  const { lang } = currentLanguage()
  if (method === 'GET' && lang !== DEFAULT_LANG) params = { ...params, lang }
  if (params) {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')).toString()
    if (qs) url += `?${qs}`
  }
  if (method === 'GET' && !signal) {
    const shared = inFlight.get(url)
    if (shared) return shared.then((json) => (typeof structuredClone === 'function' ? structuredClone(json) : json))
    const run = send(url, { method, body, signal }).finally(() => inFlight.delete(url))
    inFlight.set(url, run)
    return run
  }
  return send(url, { method, body, signal })
}

async function send(url, { method, body, signal }) {
  const res = await fetch(url, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.success === false) {
    throw Object.assign(new Error(json.message || `Request failed (${res.status})`), { status: res.status, code: json.error })
  }
  // Stored before the data is handed over, so it renders translated at once.
  if (json.translations) addContentTranslations(json.translations)
  return json // { success, data, meta, translations? }
}

export const api = {
  // Content (reads)
  listBlog: (params) => request('/blog', { params }).then((r) => ({ items: r.data, meta: r.meta })),
  getFeaturedBlog: () => request('/blog/featured').then((r) => r.data),
  getBlog: (slug) => request(`/blog/${slug}`).then((r) => r.data),
  getHelpTree: (params) => request('/help/tree', { params }).then((r) => r.data),
  getHelpArticle: (slug) => request(`/help/articles/${slug}`).then((r) => r.data),
  getPopularArticles: () => request('/help/popular').then((r) => r.data),
  listFaqs: (page) => request('/faqs', { params: { page } }).then((r) => r.data),
  listSuccessStories: () => request('/success-stories').then((r) => r.data),
  getSuccessStory: (slug) => request(`/success-stories/${slug}`).then((r) => r.data),
  getDownloads: () => request('/downloads').then((r) => r.data),
  listNews: (params) => request('/news', { params }).then((r) => r.data),
  listJobs: (params) => request('/jobs', { params }).then((r) => r.data),
  listMarketplaceProducts: (params) => request('/marketplace-products', { params }).then((r) => r.data),
  getBusinessProducts: () => request('/business-products').then((r) => r.data),
  listLocales: () => request('/locales').then((r) => r.data),
  getNavigation: (location) => request('/navigation', { params: { location } }).then((r) => r.data),
  getFooter: () => request('/footer').then((r) => r.data),
  getContentBlock: (key) => request(`/content/${key}`).then((r) => r.data),
  getPageContent: (page) => request(`/page-content/${page}`).then((r) => r.data),
  search: (q, type, page) => request('/search', { params: { q, type, page } }).then((r) => ({ items: r.data, meta: r.meta })),

  // Forms (writes)
  subscribe: (payload) => request('/subscribe', { method: 'POST', body: payload }).then((r) => r.data),
  contact: (payload) => request('/contact', { method: 'POST', body: payload }).then((r) => r.data),
  sendFeedback: (payload) => request('/feedback', { method: 'POST', body: payload }).then((r) => r.data),
  trackDownload: (payload) => request('/track/download', { method: 'POST', body: payload }).catch(() => {}),
  trackEvent: (payload) => request('/track/event', { method: 'POST', body: payload }).catch(() => {}),
}

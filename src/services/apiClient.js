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

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, { method = 'GET', body, params, signal } = {}) {
  let url = `${BASE}${path}`
  if (params) {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')).toString()
    if (qs) url += `?${qs}`
  }
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
  return json // { success, data, meta }
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

export default api

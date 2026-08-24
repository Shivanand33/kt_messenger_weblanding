import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
})

// Attach the admin JWT to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kt_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global 401 handler set by AuthContext (redirect to login).
let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && onUnauthorized) onUnauthorized()
    return Promise.reject(err)
  },
)

// Pull a human message out of a failed request. When the backend returns
// field-level validation details (Zod), name the offending fields so the user
// knows exactly what to fix (e.g. "coverUrl: Must be a URL or a path starting with /").
export function errorMessage(err, fallback = 'Something went wrong') {
  const data = err?.response?.data
  if (Array.isArray(data?.details) && data.details.length) {
    const detail = data.details.map((d) => (d.path ? `${d.path}: ${d.message}` : d.message)).join('; ')
    return data.message ? `${data.message} — ${detail}` : detail
  }
  return data?.message || err?.message || fallback
}

export default api

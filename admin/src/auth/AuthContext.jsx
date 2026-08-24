import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setUnauthorizedHandler } from '../api/client.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem('kt_admin_token')
      setAdmin(null)
      navigate('/login')
    })
  }, [navigate])

  // Restore session on load.
  useEffect(() => {
    const token = localStorage.getItem('kt_admin_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/admin/auth/me')
      .then((res) => setAdmin(res.data.data))
      .catch(() => localStorage.removeItem('kt_admin_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/admin/auth/login', { email, password })
    const { token, admin: user } = res.data.data
    localStorage.setItem('kt_admin_token', token)
    setAdmin(user)
    return user
  }

  const logout = useCallback(async () => {
    try {
      await api.post('/admin/auth/logout')
    } catch {
      /* ignore */
    }
    localStorage.removeItem('kt_admin_token')
    setAdmin(null)
    navigate('/login')
  }, [navigate])

  // Permission check — mirrors the backend (super_admin bypasses).
  const can = useCallback(
    (perm) => !!admin && (admin.role === 'super_admin' || admin.permissions?.includes(perm)),
    [admin],
  )

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, can, setAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

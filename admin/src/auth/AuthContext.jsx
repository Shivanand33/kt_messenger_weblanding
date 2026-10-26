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

  // Turns a finished sign-in into a session. Shared by the password-only path
  // and by both ways of answering a 2FA challenge.
  const startSession = ({ token, admin: user }) => {
    localStorage.setItem('kt_admin_token', token)
    setAdmin(user)
    return user
  }

  /**
   * Returns the signed-in admin, or `{ mfaRequired: true, challengeToken, ... }`
   * when a second factor is needed.
   *
   * In that case nothing is stored: the challenge token can only finish this
   * sign-in, and treating it as a session would be the whole point of 2FA
   * thrown away. The caller shows the code step and calls verifyMfa.
   */
  const login = async (email, password) => {
    const res = await api.post('/admin/auth/login', { email, password })
    const data = res.data.data
    if (data.mfaRequired) return data
    return startSession(data)
  }

  const verifyMfa = async (challengeToken, code) =>
    startSession((await api.post('/admin/auth/2fa/verify', { challengeToken, code })).data.data)

  const recoverMfa = async (challengeToken, recoveryCode) =>
    startSession((await api.post('/admin/auth/2fa/recovery', { challengeToken, recoveryCode })).data.data)

  const resendMfa = async (challengeToken) =>
    (await api.post('/admin/auth/2fa/resend', { challengeToken })).data.data

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
    <AuthContext.Provider value={{ admin, loading, login, verifyMfa, recoverMfa, resendMfa, logout, can, setAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

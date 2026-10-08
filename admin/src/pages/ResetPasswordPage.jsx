import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import api, { errorMessage } from '../api/client.js'

export function ResetPasswordPage() {
  const { admin } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (admin) navigate('/', { replace: true })
  }, [admin, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (newPassword.length < 8) {
      setErr('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setErr('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      await api.post('/admin/auth/reset-password', { token, newPassword })
      setDone(true)
    } catch (e2) {
      setErr(errorMessage(e2, 'Could not reset the password'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand">
          <span className="mark">KT</span>
          <strong style={{ color: 'var(--ink)', fontSize: 16 }}>KT Messenger Admin</strong>
        </div>
        <h1>Reset password</h1>
        <p className="sub">Choose a new password for your admin account.</p>

        {err ? <div className="err-box">{err}</div> : null}
        {done ? (
          <div className="ok-box">Password has been reset. You can now sign in with your new password.</div>
        ) : null}

        {!done && !token && (
          <div className="err-box">This reset link is missing its token. Please use the link from your email.</div>
        )}

        {!done && token && (
          <form onSubmit={submit}>
            <div className="field">
              <label>New password</label>
              <input className="input" type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" required />
            </div>
            <div className="field">
              <label>Confirm new password</label>
              <input className="input" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat the new password" required />
            </div>
            <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={busy}>
              {busy ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        )}

        <div className="login-foot">
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import api, { errorMessage } from '../api/client.js'

export function ForgotPasswordPage() {
  const { admin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (admin) navigate('/', { replace: true })
  }, [admin, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await api.post('/admin/auth/forgot-password', { email: email.trim() })
      setSent(true)
    } catch (e2) {
      setErr(errorMessage(e2, 'Could not send the reset link'))
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
        <h1>Forgot password</h1>
        <p className="sub">Enter your admin email and we will send you a reset link.</p>

        {err ? <div className="err-box">{err}</div> : null}
        {sent ? (
          <div className="ok-box">
            If an account with that email exists, a password reset link has been sent. The link is valid for 1 hour.
          </div>
        ) : null}

        {!sent && (
          <form onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ktmessenger.local" required />
            </div>
            <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={busy}>
              {busy ? 'Sending…' : 'Send reset link'}
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

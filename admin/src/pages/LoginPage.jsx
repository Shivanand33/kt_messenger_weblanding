import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { errorMessage } from '../api/client.js'

export function LoginPage() {
  const { login, admin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (admin) navigate('/', { replace: true })
  }, [admin, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (e2) {
      setErr(errorMessage(e2, 'Login failed'))
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
        <h1>Welcome back</h1>
        <p className="sub">Sign in to manage the website.</p>

        {err ? <div className="err-box">{err}</div> : null}

        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ktmessenger.local" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

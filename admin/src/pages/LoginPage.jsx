import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { errorMessage } from '../api/client.js'

/** Matches the backend's resend cooldown (twofactor.service.js). */
const RESEND_SECONDS = 60

export function LoginPage() {
  const { login, verifyMfa, recoverMfa, resendMfa, admin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  // Second factor. `challenge` holds the short-lived token from the password
  // step; while it is set, the password form is replaced by the code form.
  const [challenge, setChallenge] = useState(null)
  const [code, setCode] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [useRecovery, setUseRecovery] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const codeRef = useRef(null)

  useEffect(() => {
    if (admin) navigate('/', { replace: true })
  }, [admin, navigate])

  // Countdown for the resend button.
  useEffect(() => {
    if (cooldown <= 0) return undefined
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  useEffect(() => {
    if (challenge && !useRecovery) codeRef.current?.focus()
  }, [challenge, useRecovery])

  /** The challenge is spent or stale — send the admin back to the password. */
  const restart = (message) => {
    setChallenge(null)
    setCode('')
    setRecoveryCode('')
    setUseRecovery(false)
    setPassword('')
    setCooldown(0)
    setErr(message)
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    setNote('')
    try {
      const result = await login(email.trim(), password)
      if (result?.mfaRequired) {
        setChallenge(result)
        setCooldown(RESEND_SECONDS)
        return
      }
      navigate('/', { replace: true })
    } catch (e2) {
      setErr(errorMessage(e2, 'Login failed'))
    } finally {
      setBusy(false)
    }
  }

  const submitCode = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      if (useRecovery) await recoverMfa(challenge.challengeToken, recoveryCode.trim())
      else await verifyMfa(challenge.challengeToken, code.trim())
      navigate('/', { replace: true })
    } catch (e2) {
      const message = errorMessage(e2, 'That did not work')
      // Both of these mean the challenge no longer exists, so staying on this
      // form would only collect guesses against nothing.
      if (/expired|sign in again/i.test(message)) restart(message)
      else {
        setErr(message)
        setCode('')
      }
    } finally {
      setBusy(false)
    }
  }

  const resend = async () => {
    setBusy(true)
    setErr('')
    try {
      const res = await resendMfa(challenge.challengeToken)
      setNote(`A new code is on its way to ${res.maskedEmail || challenge.maskedEmail}.`)
      setCode('')
      setCooldown(res.retryAfterSeconds || RESEND_SECONDS)
    } catch (e2) {
      const message = errorMessage(e2, 'Could not send another code')
      if (/expired|sign in again/i.test(message)) restart(message)
      else setErr(message)
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

        {challenge ? (
          <>
            <h1>{useRecovery ? 'Use a recovery code' : 'Check your email'}</h1>
            <p className="sub">
              {useRecovery
                ? 'Enter one of the recovery codes you saved when you turned on two-factor authentication.'
                : <>We sent a 6-digit code to <strong>{challenge.maskedEmail}</strong>. It expires in 10 minutes.</>}
            </p>

            {err ? <div className="err-box">{err}</div> : null}
            {note && !err ? <div className="err-box" style={{ background: 'var(--surface-2)', color: 'var(--body)' }}>{note}</div> : null}

            <form onSubmit={submitCode}>
              {useRecovery ? (
                <div className="field">
                  <label>Recovery code</label>
                  <input
                    className="input"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="a1b2c-3d4e5"
                    autoComplete="one-time-code"
                    required
                  />
                </div>
              ) : (
                <div className="field">
                  <label>6-digit code</label>
                  <input
                    ref={codeRef}
                    className="input"
                    // inputMode brings up the number pad on a phone while
                    // still allowing a pasted code to arrive intact.
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    style={{ letterSpacing: 4, fontSize: 18, textAlign: 'center' }}
                    required
                  />
                </div>
              )}

              <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={busy}>
                {busy ? 'Checking…' : 'Verify and sign in'}
              </button>
            </form>

            <div className="login-foot" style={{ marginTop: 14, display: 'grid', gap: 8, textAlign: 'center' }}>
              {!useRecovery ? (
                <button
                  type="button"
                  className="btn ghost"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={resend}
                  disabled={busy || cooldown > 0}
                >
                  {cooldown > 0 ? `Send another code in ${cooldown}s` : 'Send another code'}
                </button>
              ) : null}

              <button
                type="button"
                className="linklike"
                style={{ background: 'none', border: 0, color: 'var(--brand, #1570ef)', padding: 0 }}
                onClick={() => { setUseRecovery((v) => !v); setErr(''); setNote('') }}
              >
                {useRecovery ? 'Enter the emailed code instead' : 'Use a recovery code instead'}
              </button>

              <button
                type="button"
                className="linklike"
                style={{ background: 'none', border: 0, color: 'var(--muted)', padding: 0 }}
                onClick={() => restart('')}
              >
                Start over
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome back</h1>
            <p className="sub">Sign in to manage the website.</p>

            {err ? <div className="err-box">{err}</div> : null}

            <form onSubmit={submitPassword}>
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ktmessenger.local" required />
              </div>
              <div className="field">
                <label>Password</label>
                <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <div className="login-foot" style={{ marginTop: -8, marginBottom: 12, textAlign: 'right' }}>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

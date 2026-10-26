import { useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Badge } from '../components/ui.jsx'
import { Input } from '../components/Field.jsx'

/**
 * Two-factor authentication, for the signed-in admin's own account.
 *
 * Turning it on is deliberately two steps: a code is sent first and has to
 * come back before anything is switched on. An address that cannot receive
 * mail must never become someone's second factor — that is how an account is
 * lost for good, and the recovery codes below are the only way back.
 */
function SecuritySection() {
  const { admin, setAdmin } = useAuth()
  const toast = useToast()
  const enabled = !!admin?.twoFactorEnabled

  const [altEmail, setAltEmail] = useState('')
  const [useAlt, setUseAlt] = useState(false)
  const [sent, setSent] = useState(null) // { maskedEmail }
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState(null)

  const [disabling, setDisabling] = useState(false)
  const [disableForm, setDisableForm] = useState({ password: '', code: '' })
  const [disableSent, setDisableSent] = useState(false)

  const sendTest = async () => {
    setBusy(true)
    try {
      const body = useAlt && altEmail.trim() ? { email: altEmail.trim() } : {}
      const res = await api.post('/admin/auth/2fa/send-test', body)
      setSent(res.data.data)
      setCode('')
      toast.success(`Code sent to ${res.data.data.maskedEmail}`)
    } catch (e) {
      toast.error(errorMessage(e, 'Could not send the code'))
    } finally {
      setBusy(false)
    }
  }

  const enable = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const body = { code: code.trim() }
      if (useAlt && altEmail.trim()) body.email = altEmail.trim()
      const res = await api.post('/admin/auth/2fa/enable', body)
      setAdmin(res.data.data.admin)
      setRecoveryCodes(res.data.data.recoveryCodes)
      setSent(null)
      setCode('')
      toast.success('Two-factor authentication is on')
    } catch (err) {
      toast.error(errorMessage(err, 'That code did not work'))
    } finally {
      setBusy(false)
    }
  }

  const sendDisableCode = async () => {
    setBusy(true)
    try {
      const res = await api.post('/admin/auth/2fa/send-code')
      setDisableSent(true)
      toast.success(`Code sent to ${res.data.data.maskedEmail}`)
    } catch (e) {
      toast.error(errorMessage(e, 'Could not send the code'))
    } finally {
      setBusy(false)
    }
  }

  const disable = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await api.post('/admin/auth/2fa/disable', {
        password: disableForm.password,
        code: disableForm.code.trim(),
      })
      setAdmin(res.data.data.admin)
      setDisabling(false)
      setDisableSent(false)
      setDisableForm({ password: '', code: '' })
      toast.success('Two-factor authentication is off')
    } catch (err) {
      toast.error(errorMessage(err, 'Could not turn it off'))
    } finally {
      setBusy(false)
    }
  }

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join('\n'))
      toast.success('Recovery codes copied')
    } catch {
      toast.error('Could not copy — select the codes and copy them by hand')
    }
  }

  const downloadCodes = () => {
    const blob = new Blob(
      [
        'KT Messenger Admin — recovery codes',
        `Account: ${admin?.email}`,
        'Each code works once. Keep this file somewhere safe and private.',
        '',
        ...recoveryCodes,
        '',
      ].join('\n'),
      { type: 'text/plain' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kt-admin-recovery-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  /* Shown once, straight after enabling. The server keeps only hashes, so
     these cannot be printed again — hence the deliberate confirm step. */
  if (recoveryCodes) {
    return (
      <div className="card card-pad" style={{ marginTop: 18 }}>
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>Save your recovery codes</h3>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>
          These are shown <strong>once</strong>. Each one signs you in a single time if you ever cannot
          reach your email. Store them somewhere safe — a password manager, or printed and locked away.
        </p>
        <div
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8,
            background: 'var(--surface-2)', padding: 14, borderRadius: 10, margin: '12px 0',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 14, letterSpacing: 1,
          }}
        >
          {recoveryCodes.map((c) => <span key={c}>{c}</span>)}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn ghost" type="button" onClick={copyCodes}>Copy</button>
          <button className="btn ghost" type="button" onClick={downloadCodes}>Download</button>
          <button className="btn primary" type="button" onClick={() => setRecoveryCodes(null)}>I have saved them</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card card-pad" style={{ marginTop: 18 }}>
      <h3 style={{ fontSize: 16, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        Two-factor authentication
        <Badge tone={enabled ? 'green' : 'gray'}>{enabled ? 'On' : 'Off'}</Badge>
      </h3>

      {enabled ? (
        <>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>
            Signing in needs a code emailed to <strong>{admin?.twoFactorEmail || admin?.email}</strong>.
            {' '}You have <strong>{admin?.recoveryCodesLeft ?? 0}</strong> unused recovery codes.
          </p>

          {disabling ? (
            <form onSubmit={disable} style={{ maxWidth: 420 }}>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                Turning this off leaves your account protected by its password alone. Confirm with your
                password and a fresh code.
              </p>
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                value={disableForm.password}
                onChange={(e) => setDisableForm((f) => ({ ...f, password: e.target.value }))}
              />
              <Input
                label="6-digit code"
                inputMode="numeric"
                value={disableForm.code}
                placeholder="123456"
                onChange={(e) => setDisableForm((f) => ({ ...f, code: e.target.value }))}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn ghost" type="button" onClick={sendDisableCode} disabled={busy}>
                  {disableSent ? 'Send another code' : 'Email me a code'}
                </button>
                <button className="btn danger" disabled={busy || !disableSent}>
                  {busy ? 'Working…' : 'Turn off'}
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  disabled={busy}
                  onClick={() => { setDisabling(false); setDisableSent(false); setDisableForm({ password: '', code: '' }) }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button className="btn ghost" type="button" onClick={() => setDisabling(true)}>Turn off</button>
          )}
        </>
      ) : (
        <>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>
            Add a second step to signing in: after your password, a 6-digit code is emailed to you.
            It protects this panel if your password is ever guessed or leaked.
          </p>

          {sent ? (
            <form onSubmit={enable} style={{ maxWidth: 420 }}>
              <p style={{ fontSize: 13, color: 'var(--body)' }}>
                A code is on its way to <strong>{sent.maskedEmail}</strong>. Enter it to finish.
              </p>
              <Input
                label="6-digit code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                placeholder="123456"
                onChange={(e) => setCode(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn primary" disabled={busy}>{busy ? 'Checking…' : 'Turn on'}</button>
                <button className="btn ghost" type="button" onClick={sendTest} disabled={busy}>Send another code</button>
                <button className="btn ghost" type="button" onClick={() => { setSent(null); setCode('') }} disabled={busy}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ maxWidth: 420 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, margin: '10px 0' }}>
                <input type="checkbox" checked={useAlt} onChange={(e) => setUseAlt(e.target.checked)} />
                Send codes to a different address
              </label>
              {useAlt ? (
                <Input
                  label="Where to send codes"
                  type="email"
                  value={altEmail}
                  placeholder="you@example.com"
                  hint="Keeping this separate from your sign-in mailbox makes the second step a genuinely second place."
                  onChange={(e) => setAltEmail(e.target.value)}
                />
              ) : null}
              <button className="btn primary" type="button" onClick={sendTest} disabled={busy || (useAlt && !altEmail.trim())}>
                {busy ? 'Sending…' : 'Email me a test code'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function ProfilePage() {
  const { admin, setAdmin } = useAuth()
  const toast = useToast()
  const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' })
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })
  const [savingP, setSavingP] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    setSavingP(true)
    try {
      const res = await api.patch('/admin/auth/profile', profile)
      setAdmin(res.data.data)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSavingP(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setSavingPw(true)
    try {
      await api.post('/admin/auth/change-password', pw)
      setPw({ currentPassword: '', newPassword: '' })
      toast.success('Password changed')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div>
      <PageHeader title="My Profile" subtitle={<>Signed in as <Badge tone="blue">{admin?.role}</Badge></>} />
      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <form className="card card-pad" onSubmit={saveProfile}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Account details</h3>
          <Input label="Name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
          <button className="btn primary" disabled={savingP}>{savingP ? 'Saving…' : 'Save changes'}</button>
        </form>

        <form className="card card-pad" onSubmit={savePassword}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Change password</h3>
          <Input label="Current password" type="password" value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} />
          <Input label="New password" type="password" hint="At least 8 characters" value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} />
          <button className="btn primary" disabled={savingPw}>{savingPw ? 'Updating…' : 'Update password'}</button>
        </form>
      </div>

      <SecuritySection />
    </div>
  )
}

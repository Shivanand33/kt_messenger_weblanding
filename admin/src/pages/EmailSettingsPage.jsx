import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, Badge } from '../components/ui.jsx'
import { Input, Select } from '../components/Field.jsx'
import { Icon } from '../components/Icon.jsx'

const PRESETS = {
  gmail: {
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    hint: 'SMTP user = your full Gmail address. Password = 16-character App Password from myaccount.google.com/apppasswords (2-Step Verification must be on).',
  },
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: '587',
    secure: false,
    hint: 'SMTP user must be the literal word "apikey". Password = your SendGrid API key with Mail Send permission.',
  },
  custom: { hint: 'Enter the SMTP details your mail provider gave you.' },
}

export function EmailSettingsPage() {
  const toast = useToast()
  const [form, setForm] = useState(null)
  const [password, setPassword] = useState('')
  const [preset, setPreset] = useState('gmail')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testTo, setTestTo] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const load = () => {
    api
      .get('/admin/settings/email')
      .then((r) => {
        setForm(r.data.data)
        setTestTo(r.data.data.user?.includes('@') ? r.data.data.user : '')
        if (/sendgrid/i.test(r.data.data.host)) setPreset('sendgrid')
        else if (/gmail|google/i.test(r.data.data.host)) setPreset('gmail')
        else if (r.data.data.host) setPreset('custom')
      })
      .catch((e) => toast.error(errorMessage(e)))
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyPreset = (key) => {
    setPreset(key)
    const p = PRESETS[key]
    if (p.host)
      setForm((f) => ({
        ...f,
        host: p.host,
        port: p.port,
        secure: p.secure,
        user: key === 'sendgrid' ? 'apikey' : f.user,
      }))
  }

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/admin/settings/email', { ...form, password: password || undefined })
      setPassword('')
      toast.success('Email settings saved successfully')
      load()
    } catch (e) {
      toast.error(errorMessage(e, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  const sendTest = async () => {
    setTesting(true)
    try {
      const r = await api.post('/admin/settings/email/test', { to: testTo || undefined })
      const d = r.data.data
      if (d.delivered) toast.success(`Test email sent to ${d.to} — check that inbox.`)
      else toast.info(`Provider is "${d.provider}" — test message dispatched.`)
    } catch (e) {
      toast.error(errorMessage(e, 'Test failed'))
    } finally {
      setTesting(false)
    }
  }

  if (!form) return <Loading label="Loading email configuration..." />

  return (
    <div>
      <PageHeader title="Email Settings" subtitle="Configure SMTP provider used for automated notifications and replies." />

      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
        <div className="card card-pad">
          <Select
            label="Mail Service Provider"
            hint={PRESETS[preset].hint}
            value={preset}
            onChange={(e) => applyPreset(e.target.value)}
            options={[
              { value: 'gmail', label: 'Gmail / Google Workspace' },
              { value: 'sendgrid', label: 'SendGrid' },
              { value: 'custom', label: 'Other (Custom SMTP)' },
            ]}
          />

          <Input
            label="From Address"
            hint="Shown as the sender, e.g. KT Messenger Support <support@kalamtime.com>"
            value={form.from || ''}
            onChange={(e) => set('from', e.target.value)}
          />

          <div className="form-row">
            <Input label="SMTP Host" value={form.host || ''} onChange={(e) => set('host', e.target.value)} />
            <Input label="Port" value={form.port || ''} onChange={(e) => set('port', e.target.value)} />
          </div>

          <Input label="SMTP Username" value={form.user || ''} onChange={(e) => set('user', e.target.value)} />

          <Input
            label="SMTP Password / API Key"
            type="password"
            hint={
              form.passwordSet
                ? `A password is saved (${form.passwordLength} chars). Leave blank to keep it.`
                : 'Not set yet — paste it here. Spaces are removed automatically.'
            }
            placeholder={form.passwordSet ? '•••••••••••• (unchanged)' : 'paste key or app password here'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: '4px 0 16px', lineHeight: 1.4 }}>
            Encryption mode is selected automatically: Port 465 uses SSL, Port 587 uses STARTTLS.
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="btn primary" onClick={save} disabled={saving}>
              <Icon name="check" size={16} />
              <span>{saving ? 'Saving…' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Connection Status</h3>
            {form.provider === 'smtp' && form.passwordSet ? (
              <Badge tone="green">Ready to send</Badge>
            ) : (
              <Badge tone="amber">Password not set</Badge>
            )}
          </div>

          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0, marginBottom: 16, lineHeight: 1.45 }}>
            Send a test email to confirm that your SMTP connection credentials work properly.
          </p>

          <Input
            label="Send Test Email To"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder="you@example.com"
          />

          <button className="btn" onClick={sendTest} disabled={testing} style={{ width: '100%', marginTop: 8 }}>
            <Icon name="subscribers" size={16} />
            <span>{testing ? 'Sending…' : 'Send Test Email'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

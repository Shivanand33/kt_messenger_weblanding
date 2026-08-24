import { useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Badge } from '../components/ui.jsx'
import { Input } from '../components/Field.jsx'

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
    </div>
  )
}

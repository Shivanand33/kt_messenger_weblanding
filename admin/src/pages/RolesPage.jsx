import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, Badge } from '../components/ui.jsx'
import { DataTable } from '../components/DataTable.jsx'
import { Modal, ConfirmDialog } from '../components/Modal.jsx'
import { Input } from '../components/Field.jsx'

export function RolesPage() {
  const { can } = useAuth()
  const toast = useToast()
  const [roles, setRoles] = useState([])
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', permissionKeys: [] })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const canWrite = can('role:write')

  const load = async () => {
    setLoading(true)
    try {
      const [r, p] = await Promise.all([api.get('/admin/roles'), api.get('/admin/permissions')])
      setRoles(r.data.data)
      setGrouped(p.data.data.grouped)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setForm({ name: '', description: '', permissionKeys: [] }); setEditing({}) }
  const openEdit = (r) => { setForm({ name: r.name, description: r.description || '', permissionKeys: r.permissionKeys || [] }); setEditing(r) }

  const toggle = (key) => setForm((f) => ({ ...f, permissionKeys: f.permissionKeys.includes(key) ? f.permissionKeys.filter((k) => k !== key) : [...f.permissionKeys, key] }))
  const toggleGroup = (keys, allOn) => setForm((f) => ({ ...f, permissionKeys: allOn ? f.permissionKeys.filter((k) => !keys.includes(k)) : [...new Set([...f.permissionKeys, ...keys])] }))

  const save = async () => {
    setSaving(true)
    try {
      const body = { name: form.name, description: form.description, permissionKeys: form.permissionKeys }
      if (editing.id) await api.put(`/admin/roles/${editing.id}`, body)
      else await api.post('/admin/roles', body)
      toast.success('Role saved')
      setEditing(null)
      load()
    } catch (e) {
      toast.error(errorMessage(e, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  const doDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/admin/roles/${deleting.id}`)
      toast.success('Role deleted')
      setDeleting(null)
      load()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card"><Loading /></div>

  const columns = [
    { key: 'name', header: 'Role', render: (r) => <div><div className="t-title">{r.name} {r.isSystem ? <Badge tone="gray">system</Badge> : null}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.description}</div></div> },
    { key: 'admins', header: 'Admins', render: (r) => `${r.admins} user${r.admins === 1 ? '' : 's'}` },
    { key: 'permissionKeys', header: 'Permissions', render: (r) => <Badge tone="blue">{r.name === 'super_admin' ? 'all' : r.permissionKeys.length}</Badge> },
  ]

  return (
    <div>
      <PageHeader title="Roles & Permissions" subtitle="Control what each admin role can do. Enforced on the backend." actions={canWrite ? <button className="btn primary" onClick={openNew}>+ New role</button> : null} />

      <DataTable columns={columns} rows={roles} actions={(r) => (
        <>
          {canWrite ? <button className="icon-btn" onClick={() => openEdit(r)}>✏️</button> : null}
          {can('role:delete') && !r.isSystem ? <button className="icon-btn danger" onClick={() => setDeleting(r)}>🗑️</button> : null}
        </>
      )} />

      {editing ? (
        <Modal title={editing.id ? 'Edit role' : 'New role'} size="lg" onClose={() => setEditing(null)} footer={<><button className="btn ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button><button className="btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
          <div className="form-row">
            <Input label="Role name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} disabled={editing.isSystem} />
            <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <label style={{ fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: 10 }}>Permissions</label>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(grouped).map(([resource, perms]) => {
              const keys = perms.map((p) => p.key)
              const allOn = keys.every((k) => form.permissionKeys.includes(k))
              return (
                <div key={resource} className="card card-pad">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ color: 'var(--ink)', textTransform: 'capitalize' }}>{resource.replace(/_/g, ' ')}</strong>
                    <button type="button" className="btn ghost sm" onClick={() => toggleGroup(keys, allOn)}>{allOn ? 'Clear' : 'Select all'}</button>
                  </div>
                  <div className="chips">
                    {perms.map((p) => {
                      const on = form.permissionKeys.includes(p.key)
                      return <button type="button" key={p.key} className="chip" style={on ? { background: 'var(--brand-soft)', borderColor: 'var(--brand)', color: 'var(--brand-strong)' } : undefined} onClick={() => toggle(p.key)}>{on ? '✓ ' : ''}{p.action}</button>
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Modal>
      ) : null}

      {deleting ? <ConfirmDialog title="Delete role?" message={`${deleting.name} will be removed.`} confirmLabel="Delete" danger busy={saving} onConfirm={doDelete} onClose={() => setDeleting(null)} /> : null}
    </div>
  )
}

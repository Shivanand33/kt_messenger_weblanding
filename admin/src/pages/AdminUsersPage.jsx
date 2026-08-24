import { useEffect, useState, useCallback } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, Empty, Pagination, StatusBadge, Badge, fmtDate } from '../components/ui.jsx'
import { DataTable } from '../components/DataTable.jsx'
import { Modal, ConfirmDialog } from '../components/Modal.jsx'
import { Input, Select } from '../components/Field.jsx'

export function AdminUsersPage() {
  const { can, admin: me } = useAuth()
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const canWrite = can('admin_user:write')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/admins', { params: { page, search: search || undefined } })
      setRows(res.data.data)
      setMeta(res.data.meta)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search])

  useEffect(() => { load() }, [load])
  useEffect(() => { api.get('/admin/roles').then((res) => setRoles(res.data.data)).catch(() => {}) }, [])

  const openNew = () => { setForm({ name: '', email: '', password: '', roleId: roles[0]?.id || '', status: 'ACTIVE' }); setEditing({}) }
  const openEdit = (r) => { setForm({ name: r.name, email: r.email, password: '', roleId: r.role?.id || '', status: r.status }); setEditing(r) }

  const save = async () => {
    setSaving(true)
    try {
      const isNew = !editing.id
      const body = { name: form.name, email: form.email, roleId: form.roleId, status: form.status }
      if (form.password) body.password = form.password
      if (isNew) await api.post('/admin/admins', body)
      else await api.put(`/admin/admins/${editing.id}`, body)
      toast.success(isNew ? 'Admin created' : 'Admin updated')
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
      await api.delete(`/admin/admins/${deleting.id}`)
      toast.success('Admin deleted')
      setDeleting(null)
      load()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'name', header: 'Name', render: (r) => <div><div className="t-title">{r.name} {r.id === me?.id ? <Badge tone="blue">you</Badge> : null}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.email}</div></div> },
    { key: 'role', header: 'Role', render: (r) => <Badge tone="gray">{r.role?.name}</Badge> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'lastLoginAt', header: 'Last login', render: (r) => fmtDate(r.lastLoginAt) },
  ]

  return (
    <div>
      <PageHeader title="Admin Users" subtitle="Manage who can access this admin panel." actions={canWrite ? <button className="btn primary" onClick={openNew}>+ New admin</button> : null} />

      <div className="toolbar">
        <div className="search"><span className="ico">🔍</span><input className="input" placeholder="Search admins…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} /></div>
      </div>

      {loading ? <div className="card"><Loading /></div> : rows.length === 0 ? <div className="card"><Empty /></div> : (
        <>
          <DataTable columns={columns} rows={rows} actions={(r) => (
            <>
              {canWrite ? <button className="icon-btn" onClick={() => openEdit(r)}>✏️</button> : null}
              {can('admin_user:delete') && r.id !== me?.id ? <button className="icon-btn danger" onClick={() => setDeleting(r)}>🗑️</button> : null}
            </>
          )} />
          <Pagination meta={meta} onPage={setPage} />
        </>
      )}

      {editing ? (
        <Modal title={editing.id ? 'Edit admin' : 'New admin'} onClose={() => setEditing(null)} footer={<><button className="btn ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button><button className="btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label={editing.id ? 'New password (leave blank to keep)' : 'Password'} type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <div className="form-row">
            <Select label="Role" value={form.roleId} onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))} options={roles.map((r) => ({ value: r.id, label: r.name }))} />
            <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'DISABLED', label: 'Disabled' }]} />
          </div>
        </Modal>
      ) : null}

      {deleting ? <ConfirmDialog title="Delete admin?" message={`${deleting.name} will lose access.`} confirmLabel="Delete" danger busy={saving} onConfirm={doDelete} onClose={() => setDeleting(null)} /> : null}
    </div>
  )
}

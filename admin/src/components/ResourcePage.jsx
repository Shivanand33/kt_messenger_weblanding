import { useEffect, useState, useCallback } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from './Toast.jsx'
import { PageHeader, Loading, Empty, Pagination } from './ui.jsx'
import { DataTable } from './DataTable.jsx'
import { Modal, ConfirmDialog } from './Modal.jsx'
import { Input, Textarea, Select, Checkbox } from './Field.jsx'

// A configurable CRUD screen: list + search + paginate + create/edit modal + delete.
// `config`: { title, subtitle, endpoint, permission, columns, fields, searchable,
//             idKey, addLabel, buildPayload }
export function ResourcePage({ config }) {
  const { can } = useAuth()
  const toast = useToast()
  const idKey = config.idKey || 'id'
  const perm = config.permission

  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // record or {} for new
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const canCreate = (!perm || can(`${perm}:write`)) && !config.disableCreate
  const canWrite = (!perm || can(`${perm}:write`)) && !config.disableEdit
  const canDelete = (!perm || can(`${perm}:delete`)) && !config.disableDelete

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(config.endpoint, { params: { page, pageSize: config.pageSize || 10, search: search || undefined } })
      setRows(res.data.data)
      setMeta(res.data.meta)
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to load'))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint, page, search])

  useEffect(() => { load() }, [load])

  const openNew = () => {
    const initial = {}
    for (const f of config.fields) initial[f.name] = f.default ?? (f.type === 'checkbox' ? false : f.type === 'json' ? '{}' : '')
    setForm(initial)
    setEditing({})
  }

  const openEdit = (record) => {
    const initial = {}
    for (const f of config.fields) {
      let v = record[f.name]
      if (f.type === 'json') v = v ? JSON.stringify(v, null, 2) : '{}'
      if (f.type === 'checkbox') v = !!v
      if (v === null || v === undefined) v = f.type === 'checkbox' ? false : ''
      initial[f.name] = v
    }
    setForm(initial)
    setEditing(record)
  }

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {}
      for (const f of config.fields) {
        let v = form[f.name]
        if (f.type === 'number') v = v === '' ? undefined : Number(v)
        else if (f.type === 'checkbox') v = !!v
        else if (f.type === 'json') { try { v = v ? JSON.parse(v) : undefined } catch { throw new Error(`Invalid JSON in "${f.label}"`) } }
        else if (typeof v === 'string') v = v.trim() === '' ? undefined : v.trim()
        if (v !== undefined) payload[f.name] = v
      }
      const body = config.buildPayload ? config.buildPayload(payload, form) : payload
      const isNew = !editing[idKey]
      if (isNew) await api.post(config.endpoint, body)
      else await api.put(`${config.endpoint}/${editing[idKey]}`, body)
      toast.success(isNew ? `${config.title} created` : `${config.title} updated`)
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.message?.startsWith('Invalid JSON') ? err.message : errorMessage(err, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  const doDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`${config.endpoint}/${deleting[idKey]}`)
      toast.success('Deleted')
      setDeleting(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err, 'Delete failed'))
    } finally {
      setSaving(false)
    }
  }

  const columns = [...config.columns]
  const actions = (row) => (
    <>
      {canWrite ? <button className="icon-btn" title="Edit" onClick={() => openEdit(row)}>✏️</button> : null}
      {canDelete ? <button className="icon-btn danger" title="Delete" onClick={() => setDeleting(row)}>🗑️</button> : null}
    </>
  )

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        actions={canCreate ? <button className="btn primary" onClick={openNew}>+ {config.addLabel || 'New'}</button> : null}
      />

      {config.searchable !== false ? (
        <div className="toolbar">
          <div className="search">
            <span className="ico">🔍</span>
            <input className="input" placeholder="Search…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} />
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="card"><Loading /></div>
      ) : rows.length === 0 ? (
        <div className="card"><Empty title="No records yet" action={canCreate ? <button className="btn primary" onClick={openNew}>+ {config.addLabel || 'New'}</button> : null} /></div>
      ) : (
        <>
          <DataTable columns={columns} rows={rows} rowKey={idKey} actions={canWrite || canDelete ? actions : undefined} />
          <Pagination meta={meta} onPage={setPage} />
        </>
      )}

      {editing ? (
        <Modal
          title={`${editing[idKey] ? 'Edit' : 'New'} ${config.title}`}
          size={config.fields.some((f) => f.type === 'textarea' || f.type === 'json') ? 'lg' : undefined}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button className="btn primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <form onSubmit={submit}>
            {config.fields.map((f) => {
              const common = { key: f.name, label: f.label, hint: f.hint }
              if (f.type === 'textarea' || f.type === 'json') return <Textarea {...common} value={form[f.name] ?? ''} onChange={(e) => setField(f.name, e.target.value)} placeholder={f.placeholder} style={f.type === 'json' ? { fontFamily: 'monospace', minHeight: 140 } : undefined} />
              if (f.type === 'select') return <Select {...common} options={f.options || []} value={form[f.name] ?? ''} onChange={(e) => setField(f.name, e.target.value)} />
              if (f.type === 'checkbox') return <Checkbox key={f.name} label={f.label} checked={!!form[f.name]} onChange={(e) => setField(f.name, e.target.checked)} />
              return <Input {...common} type={f.type === 'number' ? 'number' : f.type === 'date' ? 'datetime-local' : 'text'} value={form[f.name] ?? ''} onChange={(e) => setField(f.name, e.target.value)} placeholder={f.placeholder} />
            })}
          </form>
        </Modal>
      ) : null}

      {deleting ? (
        <ConfirmDialog
          title="Delete record?"
          message="This action cannot be undone."
          confirmLabel="Delete"
          danger
          busy={saving}
          onConfirm={doDelete}
          onClose={() => setDeleting(null)}
        />
      ) : null}
    </div>
  )
}

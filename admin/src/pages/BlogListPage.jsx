import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, Empty, Pagination, StatusBadge, Badge, fmtDate } from '../components/ui.jsx'
import { DataTable } from '../components/DataTable.jsx'
import { ConfirmDialog } from '../components/Modal.jsx'

// `basePath` lets this same list be mounted both at /blogs (Admin → Blogs) and
// inside the Help Center page at /help/blogs — identical API, records and UI.
export function BlogListPage({ basePath = '/blogs', embedded = false }) {
  const navigate = useNavigate()
  const { can } = useAuth()
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/blogs', { params: { page, search: search || undefined, status: status || undefined } })
      setRows(res.data.data)
      setMeta(res.data.meta)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status])

  useEffect(() => { load() }, [load])

  const togglePublish = async (row) => {
    try {
      await api.patch(`/admin/blogs/${row.id}/status`, { status: row.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })
      toast.success(row.status === 'PUBLISHED' ? 'Unpublished' : 'Published')
      load()
    } catch (e) {
      toast.error(errorMessage(e))
    }
  }

  const doDelete = async () => {
    setBusy(true)
    try {
      await api.delete(`/admin/blogs/${deleting.id}`)
      toast.success('Blog deleted')
      setDeleting(null)
      load()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    { key: 'title', header: 'Title', render: (r) => <div><div className="t-title">{r.title}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>/{r.slug}</div></div> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'category', header: 'Category', render: (r) => r.category?.name || '—' },
    { key: 'featured', header: 'Featured', render: (r) => (r.featured ? <Badge tone="blue">featured</Badge> : '—') },
    { key: 'updatedAt', header: 'Updated', render: (r) => fmtDate(r.updatedAt) },
  ]

  return (
    <div>
      {embedded ? (
        can('blog:write') ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button className="btn primary" onClick={() => navigate(`${basePath}/new`)}>+ New blog</button>
          </div>
        ) : null
      ) : (
        <PageHeader
          title="Blogs"
          subtitle="Write and manage blog posts shown on the public website."
          actions={can('blog:write') ? <button className="btn primary" onClick={() => navigate(`${basePath}/new`)}>+ New blog</button> : null}
        />
      )}

      <div className="toolbar">
        <div className="search">
          <span className="ico">🔍</span>
          <input className="input" placeholder="Search blogs…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} />
        </div>
        <select className="select" style={{ width: 180 }} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }}>
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="card"><Loading /></div>
      ) : rows.length === 0 ? (
        <div className="card"><Empty title="No blogs yet" action={can('blog:write') ? <button className="btn primary" onClick={() => navigate(`${basePath}/new`)}>+ New blog</button> : null} /></div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={rows}
            actions={(r) => (
              <>
                {can('blog:write') ? <button className="icon-btn" title="Edit" onClick={() => navigate(`${basePath}/${r.id}`)}>✏️</button> : null}
                {can('blog:publish') ? <button className="icon-btn" title={r.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(r)}>{r.status === 'PUBLISHED' ? '📥' : '📤'}</button> : null}
                {can('blog:delete') ? <button className="icon-btn danger" title="Delete" onClick={() => setDeleting(r)}>🗑️</button> : null}
              </>
            )}
          />
          <Pagination meta={meta} onPage={setPage} />
        </>
      )}

      {deleting ? (
        <ConfirmDialog title="Delete blog?" message={`"${deleting.title}" will be permanently removed.`} confirmLabel="Delete" danger busy={busy} onConfirm={doDelete} onClose={() => setDeleting(null)} />
      ) : null}
    </div>
  )
}

import { useEffect, useState, useRef, useCallback } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, Empty, Pagination } from '../components/ui.jsx'
import { ConfirmDialog } from '../components/Modal.jsx'

function prettySize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function MediaPage() {
  const { can } = useAuth()
  const toast = useToast()
  const fileRef = useRef(null)
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const canWrite = can('media:write')
  const canDelete = can('media:delete')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/media', { params: { page } })
      setRows(res.data.data)
      setMeta(res.data.meta)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
  useEffect(() => { load() }, [load])

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'general')
      await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Uploaded')
      if (fileRef.current) fileRef.current.value = ''
      setPage(1)
      load()
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'))
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = (url) => {
    navigator.clipboard?.writeText(url)
    toast.info('URL copied')
  }

  const doDelete = async () => {
    try {
      await api.delete(`/admin/media/${deleting.id}`)
      toast.success('Deleted')
      setDeleting(null)
      load()
    } catch (e) {
      toast.error(errorMessage(e))
    }
  }

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="Upload and manage images used across the website."
        actions={canWrite ? (
          <>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onUpload} />
            <button className="btn primary" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? 'Uploading…' : '⬆ Upload image'}</button>
          </>
        ) : null}
      />

      {loading ? (
        <div className="card"><Loading /></div>
      ) : rows.length === 0 ? (
        <div className="card"><Empty title="No media yet" hint="Upload your first image." /></div>
      ) : (
        <>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {rows.map((m) => (
              <div key={m.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ height: 130, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                  <img src={m.url} alt={m.alt || m.originalName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                </div>
                <div style={{ padding: 10 }}>
                  <div className="t-title" style={{ fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.originalName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', margin: '2px 0 8px' }}>{prettySize(m.size)}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn ghost sm" style={{ flex: 1 }} onClick={() => copyUrl(m.url)}>Copy URL</button>
                    {canDelete ? <button className="icon-btn danger" onClick={() => setDeleting(m)}>🗑️</button> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination meta={meta} onPage={setPage} />
        </>
      )}

      {deleting ? <ConfirmDialog title="Delete image?" message={`"${deleting.originalName}" will be removed.`} confirmLabel="Delete" danger onConfirm={doDelete} onClose={() => setDeleting(null)} /> : null}
    </div>
  )
}

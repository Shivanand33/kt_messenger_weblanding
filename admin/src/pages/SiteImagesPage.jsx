import React, { useEffect, useMemo, useRef, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'http://localhost:5174').replace(/\/+$/, '')

/**
 * Site Images.
 *
 * Every image bundled into the website is listed by its original filename.
 * Leaving a row unchanged keeps the built-in image; entering a URL replaces it
 * everywhere that image appears, with no code change and no redeploy.
 *
 * Only the replacement is editable — the filename on the left is the key the
 * website looks up, exactly like the Page Text editor.
 */
export function SiteImagesPage() {
  const toast = useToast()
  const [block, setBlock] = useState(null)
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .get('/admin/website-content', { params: { pageSize: 200 } })
      .then((res) => {
        const all = res.data.data?.items || res.data.data || []
        const b = all.find((r) => r.key === 'images.site')
        setBlock(b || null)
        const data = b?.data && typeof b.data === 'object' ? b.data : {}
        setRows(Object.entries(data).map(([file, value]) => ({ file, value: String(value ?? '') })))
      })
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => r.file.toLowerCase().includes(q) || r.value.toLowerCase().includes(q))
  }, [rows, search])

  const replacedCount = rows.filter((r) => r.value && r.value !== r.file).length

  const setValue = (file, value) => setRows((list) => list.map((r) => (r.file === file ? { ...r, value } : r)))
  const reset = (file) => setValue(file, file)

  // One hidden <input type="file"> per row, so "Upload" can target that row.
  const fileInputs = useRef({})
  const [uploadingFile, setUploadingFile] = useState(null)

  /**
   * Upload a picture from the computer and use its stored URL as the
   * replacement. Same media API the blog editor uses, so the file lands in the
   * shared Media library and is served from the same place.
   *
   * The value is only set after a successful upload — a failed upload leaves
   * the current replacement exactly as it was.
   */
  const uploadFor = async (file, e) => {
    const picked = e.target.files?.[0]
    e.target.value = '' // let the same file be picked again
    if (!picked) return
    setUploadingFile(file)
    try {
      const fd = new FormData()
      fd.append('file', picked)
      fd.append('folder', 'site-images')
      const res = await api.post('/admin/media', fd)
      const url = res.data?.data?.url
      if (!url) throw new Error('Upload returned no URL')
      setValue(file, url)
      toast.success('Uploaded — press Save changes to apply it')
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'))
    } finally {
      setUploadingFile(null)
    }
  }

  const save = async () => {
    if (!block) return
    setSaving(true)
    try {
      // Rebuild from the original filenames so a key can never be altered.
      const data = {}
      for (const r of rows) data[r.file] = r.value.trim() === '' ? r.file : r.value.trim()
      await api.put(`/admin/website-content/${block.id}`, {
        key: block.key,
        page: block.page,
        label: block.label,
        data,
      })
      setBlock((b) => ({ ...b, data }))
      toast.success('Saved — reload the website to see the change')
    } catch (e) {
      toast.error(errorMessage(e, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading site images..." />

  if (!block) {
    return (
      <div>
        <PageHeader title="Site Images" subtitle="Replace any image on the website." />
        <div className="card card-pad">
          <div className="empty" style={{ padding: 32, textAlign: 'center' }}>
            <Icon name="inbox" size={24} color="var(--muted)" />
            <div style={{ marginTop: 8, color: 'var(--muted)' }}>
              No image registry found. Run <code>node scripts/import-site-images.mjs --apply</code> in the backend.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Site Images"
        subtitle="Upload a file or paste a URL to replace an image everywhere it appears. Leave it unchanged to keep the built-in one."
        actions={
          <button className="btn primary" onClick={save} disabled={saving}>
            <Icon name="check" size={16} />
            <span>{saving ? 'Saving…' : 'Save changes'}</span>
          </button>
        }
      />

      <div className="card">
        <div
          className="card-pad"
          style={{ display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid var(--line)' }}
        >
          <input
            className="input"
            placeholder="Search images…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} shown · {replacedCount} replaced
          </span>
        </div>

        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 90 }}>Preview</th>
              <th style={{ width: '26%' }}>Image</th>
              <th>Replacement (upload a file or paste a URL)</th>
              <th style={{ width: 70 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const replaced = r.value && r.value !== r.file
              // Unreplaced images live in the website bundle, not the admin, so
              // preview those from the site's dev/public origin.
              const previewSrc = replaced ? r.value : `${SITE_URL}/src/assets/images/${r.file}`
              return (
                <tr key={r.file}>
                  <td>
                    <div
                      style={{
                        width: 64,
                        height: 44,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--line)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <img
                        src={previewSrc}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>
                    {r.file}
                    {replaced && (
                      <div style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600, marginTop: 2 }}>replaced</div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        className="input"
                        value={r.value}
                        onChange={(e) => setValue(r.file, e.target.value)}
                        placeholder="Paste a URL, or upload a file →"
                        style={{ flex: 1, minWidth: 0, borderColor: replaced ? 'var(--brand)' : undefined }}
                      />
                      <input
                        ref={(el) => {
                          fileInputs.current[r.file] = el
                        }}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => uploadFor(r.file, e)}
                      />
                      <button
                        type="button"
                        className="btn ghost sm"
                        style={{ whiteSpace: 'nowrap' }}
                        disabled={uploadingFile === r.file}
                        onClick={() => fileInputs.current[r.file]?.click()}
                        title="Upload an image from this computer"
                      >
                        {uploadingFile === r.file ? 'Uploading…' : '⬆ Upload'}
                      </button>
                    </div>
                  </td>
                  <td>
                    {replaced && (
                      <button className="btn ghost sm" onClick={() => reset(r.file)} title="Use the built-in image">
                        Reset
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty" style={{ padding: 28, color: 'var(--muted)' }}>No images match that search.</div>
        )}
      </div>
    </div>
  )
}

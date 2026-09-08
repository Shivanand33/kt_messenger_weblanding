import { useEffect, useRef, useState, useCallback } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'

// The homepage hero background lives in the "home.hero" website-content block
// as { backgroundUrl }. This page lets an admin upload/replace that image
// (stored via the Media library on R2) without touching raw JSON. The public
// site reads the same block and falls back to its bundled image when unset.

const KEY = 'home.hero'
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')
const resolveUrl = (u) => (!u ? '' : /^https?:\/\//i.test(u) ? u : `${API_ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`)

export function HeroSettingsPage() {
  const { can } = useAuth()
  const toast = useToast()
  const fileRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [block, setBlock] = useState(null) // existing content-block row, or null
  const [bgUrl, setBgUrl] = useState('') // current (possibly unsaved) URL
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const canWrite = can('website_content:write')
  const canUpload = can('media:write')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/website-content', { params: { search: KEY, pageSize: 50 } })
      const row = (res.data.data || []).find((r) => r.key === KEY) || null
      setBlock(row)
      setBgUrl(row?.data?.backgroundUrl || '')
      setDirty(false)
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to load hero settings'))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { load() }, [load])

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'hero')
      const res = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setBgUrl(res.data.data.url)
      setDirty(true)
      toast.success('Image uploaded — click Save to apply it')
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const data = { ...(block?.data || {}) }
      if (bgUrl.trim()) data.backgroundUrl = bgUrl.trim()
      else delete data.backgroundUrl
      if (block?.id) {
        const res = await api.put(`/admin/website-content/${block.id}`, { data })
        setBlock(res.data.data)
      } else {
        const res = await api.post('/admin/website-content', { key: KEY, page: 'home', label: 'Homepage hero', data })
        setBlock(res.data.data)
      }
      setDirty(false)
      toast.success('Homepage hero updated')
    } catch (err) {
      toast.error(errorMessage(err, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  const useDefault = () => {
    setBgUrl('')
    setDirty(true)
  }

  const preview = resolveUrl(bgUrl)

  if (loading) return <div className="card"><Loading /></div>

  return (
    <div>
      <PageHeader
        title="Homepage Hero"
        subtitle="Change the large background image behind the “Stay close, stay private.” headline on the homepage."
      />

      <div className="card" style={{ padding: 20, maxWidth: 760 }}>
        {/* Live preview */}
        <div
          style={{
            position: 'relative',
            height: 260,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--surface-2)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Hero background preview"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              No custom image set — the website is using its built-in default hero image.
            </span>
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.15))',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', color: '#fff', fontWeight: 800, fontSize: 26, lineHeight: 1, justifySelf: 'start', paddingLeft: 24 }}>
            Stay close,<br />stay private.
          </div>
        </div>

        {/* Controls */}
        <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Image URL
            </label>
            <input
              className="input"
              placeholder="https://…  (or upload below)"
              value={bgUrl}
              onChange={(e) => { setBgUrl(e.target.value); setDirty(true) }}
              disabled={!canWrite}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>
              Paste an image URL, or upload a new image to the Media library.
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            {canUpload ? (
              <>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onUpload} />
                <button className="btn ghost" onClick={() => fileRef.current?.click()} disabled={uploading || saving}>
                  {uploading ? 'Uploading…' : '⬆ Upload image'}
                </button>
              </>
            ) : null}
            {bgUrl ? (
              <button className="btn ghost" onClick={useDefault} disabled={!canWrite || saving}>
                Use default image
              </button>
            ) : null}
            <div style={{ flex: 1 }} />
            <button className="btn primary" onClick={save} disabled={!canWrite || saving || uploading || !dirty}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>

          {!canWrite ? (
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
              You have read-only access to website content. Ask a super admin for the “website_content:write” permission to edit this.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

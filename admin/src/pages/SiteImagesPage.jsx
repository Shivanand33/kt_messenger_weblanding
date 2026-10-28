import React, { useEffect, useMemo, useRef, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'
import { mediaUrl } from '../utils/mediaUrl.js'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'http://localhost:5174').replace(/\/+$/, '')

const DEFAULT_R2_HOST = 'pub-45b6365542624750bb6c3a89c2159a2a.r2.dev'

/**
 * Format any leftover raw R2 URLs for clean display in the admin UI.
 */
function formatDisplayUrl(url) {
  if (!url || typeof url !== 'string') return ''
  return url.replace(/https?:\/\/pub-[a-zA-Z0-9_-]+\.r2\.dev\//gi, 'http://localhost:4000/uploads/').replace(/pub-[a-zA-Z0-9_-]+\.r2\.dev/gi, 'pub.r2.dev')
}

/**
 * Expand clean display URLs back if needed.
 */
function resolveFullUrl(inputVal, originalRealUrl) {
  if (!inputVal) return ''
  if (inputVal.includes('pub.r2.dev')) {
    const match = originalRealUrl?.match(/(pub-[a-zA-Z0-9_-]+\.r2\.dev)/i)
    const host = match ? match[1] : DEFAULT_R2_HOST
    return inputVal.replace(/pub\.r2\.dev/gi, host)
  }
  return inputVal
}

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
  const [altBlock, setAltBlock] = useState(null)
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // Where the website serves each bundled image from, so the "before" preview
  // works off a real built URL instead of a dev-server source path.
  const [manifest, setManifest] = useState({ siteUrl: '', images: {} })

  useEffect(() => {
    api
      .get('/admin/website-content', { params: { pageSize: 200 } })
      .then((res) => {
        const all = res.data.data?.items || res.data.data || []
        const b = all.find((r) => r.key === 'images.site')
        const ab = all.find((r) => r.key === 'images.alt')
        setBlock(b || null)
        setAltBlock(ab || null)
        const data = b?.data && typeof b.data === 'object' ? b.data : {}
        const altData = ab?.data && typeof ab.data === 'object' ? ab.data : {}
        setRows(
          Object.entries(data).map(([file, value]) => ({
            file,
            value: typeof value === 'object' ? String(value?.url || file) : String(value ?? ''),
            alt: typeof value === 'object' ? String(value?.alt || value?.altText || '') : String(altData[file] || '')
          }))
        )
      })
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))

    // Best effort: without it the previews fall back to the dev-server paths,
    // which is what they used before this existed. Never surfaced as an error.
    api
      .get('/admin/site-images/manifest')
      .then((res) => setManifest(res.data.data || { siteUrl: '', images: {} }))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * The image a row shows today.
   *
   * Replaced → the override, re-pointed at the API because `/uploads/` is
   * served there and nowhere else. Unchanged → the file the website actually
   * ships, from the build manifest; and when there is no manifest (dev, or a
   * site deployed before it existed) the Vite source path, which the dev
   * server does serve.
   */
  const previewFor = (row) => {
    const replaced = row.value && row.value !== row.file
    if (replaced) return mediaUrl(resolveFullUrl(row.value, row.value))
    const built = manifest.images?.[row.file]
    if (built && manifest.siteUrl) return `${manifest.siteUrl}${built}`
    return `${SITE_URL}/src/assets/images/${row.file}`
  }

  // Only trustworthy once the manifest has actually arrived; an empty one
  // means the website has not published it yet, not that nothing is used.
  const manifestLoaded = Object.keys(manifest.images || {}).length > 0
  /**
   * A registry row whose file the website no longer ships.
   *
   * Replacing one of these changes nothing, because no component imports it
   * any more — worth saying out loud, since an override that silently does
   * nothing is exactly what looks like a bug.
   */
  const unusedOnSite = (file) => manifestLoaded && !manifest.images[file]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => r.file.toLowerCase().includes(q) || r.value.toLowerCase().includes(q) || (r.alt || '').toLowerCase().includes(q))
  }, [rows, search])

  const replacedCount = rows.filter((r) => r.value && r.value !== r.file).length

  const setValue = (file, value) => setRows((list) => list.map((r) => (r.file === file ? { ...r, value } : r)))
  const setAltValue = (file, alt) => setRows((list) => list.map((r) => (r.file === file ? { ...r, alt } : r)))
  const reset = (file) => setRows((list) => list.map((r) => (r.file === file ? { ...r, value: file, alt: '' } : r)))

  // One hidden <input type="file"> per row, so "Upload" can target that row.
  const fileInputs = useRef({})
  const [uploadingFile, setUploadingFile] = useState(null)

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
      const altData = {}
      for (const r of rows) {
        data[r.file] = r.value.trim() === '' ? r.file : r.value.trim()
        if (r.alt && r.alt.trim()) {
          altData[r.file] = r.alt.trim()
        }
      }

      await api.put(`/admin/website-content/${block.id}`, {
        key: block.key,
        page: block.page,
        label: block.label,
        data,
      })
      setBlock((b) => ({ ...b, data }))

      if (altBlock?.id) {
        const res = await api.put(`/admin/website-content/${altBlock.id}`, {
          key: 'images.alt',
          page: 'text',
          label: 'Image Alt Texts',
          data: altData,
        })
        setAltBlock(res.data?.data || altBlock)
      } else {
        const res = await api.post('/admin/website-content', {
          key: 'images.alt',
          page: 'text',
          label: 'Image Alt Texts',
          data: altData,
        })
        setAltBlock(res.data?.data || null)
      }

      toast.success('Saved — reload the website to see the changes')
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
        subtitle="Upload a file or paste a URL to replace an image everywhere it appears. Manage ALT Text for SEO & Accessibility."
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
            placeholder="Search images or alt text…"
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
              <th style={{ width: 80 }}>Preview</th>
              <th style={{ width: '22%' }}>Image</th>
              <th style={{ width: '38%' }}>Replacement (upload a file or paste a URL)</th>
              <th style={{ width: '30%' }}>ALT Text (SEO Keyword)</th>
              <th style={{ width: 60 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const replaced = r.value && r.value !== r.file
              const previewSrc = previewFor(r)
              return (
                <tr key={r.file}>
                  <td>
                    <div
                      style={{
                        width: 60,
                        height: 40,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--line)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <img
                        // Remount on a new source: onError hides this node, and
                        // without a fresh element a later URL — one the admin
                        // just pasted, or the manifest arriving — would load
                        // into a box that is still display:none.
                        key={previewSrc}
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
                    {unusedOnSite(r.file) && (
                      <div
                        title="The website no longer ships this file, so a replacement here has nothing to replace."
                        style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginTop: 2 }}
                      >
                        not used on the site
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        className="input"
                        value={formatDisplayUrl(r.value)}
                        onChange={(e) => setValue(r.file, resolveFullUrl(e.target.value, r.value))}
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
                    <input
                      className="input"
                      value={r.alt || ''}
                      onChange={(e) => setAltValue(r.file, e.target.value)}
                      placeholder="e.g. instant messaging app"
                      style={{ width: '100%' }}
                    />
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

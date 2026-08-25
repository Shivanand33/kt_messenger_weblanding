import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Input, Textarea, Select, Checkbox } from '../components/Field.jsx'

const EMPTY = { title: '', slug: '', excerpt: '', body: '', coverUrl: '', authorName: 'KT Messenger Team', categoryId: '', status: 'DRAFT', featured: false, seoTitle: '', seoDescription: '', ogImage: '' }

// `basePath` / `returnTo` let this same form be reached from /blogs (Admin →
// Blogs) and from /help/blogs/:id (Help Center → Blogs) — one form, one API.
export function BlogFormPage({ basePath = '/blogs', returnTo } = {}) {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const back = returnTo || basePath
  const toast = useToast()
  const [form, setForm] = useState(EMPTY)
  const [tagIds, setTagIds] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Direct file upload for image fields — sends the file to the media API
  // (which stores it locally or on R2) and fills the field with the returned URL.
  const coverFileRef = useRef(null)
  const ogFileRef = useRef(null)
  const [uploadingField, setUploadingField] = useState(null)
  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')
  const resolveMediaUrl = (u) =>
    !u ? '' : /^https?:\/\//i.test(u) ? u : `${apiOrigin}${u.startsWith('/') ? '' : '/'}${u}`

  const uploadImage = async (fieldKey, e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!file) return
    setUploadingField(fieldKey)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'blog')
      const res = await api.post('/admin/media', fd)
      set(fieldKey, res.data.data.url)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'))
    } finally {
      setUploadingField(null)
    }
  }

  useEffect(() => {
    Promise.all([
      api.get('/admin/blog-categories', { params: { pageSize: 100 } }),
      api.get('/admin/blog-tags', { params: { pageSize: 100 } }),
    ]).then(([c, t]) => { setCategories(c.data.data); setTags(t.data.data) }).catch(() => {})

    if (!isNew) {
      api.get(`/admin/blogs/${id}`).then((res) => {
        const b = res.data.data
        setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt || '', body: b.body || '', coverUrl: b.coverUrl || '', authorName: b.authorName || '', categoryId: b.categoryId || '', status: b.status, featured: b.featured, seoTitle: b.seoTitle || '', seoDescription: b.seoDescription || '', ogImage: b.ogImage || '' })
        setTagIds((b.tags || []).map((t) => t.id))
      }).catch((e) => toast.error(errorMessage(e))).finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const save = async (publishNow) => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || null,
        tagIds,
        status: publishNow ? 'PUBLISHED' : form.status,
      }
      // strip empty optional strings
      for (const k of ['coverUrl', 'ogImage', 'seoTitle', 'seoDescription', 'excerpt', 'slug']) if (payload[k] === '') delete payload[k]
      if (isNew) await api.post('/admin/blogs', payload)
      else await api.put(`/admin/blogs/${id}`, payload)
      toast.success(isNew ? 'Blog created' : 'Blog saved')
      navigate(back)
    } catch (e) {
      toast.error(errorMessage(e, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card"><Loading /></div>

  return (
    <div>
      <PageHeader
        title={isNew ? 'New blog' : 'Edit blog'}
        subtitle="This content appears on the public /blog page."
        actions={<button className="btn ghost" onClick={() => navigate(back)}>← Back</button>}
      />
      <div className="grid" style={{ gridTemplateColumns: '1fr 320px', alignItems: 'start' }}>
        <div className="card card-pad">
          <Input label="Title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Post title" />
          <Input label="Slug" hint="Leave blank to auto-generate from the title." value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="my-post-slug" />
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary shown in the blog list" style={{ minHeight: 70 }} />
          <Textarea label="Body (HTML/Markdown)" value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Full article content" style={{ minHeight: 260 }} />
          <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '10px 0 18px' }} />
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>SEO</h3>
          <Input label="SEO title" value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
          <Textarea label="SEO description" value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} style={{ minHeight: 60 }} />
          <div className="field">
            <label>OG image</label>
            <input
              ref={ogFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage('ogImage', e)}
              style={{ display: 'none' }}
            />
            {form.ogImage ? (
              <div style={{ marginBottom: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
                <img
                  src={resolveMediaUrl(form.ogImage)}
                  alt="OG preview"
                  style={{ display: 'block', width: '100%', height: 150, objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: 8, height: 90, borderRadius: 10, border: '1px dashed var(--line)', display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 13 }}>
                No image selected
              </div>
            )}
            <button
              type="button"
              className="btn"
              onClick={() => ogFileRef.current?.click()}
              disabled={uploadingField === 'ogImage'}
              style={{ width: '100%' }}
            >
              {uploadingField === 'ogImage' ? 'Uploading…' : form.ogImage ? 'Replace image' : '⬆ Upload image from computer'}
            </button>
            <div className="hint">Upload an image from your computer.</div>
          </div>
        </div>

        <div className="card card-pad">
          <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)} options={[{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'SCHEDULED', label: 'Scheduled' }, { value: 'ARCHIVED', label: 'Archived' }]} />
          <Checkbox label="Featured article" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
          <Input label="Author" value={form.authorName} onChange={(e) => set('authorName', e.target.value)} />
          <div className="field">
            <label>Cover image</label>
            <input
              ref={coverFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage('coverUrl', e)}
              style={{ display: 'none' }}
            />
            {form.coverUrl ? (
              <div style={{ marginBottom: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
                <img
                  src={resolveMediaUrl(form.coverUrl)}
                  alt="Cover preview"
                  style={{ display: 'block', width: '100%', height: 150, objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: 8, height: 90, borderRadius: 10, border: '1px dashed var(--line)', display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 13 }}>
                No image selected
              </div>
            )}
            <button
              type="button"
              className="btn"
              onClick={() => coverFileRef.current?.click()}
              disabled={uploadingField === 'coverUrl'}
              style={{ width: '100%' }}
            >
              {uploadingField === 'coverUrl' ? 'Uploading…' : form.coverUrl ? 'Replace image' : '⬆ Upload image from computer'}
            </button>
            <div className="hint">Upload an image from your computer.</div>
          </div>
          <Select label="Category" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} options={[{ value: '', label: '— None —' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
          <div className="field">
            <label>Tags</label>
            <div className="chips">
              {tags.length === 0 ? <span style={{ color: 'var(--muted)', fontSize: 13 }}>No tags yet</span> : tags.map((t) => {
                const on = tagIds.includes(t.id)
                return (
                  <button type="button" key={t.id} className="chip" style={on ? { background: 'var(--brand-soft)', borderColor: 'var(--brand)', color: 'var(--brand-strong)' } : undefined} onClick={() => setTagIds((ids) => (on ? ids.filter((x) => x !== t.id) : [...ids, t.id]))}>
                    {on ? '✓ ' : ''}{t.name}
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <button className="btn primary" onClick={() => save(false)} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            {form.status !== 'PUBLISHED' ? <button className="btn ghost" onClick={() => save(true)} disabled={saving}>Save & publish</button> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

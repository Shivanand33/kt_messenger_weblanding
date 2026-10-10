import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Input, Textarea, Select, Checkbox } from '../components/Field.jsx'
import { RichEditor } from '../components/RichEditor.jsx'

const EMPTY = { title: '', slug: '', excerpt: '', body: '', coverUrl: '', authorName: 'KT Messenger Team', categoryId: '', status: 'DRAFT', featured: false, seoTitle: '', seoDescription: '', ogImage: '', schemaJson: '' }

// Where the public blog lives, for the URL preview. Set VITE_SITE_URL per
// environment; the default matches production.
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://ktmessenger.com').replace(/\/+$/, '')

// Mirrors slugify() in backend/src/utils/slug.js so the preview shows exactly
// what will be stored.
const slugify = (input = '') =>
  String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

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

  // Live slug availability. Advisory only — create/update re-check on write,
  // so a slug taken between this probe and the save is still caught server side.
  const [slugState, setSlugState] = useState({ status: 'idle', reason: null })

  // The slug that will actually be stored: what the admin typed, or (only for
  // a brand new post with the field left blank) one derived from the title.
  const typedSlug = slugify(form.slug)
  const effectiveSlug = typedSlug || (isNew ? slugify(form.title) : '')
  const usingFallback = !typedSlug && isNew && !!effectiveSlug

  useEffect(() => {
    if (!typedSlug) { setSlugState({ status: 'idle', reason: null }); return undefined }
    setSlugState({ status: 'checking', reason: null })
    let cancelled = false
    const timer = setTimeout(() => {
      api
        .get('/admin/blogs/slug-check', { params: { slug: typedSlug, id: isNew ? undefined : id } })
        .then((res) => {
          if (cancelled) return
          const d = res.data.data
          setSlugState({ status: d.available ? 'available' : 'taken', reason: d.reason })
        })
        .catch(() => { if (!cancelled) setSlugState({ status: 'idle', reason: null }) })
    }, 350)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [typedSlug, id, isNew])

  // Direct file upload for image fields — sends the file to the media API
  // (which stores it locally or on R2) and fills the field with the returned URL.
  const coverFileRef = useRef(null)
  const ogFileRef = useRef(null)
  const [uploadingField, setUploadingField] = useState(null)
  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')
  // /uploads/ is served by the API and nothing else. A stored URL can still
  // name the website's host — that happens when MEDIA_PUBLIC_URL points at the
  // site instead of the API — and the site answers /uploads/* with index.html,
  // so the preview shows alt text instead of the picture. Re-point anything
  // under /uploads/ at the API; R2/CDN links are left as they are.
  const resolveMediaUrl = (u) => {
    if (!u) return ''
    const uploads = String(u).match(/^(?:https?:\/\/[^/]+)?(\/uploads\/[^\s"']*)$/i)
    if (uploads) return `${apiOrigin}${uploads[1]}`
    return /^https?:\/\//i.test(u) ? u : `${apiOrigin}${u.startsWith('/') ? '' : '/'}${u}`
  }

  /**
   * Escape real control characters that are sitting inside a quoted value.
   *
   * Text pasted out of a document or a chat keeps its line breaks, and JSON
   * does not allow a raw newline inside a string — that is the "Bad control
   * character in string literal" the parser reports. Only characters inside
   * string literals are touched, so the structure itself is never rewritten.
   */
  const escapeControlChars = (src) => {
    let out = ''
    let inString = false
    let escaped = false
    for (const ch of src) {
      if (escaped) {
        out += ch
        escaped = false
      } else if (ch === '\\') {
        out += ch
        escaped = true
      } else if (ch === '"') {
        inString = !inString
        out += ch
      } else if (inString && ch < ' ') {
        out += ch === '\n' ? '\\n' : ch === '\r' ? '\\r' : ch === '\t' ? '\\t' : ' '
      } else {
        out += ch
      }
    }
    return out
  }

  /** Repair the usual paste damage, then re-indent. Leaves the text alone if it still will not parse. */
  const tidySchema = () => {
    const raw = (form.schemaJson || '').trim()
    if (!raw) return
    let text = raw
    try {
      JSON.parse(text)
    } catch {
      text = escapeControlChars(text)
    }
    try {
      set('schemaJson', JSON.stringify(JSON.parse(text), null, 2))
      toast.success('Formatted')
    } catch (err) {
      toast.error(`Still not valid JSON — ${err.message}`)
    }
  }

  // Live JSON check for the structured-data box. The backend rejects invalid
  // JSON too; this just says so before the save round trip.
  const schemaError = (() => {
    const raw = (form.schemaJson || '').trim()
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? null : 'Must be a JSON object'
    } catch (err) {
      return err.message
    }
  })()

  // Fills the box with the same Article schema the site generates, as a
  // starting point to edit rather than something to write from scratch.
  const generateSchema = () => {
    // Same slug the URL preview above shows, so the schema names the real page.
    const slug = (form.slug || effectiveSlug || 'your-post-slug').trim()
    const url = `${SITE_URL}/blog/${slug}`
    const org = { '@type': 'Organization', name: 'KT Messenger' }
    const image = form.ogImage ? resolveMediaUrl(form.ogImage) : form.coverUrl ? resolveMediaUrl(form.coverUrl) : undefined
    set(
      'schemaJson',
      JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: form.seoTitle || form.title || '',
          description: form.seoDescription || form.excerpt || undefined,
          url,
          image,
          author: org,
          publisher: org,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        },
        null,
        2,
      ),
    )
  }

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
        setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt || '', body: b.body || '', coverUrl: b.coverUrl || '', authorName: b.authorName || '', categoryId: b.categoryId || '', status: b.status, featured: b.featured, seoTitle: b.seoTitle || '', seoDescription: b.seoDescription || '', ogImage: b.ogImage || '', schemaJson: b.schemaJson || '' })
        setTagIds((b.tags || []).map((t) => t.id))
      }).catch((e) => toast.error(errorMessage(e))).finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const save = async (publishNow) => {
    // Stop an obvious duplicate before the round trip. The server re-checks,
    // so this is convenience, not the guarantee.
    if (slugState.status === 'taken') {
      toast.error(slugState.reason || 'That slug is already in use. Choose a different one.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        // Send the normalised form so what is saved matches the preview.
        slug: slugify(form.slug),
        categoryId: form.categoryId || null,
        tagIds,
        status: publishNow ? 'PUBLISHED' : form.status,
      }
      // strip empty optional strings
      for (const k of ['coverUrl', 'ogImage', 'seoTitle', 'seoDescription', 'excerpt', 'slug', 'schemaJson']) if (payload[k] === '') delete payload[k]
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
          <Input
            label="Slug"
            hint={
              isNew
                ? 'This is the blog URL. Leave blank to generate one from the title.'
                : 'This is the blog URL. Changing it changes the published link.'
            }
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            onBlur={() => form.slug && set('slug', slugify(form.slug))}
            placeholder="my-post-slug"
          />

          {/* URL preview — exactly what the post will be reachable at. */}
          <div style={{ margin: '-6px 0 16px', fontSize: 12.5, lineHeight: 1.6 }}>
            <div style={{ color: 'var(--muted)' }}>
              URL preview:{' '}
              {effectiveSlug ? (
                <code style={{ color: 'var(--ink)', fontWeight: 600, wordBreak: 'break-all' }}>
                  {SITE_URL}/blog/{effectiveSlug}
                </code>
              ) : (
                <span style={{ fontStyle: 'italic' }}>enter a slug or a title</span>
              )}
            </div>

            {usingFallback && (
              <div style={{ color: 'var(--muted)' }}>
                Auto-generated from the title. It is saved once on create and never changes on its own afterwards.
              </div>
            )}
            {typedSlug && typedSlug !== form.slug && (
              <div style={{ color: 'var(--warn)' }}>
                Will be saved as <strong>{typedSlug}</strong>
              </div>
            )}
            {slugState.status === 'checking' && <div style={{ color: 'var(--muted)' }}>Checking availability…</div>}
            {slugState.status === 'available' && <div style={{ color: 'var(--success)' }}>✓ Slug is available</div>}
            {slugState.status === 'taken' && (
              <div style={{ color: 'var(--danger)', fontWeight: 600 }}>✕ {slugState.reason || 'That slug is already in use'}</div>
            )}
          </div>
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary shown in the blog list" style={{ minHeight: 70 }} />
          <RichEditor key={id} label="Body" value={form.body} onChange={(html) => set('body', html)} />
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

          <div className="field">
            <label>Structured data (JSON-LD)</label>
            <textarea
              value={form.schemaJson}
              onChange={(e) => set('schemaJson', e.target.value)}
              placeholder={'Leave blank to use the generated Article schema'}
              spellCheck={false}
              style={{
                minHeight: 180,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12.5,
                lineHeight: 1.5,
                borderColor: schemaError ? 'var(--danger)' : undefined,
              }}
            />
            {schemaError ? (
              <div style={{ color: 'var(--danger)', marginTop: 6 }}>
                <div style={{ fontWeight: 600 }}>✕ {schemaError}</div>
                <div style={{ fontWeight: 400, marginTop: 3 }}>
                  Pasted from a document or a chat? Press <strong>Fix formatting</strong> — a line break inside a
                  quoted value has to be escaped before JSON will accept it.
                </div>
              </div>
            ) : form.schemaJson.trim() ? (
              <div style={{ color: 'var(--success)', marginTop: 6 }}>✓ Valid JSON — this replaces the generated schema</div>
            ) : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              <button type="button" className="btn" onClick={generateSchema} style={{ flex: '1 1 160px' }}>
                Generate from this post
              </button>
              {form.schemaJson ? (
                <button type="button" className="btn" onClick={tidySchema} style={{ flex: '1 1 120px' }}>
                  Fix formatting
                </button>
              ) : null}
              {form.schemaJson ? (
                <button type="button" className="btn" onClick={() => set('schemaJson', '')} style={{ flex: '1 1 90px' }}>
                  Clear
                </button>
              ) : null}
            </div>
            <div className="hint">
              Added to the article page as JSON-LD. Leave this blank and the site builds an Article schema from the
              post&apos;s own title, description, image and dates — so every post has structured data either way.
            </div>
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

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, StatusBadge, Badge } from '../components/ui.jsx'
import { Modal, ConfirmDialog } from '../components/Modal.jsx'
import { Input, Textarea, Select, Checkbox } from '../components/Field.jsx'
import { BlogListPage } from './BlogListPage.jsx'

const STATUS = [{ value: 'PUBLISHED', label: 'Published' }, { value: 'DRAFT', label: 'Draft' }, { value: 'ARCHIVED', label: 'Archived' }]

export function HelpPage() {
  const { can } = useAuth()
  const toast = useToast()
  const write = can('help:write')
  const del = can('help:delete')
  const canBlogs = can('blog:read')

  // "Blogs" tab lives inside the Help Center page but manages the SAME blog
  // records/API as Admin → Blogs (no duplicate system). Driven by ?tab=blogs so
  // the tab is restored after returning from the blog form (/help/blogs/:id).
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'blogs' && canBlogs ? 'blogs' : 'help'

  const [tree, setTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [catId, setCatId] = useState(null)
  const [subId, setSubId] = useState(null)
  const [modal, setModal] = useState(null) // { kind, mode, data }
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/help/tree')
      setTree(res.data.data)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { load() }, [load])

  const cat = tree.find((c) => c.id === catId)
  const sub = cat?.subcategories.find((s) => s.id === subId)

  const openModal = async (kind, mode, data = {}) => {
    let f = {}
    if (kind === 'category') f = { title: data.title || '', icon: data.icon || '', order: data.order ?? 0 }
    if (kind === 'subcategory') f = { title: data.title || '', order: data.order ?? 0 }
    if (kind === 'article') {
      if (mode === 'edit') {
        try { const res = await api.get(`/admin/help/articles/${data.id}`); data = res.data.data } catch { /* keep */ }
      }
      f = { title: data.title || '', body: data.body || '', status: data.status || 'PUBLISHED', popular: !!data.popular, order: data.order ?? 0, platforms: (data.platforms || []).join(', ') }
    }
    setForm(f)
    setModal({ kind, mode, data })
  }

  const save = async () => {
    setSaving(true)
    try {
      const { kind, mode, data } = modal
      if (kind === 'category') {
        const body = { title: form.title, icon: form.icon || undefined, order: Number(form.order) || 0 }
        if (mode === 'new') await api.post('/admin/help/categories', body)
        else await api.put(`/admin/help/categories/${data.id}`, body)
      } else if (kind === 'subcategory') {
        const body = { title: form.title, order: Number(form.order) || 0, categoryId: catId }
        if (mode === 'new') await api.post('/admin/help/subcategories', body)
        else await api.put(`/admin/help/subcategories/${data.id}`, body)
      } else if (kind === 'article') {
        const body = { title: form.title, body: form.body, status: form.status, popular: !!form.popular, order: Number(form.order) || 0, platforms: form.platforms ? form.platforms.split(',').map((s) => s.trim()).filter(Boolean) : [], subcategoryId: subId }
        if (mode === 'new') await api.post('/admin/help/articles', body)
        else await api.put(`/admin/help/articles/${data.id}`, body)
      }
      toast.success('Saved')
      setModal(null)
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
      const { kind, id } = confirm
      const path = { category: 'categories', subcategory: 'subcategories', article: 'articles' }[kind]
      await api.delete(`/admin/help/${path}/${id}`)
      toast.success('Deleted')
      setConfirm(null)
      if (kind === 'category' && id === catId) { setCatId(null); setSubId(null) }
      if (kind === 'subcategory' && id === subId) setSubId(null)
      load()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const Col = ({ heading, addLabel, onAdd, children }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 420 }}>
      <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
        <strong style={{ color: 'var(--ink)' }}>{heading}</strong>
        {write && onAdd ? <button className="btn primary sm" onClick={onAdd}>+ {addLabel}</button> : null}
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
    </div>
  )

  const Row = ({ active, onClick, label, meta, onEdit, onDelete }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--line)', cursor: onClick ? 'pointer' : 'default', background: active ? 'var(--brand-soft)' : undefined }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-title" style={{ fontSize: 13.5 }}>{label}</div>
        {meta ? <div style={{ fontSize: 12, color: 'var(--muted)' }}>{meta}</div> : null}
      </div>
      {write && onEdit ? <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onEdit() }}>✏️</button> : null}
      {del && onDelete ? <button className="icon-btn danger" onClick={(e) => { e.stopPropagation(); onDelete() }}>🗑️</button> : null}
    </div>
  )

  const TabButton = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setSearchParams(id === 'blogs' ? { tab: 'blogs' } : {})}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '10px 2px', marginRight: 22,
        fontSize: 14, fontWeight: 600,
        color: tab === id ? 'var(--brand-strong)' : 'var(--muted)',
        borderBottom: tab === id ? '2px solid var(--brand-strong)' : '2px solid transparent',
      }}
    >
      {label}
    </button>
  )

  return (
    <div>
      <PageHeader title="Help Center" subtitle="Manage help content and blog posts for the public website." />

      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--line)', marginBottom: 18 }}>
        <TabButton id="help" label="Help Content" />
        {canBlogs ? <TabButton id="blogs" label="Blogs" /> : null}
      </div>

      {tab === 'blogs' ? (
        <BlogListPage basePath="/help/blogs" embedded />
      ) : loading ? (
        <div className="card"><Loading /></div>
      ) : (
      <>
      <div className="grid cols-3">
        <Col heading="Categories" addLabel="Category" onAdd={() => openModal('category', 'new')}>
          {tree.map((c) => (
            <Row key={c.id} active={c.id === catId} onClick={() => { setCatId(c.id); setSubId(null) }} label={c.title} meta={`${c.subcategories.length} subcategories`} onEdit={() => openModal('category', 'edit', c)} onDelete={() => setConfirm({ kind: 'category', id: c.id })} />
          ))}
        </Col>

        <Col heading={cat ? `${cat.title} · Subcategories` : 'Subcategories'} addLabel="Subcategory" onAdd={cat ? () => openModal('subcategory', 'new') : null}>
          {!cat ? <div className="empty" style={{ padding: 30 }}>Select a category</div> : cat.subcategories.map((s) => (
            <Row key={s.id} active={s.id === subId} onClick={() => setSubId(s.id)} label={s.title} meta={`${s.articles.length} articles`} onEdit={() => openModal('subcategory', 'edit', s)} onDelete={() => setConfirm({ kind: 'subcategory', id: s.id })} />
          ))}
        </Col>

        <Col heading={sub ? `${sub.title} · Articles` : 'Articles'} addLabel="Article" onAdd={sub ? () => openModal('article', 'new') : null}>
          {!sub ? <div className="empty" style={{ padding: 30 }}>Select a subcategory</div> : sub.articles.map((a) => (
            <Row key={a.id} label={<span>{a.title} {a.popular ? <Badge tone="blue">popular</Badge> : null}</span>} meta={<StatusBadge status={a.status} />} onEdit={() => openModal('article', 'edit', a)} onDelete={() => setConfirm({ kind: 'article', id: a.id })} />
          ))}
        </Col>
      </div>

      {modal ? (
        <Modal
          title={`${modal.mode === 'new' ? 'New' : 'Edit'} ${modal.kind}`}
          size={modal.kind === 'article' ? 'lg' : undefined}
          onClose={() => setModal(null)}
          footer={<><button className="btn ghost" onClick={() => setModal(null)} disabled={saving}>Cancel</button><button className="btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}
        >
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          {modal.kind === 'category' ? <Input label="Icon" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} /> : null}
          {modal.kind === 'article' ? (
            <>
              <Textarea label="Body (HTML)" value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} style={{ minHeight: 180 }} />
              <div className="form-row">
                <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} options={STATUS} />
                <Input label="Platforms" hint="Comma-separated" value={form.platforms} onChange={(e) => setForm((f) => ({ ...f, platforms: e.target.value }))} />
              </div>
              <Checkbox label="Popular article" checked={form.popular} onChange={(e) => setForm((f) => ({ ...f, popular: e.target.checked }))} />
            </>
          ) : null}
          <Input label="Order" type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} />
        </Modal>
      ) : null}

      {confirm ? <ConfirmDialog title={`Delete ${confirm.kind}?`} message="This also removes everything nested under it." confirmLabel="Delete" danger busy={saving} onConfirm={doDelete} onClose={() => setConfirm(null)} /> : null}
      </>
      )}
    </div>
  )
}

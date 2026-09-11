import React, { useEffect, useMemo, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'

/**
 * Page Text editor.
 *
 * The `text.*` content blocks hold every visible string on a page as a
 * { "original english": "what the site shows" } map. Editing that as raw JSON
 * is a trap: both sides start out identical, so it is easy to change the left
 * (the lookup key) instead of the right (the replacement). The site matches on
 * the key, so a key edit saves cleanly in admin and changes nothing on the
 * website — with no error to explain why.
 *
 * This editor removes the trap: the original is read-only, only the
 * replacement is editable, and the JSON is assembled on save.
 */
export function PageTextPage() {
  const toast = useToast()
  const [blocks, setBlocks] = useState([])
  const [activeKey, setActiveKey] = useState(null)
  const [entries, setEntries] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .get('/admin/website-content', { params: { pageSize: 200 } })
      .then((res) => {
        const rows = res.data.data?.items || res.data.data || []
        const textBlocks = rows.filter((r) => String(r.key || '').startsWith('text.'))
        setBlocks(textBlocks)
        if (textBlocks.length) setActiveKey(textBlocks[0].key)
      })
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const active = useMemo(() => blocks.find((b) => b.key === activeKey), [blocks, activeKey])

  useEffect(() => {
    if (!active) { setEntries([]); return }
    const data = active.data && typeof active.data === 'object' ? active.data : {}
    setEntries(Object.entries(data).map(([original, value]) => ({ original, value: String(value ?? '') })))
    setSearch('')
  }, [active])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => e.original.toLowerCase().includes(q) || e.value.toLowerCase().includes(q))
  }, [entries, search])

  const changedCount = entries.filter((e) => e.value !== e.original).length

  const setValue = (original, value) =>
    setEntries((list) => list.map((e) => (e.original === original ? { ...e, value } : e)))

  const save = async () => {
    if (!active) return
    setSaving(true)
    try {
      // Rebuild the map from the ORIGINAL keys, so a key can never be altered.
      const data = {}
      for (const e of entries) data[e.original] = e.value === '' ? e.original : e.value
      await api.put(`/admin/website-content/${active.id}`, {
        key: active.key,
        page: active.page,
        label: active.label,
        data,
      })
      setBlocks((list) => list.map((b) => (b.id === active.id ? { ...b, data } : b)))
      toast.success('Saved — reload the website to see the change')
    } catch (e) {
      toast.error(errorMessage(e, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading page text..." />

  return (
    <div>
      <PageHeader
        title="Page Text"
        subtitle="Every visible string on the website. Edit the right-hand column; the left is the original the site looks up."
        actions={
          <button className="btn primary" onClick={save} disabled={saving || !active}>
            <Icon name="check" size={16} />
            <span>{saving ? 'Saving…' : 'Save changes'}</span>
          </button>
        }
      />

      {blocks.length === 0 ? (
        <div className="card card-pad">
          <div className="empty" style={{ padding: 32 }}>
            <Icon name="inbox" size={24} color="var(--muted)" />
            <div style={{ marginTop: 8, color: 'var(--muted)' }}>
              No page text blocks found. Run <code>node scripts/import-page-text.mjs --apply</code> in the backend.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '220px 1fr', alignItems: 'start', gap: 18 }}>
          {/* page picker */}
          <div className="card" style={{ padding: 8 }}>
            {blocks.map((b) => {
              const page = b.key.replace(/^text\./, '')
              const count = b.data && typeof b.data === 'object' ? Object.keys(b.data).length : 0
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setActiveKey(b.key)}
                  className={`account-item ${b.key === activeKey ? 'active' : ''}`}
                  style={{
                    justifyContent: 'space-between',
                    background: b.key === activeKey ? 'var(--brand-soft)' : undefined,
                    color: b.key === activeKey ? 'var(--brand)' : undefined,
                    textTransform: 'capitalize',
                  }}
                >
                  <span>{page}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* entries */}
          <div className="card">
            <div
              className="card-pad"
              style={{ display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid var(--line)' }}
            >
              <input
                className="input"
                placeholder="Search this page's text…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {filtered.length} shown · {changedCount} edited
              </span>
            </div>

            <div style={{ maxHeight: '62vh', overflowY: 'auto' }}>
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Original (what the site looks up)</th>
                    <th>Website shows</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => {
                    const edited = e.value !== e.original
                    return (
                      <tr key={e.original}>
                        <td style={{ color: 'var(--muted)', fontSize: 13, verticalAlign: 'top', paddingTop: 14 }}>
                          {e.original}
                        </td>
                        <td>
                          <textarea
                            className="textarea"
                            value={e.value}
                            onChange={(ev) => setValue(e.original, ev.target.value)}
                            rows={Math.min(4, Math.ceil(e.value.length / 70) || 1)}
                            style={{
                              width: '100%',
                              minHeight: 38,
                              borderColor: edited ? 'var(--brand)' : undefined,
                            }}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="empty" style={{ padding: 28, color: 'var(--muted)' }}>No text matches that search.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

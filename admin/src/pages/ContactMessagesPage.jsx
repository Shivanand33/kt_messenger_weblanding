import { useEffect, useState, useCallback } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, Empty, Pagination, StatusBadge, Badge, fmtDate } from '../components/ui.jsx'
import { DataTable } from '../components/DataTable.jsx'
import { Modal, ConfirmDialog } from '../components/Modal.jsx'
import { Input, Textarea, Select } from '../components/Field.jsx'

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'SPAM', label: 'Spam' },
]

export function ContactMessagesPage() {
  const { can } = useAuth()
  const toast = useToast()
  const canWrite = can('contact:write')
  const canDelete = can('contact:delete')

  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState(null)   // read the full message
  const [replying, setReplying] = useState(null) // { record }
  const [editing, setEditing] = useState(null)   // change status
  const [status, setStatus] = useState('NEW')
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState(null)
  // Official sender address (from the saved email settings) so the Gmail
  // compose window opens under support@kalamtime.com, not a personal account.
  const [senderAddress, setSenderAddress] = useState('')

  useEffect(() => {
    api.get('/admin/settings/email')
      .then((r) => {
        const d = r.data.data
        setSenderAddress((d.from || '').match(/<([^>]+)>/)?.[1] || d.user || '')
      })
      .catch(() => {})
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/contact', { params: { page, pageSize: 10, search: search || undefined } })
      setRows(res.data.data)
      setMeta(res.data.meta)
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to load'))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search])

  useEffect(() => { load() }, [load])

  const openReply = (row) => {
    setReplySubject(`Re: ${row.subject || 'Your message to KT Messenger'}`)
    setReplyBody('')
    setReplying(row)
  }

  const sendReply = async () => {
    if (!replyBody.trim()) { toast.error('Reply cannot be empty'); return }
    setBusy(true)
    try {
      const res = await api.post(`/admin/contact/${replying.id}/reply`, { subject: replySubject, body: replyBody })
      const d = res.data.data
      // Be honest about delivery: the "log" provider does not actually send.
      if (d.delivered) toast.success(`Reply sent to ${d.to}`)
      else toast.info(`Reply saved and printed to the server log (email provider is "${d.provider}" — configure SMTP to deliver).`)
      setReplying(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err, 'Could not send reply'))
    } finally {
      setBusy(false)
    }
  }

  // No SMTP configured? Send it yourself: opens Gmail's compose window with the
  // reply pre-filled, and records the reply against the message.
  const openInGmail = async () => {
    if (!replyBody.trim()) { toast.error('Reply cannot be empty'); return }
    const quoted = `${replyBody}\n\n---\nYour original message:\n${replying.message}\n\n— KT Messenger Support`
    // Force the official support mailbox when several Google accounts are
    // signed in, so the reply goes out from support@kalamtime.com.
    const sender = (senderAddress || '').trim()
    const url =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      (sender ? `&authuser=${encodeURIComponent(sender)}` : '') +
      `&to=${encodeURIComponent(replying.email)}` +
      `&su=${encodeURIComponent(replySubject)}` +
      `&body=${encodeURIComponent(quoted)}`
    window.open(url, '_blank', 'noopener')

    setBusy(true)
    try {
      await api.post(`/admin/contact/${replying.id}/reply`, { subject: replySubject, body: replyBody, deliver: false })
      toast.success('Gmail opened — press Send there. Reply recorded against this message.')
      setReplying(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err, 'Could not record the reply'))
    } finally {
      setBusy(false)
    }
  }

  const saveStatus = async () => {
    setBusy(true)
    try {
      await api.patch(`/admin/contact/${editing.id}`, { status })
      toast.success('Status updated')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err, 'Save failed'))
    } finally {
      setBusy(false)
    }
  }

  const doDelete = async () => {
    setBusy(true)
    try {
      await api.delete(`/admin/contact/${deleting.id}`)
      toast.success('Deleted')
      setDeleting(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err, 'Delete failed'))
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'From',
      render: (r) => (
        <div>
          <div className="t-title">{r.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.email}</div>
        </div>
      ),
    },
    { key: 'subject', header: 'Subject', render: (r) => r.subject || '—' },
    {
      key: 'message',
      header: 'Message',
      render: (r) => (
        <span style={{ color: 'var(--muted)' }}>
          {(r.message || '').slice(0, 60)}
          {(r.message || '').length > 60 ? '…' : ''}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <StatusBadge status={r.status} />
          {r.repliedAt ? <Badge tone="green">replied</Badge> : null}
        </span>
      ),
    },
    { key: 'createdAt', header: 'When', render: (r) => fmtDate(r.createdAt) },
  ]

  const actions = (r) => (
    <>
      <button className="icon-btn" title="View message" onClick={() => setViewing(r)}>👁️</button>
      {canWrite ? <button className="icon-btn" title="Reply to sender" onClick={() => openReply(r)}>✉️</button> : null}
      {canWrite ? <button className="icon-btn" title="Change status" onClick={() => { setStatus(r.status); setEditing(r) }}>✏️</button> : null}
      {canDelete ? <button className="icon-btn danger" title="Delete" onClick={() => setDeleting(r)}>🗑️</button> : null}
    </>
  )

  return (
    <div>
      <PageHeader title="Contact Messages" subtitle="Messages submitted through the website contact form — read and reply to the sender." />

      <div className="toolbar">
        <div className="search">
          <span className="ico">🔍</span>
          <input className="input" placeholder="Search by name, email or subject…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} />
        </div>
      </div>

      {loading ? (
        <div className="card"><Loading /></div>
      ) : rows.length === 0 ? (
        <div className="card"><Empty title="No messages yet" /></div>
      ) : (
        <>
          <DataTable columns={columns} rows={rows} actions={actions} />
          <Pagination meta={meta} onPage={setPage} />
        </>
      )}

      {/* View the full message */}
      {viewing ? (
        <Modal
          title="Message"
          onClose={() => setViewing(null)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setViewing(null)}>Close</button>
              {canWrite ? <button className="btn primary" onClick={() => { const r = viewing; setViewing(null); openReply(r) }}>✉️ Reply</button> : null}
            </>
          }
        >
          <div className="field">
            <label>From</label>
            <div>{viewing.name} · <a href={`mailto:${viewing.email}`}>{viewing.email}</a></div>
          </div>
          <div className="field">
            <label>Subject</label>
            <div>{viewing.subject || '—'}</div>
          </div>
          <div className="field">
            <label>Message</label>
            <div style={{ whiteSpace: 'pre-wrap' }}>{viewing.message}</div>
          </div>
          <div className="field">
            <label>Received</label>
            <div>{fmtDate(viewing.createdAt)}{viewing.sourcePage ? ` · from ${viewing.sourcePage}` : ''}</div>
          </div>
          {viewing.repliedAt ? (
            <div className="field">
              <label>Your reply · {fmtDate(viewing.repliedAt)}{viewing.repliedBy?.name ? ` by ${viewing.repliedBy.name}` : ''}</label>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--body)' }}>{viewing.replyBody}</div>
            </div>
          ) : null}
        </Modal>
      ) : null}

      {/* Reply to the sender */}
      {replying ? (
        <Modal
          title={`Reply to ${replying.name}`}
          size="lg"
          onClose={() => setReplying(null)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setReplying(null)} disabled={busy}>Cancel</button>
              <button className="btn" onClick={openInGmail} disabled={busy} title="Opens Gmail with this reply pre-filled — no SMTP setup needed">
                📧 Open in Gmail
              </button>
              <button className="btn primary" onClick={sendReply} disabled={busy}>{busy ? 'Sending…' : '✉️ Send reply'}</button>
            </>
          }
        >
          <div className="field">
            <label>To</label>
            <div>{replying.name} · {replying.email}</div>
          </div>

          <div className="field">
            <label>Their message</label>
            <div className="card card-pad" style={{ whiteSpace: 'pre-wrap', background: 'var(--surface-2)', boxShadow: 'none' }}>
              {replying.message}
            </div>
          </div>

          <Input label="Subject" value={replySubject} onChange={(e) => setReplySubject(e.target.value)} />
          <Textarea
            label="Your reply"
            hint="Sent to the address the sender submitted. The original message is quoted underneath automatically."
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write your reply…"
            style={{ minHeight: 160 }}
          />

          {replying.repliedAt ? (
            <p style={{ color: 'var(--warn)', fontSize: 12.5, margin: 0 }}>
              ⚠ This message was already replied to on {fmtDate(replying.repliedAt)}. Sending again will replace the stored reply.
            </p>
          ) : null}
        </Modal>
      ) : null}

      {/* Change status */}
      {editing ? (
        <Modal
          title="Edit Message"
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setEditing(null)} disabled={busy}>Cancel</button>
              <button className="btn primary" onClick={saveStatus} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <Select label="Status" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
        </Modal>
      ) : null}

      {deleting ? (
        <ConfirmDialog
          title="Delete message?"
          message={`The message from "${deleting.name}" will be permanently removed.`}
          confirmLabel="Delete"
          danger
          busy={busy}
          onConfirm={doDelete}
          onClose={() => setDeleting(null)}
        />
      ) : null}
    </div>
  )
}

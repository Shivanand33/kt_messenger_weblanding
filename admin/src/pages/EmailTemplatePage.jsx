import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading, Badge } from '../components/ui.jsx'
import { Input, Textarea, Checkbox } from '../components/Field.jsx'
import { ConfirmDialog } from '../components/Modal.jsx'

/**
 * Editor for the two-factor code email.
 *
 * The preview is rendered by the backend, not re-implemented here: the same
 * function builds the preview and the email that actually goes out, so the
 * two cannot drift apart. That costs a request per change, which is why it is
 * debounced.
 */

const PREVIEW_DEBOUNCE_MS = 400

/** Everything the editor sends up — one shape for save, preview and test. */
const draftOf = (t) => ({
  subject: t.subject,
  data: t.data,
  customHtml: t.customHtml,
  useCustomHtml: t.useCustomHtml,
})

const sameDraft = (a, b) => JSON.stringify(draftOf(a)) === JSON.stringify(draftOf(b))

export function EmailTemplatePage() {
  const toast = useToast()
  const [meta, setMeta] = useState(null)       // defaults + placeholders, from the server
  const [saved, setSaved] = useState(null)     // what is stored right now
  const [draft, setDraft] = useState(null)     // what the editor is showing
  const [preview, setPreview] = useState(null) // { subject, html, text }
  const [loading, setLoading] = useState(true)
  const [rendering, setRendering] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [device, setDevice] = useState('desktop')
  const [showText, setShowText] = useState(false)
  const [advanced, setAdvanced] = useState(false)

  const dirty = saved && draft ? !sameDraft(saved, draft) : false

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }))
  const setField = (key, value) => setDraft((d) => ({ ...d, data: { ...d.data, [key]: value } }))

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/email-templates/2fa')
      const t = res.data.data
      const shape = { subject: t.subject, data: t.data, customHtml: t.customHtml, useCustomHtml: t.useCustomHtml }
      setMeta({
        defaults: t.defaults,
        placeholders: t.placeholders,
        isDefault: t.isDefault,
        updatedAt: t.updatedAt,
        expiresInMinutes: t.expiresInMinutes,
      })
      setSaved(shape)
      setDraft(shape)
      if (t.useCustomHtml) setAdvanced(true)
    } catch (e) {
      toast.error(errorMessage(e, 'Could not load the template'))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { load() }, [load])

  // Re-render the preview as the draft changes. The counter guards against a
  // slow response overwriting a newer one.
  const seq = useRef(0)
  useEffect(() => {
    if (!draft) return undefined
    const mine = ++seq.current
    setRendering(true)
    const timer = setTimeout(async () => {
      try {
        const res = await api.post('/admin/email-templates/2fa/preview', draftOf(draft))
        if (seq.current === mine) setPreview(res.data.data)
      } catch (e) {
        if (seq.current === mine) toast.error(errorMessage(e, 'Preview failed'))
      } finally {
        if (seq.current === mine) setRendering(false)
      }
    }, PREVIEW_DEBOUNCE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const save = async () => {
    setSaving(true)
    try {
      const res = await api.put('/admin/email-templates/2fa', draftOf(draft))
      const t = res.data.data
      const shape = { subject: t.subject, data: t.data, customHtml: t.customHtml, useCustomHtml: t.useCustomHtml }
      setSaved(shape)
      setDraft(shape)
      setMeta((m) => ({ ...m, isDefault: t.isDefault, updatedAt: t.updatedAt }))
      toast.success('Template saved — the next code email uses it')
    } catch (e) {
      toast.error(errorMessage(e, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  const sendTest = async () => {
    setTesting(true)
    try {
      const res = await api.post('/admin/email-templates/2fa/test', draftOf(draft))
      toast.success(`Test email sent to ${res.data.data.to}`)
    } catch (e) {
      toast.error(errorMessage(e, 'Could not send the test email'))
    } finally {
      setTesting(false)
    }
  }

  const doReset = async () => {
    setSaving(true)
    try {
      const res = await api.post('/admin/email-templates/2fa/reset')
      const t = res.data.data
      const shape = { subject: t.subject, data: t.data, customHtml: t.customHtml, useCustomHtml: t.useCustomHtml }
      setSaved(shape)
      setDraft(shape)
      setAdvanced(false)
      setMeta((m) => ({ ...m, isDefault: true, updatedAt: null }))
      setResetting(false)
      toast.success('Back to the built-in template')
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  /**
   * Paint the preview by writing into the frame rather than swapping `srcDoc`.
   *
   * Swapping srcDoc reloads the frame, so every keystroke blanked the preview
   * to white before repainting. Writing the document replaces it in one go.
   * The frame stays sandboxed without `allow-scripts`, so nothing inside it
   * can run — same-origin buys the write, not any capability.
   */
  const frameRef = useRef(null)
  useEffect(() => {
    const frame = frameRef.current
    if (!frame || showText) return
    const doc = frame.contentDocument
    if (!doc) return
    doc.open()
    doc.write(preview?.html || '')
    doc.close()
  }, [preview, showText, device])

  /** Drops the admin's own HTML in, so "advanced" starts from the real thing. */
  const fillCustomHtml = () => {
    if (draft.customHtml?.trim()) return
    if (preview?.html) set('customHtml', preview.html)
  }

  const frameWidth = device === 'mobile' ? 380 : '100%'

  const placeholderHelp = useMemo(
    () => (meta?.placeholders || []).map((p) => `${p.token} — ${p.label}`).join('\n'),
    [meta],
  )

  if (loading || !draft) return <div className="card"><Loading label="Loading template…" /></div>

  return (
    <div>
      <PageHeader
        title="2FA Email Design"
        subtitle={
          <>
            The code email admins get when they sign in.{' '}
            {meta.isDefault
              ? <Badge tone="gray">built-in design</Badge>
              : <Badge tone="green">customised</Badge>}
          </>
        }
        actions={
          <>
            <button className="btn ghost" onClick={() => setResetting(true)} disabled={saving || meta.isDefault}>
              Reset to default
            </button>
            <button className="btn ghost" onClick={sendTest} disabled={testing}>
              {testing ? 'Sending…' : 'Send test to me'}
            </button>
            <button className="btn primary" onClick={save} disabled={saving || !dirty}>
              {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
            </button>
          </>
        }
      />

      <div className="grid" style={{ gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 18, alignItems: 'start' }}>
        {/* ── Editor ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gap: 14 }}>
          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 4 }}>Branding</h3>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 0, marginBottom: 14 }}>
              Shown above the card and in the accent strip.
            </p>
            <Input
              label="Brand name"
              value={draft.data.brandName}
              onChange={(e) => setField('brandName', e.target.value)}
            />
            <div className="form-row">
              <div className="field">
                <label>Accent colour</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(draft.data.brandColor) ? draft.data.brandColor : '#1570ef'}
                    onChange={(e) => setField('brandColor', e.target.value)}
                    style={{ width: 44, height: 38, padding: 2, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer' }}
                  />
                  <input
                    className="input"
                    value={draft.data.brandColor}
                    onChange={(e) => setField('brandColor', e.target.value)}
                    placeholder="#1570ef"
                  />
                </div>
              </div>
            </div>
            <Input
              label="Logo image URL"
              value={draft.data.logoUrl}
              placeholder="Leave empty to show the brand name as text"
              hint="Must be a public https:// image. It is shown 32px tall."
              onChange={(e) => setField('logoUrl', e.target.value)}
            />
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 4 }}>Wording</h3>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 0, marginBottom: 14 }}>
              Use the placeholders below — they are replaced when the email is sent.
            </p>
            <Input
              label="Subject line"
              value={draft.subject}
              onChange={(e) => set('subject', e.target.value)}
            />
            <Input
              label="Preview text"
              hint="The grey line the inbox shows next to the subject."
              value={draft.data.preheader}
              onChange={(e) => setField('preheader', e.target.value)}
            />
            <Input
              label="Heading"
              value={draft.data.heading}
              onChange={(e) => setField('heading', e.target.value)}
            />
            <Textarea
              label="Opening line"
              rows={3}
              value={draft.data.intro}
              onChange={(e) => setField('intro', e.target.value)}
            />
            <Input
              label="Under the code"
              value={draft.data.expiryNote}
              hint={`The code really does expire after ${meta.expiresInMinutes} minutes — keep this honest.`}
              onChange={(e) => setField('expiryNote', e.target.value)}
            />
            <Textarea
              label="Security note"
              rows={3}
              value={draft.data.securityNote}
              onChange={(e) => setField('securityNote', e.target.value)}
            />
            <div className="form-row">
              <Input
                label="Button label"
                value={draft.data.buttonLabel}
                hint="Empty hides the button."
                onChange={(e) => setField('buttonLabel', e.target.value)}
              />
              <Input
                label="Button link"
                value={draft.data.buttonUrl}
                onChange={(e) => setField('buttonUrl', e.target.value)}
              />
            </div>
            <Textarea
              label="Footer note"
              rows={2}
              value={draft.data.footerNote}
              onChange={(e) => setField('footerNote', e.target.value)}
            />
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 4 }}>Attempt details</h3>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 0, marginBottom: 14 }}>
              Time, IP and browser of the sign-in. Leaving this on is how an admin notices a code
              they did not ask for.
            </p>
            <Checkbox
              label="Show the attempt details block"
              checked={draft.data.showDetails}
              onChange={(e) => setField('showDetails', e.target.checked)}
            />
            {draft.data.showDetails ? (
              <Input
                label="Block title"
                value={draft.data.detailsTitle}
                onChange={(e) => setField('detailsTitle', e.target.value)}
              />
            ) : null}
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 10 }}>Placeholders</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(meta.placeholders || []).map((p) => (
                <span
                  key={p.token}
                  title={p.label}
                  onClick={() => navigator.clipboard?.writeText(p.token).then(
                    () => toast.success(`${p.token} copied`),
                    () => {},
                  )}
                  style={{
                    cursor: 'pointer', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12,
                    background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--body)',
                    padding: '4px 8px', borderRadius: 6,
                  }}
                >
                  {p.token}
                </span>
              ))}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 0 }}>
              Click one to copy it. An unknown placeholder is left in the email as you typed it, so a
              typo is visible rather than silently blank.
            </p>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 10 }}>Advanced</h3>
            <Checkbox
              label="Write the HTML myself"
              checked={advanced}
              onChange={(e) => {
                setAdvanced(e.target.checked)
                if (e.target.checked) fillCustomHtml()
                else set('useCustomHtml', false)
              }}
            />
            {advanced ? (
              <>
                <Checkbox
                  label="Use my HTML for real emails"
                  checked={draft.useCustomHtml}
                  onChange={(e) => set('useCustomHtml', e.target.checked)}
                />
                <Textarea
                  label="Custom HTML"
                  rows={14}
                  spellCheck={false}
                  value={draft.customHtml}
                  placeholder="<html>…</html>"
                  hint="Placeholders work here too. It must contain {{code}} or the save is refused."
                  onChange={(e) => set('customHtml', e.target.value)}
                  style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, lineHeight: 1.5 }}
                />
                <button className="btn ghost" type="button" onClick={() => set('customHtml', preview?.html || '')}>
                  Replace with the current design
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* ── Preview ────────────────────────────────────────── */}
        <div className="card" style={{ position: 'sticky', top: 16, overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              padding: '12px 16px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Subject {rendering ? '· updating…' : ''}
              </div>
              <div className="t-title" style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {preview?.subject || '—'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className={`btn ${showText ? 'ghost' : 'primary'}`} onClick={() => setShowText(false)} style={{ padding: '6px 12px' }}>HTML</button>
              <button className={`btn ${showText ? 'primary' : 'ghost'}`} onClick={() => setShowText(true)} style={{ padding: '6px 12px' }}>Plain text</button>
              <button className={`btn ${device === 'desktop' ? 'primary' : 'ghost'}`} onClick={() => setDevice('desktop')} style={{ padding: '6px 12px' }}>Desktop</button>
              <button className={`btn ${device === 'mobile' ? 'primary' : 'ghost'}`} onClick={() => setDevice('mobile')} style={{ padding: '6px 12px' }}>Mobile</button>
            </div>
          </div>

          <div style={{ background: '#eef2f7', padding: 12, display: 'flex', justifyContent: 'center' }}>
            {showText ? (
              <pre
                style={{
                  width: '100%', margin: 0, minHeight: 620, background: '#ffffff', color: '#0f172a',
                  padding: 20, borderRadius: 10, overflow: 'auto', whiteSpace: 'pre-wrap',
                  font: '13px/20px ui-monospace, Menlo, monospace',
                }}
              >
                {preview?.text || ''}
              </pre>
            ) : (
              <iframe
                title="Email preview"
                ref={frameRef}
                // No `allow-scripts`: the markup the admin just typed is shown,
                // never run, and it cannot navigate the panel either.
                sandbox="allow-same-origin"
                style={{
                  width: frameWidth, maxWidth: '100%', height: 620, border: 0,
                  borderRadius: 10, background: '#ffffff',
                  boxShadow: device === 'mobile' ? '0 10px 30px rgba(15,23,42,.18)' : 'none',
                }}
              />
            )}
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--muted)' }}>
            Rendered by the same code that sends the real email. Sample values are shown in place of
            the placeholders.
          </div>
        </div>
      </div>

      <details className="card card-pad" style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>What each placeholder means</summary>
        <pre style={{ margin: '10px 0 0 0', whiteSpace: 'pre-wrap', font: '12px/20px ui-monospace, Menlo, monospace', color: 'var(--muted)' }}>
          {placeholderHelp}
        </pre>
      </details>

      {resetting ? (
        <ConfirmDialog
          title="Reset to the built-in design?"
          message="Your wording, colours and custom HTML are discarded and the default email comes back. This cannot be undone."
          confirmLabel="Reset"
          danger
          busy={saving}
          onConfirm={doReset}
          onClose={() => setResetting(false)}
        />
      ) : null}
    </div>
  )
}

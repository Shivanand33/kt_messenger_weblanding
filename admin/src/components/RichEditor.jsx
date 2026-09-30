import { useEffect, useRef, useState } from 'react'
import api from '../api/client.js'
import { Field } from './Field.jsx'

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---------------------------------------------------------------------------
// Paste sanitization. Keeps only the tags the public renderer understands,
// demotes headings, converts styled spans to real <b>/<i>/<u>/<s> tags and
// strips every attribute except href on <a> and src/alt on <img>.
// ---------------------------------------------------------------------------
function sanitizePastedHtml(html) {
  const src = new DOMParser().parseFromString(html, 'text/html')
  const doc = document.implementation.createHTMLDocument('')
  const copyChildren = (el, out) => { for (const child of el.childNodes) walk(child, out) }
  const mapInline = (el, out) => {
    const style = (el.getAttribute('style') || '').toLowerCase()
    let node = out
    if (/font-weight\s*:\s*(bold|[6-9]00)/.test(style)) { const w = doc.createElement('b'); node.appendChild(w); node = w }
    if (/font-style\s*:\s*italic/.test(style)) { const w = doc.createElement('i'); node.appendChild(w); node = w }
    if (/text-decoration[^;]*underline/.test(style)) { const w = doc.createElement('u'); node.appendChild(w); node = w }
    if (/text-decoration[^;]*(line-through|strike)/.test(style)) { const w = doc.createElement('s'); node.appendChild(w); node = w }
    copyChildren(el, node)
  }
  const walk = (node, out) => {
    if (node.nodeType === Node.TEXT_NODE) { out.appendChild(doc.createTextNode(node.textContent)); return }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const tag = node.tagName
    if (/^H[1-6]$/.test(tag)) {
      const h = doc.createElement(tag === 'H1' || tag === 'H2' || tag === 'H4' ? 'h2' : 'h3')
      copyChildren(node, h)
      out.appendChild(h)
    } else if (tag === 'STRONG' || tag === 'B') {
      const w = doc.createElement('b'); copyChildren(node, w); out.appendChild(w)
    } else if (tag === 'EM' || tag === 'I') {
      const w = doc.createElement('i'); copyChildren(node, w); out.appendChild(w)
    } else if (tag === 'U') {
      const w = doc.createElement('u'); copyChildren(node, w); out.appendChild(w)
    } else if (tag === 'S' || tag === 'STRIKE' || tag === 'DEL') {
      const w = doc.createElement('s'); copyChildren(node, w); out.appendChild(w)
    } else if (tag === 'P' || tag === 'DIV') {
      const w = doc.createElement('p'); copyChildren(node, w); out.appendChild(w)
    } else if (tag === 'BR') {
      out.appendChild(doc.createElement('br'))
    } else if (tag === 'BLOCKQUOTE' || tag === 'UL' || tag === 'OL' || tag === 'LI') {
      const w = doc.createElement(tag.toLowerCase()); copyChildren(node, w); out.appendChild(w)
    } else if (tag === 'A') {
      const href = (node.getAttribute('href') || '').trim()
      if (/^\s*javascript:/i.test(href)) { copyChildren(node, out); return }
      const w = doc.createElement('a')
      w.setAttribute('href', href)
      copyChildren(node, w)
      out.appendChild(w)
    } else if (tag === 'IMG') {
      const s = node.getAttribute('src')
      if (!s) return
      const w = doc.createElement('img')
      w.setAttribute('src', s)
      const alt = node.getAttribute('alt')
      if (alt) w.setAttribute('alt', alt)
      out.appendChild(w)
    } else if (tag === 'SPAN') {
      mapInline(node, out)
    } else {
      copyChildren(node, out) // unknown tag: keep its text, drop the wrapper
    }
  }
  walk(src.body, doc.body)
  return doc
}

// Re-host every remote/data-URI image through the media API so pasted Google
// Docs / web images don't die later. Unreachable images keep their src.
async function rehostImages(doc, onProgress) {
  const imgs = [...doc.querySelectorAll('img[src]')].filter((img) => /^(data:|https?:)/i.test(img.getAttribute('src')))
  if (!imgs.length) return
  onProgress?.(`Uploading ${imgs.length} image${imgs.length === 1 ? '' : 's'}…`)
  await Promise.all(
    imgs.map(async (img) => {
      try {
        const res = await fetch(img.getAttribute('src'))
        if (!res.ok) return
        const blob = await res.blob()
        if (!blob || !blob.type.startsWith('image/')) return
        const fd = new FormData()
        fd.append('file', blob, 'pasted-image')
        fd.append('folder', 'blog')
        const up = await api.post('/admin/media', fd)
        img.setAttribute('src', up.data.data.url)
      } catch {
        // fetch blocked or upload failed — keep the original src
      }
    }),
  )
  onProgress?.(null)
}

const tb = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 28, height: 28, padding: '0 6px', fontSize: 13, fontWeight: 600,
  color: 'var(--ink)', background: 'transparent', border: '1px solid transparent',
  borderRadius: 6, cursor: 'pointer', lineHeight: 1,
}
const tbActive = { background: 'var(--brand-soft)', borderColor: 'var(--brand)', color: 'var(--brand-strong)' }
const popover = {
  position: 'absolute', top: 40, zIndex: 10, background: 'var(--surface)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: 10, padding: 10, width: 280,
  boxShadow: '0 8px 24px rgba(0,0,0,.45)', display: 'flex', flexDirection: 'column', gap: 8,
}
const inputSm = { width: '100%', padding: '6px 8px', fontSize: 13 }

export function RichEditor({ label, hint, value, onChange }) {
  const edRef = useRef(null)
  const wrapRef = useRef(null)
  const fileRef = useRef(null)
  const savedRange = useRef(null)
  const emitTimer = useRef(null)
  const lastEmitted = useRef(null)
  const [fmt, setFmt] = useState({})
  const [source, setSource] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkBlogs, setLinkBlogs] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [pendingUrl, setPendingUrl] = useState(null)
  const [busy, setBusy] = useState(null)
  const [selImg, setSelImg] = useState(null)
  const [selImgPos, setSelImgPos] = useState(null)

  // Produce <b>/<i>-style tags instead of inline styles.
  useEffect(() => { document.execCommand('styleWithCSS', false, false) }, [])

  // Sync external value into the editable area (initial load / source-mode
  // toggle-back), but never clobber what the user is typing.
  useEffect(() => {
    const el = edRef.current
    if (!el || source) return
    if ((value || '') !== el.innerHTML && value !== lastEmitted.current) el.innerHTML = value || ''
  }, [value, source])

  // Refresh toolbar active states whenever the caret moves inside the editor.
  useEffect(() => {
    const handler = () => {
      const el = edRef.current
      const sel = window.getSelection()
      if (!el || !sel.rangeCount || !el.contains(sel.anchorNode)) return
      const block = String(document.queryCommandValue('formatBlock') || '').toLowerCase().replace(/[<>]/g, '')
      setFmt({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
        quote: block === 'blockquote',
        h2: block === 'h2',
        h3: block === 'h3',
        p: block === 'p' || block === 'div' || block === '',
      })
    }
    document.addEventListener('selectionchange', handler)
    return () => document.removeEventListener('selectionchange', handler)
  }, [])

  const emit = () => {
    clearTimeout(emitTimer.current)
    emitTimer.current = setTimeout(() => {
      const el = edRef.current
      if (!el) return
      lastEmitted.current = el.innerHTML
      onChange(el.innerHTML)
    }, 300)
  }

  const saveSel = () => {
    const el = edRef.current
    const sel = window.getSelection()
    if (el && sel.rangeCount && el.contains(sel.anchorNode)) savedRange.current = sel.getRangeAt(0).cloneRange()
  }
  const restoreSel = () => {
    const el = edRef.current
    if (!el || !savedRange.current) return
    el.focus()
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(savedRange.current)
  }

  // Focus the editor and guarantee a caret before inserting. When the user
  // never clicked into the editable area there is no saved selection —
  // restoreSel would silently no-op and execCommand('insertHTML') would go
  // nowhere (the image "uploaded" but never appeared). In that case park the
  // caret at the end of the content instead.
  const ensureCaret = () => {
    const el = edRef.current
    if (!el) return
    if (savedRange.current) {
      restoreSel()
      return
    }
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const exec = (cmd, arg = null) => {
    ensureCaret()
    document.execCommand(cmd, false, arg)
    emit()
  }

  const clearFormatting = () => {
    restoreSel()
    document.execCommand('removeFormat', false)
    const sel = window.getSelection()
    if (sel.rangeCount) {
      const range = sel.getRangeAt(0)
      const root = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement
      if (root && edRef.current && edRef.current.contains(root)) {
        root.querySelectorAll('[style]').forEach((n) => n.removeAttribute('style'))
        root.querySelectorAll('span').forEach((sp) => sp.replaceWith(...sp.childNodes))
      }
    }
    emit()
  }

  // --- link popover -------------------------------------------------------
  const openLink = () => {
    saveSel()
    setLinkOpen((o) => !o)
    if (linkBlogs === null) {
      api.get('/admin/blogs', { params: { pageSize: 100 } })
        .then((res) => {
          const d = res.data.data
          const items = Array.isArray(d) ? d : (d.items || [])
          setLinkBlogs(items.filter((b) => b.status === 'PUBLISHED'))
        })
        .catch(() => setLinkBlogs([]))
    }
  }
  const applyLink = () => {
    const url = linkUrl.trim()
    if (!url) return
    ensureCaret()
    const sel = window.getSelection()
    if (sel.isCollapsed && linkText.trim()) {
      document.execCommand('insertHTML', false, `<a href="${escapeHtml(url)}">${escapeHtml(linkText.trim())}</a>`)
    } else {
      document.execCommand('createLink', false, url)
    }
    setLinkOpen(false)
    setLinkUrl('')
    setLinkText('')
    emit()
  }

  // --- insert image -------------------------------------------------------
  const onPickImage = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPendingFile(file)
  }

  useEffect(() => {
    if (!pendingFile) return undefined
    let cancelled = false
    ;(async () => {
      setBusy('Uploading image…')
      try {
        const fd = new FormData()
        fd.append('file', pendingFile)
        fd.append('folder', 'blog')
        const res = await api.post('/admin/media', fd)
        if (!cancelled) setPendingUrl(res.data.data.url)
      } catch {
        if (!cancelled) setPendingFile(null)
      } finally {
        if (!cancelled) setBusy(null)
      }
    })()
    return () => { cancelled = true }
  }, [pendingFile])

  const insertImage = (align) => {
    const url = pendingUrl
    setPendingFile(null)
    setPendingUrl(null)
    if (!url) return
    ensureCaret()
    const attr = align && align !== 'none' ? ` data-align="${align}"` : ''
    document.execCommand('insertHTML', false, `<img src="${escapeHtml(url)}" alt=""${attr}>`)
    emit()
  }

  // --- selected in-editor image mini-bar -----------------------------------
  const onEditorClick = (e) => {
    saveSel()
    if (e.target.tagName === 'IMG') {
      e.preventDefault()
      setSelImg(e.target)
      const r = e.target.getBoundingClientRect()
      const w = wrapRef.current.getBoundingClientRect()
      setSelImgPos({ top: r.bottom - w.top + 4, left: Math.max(0, Math.min(r.left - w.left, w.width - 230)) })
    } else {
      setSelImg(null)
    }
  }
  const setSelAlign = (align) => {
    if (!selImg) return
    if (align) selImg.setAttribute('data-align', align)
    else selImg.removeAttribute('data-align')
    emit()
  }
  const removeSelImg = () => {
    selImg?.remove()
    setSelImg(null)
    emit()
  }

  // --- paste ---------------------------------------------------------------
  const onPaste = (e) => {
    e.preventDefault()
    saveSel()
    const cd = e.clipboardData
    const html = cd.getData('text/html')
    if (html) {
      const doc = sanitizePastedHtml(html)
      void (async () => {
        await rehostImages(doc, setBusy)
        restoreSel()
        document.execCommand('insertHTML', false, doc.body.innerHTML)
        emit()
      })()
    } else {
      const text = cd.getData('text/plain')
      if (text) {
        restoreSel()
        const paras = text
          .split(/\r?\n[ \t]*\r?\n/)
          .map((p) => `<p>${escapeHtml(p).replace(/\r?\n/g, '<br>')}</p>`)
          .join('')
        document.execCommand('insertHTML', false, paras)
        emit()
      }
    }
  }

  const onInput = () => {
    const el = edRef.current
    if (el.innerHTML === '<br>') el.innerHTML = ''
    setSelImg(null)
    saveSel()
    emit()
  }

  const Btn = ({ title, active, small, danger, onClick, children }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{
        ...tb,
        ...(active ? tbActive : null),
        ...(small ? { minWidth: 22, height: 22, fontSize: 11, padding: '0 4px' } : null),
        ...(danger ? { color: 'var(--danger)' } : null),
      }}
    >
      {children}
    </button>
  )

  const Sep = () => <span style={{ width: 1, height: 18, background: 'var(--line)', margin: '0 4px', flex: 'none' }} />

  return (
    <Field label={label} hint={hint}>
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <div
          style={{
            position: 'sticky', top: 0, zIndex: 6, display: 'flex', alignItems: 'center', gap: 2,
            flexWrap: 'wrap', padding: '6px 8px', background: 'var(--surface-2)',
            border: '1px solid var(--line)', borderBottom: 'none',
            borderRadius: '10px 10px 0 0',
          }}
        >
          <Btn title="Bold (Ctrl+B)" active={fmt.bold} onClick={() => exec('bold')}><b>B</b></Btn>
          <Btn title="Italic (Ctrl+I)" active={fmt.italic} onClick={() => exec('italic')}><i>I</i></Btn>
          <Btn title="Underline (Ctrl+U)" active={fmt.underline} onClick={() => exec('underline')}><u>U</u></Btn>
          <Btn title="Strikethrough" active={fmt.strikeThrough} onClick={() => exec('strikeThrough')}><s>S</s></Btn>
          <Sep />
          <Btn title="Heading 2" active={fmt.h2} onClick={() => exec('formatBlock', 'h2')}>H2</Btn>
          <Btn title="Heading 3" active={fmt.h3} onClick={() => exec('formatBlock', 'h3')}>H3</Btn>
          <Btn title="Paragraph" active={fmt.p && !fmt.h2 && !fmt.h3 && !fmt.quote} onClick={() => exec('formatBlock', 'p')}>¶</Btn>
          <Sep />
          <Btn title="Bullet list" active={fmt.ul} onClick={() => exec('insertUnorderedList')}>•≡</Btn>
          <Btn title="Numbered list" active={fmt.ol} onClick={() => exec('insertOrderedList')}>1≡</Btn>
          <Btn title="Blockquote" active={fmt.quote} onClick={() => exec('formatBlock', 'blockquote')}>❝</Btn>
          <Sep />
          <Btn title="Insert link" active={linkOpen} onClick={openLink}>🔗</Btn>
          <Btn title="Insert image" onClick={() => fileRef.current?.click()}>🖼</Btn>
          <Sep />
          <Btn title="Undo" onClick={() => exec('undo')}>↺</Btn>
          <Btn title="Redo" onClick={() => exec('redo')}>↻</Btn>
          <Btn title="Clear formatting" onClick={clearFormatting}>⌫</Btn>
          {busy ? <span style={{ fontSize: 12, color: 'var(--muted)', paddingLeft: 6 }}>{busy}</span> : null}
          <span style={{ flex: 1 }} />
          <Btn title="Edit source (HTML / Markdown)" active={source} onClick={() => setSource((s) => !s)}>&lt;/&gt;</Btn>
        </div>

        {source ? (
          <textarea
            className="textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight: 320, fontFamily: 'ui-monospace, monospace', fontSize: 12.5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          />
        ) : (
          <div
            ref={edRef}
            className="rich-ed"
            data-placeholder="Write your article…"
            contentEditable
            onInput={onInput}
            onPaste={onPaste}
            onClick={onEditorClick}
            onKeyUp={saveSel}
            onMouseUp={saveSel}
            onBlur={saveSel}
            style={{
              minHeight: 300, padding: '12px 14px', background: 'var(--surface)', color: 'var(--ink)',
              border: '1px solid var(--line)', borderTop: 'none', borderRadius: '0 0 10px 10px',
              fontSize: 14, lineHeight: 1.65, outline: 'none', overflowWrap: 'break-word',
            }}
          />
        )}

        {linkOpen && (
          <div style={{ ...popover, right: 0 }}>
            <input
              autoFocus
              className="input"
              placeholder="https://…"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyLink()}
              style={inputSm}
            />
            <input
              className="input"
              placeholder="Link text (used when nothing is selected)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyLink()}
              style={inputSm}
            />
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Internal links (published blogs)</div>
            <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {linkBlogs === null ? (
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Loading…</span>
              ) : linkBlogs.length === 0 ? (
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>No published blogs</span>
              ) : linkBlogs.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => { setLinkUrl(`/blog/${b.slug}`); setLinkText((t) => t || b.title) }}
                  style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--brand)', fontSize: 12.5, padding: '4px 6px', borderRadius: 6, cursor: 'pointer' }}
                >
                  {b.title}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn ghost" onClick={() => setLinkOpen(false)}>Cancel</button>
              <button type="button" className="btn primary" onClick={applyLink}>Apply link</button>
            </div>
          </div>
        )}

        {pendingUrl && (
          <div style={{ ...popover, left: '50%', transform: 'translateX(-50%)', width: 'auto' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Image position</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['none', 'left', 'right', 'center'].map((a) => (
                <Btn key={a} onClick={() => insertImage(a)}>{a === 'none' ? 'Normal' : a[0].toUpperCase() + a.slice(1)}</Btn>
              ))}
            </div>
          </div>
        )}

        {selImg && selImgPos && !source && (
          <div
            style={{
              position: 'absolute', top: selImgPos.top, left: selImgPos.left, zIndex: 9,
              display: 'flex', gap: 4, padding: 4, background: 'var(--surface-2)',
              border: '1px solid var(--line)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.4)',
            }}
          >
            <Btn small title="Float left" onClick={() => setSelAlign('left')}>L</Btn>
            <Btn small title="Float right" onClick={() => setSelAlign('right')}>R</Btn>
            <Btn small title="Center" onClick={() => setSelAlign('center')}>C</Btn>
            <Btn small title="Normal (no float)" onClick={() => setSelAlign(null)}>—</Btn>
            <Btn small title="Remove image" danger onClick={removeSelImg}>✕</Btn>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickImage} />
      </div>
      <style>{`
        .rich-ed:empty::before { content: attr(data-placeholder); color: var(--muted); pointer-events: none; }
        .rich-ed img { max-width: 100%; border-radius: 8px; cursor: pointer; }
        .rich-ed img[data-align="left"] { float: left; margin: 4px 14px 8px 0; max-width: 50%; }
        .rich-ed img[data-align="right"] { float: right; margin: 4px 0 8px 14px; max-width: 50%; }
        .rich-ed img[data-align="center"] { display: block; margin: 10px auto; }
        .rich-ed blockquote { border-left: 3px solid var(--line); margin: 10px 0; padding: 2px 14px; color: var(--muted); }
      `}</style>
    </Field>
  )
}

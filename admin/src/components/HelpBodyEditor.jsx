import { Fragment, useRef, useState } from 'react'
import { parseHelpBody, linkKind } from './helpBody.js'

/**
 * Body editor for a Help Center article: a toolbar that writes the markup the
 * website understands, and a live preview drawn the way the website draws it
 * (same parser — see ./helpBody.js — and the site's own sizes and colours).
 * The store QR code is not editable; on the download article it is added by
 * the website and only shown here as a placeholder.
 */

const PLATFORMS = ['Android', 'iOS', 'Mac', 'Windows']

const canonicalTab = (name) => {
  const clean = String(name || '').trim()
  return PLATFORMS.find((p) => p.toLowerCase() === clean.toLowerCase()) || clean
}

// Same ordering as the website: the Platforms field first, then the rest.
function orderTabs(names, platforms) {
  const tabs = names.map(canonicalTab)
  const ranked = (platforms || []).map(canonicalTab).filter((p, i, all) => tabs.includes(p) && all.indexOf(p) === i)
  return [...ranked, ...tabs.filter((tab) => !ranked.includes(tab))]
}

const hasQrToken = (blocks) => blocks.some((b) => b.type === 'qr' || (b.blocks && hasQrToken(b.blocks)))

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* ── preview ─────────────────────────────────────────────────────────── */

function Inlines({ nodes }) {
  return nodes.map((n, i) => {
    if (n.type === 'text') return n.text
    if (n.type === 'br') return <br key={i} />
    if (n.type === 'strong') return <strong key={i}><Inlines nodes={n.children} /></strong>
    if (n.type === 'em') return <em key={i}><Inlines nodes={n.children} /></em>
    if (n.type === 'link') {
      // Links do not navigate inside the admin; hover shows where they go.
      return linkKind(n.href)
        ? <a key={i} href={n.href} title={n.href} onClick={(e) => e.preventDefault()}><Inlines nodes={n.children} /></a>
        : <span key={i}><Inlines nodes={n.children} /></span>
    }
    return null
  })
}

function List({ list }) {
  const items = list.items.map((item, j) => (
    <li key={j}>
      <Inlines nodes={item.inlines} />
      {item.lists.map((sub, k) => <List key={k} list={sub} />)}
    </li>
  ))
  return list.ordered ? <ol>{items}</ol> : <ul>{items}</ul>
}

const QrPlaceholder = ({ tab }) => (
  <div className="help-preview-qr">QR code for {tab === 'iOS' ? 'the App Store' : 'Google Play'}<br />(added by the website)</div>
)

function Blocks({ blocks, tab, isDownload }) {
  return blocks.map((b, i) => {
    if (b.type === 'heading') return b.level === 2 ? <h2 key={i}><Inlines nodes={b.inlines} /></h2> : <h3 key={i}><Inlines nodes={b.inlines} /></h3>
    if (b.type === 'paragraph') return <p key={i}><Inlines nodes={b.inlines} /></p>
    if (b.type === 'list') return <List key={i} list={b} />
    if (b.type === 'note') return <div key={i} className="help-preview-note"><Blocks blocks={b.blocks} tab={tab} isDownload={isDownload} /></div>
    if (b.type === 'tab') return canonicalTab(b.name) === tab ? <Fragment key={i}><Blocks blocks={b.blocks} tab={tab} isDownload={isDownload} /></Fragment> : null
    if (b.type === 'download') return <div key={i}><span className="help-preview-button">{b.label || (tab ? `Download for ${tab}` : 'Download KT Messenger')} ›</span></div>
    if (b.type === 'qr') return isDownload && (tab === 'Android' || tab === 'iOS') ? <QrPlaceholder key={i} tab={tab} /> : null
    return null
  })
}

function Preview({ body, platforms, isDownload }) {
  const parsed = parseHelpBody(body)
  const ordered = orderTabs(parsed.tabs, platforms)
  const tabs = ordered.length ? ordered : isDownload ? PLATFORMS : []
  const [picked, setPicked] = useState('Android')
  const tab = tabs.length ? (tabs.includes(picked) ? picked : tabs[0]) : null

  if (!parsed.blocks.length) return <div className="help-preview-empty">Nothing to preview yet.</div>
  return (
    <div className="help-preview">
      {tabs.length ? (
        <div className="help-preview-tabs">
          {tabs.map((name) => (
            <button key={name} type="button" className={name === tab ? 'active' : ''} onClick={() => setPicked(name)}>{name}</button>
          ))}
        </div>
      ) : null}
      <div className="help-preview-body">
        {isDownload && (tab === 'Android' || tab === 'iOS') && !hasQrToken(parsed.blocks) ? <QrPlaceholder tab={tab} /> : null}
        <Blocks blocks={parsed.blocks} tab={tab} isDownload={isDownload} />
      </div>
    </div>
  )
}

/* ── editor ──────────────────────────────────────────────────────────── */

export function HelpBodyEditor({ value, onChange, platforms, isDownload }) {
  const ref = useRef(null)
  const [mode, setMode] = useState('write')

  // Replace the current selection with `build(selected)`; the returned
  // [from, to] (relative to the inserted text) is selected afterwards.
  const apply = (build) => {
    const el = ref.current
    const start = el ? el.selectionStart : value.length
    const end = el ? el.selectionEnd : value.length
    const result = build(value.slice(start, end))
    if (!result) return
    const { text, select } = result
    onChange(value.slice(0, start) + text + value.slice(end))
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      el.setSelectionRange(start + (select ? select[0] : text.length), start + (select ? select[1] : text.length))
    })
  }

  // Inline markup around the selection (or a placeholder word).
  const wrap = (open, close, fallback) => apply((sel) => {
    const inner = sel || fallback
    return { text: open + inner + close, select: [open.length, open.length + inner.length] }
  })

  // Block markup on its own lines.
  const block = (make) => apply((sel) => {
    const el = ref.current
    const start = el ? el.selectionStart : value.length
    const lead = start > 0 && value[start - 1] !== '\n' ? '\n' : ''
    const made = make(sel)
    if (!made) return null
    const [before, inner, after] = made
    return { text: `${lead}${before}${inner}${after}\n`, select: [lead.length + before.length, lead.length + before.length + inner.length] }
  })

  const listOf = (tag) => block((sel) => {
    const lines = sel.split('\n').map((l) => l.trim()).filter(Boolean)
    const items = (lines.length ? lines : ['First item', 'Second item']).map((l) => `  <li>${l}</li>`).join('\n')
    return [`<${tag}>\n`, items, `\n</${tag}>`]
  })

  const link = () => apply((sel) => {
    const url = window.prompt('Link address\n\n• Another Help article: /help/article-slug (use "Copy path" on that article)\n• A website page: /apps\n• Another website: https://…', '/help/')
    if (!url || !url.trim()) return null
    const href = url.trim().replace(/"/g, '%22')
    const inner = sel || 'link text'
    const open = `<a href="${href}">`
    return { text: `${open}${inner}</a>`, select: [open.length, open.length + inner.length] }
  })

  const tabSection = () => block((sel) => {
    const name = window.prompt('Tab name (Android, iOS, Mac or Windows)', 'Android')
    if (!name || !name.trim()) return null
    const label = canonicalTab(name) // 'android' -> 'Android'
    const clean = escapeHtml(label).replace(/"/g, '&quot;')
    return [`<section data-tab="${clean}">\n  <p>`, sel || `Only shown on the ${escapeHtml(label)} tab.`, '</p>\n</section>']
  })

  const TOOLS = [
    ['Heading', () => block((sel) => ['<h2>', sel || 'Heading', '</h2>'])],
    ['Subheading', () => block((sel) => ['<h3>', sel || 'Subheading', '</h3>'])],
    ['Paragraph', () => block((sel) => ['<p>', sel || 'Paragraph text', '</p>'])],
    ['Bold', () => wrap('<strong>', '</strong>', 'bold text')],
    ['Italic', () => wrap('<em>', '</em>', 'italic text')],
    ['Link', link],
    ['• List', () => listOf('ul')],
    ['1. List', () => listOf('ol')],
    ['Grey box', () => block((sel) => ['<div class="note">\n  <p>', sel || 'Note text', '</p>\n</div>'])],
    ['Tab section', tabSection],
    ['Download button', () => block(() => ['', '{{download}}', ''])],
  ]

  return (
    <div className="field">
      <div className="help-editor-head">
        <label>Body</label>
        <div className="help-editor-modes">
          <button type="button" className={mode === 'write' ? 'active' : ''} onClick={() => setMode('write')}>Write</button>
          <button type="button" className={mode === 'preview' ? 'active' : ''} onClick={() => setMode('preview')}>Preview</button>
        </div>
      </div>
      {mode === 'write' ? (
        <>
          <div className="help-editor-toolbar">
            {TOOLS.map(([label, run]) => (
              <button key={label} type="button" onClick={run}>{label}</button>
            ))}
          </div>
          <textarea ref={ref} className="textarea" value={value} onChange={(e) => onChange(e.target.value)} style={{ minHeight: 260, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 13 }} />
          <div className="hint">
            Select text and use the toolbar, or write HTML directly. Tabs appear when the body has tab sections (ordered by Platforms).
            {isDownload ? ' The store QR code is added automatically at the top of the Android / iOS tab; write {{qr}} on its own line to place it elsewhere.' : ''}
          </div>
        </>
      ) : (
        <Preview body={value} platforms={platforms} isDownload={isDownload} />
      )}
    </div>
  )
}

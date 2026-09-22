/**
 * Help Center article body -> blocks.
 *
 * The admin writes an article body as HTML (the editor toolbar inserts it) or
 * as markdown-ish text. Both are turned into plain data blocks that the page
 * renders with its own components, so no author markup is ever injected as
 * HTML and unknown tags simply fall back to their text.
 *
 * Supported
 *   Headings     <h1>/<h2> (large), <h3>-<h6> (small)   |  # / ##, ### ...
 *   Paragraphs   <p>                                     |  blank-line separated
 *   Bold/italic  <strong> <b> / <em> <i>                 |  **bold**
 *   Links        <a href="...">                          |  [text](url)
 *   Lists        <ul> / <ol>, nested lists               |  - item / 1. item
 *   Grey box     <div class="note"> <blockquote> <aside> |  > text
 *   Tabs         <section data-tab="Android">            |  ::: Android ... :::
 *   Download     {{download}} or {{download: Label}} on its own line
 *   QR position  {{qr}} on its own line (download article only)
 *
 * The admin panel keeps an identical copy of this file for its live preview
 * (admin/src/components/helpBody.js) — keep the two in sync.
 */

const TOKEN = /^\{\{\s*(download|qr)\s*(?::\s*([^}]*?))?\s*\}\}$/i

// Tags whose content is never shown (scripts, media, form controls ...).
const DROP = new Set(['script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'img', 'picture', 'video', 'audio', 'source', 'svg', 'canvas', 'form', 'input', 'button', 'select', 'textarea', 'link', 'meta', 'head', 'title'])
const INLINE = new Set(['a', 'strong', 'b', 'em', 'i', 'br', 'span', 'u', 'code', 'small', 'mark', 'sub', 'sup', 'abbr', 'cite', 'q', 'time', 'font', 'label', 's', 'del', 'ins', 'kbd'])

/** Where a link may point: 'help' | 'internal' | 'external' | 'mail' | 'anchor' | null (not allowed). */
export function linkKind(href) {
  const h = String(href || '').trim()
  if (/^https?:\/\//i.test(h)) return 'external'
  if (/^(mailto|tel):/i.test(h)) return 'mail'
  if (/^#/.test(h)) return 'anchor'
  if (/^\/(?!\/)/.test(h)) return /^\/help(\/|$|[?#])/i.test(h) ? 'help' : 'internal'
  return null
}

/* ── inline ─────────────────────────────────────────────────────────── */

// **bold** and [text](url) inside plain text.
function inlineMarkdown(text) {
  const out = []
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ type: 'text', text: text.slice(last, m.index) })
    if (m[1] !== undefined) {
      out.push(linkKind(m[2]) ? { type: 'link', href: m[2].trim(), children: [{ type: 'text', text: m[1] }] } : { type: 'text', text: m[1] })
    } else {
      out.push({ type: 'strong', children: [{ type: 'text', text: m[3] }] })
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push({ type: 'text', text: text.slice(last) })
  return out
}

function inlinesFromNodes(nodes) {
  const out = []
  for (const node of nodes) {
    if (node.nodeType === 3) {
      out.push(...inlineMarkdown(node.textContent.replace(/\s+/g, ' ')))
      continue
    }
    if (node.nodeType !== 1) continue
    const tag = node.tagName.toLowerCase()
    if (DROP.has(tag)) continue
    if (tag === 'br') out.push({ type: 'br' })
    else if (tag === 'strong' || tag === 'b') out.push({ type: 'strong', children: inlinesFromNodes(node.childNodes) })
    else if (tag === 'em' || tag === 'i') out.push({ type: 'em', children: inlinesFromNodes(node.childNodes) })
    else if (tag === 'a') {
      const href = node.getAttribute('href') || ''
      const children = inlinesFromNodes(node.childNodes)
      if (linkKind(href)) out.push({ type: 'link', href: href.trim(), children })
      else out.push(...children)
    } else {
      // Anything else (span, nested p/div inside a list item ...) keeps its text.
      const inner = inlinesFromNodes(node.childNodes)
      if (!INLINE.has(tag) && out.length && inner.length) out.push({ type: 'text', text: ' ' })
      out.push(...inner)
    }
  }
  return out
}

// Trim the edges and drop empty text so whitespace between tags never renders.
function tidy(inlines) {
  const list = inlines.filter((n) => n.type !== 'text' || n.text !== '')
  while (list.length && list[0].type === 'text' && !list[0].text.trim()) list.shift()
  while (list.length && list[list.length - 1].type === 'text' && !list[list.length - 1].text.trim()) list.pop()
  while (list.length && list[list.length - 1].type === 'br') list.pop()
  if (list[0]?.type === 'text') list[0] = { ...list[0], text: list[0].text.replace(/^\s+/, '') }
  const end = list.length - 1
  if (list[end]?.type === 'text') list[end] = { ...list[end], text: list[end].text.replace(/\s+$/, '') }
  return list
}

const plainText = (inlines) => inlines.map((n) => (n.type === 'text' ? n.text : n.children ? plainText(n.children) : '')).join('')

// A paragraph that is nothing but {{download}} / {{qr}} becomes that block.
function paragraphOrToken(inlines) {
  const clean = tidy(inlines)
  if (!clean.length) return null
  const token = plainText(clean).trim().match(TOKEN)
  if (token && clean.every((n) => n.type === 'text')) {
    return token[1].toLowerCase() === 'qr' ? { type: 'qr' } : { type: 'download', label: (token[2] || '').trim() }
  }
  return { type: 'paragraph', inlines: clean }
}

/* ── HTML ───────────────────────────────────────────────────────────── */

function listFromElement(el) {
  const items = []
  for (const child of el.childNodes) {
    if (child.nodeType !== 1 || child.tagName.toLowerCase() !== 'li') {
      // Stray text directly inside <ul> becomes its own item.
      const text = child.nodeType === 3 ? child.textContent.trim() : ''
      if (text) items.push({ inlines: tidy(inlineMarkdown(text.replace(/\s+/g, ' '))), lists: [] })
      continue
    }
    const inlineNodes = []
    const lists = []
    for (const n of child.childNodes) {
      const t = n.nodeType === 1 ? n.tagName.toLowerCase() : ''
      if (t === 'ul' || t === 'ol') lists.push(listFromElement(n))
      else inlineNodes.push(n)
    }
    const inlines = tidy(inlinesFromNodes(inlineNodes))
    if (inlines.length || lists.length) items.push({ inlines, lists })
  }
  return { type: 'list', ordered: el.tagName.toLowerCase() === 'ol', items }
}

function blocksFromNodes(nodes) {
  const blocks = []
  let run = []
  const flush = () => {
    const block = paragraphOrToken(inlinesFromNodes(run))
    if (block) blocks.push(block)
    run = []
  }
  for (const node of nodes) {
    if (node.nodeType === 3) { run.push(node); continue }
    if (node.nodeType !== 1) continue
    const tag = node.tagName.toLowerCase()
    if (DROP.has(tag)) continue
    if (INLINE.has(tag)) { run.push(node); continue }
    flush()
    if (/^h[1-6]$/.test(tag)) {
      const inlines = tidy(inlinesFromNodes(node.childNodes))
      if (inlines.length) blocks.push({ type: 'heading', level: Number(tag[1]) <= 2 ? 2 : 3, inlines })
    } else if (tag === 'p') {
      const block = paragraphOrToken(inlinesFromNodes(node.childNodes))
      if (block) blocks.push(block)
    } else if (tag === 'ul' || tag === 'ol') {
      const list = listFromElement(node)
      if (list.items.length) blocks.push(list)
    } else if (tag === 'section' && (node.getAttribute('data-tab') || '').trim()) {
      blocks.push({ type: 'tab', name: node.getAttribute('data-tab').trim(), blocks: blocksFromNodes(node.childNodes) })
    } else if (tag === 'blockquote' || tag === 'aside' || (tag === 'div' && node.classList.contains('note'))) {
      const inner = blocksFromNodes(node.childNodes)
      if (inner.length) blocks.push({ type: 'note', blocks: inner })
    } else if (tag === 'hr') {
      // A divider carries no content.
    } else if (tag === 'li') {
      const list = { type: 'list', ordered: false, items: [] }
      const inlines = tidy(inlinesFromNodes(node.childNodes))
      if (inlines.length) list.items.push({ inlines, lists: [] })
      if (list.items.length) blocks.push(list)
    } else {
      // div, section, article, table ... : keep their content, drop the wrapper.
      blocks.push(...blocksFromNodes(node.childNodes))
    }
  }
  flush()
  return blocks
}

function parseHtml(html) {
  if (typeof DOMParser === 'undefined') return []
  // An inert document: nothing in it runs or loads.
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${html}</body>`, 'text/html')
  return blocksFromNodes(doc.body.childNodes)
}

/* ── markdown-ish ───────────────────────────────────────────────────── */

function parseMarkdown(text) {
  const root = []
  let target = root // where blocks go: the page, or an open ::: tab
  let para = []
  let list = null
  let note = []

  const flushPara = () => {
    if (para.length) {
      const block = paragraphOrToken(inlineMarkdown(para.join(' ')))
      if (block) target.push(block)
    }
    para = []
  }
  const flushList = () => { if (list && list.items.length) target.push(list); list = null }
  const flushNote = () => {
    if (note.length) {
      const inner = parseMarkdown(note.join('\n'))
      if (inner.length) target.push({ type: 'note', blocks: inner })
    }
    note = []
  }
  const flushAll = () => { flushPara(); flushList(); flushNote() }

  for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim()
    const quote = line.match(/^>\s?(.*)$/)
    if (quote) { flushPara(); flushList(); note.push(quote[1]); continue }
    if (note.length) flushNote()

    // `::: Name` opens a tab (closing any open one); a bare `:::` closes it.
    const tab = line.match(/^:::\s*(.*)$/)
    if (tab) {
      flushAll()
      target = root
      if (tab[1].trim()) {
        const block = { type: 'tab', name: tab[1].trim(), blocks: [] }
        root.push(block)
        target = block.blocks
      }
      continue
    }
    if (!line) { flushPara(); flushList(); continue }

    // {{download}} / {{qr}} always stand alone, even without a blank line.
    if (TOKEN.test(line)) {
      flushPara(); flushList()
      const block = paragraphOrToken([{ type: 'text', text: line }])
      if (block) target.push(block)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      flushPara(); flushList()
      const inlines = tidy(inlineMarkdown(heading[2]))
      if (inlines.length) target.push({ type: 'heading', level: heading[1].length <= 2 ? 2 : 3, inlines })
      continue
    }
    const bullet = line.match(/^[-*]\s+(.*)$/)
    const number = line.match(/^\d+[.)]\s+(.*)$/)
    if (bullet || number) {
      flushPara()
      const ordered = Boolean(number)
      if (list && list.ordered !== ordered) flushList()
      if (!list) list = { type: 'list', ordered, items: [] }
      list.items.push({ inlines: tidy(inlineMarkdown((bullet || number)[1])), lists: [] })
      continue
    }
    flushList()
    para.push(line)
  }
  flushAll()
  return root
}

/* ── entry ──────────────────────────────────────────────────────────── */

function collectTabs(blocks, into = []) {
  for (const b of blocks) {
    if (b.type === 'tab' && !into.some((name) => name.toLowerCase() === b.name.toLowerCase())) into.push(b.name)
    if (b.blocks) collectTabs(b.blocks, into)
  }
  return into
}

/**
 * @param {string} body  Article body as stored by the admin.
 * @returns {{ blocks: object[], tabs: string[] }}  `tabs` lists the tab
 *   sections in the order they first appear.
 */
export function parseHelpBody(body) {
  const text = String(body || '')
  const blocks = /<[a-z!/][\s\S]*>/i.test(text) ? parseHtml(text) : parseMarkdown(text)
  return { blocks, tabs: collectTabs(blocks) }
}

// Turn a body into the {type} blocks the article renderers expect.
// Supports markdown-ish bodies ("## heading", "- bullet", blank-line
// paragraphs, "![alt](src)" images, "> quote" lines, "| a | b |" tables,
// "---" dividers) AND HTML bodies. HTML block tags are converted to the same
// markers and every remaining tag is stripped — we never inject raw HTML
// (no dangerouslySetInnerHTML), so author content cannot introduce XSS.
//
// Shared by the Blog and the Help Center, which both store an admin-written
// body as a single string.
export function parseBody(body) {
  let text = String(body || '')
  if (/<[a-z!/][\s\S]*>/i.test(text)) {
    text = text
      .replace(/<\s*(h[1-6])[^>]*>([\s\S]*?)<\s*\/\s*\1\s*>/gi, (_m, _tag, inner) => `\n## ${inner}\n`)
      .replace(/<\s*li[^>]*>([\s\S]*?)<\s*\/\s*li\s*>/gi, (_m, inner) => `\n- ${inner}\n`)
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      // Keep links: turn <a href="x">y</a> into markdown [y](x) before the
      // generic tag strip below removes it, so renderText can make it clickable.
      .replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\s*\/\s*a\s*>/gi, (_m, href, inner) => `[${inner.replace(/<[^>]+>/g, '').trim()}](${href.trim()})`)
      .replace(/<\s*\/\s*(p|div|section|article|ul|ol|h[1-6])\s*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;|&apos;/gi, "'")
  }
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let para = []
  let list = []
  const flushPara = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ').trim() }); para = [] } }
  const flushList = () => { if (list.length) { blocks.push({ type: 'ul', items: list.slice() }); list = [] } }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) { flushPara(); flushList(); continue }
    const h = line.match(/^#{1,6}\s+(.*)$/)
    if (h) { flushPara(); flushList(); blocks.push({ type: 'h', text: h[1].trim() }); continue }
    if (/^-{3,}$/.test(line)) { flushPara(); flushList(); blocks.push({ type: 'hr' }); continue }
    const im = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
    if (im) { flushPara(); flushList(); blocks.push({ type: 'img', alt: im[1].trim(), src: im[2].trim() }); continue }
    const q = line.match(/^>\s?(.*)$/)
    if (q) { flushPara(); flushList(); blocks.push({ type: 'quote', text: q[1].trim() }); continue }
    if (line.startsWith('|') && line.endsWith('|')) {
      flushPara(); flushList()
      const rows = []
      while (i < lines.length) {
        const row = lines[i].trim()
        if (!(row.startsWith('|') && row.endsWith('|'))) break
        const cells = row.slice(1, -1).split('|').map((c) => c.trim())
        // Skip the markdown separator row (|---|---|)
        if (!cells.every((c) => c === '' || /^:?-+:?$/.test(c))) rows.push(cells)
        i++
      }
      i--
      if (rows.length) blocks.push({ type: 'table', rows })
      continue
    }
    const li = line.match(/^[-*]\s+(.*)$/)
    if (li) { flushPara(); list.push(li[1].trim()); continue }
    flushList(); para.push(line)
  }
  flushPara(); flushList()
  return blocks
}

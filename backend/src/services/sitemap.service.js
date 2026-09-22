import { getSiteModel, absolute, DETAIL } from './siteModel.service.js'
import { LANGUAGES, languagePath, hreflangAlternates } from './hreflang.service.js'

/**
 * XML sitemap for the public website, built from the shared site model
 * (./siteModel.service.js) so it always lists exactly the pages, business
 * pages, blog posts and Help Center articles the CMS publishes — each one in
 * every language, with hreflang links to all of its language versions
 * (./hreflang.service.js).
 */

// The protocol allows 50,000 URLs and 50 MB (uncompressed) per file; stay
// well under both. hreflang links make every entry large, so files are cut
// by size too. Past either limit the sitemap becomes a sitemap index
// automatically.
export const MAX_URLS_PER_SITEMAP = 45000
export const MAX_BYTES_PER_SITEMAP = 10 * 1024 * 1024

// W3C datetime without milliseconds: 2026-09-12T10:20:30Z
const w3c = (date) => (date ? date.toISOString().replace(/\.\d{3}Z$/, 'Z') : null)

const escapeXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

/**
 * Sitemap entries: pages, then business pages, blog posts and Help Center
 * articles — in English first, then the same list in every other language.
 * All language versions of a page share one `alternates` list.
 */
export function sitemapEntries(model) {
  const pages = []
  const seen = new Set()
  const add = (path, lastmod, changefreq, priority) => {
    const key = absolute(path).toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    pages.push({ path, lastmod: w3c(lastmod), changefreq, priority, alternates: hreflangAlternates(path) })
  }
  for (const p of model.pages) add(p.path, p.lastmod, p.changefreq, p.priority)
  for (const p of model.business) add(p.path, p.lastmod, DETAIL.businessPage.changefreq, DETAIL.businessPage.priority)
  for (const p of model.posts) add(p.path, p.lastmod, DETAIL.blogPost.changefreq, DETAIL.blogPost.priority)
  for (const a of model.articles) add(a.path, a.lastmod, DETAIL.helpArticle.changefreq, DETAIL.helpArticle.priority)

  const entries = []
  const locs = new Set()
  for (const language of LANGUAGES) {
    for (const page of pages) {
      if (language.prefix && !page.alternates.length) continue
      const loc = absolute(languagePath(page.path, language))
      if (locs.has(loc.toLowerCase())) continue
      locs.add(loc.toLowerCase())
      entries.push({ loc, lastmod: page.lastmod, changefreq: page.changefreq, priority: page.priority, alternates: page.alternates })
    }
  }
  return entries
}

/* ── XML ──────────────────────────────────────────────────────────────── */

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n'

// The <xhtml:link> lines of one page, rendered once and shared by all of its
// language versions: { xml, bytes }.
const alternatesXml = new WeakMap()
function alternatesBlock(alternates) {
  let block = alternatesXml.get(alternates)
  if (!block) {
    const xml = alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}"/>`).join('\n')
    block = { xml, bytes: Buffer.byteLength(xml) }
    alternatesXml.set(alternates, block)
  }
  return block
}

const urlHead = (e) => [
  '  <url>',
  `    <loc>${escapeXml(e.loc)}</loc>`,
  e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
  `    <changefreq>${e.changefreq}</changefreq>`,
  `    <priority>${e.priority.toFixed(1)}</priority>`,
].filter(Boolean).join('\n')

// Extension elements (xhtml:link) come after the sitemaps.org ones, as the
// protocol's schema expects.
function renderUrl(e) {
  const alternates = e.alternates?.length ? alternatesBlock(e.alternates) : null
  return `${urlHead(e)}\n${alternates ? `${alternates.xml}\n` : ''}  </url>`
}

// Buffer.byteLength(renderUrl(e)), without building the string.
function urlBytes(e) {
  const alternates = e.alternates?.length ? alternatesBlock(e.alternates) : null
  return Buffer.byteLength(urlHead(e)) + 1 + (alternates ? alternates.bytes + 1 : 0) + '  </url>'.length
}

export function renderUrlset(entries) {
  return `${XML_HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.map(renderUrl).join('\n')}\n</urlset>\n`
}

// The XML declaration and <urlset> tags around the <url> entries of a file.
const URLSET_BYTES = Buffer.byteLength(renderUrlset([]))

export function renderIndex(files) {
  const items = files.map((f) => [
    '  <sitemap>',
    `    <loc>${escapeXml(f.loc)}</loc>`,
    f.lastmod ? `    <lastmod>${f.lastmod}</lastmod>` : null,
    '  </sitemap>',
  ].filter(Boolean).join('\n'))
  return `${XML_HEAD}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</sitemapindex>\n`
}

/* ── sitemap files ────────────────────────────────────────────────────── */

let last = null // { model, sitemap }

/**
 * The current sitemap, split into chunks of at most MAX_URLS_PER_SITEMAP
 * URLs and MAX_BYTES_PER_SITEMAP bytes. Rebuilt only when the cached site
 * model changes.
 */
export async function getSitemap() {
  const model = await getSiteModel()
  if (last && last.model === model) return last.sitemap
  const entries = sitemapEntries(model)
  const chunks = []
  let chunk = []
  let bytes = URLSET_BYTES
  for (const entry of entries) {
    const size = urlBytes(entry) + 1
    if (chunk.length && (chunk.length >= MAX_URLS_PER_SITEMAP || bytes + size > MAX_BYTES_PER_SITEMAP)) {
      chunks.push(chunk)
      chunk = []
      bytes = URLSET_BYTES
    }
    chunk.push(entry)
    bytes += size
  }
  if (chunk.length) chunks.push(chunk)
  const sitemap = { entries, chunks: chunks.length ? chunks : [[]] }
  last = { model, sitemap }
  return sitemap
}

/** Sitemap files for an index: one per chunk, or just /sitemap.xml. */
export function sitemapFiles(sitemap) {
  if (sitemap.chunks.length === 1) {
    return [{ loc: absolute('/sitemap.xml'), lastmod: newestLastmod(sitemap.entries) }]
  }
  return sitemap.chunks.map((chunk, i) => ({ loc: absolute(`/sitemap-${i + 1}.xml`), lastmod: newestLastmod(chunk) }))
}

function newestLastmod(entries) {
  const dates = entries.map((e) => e.lastmod).filter(Boolean).sort()
  return dates.length ? dates[dates.length - 1] : null
}

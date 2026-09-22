/**
 * Validate /llms.txt (https://llmstxt.org) and check that every link answers
 * HTTP 200 and is a canonical URL listed in the sitemap.
 *
 *   node scripts/validate-llms.mjs
 *       --llms <url>      llms.txt to check (default http://localhost:4000/llms.txt)
 *       --sitemap <url>   sitemap to compare with (default: same origin as --llms)
 *       --site <origin>   origin every link must use (default https://ktmessenger.com)
 *       --base <origin>   request pages from this origin instead of --site, e.g. a
 *                         local or staging build: --base http://localhost:5174
 *       --skip-http       only validate the file
 *
 * Exits with code 1 when anything fails.
 */
const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(name)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}
const LLMS = arg('--llms', 'http://localhost:4000/llms.txt')
const SITEMAP = arg('--sitemap', new URL('/sitemap.xml', LLMS).href)
const SITE = arg('--site', 'https://ktmessenger.com').replace(/\/+$/, '')
const BASE = arg('--base', '').replace(/\/+$/, '')
const SKIP_HTTP = args.includes('--skip-http')
const CONCURRENCY = 6

const problems = []
const fail = (msg) => problems.push(msg)
const LINK = /^- \[((?:\\.|[^\]\\])+)\]\((\S+?)\)(?:: (.+))?$/

const res = await fetch(LLMS)
const text = await res.text()
if (res.status !== 200) fail(`${LLMS}: HTTP ${res.status}`)
if (!/^text\/plain/i.test(res.headers.get('content-type') || '')) fail(`${LLMS}: content-type "${res.headers.get('content-type')}", expected text/plain`)

// Structure: H1 first, a blockquote summary before the first section, then
// H2 sections whose list items are Markdown links.
const lines = text.split('\n')
const firstLine = lines.find((l) => l.trim())
if (!/^# \S/.test(firstLine || '')) fail('first line must be an H1 title ("# Name")')
if ((text.match(/^# /gm) || []).length !== 1) fail('exactly one H1 is expected')
const firstSection = lines.findIndex((l) => l.startsWith('## '))
if (!lines.slice(0, firstSection === -1 ? lines.length : firstSection).some((l) => /^> \S/.test(l))) fail('a "> summary" blockquote is expected before the first section')
if (firstSection === -1) fail('no "## " sections found')

const links = []
let section = null
for (const [i, line] of lines.entries()) {
  if (line.startsWith('## ')) { section = line.slice(3); continue }
  if (!line.startsWith('- ')) continue
  const m = line.match(LINK)
  if (!m) { fail(`line ${i + 1}: list item is not "- [Title](URL): notes": ${line.slice(0, 80)}`); continue }
  if (!section) fail(`line ${i + 1}: link outside a "## " section`)
  links.push({ title: m[1], url: m[2], line: i + 1 })
}
console.log(`${LLMS}: ${links.length} links in ${(text.match(/^## /gm) || []).length} sections`)

const seen = new Set()
for (const { url, line } of links) {
  if (!url.startsWith(SITE + '/')) fail(`line ${line}: ${url} is not an absolute URL on ${SITE}`)
  if (/[?#]/.test(url)) fail(`line ${line}: ${url} has a query string or fragment`)
  if (/\/(api|admin|dashboard|auth|login)(\/|$)/i.test(url.slice(SITE.length))) fail(`line ${line}: ${url} is an internal route`)
  if (seen.has(url.toLowerCase())) fail(`line ${line}: duplicate ${url}`)
  seen.add(url.toLowerCase())
}

// Same canonical URLs as the sitemap (following a sitemap index to its files).
// llms.txt lists the default-language pages: the sitemap URLs whose x-default
// hreflang link is the URL itself.
const sitemapOrigin = new URL(SITEMAP).origin
async function sitemapUrls(url, depth = 0) {
  const xml = await fetch(url).then((r) => r.text()).catch(() => '')
  if (/<sitemapindex[\s>]/.test(xml)) {
    if (depth > 0) return []
    const files = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'))
    const all = []
    for (const file of files) all.push(...(await sitemapUrls(file.startsWith(SITE + '/') ? sitemapOrigin + file.slice(SITE.length) : file, depth + 1)))
    return all
  }
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const loc = ((m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1] || '').replace(/&amp;/g, '&')
    const xDefault = ((m[1].match(/hreflang="x-default" href="([^"]+)"/) || [])[1] || '').replace(/&amp;/g, '&')
    return { loc: loc.toLowerCase(), isDefault: !xDefault || xDefault === loc }
  })
}
const sitemap = await sitemapUrls(SITEMAP)
const inSitemap = new Set(sitemap.map((u) => u.loc))
if (!inSitemap.size) fail(`${SITEMAP}: could not read the sitemap to compare`)
for (const { url, line } of links) {
  if (/\/sitemap\.xml$/.test(url)) continue
  if (inSitemap.size && !inSitemap.has(url.toLowerCase())) fail(`line ${line}: ${url} is not in the sitemap`)
}
const onlyInSitemap = sitemap.filter((u) => u.isDefault && !seen.has(u.loc)).map((u) => u.loc)
if (onlyInSitemap.length) console.log(`In the sitemap but left out of llms.txt (test pages / duplicates): ${onlyInSitemap.length}\n  ${onlyInSitemap.join('\n  ')}`)

if (!SKIP_HTTP) {
  console.log(`Checking ${links.length} URLs${BASE ? ` against ${BASE}` : ''} ...`)
  let next = 0
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < links.length) {
      const { url } = links[next++]
      const target = BASE && url.startsWith(SITE + '/') && !/\/sitemap\.xml$/.test(url) ? BASE + url.slice(SITE.length) : /\/sitemap\.xml$/.test(url) ? SITEMAP : url
      try {
        const r = await fetch(target, { redirect: 'manual' })
        if (r.status !== 200) fail(`${url}: HTTP ${r.status}`)
      } catch (err) {
        fail(`${url}: ${err.message}`)
      }
    }
  }))
}

console.log(`\n${links.length} links, ${problems.length} problem(s)`)
for (const p of problems) console.log('  x ' + p)
if (!problems.length) console.log('llms.txt is valid' + (SKIP_HTTP ? '.' : ' and every link returned HTTP 200.'))
process.exitCode = problems.length ? 1 : 0

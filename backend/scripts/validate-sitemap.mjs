/**
 * Validate the XML sitemap against the sitemaps.org protocol and Google's
 * hreflang rules, and check that every listed URL answers HTTP 200.
 *
 *   node scripts/validate-sitemap.mjs
 *       --sitemap <url>   sitemap to check (default http://localhost:4000/sitemap.xml)
 *       --site <origin>   origin every URL must use (default https://ktmessenger.com)
 *       --base <origin>   request pages from this origin instead of --site, e.g. a
 *                         local or staging build: --base http://localhost:5174
 *       --skip-http       only validate the XML
 *
 * hreflang (https://developers.google.com/search/docs/specialty/international/localized-versions):
 * valid codes (ISO 639-1 language, optional ISO 15924 script and ISO 3166-1
 * alpha-2 region, or x-default), no duplicate code per URL, a link to the URL
 * itself and an x-default link, every alternate listed in the sitemap, and
 * return links — every version of a page lists the same alternates.
 *
 * Exits with code 1 when anything fails.
 */
const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(name)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}
const SITEMAP = arg('--sitemap', 'http://localhost:4000/sitemap.xml')
const SITE = arg('--site', 'https://ktmessenger.com').replace(/\/+$/, '')
const BASE = arg('--base', '').replace(/\/+$/, '')
const SKIP_HTTP = args.includes('--skip-http')
const CONCURRENCY = 6

const CHANGEFREQ = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
const W3C = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/
const XHTML_NS = 'xmlns:xhtml="http://www.w3.org/1999/xhtml"'
const problems = []
const fail = (msg) => problems.push(msg)

const tag = (xml, name) => [...xml.matchAll(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, 'g'))].map((m) => m[1].trim())
const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
const attr = (s, name) => (s.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1]

/* ── hreflang codes ───────────────────────────────────────────────────── */

// Code lists come from Node's ICU (CLDR) data. CLDR also knows codes ISO does
// not assign, which Google does not support, so those are rejected here.
const LANGUAGE = new Intl.DisplayNames(['en'], { type: 'language', fallback: 'none' })
const SCRIPT = new Intl.DisplayNames(['en'], { type: 'script', fallback: 'none' })
const REGION = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' })
// Withdrawn from ISO 639-1 (in, iw, ji, mo, sh) or never in it (jw).
const NOT_ISO_LANGUAGE = new Set(['in', 'iw', 'ji', 'jw', 'mo', 'sh'])
// Not assigned by ISO 3166-1: user-assigned (AA, QM-QZ, XA-XZ, ZZ),
// exceptionally reserved (AC, CP, DG, EA, EU, EZ, IC, TA, UK, UN) and withdrawn codes.
const NOT_ISO_REGION = /^(AA|Q[M-Z]|X[A-Z]|ZZ|AC|CP|DG|EA|EU|EZ|IC|TA|UK|UN|AN|BU|CS|DD|FX|NT|SU|TP|YU|ZR)$/

function hreflangProblem(code) {
  if (code === 'x-default') return null
  const m = /^([a-z]{2})(?:-([a-z]{4}))?(?:-([a-z]{2}))?$/i.exec(code || '')
  if (!m) return 'is not language[-Script][-REGION] (ISO 639-1 / ISO 15924 / ISO 3166-1 alpha-2) or x-default'
  const [, language, script, region] = m
  if (NOT_ISO_LANGUAGE.has(language.toLowerCase()) || !LANGUAGE.of(language.toLowerCase())) return `uses "${language}", which is not an ISO 639-1 language code`
  if (script && !SCRIPT.of(script[0].toUpperCase() + script.slice(1).toLowerCase())) return `uses "${script}", which is not an ISO 15924 script code`
  if (region && (NOT_ISO_REGION.test(region.toUpperCase()) || !REGION.of(region.toUpperCase()))) return `uses "${region}", which is not an ISO 3166-1 alpha-2 region code`
  return null
}

/* ── reading ──────────────────────────────────────────────────────────── */

// Sitemap files listed by an index live on the site origin; fetch them from
// wherever the checked sitemap is served.
const sitemapOrigin = new URL(SITEMAP).origin
const fetchable = (url) => (url.startsWith(SITE + '/') ? sitemapOrigin + url.slice(SITE.length) : url)

async function readSitemap(url, depth = 0) {
  const res = await fetch(url)
  const body = await res.text()
  if (res.status !== 200) { fail(`${url}: HTTP ${res.status}`); return [] }
  if (!/xml/i.test(res.headers.get('content-type') || '')) fail(`${url}: content-type is "${res.headers.get('content-type')}", expected XML`)
  if (!body.startsWith('<?xml')) fail(`${url}: missing XML declaration`)
  if (Buffer.byteLength(body) > 50 * 1024 * 1024) fail(`${url}: larger than 50 MB`)

  if (/<sitemapindex[\s>]/.test(body)) {
    if (depth > 0) { fail(`${url}: a sitemap index may not list another index`); return [] }
    if (!body.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) fail(`${url}: wrong or missing namespace`)
    const children = tag(body, 'loc').map(unescape)
    console.log(`${url}: sitemap index with ${children.length} sitemap(s)`)
    const all = []
    for (const child of children) {
      if (!child.startsWith(SITE + '/')) fail(`${url}: sitemap ${child} is not on ${SITE}`)
      all.push(...(await readSitemap(fetchable(child), depth + 1)))
    }
    return all
  }

  if (!/<urlset[\s>]/.test(body)) { fail(`${url}: neither <urlset> nor <sitemapindex>`); return [] }
  if (!body.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) fail(`${url}: wrong or missing namespace`)
  if (body.includes('<xhtml:link') && !body.includes(XHTML_NS)) fail(`${url}: hreflang links without the xhtml namespace (${XHTML_NS})`)
  const blocks = tag(body, 'url')
  if (blocks.length > 50000) fail(`${url}: ${blocks.length} URLs (limit 50,000)`)
  console.log(`${url}: ${blocks.length} URLs`)
  return blocks.map((b) => {
    const loc = unescape(tag(b, 'loc')[0] || '')
    const lastmod = tag(b, 'lastmod')[0]
    const changefreq = tag(b, 'changefreq')[0]
    const priority = tag(b, 'priority')[0]
    if (!loc) fail(`${url}: <url> without <loc>`)
    if (lastmod && !W3C.test(lastmod)) fail(`${loc}: lastmod "${lastmod}" is not a W3C datetime`)
    if (lastmod && new Date(lastmod) > new Date(Date.now() + 60_000)) fail(`${loc}: lastmod is in the future`)
    if (changefreq && !CHANGEFREQ.has(changefreq)) fail(`${loc}: invalid changefreq "${changefreq}"`)
    if (priority && !(Number(priority) >= 0 && Number(priority) <= 1)) fail(`${loc}: priority "${priority}" outside 0.0-1.0`)
    const alternates = [...b.matchAll(/<xhtml:link\s([^>]*?)\/?>/g)].map((m) => ({
      rel: attr(m[1], 'rel'),
      hreflang: attr(m[1], 'hreflang'),
      href: unescape(attr(m[1], 'href') || ''),
    }))
    return { loc, alternates }
  })
}

async function checkUrl(loc) {
  const target = BASE ? BASE + loc.slice(SITE.length) : loc
  try {
    const res = await fetch(target, { redirect: 'manual', headers: { 'User-Agent': 'KT-sitemap-validator' } })
    if (res.status !== 200) return `${loc}: HTTP ${res.status}${res.headers.get('location') ? ` -> ${res.headers.get('location')}` : ''}`
    if (!/text\/html/i.test(res.headers.get('content-type') || '')) return `${loc}: content-type "${res.headers.get('content-type')}"`
    return null
  } catch (err) {
    return `${loc}: ${err.message}`
  }
}

const urls = await readSitemap(SITEMAP)
const locs = urls.map((u) => u.loc)

// Protocol and SEO checks on the URL list.
const seen = new Set()
for (const loc of locs) {
  if (!loc.startsWith(SITE + '/')) fail(`${loc}: not an absolute URL on ${SITE}`)
  if (/[?#]/.test(loc)) fail(`${loc}: contains a query string or fragment`)
  if (loc !== SITE + '/' && loc.endsWith('/')) fail(`${loc}: trailing slash (canonical URLs have none)`)
  if (/\/(api|admin|login|dashboard|auth)(\/|$)/i.test(loc.slice(SITE.length))) fail(`${loc}: internal route`)
  const key = loc.toLowerCase()
  if (seen.has(key)) fail(`${loc}: duplicate`)
  seen.add(key)
}

// hreflang checks.
const byLoc = new Map(urls.map((u) => [u.loc, u]))
const clusterIds = new Map() // alternates signature -> id
const clusterOf = new Map() // loc -> id of its alternates signature
for (const { loc, alternates } of urls) {
  if (!alternates.length) continue
  const signature = alternates.map((a) => `${String(a.hreflang).toLowerCase()} ${a.href}`).sort().join('\n')
  if (!clusterIds.has(signature)) clusterIds.set(signature, clusterIds.size)
  clusterOf.set(loc, clusterIds.get(signature))
}
const languages = new Set()
const codeProblems = new Map() // hreflang -> problem, checked once per code
let annotated = 0
for (const { loc, alternates } of urls) {
  if (!alternates.length) continue
  annotated++
  const codes = new Set()
  for (const a of alternates) {
    const where = `${loc}: hreflang "${a.hreflang}"`
    if (a.rel !== 'alternate') fail(`${where}: rel="${a.rel}", expected "alternate"`)
    if (!codeProblems.has(a.hreflang)) codeProblems.set(a.hreflang, hreflangProblem(a.hreflang))
    const problem = codeProblems.get(a.hreflang)
    if (problem) fail(`${where} ${problem}`)
    const code = String(a.hreflang).toLowerCase()
    if (codes.has(code)) fail(`${where} appears more than once`)
    codes.add(code)
    if (code !== 'x-default') languages.add(a.hreflang)
    if (!a.href.startsWith(SITE + '/')) fail(`${where}: ${a.href} is not an absolute URL on ${SITE}`)
    else if (!byLoc.has(a.href)) fail(`${where}: ${a.href} is not a <loc> in the sitemap`)
    else if (clusterOf.get(a.href) !== clusterOf.get(loc)) fail(`${where}: ${a.href} does not link back with the same alternates`)
  }
  if (!alternates.some((a) => a.href === loc && a.hreflang !== 'x-default')) fail(`${loc}: no hreflang link to itself`)
  if (!codes.has('x-default')) fail(`${loc}: no x-default hreflang link`)
}
if (annotated) console.log(`hreflang: ${annotated} of ${urls.length} URLs annotated, ${languages.size} languages + x-default`)

if (!SKIP_HTTP) {
  console.log(`Checking ${locs.length} URLs${BASE ? ` against ${BASE}` : ''} ...`)
  let next = 0
  const results = []
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < locs.length) results.push(await checkUrl(locs[next++]))
  }))
  results.filter(Boolean).forEach(fail)
}

console.log(`\n${locs.length} URLs, ${problems.length} problem(s)`)
for (const p of problems.slice(0, 200)) console.log('  x ' + p)
if (problems.length > 200) console.log(`  ... and ${problems.length - 200} more`)
if (!problems.length) console.log('Sitemap is valid' + (SKIP_HTTP ? '.' : ' and every URL returned HTTP 200.'))
process.exitCode = problems.length ? 1 : 0

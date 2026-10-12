/**
 * Checks that https://ktmessenger.com/sitemap.xml is the live sitemap built
 * from the CMS — not the static file in public/ — and that every published
 * blog post is listed in it.
 *
 * WHY THIS EXISTS
 * The website and the API are separate hosts. The backend builds the real
 * sitemap (pages + blog posts + Help Center, in every language), but the
 * website host answers /sitemap.xml with the static public/sitemap.xml: 22
 * hardcoded URLs and no blog posts at all. robots.txt points search engines at
 * that static file, so a post published in admin never reaches a crawler
 * through the sitemap.
 *
 * Routing /sitemap*.xml on the website host to the API fixes it without
 * deploying anything. This script proves the routing is in place and, just as
 * importantly, that nothing else moved: the homepage, robots.txt, the blog
 * index and an article page are all checked afterwards.
 *
 * Usage:
 *   node scripts/verify-sitemap.mjs
 *
 * Exits 0 when everything passes, 1 on the first real failure. Reads only —
 * it never writes anything anywhere.
 *
 * Note: the sitemap children are a few MB each (every URL carries hreflang
 * alternates for all 64 languages), so a full run downloads ~25 MB.
 */

const SITE = (process.env.SITE_URL || 'https://ktmessenger.com').replace(/\/+$/, '')
const API = (process.env.API_URL || 'https://landing-api.ktmessenger.com').replace(/\/+$/, '')
const TIMEOUT_MS = 60000

/* ── reporting ────────────────────────────────────────────────────────── */

let failures = 0
let warnings = 0

const pass = (label, detail = '') => console.log(`  PASS  ${label}${detail ? `  — ${detail}` : ''}`)
const fail = (label, detail = '') => {
  failures++
  console.log(`  FAIL  ${label}${detail ? `\n          ${detail}` : ''}`)
}
const warn = (label, detail = '') => {
  warnings++
  console.log(`  WARN  ${label}${detail ? `\n          ${detail}` : ''}`)
}
const section = (title) => console.log(`\n${title}\n${'─'.repeat(title.length)}`)

/** Byte size in a form that is quick to read in a terminal. */
const mb = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${(n / 1024).toFixed(0)} KB`)

/* ── fetching ─────────────────────────────────────────────────────────── */

async function get(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'kt-verify-sitemap' },
    })
    const body = await res.text()
    return { ok: true, status: res.status, type: res.headers.get('content-type') || '', body }
  } catch (err) {
    return { ok: false, status: 0, type: '', body: '', error: err?.message || String(err) }
  }
}

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())

/* ── 1. is /sitemap.xml the live one? ─────────────────────────────────── */

async function checkSitemapSource() {
  section('1. /sitemap.xml comes from the CMS, not public/sitemap.xml')
  const url = `${SITE}/sitemap.xml`
  const res = await get(url)

  if (!res.ok) return fail(`${url} unreachable`, res.error), null
  if (res.status !== 200) return fail(`${url} returned ${res.status}`), null
  pass('reachable', `${res.status}, ${mb(res.body.length)}`)

  if (!/xml/i.test(res.type)) return fail('content-type is not XML', `got "${res.type}"`), null
  pass('content-type', res.type)

  // The static file is recognisable on sight: a hand-written comment header,
  // and it is a flat urlset with no blog posts in it.
  const isStatic =
    /These are the canonical URLs of the site/i.test(res.body) ||
    (/<urlset/.test(res.body) && !res.body.includes('/blog/'))
  if (isStatic) {
    return (
      fail(
        'still serving the STATIC public/sitemap.xml',
        'The routing rule is not active yet. /sitemap.xml must be rewritten to\n' +
          `          ${API}/sitemap.xml (a rewrite that keeps the URL, not a 301).`,
      ),
      null
    )
  }
  pass('not the static file')

  const isIndex = /<sitemapindex/.test(res.body)
  const isUrlset = /<urlset/.test(res.body)
  if (!isIndex && !isUrlset) return fail('body is neither <sitemapindex> nor <urlset>'), null
  pass('document type', isIndex ? '<sitemapindex>' : '<urlset>')

  return { isIndex, body: res.body }
}

/* ── 2. every child sitemap resolves as XML on the website host ───────── */

async function checkChildren(sitemap) {
  section('2. child sitemaps resolve as XML on the website host')
  if (!sitemap.isIndex) {
    pass('single-file sitemap', 'no children to check')
    return [sitemap.body]
  }

  const children = locs(sitemap.body)
  if (!children.length) return fail('index lists no child sitemaps'), []
  console.log(`  index lists ${children.length} child sitemap(s)`)

  const bodies = []
  for (const child of children) {
    const res = await get(child)
    const label = child.replace(SITE, '')
    if (!res.ok) {
      fail(label, res.error)
      continue
    }
    if (res.status !== 200) {
      fail(label, `status ${res.status}`)
      continue
    }
    // The failure this catches: the website host has no such file, so the SPA
    // fallback returns index.html and the crawler gets HTML instead of XML.
    if (/text\/html/i.test(res.type)) {
      fail(label, `returned HTML (${mb(res.body.length)}) — the SPA fallback, not a sitemap`)
      continue
    }
    if (!/<urlset/.test(res.body)) {
      fail(label, `no <urlset> in the body (content-type "${res.type}")`)
      continue
    }
    bodies.push(res.body)
    pass(label, `${locs(res.body).length} URLs, ${mb(res.body.length)}`)
  }

  // A child declared on the site host but served from elsewhere is not a
  // sitemap Google will accept, so check where the index points.
  const offSite = children.filter((c) => !c.startsWith(`${SITE}/`))
  if (offSite.length) warn('index points off-site', offSite.join('\n          '))
  else pass('all children are on the website host')

  return bodies
}

/* ── 3. every published post is listed ────────────────────────────────── */

async function checkBlogCoverage(bodies) {
  section('3. every published blog post is in the sitemap')
  const res = await get(`${API}/api/blog?pageSize=100`)
  if (!res.ok || res.status !== 200) return fail('blog API unreachable', res.error || `status ${res.status}`)

  let published
  try {
    const parsed = JSON.parse(res.body)
    published = parsed?.data?.items || parsed?.data || []
  } catch {
    return fail('blog API did not return JSON')
  }
  if (!Array.isArray(published) || !published.length) return warn('API reports no published posts — nothing to check')
  console.log(`  API reports ${published.length} published post(s)`)

  const all = bodies.join('\n')
  const listed = new Set([...all.matchAll(/\/blog\/([a-z0-9-]+)/gi)].map((m) => m[1]))
  pass('distinct blog slugs in sitemap', String(listed.size))

  const missing = published.map((p) => p.slug).filter((slug) => slug && !listed.has(slug))
  if (missing.length) {
    fail(
      `${missing.length} published post(s) missing from the sitemap`,
      missing.join(', ') +
        '\n          A post needs status PUBLISHED (or SCHEDULED with a past date) and a' +
        '\n          slug matching /^[a-z0-9-]+$/. The sitemap is also cached for' +
        '\n          SITEMAP_CACHE_SECONDS (default 600) — wait 10 minutes and re-run.',
    )
  } else {
    pass('all published posts listed')
  }

  const newest = published[0]
  if (newest?.slug) {
    const inSitemap = listed.has(newest.slug)
    const line = `${newest.slug} (published ${newest.publishedAt || 'unknown'})`
    if (inSitemap) pass('newest post is listed', line)
    else fail('newest post is NOT listed', line)
  }
}

/* ── 4. nothing else changed ──────────────────────────────────────────── */

async function checkNoRegression(published) {
  section('4. nothing else changed')

  const page = async (path, label) => {
    const res = await get(`${SITE}${path}`)
    if (!res.ok) return fail(label, res.error)
    if (res.status !== 200) return fail(label, `status ${res.status}`)
    if (!/text\/html/i.test(res.type)) return fail(label, `expected HTML, got "${res.type}"`)
    pass(label, `${res.status} ${mb(res.body.length)}`)
  }

  await page('/', 'homepage still served')
  await page('/messaging-social-media-blog', 'blog index still served')
  await page('/calling', 'a feature page still served')
  if (published) await page(`/blog/${published}`, 'an article page still served')

  // robots.txt is deliberately static and must keep pointing at /sitemap.xml:
  // that URL is now the live sitemap, so the existing line becomes correct by
  // itself and must not be edited.
  const robots = await get(`${SITE}/robots.txt`)
  if (!robots.ok || robots.status !== 200) fail('robots.txt', robots.error || `status ${robots.status}`)
  else if (!new RegExp(`Sitemap:\\s*${SITE}/sitemap\\.xml`, 'i').test(robots.body))
    fail('robots.txt no longer declares the sitemap', robots.body.split('\n').filter((l) => /sitemap/i.test(l)).join(' | '))
  else pass('robots.txt still declares', `${SITE}/sitemap.xml`)
}

/* ── run ──────────────────────────────────────────────────────────────── */

async function newestSlug() {
  const res = await get(`${API}/api/blog?pageSize=1`)
  try {
    const parsed = JSON.parse(res.body)
    return (parsed?.data?.items || parsed?.data || [])[0]?.slug || null
  } catch {
    return null
  }
}

async function main() {
  console.log(`Verifying sitemap routing\n  site: ${SITE}\n  api:  ${API}`)

  const sitemap = await checkSitemapSource()
  if (!sitemap) {
    section('Result')
    console.log(`  ${failures} check(s) failed. Fix the routing first, then re-run.`)
    return
  }

  const bodies = await checkChildren(sitemap)
  await checkBlogCoverage(bodies)
  await checkNoRegression(await newestSlug())

  section('Result')
  if (failures) console.log(`  ${failures} failed, ${warnings} warning(s).`)
  else console.log(`  All checks passed${warnings ? `, ${warnings} warning(s)` : ''}.`)
}

await main()
// Set the code rather than calling process.exit(): on Windows, exiting while
// fetch still holds keep-alive sockets trips a libuv assertion and reports 127
// instead of the real result. Node exits on its own once the sockets idle out.
process.exitCode = failures ? 1 : 0

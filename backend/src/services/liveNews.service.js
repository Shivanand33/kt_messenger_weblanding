import { env } from '../config/env.js'

/**
 * Live headlines from the KT news service.
 *
 * The website cannot call that service directly: it is authenticated with
 * NEWS_API_KEY, and anything the browser sends is readable by whoever opens
 * devtools. So the key stays here and the website asks this API instead.
 *
 * Only the headline, a one-line summary, the picture and a link back to the
 * publisher are passed on. The upstream payload also carries the full article
 * text; that belongs to the publisher, so it is dropped rather than reprinted
 * on our pages.
 */

/** The upstream wants both: the key authenticates, the client id identifies the caller. */
const HEADERS = () => ({
  'X-API-Key': env.news.apiKey,
  'X-Client-ID': env.news.clientId,
  accept: 'application/json',
})

/** The upstream returns nothing at all above 100, so never ask for more. */
const MAX_LIMIT = 100

/**
 * How many pages of MAX_LIMIT to pull.
 *
 * One page is plenty for the headlines themselves, but the publisher tally is
 * built from the same batch, and over 100 stories most publishers appear once
 * or twice — too thin to be worth showing. Three pages puts the leaders in the
 * teens and twenties, which is both more useful and more honest about who
 * actually files the news. A page costs ~380 KB and ~0.2 s, they are fetched
 * together, and the result is cached, so this runs a few times an hour.
 */
const PAGES = 3

const CACHE_MS = env.news.cacheSeconds * 1000

let cache = null // { at, feed: { articles, sources } }
let building = null

/** True once NEWS_API_KEY is set; the route answers "no live news" until then. */
export const liveNewsConfigured = () => Boolean(env.news.apiKey)

/* ── normalising ──────────────────────────────────────────────────────── */

/**
 * The upstream's own image proxy, which re-encodes the publisher's picture:
 * the same photo comes back as a ~30 KB WebP instead of a multi-megabyte
 * JPEG. It is served over plain http in the payload, which a browser on our
 * https pages would refuse to load, so the scheme is upgraded. The publisher's
 * original URL is the fallback when no proxy link is given.
 */
function imageFor(row) {
  const proxy = typeof row.image_proxy_url === 'string' ? row.image_proxy_url.trim() : ''
  if (proxy) return proxy.replace(/^http:\/\//i, 'https://')
  const direct = typeof row.image_url === 'string' ? row.image_url.trim() : ''
  return direct.startsWith('https://') ? direct : null
}

/** A headline we can actually render, or null to skip the row. */
function normalise(row) {
  const title = typeof row.title === 'string' ? row.title.trim() : ''
  const url = typeof row.url === 'string' ? row.url.trim() : ''
  if (!title || !/^https?:\/\//i.test(url)) return null

  const published = row.published_at ? new Date(row.published_at) : null
  return {
    id: String(row.id ?? url),
    title,
    // The upstream repeats the headline in `description` for some rows; a
    // summary that only echoes the title adds nothing, so it is left out.
    summary:
      typeof row.description === 'string' && row.description.trim() && row.description.trim() !== title
        ? row.description.trim()
        : '',
    url,
    source: typeof row.source_name === 'string' ? row.source_name.trim() : '',
    author: typeof row.author === 'string' && row.author.trim() ? row.author.trim() : null,
    publishedAt: published && !Number.isNaN(published.getTime()) ? published.toISOString() : null,
    image: imageFor(row),
  }
}

/* ── fetching ─────────────────────────────────────────────────────────── */

/** One page of the upstream feed. */
async function fetchPage(offset) {
  const url = new URL('/news', env.news.baseUrl)
  url.searchParams.set('limit', String(MAX_LIMIT))
  url.searchParams.set('offset', String(offset))

  const res = await fetch(url, {
    headers: HEADERS(),
    signal: AbortSignal.timeout(env.news.timeoutMs),
  })
  if (!res.ok) throw new Error(`news upstream ${res.status}`)

  const body = await res.json()
  return Array.isArray(body?.results) ? body.results : []
}

/**
 * Who filed how many of these stories, busiest first.
 *
 * Exported because the counts have to describe exactly the set of articles the
 * website is holding — they label a filter the reader can apply, so a count
 * taken over a wider set than the one being filtered would simply be wrong.
 */
export function tallySources(articles) {
  const counts = new Map()
  for (const { source } of articles) {
    if (source) counts.set(source, (counts.get(source) || 0) + 1)
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

async function fetchUpstream() {
  const offsets = Array.from({ length: PAGES }, (_, i) => i * MAX_LIMIT)
  const pages = await Promise.allSettled(offsets.map(fetchPage))

  // The first page carries the newest stories and is the one the page cannot
  // do without; the later pages only deepen the publisher tally, so losing one
  // is not worth failing over.
  if (pages[0].status === 'rejected') throw pages[0].reason
  const rows = pages.filter((p) => p.status === 'fulfilled').flatMap((p) => p.value)

  // The same story reaches the feed from more than one wire, so keep the
  // first copy of each link and drop the rest.
  const seen = new Set()
  const articles = []
  for (const row of rows) {
    const article = normalise(row)
    if (!article || seen.has(article.url)) continue
    seen.add(article.url)
    articles.push(article)
  }
  // Newest first, whatever order the upstream used.
  articles.sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
  return { articles, sources: tallySources(articles) }
}

/* ── public ───────────────────────────────────────────────────────────── */

/**
 * The current headlines and the publisher tally, cached for
 * NEWS_CACHE_SECONDS. Concurrent callers share one upstream request.
 *
 * If the upstream fails while we still hold an older copy, that copy is served
 * instead: slightly stale headlines are better than an empty section, and the
 * next caller after the cache window tries again.
 *
 * @returns {Promise<{articles: object[], sources: {name: string, count: number}[]}>}
 */
export async function getLiveNews() {
  if (!liveNewsConfigured()) return { articles: [], sources: [] }
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.feed

  if (!building) {
    building = fetchUpstream()
      .then((feed) => {
        cache = { at: Date.now(), feed }
        return feed
      })
      .catch((err) => {
        console.error('[live-news] fetch failed:', err?.message || err)
        if (cache) return cache.feed
        throw err
      })
      .finally(() => {
        building = null
      })
  }
  return building
}

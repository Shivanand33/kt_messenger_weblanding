/**
 * Per-post metadata for /blog/<slug>, written into the HTML before it leaves
 * Cloudflare.
 *
 * WHY
 * The website is a single-page app. Every blog URL is served the same shell
 * document, and the post's real title, description, cover image and Article
 * schema are added by React once the bundle runs. Anything that does not
 * execute JavaScript therefore sees the generic site card: share a post on
 * WhatsApp, Facebook, X or LinkedIn and the preview shows "KTMessenger |
 * Secure Messaging App…" pointing at the homepage, whichever post it is.
 *
 * This Worker sits in front of the origin, fetches the post from the public
 * API and rewrites the shell's existing tags on the way through. Nothing is
 * rebuilt or redeployed — publish a post in admin and the next request to it
 * already carries the right metadata.
 *
 * SAFETY
 * Every failure path returns the origin response untouched: a non-HTML
 * response, a non-article URL, a slow or broken API, an unknown slug. The
 * Worker can only ever add correct metadata or change nothing at all.
 *
 * WORKS WITH THE APP, NOT AGAINST IT
 * useSeo() upserts — it reuses an existing <title>/<meta>/<link rel=canonical>
 * rather than appending a second one — and <JsonLd> renders nothing when a
 * script with the same data-jsonld id is already in the document. So the tags
 * written here are adopted by the app on boot instead of being duplicated.
 */

const API = 'https://landing-api.ktmessenger.com'
const SITE = 'https://ktmessenger.com'

/** The site-wide card in index.html, used when a post has no cover of its own. */
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`

/** Marks our own origin fetch, so a route that re-enters the Worker cannot loop. */
const LOOP_HEADER = 'x-kt-blog-meta'

/** How long Cloudflare may reuse an API response. Short, so a fresh publish shows up quickly. */
const API_CACHE_SECONDS = 60

/** Give up on the API rather than delaying the page. */
const API_TIMEOUT_MS = 2000

/**
 * The crawler files the API builds from the CMS, which the website host
 * answers from the static copies in public/ instead — so they list the pages
 * that existed when the site was last built and never a blog post.
 *
 * Serving them from the API here makes a post published in admin reach the
 * sitemap without the site being rebuilt or the backend redeployed: the API
 * already builds these, it is just unreachable at these URLs.
 *
 * /sitemap.xml is an index pointing at /sitemap-1.xml and friends ON THIS
 * HOST, so the children have to be served here too or the index leads nowhere.
 */
const CRAWLER_FILES = /^\/(sitemap\.xml|sitemap-index\.xml|sitemap-[1-9]\d*\.xml|llms\.txt)$/

/**
 * Longer than the article timeout: a sitemap part is several megabytes, and
 * this covers streaming the body, not just the first byte. A crawler waiting a
 * few seconds is fine; being handed a stale file is not.
 */
const CRAWLER_TIMEOUT_MS = 20000

/**
 * Language prefixes the site serves, and the few whose URL segment differs
 * from the language tag. Kept identical to the list in index.html — a prefix
 * missing here simply means that URL is treated as a plain /blog/ path.
 */
const LANG_PREFIXES = new Set(
  'es pt fr de it nl pl ru uk tr ar he fa hi bn gu mr pa ur ta te kn ml si ne th vi id ms tl zh-hans zh-hant ja ko sw af zu ha yo am sq az be bg ca hr cs da et fi ka el hu is ga kk lv lt mk no ro sr sk'.split(
    ' ',
  ),
)
const LANG_TAG = { tl: 'fil', 'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant' }

/* ------------------------------------------------------------------ utils */

/** Escape for use inside a double-quoted HTML attribute. */
const attr = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Escape for use as HTML text (the <title> body). */
const text = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/**
 * Uploaded media is served by the API and only by the API. A stored URL may
 * name the website instead — the site host answers /uploads/* with index.html,
 * which would make og:image a broken card. Mirrors src/utils/mediaUrl.js.
 */
const UPLOADS_URL = /^(?:https?:\/\/[^/]+)?(\/uploads\/[^\s"']*)$/i
export function mediaUrl(url) {
  if (typeof url !== 'string' || !url) return null
  const match = url.match(UPLOADS_URL)
  if (match) return `${API}${match[1]}`
  if (url.startsWith('/')) return `${SITE}${url}`
  return /^https?:\/\//i.test(url) ? url : null
}

/**
 * `/blog/<slug>` or `/<lang>/blog/<slug>`.
 * Returns null for the blog index, nested paths and everything else.
 */
export function parseArticlePath(pathname) {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  if (parts.length === 2 && parts[0] === 'blog') {
    return { slug: parts[1], prefix: '', lang: null }
  }
  if (parts.length === 3 && parts[1] === 'blog' && LANG_PREFIXES.has(parts[0].toLowerCase())) {
    const seg = parts[0].toLowerCase()
    return { slug: parts[2], prefix: `/${seg}`, lang: LANG_TAG[seg] || seg }
  }
  return null
}

/* ----------------------------------------------------------------- schema */

/**
 * The post's Article schema: the block written in admin when there is one,
 * otherwise generated from the post. Mirrors articleSchema() in
 * src/pages/Blog/BlogPage.jsx so both renderings agree.
 */
export function articleSchema(post, url, image) {
  if (post.schemaJson && String(post.schemaJson).trim()) {
    try {
      return JSON.stringify(JSON.parse(post.schemaJson))
    } catch {
      return null // a broken custom block is worse than none
    }
  }
  const org = { '@type': 'Organization', name: 'KT Messenger' }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    url,
    image: image || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: org,
    publisher: org,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  })
}

/* ------------------------------------------------------------------ fetch */

async function fetchPost(slug, lang) {
  const url = new URL(`${API}/api/blog/${encodeURIComponent(slug)}`)
  if (lang) url.searchParams.set('lang', lang)
  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cf: { cacheTtl: API_CACHE_SECONDS, cacheEverything: true },
    })
    if (!res.ok) return null
    const body = await res.json()
    const post = body?.data
    return post && post.title ? post : null
  } catch {
    return null // unreachable, slow or malformed — the page still renders
  }
}

/* --------------------------------------------------------------- rewriter */

/** Sets one attribute on whatever element the selector matched. */
class SetAttr {
  constructor(name, value) {
    this.name = name
    this.value = value
  }
  element(el) {
    if (this.value) el.setAttribute(this.name, this.value)
  }
}

/** Replaces the text of an element (used for <title>). */
class SetText {
  constructor(value) {
    this.value = value
  }
  element(el) {
    if (this.value) el.setInnerContent(this.value, { html: true })
  }
}

/** Drops any canonical the origin already wrote, so ours is the only one. */
class DropElement {
  element(el) {
    el.remove()
  }
}

/** Adds the tags the shell has no slot for. */
class AppendToHead {
  constructor(html) {
    this.html = html
  }
  element(el) {
    el.append(this.html, { html: true })
  }
}

export function rewrite(response, post, { url, image, title, description, schema }) {
  const head = [`<link rel="canonical" href="${attr(url)}" />`]
  if (schema) {
    // Same id the app uses, so <JsonLd> stands down instead of adding a copy.
    head.push(
      `<script type="application/ld+json" data-jsonld="blog-${attr(post.slug)}">${schema.replace(/</g, '\\u003c')}</script>`,
    )
  }

  let rewriter = new HTMLRewriter()
    .on('title', new SetText(text(title)))
    .on('meta[name="description"]', new SetAttr('content', description))
    .on('meta[property="og:type"]', new SetAttr('content', 'article'))
    .on('meta[property="og:title"]', new SetAttr('content', title))
    .on('meta[property="og:description"]', new SetAttr('content', description))
    .on('meta[property="og:url"]', new SetAttr('content', url))
    .on('meta[property="og:image"]', new SetAttr('content', image))
    .on('meta[name="twitter:title"]', new SetAttr('content', title))
    .on('meta[name="twitter:description"]', new SetAttr('content', description))
    .on('meta[name="twitter:image"]', new SetAttr('content', image))
    .on('link[rel="canonical"]', new DropElement())
    .on('head', new AppendToHead(head.join('')))

  // index.html declares the dimensions of the site-wide card. A post's own
  // cover is a different image, and leaving someone else's width/height beside
  // it makes scrapers crop the preview to the wrong shape — better to state
  // nothing and let them read the file.
  if (image !== DEFAULT_IMAGE) {
    rewriter = rewriter
      .on('meta[property="og:image:width"]', new DropElement())
      .on('meta[property="og:image:height"]', new DropElement())
  }

  return rewriter.transform(response)
}

/* ---------------------------------------------------------------- crawler */

/**
 * Serves /sitemap*.xml and /llms.txt from the API, which builds them from the
 * CMS, instead of from the stale static copies on the website host.
 *
 * Returns null when the API cannot be reached, and the caller then falls back
 * to whatever the website host was already serving: an out-of-date sitemap is
 * worse than a fresh one, but far better than none.
 */
async function crawlerFile(pathname) {
  try {
    const res = await fetch(`${API}${pathname}`, {
      signal: AbortSignal.timeout(CRAWLER_TIMEOUT_MS),
      headers: { accept: 'application/xml, text/plain, */*' },
    })
    if (!res.ok) return null
    // Passed straight through, so the API's own content-type, Cache-Control
    // and X-Robots-Tag are the ones the crawler sees. The body streams rather
    // than being buffered — these files run to several megabytes.
    return res
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ entry */

export default {
  async fetch(request) {
    // Our own origin fetch coming back round: serve it and stop.
    if (request.headers.get(LOOP_HEADER)) return fetch(request)

    // Only a page load. A HEAD carries no body to rewrite, and anything else
    // is not a document request.
    if (request.method !== 'GET') return fetch(request)

    const { pathname } = new URL(request.url)

    if (CRAWLER_FILES.test(pathname)) {
      return (await crawlerFile(pathname)) || fetch(request)
    }

    const route = parseArticlePath(pathname)
    if (!route) return fetch(request)

    const originRequest = new Request(request)
    originRequest.headers.set(LOOP_HEADER, '1')
    const response = await fetch(originRequest)

    // Only touch an HTML page that was actually served.
    if (!response.ok) return response
    if (!(response.headers.get('content-type') || '').includes('text/html')) return response

    const post = await fetchPost(route.slug, route.lang)
    if (!post) return response

    const url = `${SITE}${route.prefix}/blog/${route.slug}`
    const image = mediaUrl(post.ogImage) || mediaUrl(post.coverUrl) || DEFAULT_IMAGE
    const title = `${post.seoTitle || post.title} · KT Messenger Blog`
    const description = post.seoDescription || post.excerpt || ''
    const schema = articleSchema(post, url, image)

    return rewrite(response, post, { url, image, title, description, schema })
  },
}

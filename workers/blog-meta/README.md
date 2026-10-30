# blog-meta — what crawlers get, fixed at the edge

One Cloudflare Worker handles the canonical WWW redirect and two crawler jobs
before any browser JavaScript runs:

0. **Canonical domain.** All non-API WWW URLs return HTTP 301 to the equivalent
   `https://ktmessenger.com` path and query. `/api` and `/api/*` retain their
   existing behavior. See [redirect deployment and verification](REDIRECT.md).

1. **Blog articles.** Fills in each post's `<title>`, meta description, social
   card tags, canonical link and Article schema **before the HTML leaves
   Cloudflare** — so crawlers and link scrapers see the post instead of the
   homepage.
2. **`/sitemap*.xml` and `/llms.txt`.** Serves the live files the API builds
   from the CMS, instead of the static copies in `public/` that the website
   host answers with today — so a post published in admin reaches the sitemap.

Nothing in the site, the admin panel or the backend changes, and **neither job
needs the backend redeployed**: the API already builds all of this, it is just
unreachable at these URLs. The Worker is a separate deployment.

The one thing it cannot do without a backend deploy is a *custom* per-post
schema: the production API does not return the `schemaJson` column yet, so
every post gets the generated Article schema until the backend ships. See
**Notes**.

## The problem it solves

The site is a single-page app. Every blog URL is served the same
`dist/index.html`, and React fills in the real metadata after the bundle runs.
Anything that only reads the first HTML response sees the site defaults. Today,
for **every** article:

| In the raw HTML of `/blog/<any-slug>` | Value served |
| --- | --- |
| `<title>` | `KTMessenger \| Secure Messaging App For Private Messaging.` |
| `og:title` / `twitter:title` | the same homepage title |
| `og:url` | `https://ktmessenger.com/` |
| `og:image` | the generic site card |
| `link rel=canonical` | `https://ktmessenger.com/` — **every post declares the homepage as its canonical** |
| Article schema | absent |

So a shared post shows the wrong preview, and search engines are told the page
is a duplicate of the homepage.

With the Worker, the same request carries the post's own title and description,
its cover image, `og:type=article`, a canonical pointing at the post, and its
Article JSON-LD — with no rebuild and no redeploy of the site. Publish in admin
and the next request to that URL is already correct.

It also repairs the image host: covers are stored as
`https://ktmessenger.com/uploads/…`, but the website answers `/uploads/*` with
`index.html`, so that URL returns `text/html` and the card breaks. The Worker
emits the API's own host, which returns the actual image. (Same rule as
`src/utils/mediaUrl.js`.)

## What it deliberately does not touch

- **On the apex domain, only the existing article/crawler routes reach the
  Worker.** On WWW, all paths reach it: non-API requests redirect, while
  `/api` and `/api/*` pass through. Metadata rewriting still only applies to GET.
- **`/robots.txt` is left alone.** It is deliberately static, and the line it
  already carries — `Sitemap: https://ktmessenger.com/sitemap.xml` — becomes
  correct by itself once that URL serves the live file.
- **For the metadata/crawler jobs, every failure path returns the origin response unchanged** — a non-HTML
  response, a non-200, an unknown slug, a slow or broken API, a malformed
  custom schema block. If the API cannot be reached for a sitemap, the static
  copy the host was already serving is returned. The Worker can only add
  correct metadata or do nothing.
- **The crawler files are passed straight through**, body streamed, with the
  API's own `Content-Type`, `Cache-Control` and `X-Robots-Tag`. Nothing is
  rewritten — a sitemap part runs to ~10 MB.
- **It replaces tags, never appends them.** `og:title` and friends already
  exist in `index.html`; the Worker rewrites their `content`. Only the
  canonical and the JSON-LD script are added, and any canonical the origin
  wrote is removed first, so there is always exactly one.
- **The three existing schema blocks** (`ORGANIZATION_SCHEMA`,
  `WEBSITE_SCHEMA`, `WEBPAGE_SCHEMA`) are left exactly as they are.

## Why the app does not fight it

- `useSeo()` *upserts*: it reuses an existing `<title>`, `<meta>` or
  `<link rel="canonical">` instead of appending a second one. The Worker's tags
  are adopted on boot, not duplicated.
- `<JsonLd>` renders nothing when a script with the same `data-jsonld` id is
  already in the document. The Worker uses exactly `blog-<slug>`, the id
  `BlogPage.jsx` would use, so React stands down.

The generated schema mirrors `articleSchema()` in
`src/pages/Blog/BlogPage.jsx` — same `headline` (the post title, not the SEO
title), same `url`/`@id`, same author and publisher — so the server-side and
client-side renderings agree.

## Deploy

```bash
cd workers/blog-meta
npx wrangler deploy
```

Check `zone_name` in `wrangler.toml` matches the zone serving the site. No
secrets, bindings or environment variables are needed; the API and site
origins are constants at the top of `src/worker.js`.

**If the site is hosted on Cloudflare Pages**, routes do not apply — add
`functions/_middleware.js` to the site instead, re-exporting the handler:

```js
import worker from '../workers/blog-meta/src/worker.js'
export const onRequest = (ctx) => worker.fetch(ctx.request)
```

(The loop guard in the Worker is what makes this safe: its own origin
subrequest is marked and passed straight through.)

## Verify after deploying

```bash
curl -s https://ktmessenger.com/blog/best-social-media-sites | grep -E '<title>|canonical|og:(title|url|image|type)|data-jsonld="blog-'
```

Expected: the post's title, a canonical pointing at the post, `og:type=article`,
an `og:image` on `landing-api.ktmessenger.com`, and one
`data-jsonld="blog-<slug>"` script. Then confirm nothing else moved:

```bash
curl -s https://ktmessenger.com/ | grep -c '<title>KTMessenger'   # 1 — homepage untouched
curl -s https://ktmessenger.com/blog/no-such-post | grep -c 'data-jsonld="blog-'   # 0 — unknown slug untouched
```

Then the crawler files:

```bash
curl -s https://ktmessenger.com/sitemap.xml | head -3        # <sitemapindex>, not <urlset>
curl -s https://ktmessenger.com/sitemap-1.xml | grep -c /blog/   # thousands, not 0
curl -s https://ktmessenger.com/llms.txt | grep -c /blog/        # one line per post
```

A `<urlset>` with no `/blog/` URLs means the request is still being answered by
`public/sitemap.xml` — the route is not matching.

Social cards can be re-scraped with Facebook's Sharing Debugger and X's Card
Validator; structured data with Google's Rich Results Test. Re-submit
`sitemap.xml` in Google Search Console once it serves the live file.

## Notes

- **Custom per-post schema.** When the API returns `schemaJson` (the field
  added in `7a2e804`), the Worker emits that block verbatim instead of a
  generated one, and falls back to generating when it is absent or malformed.
  Until the backend change is deployed the API does not return it, so every
  post gets a generated Article — which is why the generated path is the
  well-tested one.
- **`dateModified`** uses `updatedAt` when the API returns it and
  `publishedAt` otherwise, for the same reason.
- **API responses are cached for 60 seconds** at the edge (`API_CACHE_SECONDS`),
  and the API call is abandoned after 2 seconds (`API_TIMEOUT_MS`) rather than
  delaying the page.
- **hreflang links are not injected.** React still writes them; adding 64
  `<link rel="alternate">` tags per request was not worth the payload, and the
  canonical already resolves the duplicate-content problem.
- `mediaUrl`, `parseArticlePath`, `articleSchema` and `rewrite` are exported
  alongside the default handler so they can be exercised directly in a test
  worker.

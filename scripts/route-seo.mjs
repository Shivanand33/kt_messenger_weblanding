import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Every page describes itself with a static useSeo({ title, description,
 * path }) call in its source. This reads those values straight out of the
 * page files, so the static HTML a route serves can carry the same <title>
 * and meta description the SPA sets after boot — without a second copy of the
 * strings to keep in sync. Pages that build their SEO dynamically (the blog
 * article view) simply yield nothing here and keep the shell's tags.
 */

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.name.endsWith('.jsx')) yield full
  }
}

const SEO_BLOCK = /useSeo\(\s*\{([\s\S]*?)\}\s*\)/g

function field(block, name) {
  const m = block.match(new RegExp(`${name}:\\s*'((?:[^'\\\\]|\\\\.)*)'`))
  return m ? m[1].replace(/\\'/g, "'") : null
}

/** Map of route path ('/video-calling-app') -> { title, description }. */
export function routeSeoMap() {
  const map = new Map()
  for (const file of walk(path.join(root, 'src', 'pages'))) {
    const src = fs.readFileSync(file, 'utf8')
    for (const m of src.matchAll(SEO_BLOCK)) {
      const block = m[1]
      const route = field(block, 'path')
      const title = field(block, 'title')
      const description = field(block, 'description')
      if (route && (title || description) && !map.has(route)) {
        map.set(route, { title, description })
        break // the first fully static block in a file wins
      }
    }
  }
  return map
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function replaceMeta(html, attr, key, value) {
  if (!value) return html
  // \s+ between attributes so multi-line <meta\n name="..."\n content="..."\n/>
  // (the shell's description tag) matches just like single-line ones.
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`)
  return html.replace(re, `$1${esc(value)}$2`)
}

export const ORIGIN = 'https://ktmessenger.com'

/**
 * The URL a prerendered route is actually served at.
 *
 * The build writes each route to its own folder, so the static host answers
 * `/news/` and redirects `/news` to it. A canonical or hreflang naming the
 * bare path therefore points at a redirect rather than at the page, which is
 * what made every language alternate fail validation. The dev server has no
 * folders and answers the bare path, so it keeps passing the route unchanged.
 */
export const servedPath = (route) => (route === '/' ? '/' : `${route.replace(/\/+$/, '')}/`)

/**
 * Rewrite an HTML document's title and meta description (plus the matching
 * Open Graph / X tags) for one route. Tags that are not present are left
 * alone, so this is safe on any template.
 *
 * `urlPath` is the path the canonical and og:url name, for callers that serve
 * the route at a different URL than the route string (the build, which serves
 * it from a folder). It defaults to the route, which is what the dev server
 * answers.
 */
export function applyRouteSeo(html, route, seo, urlPath = route) {
  // Canonical for the served route, present in the raw HTML too. useSeo()
  // finds this tag at runtime (upsertCanonical matches link[rel=canonical])
  // and reuses it, so the rendered DOM never carries a duplicate.
  if (!/<link\s+rel="canonical"/.test(html)) {
    html = html.replace('</head>', `    <link rel="canonical" href="${ORIGIN}${urlPath}" />\n  </head>`)
  }
  if (!seo) return html
  if (seo.title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
    html = replaceMeta(html, 'property', 'og:title', seo.title)
    html = replaceMeta(html, 'name', 'twitter:title', seo.title)
  }
  if (seo.description) {
    html = replaceMeta(html, 'name', 'description', seo.description)
    html = replaceMeta(html, 'property', 'og:description', seo.description)
    html = replaceMeta(html, 'name', 'twitter:description', seo.description)
  }
  return replaceMeta(html, 'property', 'og:url', `${ORIGIN}${urlPath}`)
}

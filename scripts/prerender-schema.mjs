import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCHEMA_ROUTES, schemaTagsFor } from './schema-blocks.mjs'
import { routeSeoMap, applyRouteSeo } from './route-seo.mjs'

// Injects every page's JSON-LD schema into the static HTML served for its
// route, so the structured data is present in the initial document — view
// source, SEO extensions reading the raw HTML, and crawlers that do not run
// JavaScript all see it, instead of only after the SPA renders. The JsonLd
// component skips its own client copy when the static one is present, so the
// rendered DOM never carries duplicates.
//
// The same files also get the route's own <title> and meta description
// (read from each page's useSeo call by scripts/route-seo.mjs), so the raw
// HTML no longer shows the shell's shared title on every page.

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('</head>')) throw new Error('dist/index.html has no </head>')

const seoMap = routeSeoMap()
const routes = new Set([...SCHEMA_ROUTES.map(([route]) => route), ...seoMap.keys()])

let wrote = 0
for (const route of routes) {
  let html = template
  const tags = schemaTagsFor(route)
  if (tags) html = html.replace('</head>', `${tags}\n  </head>`)
  html = applyRouteSeo(html, route, seoMap.get(route))
  if (html === template) continue
  const outDir = route === '/' ? dist : path.join(dist, ...route.split('/').filter(Boolean))
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
  wrote += 1
}
console.log(`prerender-schema: injected schemas + route SEO into ${wrote} route HTML file(s)`)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCHEMA_ROUTES, schemaTagsFor } from './schema-blocks.mjs'

// Injects every page's JSON-LD schema into the static HTML served for its
// route, so the structured data is present in the initial document — view
// source, SEO extensions reading the raw HTML, and crawlers that do not run
// JavaScript all see it, instead of only after the SPA renders. The JsonLd
// component skips its own client copy when the static one is present, so the
// rendered DOM never carries duplicates.

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('</head>')) throw new Error('dist/index.html has no </head>')

let wrote = 0
for (const [route] of SCHEMA_ROUTES) {
  const tags = schemaTagsFor(route)
  if (!tags) continue
  const html = template.replace('</head>', `${tags}\n  </head>`)
  const outDir = route === '/' ? dist : path.join(dist, ...route.split('/').filter(Boolean))
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
  wrote += 1
}
console.log(`prerender-schema: injected schemas into ${wrote} route HTML file(s)`)

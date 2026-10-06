import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCHEMA_ROUTES, schemaTagsFor } from './schema-blocks.mjs'
import { routeSeoMap, applyRouteSeo } from './route-seo.mjs'
import { SUPPORTED_LANGS, RTL_LANGS } from '../src/i18n/translations.js'

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
//
// And because every language lives at its own URL prefix (/tr/..., /hi/...),
// each route file is also written once per language with <html lang> (and
// dir="rtl" where needed), the language-prefixed canonical and og:url — so
// view-source on a language URL shows that language, not English.

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('</head>')) throw new Error('dist/index.html has no </head>')

const seoMap = routeSeoMap()
const routes = new Set([...SCHEMA_ROUTES.map(([route]) => route), ...seoMap.keys()])

// URL prefix per language (mirrors src/i18n/languageUrls.js — Filipino "tl").
const HREFLANG_CODE = { fil: 'tl' }
const LANGS = SUPPORTED_LANGS.filter((l) => l !== 'en').map((l) => {
  const code = HREFLANG_CODE[l] || l
  return { lang: l, prefix: code.toLowerCase(), rtl: RTL_LANGS.includes(l) }
})

function render(route) {
  let html = template
  const tags = schemaTagsFor(route)
  if (tags) html = html.replace('</head>', `${tags}\n  </head>`)
  return applyRouteSeo(html, route, seoMap.get(route))
}

function write(outDir, html) {
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
}

let wrote = 0
for (const route of routes) {
  const html = render(route)
  if (html === template) continue
  write(route === '/' ? dist : path.join(dist, ...route.split('/').filter(Boolean)), html)
  wrote += 1
}

let langWrote = 0
for (const { lang, prefix, rtl } of LANGS) {
  for (const route of routes) {
    let html = render(route)
    if (html === template) continue
    html = html.replace('<html lang="en">', `<html lang="${lang}"${rtl ? ' dir="rtl"' : ''}>`)
    // The canonical and share URL of a language page name that language.
    const langUrl = `https://ktmessenger.com/${prefix}${route}`
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${langUrl}$2`)
    html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${langUrl}$2`)
    write(path.join(dist, prefix, ...route.split('/').filter(Boolean)), html)
    langWrote += 1
  }
}
console.log(`prerender-schema: injected schemas + route SEO into ${wrote} route HTML file(s), ${langWrote} language file(s)`)

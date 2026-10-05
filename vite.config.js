import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { schemaTagsFor } from './scripts/schema-blocks.mjs'
import { routeSeoMap, applyRouteSeo } from './scripts/route-seo.mjs'
import { SUPPORTED_LANGS, RTL_LANGS } from './src/i18n/translations.js'

// URL prefix for each language (mirrors src/i18n/languageUrls.js: Filipino
// uses Tagalog's "tl", everything else is its own lowercase code).
const HREFLANG_CODE = { fil: 'tl' }
const LANG_PREFIXES = new Map(
  SUPPORTED_LANGS.filter((l) => l !== 'en').map((l) => {
    const code = HREFLANG_CODE[l] || l
    return [code.toLowerCase(), { lang: l, rtl: RTL_LANGS.includes(l) }]
  }),
)

// Dev server: serve each schema route its index.html with the page's JSON-LD
// already in <head> — the same output the build prerender produces — so SEO
// extensions and view source see the schema on localhost too. The JsonLd
// component detects the static block and skips its own copy, so the DOM never
// carries duplicates. Dev-only (apply: 'serve'); the production build is
// handled by scripts/prerender-schema.mjs.
function devSchemaPrerender() {
  const routeSeo = routeSeoMap()
  return {
    name: 'dev-schema-prerender',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        // SPA fallback serves index.html with ctx.path '/index.html' — the
        // route the browser asked for is in originalUrl.
        const asked = ctx.originalUrl || ctx.path || ''
        const route = asked.split('?')[0].replace(/\/+$/, '') || '/'
        // Serve the document language the URL names, so view-source and
        // no-JS tools see <html lang="fr"> on /fr, dir="rtl" on /ar, etc.
        const seg = route.split('/')[1]?.toLowerCase()
        const langInfo = LANG_PREFIXES.get(seg)
        if (langInfo) {
          html = html.replace('<html lang="en">', `<html lang="${langInfo.lang}"${langInfo.rtl ? ' dir="rtl"' : ''}>`)
        }
        // The route's own title/description in the served HTML too, so dev
        // matches what the build prerenders (scripts/route-seo.mjs).
        const bareRoute = langInfo ? route.slice(seg.length + 1) || '/' : route
        html = applyRouteSeo(html, bareRoute, routeSeo.get(bareRoute))
        const tags = schemaTagsFor(route)
        if (tags) return html.replace('</head>', `${tags}\n  </head>`)
        return html
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devSchemaPrerender()],
  server: {
    port: 5174,
    host: true,
    open: false,
    strictPort: false,
    // Same-origin API + media so the site works from any device on the LAN
    // (and in production): the browser calls /api and /uploads on whatever
    // host served the page, and the dev server forwards them to the backend.
    // A built bundle with VITE_API_URL set still uses that absolute URL.
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    // Admin image overrides are keyed on an asset's filename (see
    // src/utils/imageKey.js). Vite inlines assets under 4 kB as `data:` URIs,
    // which erases that filename — so those images could never be replaced or
    // given ALT text from the CMS. Only four assets are small enough to be
    // affected (kt-logo.svg among them), so keeping every asset as a real file
    // costs almost nothing and keeps the whole registry overridable.
    assetsInlineLimit: 0,
  },
})

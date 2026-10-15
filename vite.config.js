import { createLogger, defineConfig } from 'vite'
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

const BACKEND = 'http://localhost:4000'

/** Shared by both proxies: they point at one backend, so it is up or it isn't. */
const backend = { down: false }

/**
 * Forwards /api and /uploads to the backend, and keeps the terminal readable
 * when the backend is not there.
 *
 * The dev server almost always starts before the backend does, and every
 * request the page makes in that window hits a port with nothing behind it.
 * Vite's default reaction is a raw Node stack trace per request — a single
 * page load prints a dozen ECONNREFUSED/ECONNRESET traces, which buries the
 * errors that actually matter.
 *
 * So the outage is announced once, with the command that fixes it, and once
 * when it clears. The browser gets a real 503 instead of a socket dying
 * mid-request, which is what the site already expects: a failed content
 * request means "keep the built-in fallback", so nothing on screen breaks.
 */
function backendProxy() {
  return {
    target: BACKEND,
    changeOrigin: true,
    configure(proxy) {
      proxy.on('error', (err, _req, res) => {
        if (!backend.down) {
          backend.down = true
          console.warn(
            `\n[api] ${BACKEND} is not answering (${err.code || err.message}).` +
              '\n[api] Start it with:  cd backend && npm run dev' +
              '\n[api] The site keeps its built-in content until then.\n',
          )
        }
        // A websocket upgrade hands us a raw socket, which cannot be replied
        // to — only closed.
        if (res && typeof res.writeHead === 'function') {
          if (!res.headersSent) {
            res.writeHead(503, { 'content-type': 'application/json' })
            res.end(JSON.stringify({ error: 'backend-unavailable' }))
          }
        } else if (res && typeof res.destroy === 'function') {
          res.destroy()
        }
      })

      proxy.on('proxyRes', () => {
        if (backend.down) {
          backend.down = false
          console.log(`\n[api] ${BACKEND} is answering again.\n`)
        }
      })
    },
  }
}

/**
 * Vite reports every failed proxy request with a Node stack trace, and it does
 * that from inside the proxy call rather than through a listener we could
 * replace. The traces are always the same two frames and say nothing the one
 * line above does not, so they are filtered here — but only for /api and
 * /uploads, so a proxy error from anywhere else still shows in full.
 */
const logger = createLogger()
const logError = logger.error.bind(logger)
logger.error = (msg, options) => {
  const isOurProxy =
    typeof msg === 'string' &&
    msg.includes('http proxy error') &&
    /http proxy error:\s*\/(api|uploads)\b/.test(msg)
  if (isOurProxy) return
  logError(msg, options)
}

export default defineConfig({
  customLogger: logger,
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
      '/api': backendProxy(),
      '/uploads': backendProxy(),
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

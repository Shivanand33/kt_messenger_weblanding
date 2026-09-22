import { Router } from 'express'
import { getSitemap, renderUrlset, renderIndex, sitemapFiles } from '../services/sitemap.service.js'

/**
 * XML sitemap endpoints (Google / sitemaps.org protocol).
 *
 *   GET /sitemap.xml        every public URL in every language; becomes a
 *                           sitemap index automatically when it outgrows one
 *                           file (45,000 URLs or 10 MB)
 *   GET /sitemap-index.xml  sitemap index pointing at the sitemap file(s)
 *   GET /sitemap-<n>.xml    part <n>, only when the sitemap is split
 *
 * Mounted at the root and under /api (app.js) so the website host can proxy
 * either path. Responses are cached (see sitemap.service.js).
 */
const router = Router()

const send = (res, xml) => {
  res.set({
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=600',
    // A sitemap is for crawlers, not a page to show in search results.
    'X-Robots-Tag': 'noindex',
  })
  res.send(xml)
}

// Never serve a partial sitemap: on a database error ask crawlers to retry.
const unavailable = (res, err) => {
  console.error('[sitemap] build failed:', err?.message || err)
  res.set('Retry-After', '600').status(503).type('text/plain').send('Sitemap temporarily unavailable')
}

router.get('/sitemap.xml', async (_req, res) => {
  try {
    const sitemap = await getSitemap()
    send(res, sitemap.chunks.length > 1 ? renderIndex(sitemapFiles(sitemap)) : renderUrlset(sitemap.chunks[0]))
  } catch (err) {
    unavailable(res, err)
  }
})

router.get('/sitemap-index.xml', async (_req, res) => {
  try {
    send(res, renderIndex(sitemapFiles(await getSitemap())))
  } catch (err) {
    unavailable(res, err)
  }
})

router.get('/sitemap-:part.xml', async (req, res, next) => {
  if (!/^[1-9]\d*$/.test(req.params.part)) return next()
  try {
    const sitemap = await getSitemap()
    const chunk = sitemap.chunks.length > 1 ? sitemap.chunks[Number(req.params.part) - 1] : null
    if (!chunk) return next()
    send(res, renderUrlset(chunk))
  } catch (err) {
    unavailable(res, err)
  }
})

export default router

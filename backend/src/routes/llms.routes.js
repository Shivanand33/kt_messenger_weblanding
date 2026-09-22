import { Router } from 'express'
import { getLlmsTxt } from '../services/llms.service.js'

/**
 *   GET /llms.txt   Markdown overview of the public website for AI assistants
 *                   (https://llmstxt.org), served as text/plain.
 *
 * Mounted at the root and under /api (app.js) so the website host can proxy
 * either path. Built from the same cached site model as /sitemap.xml.
 */
const router = Router()

router.get('/llms.txt', async (_req, res) => {
  try {
    const text = await getLlmsTxt()
    res.set({
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
      // Meant to be read by tools, not listed as a page in search results.
      'X-Robots-Tag': 'noindex',
    })
    res.send(text)
  } catch (err) {
    // Never serve a partial file: on a database error ask clients to retry.
    console.error('[llms.txt] build failed:', err?.message || err)
    res.set('Retry-After', '600').status(503).type('text/plain').send('llms.txt temporarily unavailable')
  }
})

export default router

import { asyncHandler } from '../../utils/asyncHandler.js'
import { ok } from '../../utils/apiResponse.js'
import { env } from '../../config/env.js'

/**
 * Where the website's bundled images actually live.
 *
 * Vite hashes every asset, so `multidevice.jpg` is served as
 * `/assets/multidevice-BRo-Hi4k.jpg`. The build publishes the mapping as
 * `image-manifest.json` (see vite.config.js) and the admin's Site Images page
 * needs it to preview the image an override would replace.
 *
 * The admin cannot read that file itself: it sits on the website's origin,
 * which sends no CORS headers, so a browser fetch is blocked. Fetching it here
 * — server to server — has no such limit, and it also lets the admin learn the
 * site's address from SITE_URL instead of needing its own copy of it.
 *
 * Nothing here is essential: an empty map simply means the page falls back to
 * the source paths the dev server serves, exactly as before.
 */

const OK_TTL_MS = 5 * 60 * 1000
/** A miss is re-tried soon, so a fresh deploy shows up without a restart. */
const MISS_TTL_MS = 30 * 1000

let cache = { until: 0, images: {} }

// GET /api/admin/site-images/manifest
export const getImageManifest = asyncHandler(async (_req, res) => {
  if (Date.now() < cache.until) return ok(res, { siteUrl: env.siteUrl, images: cache.images })

  let images = {}
  try {
    const response = await fetch(`${env.siteUrl}/image-manifest.json`, {
      signal: AbortSignal.timeout(5000),
      headers: { Accept: 'application/json' },
    })
    // A static host answers an unknown path with index.html and a 200, so the
    // status alone proves nothing — the content type is what distinguishes a
    // real manifest from the SPA shell.
    const type = response.headers.get('content-type') || ''
    if (response.ok && /json/i.test(type)) {
      const body = await response.json()
      if (body && typeof body === 'object' && !Array.isArray(body)) images = body
    }
  } catch {
    /* site unreachable or slow — an empty map is a working answer */
  }

  const hit = Object.keys(images).length > 0
  cache = { until: Date.now() + (hit ? OK_TTL_MS : MISS_TTL_MS), images }
  return ok(res, { siteUrl: env.siteUrl, images })
})

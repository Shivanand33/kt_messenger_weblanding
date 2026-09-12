/**
 * Stable identity for a bundled image, used as the admin override key.
 *
 * The same asset has a different URL in every environment:
 *   dev   →  /src/assets/images/hero.jpg
 *   build →  /assets/hero-_2h1fNGA.jpg     (Vite appends a content hash)
 *
 * Keying overrides on the URL would therefore break on every deploy. Keying on
 * the original filename instead gives one stable key per asset:
 *
 *   /src/assets/images/hero.jpg   →  hero.jpg
 *   /assets/hero-_2h1fNGA.jpg     →  hero.jpg
 *   /assets/hd_landscape-B7lZI_Gc.png → hd_landscape.png
 *
 * Remote images (an Unsplash or CDN URL) have no such ambiguity, so they are
 * keyed by the full URL exactly as written.
 */

// Vite's content hash: 8 base64url characters immediately before the extension.
const HASH = /-[A-Za-z0-9_-]{8}(\.[A-Za-z0-9]+)$/

export function imageKey(src) {
  if (typeof src !== 'string' || !src) return ''

  // Absolute http(s) URLs are their own key — nothing is ambiguous about them.
  if (/^https?:\/\//i.test(src)) return src

  // data: and blob: sources can never be overridden meaningfully.
  if (/^(data|blob):/i.test(src)) return ''

  // Drop any query/hash, then take the basename.
  const clean = src.split('?')[0].split('#')[0]
  const base = clean.slice(clean.lastIndexOf('/') + 1)
  if (!base) return ''

  // Strip Vite's content hash so dev and production agree on the key.
  return base.replace(HASH, '$1')
}

import { getKeywordFallback } from './imageAlt'

/**
 * Build the resolver the app uses at render time.
 * Returns the override when one exists, otherwise the original source, so an
 * empty or unreachable override map leaves every image exactly as it is today.
 */
export function makeImageResolver(overrides, altOverrides = {}) {
  const map = overrides && typeof overrides === 'object' ? overrides : {}
  const alts = altOverrides && typeof altOverrides === 'object' ? altOverrides : {}

  function resolveUrl(src) {
    if (typeof src !== 'string' || !src) return src
    const key = imageKey(src)
    if (!key) return src
    const replacement = map[key]
    if (typeof replacement === 'object' && replacement?.url) {
      return replacement.url
    }
    if (typeof replacement === 'string' && replacement && replacement !== key) return replacement
    return src
  }

  function resolveAlt(src, fallbackText) {
    if (typeof src !== 'string' || !src) return getKeywordFallback(src, fallbackText)
    const key = imageKey(src)
    const replacement = map[key]
    if (typeof replacement === 'object' && replacement?.alt && typeof replacement.alt === 'string' && replacement.alt.trim()) {
      return replacement.alt.trim()
    }
    if (typeof replacement === 'object' && replacement?.altText && typeof replacement.altText === 'string' && replacement.altText.trim()) {
      return replacement.altText.trim()
    }
    if (alts[key] && typeof alts[key] === 'string' && alts[key].trim()) {
      return alts[key].trim()
    }
    if (alts[src] && typeof alts[src] === 'string' && alts[src].trim()) {
      return alts[src].trim()
    }
    return getKeywordFallback(src, fallbackText)
  }

  return { resolveUrl, resolveAlt }
}

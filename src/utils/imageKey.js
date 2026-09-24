/**
 * Stable identity for a bundled image, used as the admin override key.
 *
 * The same asset has a different URL in every environment:
 *   dev   →  /src/assets/images/ai-assistant-app-hero.jpg
 *   build →  /assets/ai-assistant-app-hero-_2h1fNGA.jpg   (Vite adds a hash)
 *
 * Keying overrides on the URL would therefore break on every deploy. Keying on
 * the original filename instead gives one stable key per asset:
 *
 *   /src/assets/images/ai-assistant-app-hero.jpg      →  ai-assistant-app-hero.jpg
 *   /assets/ai-assistant-app-hero-_2h1fNGA.jpg        →  ai-assistant-app-hero.jpg
 *   /assets/hd_landscape-B7lZI_Gc.png                 →  hd_landscape.png
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

  // Only a built asset carries a hash. In dev the file is served straight from
  // src/, where the last hyphen-separated part of a name like
  // "ai-super-app-logo.svg" would otherwise be mistaken for one and stripped.
  if (/(^|\/)src\//.test(clean)) return base

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

  /**
   * The ALT text the admin actually typed for this image, or '' when they left
   * it blank. Kept separate from `resolveAlt` so a decorative image can pick up
   * an admin-set ALT without inheriting the keyword fallback — an image nobody
   * labelled must stay `alt=""` rather than gain invented text.
   */
  function resolveAdminAlt(src) {
    if (typeof src !== 'string' || !src) return ''
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
    return ''
  }

  function resolveAlt(src, fallbackText) {
    if (typeof src !== 'string' || !src) return getKeywordFallback(src, fallbackText)
    return resolveAdminAlt(src) || getKeywordFallback(src, fallbackText)
  }

  return { resolveUrl, resolveAlt, resolveAdminAlt }
}

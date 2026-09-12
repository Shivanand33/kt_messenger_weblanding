import { makeImageResolver } from './imageKey'
import { getKeywordFallback } from './imageAlt'

/**
 * Admin image replacements, resolved at render time.
 */
let resolver = makeImageResolver({}, {})

/** Called by LanguageProvider when the admin overrides arrive. */
export function setImageOverrides(urlMap, altMap = {}) {
  resolver = makeImageResolver(urlMap, altMap)
}

/**
 * Resolve an image source to its admin override, or return it unchanged.
 * Safe before the overrides load and safe if they never load.
 */
export function img(src) {
  return resolver.resolveUrl(src)
}

/**
 * Resolve an image's ALT text using Admin-configured ALT text or a keyword fallback.
 */
export function imgAlt(src, fallbackText) {
  return resolver.resolveAlt(src, fallbackText)
}

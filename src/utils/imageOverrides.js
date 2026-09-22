import { makeImageResolver } from './imageKey'
import { avif } from './avif'

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
  const resolved = resolver.resolveUrl(src)
  // An admin replacement always wins; otherwise serve the AVIF version of the
  // bundled file where the browser supports it (the original everywhere else).
  return resolved === src ? avif(src) : resolved
}

// ALT text in the page's language — set by LanguageProvider (unchanged on
// English pages).
let translateAlt = (text) => text

/** Called by LanguageProvider with its `t()`. */
export function setAltTranslator(fn) {
  translateAlt = fn
}

/**
 * Resolve an image's ALT text using Admin-configured ALT text or a keyword fallback.
 */
export function imgAlt(src, fallbackText) {
  return translateAlt(resolver.resolveAlt(src, fallbackText))
}

/**
 * Resolve ONLY an Admin-configured ALT text, with no keyword fallback.
 *
 * For images that are decorative by default (`alt=""`): if the Admin has
 * labelled that image in Site Images, its text is used; otherwise the image
 * stays decorative exactly as before.
 */
export function imgAltOnly(src) {
  const alt = resolver.resolveAdminAlt(src)
  return alt ? translateAlt(alt) : alt
}

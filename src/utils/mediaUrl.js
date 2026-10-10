/**
 * Point uploaded media at the server that actually serves it.
 *
 * `/uploads/...` is served by the API, and only by the API. The URL stored
 * with a post can still name a different host: when MEDIA_PUBLIC_URL is set to
 * the website's own origin, every upload is saved as
 * `https://<site>/uploads/...`. The static host has no /uploads/ directory, so
 * it answers with index.html — the browser receives HTML where it expected an
 * image and draws the alt text instead. That is what a "broken image" here is:
 * the file is fine, the address is wrong.
 *
 * These helpers rewrite anything under /uploads/ to the API origin and leave
 * every other URL alone — bundled assets, R2/CDN links and data: URIs included.
 */

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || `${typeof window === 'undefined' ? '' : window.location.origin}/api`
).replace(/\/api\/?$/, '')

/**
 * A whole URL whose PATH starts with /uploads/, with or without a host.
 *
 * Both anchors matter. Without them a third-party link that merely contains
 * the segment further along — `https://example.com/wp-content/uploads/x.png` —
 * would have its tail rewritten and be broken by this very fix.
 */
const UPLOADS_URL = /^(?:https?:\/\/[^/]+)?(\/uploads\/[^\s"']*)$/i

/** One URL. Anything that is not an uploads path is returned untouched. */
export function mediaUrl(url) {
  if (typeof url !== 'string' || !url) return url
  const match = url.match(UPLOADS_URL)
  return match ? `${API_ORIGIN}${match[1]}` : url
}

/**
 * Every src/href inside a stored HTML body — blog posts keep their images as
 * raw `<img src="…">`, so the attributes are rewritten rather than the string
 * as a whole.
 */
export function mediaUrlsInHtml(html) {
  if (typeof html !== 'string' || !html) return html
  return html.replace(/\b(src|href)=("|')(.*?)\2/gi, (whole, attr, quote, url) => {
    const fixed = mediaUrl(url)
    return fixed === url ? whole : `${attr}=${quote}${fixed}${quote}`
  })
}

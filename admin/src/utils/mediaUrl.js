/**
 * Point uploaded media at the server that actually serves it.
 *
 * `/uploads/...` is served by the API and by nothing else. A stored URL can
 * still name a different host: when MEDIA_PUBLIC_URL is set to the website's
 * own origin, every upload is saved as `https://<site>/uploads/...`. The
 * static host has no /uploads/ directory, so it answers with index.html — the
 * browser receives HTML where it expected an image and draws nothing. That is
 * what a "broken preview" here is: the file is fine, the address is wrong.
 *
 * This mirrors src/utils/mediaUrl.js on the website, which is why the live
 * site shows those images correctly while the admin's own previews did not.
 */

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')

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

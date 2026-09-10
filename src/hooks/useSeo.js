import { useEffect } from 'react'

/**
 * Sets the document title, canonical link and social meta tags for the
 * current view, then restores whatever was there before on unmount.
 *
 * The site is a single-page app with no server rendering, so `index.html`
 * carries one static title and description for every route. This hook lets a
 * route describe itself — most importantly the blog article view, whose
 * canonical URL must be built from the admin-defined slug so that the shared
 * link, the crawled URL and the stored slug are all the same string.
 *
 * Deliberately dependency-free: it writes the tags it owns and marks them
 * `data-seo` so a later call can find and reuse the same elements instead of
 * appending duplicates.
 */

// Canonical origin. Set VITE_SITE_URL per environment; falling back to the
// live origin keeps previews and staging self-consistent rather than
// advertising production URLs from a staging host.
const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/+$/, '')

export const siteUrl = SITE_URL

/** Absolute URL for a site-relative path: absoluteUrl('/blog/calling'). */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

function upsertMeta(attr, key, content) {
  if (!content) return null
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  const created = !el
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  const previous = el.getAttribute('content')
  el.setAttribute('content', content)
  return { el, created, previous }
}

function upsertCanonical(href) {
  if (!href) return null
  let el = document.head.querySelector('link[rel="canonical"]')
  const created = !el
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  const previous = el.getAttribute('href')
  el.setAttribute('href', href)
  return { el, created, previous }
}

/**
 * @param {object}  seo
 * @param {string}  seo.title        Document title.
 * @param {string}  seo.description  Meta + og description.
 * @param {string}  seo.path         Site-relative path, e.g. `/blog/calling`.
 * @param {string}  seo.image        Absolute or site-relative image URL.
 * @param {string}  seo.type         Open Graph type. Defaults to 'website'.
 * @param {boolean} seo.enabled      Skip entirely when false (e.g. still loading).
 */
export function useSeo({ title, description, path, image, type = 'website', enabled = true } = {}) {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined

    const url = path ? absoluteUrl(path) : undefined
    const img = image ? absoluteUrl(image) : undefined
    const prevTitle = document.title
    if (title) document.title = title

    const touched = [
      upsertCanonical(url),
      upsertMeta('name', 'description', description),
      upsertMeta('property', 'og:title', title),
      upsertMeta('property', 'og:description', description),
      upsertMeta('property', 'og:url', url),
      upsertMeta('property', 'og:type', type),
      upsertMeta('property', 'og:image', img),
      upsertMeta('name', 'twitter:card', img ? 'summary_large_image' : 'summary'),
      upsertMeta('name', 'twitter:title', title),
      upsertMeta('name', 'twitter:description', description),
      upsertMeta('name', 'twitter:image', img),
    ].filter(Boolean)

    return () => {
      if (title) document.title = prevTitle
      for (const { el, created, previous } of touched) {
        // Only remove tags this hook introduced; anything that came from
        // index.html is restored to the value it had.
        if (created) el.remove()
        else if (previous !== null) el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', previous)
      }
    }
  }, [title, description, path, image, type, enabled])
}

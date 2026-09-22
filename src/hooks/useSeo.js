import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_LANG, hreflangPaths, languagePath } from '../i18n/languageUrls'
import { useLanguage } from '../context/LanguageContext'

/**
 * Sets the document title, canonical link, hreflang links and social meta
 * tags for the current view, then restores whatever was there before on unmount.
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

/** Absolute URL for a site-relative path: absoluteUrl('/blog/calling'). */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

const stripSlash = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p)
const samePath = (a, b) => stripSlash(a).toLowerCase() === stripSlash(b).toLowerCase()

/**
 * The path the canonical should point at.
 *
 * Feature pages declare their own path (`/calling`), but App.jsx also mounts
 * them at the SEO URLs configured in admin Navigation (`/video-calling-app`).
 * Canonicalising those to the declared path tells search engines to ignore the
 * very URL the page is being served from, so whenever the served path really
 * differs, the served one wins. When they only differ by case or a trailing
 * slash the declared path is kept, so pages served at their own URL — and the
 * slug-based blog canonical — behave exactly as before.
 */
function canonicalPath(declared, served) {
  if (!declared || !served || /^https?:\/\//i.test(declared)) return declared
  return samePath(declared, served) ? declared : stripSlash(served)
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

function upsertAlternate(hreflang, href) {
  let el = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  const created = !el
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', hreflang)
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  const previous = el.getAttribute('href')
  el.setAttribute('href', href)
  return { el, created, previous }
}

/**
 * `<link rel="alternate" hreflang>` for the page in every language, its own
 * included, plus x-default (src/i18n/languageUrls.js). The page is resolved
 * exactly like the canonical, so both always name the same page. useSeo()
 * calls this; a page without useSeo() calls it directly.
 *
 * @param {string}  path             Site-relative path, as given to useSeo().
 * @param {object}  [options]
 * @param {boolean} [options.enabled] False while loading or on a "not found" view.
 */
export function useHreflang(path, { enabled = true } = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined

    const resolved = canonicalPath(path, pathname)
    const touched = hreflangPaths(resolved).map((a) => upsertAlternate(a.hreflang, absoluteUrl(a.path)))

    return () => {
      for (const { el, created, previous } of touched) {
        if (created) el.remove()
        else if (previous !== null) el.setAttribute('href', previous)
      }
    }
  }, [path, pathname, enabled])
}

/**
 * @param {object}  seo
 * @param {string}  seo.title        Document title.
 * @param {string}  seo.description  Meta + og description.
 * @param {string}  seo.path         Site-relative path, e.g. `/blog/calling`.
 * @param {string}  seo.image        Absolute or site-relative image URL.
 * @param {string}  seo.type         Open Graph type. Defaults to 'website'.
 * @param {boolean} seo.enabled      Skip entirely when false (e.g. still loading).
 * @param {boolean} seo.hreflang     Also write the hreflang links (default). False
 *                                   while the view is loading or shows "not found".
 */
export function useSeo({ title: titleText, description: descriptionText, path, image, type = 'website', enabled = true, hreflang = true } = {}) {
  const { pathname } = useLocation()
  useHreflang(path, { enabled: enabled && hreflang })
  // Title and description in the page's language (English pages: as given).
  const { lang, t } = useLanguage()
  const title = titleText && lang !== DEFAULT_LANG ? t(titleText) : titleText
  const description = descriptionText && lang !== DEFAULT_LANG ? t(descriptionText) : descriptionText

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined

    const resolved = canonicalPath(path, pathname)
    // In the language the page is shown in: /hi/calling for the Hindi page.
    const url = resolved ? absoluteUrl(languagePath(resolved)) : undefined
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
  }, [title, description, path, pathname, image, type, enabled])
}

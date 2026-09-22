import { useEffect, useState } from 'react'
import { api } from '../services/apiClient'
import { useSeo } from './useSeo'

/**
 * Per-page SEO, editable from the admin Website Content module.
 *
 * Reads the `seo.<page>` content block and applies it as the document title,
 * meta description, canonical URL and social tags. The block is expected to
 * hold `{ title, description, image }` — any subset works.
 *
 * If the block does not exist, this is a NO-OP: the page keeps whatever
 * `index.html` provides, exactly as it behaves today. That matters because the
 * site currently has no per-page meta to import, and inventing SEO copy would
 * be worse than leaving the existing defaults in place. A business user turns
 * SEO on for a page simply by creating the block in admin.
 *
 * @param {string} page  Content-block suffix, e.g. 'home' -> `seo.home`.
 * @param {string} path  Site-relative path used for the canonical URL.
 * @param {{ title?: string, description?: string } | null} [override]
 *   Optional title/description that win over the block (e.g. a Help Center
 *   article's own SEO fields). Pages that pass nothing behave as before.
 */
export function useAdminSeo(page, path, override) {
  const [seo, setSeo] = useState(null)

  useEffect(() => {
    let alive = true
    api
      .getContentBlock(`seo.${page}`)
      .then((data) => {
        // Only take over if the block actually carries something renderable.
        if (alive && data && (data.title || data.description)) setSeo(data)
      })
      .catch(() => {
        /* no block configured — leave index.html's defaults alone */
      })
    return () => {
      alive = false
    }
  }, [page])

  useSeo({
    enabled: Boolean(seo) || Boolean(override?.title || override?.description),
    path,
    title: override?.title || seo?.title,
    description: override?.description || seo?.description,
    image: seo?.image,
    // The page's own useSeo() / useHreflang() writes the hreflang links: it
    // knows when the view is a real page rather than a "not found" state.
    hreflang: false,
  })
}

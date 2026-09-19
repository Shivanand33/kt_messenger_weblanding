import { img } from './imageOverrides'
import { avif, isAvifSupported } from './avif'
import { imageKey } from './imageKey'

/**
 * Mobile-only image loading.
 *
 * On phones (viewport up to 767px) images that sit below the fold, or inside
 * blocks the mobile layout hides, are lazy-loaded, and images shown in small
 * slots (avatars, thumbnails) use pre-sized variants from assets/images/sm.
 *
 * On anything wider these helpers are no-ops: `mobileLazy` is undefined, so
 * React omits the attribute, and `imgSmall` returns exactly what `img` does.
 * Desktop markup and downloads are therefore unchanged.
 */
export const IS_MOBILE =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 767px)').matches

/** `loading` attribute value: 'lazy' on mobile, omitted on desktop. */
export const mobileLazy = IS_MOBILE ? 'lazy' : undefined

// sm/<original name> is the same-format variant, sm/<stem>.avif its AVIF twin.
const SMALL = import.meta.glob('../assets/images/sm/*.{avif,png,jpg,jpeg}', { eager: true, query: '?url', import: 'default' })

const SMALL_FOR = {}
const smallAvifByStem = {}
for (const [p, url] of Object.entries(SMALL)) {
  const name = p.slice(p.lastIndexOf('/') + 1)
  if (/\.avif$/i.test(name)) smallAvifByStem[name.replace(/\.avif$/i, '')] = url
  else SMALL_FOR[name] = { orig: url }
}
for (const [name, v] of Object.entries(SMALL_FOR)) v.avif = smallAvifByStem[name.replace(/\.[^.]+$/, '')]

/**
 * Like `img()`, but on mobile returns the small variant of a bundled image.
 * Admin replacements and images without a variant are returned untouched.
 */
export function imgSmall(src) {
  const full = img(src)
  if (!IS_MOBILE || typeof src !== 'string' || !src) return full
  // `full` is an admin override when it is neither the original nor its AVIF.
  if (full !== src && full !== avif(src)) return full
  const v = SMALL_FOR[imageKey(src)]
  if (!v) return full
  return (isAvifSupported() && v.avif) || v.orig
}

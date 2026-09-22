/**
 * Translations of admin content (Help Center, blog, business pages, FAQs,
 * page text…) into the language of the page.
 *
 * The backend translates the text of every API response it sends to a page in
 * another language and adds it as `translations` ({ English: translated }).
 * apiClient.js stores them here as the response arrives, so `t()` finds them
 * the moment the content renders; the content itself stays in English, which
 * keeps every lookup the pages do by title or slug working unchanged.
 */
const texts = new Map()
const listeners = new Set()
let version = 0

export function addContentTranslations(map) {
  if (!map || typeof map !== 'object') return
  let changed = false
  for (const [source, text] of Object.entries(map)) {
    if (typeof text === 'string' && text && texts.get(source) !== text) {
      texts.set(source, text)
      changed = true
    }
  }
  if (changed) {
    version += 1
    listeners.forEach((listener) => listener())
  }
}

/** The translation of an admin text, or undefined when there is none. */
export const contentText = (source) => texts.get(source)

/** For useSyncExternalStore: re-render when new translations arrive. */
export function subscribeContentTranslations(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const contentTranslationsVersion = () => version

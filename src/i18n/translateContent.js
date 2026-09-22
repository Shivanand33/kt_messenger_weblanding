import { useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { DEFAULT_LANG } from './languageUrls'

// Keys whose values are never page text: ids, slugs, links, icons, images,
// colours, dates. The backend skips the same keys when it translates
// (backend/src/services/translation.service.js), so both sides agree on which
// strings are text.
const SKIP_KEY = /^(id|slug|href|to|path|src|url|image|icon|color|colour|gradient|locale|lang|status|platforms?|hash|code|variant)$|^[a-z][a-zA-Z0-9]*(Id|Url|URL|Href|Image|Icon|Color|At)$/

/** Every text in a content object (admin data or its bundled fallback) through `t()`. */
export function translateContent(value, t) {
  if (typeof value === 'string') return t(value)
  if (Array.isArray(value)) return value.map((item) => translateContent(item, t))
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out = {}
    for (const [key, item] of Object.entries(value)) out[key] = SKIP_KEY.test(key) ? item : translateContent(item, t)
    return out
  }
  return value
}

/** `value` in the page's language; English pages get it back untouched. */
export function useTranslatedContent(value) {
  const { lang, t } = useLanguage()
  return useMemo(() => (lang === DEFAULT_LANG ? value : translateContent(value, t)), [value, lang, t])
}

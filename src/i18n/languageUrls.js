import { SUPPORTED_LANGS } from './translations'

/**
 * Every language of the site has its own URL.
 *
 *   English (default)   /calling, /help/<article>        the existing URLs
 *   Other languages     /hi/calling, /es/help/<article>, /zh-hans/blog/<post>
 *
 * App.jsx and its routes do not change: main.jsx mounts the router with the
 * language prefix as its basename, so every route, <Link> and navigate()
 * works the same inside a language and keeps the visitor in it.
 *
 * Prefixes and hreflang codes follow Google's rules: an ISO 639-1 language
 * code (two letters), plus an ISO 15924 script where one is needed (zh-Hans,
 * zh-Hant). Filipino has no two-letter code, so its pages use Tagalog's "tl".
 *
 * backend/src/services/hreflang.service.js lists the same languages for the
 * XML sitemap — keep the two in sync.
 */

export const DEFAULT_LANG = 'en'

// Site language code -> hreflang code, where the two differ.
const HREFLANG_CODE = { fil: 'tl' }

/** { lang, hreflang, prefix } for every site language, English first. */
export const LANGUAGES = SUPPORTED_LANGS.map((lang) => {
  const hreflang = HREFLANG_CODE[lang] || lang
  return { lang, hreflang, prefix: lang === DEFAULT_LANG ? '' : `/${hreflang.toLowerCase()}` }
})

const byLang = new Map(LANGUAGES.map((l) => [l.lang, l]))
const byPrefix = new Map(LANGUAGES.filter((l) => l.prefix).map((l) => [l.prefix.slice(1), l]))

// The visitor's language choice.
export const LANGUAGE_STORAGE_KEY = 'lang'

function savedLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveLanguage(lang) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  } catch {
    /* storage unavailable — the choice just won't persist */
  }
}

/** A site path in a language: languagePath('/calling', 'hi') -> '/hi/calling'. */
export function languagePath(path, lang = currentLanguage().lang) {
  const prefix = byLang.get(lang)?.prefix
  if (!prefix || typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path
  return path === '/' ? prefix : `${prefix}${path}`
}

function replaceUrl(url) {
  try {
    window.history.replaceState(window.history.state, '', url)
    return true
  } catch {
    return false
  }
}

let current = null

/**
 * The language of this page load, from its URL: { lang, hreflang, prefix,
 * basename }. main.jsx reads it before the router mounts.
 *
 * A language URL is also the visitor's choice from then on. An English URL
 * opened by a visitor who chose another language is switched, in place, to
 * that language's URL — the site has always shown the saved language.
 */
export function currentLanguage() {
  if (current) return current
  let language = byLang.get(DEFAULT_LANG)
  if (typeof window !== 'undefined') {
    const { pathname, search, hash } = window.location
    const segment = pathname.split('/')[1] || ''
    const fromUrl = byPrefix.get(segment.toLowerCase())
    if (fromUrl) {
      language = fromUrl
      saveLanguage(fromUrl.lang)
      // /HI/calling -> /hi/calling
      if (segment !== fromUrl.prefix.slice(1)) replaceUrl(`${fromUrl.prefix}${pathname.slice(segment.length + 1)}${search}${hash}`)
    } else {
      const saved = byLang.get(savedLanguage())
      const localized = saved?.prefix ? languagePath(pathname, saved.lang) : pathname
      if (localized !== pathname && replaceUrl(`${localized}${search}${hash}`)) language = saved
    }
  }
  current = { ...language, basename: language.prefix || '/' }
  return current
}

/** This page (path, query and hash) in another language. */
export function languageUrl(lang) {
  const { pathname, search, hash } = window.location
  const { prefix } = currentLanguage()
  const lower = pathname.toLowerCase()
  const inPrefix = prefix && (lower === prefix || lower.startsWith(`${prefix}/`))
  const path = inPrefix ? pathname.slice(prefix.length) || '/' : pathname
  return `${languagePath(path, lang)}${search}${hash}`
}

// Never annotated with hreflang (robots.txt keeps these out of search too).
const NO_HREFLANG = /^\/(admin|dashboard|api|auth|login|logout|signin|signup)(\/|$)/i

/**
 * The hreflang alternates of a page, from its path without a language prefix
 * (the router path): the page in every language, its own included, plus
 * x-default — the English page, for every other visitor.
 * @returns {{ hreflang: string, path: string }[]}
 */
export function hreflangPaths(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || NO_HREFLANG.test(path)) return []
  return [
    ...LANGUAGES.map((l) => ({ hreflang: l.hreflang, path: languagePath(path, l.lang) })),
    { hreflang: 'x-default', path },
  ]
}

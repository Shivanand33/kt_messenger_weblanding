import { absolute } from './siteModel.service.js'

/**
 * Languages of the public website and their URLs, for the hreflang links in
 * the XML sitemap. Mirrors src/i18n/languageUrls.js, which writes the same
 * links into every page — keep the two in sync.
 *
 * English, the default, is served at the site root (/calling); every other
 * language under its code (/hi/calling, /zh-hans/calling). Codes follow
 * Google's rules: an ISO 639-1 language code (two letters), plus an ISO 15924
 * script where one is needed (zh-Hans, zh-Hant). Filipino has no two-letter
 * code, so its pages use Tagalog's "tl".
 */

export const DEFAULT_LANG = 'en'

// The website's languages: SUPPORTED_LANGS in src/i18n/translations.js.
const SITE_LANGUAGES = ['en', 'es', 'pt', 'fr', 'de', 'it', 'nl', 'pl', 'ru', 'uk', 'tr', 'ar', 'he', 'fa', 'hi', 'bn', 'gu', 'mr', 'pa', 'ur', 'ta', 'te', 'kn', 'ml', 'si', 'ne', 'th', 'vi', 'id', 'ms', 'fil', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'sw', 'af', 'zu', 'ha', 'yo', 'am', 'sq', 'az', 'be', 'bg', 'ca', 'hr', 'cs', 'da', 'et', 'fi', 'ka', 'el', 'hu', 'is', 'ga', 'kk', 'lv', 'lt', 'mk', 'no', 'ro', 'sr', 'sk']

// Site language code -> hreflang code, where the two differ.
const HREFLANG_CODE = { fil: 'tl' }

/** { lang, hreflang, prefix } for every site language, English first. */
export const LANGUAGES = SITE_LANGUAGES.map((lang) => {
  const hreflang = HREFLANG_CODE[lang] || lang
  return { lang, hreflang, prefix: lang === DEFAULT_LANG ? '' : `/${hreflang.toLowerCase()}` }
})

/** A site path in a language: languagePath('/calling', hindi) -> '/hi/calling'. */
export function languagePath(path, language) {
  if (!language.prefix) return path
  return path === '/' ? language.prefix : `${language.prefix}${path}`
}

// Never annotated with hreflang (robots.txt keeps these out of search too).
const NO_HREFLANG = /^\/(admin|dashboard|api|auth|login|logout|signin|signup)(\/|$)/i

/**
 * The hreflang alternates of the page at `path` (its English path): the page
 * in every language, its own included, plus x-default — the English page.
 * @returns {{ hreflang: string, href: string }[]}
 */
export function hreflangAlternates(path) {
  if (NO_HREFLANG.test(path)) return []
  return [
    ...LANGUAGES.map((language) => ({ hreflang: language.hreflang, href: absolute(languagePath(path, language)) })),
    { hreflang: 'x-default', href: absolute(path) },
  ]
}

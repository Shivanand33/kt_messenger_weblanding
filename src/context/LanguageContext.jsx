import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { SUPPORTED_LANGS, RTL_LANGS } from '../i18n/translations'
import { api } from '../services/apiClient'
import { setAltTranslator, setImageOverrides } from '../utils/imageOverrides'
import { DEFAULT_LANG, currentLanguage, languageUrl, saveLanguage } from '../i18n/languageUrls'
import { contentText, contentTranslationsVersion, subscribeContentTranslations } from '../i18n/contentTranslations'

// Each language has its own URL (src/i18n/languageUrls.js), so the page's
// language is the one its URL names.
function readInitialLang() {
  return currentLanguage().lang
}

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

/**
 * @param {object} props
 * @param {Record<string,string>} [props.dictionary] UI translations of the
 *   page's language, loaded by main.jsx before the first render.
 */
export function LanguageProvider({ dictionary = {}, children }) {
  const [lang] = useState(readInitialLang)
  // Admin content translations arrive with API responses; re-render when they do.
  const contentVersion = useSyncExternalStore(subscribeContentTranslations, contentTranslationsVersion)

  // Choosing a language opens this same page at that language's URL.
  const setLang = (next) => {
    if (!SUPPORTED_LANGS.includes(next) || next === lang) return
    saveLanguage(next)
    window.location.assign(languageUrl(next))
  }

  // Keep the document's language and text direction in sync with the choice, so
  // screen readers, hyphenation, and RTL layout (Arabic) all follow along.
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
  }, [lang])

  // Admin-editable copy. Every page's visible text is stored in website_content
  // as `text.<page>` maps of { English source -> replacement }. Loading them
  // here means business users can edit any string on the site without a single
  // component being rewired.
  //
  // Precedence is deliberate: on the English site the admin override wins. In
  // another language, a string the admin rewrote shows the translation of the
  // rewrite (sent by the backend with this response); until that exists, the
  // translation of the original — and failing both, the admin's English. If the
  // request fails the map stays empty and `t()` uses the translations alone.
  const [overrides, setOverrides] = useState({})
  useEffect(() => {
    let alive = true
    api
      .getPageContent('text')
      .then((blocks) => {
        if (!alive || !blocks || typeof blocks !== 'object') return
        const merged = {}
        const images = {}
        const alts = {}
        for (const [key, block] of Object.entries(blocks)) {
          if (!block || typeof block !== 'object') continue
          if (key === 'images.alt') {
            Object.assign(alts, block)
          } else if (key.startsWith('images.')) {
            for (const [file, val] of Object.entries(block)) {
              if (val && typeof val === 'object') {
                if (val.url) images[file] = val.url
                if (val.alt || val.altText) alts[file] = val.alt || val.altText
              } else if (typeof val === 'string') {
                images[file] = val
              }
            }
          } else {
            Object.assign(merged, block)
          }
        }
        setOverrides(merged)
        setImageOverrides(images, alts)
      })
      .catch(() => {
        /* no admin copy available — the hardcoded English stays in place */
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => {
    // Admin copy sometimes carries spacing the English source does not
    // (' About KT Messenger', 'more   inclusive'), which would miss the
    // dictionary and leave that one line in English. Look the string up on its
    // collapsed form too.
    const translated = (key) =>
      dictionary[key] ?? (typeof key === 'string' ? dictionary[key.replace(/\s+/g, ' ').trim()] : undefined)
    const t = (key) => {
      const override = overrides[key]
      if (lang === DEFAULT_LANG) return override ?? key
      // An admin rewrite: its translation, else the original's, else the rewrite.
      // A rewrite without words (a blanked-out string) stays exactly as the admin set it.
      if (override !== undefined && override !== key) {
        if (!/\p{L}/u.test(override)) return override
        return contentText(override) ?? translated(key) ?? override
      }
      // UI text from the dictionary, admin content from its translations.
      return translated(key) ?? contentText(key) ?? override ?? key
    }
    // Image ALT text follows the page's language too (utils/imageOverrides.js).
    setAltTranslator(lang === DEFAULT_LANG ? (text) => text : t)
    return { lang, setLang, t }
    // contentVersion: a new `t` whenever more admin translations arrive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, overrides, dictionary, contentVersion])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

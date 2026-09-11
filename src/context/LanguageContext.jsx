import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations, SUPPORTED_LANGS, RTL_LANGS } from '../i18n/translations'
import { api } from '../services/apiClient'
import { setImageOverrides } from '../utils/imageOverrides'

const STORAGE_KEY = 'lang'

function readInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved && SUPPORTED_LANGS.includes(saved) ? saved : 'en'
}

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang)

  const setLang = (next) => {
    if (!SUPPORTED_LANGS.includes(next)) return
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable — selection just won't persist */
    }
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
  // Precedence is deliberate: a real translation still wins, so the 48
  // translated strings behave exactly as they do today. The admin override only
  // fills in where no translation exists — which is the English site and every
  // untranslated language. If the request fails the map stays empty and `t()`
  // behaves precisely as before.
  const [overrides, setOverrides] = useState({})
  useEffect(() => {
    let alive = true
    api
      .getPageContent('text')
      .then((blocks) => {
        if (!alive || !blocks || typeof blocks !== 'object') return
        const merged = {}
        const images = {}
        for (const [key, block] of Object.entries(blocks)) {
          if (!block || typeof block !== 'object') continue
          // 'images.*' blocks hold image replacements, everything else is copy.
          if (key.startsWith('images.')) Object.assign(images, block)
          else Object.assign(merged, block)
        }
        setOverrides(merged)
        setImageOverrides(images)
      })
      .catch(() => {
        /* no admin copy available — the hardcoded English stays in place */
      })
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(() => {
    const dict = translations[lang] || {}
    // Translation first, then the admin override, then the English key itself.
    const t = (key) => dict[key] ?? overrides[key] ?? key
    return { lang, setLang, t }
  }, [lang, overrides])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

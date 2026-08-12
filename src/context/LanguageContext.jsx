import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations, SUPPORTED_LANGS, RTL_LANGS } from '../i18n/translations'

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

  const value = useMemo(() => {
    const dict = translations[lang] || {}
    // Look up by English source string; fall back to the key (English) itself.
    const t = (key) => dict[key] ?? key
    return { lang, setLang, t }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

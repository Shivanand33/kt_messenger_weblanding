import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {}
})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en') // 'en' or 'hi'

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'))
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context || { lang: 'en', setLang: () => {}, toggleLang: () => {} }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { ModalProvider } from './context/ModalContext'
import { LanguageProvider } from './context/LanguageContext'
import { detectAvifSupport } from './utils/avif'
import { currentLanguage } from './i18n/languageUrls'
import { loadDictionary } from './i18n/dictionaries'

// index.html already carries this title, but a restored or discarded browser
// tab can keep showing whatever title it had before. Setting it here forces the
// correct one as soon as the app boots.
document.title = 'KT Messenger · messaging & calling'

// Each language has its own URL (/hi/calling is /calling in Hindi). The router
// runs under that prefix, so routes and links stay exactly as they are.
const { lang, basename } = currentLanguage()

// Decide AVIF vs original once, before the first render, so no image is ever
// downloaded twice. The check is a ~10 ms decode with a 500 ms cap. The page's
// translations load alongside it, so the first paint is already in its
// language (English has nothing to load).
Promise.all([detectAvifSupport(), loadDictionary(lang)]).then(([, dictionary]) => {
  // The site-wide title and description (index.html) in the page's language,
  // for pages that set none of their own.
  if (dictionary[document.title]) document.title = dictionary[document.title]
  const description = document.querySelector('meta[name="description"]')
  if (description && dictionary[description.content]) description.content = dictionary[description.content]

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter basename={basename}>
        <ThemeProvider>
          <LanguageProvider dictionary={dictionary}>
            <ModalProvider>
              <App />
            </ModalProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  )
})

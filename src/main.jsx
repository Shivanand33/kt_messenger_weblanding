import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { ModalProvider } from './context/ModalContext'
import { LanguageProvider } from './context/LanguageContext'
import { detectAvifSupport } from './utils/avif'

// index.html already carries this title, but a restored or discarded browser
// tab can keep showing whatever title it had before. Setting it here forces the
// correct one as soon as the app boots.
document.title = 'KT Messenger · messaging & calling'

// Decide AVIF vs original once, before the first render, so no image is ever
// downloaded twice. The check is a ~10 ms decode with a 500 ms cap.
detectAvifSupport().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  )
})

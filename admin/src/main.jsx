import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import './index.css'

// Apply the saved light/dark theme before first paint to avoid a flash.
try {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('kt_admin_theme') || 'light')
} catch {
  document.documentElement.setAttribute('data-theme', 'light')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

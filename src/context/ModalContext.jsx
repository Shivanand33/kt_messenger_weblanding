import { createContext, useContext, useState } from 'react'
import { AuthModal } from '../components/common/Modals/AuthModal'
import { DownloadModal } from '../components/common/Modals/DownloadModal'

const ModalContext = createContext()

export function ModalProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)

  const openAuthModal = () => setAuthOpen(true)
  const closeAuthModal = () => setAuthOpen(false)

  const openDownloadModal = () => setDownloadOpen(true)
  const closeDownloadModal = () => setDownloadOpen(false)

  return (
    <ModalContext.Provider
      value={{
        openAuthModal,
        closeAuthModal,
        openDownloadModal,
        closeDownloadModal,
      }}
    >
      {children}
      <AuthModal isOpen={authOpen} onClose={closeAuthModal} />
      <DownloadModal isOpen={downloadOpen} onClose={closeDownloadModal} />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

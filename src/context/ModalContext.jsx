import { createContext, useContext, useState } from 'react'
import { AuthModal } from '../components/common/Modals/AuthModal'
import { DownloadModal } from '../components/common/Modals/DownloadModal'
import { trackDownload } from '../services/analytics'
import { TRACK_KEY, urlFor, useDownloads } from '../services/downloads'
import { detectPlatform, isMobileStorePlatform, openAppOrStore } from '../utils/openAppOrDownload'

const ModalContext = createContext()

export function ModalProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const downloads = useDownloads()

  const openAuthModal = () => setAuthOpen(true)
  const closeAuthModal = () => setAuthOpen(false)

  /**
   * A Download button takes the visitor to their own platform's file; the
   * list of every platform is only shown when we cannot work out which one
   * that is. Picking your own operating system out of a list is a question
   * the page can usually answer for you.
   *
   * Phones go first and separately, through openAppOrStore(): on Android it
   * opens the app when it is already installed, and on iOS it sends the tap
   * straight to the App Store rather than through a timed fallback Safari
   * would stop to ask about.
   *
   * Everything here runs synchronously inside the click, because Safari and
   * Chrome only follow a page into another app while the visitor's gesture
   * is still live. Do not wrap these calls in a timer or an await.
   *
   * The modal is still the answer for Linux, for a desktop we cannot read,
   * and for any platform the admin has not published a link for. Nothing is
   * lost by guessing wrong either — the Apps page lists every platform with
   * its own button.
   */
  const openDownloadModal = () => {
    if (isMobileStorePlatform()) {
      openAppOrStore()
      return
    }
    const platform = detectPlatform()
    const url = urlFor(downloads, platform)
    if (url) {
      trackDownload(TRACK_KEY[platform] || 'desktop', url)
      window.location.href = url
      return
    }
    setDownloadOpen(true)
  }
  /**
   * The full list, whatever device this is. For callers that are already
   * about a specific platform and only need somewhere to send a visitor when
   * that platform has no published link — sending them the local download
   * instead would hand a Windows file to someone who asked for the Mac one.
   */
  const showDownloadOptions = () => setDownloadOpen(true)
  const closeDownloadModal = () => setDownloadOpen(false)

  /**
   * Props for a Download control. Spread them, do not pick them apart:
   *
   *   <Button {...downloadLink}>Download</Button>
   *
   * On iOS this is a real href, and that is the whole point. Safari treats a
   * navigation the page performs itself — `window.location = …` — like an
   * address typed into the bar, so handing it an App Store URL that way puts
   * up "Open this page in 'App Store'?" and waits for a second tap. A link
   * the visitor taps is passed to the App Store without the question, which
   * is why every store badge on the web is an anchor. Apple's own guidance
   * is the same: render the link and let the user tap it. There is no script
   * equivalent, so a click handler cannot fix this — only markup can.
   *
   * macOS is in here for the same reason: its download is an App Store
   * listing too, so a Mac would meet the same confirmation the day the admin
   * publishes a Mac link. Nothing changes until then — there is no Mac URL
   * yet, so a Mac still falls through to the handler below.
   *
   * Windows is deliberately not here. Its download is a file on our own CDN,
   * an ordinary download with no other app to hand over to, so nothing stops
   * to ask and the handler is already direct.
   *
   * Android keeps the handler because its tap still has to decide something:
   * the installed app, or the Play Store.
   */
  const device = detectPlatform()
  const storeUrl = device === 'IOS' || device === 'MAC' ? urlFor(downloads, device) : undefined
  const downloadLink = storeUrl
    ? { href: storeUrl, onClick: () => trackDownload(TRACK_KEY[device] || 'desktop', storeUrl) }
    : { onClick: openDownloadModal }

  return (
    <ModalContext.Provider
      value={{
        openAuthModal,
        closeAuthModal,
        openDownloadModal,
        downloadLink,
        showDownloadOptions,
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

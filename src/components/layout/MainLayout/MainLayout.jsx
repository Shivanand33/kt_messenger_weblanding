import { Navbar } from '../Navbar/Navbar'
import { Footer } from '../Footer/Footer'
import { ThemeToggle } from '../../common/ThemeToggle/ThemeToggle'
import { useSwipeTheme } from '../../../hooks/useSwipeTheme'

export function MainLayout({ children }) {
  const { handlers } = useSwipeTheme()

  return (
    <div
      {...handlers}
      className="min-h-screen overflow-x-clip bg-cream text-body transition-colors duration-500"
    >
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ThemeToggle />
    </div>
  )
}

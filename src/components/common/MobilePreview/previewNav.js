import { createContext, useContext } from 'react'

/**
 * Lets a tappable control inside the phone move the prototype to another
 * screen. The modal owns the current index and supplies `goTo`; screens only
 * name the destination, so a tab, a chat row and a settings row all route the
 * same way.
 */
export const PreviewNavContext = createContext({ goTo: () => {} })

export function usePreviewNav() {
  return useContext(PreviewNavContext)
}

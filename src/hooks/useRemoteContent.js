import { useEffect, useState } from 'react'

/**
 * Admin-managed content with a hardcoded fallback.
 *
 * The component renders `fallback` immediately, so the page is never blank and
 * never waits on the network. A background fetch then replaces it — but only
 * if the response passes `isValid`. Anything else (API down, empty table,
 * malformed payload) leaves the fallback on screen untouched.
 *
 * This is the contract the whole CMS migration relies on: connecting a section
 * to the admin can change what it shows, but it can never make it show
 * nothing.
 *
 * @param {() => Promise<any>} fetcher   Called once on mount.
 * @param {any}                fallback  Rendered until a valid response lands.
 * @param {(data:any)=>boolean} [isValid] Defaults to "a non-empty array or any
 *                                        truthy value".
 * @returns {[any, boolean]} `[data, isRemote]` — isRemote is true once the
 *                           admin copy is in use, which is useful in tests and
 *                           for verifying a phase actually switched over.
 */
export function useRemoteContent(fetcher, fallback, isValid) {
  const [data, setData] = useState(fallback)
  const [isRemote, setIsRemote] = useState(false)

  useEffect(() => {
    let alive = true
    const valid = isValid || ((d) => (Array.isArray(d) ? d.length > 0 : Boolean(d)))

    Promise.resolve()
      .then(fetcher)
      .then((res) => {
        if (!alive || !valid(res)) return
        setData(res)
        setIsRemote(true)
      })
      .catch(() => {
        /* keep the fallback already on screen */
      })

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [data, isRemote]
}

import { Navigate, useLocation } from 'react-router-dom'
import { useFeatureNavMap } from '../hooks/useFeatureNavHref'

/**
 * Canonical URLs for the feature pages.
 *
 * The header Features menu opens each feature at the keyword-rich URL
 * configured in admin Navigation (/private-messaging-app), while long-lived
 * links all over the site (footer, in-page sections, related cards, blog
 * bodies) still point at the short routes the code declares (/messaging).
 * Both routes render the same page, so one feature used to be reachable at
 * two different URLs depending on where the visitor clicked. Mounted once at
 * the app root, this replaces the short URL with the configured one whenever
 * a feature page is opened at it, so the address bar always shows the same
 * URL for a feature.
 *
 * Until the admin Navigation list loads (or if it cannot be reached) nothing
 * is redirected, paths that are not feature routes are never touched, and an
 * already-canonical URL redirects no further.
 */
export function FeatureCanonicalRedirect() {
  const location = useLocation()
  const byPath = useFeatureNavMap()

  const canonical = byPath[location.pathname]
  if (!canonical || canonical === location.pathname) return null

  return <Navigate replace to={{ pathname: canonical, search: location.search, hash: location.hash }} />
}

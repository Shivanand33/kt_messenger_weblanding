import { useRemoteContent } from './useRemoteContent'
import { api } from '../services/apiClient'

// The short route each page's code declares, recognised from an admin
// Navigation label by the same loose matching the navbar relies on. Feature
// labels come from the features_menu list, the page labels from the header
// list. Order matters only within one label; feature rules stay first.
const LABEL_TO_PATH = [
  { match: /call/, path: '/calling' },
  { match: /messag|chat/, path: '/messaging' },
  { match: /group/, path: '/groups' },
  { match: /channel|broadcast/, path: '/channels' },
  { match: /(?:^|\s)ai(?:\s|$)/, path: '/ai' },
  { match: /status/, path: '/status' },
  { match: /secur|encrypt/, path: '/security' },
  { match: /plus|premium/, path: '/plus' },
  { match: /note/, path: '/notes' },
  { match: /mini/, path: '/minis' },
  { match: /communit/, path: '/community' },
  { match: /privacy/, path: '/privacy' },
  { match: /blog/, path: '/blog' },
  { match: /apps/, path: '/apps' },
  { match: /help/, path: '/help' },
  { match: /business/, path: '/business' },
]

/**
 * The short route -> navbar URL mapping, built from the same admin Navigation
 * lists the header renders: the Features dropdown (features_menu) and the
 * header tabs (header). The admin points each page at its keyword-rich URL
 * (/private-messaging-app for Privacy, /video-calling-app for Calling), while
 * the code's routes declare the short paths (/privacy, /calling) that links
 * all over the site still use — so one page used to open at two different
 * URLs depending on where it was clicked. Empty until the lists load (or if
 * they are empty/unreachable).
 *
 * @returns {Record<string, string>} short path (e.g. '/calling') -> navbar URL
 */
export function useFeatureNavMap() {
  const [rows] = useRemoteContent(
    () =>
      Promise.all([api.getNavigation('features_menu'), api.getNavigation('header')]).then(
        ([features, header]) => [...(features || []), ...(header || [])],
      ),
    null,
    (list) => Array.isArray(list) && list.length > 0,
  )

  // Renamed URLs: the old address keeps working and lands on the new one, so
  // bookmarks and external links never 404. ('/minis' also arrives here via
  // the admin navigation row above — same target.)
  const RENAMES = { '/messaging-app': '/messaging' }

  // Canonical feature URLs, mirroring the admin Navigation rows. These only
  // apply while the Navigation lists have not loaded (or cannot be reached) —
  // once the admin data arrives it overrides every entry below, so the admin
  // panel stays the single place to change a URL. Without this fallback a
  // visitor opening a short route while the API is unreachable would never be
  // redirected to the keyword-rich URL.
  const CANONICAL_FALLBACK = {
    '/calling': '/video-calling-app',
    '/groups': '/group-chat-app',
    '/channels': '/social-media-platform',
    '/ai': '/ai-assistant-app',
    '/status': '/social-feed-app',
    '/security': '/secure-messaging-app',
    '/plus': '/premium-messaging-app',
    '/notes': '/notes-app',
    '/minis': '/minis-short-video-app',
    '/privacy': '/private-messaging-app',
    '/blog': '/messaging-social-media-blog',
    '/apps': '/messaging-app-download',
    '/help': '/messaging-app-help',
    '/business': '/business-messaging-app',
  }

  const byPath = {}
  for (const row of rows || []) {
    const label = String(row.label || '').toLowerCase()
    const hit = LABEL_TO_PATH.find((x) => x.match.test(label))
    if (hit && typeof row.href === 'string' && row.href.startsWith('/')) {
      byPath[hit.path] = row.href
    }
  }
  return { ...CANONICAL_FALLBACK, ...RENAMES, ...byPath }
}

/**
 * Resolve a hardcoded short route (/calling, /privacy) to the URL the navbar
 * actually opens for that page, so footer links, in-page cards and carousels
 * land on the same URL as the header instead of the short route they
 * hardcoded. Falls back to the given route while the admin lists are loading
 * or when the page is not in them.
 *
 * @returns {(fallbackPath: string) => string}
 */
export function useFeatureNavHref() {
  const byPath = useFeatureNavMap()
  return (fallbackPath) => byPath[fallbackPath] || fallbackPath
}

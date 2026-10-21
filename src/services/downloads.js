import { api } from './apiClient'
import { useRemoteContent } from '../hooks/useRemoteContent'

/**
 * Where the app can be downloaded, resolved from the admin's App Releases.
 *
 * This used to live inside DownloadModal, but the modal is no longer the only
 * thing that needs it: the Download buttons send a visitor straight to their
 * own platform's file, and the Apps page links each store badge at its own
 * store. All three read the same rows so a link the admin changes moves
 * everywhere at once.
 */

// The links the site shipped before the admin became the source of truth.
// They remain the fallback if the API is unreachable.
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ogoul.kalamtime'
export const APP_STORE_URL = 'https://apps.apple.com/in/app/kt-messenger/id6478195913'
export const WINDOWS_EXE_URL = 'https://cdn1.ktmessenger.com/KT%20MESSENGER%20INSTALL.EXE'

export const FALLBACK_PLATFORMS = [
  { platform: 'ANDROID', url: PLAY_STORE_URL },
  { platform: 'IOS', url: APP_STORE_URL },
  { platform: 'WINDOWS', url: WINDOWS_EXE_URL },
]

/** Analytics bucket for each platform, as trackDownload() expects it. */
export const TRACK_KEY = { ANDROID: 'android', IOS: 'ios', WINDOWS: 'desktop', MAC: 'desktop' }

const KNOWN = new Set(['ANDROID', 'IOS', 'WINDOWS', 'MAC'])

/**
 * A link we can actually send someone to. A store *homepage* (no path) is
 * treated as a placeholder, not a real link — otherwise an unfinished admin
 * row would ship a download button that drops users on apple.com instead of
 * KT Messenger.
 */
export const isUsableUrl = (url) => {
  if (!url || !/^https?:\/\//i.test(url)) return false
  try {
    return new URL(url).pathname.replace(/\/+$/, '').length > 0
  } catch {
    return false
  }
}

/** Turn /api/downloads rows into { platform, url, version } entries. */
export function toPlatforms(rows) {
  const list = (rows || [])
    .map((r) => {
      const platform = String(r.platform || '').toUpperCase()
      // A direct installer wins over a store page when both are present.
      const url = [r.downloadUrl, r.storeUrl].find(isUsableUrl)
      return KNOWN.has(platform) && url ? { platform, url, version: r.version } : null
    })
    .filter(Boolean)

  const merged = [...list]
  for (const fb of FALLBACK_PLATFORMS) {
    if (!merged.some((m) => m.platform === fb.platform)) merged.push(fb)
  }

  const order = ['ANDROID', 'IOS', 'WINDOWS', 'MAC']
  return merged.sort((a, b) => order.indexOf(a.platform) - order.indexOf(b.platform))
}

/** The download rows, with the shipped fallback until the API answers. */
export function useDownloads() {
  const [platforms] = useRemoteContent(() => api.getDownloads().then(toPlatforms), FALLBACK_PLATFORMS)
  return platforms
}

/** The URL for one platform, or undefined when it has no published link. */
export const urlFor = (platforms, platform) =>
  platform ? platforms.find((p) => p.platform === platform)?.url : undefined

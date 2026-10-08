import { useEffect, useState } from 'react'

// One place that knows where the KT Messenger app lives on each store. The
// package id is the one used by the Play Store listing; keep them in sync.
const ANDROID_PACKAGE = 'com.ogoul.kalamtime'
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`
const APP_STORE_URL = 'https://apps.apple.com/in/app/kt-messenger/id6478195913'

// The app's URL scheme on iOS. If the app team ever changes it, only this
// string changes.
const IOS_SCHEME_URL = 'ktmessenger://'

export const isAndroid = () => /android/i.test(navigator.userAgent)
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

/** True on phones/tablets that install the app from a store. */
export const isMobileStorePlatform = () => isAndroid() || isIOS()

/**
 * Android intent URL: Chrome opens the app directly when it is installed and
 * navigates the tab to browser_fallback_url when it is not — so one tap does
 * "Open App" or "Download from Play Store" automatically.
 */
const ANDROID_INTENT_URL = `intent://open#Intent;package=${ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`

/**
 * Mobile-only download flow: open the installed app when there is one, else
 * land on the device's app store. Desktop callers keep the download modal.
 */
export function openAppOrStore() {
  if (isAndroid()) {
    window.location.href = ANDROID_INTENT_URL
    // Browsers without intent-URL support (e.g. Firefox) ignore the line above
    // and stay on the page — send those to the Play Store instead.
    window.setTimeout(() => {
      if (!document.hidden) window.location.href = PLAY_STORE_URL
    }, 2000)
    return
  }
  if (isIOS()) {
    const started = Date.now()
    window.location.href = IOS_SCHEME_URL
    // Switching to the app hides the tab; if we are still visible after the
    // grace period the app is not installed, so open the App Store.
    window.setTimeout(() => {
      if (!document.hidden && Date.now() - started < 3000) window.location.href = APP_STORE_URL
    }, 1500)
  }
}

/**
 * Chrome-on-Android can tell a site whether a declared related app is
 * installed (needs /.well-known/assetlinks.json served on this origin and the
 * app listing this site). Everywhere else it resolves to false, and the smart
 * tap behaviour above still covers opening the app.
 */
async function checkAppInstalled() {
  if (typeof navigator === 'undefined' || typeof navigator.getInstalledRelatedApps !== 'function') return false
  try {
    const apps = await navigator.getInstalledRelatedApps()
    return Array.isArray(apps) && apps.length > 0
  } catch {
    return false
  }
}

/** True when the browser has confirmed the app is installed on this device. */
export function useAppInstalled() {
  const [installed, setInstalled] = useState(false)
  useEffect(() => {
    let alive = true
    checkAppInstalled().then((yes) => {
      if (alive) setInstalled(yes)
    })
    return () => {
      alive = false
    }
  }, [])
  return installed
}

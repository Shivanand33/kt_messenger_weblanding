import { useEffect, useState } from 'react'

// One place that knows where the KT Messenger app lives on each store. The
// package id is the one used by the Play Store listing; keep them in sync.
const ANDROID_PACKAGE = 'com.ogoul.kalamtime'
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`
const APP_STORE_URL = 'https://apps.apple.com/in/app/kt-messenger/id6478195913'

export const isAndroid = () => /android/i.test(navigator.userAgent)
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

/** True on phones/tablets that install the app from a store. */
export const isMobileStorePlatform = () => isAndroid() || isIOS()

/**
 * Which platform's download this visitor most likely wants: 'ANDROID',
 * 'IOS', 'WINDOWS', 'MAC', or null when we cannot tell (Linux, a crawler,
 * anything unrecognised). The keys match the admin's App Release platforms.
 *
 * Callers use this to put that download first, never to hide the others —
 * sniffing is a guess, people download for a device they are not holding,
 * and the HTML is prerendered, so the page has to make sense before any of
 * this runs.
 *
 * Two things this has to get right:
 *
 *   iPadOS reports itself as a Mac. Since iPadOS 13 Safari sends a
 *   "Macintosh" user agent, so isIOS() is false on a current iPad and a
 *   plain Mac check would send it to the macOS build. A desktop Mac has no
 *   touch screen, so maxTouchPoints separates the two.
 *
 *   userAgentData is asked first where it exists. Chromium reports the real
 *   platform there while freezing the legacy string, so on those browsers it
 *   is the answer rather than a guess at one.
 */
/**
 * An iPad specifically, as opposed to an iPhone. Both answer IOS from
 * detectPlatform() because they share one App Store listing, but the Apps
 * page carries a separate iPadOS card and needs to tell them apart.
 *
 * A current iPad is only recognisable as the combination of a Mac user agent
 * and a touch screen; older ones still say "iPad" outright.
 */
export function isIPad() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/ipad/i.test(ua)) return true
  // Every iPhone user agent carries "like Mac OS X", so a phone matches the
  // Mac test below and has a touch screen — it has to be ruled out first or
  // it reads as the iPad disguise.
  if (/iphone|ipod/i.test(ua)) return false
  const mac = /macos|mac os/i.test(navigator.userAgentData?.platform || '') || /mac os x|macintosh/i.test(ua)
  return mac && navigator.maxTouchPoints > 1
}

export function detectPlatform() {
  if (typeof navigator === 'undefined') return null

  const hinted = navigator.userAgentData?.platform || ''
  if (/windows/i.test(hinted)) return 'WINDOWS'
  if (/android/i.test(hinted)) return 'ANDROID'
  // "macOS" from a touch device is an iPad; see above.
  if (/macos|mac os/i.test(hinted)) return navigator.maxTouchPoints > 1 ? 'IOS' : 'MAC'

  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) return 'ANDROID'
  if (/iphone|ipad|ipod/i.test(ua)) return 'IOS'
  if (/windows/i.test(ua)) return 'WINDOWS'
  if (/mac os x|macintosh/i.test(ua)) return navigator.maxTouchPoints > 1 ? 'IOS' : 'MAC'
  return null
}

/**
 * Android intent URL: Chrome opens the app directly when it is installed and
 * navigates the tab to browser_fallback_url when it is not — so one tap does
 * "Open App" or "Download from Play Store" automatically.
 */
const ANDROID_INTENT_URL = `intent://open#Intent;package=${ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`

/**
 * Mobile-only download flow. Desktop callers keep the download modal.
 *
 * Android opens the installed app and otherwise lands on the Play Store, in
 * one navigation. iOS goes straight to the App Store.
 *
 * Call this from a click handler and nothing else. Both branches navigate
 * synchronously so that the visitor's tap is still the thing driving the
 * navigation — see the iOS note below for why that matters.
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
    // Safari only hands a page over to another app without asking while the
    // visitor's gesture is still live. This used to try ktmessenger:// first
    // and fall back to the store from a 1.5s timer, which meant every iPhone
    // without the app got "Open this page in 'App Store'?" — by the time the
    // timer fired the gesture had expired, so Safari asked for permission.
    //
    // Going straight to the listing costs people who already have the app one
    // extra tap (the listing's "OPEN" button) and saves everyone else a
    // dialog. Universal Links would give us both, but that needs
    // apple-app-site-association served on this domain and Associated Domains
    // declared in the app — app-team work, not something the site can do.
    window.location.href = APP_STORE_URL
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

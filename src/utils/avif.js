import { imageKey } from './imageKey'

/**
 * AVIF versions of the bundled JPG/PNG images, served only to browsers that
 * can decode AVIF. Every other browser keeps receiving the original file, so
 * nothing can render as a broken image.
 *
 * The originals stay the source of truth: components still import
 * `business.jpg`, admin overrides and ALT text are still keyed on
 * `business.jpg`, and only the final URL handed to <img src> changes.
 */

// Original filename ('business.jpg') -> URL of its AVIF sibling.
const ORIGINALS = import.meta.glob('../assets/images/*.{png,jpg,jpeg}', { eager: true, query: '?url', import: 'default' })
const AVIFS = import.meta.glob('../assets/images/*.avif', { eager: true, query: '?url', import: 'default' })

const fileName = (p) => p.slice(p.lastIndexOf('/') + 1)
const stem = (name) => name.replace(/\.[^.]+$/, '')

const avifByStem = {}
for (const [p, url] of Object.entries(AVIFS)) avifByStem[stem(fileName(p))] = url

const stemCount = {}
for (const p of Object.keys(ORIGINALS)) stemCount[stem(fileName(p))] = (stemCount[stem(fileName(p))] || 0) + 1

const AVIF_FOR = {}
for (const p of Object.keys(ORIGINALS)) {
  const name = fileName(p)
  // Skip a stem shared by two originals (x.jpg and x.png): the AVIF would be ambiguous.
  if (stemCount[stem(name)] === 1 && avifByStem[stem(name)]) AVIF_FOR[name] = avifByStem[stem(name)]
}

let supported = false

// A 1x1 AVIF. Decoding it is the reliable way to ask the browser whether it
// supports the format; there is no synchronous API for that.
const PROBE =
  'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAD6AAEAAAAAAAAAGQAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAhbWRhdBIACgc4AAYQENBpMgwYAAooooQAALATS9g='

/**
 * Resolve once, before the app renders, so the very first <img> already gets
 * the right format. Any failure or a slow decode falls back to the originals.
 */
export function detectAvifSupport(timeoutMs = 500) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') return resolve(false)
    const probe = new Image()
    const finish = (ok) => {
      supported = ok
      resolve(ok)
    }
    const timer = setTimeout(() => finish(false), timeoutMs)
    probe.onload = () => {
      clearTimeout(timer)
      finish(probe.width === 1)
    }
    probe.onerror = () => {
      clearTimeout(timer)
      finish(false)
    }
    probe.src = PROBE
  })
}

/** The AVIF URL for a bundled JPG/PNG when the browser supports it, else `src` unchanged. */
export function avif(src) {
  if (!supported || typeof src !== 'string' || !src) return src
  return AVIF_FOR[imageKey(src)] || src
}

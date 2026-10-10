import { useSyncExternalStore } from 'react'

/**
 * The avatar the prototype's demo account wears, plus the pieces the in-phone
 * avatar builder can change.
 *
 * It lives in a tiny external store rather than React state because three
 * separate screens draw the same face — the builder, Profile and the Settings
 * header — and they are never mounted under a shared parent that could hold it.
 * Everything here is drawn as SVG, so a choice shows up instantly at any size.
 */

/* ------------------------------------------------------------- the pieces */

/** Silhouettes sit over a head centred at (32, 29) in a 64×64 box. */
export const HAIR_STYLES = [
  { id: 'none', label: 'Bald' },
  { id: 'buzz', label: 'Buzz cut', path: 'M14 28 Q14 13 32 13 Q50 13 50 28 Q50 19 32 19 Q14 19 14 28 Z' },
  { id: 'crop', label: 'Crop', path: 'M13 29 Q13 10 32 10 Q51 10 51 29 Q51 17 32 17 Q13 17 13 29 Z' },
  {
    id: 'spiky',
    label: 'Spiky',
    path: 'M13 28 Q13 14 16 16 Q17 8 22 14 Q26 6 32 13 Q38 6 42 14 Q47 8 48 16 Q51 14 51 28 Q51 17 32 17 Q13 17 13 28 Z',
  },
  { id: 'quiff', label: 'Quiff', path: 'M13 28 Q13 12 24 10 Q30 2 44 8 Q52 12 51 28 Q51 16 32 16 Q13 16 13 28 Z' },
  { id: 'side', label: 'Side part', path: 'M13 29 Q13 10 32 10 Q51 10 51 29 Q51 17 36 17 Q24 19 13 29 Z' },
  { id: 'bowl', label: 'Bowl', path: 'M11 32 Q11 8 32 8 Q53 8 53 32 Q53 14 32 14 Q11 14 11 32 Z' },
  {
    id: 'curly',
    label: 'Curly',
    path: 'M12 30 Q8 20 14 16 Q14 8 22 10 Q26 4 32 9 Q38 4 42 10 Q50 8 50 16 Q56 20 52 30 Q52 16 32 16 Q12 16 12 30 Z',
  },
  { id: 'afro', label: 'Afro', path: 'M10 31 A22 20 0 0 1 54 31 Q54 15 32 15 Q10 15 10 31 Z' },
  {
    id: 'bob',
    label: 'Bob',
    path: 'M11 44 L11 28 Q11 8 32 8 Q53 8 53 28 L53 44 L45 44 L45 28 Q45 16 32 16 Q19 16 19 28 L19 44 Z',
  },
  {
    id: 'long',
    label: 'Long',
    path: 'M11 58 L11 28 Q11 8 32 8 Q53 8 53 28 L53 58 Q49 52 45 58 L45 28 Q45 16 32 16 Q19 16 19 28 L19 58 Q15 52 11 58 Z',
  },
  {
    id: 'bun',
    label: 'Top knot',
    path: 'M14 28 Q14 13 32 13 Q50 13 50 28 Q50 19 32 19 Q14 19 14 28 Z M32 2 A5 5 0 1 1 32 12 A5 5 0 1 1 32 2 Z',
  },
  {
    id: 'ponytail',
    label: 'Ponytail',
    path: 'M13 29 Q13 10 32 10 Q51 10 51 29 Q51 17 32 17 Q13 17 13 29 Z M50 18 Q58 22 56 34 Q54 42 49 40 Q54 32 50 22 Z',
  },
  {
    id: 'cap',
    label: 'Cap',
    path: 'M12 25 Q12 11 32 11 Q52 11 52 25 L58 26 Q58 30 52 29 Q52 17 32 17 Q12 17 12 29 Q6 30 6 26 Z',
  },
  {
    id: 'hat',
    label: 'Wide hat',
    path: 'M4 26 Q4 22 32 22 Q60 22 60 26 Q60 30 32 30 Q4 30 4 26 Z M14 25 Q14 8 32 8 Q50 8 50 25 Q50 14 32 14 Q14 14 14 25 Z',
  },
  {
    id: 'hood',
    label: 'Head covering',
    path: 'M10 50 Q10 6 32 6 Q54 6 54 50 Q54 44 48 42 L48 28 Q48 16 32 16 Q16 16 16 28 L16 42 Q10 44 10 50 Z',
  },
]

export const HAIR_COLOURS = [
  { id: 'jet', label: 'Jet black', hex: '#241c16' },
  { id: 'dark', label: 'Dark brown', hex: '#402a1c' },
  { id: 'brown', label: 'Brown', hex: '#63432a' },
  { id: 'chestnut', label: 'Chestnut', hex: '#7d5433' },
  { id: 'light', label: 'Light brown', hex: '#9a6f44' },
  { id: 'blonde', label: 'Blonde', hex: '#d1a45c' },
  { id: 'platinum', label: 'Platinum', hex: '#ded2b8' },
  { id: 'auburn', label: 'Auburn', hex: '#8c3b22' },
  { id: 'ginger', label: 'Ginger', hex: '#c0582c' },
  { id: 'silver', label: 'Silver', hex: '#9aa3ab' },
  { id: 'ink', label: 'Ink blue', hex: '#2f5fb0' },
  { id: 'rose', label: 'Rose', hex: '#c0538a' },
]

export const FACIAL_HAIR = [
  { id: 'clean', label: 'Clean shaven' },
  {
    id: 'stubble',
    label: 'Stubble',
    opacity: 0.4,
    path: 'M18 33 Q18 48 32 50 Q46 48 46 33 Q46 43 32 43 Q18 43 18 33 Z',
  },
  { id: 'moustache', label: 'Moustache', path: 'M25 39 Q32 36 39 39 Q36 43 32 41.5 Q28 43 25 39 Z' },
  { id: 'goatee', label: 'Goatee', path: 'M27 39 Q32 37 37 39 Q37 50 32 52 Q27 50 27 39 Z' },
  { id: 'short', label: 'Short beard', path: 'M17 32 Q17 51 32 54 Q47 51 47 32 Q47 45 32 45 Q17 45 17 32 Z' },
  { id: 'full', label: 'Full beard', path: 'M16 28 Q14 55 32 58 Q50 55 48 28 Q48 45 32 45 Q16 45 16 28 Z' },
]

/* -------------------------------------------------------------- the store */

const DEFAULT = { hair: 2, colour: 0, beard: 0 }
let config = DEFAULT
const listeners = new Set()

export function setAvatar(patch) {
  config = { ...config, ...patch }
  listeners.forEach((fn) => fn())
}

/** Pick a look at random — what the builder's Shuffle does. */
export function shuffleAvatar() {
  setAvatar({
    hair: Math.floor(Math.random() * HAIR_STYLES.length),
    colour: Math.floor(Math.random() * HAIR_COLOURS.length),
    beard: Math.floor(Math.random() * FACIAL_HAIR.length),
  })
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useAvatarConfig() {
  return useSyncExternalStore(subscribe, () => config, () => config)
}

/* ------------------------------------------------------------- the drawing */

const SKIN = '#c08552'
const SKIN_SHADE = '#a86f42'

/** The demo account's face, wearing whatever the builder last chose. */
export function AvatarArt({ size = 64, className = '' }) {
  const { hair, colour, beard } = useAvatarConfig()
  const hairStyle = HAIR_STYLES[hair] || HAIR_STYLES[0]
  const beardStyle = FACIAL_HAIR[beard] || FACIAL_HAIR[0]
  const ink = (HAIR_COLOURS[colour] || HAIR_COLOURS[0]).hex

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} role="img" aria-label="Your avatar">
      {/* Hoodie and neck */}
      <path d="M9 64 Q9 48 24 45 L40 45 Q55 48 55 64 Z" fill="#3c4a54" />
      <path d="M26 45 L38 45 L36 52 Q32 55 28 52 Z" fill="#4e5f6a" />
      <rect x="28" y="36" width="8" height="11" rx="4" fill={SKIN_SHADE} />

      {/* Head */}
      <circle cx="15" cy="32" r="3.4" fill={SKIN} />
      <circle cx="49" cy="32" r="3.4" fill={SKIN} />
      <ellipse cx="32" cy="29" rx="16" ry="18" fill={SKIN} />

      {/* Face */}
      <ellipse cx="25" cy="28" rx="4.2" ry="5" fill="#ffffff" />
      <ellipse cx="39" cy="28" rx="4.2" ry="5" fill="#ffffff" />
      <circle cx="25.6" cy="29" r="2.4" fill="#1b2227" />
      <circle cx="39.6" cy="29" r="2.4" fill="#1b2227" />
      <path d="M21 21 Q25 19 29 21" stroke={ink} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M35 21 Q39 19 43 21" stroke={ink} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M27 37 Q32 43 37 37 Q32 40 27 37 Z" fill="#7d3030" />

      {/* Facial hair sits under the hair, so a fringe still overlaps it */}
      {beardStyle.path ? <path d={beardStyle.path} fill={ink} opacity={beardStyle.opacity ?? 1} /> : null}
      {hairStyle.path ? <path d={hairStyle.path} fill={ink} /> : null}
    </svg>
  )
}

/** One silhouette on its own, for the builder's picker tiles. */
export function HairGlyph({ path, colour = '#241c16', size = 38 }) {
  if (!path) return null
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <path d={path} fill={colour} />
    </svg>
  )
}

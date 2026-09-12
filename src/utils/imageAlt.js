/**
 * Keywords for fallback ALT Text generation when no custom ALT Text is provided in Admin.
 */
export const ALT_KEYWORDS = [
  'social media platform management',
  'professional social networking platform',
  'social media platform in india',
  'social networking platforms',
  'social media platform for business',
  'social media platform popularity',
  'social media marketers near me',
  'social media marketing company near me',
  'how to get leads from social media',
  'how to increase sales through social media',
  'instant messaging app',
  'free instant messaging app',
  'app for instant messaging',
  'secure instant messaging app',
  'most popular instant messaging app',
  'private chat app',
  'app for private chat',
  'best app for private chat',
  'private messaging app iphone',
  'free live chat application',
  'best free chat application',
  'free chat app in india',
  'best free chat app in india',
  'online messaging platform',
  'real time chat app',
  'real time messaging app',
  'mobile chat platform'
]

/**
 * Get a deterministic keyword fallback based on image key/src.
 */
export function getKeywordFallback(src, fallbackText) {
  if (fallbackText && typeof fallbackText === 'string' && fallbackText.trim()) {
    return fallbackText.trim()
  }
  if (!src || typeof src !== 'string') {
    return ALT_KEYWORDS[0]
  }

  const clean = src.split('?')[0].split('#')[0]
  const filename = clean.slice(clean.lastIndexOf('/') + 1) || src

  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    hash = (hash << 5) - hash + filename.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % ALT_KEYWORDS.length
  return ALT_KEYWORDS[index]
}

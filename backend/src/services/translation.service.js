import crypto from 'node:crypto'
import { prisma } from '../config/db.js'
import { env } from '../config/env.js'
import { LANGUAGES, DEFAULT_LANG } from './hreflang.service.js'

/**
 * Machine translation of admin content into the website's other languages.
 *
 * A public API request made from a page in another language carries
 * `?lang=<code>` (src/services/apiClient.js on the website). The response then
 * gets a `translations` map — { English text: translated text } — for the text
 * it contains (middleware/translate.js); the content itself stays English, so
 * the website's lookups by title and slug keep working.
 *
 * Each text is translated once per language with the Google Cloud Translation
 * API and stored in the `translations` table, keyed by a hash of the English
 * source: edited content is translated again, everything else is read back.
 * Without GOOGLE_TRANSLATE_API_KEY nothing is translated and pages stay English.
 */

const TARGETS = new Set(LANGUAGES.map((l) => l.lang).filter((l) => l !== DEFAULT_LANG))

/** The website language to translate into, or null (English or unknown). */
export const translationTarget = (lang) => (typeof lang === 'string' && TARGETS.has(lang) ? lang : null)

// Website language -> Google language code, where the two differ.
const GOOGLE_CODE = { 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', fil: 'tl' }

/* ── what to translate ────────────────────────────────────────────────── */

// Names that stay as they are, inside any translated text.
const KEEP_NAMES = [
  'KT Business Agent', 'KT Messenger', 'KT Business', 'KT Wallet', 'KT Coins', 'KT Flows', 'KT Minis', 'KT Plus',
  'KT Web', 'KT AI', 'Signal Protocol', 'Google Play', 'App Store', 'iPadOS', 'iPhone', 'iPad', 'macOS', 'iOS',
  'Android', 'Windows',
]
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const NAMES = KEEP_NAMES.map(escapeRe).join('|')
// {{download}} / {{qr}} tokens, {placeholders} and the names above.
const KEEP = new RegExp(`\\{\\{[^{}]+\\}\\}|\\{[^{}]+\\}|\\b(?:${NAMES})\\b`, 'g')
const ONLY_NAMES = new RegExp(`^(?:${NAMES}|[\\s&,/+·|-])+$`)

// Object keys whose values are never page text.
// The website skips the same keys (src/i18n/translateContent.js).
const SKIP_KEY = /^(id|slug|href|to|path|src|url|image|icon|color|colour|gradient|locale|lang|status|platforms?|hash|code|variant)$|^[a-z][a-zA-Z0-9]*(Id|Url|URL|Href|Image|Icon|Color|At)$/

/** Whether a string is page text worth translating (not a slug, URL, file, date, code or name). */
export function isText(value) {
  const s = value.trim()
  if (s.length < 2 || !/\p{L}/u.test(s)) return false
  // Links, paths and #anchors are single tokens ("# Heading" markdown is text).
  if (/^(https?:|mailto:|tel:|data:|www\.|\/|#)\S*$/i.test(s)) return false
  if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(s)) return false
  if (/^[\w./-]+\.(png|jpe?g|webp|avif|gif|svg|ico|pdf|mp4|webm|json)$/i.test(s)) return false
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return false
  if (/^[a-z0-9]+([_-][a-z0-9]+)*$/.test(s)) return false // header, features_menu, a-slug
  if (/^[A-Z0-9_]+$/.test(s)) return false // PUBLISHED, AI
  if (/^[A-Z][a-z]+[A-Z][A-Za-z0-9]*$/.test(s)) return false // FiSend
  return !ONLY_NAMES.test(s)
}

/** Every page text in an API payload (strings under skipped keys excluded). */
export function collectTexts(value, out = new Set(), key = undefined) {
  if (typeof value === 'string') {
    // `text.<page>` maps hold { English: English } for strings nobody edited.
    if (value !== key && isText(value)) out.add(value)
  } else if (Array.isArray(value)) {
    for (const item of value) collectTexts(item, out)
  } else if (value && typeof value === 'object' && !(value instanceof Date)) {
    for (const [k, v] of Object.entries(value)) if (!SKIP_KEY.test(k)) collectTexts(v, out, k)
  }
  return out
}

/* ── markup ───────────────────────────────────────────────────────────── */
// Google translates HTML and leaves tags and attributes alone, so every text is
// sent as HTML: kept names become <span translate="no">, the markdown the site
// renders (**bold**, [label](href)) becomes <b> / <a>, and it all comes back.

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const unescapeHtml = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
    return ENTITIES[e.toLowerCase()] ?? m
  })
const keepNames = (html) => html.replace(KEEP, (m) => `<span translate="no">${m}</span>`)
const unkeep = (html) => html.replace(/<span translate="no">([\s\S]*?)<\/span>/gi, '$1')

const isHtml = (s) => /^\s*<[a-z][\s\S]*>\s*$/i.test(s) && /<\/[a-z][a-z0-9]*>/i.test(s)

// One line of text (with the site's inline markdown) as HTML.
function lineToHtml(line) {
  let html = ''
  let last = 0
  for (const m of line.matchAll(/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    html += keepNames(escapeHtml(line.slice(last, m.index)))
    html += m[1] !== undefined
      ? `<b>${keepNames(escapeHtml(m[1]))}</b>`
      : `<a href="${escapeHtml(m[3]).replace(/"/g, '&quot;')}">${keepNames(escapeHtml(m[2]))}</a>`
    last = m.index + m[0].length
  }
  return html + keepNames(escapeHtml(line.slice(last)))
}

function htmlToLine(html) {
  const text = unkeep(html)
    .replace(/<b>(\s*)([\s\S]*?)(\s*)<\/b>/gi, (_, a, inner, b) => `${a}**${inner}**${b}`)
    .replace(/<a href="([^"]*)">(\s*)([\s\S]*?)(\s*)<\/a>/gi, (_, href, a, label, b) => `${a}[${label}](${unescapeHtml(href)})${b}`)
    .replace(/<[^>]+>/g, '')
  return unescapeHtml(text)
}

// Markdown block prefixes (headings, list items, quotes) stay as they are.
const LINE = /^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+[.)]\s+|>\s?)?)([\s\S]*)$/

/**
 * A source text as the segments to send, and how to rebuild the translation.
 * HTML (Help Center bodies) goes as one segment with its tags; plain text and
 * markdown go line by line, so paragraphs, headings and lists keep their shape.
 */
function prepare(source) {
  if (isHtml(source)) {
    const html = source.replace(/(<[^>]*>)|([^<]+)/g, (m, tag, text) => tag || keepNames(text))
    return { segments: [html], rebuild: ([html2]) => unkeep(html2) }
  }
  const lines = source.split('\n').map((line) => {
    const [, prefix, rest] = line.match(LINE)
    return { prefix, rest, translate: /\p{L}/u.test(rest) && isText(rest) }
  })
  return {
    segments: lines.filter((l) => l.translate).map((l) => lineToHtml(l.rest)),
    rebuild: (translated) => {
      let i = 0
      return lines.map((l) => (l.translate ? l.prefix + htmlToLine(translated[i++]) : l.prefix + l.rest)).join('\n')
    },
  }
}

/* ── Google Cloud Translation (v2) ────────────────────────────────────── */

const MAX_SEGMENTS = 100 // per request (the API takes up to 128)
const MAX_CHARS = 25000 // per request
const MAX_SOURCE = 60000 // longer texts are left in English

async function googleTranslate(segments, lang) {
  const res = await fetch(`${env.translate.endpoint}?key=${encodeURIComponent(env.translate.googleKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: segments, source: 'en', target: GOOGLE_CODE[lang] || lang, format: 'html' }),
    signal: AbortSignal.timeout(env.translate.timeoutMs),
  })
  if (!res.ok) throw new Error(`Google Translate ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const json = await res.json()
  const out = json?.data?.translations?.map((t) => t.translatedText)
  if (!Array.isArray(out) || out.length !== segments.length) throw new Error('Google Translate: unexpected response')
  return out
}

/** Translate source texts (all new to the cache) with as few API calls as possible. */
async function machineTranslate(sources, lang) {
  const prepared = sources.map((source) => ({ source, ...prepare(source) }))
  const results = new Map()
  let batch = []
  let chars = 0
  const flush = async () => {
    if (!batch.length) return
    const translated = await googleTranslate(batch.flatMap((p) => p.segments), lang)
    let i = 0
    for (const p of batch) {
      results.set(p.source, p.rebuild(translated.slice(i, i + p.segments.length)))
      i += p.segments.length
    }
    batch = []
    chars = 0
  }
  for (const p of prepared) {
    if (!p.segments.length) continue
    const size = p.segments.reduce((n, s) => n + s.length, 0)
    if (batch.length && (batch.reduce((n, b) => n + b.segments.length, 0) + p.segments.length > MAX_SEGMENTS || chars + size > MAX_CHARS)) await flush()
    batch.push(p)
    chars += size
  }
  await flush()
  return results
}

/* ── cache ────────────────────────────────────────────────────────────── */

const hashOf = (s) => crypto.createHash('sha256').update(s).digest('hex')
const MEMORY_LIMIT = 50000
const memory = new Map() // `${lang} ${hash}` -> translation
const pending = new Map() // `${lang} ${hash}` -> Promise<string | undefined>

function remember(key, text) {
  if (memory.size >= MEMORY_LIMIT) memory.delete(memory.keys().next().value)
  memory.set(key, text)
}

let lastError = 0
function logFailure(err) {
  // At most once a minute, so a bad key or quota does not flood the logs.
  if (Date.now() - lastError < 60000) return
  lastError = Date.now()
  console.error('[translate]', err?.message || err)
}

/**
 * Translations of `texts` into `lang`: { source: translation }. Reads the
 * cache first; the rest is machine-translated (when a key is configured) and
 * stored. Never throws — whatever cannot be translated is simply left out.
 */
export async function translateTexts(texts, lang) {
  const out = {}
  if (!translationTarget(lang)) return out
  const todo = []
  const waits = []
  for (const source of new Set(texts)) {
    if (typeof source !== 'string' || !source.trim() || source.length > MAX_SOURCE) continue
    const key = `${lang} ${hashOf(source)}`
    const hit = memory.get(key)
    if (hit !== undefined) out[source] = hit
    else if (pending.has(key)) waits.push(pending.get(key).then((text) => { if (text) out[source] = text }))
    else todo.push({ source, key, hash: key.slice(lang.length + 1) })
  }

  if (todo.length) {
    let settle
    const done = new Promise((resolve) => { settle = resolve })
    const found = new Map()
    for (const item of todo) pending.set(item.key, done.then(() => found.get(item.source)))
    try {
      const rows = await prisma.translation.findMany({ where: { locale: lang, hash: { in: todo.map((i) => i.hash) } }, select: { hash: true, text: true } })
      const byHash = new Map(rows.map((r) => [r.hash, r.text]))
      const missing = []
      for (const item of todo) {
        const text = byHash.get(item.hash)
        if (text !== undefined) found.set(item.source, text)
        else missing.push(item)
      }
      if (missing.length && env.translate.googleKey) {
        try {
          const translated = await machineTranslate(missing.map((i) => i.source), lang)
          const data = []
          for (const item of missing) {
            const text = translated.get(item.source)
            if (!text) continue
            found.set(item.source, text)
            data.push({ locale: lang, hash: item.hash, source: item.source, text })
          }
          if (data.length) await prisma.translation.createMany({ data, skipDuplicates: true })
        } catch (err) {
          logFailure(err)
        }
      }
    } catch (err) {
      logFailure(err)
    } finally {
      for (const item of todo) {
        const text = found.get(item.source)
        if (text !== undefined) {
          remember(item.key, text)
          out[item.source] = text
        }
        pending.delete(item.key)
      }
      settle()
    }
  }
  await Promise.all(waits)
  return out
}

/** The `translations` map for one API payload: only texts that really changed. */
export async function translationsFor(data, lang) {
  const texts = [...collectTexts(data)]
  if (!texts.length) return {}
  const translated = await translateTexts(texts, lang)
  for (const [source, text] of Object.entries(translated)) if (!text || text === source) delete translated[source]
  return translated
}

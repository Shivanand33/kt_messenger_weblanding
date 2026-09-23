#!/usr/bin/env node
/**
 * KT Messenger — i18n translation generator.
 *
 * Fills src/i18n/locales/<lang>/*.json with machine translations for every
 * string the UI passes to t('…'), across all SUPPORTED_LANGS. It:
 *   1. Scans src/ for t('…') / t("…") calls and collects the unique English
 *      source strings the site actually uses.
 *   2. Loads each language's dictionary and finds the MISSING strings.
 *   3. Translates only those (existing entries + hand edits are preserved), using
 *      a configurable machine-translation provider.
 *   4. Writes src/i18n/locales/<lang>/common.json (shared strings) and one
 *      <Page>.json per page directory, which loads with that page (keys sorted).
 *
 * This changes NO app/runtime/backend code — it only regenerates the dictionary
 * data files. Components keep working with English fallback until it is run.
 * (Admin content — Help Center, blog, business pages — is translated by the
 * backend instead; see backend/src/services/translation.service.js.)
 *
 * Usage:
 *   npm run i18n:translate -- --dry-run            # report what's missing, no API calls, no writes
 *   npm run i18n:translate                         # translate all missing strings, all languages
 *   npm run i18n:translate -- --lang=hi,es,fr      # only these languages
 *   npm run i18n:translate -- --limit=20           # cap strings per language (smoke test)
 *   npm run i18n:translate -- --rebuild            # re-split existing translations into files, no API calls
 *
 * Configuration (env):
 *   I18N_MT_PROVIDER = google | deepl | libre       (default: google)
 *   I18N_MT_API_KEY  = <your key>                   (required unless --dry-run;
 *                                                    GOOGLE_TRANSLATE_API_KEY also works)
 *   I18N_MT_ENDPOINT = <url>                         (libre/custom only)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'src')
const DICT_FILE = path.join(SRC, 'i18n', 'translations.js')
const LOCALES_DIR = path.join(SRC, 'i18n', 'locales')

// ── CLI args ──────────────────────────────────────────────
const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const opt = (name, def = '') => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : def
}
const DRY_RUN = flag('dry-run')
// Rewrite every language's files into their current common/page split, translating nothing.
const REBUILD = flag('rebuild')
const LIMIT = Number(opt('limit', '0')) || 0
const ONLY_LANGS = opt('lang', '').split(',').map((s) => s.trim()).filter(Boolean)

// ── Brand / proper nouns that must stay in English ────────
const DO_NOT_TRANSLATE = new Set([
  'KT Messenger', 'KT AI', 'KT Plus', 'KT Web', 'KT Business', 'KT Wallet', 'KT Coins',
  'KT Flows', 'KT Business Agent', 'Marketplace', 'iPhone', 'iPad', 'Android', 'Mac',
  'Windows', 'Mac & PC', 'Google Play', 'App Store', 'KT', 'AI', 'Signal Protocol',
])

// ── Language-code mapping per provider ────────────────────
// Filipino is "tl" in the Google Translation API.
const GOOGLE_CODE = { 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', fil: 'tl', he: 'he' }
const DEEPL_CODE = {
  'zh-Hans': 'ZH', 'zh-Hant': 'ZH', pt: 'PT-PT', en: 'EN', el: 'EL', uk: 'UK', ja: 'JA', ko: 'KO',
}

// ── Helpers ───────────────────────────────────────────────
function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, out)
    else if (/\.(jsx?|tsx?)$/.test(name)) out.push(full)
  }
  return out
}

// Extract the string literal passed as the first argument to t(...).
// Matches t('…') and t("…") — and tr('…'), the name BusinessPage gives the
// translator; skips template literals (they may interpolate).
function extractStrings(code) {
  const found = new Set()
  const re = /\b(?:t|tr)\(\s*(['"])((?:\\.|(?!\1).)*)\1/g
  let m
  while ((m = re.exec(code)) !== null) {
    // Unescape simple escapes so the key matches the runtime string.
    const raw = m[2].replace(/\\(['"\\])/g, '$1')
    if (raw.trim()) found.add(raw)
  }
  // imgAlt(src, 'Fallback ALT'): the fallback is shown as ALT text, which is
  // translated too (utils/imageOverrides.js).
  const altRe = /\bimgAlt\(((?:[^()]|\([^()]*\))*)\)/g
  while ((m = altRe.exec(code)) !== null) {
    for (const s of m[1].matchAll(/(['"])((?:\\.|(?!\1).)*)\1/g)) {
      const raw = s[2].replace(/\\(['"\\])/g, '$1')
      if (raw.trim() && !/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(raw)) found.add(raw)
    }
  }
  return found
}

function hasLetters(s) {
  return /\p{L}/u.test(s)
}

// Object keys whose string values are user-facing copy in this codebase's data
// arrays (e.g. `{ title: 'Instant messaging', desc: '…' }`). These arrays are
// often declared at module scope and rendered through a shared component as
// `t(item.title)`, so the plain t('…') scan can't see them.
const DATA_KEYS = [
  'title', 'label', 'desc', 'description', 'text', 'hint', 'summary', 'eyebrow', 'blurb',
  'subtitle', 'badge', 'question', 'answer', 'role', 'focus', 'level', 'sla', 'detail',
  'seats', 'tag', 'caption', 'city', 'country', 'team', 'type', 'location', 'headline', 'shortTag',
  // FAQ entries: { q: 'question', a: 'answer' }
  'q', 'a',
  // Mock chat lists: { msg: 'Are you coming today?', time: 'Yesterday' }
  'msg', 'time',
  // Store badges and requirements on the download page: { top: 'Get it on', req: 'Minimum: …' }
  'top', 'req',
  // Job openings: { department: 'Engineering' }
  'department',
  // Admin-editable page copy keyed by its heading level, as the About page
  // stores it: { h1Title, h1Subheading, p1Text, h2Title, p2Text … }
  'h\\d\\w*', 'p\\d\\w*',
]
// Keys whose value is an array of user-facing strings.
const ARRAY_KEYS = [
  'items', 'tags', 'specs', 'points', 'bullets', 'responsibilities', 'requirements', 'perks', 'list',
]

// Pull copy out of data-array literals. `title: t('…')` is skipped on purpose —
// the value there isn't a quote, and the t() scan already covers it.
function extractDataStrings(code) {
  const found = new Set()
  const propRe = new RegExp(`\\b(?:${DATA_KEYS.join('|')})\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`, 'g')
  let m
  while ((m = propRe.exec(code)) !== null) {
    const raw = m[2].replace(/\\(['"\\])/g, '$1')
    if (raw.trim()) found.add(raw)
  }
  const arrRe = new RegExp(`\\b(?:${ARRAY_KEYS.join('|')})\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'g')
  while ((m = arrRe.exec(code)) !== null) {
    const strRe = /(['"])((?:\\.|(?!\1).)*)\1/g
    let s
    while ((s = strRe.exec(m[1])) !== null) {
      const raw = s[2].replace(/\\(['"\\])/g, '$1')
      if (raw.trim()) found.add(raw)
    }
  }
  // Lists of plain strings shown through t(): UPPER_CASE constants
  // (const SORT_OPTIONS = ['Popular', …]) and lists mapped in place (['Latest', …].map(…)).
  const listRe = /\bconst\s+[A-Z][A-Z0-9_]*\s*=\s*\[([^\][]*)\]|\[([^\][]*)\]\.map\(/g
  while ((m = listRe.exec(code)) !== null) {
    m[1] = m[1] ?? m[2]
    if (!/^\s*(?:(['"])(?:\\.|(?!\1).)*\1\s*,?\s*)+$/.test(m[1])) continue // strings only
    for (const s of m[1].matchAll(/(['"])((?:\\.|(?!\1).)*)\1/g)) {
      const raw = s[2].replace(/\\(['"\\])/g, '$1')
      if (raw.trim()) found.add(raw)
    }
  }
  return found
}

// A string literal in a data module that is shown as text — not an id, code,
// handle, path, file name, date key or Tailwind class list.
function looksLikeText(s) {
  const t = s.trim()
  if (t.length < 2 || !/\p{L}/u.test(t)) return false
  if (/^(https?:|mailto:|tel:|data:|www\.|\.{0,2}\/|#)\S*$/i.test(t)) return false
  if (/^[\w.+-]+@[\w-]+(\.[\w.-]+)?$/.test(t)) return false // hi@x.com, anika@ktpay
  if (/^[\w./-]+\.(png|jpe?g|webp|avif|gif|svg|ico|pdf|mp4|webm|json)$/i.test(t)) return false
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return false
  if (/^[a-z0-9]+([_-][a-z0-9]+)*$/.test(t)) return false // t1, out, wallet, a-slug
  if (/^[A-Z0-9_]+$/.test(t)) return false // ATMFREE, KTC
  if (/^[A-Z][a-z]+[A-Z][A-Za-z0-9]*$/.test(t)) return false // FreshCart, FiSend
  if (/(^|\s)(bg|text|border|from|to|via|ring|shadow|dark:[a-z]+)-\S/.test(t)) return false // Tailwind classes
  return true
}

// Every text literal of a data module (`'Dinner split'`, `'Today, 2:45 PM'` …).
function extractTextLiterals(code) {
  const found = new Set()
  const re = /(['"])((?:\\.|(?!\1).)*?)\1/g
  let m
  while ((m = re.exec(code)) !== null) {
    const raw = m[2].replace(/\\(['"\\])/g, '$1')
    if (looksLikeText(raw)) found.add(raw)
  }
  return found
}

// Home and NotFound are part of the main bundle, so their strings are common.
const EAGER_PAGES = new Set(['Home', 'NotFound'])

/**
 * Every translatable UI string and the dictionary file it goes to: "common"
 * (shared code, several pages, or a page in the main bundle) or the page
 * directory under src/pages/ that alone uses it. A page's file loads with the
 * page's code (App.jsx), so a visitor downloads only what the page shows.
 * @returns {Map<string, string>} string -> bucket
 */
function collectSourceStrings() {
  const files = walk(SRC).filter((f) => path.resolve(f) !== path.resolve(DICT_FILE))
  const owners = new Map()
  const own = (s, owner) => {
    if (!owners.has(s)) owners.set(s, new Set())
    owners.get(s).add(owner)
  }
  const ownerOf = (f) => {
    const [top, dir] = path.relative(SRC, f).split(path.sep)
    return top === 'pages' && dir && !EAGER_PAGES.has(dir) ? dir : 'common'
  }
  for (const f of files) {
    const code = fs.readFileSync(f, 'utf8')
    const owner = ownerOf(f)
    for (const s of extractStrings(code)) own(s, owner)
    // Only mine data arrays from components already wired to the i18n hook —
    // in those files the data really does flow through t() when rendered.
    // A copy field can also hold an id, a tag name or a path; looksLikeText
    // keeps those out of the dictionary.
    if (code.includes('useLanguage')) {
      for (const s of extractDataStrings(code)) if (looksLikeText(s)) own(s, owner)
    }
    // Data modules (./walletData, ./businessProducts …) of pages that translate
    // their data: their text is shown translated too. translateCopy() hands
    // whole objects to t(), so every text literal counts; a page that only
    // calls t() translates the copy fields, so mine those keys.
    const mineData = code.includes('translateCopy(') ? extractTextLiterals : code.includes('useLanguage') ? extractDataStrings : null
    if (mineData) {
      for (const m of code.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
        const data = `${path.resolve(path.dirname(f), m[1])}.js`
        // Page-local .js modules only: a .jsx sibling is a component, walked on
        // its own, and anything outside src/pages is shared plumbing.
        if (!fs.existsSync(data) || !data.startsWith(path.join(SRC, 'pages') + path.sep)) continue
        for (const s of mineData(fs.readFileSync(data, 'utf8'))) if (looksLikeText(s)) own(s, owner)
      }
    }
  }
  const buckets = new Map()
  for (const [s, set] of owners) {
    // Never translate pure brand strings or non-text tokens.
    if (!hasLetters(s) || DO_NOT_TRANSLATE.has(s.trim())) continue
    buckets.set(s, set.size === 1 ? [...set][0] : 'common')
  }
  return buckets
}

// Protect {placeholders} from the translator, restore afterwards.
function protect(text) {
  const tokens = []
  const masked = text.replace(/\{[^}]+\}/g, (mm) => {
    tokens.push(mm)
    return `\uE000${tokens.length - 1}\uE001`
  })
  return { masked, tokens }
}
function restore(text, tokens) {
  return text.replace(/\uE000(\d+)\uE001/g, (_m, i) => tokens[Number(i)] ?? '')
}

// ── Machine-translation providers ─────────────────────────
// Google translates HTML and leaves tags alone, so strings are sent as HTML
// with product names and {placeholders} inside <span translate="no">: they
// come back exactly as written, even in the middle of a sentence.
const KEEP_NAMES = [
  'KT Business Agent', 'KT Messenger', 'KT Business', 'KT Wallet', 'KT Coins', 'KT Flows', 'KT Minis', 'KT Plus',
  'KT Web', 'KT AI', 'Signal Protocol', 'Google Play', 'App Store', 'iPadOS', 'iPhone', 'iPad', 'macOS', 'iOS',
  'Android', 'Windows',
]
const KEEP = new RegExp(`\\{[^{}]+\\}|\\b(?:${KEEP_NAMES.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g')
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const toGoogleHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(KEEP, (m) => `<span translate="no">${m}</span>`)
const fromGoogleHtml = (s) =>
  s
    .replace(/<span translate="no">([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
      return ENTITIES[e.toLowerCase()] ?? m
    })

async function translateBatchGoogle(strings, lang, key) {
  const target = GOOGLE_CODE[lang] || lang
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: strings.map(toGoogleHtml), source: 'en', target, format: 'html' }),
  })
  if (!res.ok) throw new Error(`Google API ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.data.translations.map((t) => fromGoogleHtml(t.translatedText))
}

async function translateBatchDeepl(strings, lang, key) {
  const target = DEEPL_CODE[lang] || lang.toUpperCase()
  const host = /:fx$/.test(key) ? 'https://api-free.deepl.com' : 'https://api.deepl.com'
  const body = new URLSearchParams()
  strings.forEach((s) => body.append('text', s))
  body.append('source_lang', 'EN')
  body.append('target_lang', target)
  const res = await fetch(`${host}/v2/translate`, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`DeepL API ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.translations.map((t) => t.text)
}

async function translateBatchLibre(strings, lang, key, endpoint) {
  const url = `${(endpoint || 'https://libretranslate.com').replace(/\/$/, '')}/translate`
  const out = []
  for (const q of strings) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, source: 'en', target: lang, format: 'text', api_key: key || undefined }),
    })
    if (!res.ok) throw new Error(`LibreTranslate ${res.status}: ${await res.text()}`)
    const json = await res.json()
    out.push(json.translatedText)
  }
  return out
}

const apiKey = () => process.env.I18N_MT_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY || ''

function getTranslator() {
  const provider = (process.env.I18N_MT_PROVIDER || 'google').toLowerCase()
  const key = apiKey()
  const endpoint = process.env.I18N_MT_ENDPOINT || ''
  // Google keeps {placeholders} itself (see toGoogleHtml), so they are not masked.
  if (provider === 'google') return Object.assign((s, l) => translateBatchGoogle(s, l, key), { keepsPlaceholders: true })
  if (provider === 'deepl') return (s, l) => translateBatchDeepl(s, l, key)
  if (provider === 'libre') return (s, l) => translateBatchLibre(s, l, key, endpoint)
  throw new Error(`Unknown I18N_MT_PROVIDER "${provider}" (use google | deepl | libre)`)
}

// Translate a list with placeholder protection and small batches.
async function translateAll(strings, lang, translate) {
  const result = {}
  const BATCH = 40
  for (let i = 0; i < strings.length; i += BATCH) {
    const slice = strings.slice(i, i + BATCH)
    const protectedList = slice.map((s) => (translate.keepsPlaceholders ? { masked: s, tokens: [] } : protect(s)))
    const translated = await translate(protectedList.map((p) => p.masked), lang)
    translated.forEach((tr, j) => {
      result[slice[j]] = restore(tr, protectedList[j].tokens)
    })
    process.stdout.write(`   …${Math.min(i + BATCH, strings.length)}/${strings.length}\r`)
  }
  return result
}

// ── Read + write the per-language files ───────────────────
// src/i18n/locales/<lang>/common.json and one <Page>.json per page directory.
const localeDir = (lang) => path.join(LOCALES_DIR, lang)

/** Every translation of a language, whichever file it is in. */
function readLocale(lang) {
  const dir = localeDir(lang)
  const dict = {}
  if (!fs.existsSync(dir)) return dict
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    Object.assign(dict, JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')))
  }
  return dict
}

/** Spread a language's translations over its files; strings no longer used stay in common. */
function writeLocale(lang, dict, buckets) {
  const files = {}
  for (const key of Object.keys(dict).sort((a, b) => a.localeCompare(b))) {
    const bucket = buckets.get(key) || 'common'
    ;(files[bucket] = files[bucket] || {})[key] = dict[key]
  }
  const dir = localeDir(lang)
  fs.mkdirSync(dir, { recursive: true })
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    if (!files[name.slice(0, -5)]) fs.unlinkSync(path.join(dir, name)) // a page that no longer has strings
  }
  for (const [bucket, entries] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, `${bucket}.json`), `${JSON.stringify(entries, null, 2)}\n`)
  }
}

// ── Main ──────────────────────────────────────────────────
async function loadManifest() {
  // Optional escape hatch for strings passed to t() via variables (e.g. mapped
  // lists like t(item.label)) that the source scan can't see. Export a string[]
  // as default from src/i18n/extraStrings.js.
  const manifest = path.join(SRC, 'i18n', 'extraStrings.js')
  if (!fs.existsSync(manifest)) return []
  try {
    const m = await import(`${pathToFileURL(manifest).href}?t=${Date.now()}`)
    const list = m.default || m.extraStrings || []
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string' && hasLetters(s) && !DO_NOT_TRANSLATE.has(s.trim())) : []
  } catch (err) {
    console.warn(`(could not load extraStrings.js: ${err.message})`)
    return []
  }
}

async function main() {
  const mod = await import(`${pathToFileURL(DICT_FILE).href}?t=${Date.now()}`)
  const SUPPORTED = mod.SUPPORTED_LANGS
  const dict = {}
  for (const lang of SUPPORTED) if (lang !== 'en') dict[lang] = readLocale(lang)

  const manifest = await loadManifest()
  const buckets = collectSourceStrings()
  for (const s of manifest) buckets.set(s, 'common') // src/i18n/extraStrings.js is shared
  const source = [...buckets.keys()]
  console.log(`Found ${source.length} translatable UI strings (${manifest.length} from manifest).`)

  let targets = SUPPORTED.filter((l) => l !== 'en')
  if (ONLY_LANGS.length) targets = targets.filter((l) => ONLY_LANGS.includes(l))

  if (REBUILD) {
    for (const lang of targets) writeLocale(lang, dict[lang] || {}, buckets)
    console.log(`Rewrote the dictionary files of ${targets.length} languages (common + one file per page).`)
    return
  }

  // Report missing counts.
  let totalMissing = 0
  const plan = targets.map((lang) => {
    const have = dict[lang] || {}
    let missing = source.filter((s) => !(s in have))
    if (LIMIT) missing = missing.slice(0, LIMIT)
    totalMissing += missing.length
    return { lang, missing }
  })
  console.log(`Languages: ${targets.length}. Missing strings to translate: ${totalMissing}.`)

  if (DRY_RUN) {
    for (const { lang, missing } of plan) {
      if (missing.length) console.log(`  ${lang}: ${missing.length} missing`)
    }
    console.log('\nDry run — no API calls, nothing written. Set I18N_MT_API_KEY and re-run without --dry-run.')
    return
  }

  const key = apiKey()
  if (!key) {
    console.error('\nMissing I18N_MT_API_KEY (or GOOGLE_TRANSLATE_API_KEY). Example:\n  I18N_MT_PROVIDER=google I18N_MT_API_KEY=xxxx npm run i18n:translate\nOr use --dry-run to preview.')
    process.exit(1)
  }
  const translate = getTranslator()

  for (const { lang, missing } of plan) {
    if (!missing.length) continue
    console.log(`\n${lang}: translating ${missing.length} strings…`)
    try {
      const translated = await translateAll(missing, lang, translate)
      dict[lang] = { ...(dict[lang] || {}), ...translated }
      writeLocale(lang, dict[lang], buckets) // write after each language so progress is never lost
      console.log(`\n   ✓ ${lang} done (${Object.keys(dict[lang]).length} total keys).`)
    } catch (err) {
      console.error(`\n   ✗ ${lang} failed: ${err.message}`)
    }
  }
  console.log('\nDone. Review the diff in src/i18n/locales/ before committing.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

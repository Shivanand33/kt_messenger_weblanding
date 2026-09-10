#!/usr/bin/env node
/**
 * KT Messenger — i18n translation generator.
 *
 * Fills src/i18n/translations.js with machine translations for every string the
 * UI passes to t('…'), across all SUPPORTED_LANGS. It:
 *   1. Scans src/ for t('…') / t("…") calls and collects the unique English
 *      source strings the site actually uses.
 *   2. Loads the current dictionary and, per language, finds the MISSING strings.
 *   3. Translates only those (existing entries + hand edits are preserved), using
 *      a configurable machine-translation provider.
 *   4. Rewrites the marker-delimited `translations` object in translations.js.
 *
 * This changes NO app/runtime/backend code — it only regenerates the dictionary
 * data file. Components keep working with English fallback until it is run.
 *
 * Usage:
 *   npm run i18n:translate -- --dry-run            # report what's missing, no API calls, no writes
 *   npm run i18n:translate                         # translate all missing strings, all languages
 *   npm run i18n:translate -- --lang=hi,es,fr      # only these languages
 *   npm run i18n:translate -- --limit=20           # cap strings per language (smoke test)
 *
 * Configuration (env):
 *   I18N_MT_PROVIDER = google | deepl | libre       (default: google)
 *   I18N_MT_API_KEY  = <your key>                   (required unless --dry-run)
 *   I18N_MT_ENDPOINT = <url>                         (libre/custom only)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'src')
const DICT_FILE = path.join(SRC, 'i18n', 'translations.js')
const START = '// i18n:translations:start'
const END = '// i18n:translations:end'

// ── CLI args ──────────────────────────────────────────────
const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const opt = (name, def = '') => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : def
}
const DRY_RUN = flag('dry-run')
const LIMIT = Number(opt('limit', '0')) || 0
const ONLY_LANGS = opt('lang', '').split(',').map((s) => s.trim()).filter(Boolean)

// ── Brand / proper nouns that must stay in English ────────
const DO_NOT_TRANSLATE = new Set([
  'KT Messenger', 'KT AI', 'KT Plus', 'KT Web', 'KT Business', 'KT Wallet', 'KT Coins',
  'KT Flows', 'KT Business Agent', 'Marketplace', 'iPhone', 'iPad', 'Android', 'Mac',
  'Windows', 'Mac & PC', 'Google Play', 'App Store', 'KT', 'AI', 'Signal Protocol',
])

// ── Language-code mapping per provider ────────────────────
const GOOGLE_CODE = { 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', fil: 'fil', he: 'he' }
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
// Matches t('…') and t("…"); skips template literals (they may interpolate).
function extractStrings(code) {
  const found = new Set()
  const re = /\bt\(\s*(['"])((?:\\.|(?!\1).)*)\1/g
  let m
  while ((m = re.exec(code)) !== null) {
    // Unescape simple escapes so the key matches the runtime string.
    const raw = m[2].replace(/\\(['"\\])/g, '$1')
    if (raw.trim()) found.add(raw)
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
  return found
}

function collectSourceStrings() {
  const files = walk(SRC).filter((f) => path.resolve(f) !== path.resolve(DICT_FILE))
  const all = new Set()
  for (const f of files) {
    const code = fs.readFileSync(f, 'utf8')
    for (const s of extractStrings(code)) all.add(s)
    // Only mine data arrays from components already wired to the i18n hook —
    // in those files the data really does flow through t() when rendered.
    if (code.includes('useLanguage')) {
      for (const s of extractDataStrings(code)) all.add(s)
    }
  }
  // Never translate pure brand strings or non-text tokens.
  return [...all].filter((s) => hasLetters(s) && !DO_NOT_TRANSLATE.has(s.trim()))
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
async function translateBatchGoogle(strings, lang, key) {
  const target = GOOGLE_CODE[lang] || lang
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: strings, source: 'en', target, format: 'text' }),
  })
  if (!res.ok) throw new Error(`Google API ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.data.translations.map((t) => t.translatedText)
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

function getTranslator() {
  const provider = (process.env.I18N_MT_PROVIDER || 'google').toLowerCase()
  const key = process.env.I18N_MT_API_KEY || ''
  const endpoint = process.env.I18N_MT_ENDPOINT || ''
  if (provider === 'google') return (s, l) => translateBatchGoogle(s, l, key)
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
    const protectedList = slice.map((s) => protect(s))
    const translated = await translate(protectedList.map((p) => p.masked), lang)
    translated.forEach((tr, j) => {
      result[slice[j]] = restore(tr, protectedList[j].tokens)
    })
    process.stdout.write(`   …${Math.min(i + BATCH, strings.length)}/${strings.length}\r`)
  }
  return result
}

// ── Serialize + write back ────────────────────────────────
function writeDict(dict, supported) {
  const ordered = {}
  for (const lang of supported) {
    if (lang === 'en' || !dict[lang]) continue
    const sortedKeys = Object.keys(dict[lang]).sort((a, b) => a.localeCompare(b))
    ordered[lang] = {}
    for (const k of sortedKeys) ordered[lang][k] = dict[lang][k]
  }
  const block =
    `${START} — the object below is managed by \`npm run i18n:translate\`.\n` +
    `// It merges in machine translations for any missing strings; existing entries are\n` +
    `// preserved, so hand-edits are safe. See scripts/i18n-translate.mjs.\n` +
    `export const translations = ${JSON.stringify(ordered, null, 2)}\n` +
    `${END}`

  const file = fs.readFileSync(DICT_FILE, 'utf8')
  const s = file.indexOf(START)
  const e = file.indexOf(END)
  if (s === -1 || e === -1) throw new Error(`Markers ${START} / ${END} not found in translations.js`)
  const next = file.slice(0, s) + block + file.slice(e + END.length)
  fs.writeFileSync(DICT_FILE, next)
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
  const dict = JSON.parse(JSON.stringify(mod.translations)) // deep clone, mutable

  const manifest = await loadManifest()
  const source = [...new Set([...collectSourceStrings(), ...manifest])]
  console.log(`Found ${source.length} translatable UI strings (${manifest.length} from manifest).`)

  let targets = SUPPORTED.filter((l) => l !== 'en')
  if (ONLY_LANGS.length) targets = targets.filter((l) => ONLY_LANGS.includes(l))

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

  const key = process.env.I18N_MT_API_KEY
  if (!key) {
    console.error('\nMissing I18N_MT_API_KEY. Example:\n  I18N_MT_PROVIDER=google I18N_MT_API_KEY=xxxx npm run i18n:translate\nOr use --dry-run to preview.')
    process.exit(1)
  }
  const translate = getTranslator()

  for (const { lang, missing } of plan) {
    if (!missing.length) continue
    console.log(`\n${lang}: translating ${missing.length} strings…`)
    try {
      const translated = await translateAll(missing, lang, translate)
      dict[lang] = { ...(dict[lang] || {}), ...translated }
      writeDict(dict, SUPPORTED) // write after each language so progress is never lost
      console.log(`\n   ✓ ${lang} done (${Object.keys(dict[lang]).length} total keys).`)
    } catch (err) {
      console.error(`\n   ✗ ${lang} failed: ${err.message}`)
    }
  }
  console.log('\nDone. Review the diff in src/i18n/translations.js before committing.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

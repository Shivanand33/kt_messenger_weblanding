/**
 * Phase 5 of the CMS migration: import every page's visible text into admin.
 *
 * The website routes all user-facing copy through `t('English source')`. This
 * reads those literals straight out of each page's source files and stores
 * them as an identity map:
 *
 *     { "Never miss a moment.": "Never miss a moment." }
 *
 * keyed as `text.<page>` in website_content. A business user edits the right
 * hand side in admin; the frontend applies it as an override inside `t()`.
 *
 * Why an override map rather than restructured content blocks:
 *   • no component is rewired, so there is zero risk to layout or styling
 *   • coverage is total — hero titles, section headings, card text, CTA
 *     labels, list items, stats, alt text; if it renders, it is here
 *   • the fallback is the existing behaviour: `t()` returns the English key
 *     when nothing overrides it, so an empty/missing block changes nothing
 *
 * Non-destructive: existing blocks are merged, never replaced. A value already
 * edited in admin is preserved; only genuinely new strings are added, and
 * strings that have left the code are kept (reported, not deleted).
 *
 *   node scripts/import-page-text.mjs            # dry run
 *   node scripts/import-page-text.mjs --apply
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const MANIFEST_ONLY = process.argv.includes('--manifest-only')

/**
 * The frontend source tree, when it is reachable.
 *
 * Locally the backend sits beside it (`<repo>/backend` -> `<repo>/src`). The
 * production image is built from `backend/` alone with WORKDIR /app, so `..`
 * resolves to `/` and `/src` is either absent or the *backend's* own source.
 * Both candidates are therefore accepted only when they contain `pages` and
 * `components`, which is what tells the frontend tree from the backend one.
 *
 * Without this check the scan silently finds nothing and the run reports
 * "no text" for all 24 pages while still printing APPLIED — which is exactly
 * what happened the first time this was run in production.
 */
const FRONTEND_SRC = [
  path.resolve(process.cwd(), '..', 'src'),
  path.resolve(process.cwd(), 'src'),
].find((dir) => fs.existsSync(path.join(dir, 'pages')) && fs.existsSync(path.join(dir, 'components'))) || null

// Derived list, committed next to this script so it ships inside the image
// (the Dockerfile's `COPY . .` picks it up) and the import can run in
// production, where the frontend source does not exist. Mirrors the registry
// that scripts/import-site-images.mjs keeps for the same reason.
const MANIFEST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'page-text.manifest.json')

/** page key -> source files whose visible text belongs to that page */
const PAGES = {
  home: ['components/sections', 'pages/Home'],
  features: ['components/sections/Features'],
  messaging: ['pages/Messaging'],
  calling: ['pages/Calling'],
  privacy: ['pages/Privacy'],
  ai: ['pages/KtAI'],
  communities: ['pages/Community', 'pages/Groups'],
  channels: ['pages/Channels'],
  status: ['pages/Status'],
  security: ['pages/Security'],
  plus: ['pages/KtPlus'],
  about: ['pages/About'],
  contact: ['pages/Contact'],
  careers: ['pages/Careers'],
  apps: ['pages/Apps'],
  business: ['pages/Business'],
  help: ['pages/Help'],
  blog: ['pages/Blog'],
  news: ['pages/News'],
  markets: ['pages/Markets'],
  wallet: ['pages/Wallet'],
  marketplace: ['pages/Marketplace'],
  notes: ['pages/Notes'],
  shell: ['components/layout', 'components/common', 'components/feature'],
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.jsx?$/.test(e.name)) out.push(p)
  }
  return out
}

/**
 * Every translated literal in a file.
 *
 * The translator is usually `t`, but a file may alias it —
 * `const { t: tr } = useLanguage()` in BusinessPage.jsx, for example. Missing
 * an alias silently drops that whole page's copy, so the aliases actually used
 * in the file are detected and matched too.
 */
function extractStrings(file) {
  const src = fs.readFileSync(file, 'utf8')
  const found = new Set()

  const names = new Set(['t'])
  for (const m of src.matchAll(/const\s*\{\s*t\s*:\s*(\w+)\s*\}\s*=\s*useLanguage\(\)/g)) names.add(m[1])

  for (const name of names) {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    for (const m of src.matchAll(new RegExp(`\\b${esc}\\(\\s*'((?:[^'\\\\]|\\\\.)*)'\\s*\\)`, 'g'))) {
      found.add(m[1].replace(/\\'/g, "'"))
    }
    for (const m of src.matchAll(new RegExp(`\\b${esc}\\(\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*\\)`, 'g'))) {
      found.add(m[1].replace(/\\"/g, '"'))
    }
  }
  return found
}

/** { page: [string, …] } read from the source tree. */
function scan(src) {
  // Files already claimed by a more specific page, so `shell` does not swallow
  // section copy that belongs to the homepage.
  const claimed = new Set()
  const pageFiles = {}

  for (const [page, dirs] of Object.entries(PAGES)) {
    if (page === 'shell') continue
    const files = dirs.flatMap((d) => walk(path.join(src, d)))
    files.forEach((f) => claimed.add(f))
    pageFiles[page] = files
  }
  pageFiles.shell = PAGES.shell.flatMap((d) => walk(path.join(src, d))).filter((f) => !claimed.has(f))

  const out = {}
  for (const [page, files] of Object.entries(pageFiles)) {
    const strings = new Set()
    for (const f of files) for (const s of extractStrings(f)) strings.add(s)
    out[page] = { files: files.length, strings: [...strings].sort() }
  }
  return out
}

/* ── where the strings come from ──────────────────────────────────────── */

let pageStrings
let source

if (FRONTEND_SRC) {
  pageStrings = scan(FRONTEND_SRC)
  source = FRONTEND_SRC
  // Keep the shipped manifest in step with the code on every local run.
  fs.writeFileSync(MANIFEST, `${JSON.stringify(pageStrings, null, 2)}\n`)
} else if (fs.existsSync(MANIFEST)) {
  pageStrings = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  source = `${path.basename(MANIFEST)} (frontend source not present)`
} else {
  console.error('Cannot determine the string list: no frontend source tree and no manifest.')
  console.error(`Expected the manifest at ${MANIFEST}.`)
  console.error('Run this script once from the backend/ directory of a full checkout, then commit')
  console.error('scripts/page-text.manifest.json so it ships with the image.')
  await prisma.$disconnect()
  process.exit(1)
}

// Never write an empty import: that is what made the first production run look
// successful while leaving admin with nothing and no hint as to why.
const grandTotal = Object.values(pageStrings).reduce((n, p) => n + (p.strings?.length || 0), 0)
if (!grandTotal) {
  console.error(`Refusing to continue: no translated strings were found (source: ${source}).`)
  console.error('A run from the production image needs scripts/page-text.manifest.json to be present.')
  await prisma.$disconnect()
  process.exit(1)
}

if (MANIFEST_ONLY) {
  // Say which of the two things just happened. "Wrote …" on a run that only
  // read the manifest is the kind of line that hides a problem for a week.
  console.log(FRONTEND_SRC ? `Wrote ${path.basename(MANIFEST)}` : `Read ${path.basename(MANIFEST)} (frontend source not present)`)
  console.log(`  ${Object.keys(pageStrings).length} pages, ${grandTotal} strings.`)
  await prisma.$disconnect()
  process.exit(0)
}

const report = []

try {
  let totalStrings = 0
  let totalNew = 0
  let totalKept = 0

  for (const [page, entry] of Object.entries(pageStrings)) {
    const files = entry.files ?? 0
    const strings = new Set(entry.strings || [])
    if (!strings.size) { report.push({ page, files, strings: 0, added: 0, kept: 0, status: 'no text' }); continue }

    const key = `text.${page}`
    const existing = await prisma.websiteContent.findFirst({ where: { key, locale: 'en-US' } })
    const prev = (existing?.data && typeof existing.data === 'object') ? existing.data : {}

    // Merge: keep every value already in admin, add identity entries for new
    // strings, and retain entries whose source string has since changed.
    const merged = { ...prev }
    let added = 0
    for (const s of strings) {
      if (!(s in merged)) { merged[s] = s; added += 1 }
    }
    const kept = Object.keys(prev).filter((k) => !strings.has(k)).length

    totalStrings += strings.size
    totalNew += added
    totalKept += kept

    report.push({
      page,
      files,
      strings: strings.size,
      added,
      kept,
      status: existing ? (added ? 'merged' : 'up to date') : 'created',
    })

    if (APPLY) {
      if (existing) {
        await prisma.websiteContent.update({ where: { id: existing.id }, data: { data: merged } })
      } else {
        await prisma.websiteContent.create({
          data: { key, page: 'text', label: `${page} page text`, data: merged, locale: 'en-US' },
        })
      }
    }
  }

  console.log(APPLY ? '=== PAGE TEXT IMPORT APPLIED ===' : '=== PAGE TEXT DRY RUN (no writes) ===')
  console.log('')
  console.log('  string list source :', source)
  console.log('')
  console.log('  PAGE'.padEnd(16), 'FILES'.padStart(6), 'STRINGS'.padStart(9), 'NEW'.padStart(7), 'KEPT'.padStart(6), '  STATUS')
  for (const r of report.sort((a, b) => b.strings - a.strings)) {
    console.log(
      ('  ' + r.page).padEnd(16),
      String(r.files).padStart(6),
      String(r.strings).padStart(9),
      String(r.added).padStart(7),
      String(r.kept).padStart(6),
      '  ' + r.status,
    )
  }
  console.log('')
  console.log(`  TOTAL: ${totalStrings} strings, ${totalNew} newly imported, ${totalKept} retained from earlier admin edits`)
  console.log(APPLY ? '\nAdmin now holds every visible string. The website is unchanged until the override is wired.' : '\nRe-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

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
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const ROOT = path.resolve(process.cwd(), '..')
const SRC = path.join(ROOT, 'src')

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

const report = []

try {
  // Files already claimed by a more specific page, so `shell` does not swallow
  // section copy that belongs to the homepage.
  const claimed = new Set()
  const pageFiles = {}

  for (const [page, dirs] of Object.entries(PAGES)) {
    if (page === 'shell') continue
    const files = dirs.flatMap((d) => walk(path.join(SRC, d)))
    files.forEach((f) => claimed.add(f))
    pageFiles[page] = files
  }
  pageFiles.shell = PAGES.shell.flatMap((d) => walk(path.join(SRC, d))).filter((f) => !claimed.has(f))

  let totalStrings = 0
  let totalNew = 0
  let totalKept = 0

  for (const [page, files] of Object.entries(pageFiles)) {
    const strings = new Set()
    for (const f of files) for (const s of extractStrings(f)) strings.add(s)
    if (!strings.size) { report.push({ page, files: files.length, strings: 0, added: 0, kept: 0, status: 'no text' }); continue }

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
      files: files.length,
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

/**
 * Import the marketing copy that lives in page DATA FILES into the existing
 * `text.<page>` override blocks — the same website_content rows Phase 5 uses.
 * No new table, no new admin module.
 *
 * These strings are object literals rather than t('…') calls, so the Phase 5
 * scanner never saw them. The pages now route them through translateCopy(…, t)
 * at render time, which means an entry here takes effect immediately.
 *
 * Non-destructive: merges into the existing block, keeps any value already
 * edited in admin, and never removes a key.
 */
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const SRC = path.resolve(process.cwd(), '..', 'src', 'pages')

// Must mirror COPY_FIELDS in src/utils/translateCopy.js.
const COPY_FIELDS = ['title','subtitle','desc','description','summary','text','label','name','quote','role','q','a','action','limit','fee','notes','note','hint','level','event','impact','expires','blurb','caption']

const SOURCES = {
  wallet: { file: 'Wallet/walletData.js', arrays: ['rewards','limitsTable','securityFeatures','walletFeatures','walletSteps','walletTestimonials'] },
  notes: { file: 'Notes/notesData.js', arrays: ['notesTips','notesFeatures','notesSteps','notesTestimonials'] },
  markets: { file: 'Markets/marketsData.js', arrays: ['marketTools','marketSteps','marketLearn','marketTestimonials'] },
  news: { file: 'News/newsData.js', arrays: ['newsSources','digestSchedule','factChecks','newsFeatures','newsSteps','newsTestimonials'] },
  marketplace: { file: 'Marketplace/marketplaceData.js', arrays: ['trackingStages','protectionPoints','marketplaceFeatures','marketplaceSteps','marketplaceReviews'] },
}

const report = []
let grandTotal = 0
let grandNew = 0

try {
  for (const [page, cfg] of Object.entries(SOURCES)) {
    const full = path.join(SRC, cfg.file)
    if (!fs.existsSync(full)) { report.push([page, 0, 0, 'file missing']); continue }
    const mod = await import(pathToFileURL(full).href)

    const strings = new Set()
    for (const name of cfg.arrays) {
      const list = mod[name]
      if (!Array.isArray(list)) continue
      for (const item of list) {
        if (typeof item === 'string') { if (item.trim()) strings.add(item); continue }
        if (!item || typeof item !== 'object') continue
        for (const f of COPY_FIELDS) {
          const v = item[f]
          if (typeof v === 'string' && v.trim()) strings.add(v)
        }
      }
    }
    if (!strings.size) { report.push([page, 0, 0, 'no copy found']); continue }

    const key = `text.${page}`
    const existing = await prisma.websiteContent.findFirst({ where: { key, locale: 'en-US' } })
    const prev = existing?.data && typeof existing.data === 'object' ? existing.data : {}
    const merged = { ...prev }
    let added = 0
    for (const s of strings) if (!(s in merged)) { merged[s] = s; added += 1 }

    grandTotal += strings.size
    grandNew += added
    report.push([page, strings.size, added, existing ? 'merged' : 'created'])

    if (APPLY) {
      if (existing) await prisma.websiteContent.update({ where: { id: existing.id }, data: { data: merged } })
      else await prisma.websiteContent.create({ data: { key, page: 'text', label: `${page} page text`, data: merged, locale: 'en-US' } })
    }
  }

  console.log(APPLY ? '=== DATA-FILE COPY IMPORT APPLIED ===' : '=== DATA-FILE COPY DRY RUN ===')
  console.log('  PAGE'.padEnd(16), 'STRINGS'.padStart(9), 'NEW'.padStart(7), '  STATUS')
  for (const [p, n, a, st] of report) console.log(('  ' + p).padEnd(16), String(n).padStart(9), String(a).padStart(7), '  ' + st)
  console.log(`\n  TOTAL: ${grandTotal} copy strings, ${grandNew} newly added to admin`)
  if (!APPLY) console.log('\n  Re-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

/**
 * Import the FAQs that live in the page DATA FILES (walletData.js,
 * notesData.js, marketsData.js, newsData.js, marketplaceData.js) into the
 * existing `faqs` table — the same table, admin module and public endpoint the
 * other eight FAQ pages already use. No new model, no duplicate system.
 *
 * These differ from the Phase 4 FAQs: they are plain object literals with no
 * t() wrapper, which is why the page-text override layer never reached them.
 *
 * Non-destructive: matches on question text, updates in place, inserts what is
 * missing, deletes nothing.
 */
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const SRC = path.resolve(process.cwd(), '..', 'src', 'pages')

const SOURCES = [
  { page: 'wallet', file: 'Wallet/walletData.js', exportName: 'walletFaqs' },
  { page: 'notes', file: 'Notes/notesData.js', exportName: 'notesFaqs' },
  { page: 'markets', file: 'Markets/marketsData.js', exportName: 'marketFaqs' },
  { page: 'news', file: 'News/newsData.js', exportName: 'newsFaqs' },
  { page: 'marketplace', file: 'Marketplace/marketplaceData.js', exportName: 'marketplaceFaqs' },
]

let created = 0
let updated = 0
const report = []

try {
  for (const s of SOURCES) {
    const full = path.join(SRC, s.file)
    if (!fs.existsSync(full)) { report.push([s.page, 'file missing', 0]); continue }
    const mod = await import(pathToFileURL(full).href)
    const list = mod[s.exportName]
    if (!Array.isArray(list)) { report.push([s.page, `${s.exportName} not found`, 0]); continue }

    for (const [i, f] of list.entries()) {
      const question = f.q || f.question
      const answer = f.a || f.answer
      if (!question || !answer) continue
      const found = await prisma.faq.findFirst({ where: { page: s.page, question } })
      if (!found) {
        created += 1
        if (APPLY) await prisma.faq.create({ data: { page: s.page, question, answer, order: i, status: 'PUBLISHED' } })
      } else {
        updated += 1
        if (APPLY) await prisma.faq.update({ where: { id: found.id }, data: { answer, order: i, status: 'PUBLISHED' } })
      }
    }
    report.push([s.page, s.exportName, list.length])
  }

  console.log(APPLY ? '=== DATA-FILE FAQ IMPORT APPLIED ===' : '=== DATA-FILE FAQ DRY RUN ===')
  for (const [page, src2, n] of report) console.log(`  ${page.padEnd(13)} ${String(src2).padEnd(22)} ${n} FAQs`)
  console.log(`\n  created: ${created}   updated: ${updated}`)
  console.log(`  total faqs in table: ${await prisma.faq.count()}`)
  if (!APPLY) console.log('\n  Re-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

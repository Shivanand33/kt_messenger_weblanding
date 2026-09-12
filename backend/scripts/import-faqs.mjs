/**
 * Phase 4 of the CMS migration: import the FAQs that are currently hardcoded
 * in the website into the admin `faqs` table.
 *
 * The FAQ blocks live as `const faqs = [{ q: t('…'), a: t('…') }]` inside each
 * page component. This reads them straight out of the source, so the admin is
 * seeded with exactly what the site shows today — not a paraphrase.
 *
 * Non-destructive:
 *   • a question already in the table is UPDATED (answer/order kept in sync)
 *   • a question not in the table is CREATED
 *   • a row in the table that the website does NOT show is set to DRAFT, never
 *     deleted. The public endpoint filters on status, so it stops appearing on
 *     the site while the content stays recoverable in admin.
 *
 *   node scripts/import-faqs.mjs            # dry run
 *   node scripts/import-faqs.mjs --apply
 */
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const SRC = path.resolve(process.cwd(), '..', 'src', 'pages')

// Page component -> the `page` value stored on each FAQ row.
const PAGES = {
  Calling: 'calling',
  Messaging: 'messaging',
  Groups: 'groups',
  Channels: 'channels',
  KtAI: 'ai',
  KtPlus: 'plus',
  Security: 'security',
  Status: 'status',
}

/** Pull the `{ q, a }` pairs out of a page's `const faqs = [ … ]` block. */
function extractFaqs(file) {
  const src = fs.readFileSync(file, 'utf8')
  let start = src.indexOf('const faqs = [')
  if (start === -1) start = src.indexOf('const localFaqs = [')
  if (start === -1) return []

  // Walk to the matching closing bracket so nested brackets don't truncate it.
  let depth = 0
  let end = -1
  for (let i = src.indexOf('[', start); i < src.length; i += 1) {
    if (src[i] === '[') depth += 1
    else if (src[i] === ']') {
      depth -= 1
      if (depth === 0) { end = i; break }
    }
  }
  if (end === -1) return []

  const block = src.slice(start, end)
  const out = []
  // q: t('…') followed by a: t('…'). Handles both quote styles.
  const re = /q:\s*t\((['"])((?:(?!\1)[^\\]|\\.)*)\1\)\s*,\s*a:\s*t\((['"])((?:(?!\3)[^\\]|\\.)*)\3\)/g
  for (const m of block.matchAll(re)) {
    out.push({
      question: m[2].replace(/\\'/g, "'").replace(/\\"/g, '"'),
      answer: m[4].replace(/\\'/g, "'").replace(/\\"/g, '"'),
    })
  }
  return out
}

const plan = []
const note = (action, detail) => plan.push({ action, detail })

try {
  for (const [dir, pageKey] of Object.entries(PAGES)) {
    const file = path.join(SRC, dir, `${dir}Page.jsx`)
    if (!fs.existsSync(file)) { note('SKIP', `${dir}Page.jsx not found`); continue }

    const faqs = extractFaqs(file)
    if (!faqs.length) { note('SKIP', `${dir}: no faqs array found`); continue }

    const existing = await prisma.faq.findMany({ where: { page: pageKey } })

    for (const [i, faq] of faqs.entries()) {
      const found = existing.find((e) => e.question === faq.question)
      if (!found) {
        note('CREATE', `${pageKey}: ${faq.question.slice(0, 62)}`)
        if (APPLY) {
          await prisma.faq.create({
            data: { page: pageKey, question: faq.question, answer: faq.answer, order: i, status: 'PUBLISHED' },
          })
        }
      } else if (found.answer !== faq.answer || found.order !== i || found.status !== 'PUBLISHED') {
        note('UPDATE', `${pageKey}: ${faq.question.slice(0, 62)}`)
        if (APPLY) {
          await prisma.faq.update({
            where: { id: found.id },
            data: { answer: faq.answer, order: i, status: 'PUBLISHED' },
          })
        }
      } else {
        note('OK', `${pageKey}: ${faq.question.slice(0, 62)}`)
      }
    }

    // Seed rows the live site does not show: hide, never delete.
    for (const e of existing) {
      if (faqs.some((f) => f.question === e.question)) continue
      if (e.status === 'DRAFT') { note('OK', `${pageKey}: already hidden — ${e.question.slice(0, 50)}`); continue }
      note('HIDE', `${pageKey}: not on the website, set to DRAFT — ${e.question.slice(0, 50)}`)
      if (APPLY) await prisma.faq.update({ where: { id: e.id }, data: { status: 'DRAFT' } })
    }
  }

  const counts = plan.reduce((m, p) => ((m[p.action] = (m[p.action] || 0) + 1), m), {})
  console.log(APPLY ? '=== FAQ IMPORT APPLIED ===' : '=== FAQ DRY RUN (no writes) ===')
  console.log(`  create: ${counts.CREATE || 0}   update: ${counts.UPDATE || 0}   hide: ${counts.HIDE || 0}   already correct: ${counts.OK || 0}   skip: ${counts.SKIP || 0}`)
  console.log('')
  for (const p of plan) {
    if (p.action === 'OK') continue
    console.log(`  ${p.action.padEnd(7)} ${p.detail}`)
  }
  console.log(APPLY ? '\nFAQs are now in admin. Nothing was deleted.' : '\nRe-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

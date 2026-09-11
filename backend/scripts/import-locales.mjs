/**
 * Phase 8: import the website's language list into the locales table.
 *
 * The footer picker currently renders a hardcoded array of 64 languages while
 * the database holds one row, so wiring the picker before this import would
 * collapse the site from 64 languages to 1. Reads the live array out of
 * Footer.jsx so the imported list is exactly what the site offers today.
 *
 * Non-destructive: existing rows are updated, new ones inserted, none deleted.
 */
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const FOOTER = path.resolve(process.cwd(), '..', 'src', 'components', 'layout', 'Footer', 'Footer.jsx')

const src = fs.readFileSync(FOOTER, 'utf8')
const start = src.indexOf('const languages = [')
let depth = 0, end = -1
for (let i = src.indexOf('[', start); i < src.length; i += 1) {
  if (src[i] === '[') depth += 1
  else if (src[i] === ']') { depth -= 1; if (depth === 0) { end = i; break } }
}
const block = src.slice(start, end)
const langs = [...block.matchAll(/code:\s*'([^']+)'\s*,\s*label:\s*'([^']+)'\s*,\s*native:\s*'([^']+)'/g)]
  .map((m) => ({ code: m[1], label: m[2], nativeLabel: m[3] }))

let created = 0, updated = 0
for (const l of langs) {
  const found = await prisma.locale.findUnique({ where: { code: l.code } })
  if (!found) {
    created += 1
    if (APPLY) await prisma.locale.create({ data: { ...l, enabled: true, isDefault: l.code === 'en' } })
  } else if (found.label !== l.label || found.nativeLabel !== l.nativeLabel) {
    updated += 1
    if (APPLY) await prisma.locale.update({ where: { code: l.code }, data: { label: l.label, nativeLabel: l.nativeLabel } })
  }
}
const total = await prisma.locale.count()
console.log(APPLY ? '=== LOCALE IMPORT APPLIED ===' : '=== LOCALE DRY RUN ===')
console.log(`  parsed from Footer.jsx : ${langs.length}`)
console.log(`  created                : ${created}`)
console.log(`  updated                : ${updated}`)
console.log(`  rows in table now      : ${total}`)
await prisma.$disconnect()

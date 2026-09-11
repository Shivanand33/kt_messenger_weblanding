/**
 * Register every bundled website image as an admin-editable override.
 *
 * Stores an identity map in website_content as `images.site`:
 *
 *   { "hero.jpg": "hero.jpg" }        // unchanged — site uses the bundled file
 *   { "hero.jpg": "https://cdn/x" }   // overridden — site uses that URL
 *
 * The key is the original filename (see src/utils/imageKey.js) so it stays
 * stable across builds, where Vite appends a content hash.
 *
 * Blog covers, news and marketplace images are NOT included: those already
 * have their own admin fields on their own records.
 *
 * Non-destructive: merges, keeps existing admin values, deletes nothing.
 */
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const ASSETS = path.resolve(process.cwd(), '..', 'src', 'assets', 'images')
const SRC = path.resolve(process.cwd(), '..', 'src')

// Only assets the code actually imports get registered.
function usedAssets() {
  const used = new Set()
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) { if (!/node_modules|dist/.test(e.name)) walk(p) }
      // imageKey.js documents example *hashed* filenames in its comments;
      // scanning it would register those as though they were real assets.
      else if (/\.jsx?$/.test(e.name) && !/^(imageKey|imageOverrides)\.js$/.test(e.name)) {
        const s = fs.readFileSync(p, 'utf8')
        // Filename pattern only. A loose match also captures prose from doc
        // comments that happen to mention an asset path.
        // Covers src/assets/images/* and assets that sit directly in
        // src/assets (the brand logo, for example).
        for (const m of s.matchAll(/assets\/(?:images\/)?([\w.-]+\.(?:jpe?g|png|webp|svg|gif))/gi)) used.add(m[1])
      }
    }
  }
  walk(SRC)
  return [...used].sort()
}

const files = usedAssets()
const ASSETS_ROOT = path.resolve(process.cwd(), '..', 'src', 'assets')
const onDisk = new Set([
  ...(fs.existsSync(ASSETS) ? fs.readdirSync(ASSETS) : []),
  ...(fs.existsSync(ASSETS_ROOT) ? fs.readdirSync(ASSETS_ROOT) : []),
])

const key = 'images.site'
const existing = await prisma.websiteContent.findFirst({ where: { key, locale: 'en-US' } })
const prev = existing?.data && typeof existing.data === 'object' ? existing.data : {}
const merged = { ...prev }
let added = 0
const missing = []

for (const f of files) {
  if (!onDisk.has(f)) missing.push(f)
  if (!(f in merged)) { merged[f] = f; added += 1 }
}

console.log(APPLY ? '=== SITE IMAGE REGISTRY APPLIED ===' : '=== SITE IMAGE REGISTRY DRY RUN ===')
console.log(`  assets referenced in code : ${files.length}`)
console.log(`  newly registered          : ${added}`)
console.log(`  already in admin          : ${Object.keys(prev).length}`)
if (missing.length) console.log(`  WARNING referenced but not on disk: ${missing.join(', ')}`)
console.log('')
for (const f of files) {
  const v = merged[f]
  console.log(`  ${f.padEnd(30)} ${v === f ? '(bundled, unchanged)' : '-> ' + v}`)
}

if (APPLY) {
  if (existing) await prisma.websiteContent.update({ where: { id: existing.id }, data: { data: merged } })
  else await prisma.websiteContent.create({ // Stored under page 'text' so the website fetches copy and image overrides
    // in one request; the 'images.' key prefix is what separates them.
    data: { key, page: 'text', label: 'Site images', data: merged, locale: 'en-US' } })
  console.log('\nRegistered. The website is unchanged until an image is actually overridden.')
} else {
  console.log('\nRe-run with --apply to write.')
}
await prisma.$disconnect()

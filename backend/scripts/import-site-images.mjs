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
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

/**
 * The frontend source tree, when it is reachable.
 *
 * Locally the backend sits next to it (`<repo>/backend` -> `<repo>/src`). The
 * production image is built from `backend/` alone with WORKDIR /app, so `..`
 * escapes the app root and `/app/src` is the *backend's* own source. Both
 * candidates are therefore accepted only when they actually contain an
 * `assets/` directory, which is what distinguishes the frontend tree from the
 * backend one — otherwise the scan would silently find zero assets.
 */
const FRONTEND_SRC = [
  path.resolve(process.cwd(), '..', 'src'),
  path.resolve(process.cwd(), 'src'),
].find((dir) => fs.existsSync(path.join(dir, 'assets'))) || null

// Derived list, committed next to this script so it ships inside the image
// (the Dockerfile's `COPY . .` picks it up) and the import can run in
// production, where the frontend source does not exist.
const MANIFEST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'site-images.manifest.json')

// Only assets the code actually imports get registered.
function usedAssets(root) {
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
  walk(root)
  return [...used].sort()
}

let files
let source
if (FRONTEND_SRC) {
  files = usedAssets(FRONTEND_SRC)
  source = FRONTEND_SRC
  // Keep the shipped manifest in step with the code on every local run.
  fs.writeFileSync(MANIFEST, `${JSON.stringify(files, null, 2)}\n`)
} else if (fs.existsSync(MANIFEST)) {
  files = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  source = `${path.basename(MANIFEST)} (frontend source not present)`
} else {
  console.error('Cannot determine the asset list: no frontend source tree and no manifest.')
  console.error(`Expected the manifest at ${MANIFEST}.`)
  console.error('Run this script once from the backend/ directory of a full checkout, then commit')
  console.error('scripts/site-images.manifest.json so it ships with the image.')
  await prisma.$disconnect()
  process.exit(1)
}

// Never write an empty registry: that would look like a successful import while
// leaving admin with nothing to manage and no way to tell why.
if (!Array.isArray(files) || files.length === 0) {
  console.error(`Refusing to continue: the asset list is empty (source: ${source}).`)
  await prisma.$disconnect()
  process.exit(1)
}

const ASSETS = FRONTEND_SRC ? path.join(FRONTEND_SRC, 'assets', 'images') : null
const ASSETS_ROOT = FRONTEND_SRC ? path.join(FRONTEND_SRC, 'assets') : null
// Only meaningful when the asset files themselves are reachable.
const canCheckDisk = !!(ASSETS && (fs.existsSync(ASSETS) || fs.existsSync(ASSETS_ROOT)))
const onDisk = new Set(canCheckDisk ? [
  ...(fs.existsSync(ASSETS) ? fs.readdirSync(ASSETS) : []),
  ...(fs.existsSync(ASSETS_ROOT) ? fs.readdirSync(ASSETS_ROOT) : []),
] : [])

const key = 'images.site'
const existing = await prisma.websiteContent.findFirst({ where: { key, locale: 'en-US' } })
const prev = existing?.data && typeof existing.data === 'object' ? existing.data : {}
const merged = { ...prev }
let added = 0
const missing = []

for (const f of files) {
  if (canCheckDisk && !onDisk.has(f)) missing.push(f)
  if (!(f in merged)) { merged[f] = f; added += 1 }
}

console.log(APPLY ? '=== SITE IMAGE REGISTRY APPLIED ===' : '=== SITE IMAGE REGISTRY DRY RUN ===')
console.log(`  asset list source         : ${source}`)
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

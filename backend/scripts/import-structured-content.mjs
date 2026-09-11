/**
 * Phase 8: move the remaining hardcoded business content out of the website's
 * data files and into structured database entities.
 *
 * Sources (read live, never retyped):
 *   src/pages/News/newsData.js               -> news_articles
 *   src/pages/Marketplace/marketplaceData.js -> marketplace_products
 *   src/pages/Business/businessProducts.js   -> business_products
 *
 * Every hardcoded image URL encountered is also registered as a Media row so
 * it becomes manageable from the admin Media library. The URL itself is
 * preserved exactly — nothing is re-uploaded, re-hosted or rewritten.
 *
 * Non-destructive and idempotent: records are matched on slug, existing rows
 * are updated, new ones inserted, and nothing is ever deleted.
 *
 *   node scripts/import-structured-content.mjs            # dry run
 *   node scripts/import-structured-content.mjs --apply
 */
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const SRC = path.resolve(process.cwd(), '..', 'src')

/** The data files are plain ES modules, so import them rather than parse them. */
async function load(rel) {
  const file = path.join(SRC, rel)
  if (!fs.existsSync(file)) return null
  return import(pathToFileURL(file).href)
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const plan = []
const note = (action, what, detail = '') => plan.push({ action, what, detail })
const mediaUrls = new Set()
const collectImage = (url) => {
  if (url && /^https?:\/\//i.test(url)) mediaUrls.add(url)
  return url
}

/* ── News ──────────────────────────────────────────────────────────────── */
async function importNews() {
  const mod = await load('pages/News/newsData.js')
  if (!mod?.newsArticles) { note('SKIP', 'news', 'newsArticles not found'); return }

  for (const [i, a] of mod.newsArticles.entries()) {
    const slug = slugify(a.title)
    if (!slug) continue
    const data = {
      slug,
      category: a.category || 'News',
      title: a.title,
      summary: a.summary || '',
      body: Array.isArray(a.body) ? a.body : a.body ? [a.body] : [],
      author: a.author || null,
      source: a.source || null,
      readMins: Number(a.readMins) || 1,
      reads: a.reads != null ? String(a.reads) : null,
      tags: Array.isArray(a.tags) ? a.tags.map(String) : [],
      imageUrl: collectImage(a.image) || null,
      hot: Boolean(a.hot),
      order: i,
      status: 'PUBLISHED',
    }
    const found = await prisma.newsArticle.findUnique({ where: { slug } })
    if (!found) {
      note('CREATE', `news: ${a.title.slice(0, 58)}`)
      if (APPLY) await prisma.newsArticle.create({ data })
    } else {
      note('UPDATE', `news: ${a.title.slice(0, 58)}`)
      if (APPLY) await prisma.newsArticle.update({ where: { id: found.id }, data })
    }
  }
}

/* ── Marketplace ───────────────────────────────────────────────────────── */
async function importMarketplace() {
  const mod = await load('pages/Marketplace/marketplaceData.js')
  if (!mod?.products) { note('SKIP', 'marketplace', 'products not found'); return }

  for (const [i, p] of mod.products.entries()) {
    const slug = slugify(p.name)
    if (!slug) continue
    const data = {
      slug,
      name: p.name,
      seller: p.seller || null,
      price: Number(p.price) || 0,
      mrp: p.mrp != null ? Number(p.mrp) : null,
      rating: p.rating != null ? Number(p.rating) : null,
      reviews: Number(p.reviews) || 0,
      category: p.category || null,
      tag: p.tag || null,
      delivery: p.delivery || null,
      stock: p.stock != null ? Number(p.stock) : null,
      imageUrl: collectImage(p.image) || null,
      description: p.desc || '',
      features: Array.isArray(p.features) ? p.features : [],
      order: i,
      status: 'PUBLISHED',
    }
    const found = await prisma.marketplaceProduct.findUnique({ where: { slug } })
    if (!found) {
      note('CREATE', `product: ${p.name.slice(0, 58)}`)
      if (APPLY) await prisma.marketplaceProduct.create({ data })
    } else {
      note('UPDATE', `product: ${p.name.slice(0, 58)}`)
      if (APPLY) await prisma.marketplaceProduct.update({ where: { id: found.id }, data })
    }
  }
}

/* ── Business sub-pages ────────────────────────────────────────────────── */
async function importBusiness() {
  const mod = await load('pages/Business/businessProducts.js')
  const src = mod?.businessProducts
  if (!src) { note('SKIP', 'business', 'businessProducts not found'); return }

  // The export is keyed by slug, so entries() gives slug -> page content.
  const entries = Array.isArray(src) ? src.map((v, i) => [v.slug || slugify(v.title), v, i]) : Object.entries(src).map(([k, v], i) => [k, v, i])

  for (const [slug, page, i] of entries) {
    if (!slug || !page) continue
    // Everything that is not an identity field stays in `content`, so no part
    // of the page is dropped regardless of which sections it happens to use.
    const { eyebrow, title, subtitle, image, ...rest } = page
    JSON.stringify(rest, (k, v) => (k === 'image' || k === 'imageUrl' ? collectImage(v) : v))
    const data = {
      slug,
      eyebrow: eyebrow || null,
      title: title || slug,
      subtitle: subtitle || '',
      imageUrl: collectImage(image) || null,
      content: rest,
      order: i,
      status: 'PUBLISHED',
    }
    const found = await prisma.businessProduct.findUnique({ where: { slug } })
    if (!found) {
      note('CREATE', `business: ${slug}`)
      if (APPLY) await prisma.businessProduct.create({ data })
    } else {
      note('UPDATE', `business: ${slug}`)
      if (APPLY) await prisma.businessProduct.update({ where: { id: found.id }, data })
    }
  }
}

/* ── Media registry for the hardcoded image URLs ───────────────────────── */
async function registerMedia() {
  let created = 0
  let existing = 0
  for (const url of mediaUrls) {
    const found = await prisma.media.findFirst({ where: { url } })
    if (found) { existing += 1; continue }
    created += 1
    if (APPLY) {
      const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] || 'image')
      await prisma.media.create({
        data: {
          filename: name,
          originalName: name,
          url,
          // These are referenced by URL, not uploaded through the media API, so
          // the real type and byte size are unknown. `size: 0` marks them as
          // external references rather than stored files; the URL is what the
          // site uses and it is preserved exactly.
          mimeType: 'image/jpeg',
          size: 0,
          folder: 'imported',
          alt: null,
        },
      })
    }
  }
  note('MEDIA', `${mediaUrls.size} image URLs referenced`, `${created} new media rows, ${existing} already registered`)
}

try {
  await importNews()
  await importMarketplace()
  await importBusiness()
  await registerMedia()

  const counts = plan.reduce((m, p) => ((m[p.action] = (m[p.action] || 0) + 1), m), {})
  console.log(APPLY ? '=== STRUCTURED IMPORT APPLIED ===' : '=== STRUCTURED IMPORT DRY RUN ===')
  console.log(`  create: ${counts.CREATE || 0}   update: ${counts.UPDATE || 0}   skip: ${counts.SKIP || 0}`)
  console.log('')
  for (const p of plan) {
    if (p.action === 'CREATE' || p.action === 'UPDATE') continue
    console.log(`  ${p.action.padEnd(7)} ${p.what}  ${p.detail}`)
  }
  console.log('')
  const byType = { news: 0, product: 0, business: 0 }
  for (const p of plan) {
    if (p.what.startsWith('news:')) byType.news += 1
    else if (p.what.startsWith('product:')) byType.product += 1
    else if (p.what.startsWith('business:')) byType.business += 1
  }
  console.log(`  news articles: ${byType.news}   marketplace products: ${byType.product}   business pages: ${byType.business}`)
  console.log(APPLY ? '\nImported. The website still renders from its data files until wiring.' : '\nRe-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

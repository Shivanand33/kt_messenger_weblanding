/**
 * Import the live Help Center structure into admin.
 *
 * WHAT THIS DOES AND DOES NOT IMPORT
 * ----------------------------------
 * The live Help Center renders a hardcoded tree of categories -> subcategories
 * -> article TITLES. Of its 89 articles only two have hand-written bodies, and
 * both are JSX components with conditional logic (the download article changes
 * its text per platform tab). The other 87 share one generated paragraph
 * derived from the title:
 *
 *     "This article explains <title> on KT Messenger. Follow the steps below…"
 *
 * So there is real content to import (the tree and the 89 titles) but almost no
 * real body content. Bodies are therefore left in code and NOT imported —
 * writing the generated sentence into 87 rows would fabricate content that
 * merely looks authored.
 *
 * Non-destructive: matches on slug, updates in place, inserts what is missing.
 * Database articles that the live site does not list are set to DRAFT so they
 * stop competing with the live tree, and are never deleted.
 *
 *   node scripts/import-help-center.mjs            # dry run
 *   node scripts/import-help-center.mjs --apply
 */
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const HELP = path.resolve(process.cwd(), '..', 'src', 'pages', 'Help', 'HelpPage.jsx')

const slugify = (s) =>
  String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)

/** Parse the `helpTree` literal: categories -> subcategories -> article titles. */
function parseTree(src) {
  const start = src.indexOf('const helpTree = [')
  let depth = 0
  let end = -1
  for (let i = src.indexOf('[', start); i < src.length; i += 1) {
    if (src[i] === '[') depth += 1
    else if (src[i] === ']') { depth -= 1; if (depth === 0) { end = i + 1; break } }
  }
  const block = src.slice(start, end)

  // Both levels use `label:`, so a lazy regex happily matches a subcategory's
  // label against the NEXT category's `subs:` and mis-nests the whole tree.
  // Walk the brackets instead and slice each top-level object exactly.
  const topObjects = []
  let d = 0
  let objStart = -1
  // Start just past the array's own opening bracket so depth 0 means
  // "directly inside helpTree".
  for (let i = block.indexOf('[') + 1; i < block.length; i += 1) {
    const c = block[i]
    if (c === '{' || c === '[') {
      if (c === '{' && d === 0) objStart = i
      d += 1
    } else if (c === '}' || c === ']') {
      d -= 1
      if (c === '}' && d === 0 && objStart !== -1) {
        topObjects.push(block.slice(objStart, i + 1))
        objStart = -1
      }
      if (d < 0) break
    }
  }

  const cats = []
  for (const obj of topObjects) {
    const catLabel = obj.match(/^\s*\{\s*label:\s*'([^']+)'/)
    if (!catLabel) continue
    const subs = []
    // Subcategories are the only members carrying an `articles:` array.
    for (const sm of obj.matchAll(/label:\s*'([^']+)'[^{}]*?articles:\s*\[([^\]]*)\]/g)) {
      const titles = [...sm[2].matchAll(/'([^']+)'|"([^"]+)"/g)].map((t) => t[1] || t[2])
      if (titles.length) subs.push({ title: sm[1], articles: titles })
    }
    if (subs.length) cats.push({ title: catLabel[1], subs })
  }
  return cats
}

const src = fs.readFileSync(HELP, 'utf8')
const tree = parseTree(src)

const stats = { cats: 0, subs: 0, articles: 0, created: 0, updated: 0, archived: 0 }
const liveSlugs = new Set()

try {
  for (const [ci, cat] of tree.entries()) {
    const catSlug = slugify(cat.title)
    let category = await prisma.helpCategory.findUnique({ where: { slug: catSlug } })
    if (!category) {
      stats.created += 1
      if (APPLY) category = await prisma.helpCategory.create({ data: { slug: catSlug, title: cat.title, order: ci } })
    } else if (APPLY) {
      await prisma.helpCategory.update({ where: { id: category.id }, data: { title: cat.title, order: ci } })
    }
    stats.cats += 1
    if (!category) continue // dry run, nothing to attach to

    for (const [si, sub] of cat.subs.entries()) {
      const subSlug = slugify(sub.title)
      let subcategory = await prisma.helpSubcategory.findFirst({ where: { categoryId: category.id, slug: subSlug } })
      if (!subcategory) {
        stats.created += 1
        if (APPLY) {
          subcategory = await prisma.helpSubcategory.create({
            data: { categoryId: category.id, slug: subSlug, title: sub.title, order: si },
          })
        }
      } else if (APPLY) {
        await prisma.helpSubcategory.update({ where: { id: subcategory.id }, data: { title: sub.title, order: si } })
      }
      stats.subs += 1
      if (!subcategory) continue

      for (const [ai, title] of sub.articles.entries()) {
        const slug = slugify(title)
        liveSlugs.add(slug)
        stats.articles += 1
        const found = await prisma.helpArticle.findUnique({ where: { slug } })
        if (!found) {
          stats.created += 1
          if (APPLY) {
            await prisma.helpArticle.create({
              // body intentionally left empty: the website generates it. An
              // empty body keeps that behaviour and leaves the field free for
              // an editor to author real content later.
              data: { subcategoryId: subcategory.id, slug, title, body: '', order: ai, status: 'PUBLISHED' },
            })
          }
        } else {
          stats.updated += 1
          if (APPLY) {
            await prisma.helpArticle.update({
              where: { id: found.id },
              data: { subcategoryId: subcategory.id, title, order: ai, status: 'PUBLISHED' },
            })
          }
        }
      }
    }
  }

  // Articles in the database that the live site does not list.
  const all = await prisma.helpArticle.findMany({ select: { id: true, slug: true, title: true, status: true } })
  for (const a of all) {
    if (liveSlugs.has(a.slug) || a.status === 'DRAFT') continue
    stats.archived += 1
    console.log(`  ARCHIVE  not on live site -> DRAFT: ${a.title}`)
    if (APPLY) await prisma.helpArticle.update({ where: { id: a.id }, data: { status: 'DRAFT' } })
  }

  console.log(APPLY ? '\n=== HELP CENTER IMPORT APPLIED ===' : '\n=== HELP CENTER DRY RUN ===')
  console.log(`  categories: ${stats.cats}   subcategories: ${stats.subs}   article titles: ${stats.articles}`)
  console.log(`  created: ${stats.created}   updated: ${stats.updated}   archived: ${stats.archived}`)
  console.log('\n  NOTE: article bodies are NOT imported — the website generates 87 of')
  console.log('        89 of them from the title, and the two real ones are JSX with')
  console.log('        per-platform logic. Bodies stay in code; titles/tree are now admin-managed.')
  if (!APPLY) console.log('\n  Re-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

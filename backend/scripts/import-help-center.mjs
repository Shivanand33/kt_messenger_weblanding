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
 * ADDITIVE ONLY
 * -------------
 * This script inserts what is missing and touches nothing that already exists.
 * Once a category, subcategory or article is in the database it belongs to
 * whoever edits it in admin: their title, icon, ordering, body and publication
 * status are left exactly as found, even where they disagree with the tree in
 * code. Nothing is ever deleted.
 *
 * Articles in the database that the live tree does not list are left alone and
 * merely listed in the report. Setting them to DRAFT would take an admin's own
 * article off the site for no reason other than that this file never heard of
 * it, so it happens only when asked for with --archive-missing.
 *
 * A category is matched by slug first. A slug that does not match falls back
 * to an exact title match, but only when exactly one category carries that
 * title — "calls" and "voice-and-video-calls" are the same category under two
 * slugs, while two genuinely different rows sharing a name is a situation to
 * report rather than guess at.
 *
 *   node scripts/import-help-center.mjs                      # dry run, writes nothing
 *   node scripts/import-help-center.mjs --apply              # insert what is missing
 *   node scripts/import-help-center.mjs --apply --archive-missing
 */
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
/** Off by default: taking someone's article off the site is not an import's job. */
const ARCHIVE_MISSING = process.argv.includes('--archive-missing')
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

const stats = { cats: 0, subs: 0, articles: 0, created: 0, kept: 0, archived: 0, ambiguous: 0 }
const liveSlugs = new Set()
const plan = { categories: [], subcategories: [], articles: [] }

/**
 * The category this tree entry refers to, or null when it has to be created.
 *
 * Slug first. A slug miss falls back to the title, but only when exactly one
 * row carries it — two rows with the same name is a conflict to report, not
 * one to resolve by picking whichever the database returns first.
 */
async function findCategory(title, slug) {
  const bySlug = await prisma.helpCategory.findUnique({ where: { slug } })
  if (bySlug) return bySlug

  const byTitle = await prisma.helpCategory.findMany({ where: { title } })
  if (byTitle.length === 1) return byTitle[0]
  if (byTitle.length > 1) {
    stats.ambiguous += 1
    console.log(
      `  AMBIGUOUS  ${byTitle.length} categories are titled "${title}" ` +
        `(${byTitle.map((c) => c.slug).join(', ')}) — skipped, merge them first.`,
    )
    return 'ambiguous'
  }
  return null
}

/**
 * The subcategory inside this category, or null when it has to be created.
 *
 * Same rule as categories, and needed for the same reason: rows predating this
 * script carry slugs it would never derive — "blocking" for "Blocking
 * Contacts", "download-installation" for "Download and Installation". Matching
 * on slug alone would quietly add a second copy of each.
 */
async function findSubcategory(categoryId, title, slug) {
  const bySlug = await prisma.helpSubcategory.findFirst({ where: { categoryId, slug } })
  if (bySlug) return bySlug

  const byTitle = await prisma.helpSubcategory.findMany({ where: { categoryId, title } })
  if (byTitle.length === 1) return byTitle[0]
  if (byTitle.length > 1) {
    stats.ambiguous += 1
    console.log(
      `  AMBIGUOUS  ${byTitle.length} subcategories are titled "${title}" ` +
        `(${byTitle.map((s) => s.slug).join(', ')}) — skipped, merge them first.`,
    )
    return 'ambiguous'
  }
  return null
}

try {
  for (const [ci, cat] of tree.entries()) {
    const catSlug = slugify(cat.title)
    let category = await findCategory(cat.title, catSlug)
    if (category === 'ambiguous') continue

    if (!category) {
      stats.created += 1
      plan.categories.push(cat.title)
      if (APPLY) category = await prisma.helpCategory.create({ data: { slug: catSlug, title: cat.title, order: ci } })
    } else {
      // Exists already, so it is the admin's. Title, icon and order stay as
      // they are; only the children below are topped up.
      stats.kept += 1
    }
    stats.cats += 1
    if (!category) continue // dry run, nothing to attach to

    for (const [si, sub] of cat.subs.entries()) {
      const subSlug = slugify(sub.title)
      let subcategory = await findSubcategory(category.id, sub.title, subSlug)
      if (subcategory === 'ambiguous') continue
      if (!subcategory) {
        stats.created += 1
        plan.subcategories.push(`${cat.title} / ${sub.title}`)
        if (APPLY) {
          subcategory = await prisma.helpSubcategory.create({
            data: { categoryId: category.id, slug: subSlug, title: sub.title, order: si },
          })
        }
      } else {
        stats.kept += 1
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
          plan.articles.push(`${sub.title} / ${title}`)
          if (APPLY) {
            await prisma.helpArticle.create({
              // body intentionally left empty: the website generates it. An
              // empty body keeps that behaviour and leaves the field free for
              // an editor to author real content later.
              data: { subcategoryId: subcategory.id, slug, title, body: '', order: ai, status: 'PUBLISHED' },
            })
          }
        } else {
          // Left exactly as found. Re-pointing it at this subcategory, or
          // forcing it back to PUBLISHED, would silently undo a deliberate
          // move or an article someone took down on purpose.
          stats.kept += 1
        }
      }
    }
  }

  // Published articles the tree in code does not list. They are somebody's
  // work — written in admin, or left over from an older tree — so they are
  // reported and left published unless --archive-missing says otherwise.
  const all = await prisma.helpArticle.findMany({ select: { id: true, slug: true, title: true, status: true } })
  const strays = all.filter((a) => !liveSlugs.has(a.slug) && a.status !== 'DRAFT')
  for (const a of strays) {
    if (ARCHIVE_MISSING) {
      stats.archived += 1
      console.log(`  ARCHIVE  -> DRAFT: ${a.title}`)
      if (APPLY) await prisma.helpArticle.update({ where: { id: a.id }, data: { status: 'DRAFT' } })
    } else {
      console.log(`  LEFT AS IS  published but not in the code tree: ${a.title}`)
    }
  }

  console.log(APPLY ? '\n=== HELP CENTER IMPORT APPLIED ===' : '\n=== HELP CENTER DRY RUN (nothing written) ===')
  console.log(`  in the code tree: ${stats.cats} categories, ${stats.subs} subcategories, ${stats.articles} article titles`)
  console.log(`  to create: ${stats.created}   already there, untouched: ${stats.kept}`)

  if (plan.categories.length) console.log(`\n  new categories (${plan.categories.length}):`)
  plan.categories.forEach((t) => console.log(`    + ${t}`))
  if (plan.subcategories.length) console.log(`\n  new subcategories (${plan.subcategories.length}):`)
  plan.subcategories.forEach((t) => console.log(`    + ${t}`))
  if (plan.articles.length) console.log(`\n  new articles (${plan.articles.length}):`)
  plan.articles.slice(0, 20).forEach((t) => console.log(`    + ${t}`))
  if (plan.articles.length > 20) console.log(`    … and ${plan.articles.length - 20} more`)

  console.log('\n  DATA LOSS CHECK')
  console.log('    nothing is deleted, and existing titles, icons, ordering,')
  console.log('    bodies and publication status are not modified.')
  console.log(
    strays.length
      ? `    ${strays.length} published article(s) are not in the code tree — ` +
          (ARCHIVE_MISSING ? `${stats.archived} set to DRAFT (you asked for it).` : 'left published.')
      : '    every published article is in the code tree.',
  )
  if (stats.ambiguous) console.log(`    ${stats.ambiguous} category title(s) were ambiguous and skipped — see above.`)
  console.log('\n  NOTE: article bodies are NOT imported — the website generates 87 of')
  console.log('        89 of them from the title, and the two real ones are JSX with')
  console.log('        per-platform logic. Bodies stay in code; titles/tree are now admin-managed.')
  if (!APPLY) console.log('\n  Re-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

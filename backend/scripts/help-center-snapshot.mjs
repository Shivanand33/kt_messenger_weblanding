/**
 * Copy a Help Center between databases, additively.
 *
 * The other importer builds the tree from the code in HelpPage.jsx. This one
 * copies whatever a database actually holds — so anything written in admin
 * that the code tree never knew about comes across too. Use it to bring a
 * production Help Center up to match a local one.
 *
 * ADDITIVE ONLY, in both directions of use:
 *   - rows that already exist are left exactly as they are: title, icon,
 *     ordering, body, platforms, popularity, status, SEO fields, all of it
 *   - nothing is ever deleted, re-parented, renamed or re-published
 *   - a row is matched by slug; a slug miss falls back to an exact title
 *     match, and only when exactly one row carries that title
 *
 * So running the import twice is a no-op, and running it against a database
 * whose editors have reworded things does not undo their work.
 *
 *   node scripts/help-center-snapshot.mjs --export
 *   node scripts/help-center-snapshot.mjs --export --out help.json
 *
 *   node scripts/help-center-snapshot.mjs --import                  # dry run
 *   node scripts/help-center-snapshot.mjs --import --apply
 *
 * The database is whatever DATABASE_URL points at, so an export from one and
 * an import into another is just two commands with different values:
 *
 *   DATABASE_URL="<local>"      node scripts/help-center-snapshot.mjs --export
 *   DATABASE_URL="<production>" node scripts/help-center-snapshot.mjs --import
 */
import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const argv = process.argv.slice(2)
const has = (flag) => argv.includes(flag)
const valueOf = (flag, fallback) => {
  const i = argv.indexOf(flag)
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
}

const MODE = has('--export') ? 'export' : has('--import') ? 'import' : null
const APPLY = has('--apply')
const FILE = path.resolve(valueOf('--out', valueOf('--in', 'help-center-snapshot.json')))

if (!MODE) {
  console.error('Pass --export or --import. See the comment at the top of this file.')
  process.exit(1)
}

/* ── export ───────────────────────────────────────────────────────────── */

async function exportTree() {
  const cats = await prisma.helpCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      subcategories: {
        orderBy: { order: 'asc' },
        include: { articles: { orderBy: { order: 'asc' } } },
      },
    },
  })

  const snapshot = {
    // Stamped so an import can say what it is about to copy, and from when.
    exportedAt: new Date().toISOString(),
    categories: cats.map((c) => ({
      slug: c.slug,
      title: c.title,
      icon: c.icon,
      order: c.order,
      locale: c.locale,
      subcategories: c.subcategories.map((s) => ({
        slug: s.slug,
        title: s.title,
        icon: s.icon,
        order: s.order,
        articles: s.articles.map((a) => ({
          slug: a.slug,
          title: a.title,
          body: a.body,
          platforms: a.platforms,
          popular: a.popular,
          status: a.status,
          order: a.order,
          locale: a.locale,
          seoTitle: a.seoTitle,
          seoDescription: a.seoDescription,
        })),
      })),
    })),
  }

  const subs = snapshot.categories.reduce((n, c) => n + c.subcategories.length, 0)
  const arts = snapshot.categories.reduce(
    (n, c) => n + c.subcategories.reduce((m, s) => m + s.articles.length, 0),
    0,
  )

  fs.writeFileSync(FILE, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`Exported ${snapshot.categories.length} categories, ${subs} subcategories, ${arts} articles`)
  console.log(`  → ${FILE}`)
}

/* ── import ───────────────────────────────────────────────────────────── */

const stats = { created: 0, kept: 0, ambiguous: 0 }
const plan = { categories: [], subcategories: [], articles: [] }

/**
 * An existing row to reuse, null to create one, or 'ambiguous' to skip.
 *
 * Slug first, because it is the stable identifier. A slug miss falls back to
 * the title, since the same category can live under different slugs in two
 * databases — "calls" here, "voice-and-video-calls" there. Two rows sharing a
 * title is reported rather than guessed at.
 */
function matcher(findBySlug, findByTitle, kind) {
  return async (title, slug) => {
    const bySlug = await findBySlug(slug)
    if (bySlug) return bySlug

    const byTitle = await findByTitle(title)
    if (byTitle.length === 1) return byTitle[0]
    if (byTitle.length > 1) {
      stats.ambiguous += 1
      console.log(
        `  AMBIGUOUS  ${byTitle.length} ${kind} titled "${title}" ` +
          `(${byTitle.map((r) => r.slug).join(', ')}) — skipped, merge them first.`,
      )
      return 'ambiguous'
    }
    return null
  }
}

const findCategory = matcher(
  (slug) => prisma.helpCategory.findUnique({ where: { slug } }),
  (title) => prisma.helpCategory.findMany({ where: { title } }),
  'categories',
)

async function importTree() {
  if (!fs.existsSync(FILE)) {
    console.error(`No snapshot at ${FILE}. Run --export first, or pass --in <file>.`)
    process.exitCode = 1
    return
  }

  const snapshot = JSON.parse(fs.readFileSync(FILE, 'utf8'))
  console.log(`Snapshot from ${snapshot.exportedAt}: ${snapshot.categories.length} categories\n`)

  for (const cat of snapshot.categories) {
    let category = await findCategory(cat.title, cat.slug)
    if (category === 'ambiguous') continue

    if (!category) {
      stats.created += 1
      plan.categories.push(cat.title)
      if (APPLY) {
        category = await prisma.helpCategory.create({
          data: { slug: cat.slug, title: cat.title, icon: cat.icon, order: cat.order, locale: cat.locale },
        })
      }
    } else {
      stats.kept += 1
    }

    for (const sub of cat.subcategories) {
      // A dry run has no id for a category it only planned to create, and
      // everything under such a category is new by definition. Counting it
      // here keeps the dry run's totals honest — otherwise a run that adds
      // six categories would report six creations and hide the hundred rows
      // underneath them.
      const findSub = category
        ? matcher(
            (slug) => prisma.helpSubcategory.findFirst({ where: { categoryId: category.id, slug } }),
            (title) => prisma.helpSubcategory.findMany({ where: { categoryId: category.id, title } }),
            'subcategories',
          )
        : async () => null
      let subcategory = await findSub(sub.title, sub.slug)
      if (subcategory === 'ambiguous') continue

      if (!subcategory) {
        stats.created += 1
        plan.subcategories.push(`${cat.title} / ${sub.title}`)
        if (APPLY) {
          subcategory = await prisma.helpSubcategory.create({
            data: { categoryId: category.id, slug: sub.slug, title: sub.title, icon: sub.icon, order: sub.order },
          })
        }
      } else {
        stats.kept += 1
      }

      for (const art of sub.articles) {
        // Article slugs are unique across the whole table, so the slug alone
        // settles it — and an article that lives under a different
        // subcategory here was moved on purpose and is left where it is.
        const existing = await prisma.helpArticle.findUnique({ where: { slug: art.slug } })
        if (existing) {
          stats.kept += 1
          continue
        }
        stats.created += 1
        plan.articles.push(`${sub.title} / ${art.title}`)
        if (APPLY) {
          await prisma.helpArticle.create({
            data: {
              subcategoryId: subcategory.id,
              slug: art.slug,
              title: art.title,
              body: art.body,
              platforms: art.platforms,
              popular: art.popular,
              status: art.status,
              order: art.order,
              locale: art.locale,
              seoTitle: art.seoTitle,
              seoDescription: art.seoDescription,
            },
          })
        }
      }
    }
  }

  console.log(APPLY ? '=== SNAPSHOT IMPORT APPLIED ===' : '=== SNAPSHOT IMPORT DRY RUN (nothing written) ===')
  console.log(`  to create: ${stats.created}   already there, untouched: ${stats.kept}`)

  const show = (label, rows) => {
    if (!rows.length) return
    console.log(`\n  new ${label} (${rows.length}):`)
    rows.slice(0, 25).forEach((r) => console.log(`    + ${r}`))
    if (rows.length > 25) console.log(`    … and ${rows.length - 25} more`)
  }
  show('categories', plan.categories)
  show('subcategories', plan.subcategories)
  show('articles', plan.articles)

  console.log('\n  DATA LOSS CHECK')
  console.log('    nothing is deleted, re-parented, renamed or re-published;')
  console.log('    existing rows keep their title, icon, order, body and status.')
  if (stats.ambiguous) console.log(`    ${stats.ambiguous} title(s) were ambiguous and skipped — see above.`)

  if (!APPLY) console.log('\n  Re-run with --apply to write.')
}

try {
  if (MODE === 'export') await exportTree()
  else await importTree()
} finally {
  await prisma.$disconnect()
}

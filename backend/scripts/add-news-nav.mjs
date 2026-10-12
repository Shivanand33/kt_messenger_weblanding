/**
 * Puts "News" into the Features menu, between KT Plus and Notes.
 *
 * WHY THIS IS NEEDED
 * The header builds its Features menu from the navigation rows an admin
 * manages, and falls back to the list hardcoded in the website's Navbar only
 * when that table has no rows for the menu. So restoring News in the code is
 * enough for an environment whose features_menu is empty, and does nothing at
 * all for one where an admin has defined the menu — there, the row has to
 * exist in the database too.
 *
 * THE DANGEROUS CASE THIS REFUSES TO CREATE
 * The fallback is all-or-nothing: one row in features_menu makes the website
 * use the database and ignore the hardcoded list entirely. Inserting News into
 * an empty menu would therefore leave the header showing News and nothing
 * else. When the menu is empty this script changes nothing and says so — the
 * code fallback already shows the full menu, News included.
 *
 * Safe to run twice: an existing News row is left alone.
 *
 * Usage:
 *   node scripts/add-news-nav.mjs            # dry run, prints a plan
 *   node scripts/add-news-nav.mjs --apply    # writes
 */
import { prisma } from '../src/config/db.js'

const APPLY = process.argv.includes('--apply')

const LOCATION = 'features_menu'
const LABEL = 'News'
const HREF = '/news'
// Where the website's own fallback list puts it.
const AFTER = 'KT Plus'

async function main() {
  const rows = await prisma.navigationItem.findMany({
    where: { location: LOCATION },
    orderBy: { order: 'asc' },
  })

  console.log(`${LOCATION}: ${rows.length} row(s) in the database`)

  if (rows.length === 0) {
    console.log(
      '\nNothing to do. With no rows here the website uses its built-in list,\n' +
        'which already contains News. Adding a single row would REPLACE that\n' +
        'whole list and leave News as the only item in the menu.',
    )
    return
  }

  if (rows.some((r) => r.href === HREF || r.label.toLowerCase() === LABEL.toLowerCase())) {
    console.log('\nNews is already in the menu. Nothing to do.')
    return
  }

  // Straight after KT Plus when it is there, otherwise at the end.
  const anchor = rows.find((r) => r.label === AFTER)
  const position = anchor ? anchor.order + 1 : rows[rows.length - 1].order + 1
  const shifted = rows.filter((r) => r.order >= position)

  console.log(`\nPlan:\n  insert "${LABEL}" -> ${HREF} at order ${position}`)
  if (shifted.length) console.log(`  move down by 1: ${shifted.map((r) => r.label).join(', ')}`)

  if (!APPLY) {
    console.log('\nRe-run with --apply to write.')
    return
  }

  await prisma.$transaction([
    // Highest order first, so no two rows ever hold the same value midway.
    ...shifted
      .slice()
      .reverse()
      .map((r) => prisma.navigationItem.update({ where: { id: r.id }, data: { order: r.order + 1 } })),
    prisma.navigationItem.create({
      data: { label: LABEL, href: HREF, location: LOCATION, order: position, visible: true },
    }),
  ])

  const after = await prisma.navigationItem.findMany({
    where: { location: LOCATION },
    orderBy: { order: 'asc' },
    select: { label: true, href: true, order: true },
  })
  console.log('\nFeatures menu is now:')
  for (const r of after) console.log(`  ${String(r.order).padStart(2)}  ${r.label.padEnd(12)} ${r.href}`)
}

main()
  .catch((err) => {
    console.error('failed:', err?.message || err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

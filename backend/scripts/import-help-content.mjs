/**
 * Fill Help Center article bodies with the written guides in
 * ./help-content.mjs, so every article is managed from the admin Help Center.
 *
 * Non-destructive:
 *   - An article is written only while its body is empty or still the seed
 *     placeholder ("... Manage the full content from the admin panel.").
 *     Anything an editor has already written in admin is left untouched.
 *   - Articles are matched by slug. Nothing is created, renamed, reordered,
 *     re-published or deleted; only `body` (and, for the two articles with
 *     platform tabs, the `platforms` tab order) is set.
 *
 * Ships inside the backend image (Dockerfile `COPY . .`), so the same command
 * runs in production:
 *
 *   node scripts/import-help-content.mjs            # dry run — prints the plan
 *   node scripts/import-help-content.mjs --apply    # writes
 */
import { PrismaClient } from '@prisma/client'
import { HELP_CONTENT } from './help-content.mjs'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const PLACEHOLDER = /Manage the full content from the admin panel/i

async function main() {
  // Every /help/<slug> link must point at a published article in THIS
  // database (production may differ from local); otherwise nothing is written.
  const published = await prisma.helpArticle.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true } })
  const live = new Set(published.map((a) => a.slug))
  const broken = []
  for (const [slug, content] of Object.entries(HELP_CONTENT)) {
    for (const m of content.body.matchAll(/href="\/help\/([^"#?]+)"/g)) {
      if (!live.has(m[1])) broken.push(`${slug} -> /help/${m[1]}`)
    }
  }
  if (broken.length) {
    console.error('\nLinks to articles that are not published in this database — nothing was written:')
    for (const b of broken) console.error(`  ${b}`)
    process.exitCode = 1
    return
  }

  const rows = { write: [], kept: [], missing: [] }

  for (const [slug, content] of Object.entries(HELP_CONTENT)) {
    const article = await prisma.helpArticle.findUnique({ where: { slug }, select: { id: true, body: true } })
    if (!article) {
      rows.missing.push(slug)
      continue
    }
    const body = String(article.body || '')
    if (body.trim() && !PLACEHOLDER.test(body)) {
      rows.kept.push(slug)
      continue
    }
    rows.write.push(slug)
    if (APPLY) {
      await prisma.helpArticle.update({
        where: { id: article.id },
        data: { body: content.body.trim(), ...(content.platforms ? { platforms: content.platforms } : {}) },
      })
    }
  }

  // Published articles this file has no guide for (shown for completeness).
  const noGuide = published.map((a) => a.slug).filter((slug) => !HELP_CONTENT[slug])

  console.log(APPLY ? '\n=== HELP CONTENT IMPORT APPLIED ===' : '\n=== HELP CONTENT DRY RUN ===')
  console.log(`  ${APPLY ? 'written' : 'would write'}: ${rows.write.length}`)
  for (const slug of rows.write) console.log(`    + ${slug}`)
  console.log(`  kept (already written in admin): ${rows.kept.length}`)
  for (const slug of rows.kept) console.log(`    = ${slug}`)
  console.log(`  not in this database (skipped): ${rows.missing.length}`)
  for (const slug of rows.missing) console.log(`    ? ${slug}`)
  console.log(`  published articles without a guide in help-content.mjs: ${noGuide.length}`)
  for (const slug of noGuide) console.log(`    - ${slug}`)
  if (!APPLY) console.log('\n  Re-run with --apply to write.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

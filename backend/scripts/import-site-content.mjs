/**
 * Phase 1 of the admin-driven CMS migration: import the CURRENT website
 * content into the admin database.
 *
 * This script ONLY writes to the database. It changes nothing on the website —
 * the site still renders from its hardcoded values until a later phase wires
 * each area to the API. That ordering is deliberate: import first, verify in
 * the admin, switch rendering only once the data is confirmed to match.
 *
 * Non-destructive by design:
 *   • existing rows are UPDATED in place (ids, and any admin edits to fields
 *     this script does not own, are preserved)
 *   • missing rows are INSERTED
 *   • nothing is ever DELETED — rows in the database that no longer appear in
 *     the code are left alone and reported, so a human decides their fate
 *
 * Safe to run repeatedly: it is idempotent.
 *
 *   node scripts/import-site-content.mjs            # dry run, prints a plan
 *   node scripts/import-site-content.mjs --apply    # writes
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')

const KT_WEB_URL = 'https://web.ktmessenger.com/auth/qr'
// Footer links that open the download modal rather than navigating. The
// FooterLink table has no "action" column, so the intent is carried in the
// href as a sentinel the frontend can recognise when this area is wired up.
const DOWNLOAD_ACTION = '#download'

/* ── Source of truth: the content currently hardcoded in the website ───── */

// src/components/layout/Navbar/Navbar.jsx → navLinks
const HEADER_NAV = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Blog', href: '/blog' },
  { label: 'Apps', href: '/apps' },
  { label: 'Help Center', href: '/help' },
  { label: 'For Business', href: '/business' },
]

// Navbar.jsx → featureItems (only the entries currently visible; News,
// Markets, Wallet and Marketplace are commented out in the code and are
// therefore NOT imported as visible items).
const FEATURES_MENU = [
  { label: 'Calling', href: '/calling' },
  { label: 'Messaging', href: '/messaging' },
  { label: 'Groups', href: '/groups' },
  { label: 'Channels', href: '/channels' },
  { label: 'KT AI', href: '/ai' },
  { label: 'Status', href: '/status' },
  { label: 'Security', href: '/security' },
  { label: 'KT Plus', href: '/plus' },
  { label: 'Notes', href: '/notes' },
]

// src/components/layout/Footer/Footer.jsx → columns
const FOOTER = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Calls', href: '/calling' },
      { label: 'Groups', href: '/groups' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Business', href: '/business' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Get KT Messenger',
    links: [
      { label: 'Android', href: DOWNLOAD_ACTION },
      { label: 'iPhone', href: DOWNLOAD_ACTION },
      { label: 'Mac & PC', href: DOWNLOAD_ACTION },
      { label: 'KT Web', href: KT_WEB_URL },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' },
    ],
  },
]

// src/components/common/Modals/DownloadModal.jsx — the real store deep links
// that the site uses today. The database currently holds store *homepages*,
// which would send users to the wrong place once the modal reads from admin.
// Android and iOS are store pages; Windows is a direct installer download, so
// each goes in the column that matches what it actually is.
const RELEASE_URLS = {
  ANDROID: { storeUrl: 'https://play.google.com/store/apps/details?id=com.ogoul.kalamtime' },
  IOS: { storeUrl: 'https://apps.apple.com/in/app/kt-messenger/id6478195913' },
  WINDOWS: { downloadUrl: 'https://cdn1.ktmessenger.com/KT%20MESSENGER%20INSTALL.EXE' },
}

/* ── Runner ───────────────────────────────────────────────────────────── */

const plan = []
const warn = []
const note = (action, what, detail) => plan.push({ action, what, detail })

async function importHeaderNav() {
  const existing = await prisma.navigationItem.findMany({ where: { location: 'header' } })
  for (const [i, item] of HEADER_NAV.entries()) {
    const found = existing.find((e) => e.label === item.label)
    if (!found) {
      note('CREATE', `nav/header: ${item.label}`, item.href)
      if (APPLY) await prisma.navigationItem.create({ data: { ...item, location: 'header', order: i, visible: true } })
    } else if (found.href !== item.href || found.order !== i) {
      note('UPDATE', `nav/header: ${item.label}`, `${found.href} -> ${item.href}`)
      if (APPLY) await prisma.navigationItem.update({ where: { id: found.id }, data: { href: item.href, order: i } })
    } else {
      note('OK', `nav/header: ${item.label}`, item.href)
    }
  }
  for (const e of existing) {
    if (!HEADER_NAV.some((h) => h.label === e.label)) warn.push(`nav/header "${e.label}" is in the database but not in the code — left untouched`)
  }
}

async function importFeaturesMenu() {
  const existing = await prisma.navigationItem.findMany({ where: { location: 'features_menu' } })
  for (const [i, item] of FEATURES_MENU.entries()) {
    const found = existing.find((e) => e.label === item.label)
    if (!found) {
      note('CREATE', `nav/features: ${item.label}`, item.href)
      if (APPLY) await prisma.navigationItem.create({ data: { ...item, location: 'features_menu', order: i, visible: true } })
    } else if (found.href !== item.href || found.order !== i) {
      note('UPDATE', `nav/features: ${item.label}`, `${found.href} -> ${item.href}`)
      if (APPLY) await prisma.navigationItem.update({ where: { id: found.id }, data: { href: item.href, order: i } })
    } else {
      note('OK', `nav/features: ${item.label}`, item.href)
    }
  }
}

async function importFooter() {
  for (const [si, sec] of FOOTER.entries()) {
    let section = await prisma.footerSection.findFirst({ where: { title: sec.title } })
    if (!section) {
      note('CREATE', `footer section: ${sec.title}`, '')
      if (APPLY) section = await prisma.footerSection.create({ data: { title: sec.title, order: si } })
      else continue
    }
    const links = await prisma.footerLink.findMany({ where: { sectionId: section.id } })
    for (const [li, link] of sec.links.entries()) {
      const found = links.find((l) => l.label === link.label)
      if (!found) {
        note('CREATE', `footer/${sec.title}: ${link.label}`, link.href)
        if (APPLY) await prisma.footerLink.create({ data: { sectionId: section.id, label: link.label, href: link.href, order: li } })
      } else if (found.href !== link.href || found.order !== li) {
        note('UPDATE', `footer/${sec.title}: ${link.label}`, `${found.href} -> ${link.href}`)
        if (APPLY) await prisma.footerLink.update({ where: { id: found.id }, data: { href: link.href, order: li } })
      } else {
        note('OK', `footer/${sec.title}: ${link.label}`, link.href)
      }
    }
    for (const l of links) {
      if (!sec.links.some((x) => x.label === l.label)) warn.push(`footer/${sec.title} "${l.label}" is in the database but not in the code — left untouched`)
    }
  }
}

async function importReleaseUrls() {
  for (const [platform, fields] of Object.entries(RELEASE_URLS)) {
    const rel = await prisma.appRelease.findFirst({ where: { platform } })
    if (!rel) { warn.push(`app release ${platform} not found — skipped`); continue }
    const [field, url] = Object.entries(fields)[0]
    if (rel[field] === url) { note('OK', `release ${platform}`, url); continue }
    note('UPDATE', `release ${platform} ${field}`, `${rel[field] || '(none)'} -> ${url}`)
    if (APPLY) await prisma.appRelease.update({ where: { id: rel.id }, data: fields })
  }
  // MAC has no real URL anywhere — not in the code, not supplied. Nothing is
  // invented for it; the frontend hides any platform without a usable link.
  const mac = await prisma.appRelease.findFirst({ where: { platform: 'MAC' } })
  if (mac) {
    warn.push(
      `app release MAC has no real download link (storeUrl="${mac.storeUrl}" is a store homepage placeholder). ` +
        'Left untouched, and the download modal hides it until a valid URL is set in admin.',
    )
  }
}

try {
  await importHeaderNav()
  await importFeaturesMenu()
  await importFooter()
  await importReleaseUrls()

  const counts = plan.reduce((m, p) => ((m[p.action] = (m[p.action] || 0) + 1), m), {})
  console.log(APPLY ? '=== IMPORT APPLIED ===' : '=== DRY RUN (no writes) ===')
  console.log(`  create: ${counts.CREATE || 0}   update: ${counts.UPDATE || 0}   already correct: ${counts.OK || 0}`)
  console.log('')
  for (const p of plan) {
    if (p.action === 'OK') continue
    console.log(`  ${p.action.padEnd(7)} ${p.what.padEnd(42)} ${p.detail}`)
  }
  if (warn.length) {
    console.log('\n  --- left untouched (nothing deleted) ---')
    for (const w of warn) console.log('  ! ' + w)
  }
  console.log(APPLY ? '\nDatabase updated. The website is unchanged — no rendering was switched.' : '\nRe-run with --apply to write.')
} finally {
  await prisma.$disconnect()
}

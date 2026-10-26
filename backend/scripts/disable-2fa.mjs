#!/usr/bin/env node
/**
 * Emergency: turn two-factor authentication off for one admin.
 *
 *   node scripts/disable-2fa.mjs --list
 *   node scripts/disable-2fa.mjs admin@example.com
 *
 * The way back in when an admin's mailbox is unreachable and their recovery
 * codes are gone with it. Everything else in the feature is deliberately
 * locked down; this is the last door, and it needs shell access on the server
 * to open — which is a higher bar than anything the panel itself asks for.
 *
 * It only clears the 2FA columns. Password, role and status are untouched, so
 * the account comes back exactly as it was before 2FA was switched on.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CLEARED = {
  twoFactorEnabledAt: null,
  twoFactorEmail: null,
  recoveryCodes: null,
  mfaCodeHash: null,
  mfaCodeExp: null,
  mfaAttempts: 0,
  mfaSentAt: null,
}

async function list() {
  const admins = await prisma.admin.findMany({
    select: { email: true, name: true, status: true, twoFactorEnabledAt: true },
    orderBy: { email: 'asc' },
  })
  if (!admins.length) {
    console.log('No admin accounts found.')
    return
  }
  console.log('\n  2FA  STATUS    EMAIL')
  console.log('  ───  ────────  ─────────────────────────────────────')
  for (const a of admins) {
    console.log(
      `  ${a.twoFactorEnabledAt ? ' on' : 'off'}  ${a.status.padEnd(8)}  ${a.email}${a.name ? `  (${a.name})` : ''}`,
    )
  }
  console.log('')
}

async function disable(email) {
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) {
    console.error(`No admin account with the email "${email}".`)
    console.error('Run with --list to see every account.')
    process.exitCode = 1
    return
  }
  if (!admin.twoFactorEnabledAt) {
    console.log(`Two-factor authentication is already off for ${email}. Nothing to do.`)
    return
  }

  await prisma.admin.update({ where: { id: admin.id }, data: CLEARED })

  // Recorded like any other sensitive action, with no admin attributed: this
  // did not come through the panel, and pretending otherwise would hide it.
  await prisma.auditLog.create({
    data: {
      adminId: null,
      action: 'admin.2fa_disabled_by_cli',
      entity: 'Admin',
      entityId: admin.id,
      meta: { email: admin.email },
    },
  }).catch(() => { /* auditing must not fail the rescue */ })

  console.log(`Two-factor authentication is now OFF for ${email}.`)
  console.log('That account signs in with its password alone — turn 2FA back on from Profile → Security.')
}

async function main() {
  const arg = process.argv[2]
  if (!arg || arg === '--help' || arg === '-h') {
    console.log('Usage:')
    console.log('  node scripts/disable-2fa.mjs --list              show every admin and its 2FA state')
    console.log('  node scripts/disable-2fa.mjs <email>            turn 2FA off for that admin')
    process.exitCode = arg ? 0 : 1
    return
  }
  if (arg === '--list') return list()
  return disable(String(arg).trim().toLowerCase())
}

main()
  .catch((err) => {
    console.error('Failed:', err.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

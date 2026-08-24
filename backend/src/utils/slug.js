import crypto from 'node:crypto'
import { prisma } from '../config/db.js'

export function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// Ensure a slug is unique for a given prisma model, appending a short suffix if needed.
export async function uniqueSlug(model, base, { ignoreId } = {}) {
  const slug = slugify(base) || crypto.randomBytes(3).toString('hex')
  let attempt = slug
  let n = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma[model].findFirst({ where: { slug: attempt } })
    if (!existing || existing.id === ignoreId) return attempt
    attempt = `${slug}-${++n}`
    if (n > 50) return `${slug}-${crypto.randomBytes(3).toString('hex')}`
  }
}

import crypto from 'node:crypto'
import { prisma } from '../config/db.js'
import { ApiError } from './apiResponse.js'

export function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Is this slug free on `model`? `ignoreId` excludes the record being edited,
 * so re-saving a post without changing its slug is not a collision.
 */
export async function isSlugAvailable(model, slug, { ignoreId } = {}) {
  if (!slug) return false
  const existing = await prisma[model].findFirst({ where: { slug }, select: { id: true } })
  return !existing || existing.id === ignoreId
}

/**
 * Normalise an admin-supplied slug and reject it if taken.
 *
 * This is deliberately NOT `uniqueSlug`: when an admin types a slug we must
 * either honour it exactly or tell them it is taken. Silently saving
 * "calling-2" when they asked for "calling" makes the admin no longer the
 * source of truth, and they would never know the URL they published is wrong.
 */
export async function resolveAdminSlug(model, requested, { ignoreId } = {}) {
  const slug = slugify(requested)
  if (!slug) throw ApiError.badRequest('Slug must contain at least one letter or number')
  if (!(await isSlugAvailable(model, slug, { ignoreId }))) {
    throw ApiError.conflict(`The slug "${slug}" is already in use. Choose a different one.`)
  }
  return slug
}

// Ensure a slug is unique for a given prisma model, appending a short suffix if needed.
// Used only for the auto-generate fallback when no slug was supplied.
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

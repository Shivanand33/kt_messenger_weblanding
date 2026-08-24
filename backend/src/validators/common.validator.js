import { z } from 'zod'

export const contentStatus = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'])
export const platformEnum = z.enum(['IOS', 'ANDROID', 'MAC', 'WINDOWS', 'WEB', 'IPAD'])
export const localeStr = z.string().trim().min(2).max(12)
export const idParam = z.object({ id: z.string().min(1, 'id is required') })

export const listQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().max(200).optional(),
  status: contentStatus.optional(),
  locale: localeStr.optional(),
  sort: z.string().max(60).optional(),
})

// Accepts an http(s) URL or a site-relative path (e.g. "/uploads/x.png").
export const urlOrPath = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => /^https?:\/\//.test(v) || v.startsWith('/'), 'Must be a URL or a path starting with /')

export const optionalUrl = urlOrPath.optional().or(z.literal('')).transform((v) => v || undefined)

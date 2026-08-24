import { z } from 'zod'
import { contentStatus, platformEnum, localeStr, optionalUrl } from './common.validator.js'

const str = (max) => z.string().trim().max(max)
const optStr = (max) => str(max).optional().or(z.literal('')).transform((v) => v || undefined)

/* ── Blog ───────────────────────────────────────────────── */
export const blogCreateSchema = z.object({
  title: str(200).min(1),
  slug: optStr(200),
  excerpt: optStr(500),
  body: z.string().default(''),
  coverUrl: optionalUrl,
  authorName: str(120).optional(),
  status: contentStatus.optional(),
  featured: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
  locale: localeStr.optional(),
  seoTitle: optStr(200),
  seoDescription: optStr(400),
  ogImage: optionalUrl,
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
})
export const blogUpdateSchema = blogCreateSchema.partial()

export const blogCategorySchema = z.object({
  name: str(120).min(1),
  slug: optStr(120),
  description: optStr(300),
})
export const blogTagSchema = z.object({
  name: str(60).min(1),
  slug: optStr(60),
})

/* ── Help Center ────────────────────────────────────────── */
export const helpCategorySchema = z.object({
  title: str(120).min(1),
  slug: optStr(120),
  icon: optStr(60),
  order: z.coerce.number().int().optional(),
  locale: localeStr.optional(),
})
export const helpSubcategorySchema = z.object({
  categoryId: z.string().min(1),
  title: str(120).min(1),
  slug: optStr(120),
  icon: optStr(60),
  order: z.coerce.number().int().optional(),
})
export const helpArticleCreateSchema = z.object({
  subcategoryId: z.string().min(1),
  title: str(200).min(1),
  slug: optStr(200),
  body: z.string().default(''),
  platforms: z.array(str(30)).optional(),
  popular: z.boolean().optional(),
  status: contentStatus.optional(),
  order: z.coerce.number().int().optional(),
  locale: localeStr.optional(),
  seoTitle: optStr(200),
  seoDescription: optStr(400),
})
export const helpArticleUpdateSchema = helpArticleCreateSchema.partial().extend({
  subcategoryId: z.string().min(1).optional(),
})

/* ── FAQ ────────────────────────────────────────────────── */
export const faqSchema = z.object({
  page: str(40).min(1),
  question: str(300).min(1),
  answer: z.string().min(1),
  order: z.coerce.number().int().optional(),
  status: contentStatus.optional(),
  locale: localeStr.optional(),
})
export const faqUpdateSchema = faqSchema.partial()

/* ── Success stories ────────────────────────────────────── */
export const successStorySchema = z.object({
  company: str(160).min(1),
  slug: optStr(160),
  logoUrl: optionalUrl,
  imageUrl: optionalUrl,
  summary: str(600).min(1),
  body: z.string().default(''),
  metrics: z.any().optional(),
  status: contentStatus.optional(),
  order: z.coerce.number().int().optional(),
  locale: localeStr.optional(),
  seoTitle: optStr(200),
  seoDescription: optStr(400),
})
export const successStoryUpdateSchema = successStorySchema.partial()

/* ── App releases ───────────────────────────────────────── */
export const appReleaseSchema = z.object({
  platform: platformEnum,
  version: str(40).min(1),
  minOs: optStr(80),
  downloadUrl: optionalUrl,
  storeUrl: optionalUrl,
  notes: optStr(2000),
  releaseDate: z.coerce.date().optional(),
  isCurrent: z.boolean().optional(),
})
export const appReleaseUpdateSchema = appReleaseSchema.partial()

/* ── Website content blocks ─────────────────────────────── */
export const websiteContentSchema = z.object({
  key: str(120).min(1),
  page: str(60).min(1),
  label: optStr(160),
  data: z.any(),
  locale: localeStr.optional(),
})
export const websiteContentUpdateSchema = websiteContentSchema.partial()

/* ── Navigation ─────────────────────────────────────────── */
export const navItemSchema = z.object({
  label: str(80).min(1),
  href: str(300).min(1),
  location: str(40).optional(),
  order: z.coerce.number().int().optional(),
  visible: z.boolean().optional(),
  parentId: z.string().optional().nullable(),
  locale: localeStr.optional(),
})
export const navItemUpdateSchema = navItemSchema.partial()

/* ── Footer ─────────────────────────────────────────────── */
export const footerSectionSchema = z.object({
  title: str(120).min(1),
  order: z.coerce.number().int().optional(),
  locale: localeStr.optional(),
})
export const footerLinkSchema = z.object({
  sectionId: z.string().min(1),
  label: str(120).min(1),
  href: str(300).min(1),
  order: z.coerce.number().int().optional(),
})

/* ── Locale ─────────────────────────────────────────────── */
export const localeSchema = z.object({
  code: str(12).min(2),
  label: str(60).min(1),
  enabled: z.boolean().optional(),
  isDefault: z.boolean().optional(),
})
export const localeUpdateSchema = localeSchema.partial()

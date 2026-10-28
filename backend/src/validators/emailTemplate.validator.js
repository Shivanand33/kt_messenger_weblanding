import { z } from 'zod'

/**
 * The editable fields of a transactional email.
 *
 * Everything is optional: a field the editor leaves out keeps its default (the
 * service merges over defaults on read), and a field sent empty is an
 * intentional "hide this line" — an empty button label drops the button, an
 * empty footer drops the footer.
 */

const text = (max) => z.string().trim().max(max)

/**
 * A link field. Empty is fine, a `{{placeholder}}` is fine, and a real URL has
 * to be http(s) or mailto — anything else would be silently dropped at render
 * time, and a button that quietly vanishes is worse than a refused save.
 */
const linkish = (max, label) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => v === '' || v.includes('{{') || /^(https?:\/\/|mailto:)/i.test(v), {
      message: `${label} must start with http://, https:// or mailto:`,
    })

const templateData = z
  .object({
    brandName: text(80),
    brandColor: z
      .string()
      .trim()
      .regex(/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/, 'Use a hex colour such as #1570ef'),
    logoUrl: linkish(500, 'The logo URL'),
    preheader: text(300),
    heading: z.string().trim().min(1, 'The heading cannot be empty').max(160),
    intro: text(800),
    expiryNote: text(300),
    showDetails: z.boolean(),
    detailsTitle: text(120),
    securityNote: text(800),
    buttonLabel: text(60),
    buttonUrl: linkish(500, 'The button link'),
    footerNote: text(400),
  })
  .partial()

export const emailTemplateUpdateSchema = z.object({
  subject: z.string().trim().min(1, 'The subject cannot be empty').max(300),
  data: templateData.default({}),
  // Generous, but bounded: an email body is text, not an upload slot.
  customHtml: z.string().max(200_000, 'That HTML is too large to store').optional().default(''),
  useCustomHtml: z.boolean().optional().default(false),
})

/**
 * Preview and test take the same draft, or nothing at all.
 *
 * With no body they render what is saved, which is what the editor wants right
 * after a reset.
 */
export const emailTemplateDraftSchema = emailTemplateUpdateSchema.partial()

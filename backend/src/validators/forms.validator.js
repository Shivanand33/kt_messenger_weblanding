import { z } from 'zod'
import { localeStr } from './common.validator.js'

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('A valid email is required'),
  sourcePage: z.string().trim().max(120).optional(),
  locale: localeStr.optional(),
  consent: z.boolean().optional().default(true),
  // Honeypot: bots fill this hidden field; humans never do.
  website: z.string().max(0).optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(5000),
  sourcePage: z.string().trim().max(120).optional(),
  website: z.string().max(0).optional(), // honeypot
})

export const feedbackSchema = z.object({
  articleId: z.string().optional(),
  pagePath: z.string().trim().max(300).optional(),
  vote: z.enum(['UP', 'DOWN']),
  comment: z.string().trim().max(1000).optional(),
})

export const trackDownloadSchema = z.object({
  platform: z.string().trim().min(1).max(40),
  page: z.string().trim().max(120).optional(),
  target: z.string().trim().max(200).optional(),
  sessionId: z.string().trim().max(80).optional(),
})

export const analyticsEventSchema = z.object({
  type: z.string().trim().min(1).max(60),
  path: z.string().trim().max(300).optional(),
  meta: z.record(z.any()).optional(),
  sessionId: z.string().trim().max(80).optional(),
})

export const contactUpdateSchema = z.object({
  status: z.enum(['NEW', 'READ', 'RESOLVED', 'SPAM']),
})

// Admin reply to a contact message.
// deliver:false records the reply without sending it from the server — used when
// the admin sends it from their own mail client instead (no SMTP needed).
export const contactReplySchema = z.object({
  subject: z.string().trim().min(1).max(200).optional(),
  body: z.string().trim().min(1, 'Reply cannot be empty').max(5000),
  deliver: z.boolean().optional().default(true),
})

export const subscriberUpdateSchema = z.object({
  status: z.enum(['SUBSCRIBED', 'UNSUBSCRIBED']),
})

import { Router } from 'express'
import * as content from '../controllers/public/content.controller.js'
import { search } from '../controllers/public/search.controller.js'
import * as forms from '../controllers/public/forms.controller.js'
import { validate } from '../middleware/validate.js'
import { publicWriteLimiter } from '../middleware/rateLimit.js'
import { subscribeSchema, contactSchema, feedbackSchema, trackDownloadSchema, analyticsEventSchema } from '../validators/forms.validator.js'

const r = Router()

// ── Blog ──────────────────────────────────────────────
r.get('/blog', content.listBlog)
r.get('/blog/featured', content.getFeaturedBlog)
r.get('/blog/:slug', content.getBlogBySlug)

// ── Help Center ───────────────────────────────────────
r.get('/help/tree', content.getHelpTree)
r.get('/help/popular', content.getPopularArticles)
r.get('/help/articles/:slug', content.getHelpArticle)

// ── FAQs / Stories / Downloads / Locales ──────────────
r.get('/faqs', content.listFaqs)
r.get('/success-stories', content.listSuccessStories)
r.get('/success-stories/:slug', content.getSuccessStory)
r.get('/downloads', content.getDownloads)
r.get('/locales', content.listLocales)

// ── Navigation / Footer / Content blocks ──────────────
r.get('/navigation', content.getNavigation)
r.get('/footer', content.getFooter)
r.get('/content/:key', content.getContentBlock)
r.get('/page-content/:page', content.getPageContent)

// ── Search ────────────────────────────────────────────
r.get('/search', search)

// ── Public writes (spam-protected) ────────────────────
r.post('/subscribe', publicWriteLimiter, validate(subscribeSchema), forms.subscribe)
r.post('/contact', publicWriteLimiter, validate(contactSchema), forms.contact)
r.post('/feedback', publicWriteLimiter, validate(feedbackSchema), forms.feedback)
r.post('/track/download', validate(trackDownloadSchema), forms.trackDownload)
r.post('/track/event', validate(analyticsEventSchema), forms.trackEvent)

export default r

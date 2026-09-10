import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requirePermission, requireSuperAdmin } from '../middleware/rbac.js'
import { validate } from '../middleware/validate.js'
import { loginLimiter } from '../middleware/rateLimit.js'
import { handleUpload } from '../middleware/upload.js'
import { crudFactory } from '../utils/crudFactory.js'
import { idParam } from '../validators/common.validator.js'

// controllers
import * as auth from '../controllers/admin/auth.controller.js'
import { dashboard } from '../controllers/admin/dashboard.controller.js'
import * as blog from '../controllers/admin/blog.controller.js'
import * as help from '../controllers/admin/help.controller.js'
import * as media from '../controllers/admin/media.controller.js'
import { overview as analytics } from '../controllers/admin/analytics.controller.js'
import { search, notifications } from '../controllers/admin/search.controller.js'
import * as admins from '../controllers/admin/adminUser.controller.js'
import * as contact from '../controllers/admin/contact.controller.js'
import * as roles from '../controllers/admin/role.controller.js'
import * as settings from '../controllers/admin/settings.controller.js'
import { prisma } from '../config/db.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ok, created } from '../utils/apiResponse.js'
import { writeAudit } from '../utils/audit.js'

// validators
import { loginSchema, changePasswordSchema, updateProfileSchema } from '../validators/auth.validator.js'
import {
  blogCreateSchema, blogUpdateSchema, blogCategorySchema, blogTagSchema,
  helpCategorySchema, helpSubcategorySchema, helpArticleCreateSchema, helpArticleUpdateSchema,
  faqSchema, faqUpdateSchema, successStorySchema, successStoryUpdateSchema,
  appReleaseSchema, appReleaseUpdateSchema, websiteContentSchema, websiteContentUpdateSchema,
  navItemSchema, navItemUpdateSchema, footerSectionSchema, footerLinkSchema, localeSchema, localeUpdateSchema,
} from '../validators/content.validator.js'
import { adminCreateSchema, adminUpdateSchema, roleCreateSchema, roleUpdateSchema } from '../validators/admin.validator.js'
import { contactUpdateSchema, contactReplySchema, subscriberUpdateSchema } from '../validators/forms.validator.js'

const r = Router()
const P = requirePermission

/* ── Public auth endpoints (no token yet) ─────────────── */
r.post('/auth/login', loginLimiter, validate(loginSchema), auth.login)
r.post('/auth/logout', auth.logout)

/* ── Everything below requires a valid admin token ────── */
r.use(requireAuth)

r.get('/auth/me', auth.me)
r.patch('/auth/profile', validate(updateProfileSchema), auth.updateProfile)
r.post('/auth/change-password', validate(changePasswordSchema), auth.changePassword)
r.get('/dashboard', P('dashboard:read'), dashboard)

// Helper: wire standard CRUD for a resource with RBAC + validation.
function mountCrud(base, crud, { resource, createSchema, updateSchema, canPublish = false }) {
  r.get(base, P(`${resource}:read`), crud.list)
  r.get(`${base}/:id`, P(`${resource}:read`), validate(idParam, 'params'), crud.getOne)
  r.post(base, P(`${resource}:write`), validate(createSchema), crud.create)
  r.put(`${base}/:id`, P(`${resource}:write`), validate(idParam, 'params'), validate(updateSchema), crud.update)
  const del = `${resource}:delete`
  r.delete(`${base}/:id`, P(del), validate(idParam, 'params'), crud.remove)
  void canPublish
}

/* ── Blog (custom controller: tags, publish) ──────────── */
r.get('/blogs', P('blog:read'), blog.list)
// Must stay above '/blogs/:id' — otherwise ':id' captures "slug-check".
r.get('/blogs/slug-check', P('blog:read'), blog.slugCheck)
r.get('/blogs/:id', P('blog:read'), validate(idParam, 'params'), blog.getOne)
r.post('/blogs', P('blog:write'), validate(blogCreateSchema), blog.create)
r.put('/blogs/:id', P('blog:write'), validate(idParam, 'params'), validate(blogUpdateSchema), blog.update)
r.patch('/blogs/:id/status', P('blog:publish'), validate(idParam, 'params'), blog.setStatus)
r.delete('/blogs/:id', P('blog:delete'), validate(idParam, 'params'), blog.remove)

mountCrud('/blog-categories', crudFactory({ model: 'blogCategory', entityName: 'blog_category', searchable: ['name'], slugFrom: 'name' }), { resource: 'blog_category', createSchema: blogCategorySchema, updateSchema: blogCategorySchema.partial() })
mountCrud('/blog-tags', crudFactory({ model: 'blogTag', entityName: 'blog_tag', searchable: ['name'], slugFrom: 'name', defaultOrderBy: { name: 'asc' } }), { resource: 'blog_tag', createSchema: blogTagSchema, updateSchema: blogTagSchema.partial() })

/* ── Help center ──────────────────────────────────────── */
r.get('/help/tree', P('help:read'), help.adminTree)
r.get('/help/subcategories', P('help:read'), help.listSubcategories)
r.get('/help/articles', P('help:read'), help.listArticles)
r.patch('/help/reorder', P('help:write'), help.reorder)

const helpCatCrud = crudFactory({ model: 'helpCategory', entityName: 'help_category', searchable: ['title'], slugFrom: 'title', defaultOrderBy: { order: 'asc' } })
mountCrud('/help/categories', helpCatCrud, { resource: 'help', createSchema: helpCategorySchema, updateSchema: helpCategorySchema.partial() })

const helpSubCrud = crudFactory({ model: 'helpSubcategory', entityName: 'help_subcategory', slugFrom: 'title', defaultOrderBy: { order: 'asc' } })
r.get('/help/subcategories/:id', P('help:read'), validate(idParam, 'params'), helpSubCrud.getOne)
r.post('/help/subcategories', P('help:write'), validate(helpSubcategorySchema), helpSubCrud.create)
r.put('/help/subcategories/:id', P('help:write'), validate(idParam, 'params'), validate(helpSubcategorySchema.partial()), helpSubCrud.update)
r.delete('/help/subcategories/:id', P('help:delete'), validate(idParam, 'params'), helpSubCrud.remove)

const helpArtCrud = crudFactory({ model: 'helpArticle', entityName: 'help_article', slugFrom: 'title', defaultOrderBy: { order: 'asc' }, include: { subcategory: true } })
r.get('/help/articles/:id', P('help:read'), validate(idParam, 'params'), helpArtCrud.getOne)
r.post('/help/articles', P('help:write'), validate(helpArticleCreateSchema), helpArtCrud.create)
r.put('/help/articles/:id', P('help:write'), validate(idParam, 'params'), validate(helpArticleUpdateSchema), helpArtCrud.update)
r.delete('/help/articles/:id', P('help:delete'), validate(idParam, 'params'), helpArtCrud.remove)

/* ── FAQs / Stories / Releases / Content / Nav / Footer ─ */
mountCrud('/faqs', crudFactory({ model: 'faq', entityName: 'faq', searchable: ['question'], defaultOrderBy: { order: 'asc' } }), { resource: 'faq', createSchema: faqSchema, updateSchema: faqUpdateSchema })
mountCrud('/success-stories', crudFactory({ model: 'successStory', entityName: 'success_story', searchable: ['company', 'summary'], slugFrom: 'company', defaultOrderBy: { order: 'asc' } }), { resource: 'success_story', createSchema: successStorySchema, updateSchema: successStoryUpdateSchema })
mountCrud('/app-releases', crudFactory({ model: 'appRelease', entityName: 'app_release', searchable: ['version'] }), { resource: 'app_release', createSchema: appReleaseSchema, updateSchema: appReleaseUpdateSchema })
mountCrud('/website-content', crudFactory({ model: 'websiteContent', entityName: 'website_content', searchable: ['key', 'label'] }), { resource: 'website_content', createSchema: websiteContentSchema, updateSchema: websiteContentUpdateSchema })
mountCrud('/navigation', crudFactory({ model: 'navigationItem', entityName: 'navigation', searchable: ['label'], defaultOrderBy: { order: 'asc' } }), { resource: 'navigation', createSchema: navItemSchema, updateSchema: navItemUpdateSchema })
mountCrud('/footer-sections', crudFactory({ model: 'footerSection', entityName: 'footer', searchable: ['title'], defaultOrderBy: { order: 'asc' }, include: { links: { orderBy: { order: 'asc' } } } }), { resource: 'footer', createSchema: footerSectionSchema, updateSchema: footerSectionSchema.partial() })
mountCrud('/footer-links', crudFactory({ model: 'footerLink', entityName: 'footer', defaultOrderBy: { order: 'asc' } }), { resource: 'footer', createSchema: footerLinkSchema, updateSchema: footerLinkSchema.partial() })

/* ── Media ────────────────────────────────────────────── */
r.get('/media', P('media:read'), media.list)
r.post('/media', P('media:write'), handleUpload, media.upload)
r.patch('/media/:id', P('media:write'), validate(idParam, 'params'), media.update)
r.delete('/media/:id', P('media:delete'), validate(idParam, 'params'), media.remove)

/* ── Subscribers ──────────────────────────────────────── */
const subCrud = crudFactory({ model: 'subscriber', entityName: 'subscriber', searchable: ['email'] })
r.get('/subscribers', P('subscriber:read'), subCrud.list)
r.patch('/subscribers/:id', P('subscriber:write'), validate(idParam, 'params'), validate(subscriberUpdateSchema), subCrud.update)
r.put('/subscribers/:id', P('subscriber:write'), validate(idParam, 'params'), validate(subscriberUpdateSchema), subCrud.update)
r.delete('/subscribers/:id', P('subscriber:delete'), validate(idParam, 'params'), subCrud.remove)
r.get('/subscribers-export', P('subscriber:export'), asyncHandler(async (_req, res) => {
  const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  const csv = ['email,status,sourcePage,locale,createdAt', ...rows.map((s) => `${s.email},${s.status},${s.sourcePage || ''},${s.locale},${s.createdAt.toISOString()}`)].join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"')
  res.send(csv)
}))

/* ── Contact messages ─────────────────────────────────── */
const contactCrud = crudFactory({ model: 'contactMessage', entityName: 'contact', searchable: ['name', 'email', 'subject'], include: { repliedBy: { select: { name: true } } } })
r.get('/contact', P('contact:read'), contactCrud.list)
r.get('/contact/:id', P('contact:read'), validate(idParam, 'params'), contactCrud.getOne)
// PATCH is the canonical partial update; PUT is accepted as an alias so the
// admin's generic edit form (which uses PUT) works against this resource too.
r.patch('/contact/:id', P('contact:write'), validate(idParam, 'params'), validate(contactUpdateSchema), contactCrud.update)
r.put('/contact/:id', P('contact:write'), validate(idParam, 'params'), validate(contactUpdateSchema), contactCrud.update)
r.post('/contact/:id/reply', P('contact:write'), validate(idParam, 'params'), validate(contactReplySchema), contact.reply)
r.delete('/contact/:id', P('contact:delete'), validate(idParam, 'params'), contactCrud.remove)

/* ── Feedback ─────────────────────────────────────────── */
const feedbackCrud = crudFactory({ model: 'feedback', entityName: 'feedback', searchable: ['comment'], include: { article: { select: { title: true, slug: true } } } })
r.get('/feedback', P('feedback:read'), feedbackCrud.list)
r.delete('/feedback/:id', P('feedback:delete'), validate(idParam, 'params'), feedbackCrud.remove)

/* ── Analytics ────────────────────────────────────────── */
r.get('/analytics', P('analytics:read'), analytics)

/* ── Global search + notification feed ────────────────── */
// No route-level permission: both controllers filter each resource by the
// caller's own permissions, so a limited admin gets fewer groups, not a 403.
r.get('/search', search)
r.get('/notifications', notifications)

/* ── Locales (natural key = code) ─────────────────────── */
r.get('/locales', P('locale:read'), asyncHandler(async (_req, res) => ok(res, await prisma.locale.findMany({ orderBy: { code: 'asc' } }))))
r.post('/locales', P('locale:write'), validate(localeSchema), asyncHandler(async (req, res) => created(res, await prisma.locale.create({ data: req.body }))))
r.put('/locales/:code', P('locale:write'), validate(localeUpdateSchema), asyncHandler(async (req, res) => ok(res, await prisma.locale.update({ where: { code: req.params.code }, data: req.body }))))
r.delete('/locales/:code', P('locale:write'), asyncHandler(async (req, res) => { await prisma.locale.delete({ where: { code: req.params.code } }); await writeAudit({ req, action: 'locale.delete', entity: 'Locale', entityId: req.params.code }); return ok(res, { code: req.params.code, deleted: true }) }))

/* ── Admin users & roles (super admin controlled) ─────── */
r.get('/admins', P('admin_user:read'), admins.list)
r.post('/admins', P('admin_user:write'), validate(adminCreateSchema), admins.create)
r.put('/admins/:id', P('admin_user:write'), validate(idParam, 'params'), validate(adminUpdateSchema), admins.update)
r.delete('/admins/:id', P('admin_user:delete'), validate(idParam, 'params'), admins.remove)

r.get('/roles', P('role:read'), roles.listRoles)
r.get('/permissions', P('role:read'), roles.listPermissions)
r.post('/roles', P('role:write'), validate(roleCreateSchema), roles.createRole)
r.put('/roles/:id', P('role:write'), validate(idParam, 'params'), validate(roleUpdateSchema), roles.updateRole)
r.delete('/roles/:id', P('role:delete'), validate(idParam, 'params'), roles.deleteRole)

/* ── Email settings (super admin only) ────────────────── */
r.get('/settings/email', requireSuperAdmin, settings.getEmailSettings)
r.put('/settings/email', requireSuperAdmin, settings.updateEmailSettings)
r.post('/settings/email/test', requireSuperAdmin, settings.testEmailSettings)

/* ── Audit log (read-only) ────────────────────────────── */
r.get('/audit-logs', P('audit_log:read'), crudFactory({ model: 'auditLog', entityName: 'audit_log', searchable: ['action', 'entity'], include: { admin: { select: { name: true, email: true } } } }).list)

export default r

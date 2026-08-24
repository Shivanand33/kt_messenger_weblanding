import { ResourcePage } from '../components/ResourcePage.jsx'
import { Badge, StatusBadge, fmtDate } from '../components/ui.jsx'

const STATUS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'ARCHIVED', label: 'Archived' },
]
const title = (key = 'name') => (r) => <span className="t-title">{r[key]}</span>

/* ── FAQs ───────────────────────────────────────────── */
export const FaqsPage = () => (
  <ResourcePage config={{
    title: 'FAQ', addLabel: 'FAQ', endpoint: '/admin/faqs', permission: 'faq',
    subtitle: 'Questions shown on the Calling, Messaging, Help and Business pages.',
    columns: [
      { key: 'question', header: 'Question', render: title('question') },
      { key: 'page', header: 'Page', render: (r) => <Badge tone="blue">{r.page}</Badge> },
      { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      { key: 'order', header: 'Order' },
    ],
    fields: [
      { name: 'question', label: 'Question' },
      { name: 'answer', label: 'Answer', type: 'textarea' },
      { name: 'page', label: 'Page', type: 'select', default: 'help', options: [{ value: 'help', label: 'Help' }, { value: 'calling', label: 'Calling' }, { value: 'messaging', label: 'Messaging' }, { value: 'business', label: 'Business' }, { value: 'home', label: 'Home' }] },
      { name: 'status', label: 'Status', type: 'select', default: 'PUBLISHED', options: STATUS },
      { name: 'order', label: 'Order', type: 'number', default: 0 },
    ],
  }} />
)

/* ── Blog categories / tags ─────────────────────────── */
export const BlogCategoriesPage = () => (
  <ResourcePage config={{
    title: 'Blog Category', addLabel: 'Category', endpoint: '/admin/blog-categories', permission: 'blog_category',
    columns: [{ key: 'name', header: 'Name', render: title() }, { key: 'slug', header: 'Slug' }, { key: 'description', header: 'Description' }],
    fields: [{ name: 'name', label: 'Name' }, { name: 'slug', label: 'Slug', hint: 'Auto-generated from name if blank' }, { name: 'description', label: 'Description', type: 'textarea' }],
  }} />
)
export const BlogTagsPage = () => (
  <ResourcePage config={{
    title: 'Blog Tag', addLabel: 'Tag', endpoint: '/admin/blog-tags', permission: 'blog_tag',
    columns: [{ key: 'name', header: 'Name', render: title() }, { key: 'slug', header: 'Slug' }],
    fields: [{ name: 'name', label: 'Name' }, { name: 'slug', label: 'Slug', hint: 'Auto-generated if blank' }],
  }} />
)

/* ── Success stories ────────────────────────────────── */
export const SuccessStoriesPage = () => (
  <ResourcePage config={{
    title: 'Success Story', addLabel: 'Story', endpoint: '/admin/success-stories', permission: 'success_story',
    subtitle: 'Customer stories shown on the Business page.',
    columns: [{ key: 'company', header: 'Company', render: title('company') }, { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> }, { key: 'order', header: 'Order' }],
    fields: [
      { name: 'company', label: 'Company' }, { name: 'slug', label: 'Slug', hint: 'Auto if blank' },
      { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'body', label: 'Full story', type: 'textarea' },
      { name: 'logoUrl', label: 'Logo URL' }, { name: 'imageUrl', label: 'Image URL' },
      { name: 'metrics', label: 'Metrics (JSON)', type: 'json', hint: 'e.g. { "conversion": "+38%" }' },
      { name: 'status', label: 'Status', type: 'select', default: 'PUBLISHED', options: STATUS }, { name: 'order', label: 'Order', type: 'number', default: 0 },
    ],
  }} />
)

/* ── App releases ───────────────────────────────────── */
export const AppReleasesPage = () => (
  <ResourcePage config={{
    title: 'App Release', addLabel: 'Release', endpoint: '/admin/app-releases', permission: 'app_release', searchable: false,
    subtitle: 'Download links & versions used by the Apps page.',
    columns: [{ key: 'platform', header: 'Platform', render: (r) => <Badge tone="blue">{r.platform}</Badge> }, { key: 'version', header: 'Version', render: title('version') }, { key: 'minOs', header: 'Min OS' }, { key: 'isCurrent', header: 'Current', render: (r) => (r.isCurrent ? <Badge tone="green">current</Badge> : '—') }],
    fields: [
      { name: 'platform', label: 'Platform', type: 'select', options: ['IOS', 'ANDROID', 'MAC', 'WINDOWS', 'WEB', 'IPAD'].map((v) => ({ value: v, label: v })) },
      { name: 'version', label: 'Version' }, { name: 'minOs', label: 'Minimum OS' },
      { name: 'downloadUrl', label: 'Download URL' }, { name: 'storeUrl', label: 'Store URL' },
      { name: 'notes', label: 'Release notes', type: 'textarea' }, { name: 'isCurrent', label: 'Current release', type: 'checkbox' },
    ],
  }} />
)

/* ── Website content blocks ─────────────────────────── */
export const WebsiteContentPage = () => (
  <ResourcePage config={{
    title: 'Content Block', addLabel: 'Block', endpoint: '/admin/website-content', permission: 'website_content',
    subtitle: 'Editable hero/section content used across the site.',
    columns: [{ key: 'key', header: 'Key', render: title('key') }, { key: 'page', header: 'Page' }, { key: 'label', header: 'Label' }],
    fields: [{ name: 'key', label: 'Key', hint: 'e.g. home.hero' }, { name: 'page', label: 'Page', hint: 'e.g. home' }, { name: 'label', label: 'Label' }, { name: 'data', label: 'Data (JSON)', type: 'json' }],
  }} />
)

/* ── Navigation & footer ────────────────────────────── */
export const NavigationPage = () => (
  <ResourcePage config={{
    title: 'Navigation Item', addLabel: 'Item', endpoint: '/admin/navigation', permission: 'navigation', searchable: false,
    columns: [{ key: 'label', header: 'Label', render: title('label') }, { key: 'href', header: 'Link' }, { key: 'location', header: 'Location', render: (r) => <Badge tone="gray">{r.location}</Badge> }, { key: 'order', header: 'Order' }, { key: 'visible', header: 'Visible', render: (r) => (r.visible ? '✅' : '—') }],
    fields: [
      { name: 'label', label: 'Label' }, { name: 'href', label: 'Link (href)' },
      { name: 'location', label: 'Location', type: 'select', default: 'header', options: [{ value: 'header', label: 'Header' }, { value: 'features_menu', label: 'Features menu' }, { value: 'business_nav', label: 'Business nav' }] },
      { name: 'order', label: 'Order', type: 'number', default: 0 }, { name: 'visible', label: 'Visible', type: 'checkbox', default: true },
    ],
  }} />
)
export const FooterPage = () => (
  <ResourcePage config={{
    title: 'Footer Section', addLabel: 'Section', endpoint: '/admin/footer-sections', permission: 'footer', searchable: false,
    subtitle: 'Footer column titles. Manage links per section via the API/links endpoint.',
    columns: [{ key: 'title', header: 'Title', render: title('title') }, { key: 'order', header: 'Order' }, { key: 'links', header: 'Links', render: (r) => (r.links?.length || 0) + ' links' }],
    fields: [{ name: 'title', label: 'Title' }, { name: 'order', label: 'Order', type: 'number', default: 0 }],
  }} />
)

/* ── Locales ────────────────────────────────────────── */
export const LocalesPage = () => (
  <ResourcePage config={{
    title: 'Locale', addLabel: 'Locale', endpoint: '/admin/locales', permission: 'locale', idKey: 'code', searchable: false,
    columns: [{ key: 'code', header: 'Code', render: title('code') }, { key: 'label', header: 'Label' }, { key: 'enabled', header: 'Enabled', render: (r) => (r.enabled ? '✅' : '—') }, { key: 'isDefault', header: 'Default', render: (r) => (r.isDefault ? '⭐' : '—') }],
    fields: [{ name: 'code', label: 'Code', hint: 'e.g. en-US' }, { name: 'label', label: 'Label' }, { name: 'enabled', label: 'Enabled', type: 'checkbox', default: true }, { name: 'isDefault', label: 'Default locale', type: 'checkbox' }],
  }} />
)

/* ── Read-mostly: subscribers / contact / feedback / audit ── */
export const SubscribersPage = () => (
  <ResourcePage config={{
    title: 'Subscriber', endpoint: '/admin/subscribers', permission: 'subscriber', disableCreate: true,
    subtitle: 'Newsletter & download-CTA email captures.',
    columns: [{ key: 'email', header: 'Email', render: title('email') }, { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> }, { key: 'sourcePage', header: 'Source' }, { key: 'createdAt', header: 'Joined', render: (r) => fmtDate(r.createdAt) }],
    fields: [{ name: 'status', label: 'Status', type: 'select', options: [{ value: 'SUBSCRIBED', label: 'Subscribed' }, { value: 'UNSUBSCRIBED', label: 'Unsubscribed' }] }],
  }} />
)
// ContactMessagesPage now lives in its own file (adds reply-to-sender support).
export const FeedbackPage = () => (
  <ResourcePage config={{
    title: 'Feedback', endpoint: '/admin/feedback', permission: 'feedback', disableCreate: true, disableEdit: true,
    subtitle: '"Was this article helpful?" responses from the Help Center.',
    columns: [
      { key: 'vote', header: 'Vote', render: (r) => <StatusBadge status={r.vote} /> },
      { key: 'article', header: 'Article', render: (r) => r.article?.title || r.pagePath || '—' },
      { key: 'comment', header: 'Comment' },
      { key: 'createdAt', header: 'When', render: (r) => fmtDate(r.createdAt) },
    ],
    fields: [],
  }} />
)
export const AuditLogPage = () => (
  <ResourcePage config={{
    title: 'Audit Log', endpoint: '/admin/audit-logs', permission: 'audit_log', disableCreate: true, disableEdit: true, disableDelete: true,
    subtitle: 'Record of sensitive admin actions.',
    columns: [
      { key: 'action', header: 'Action', render: title('action') },
      { key: 'entity', header: 'Entity' },
      { key: 'admin', header: 'By', render: (r) => r.admin?.name || 'System' },
      { key: 'createdAt', header: 'When', render: (r) => fmtDate(r.createdAt) },
    ],
    fields: [],
  }} />
)

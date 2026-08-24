// Central catalog of permissions and the default role presets.
// Backend authorization checks these keys; the seed script creates them.

const RESOURCES = {
  dashboard: ['read'],
  blog: ['read', 'write', 'delete', 'publish'],
  blog_category: ['read', 'write', 'delete'],
  blog_tag: ['read', 'write', 'delete'],
  help: ['read', 'write', 'delete', 'publish'],
  faq: ['read', 'write', 'delete'],
  success_story: ['read', 'write', 'delete', 'publish'],
  app_release: ['read', 'write', 'delete'],
  website_content: ['read', 'write'],
  navigation: ['read', 'write'],
  footer: ['read', 'write'],
  media: ['read', 'write', 'delete'],
  subscriber: ['read', 'write', 'delete', 'export'],
  contact: ['read', 'write', 'delete'],
  feedback: ['read', 'delete'],
  analytics: ['read'],
  locale: ['read', 'write'],
  admin_user: ['read', 'write', 'delete'],
  role: ['read', 'write', 'delete'],
  audit_log: ['read'],
}

export const ALL_PERMISSIONS = Object.entries(RESOURCES).flatMap(([resource, actions]) =>
  actions.map((action) => ({ key: `${resource}:${action}`, description: `${action} ${resource.replace(/_/g, ' ')}` })),
)

export const ALL_PERMISSION_KEYS = ALL_PERMISSIONS.map((p) => p.key)

const keysFor = (...resources) => ALL_PERMISSION_KEYS.filter((k) => resources.includes(k.split(':')[0]))

// name -> { description, isSystem, permissions }
export const ROLE_PRESETS = {
  super_admin: {
    description: 'Full, unrestricted access to everything.',
    isSystem: true,
    permissions: ALL_PERMISSION_KEYS, // also bypassed in code
  },
  admin: {
    description: 'Broad management access to content, media, forms and analytics.',
    isSystem: true,
    permissions: ALL_PERMISSION_KEYS.filter((k) => !['admin_user', 'role'].includes(k.split(':')[0])),
  },
  editor: {
    description: 'Manage blogs, help center and FAQs.',
    isSystem: true,
    permissions: [
      'dashboard:read',
      ...keysFor('blog', 'blog_category', 'blog_tag', 'help', 'faq'),
      'media:read', 'media:write',
    ],
  },
  support: {
    description: 'Handle help center content, contact messages and feedback.',
    isSystem: true,
    permissions: ['dashboard:read', 'help:read', 'contact:read', 'contact:write', 'feedback:read', 'media:read'],
  },
  marketing: {
    description: 'Manage blogs, success stories, marketing content and view analytics.',
    isSystem: true,
    permissions: [
      'dashboard:read',
      ...keysFor('blog', 'success_story', 'website_content'),
      'media:read', 'media:write', 'analytics:read',
    ],
  },
}

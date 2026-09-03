import React, { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { Icon } from '../components/Icon.jsx'

const NAV = [
  {
    group: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: 'dashboard', perm: 'dashboard:read', end: true }],
  },
  {
    group: 'Content',
    items: [
      { to: '/blogs', label: 'Blogs', icon: 'blogs', perm: 'blog:read' },
      { to: '/blog-categories', label: 'Blog Categories', icon: 'categories', perm: 'blog_category:read' },
      { to: '/blog-tags', label: 'Blog Tags', icon: 'tags', perm: 'blog_tag:read' },
      { to: '/help', label: 'Help Center', icon: 'help', perm: 'help:read' },
      { to: '/faqs', label: 'FAQs', icon: 'faqs', perm: 'faq:read' },
      { to: '/success-stories', label: 'Success Stories', icon: 'success', perm: 'success_story:read' },
      { to: '/app-releases', label: 'App Releases', icon: 'releases', perm: 'app_release:read' },
    ],
  },
  {
    group: 'Site',
    items: [
      { to: '/website-content', label: 'Website Content', icon: 'content', perm: 'website_content:read' },
      { to: '/navigation', label: 'Navigation', icon: 'navigation', perm: 'navigation:read' },
      { to: '/footer', label: 'Footer', icon: 'footer', perm: 'footer:read' },
      { to: '/locales', label: 'Locales', icon: 'locales', perm: 'locale:read' },
      { to: '/media', label: 'Media', icon: 'media', perm: 'media:read' },
    ],
  },
  {
    group: 'Engagement',
    items: [
      { to: '/subscribers', label: 'Subscribers', icon: 'subscribers', perm: 'subscriber:read' },
      { to: '/contact', label: 'Contact Messages', icon: 'contact', perm: 'contact:read', badge: '3' },
      { to: '/feedback', label: 'Feedback', icon: 'feedback', perm: 'feedback:read' },
      { to: '/analytics', label: 'Analytics', icon: 'analytics', perm: 'analytics:read' },
    ],
  },
  {
    group: 'System',
    items: [
      { to: '/admins', label: 'Admin Users', icon: 'admins', perm: 'admin_user:read' },
      { to: '/roles', label: 'Roles & Permissions', icon: 'roles', perm: 'role:read' },
      { to: '/audit', label: 'Audit Log', icon: 'audit', perm: 'audit_log:read' },
      { to: '/email-settings', label: 'Email Settings', icon: 'emailSettings', perm: null },
      { to: '/profile', label: 'My Profile', icon: 'profile', perm: null },
    ],
  },
]

export function AdminLayout() {
  const { admin, logout, can } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Light / dark theme, persisted per browser. Applied to <html data-theme>.
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('kt_admin_theme') || 'light'
    } catch {
      return 'light'
    }
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('kt_admin_theme', theme)
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }, [theme])
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const initials = (admin?.name || 'A')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="admin-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-left">
            <span className="mark">KT</span>
            <span className="name">
              KT <span>Admin</span>
            </span>
          </div>
        </div>

        {NAV.map((section) => {
          const items = section.items.filter((i) => !i.perm || can(i.perm))
          if (!items.length) return null
          return (
            <div key={section.group}>
              <div className="group-label">{section.group}</div>
              {items.map((i) => (
                <NavLink
                  key={i.to}
                  to={i.to}
                  end={i.end}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon name={i.icon} size={18} />
                  <span>{i.label}</span>
                  {i.badge && <span className="badge-pill">{i.badge}</span>}
                </NavLink>
              ))}
            </div>
          )
        })}
      </aside>

      <div className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="icon-btn" onClick={() => setOpen((v) => !v)} id="menu-toggle" aria-label="Toggle Menu">
              <Icon name="dashboard" size={18} />
            </button>

            <div className="search-box">
              <Icon name="search" size={16} color="var(--muted)" />
              <input
                type="text"
                placeholder="Search dashboard, blogs, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="kbd">Ctrl K</span>
            </div>
          </div>

          <div className="right-nav">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>

            <button className="icon-btn bell-btn" title="Notifications">
              <Icon name="bell" size={18} />
              <span className="bell-dot" />
            </button>

            <div className="who">
              <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 13.5 }}>{admin?.name || 'Super Admin'}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', textTransform: 'capitalize' }}>{admin?.role || 'super_admin'}</div>
              </div>
              <div className="avatar">{initials}</div>
              <button className="btn ghost sm" onClick={logout} title="Sign Out">
                <Icon name="logout" size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

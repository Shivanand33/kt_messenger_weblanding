import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { Icon } from '../components/Icon.jsx'
import api from '../api/client.js'
import './AdminLayout.css'

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
      { to: '/homepage-hero', label: 'Homepage Hero', icon: 'media', perm: 'website_content:read' },
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
      // The badge is the live count of unread contact messages, not a constant.
      { to: '/contact', label: 'Contact Messages', icon: 'contact', perm: 'contact:read', badge: 'unread' },
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

const NOTIFICATION_POLL_MS = 60000
const SEARCH_DEBOUNCE_MS = 250

// "2h ago" / "3d ago" — good enough for a dropdown, no date library needed.
function timeAgo(value) {
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(value).toLocaleDateString()
}

// Close a popover when the pointer goes down anywhere outside it.
function useClickOutside(ref, onOutside, active) {
  useEffect(() => {
    if (!active) return undefined
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside, active])
}

/* ── Command palette ──────────────────────────────────────────────────────
   Opens with Ctrl/Cmd+K or by clicking the top-bar search box. Matches admin
   pages locally and everything else through GET /admin/search, which only
   returns resources this admin is allowed to read.                        */
function CommandPalette({ open, onClose, navItems }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const [query, setQuery] = useState('')
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [cursor, setCursor] = useState(0)

  // Pages that match, straight from the sidebar definition.
  const pageMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return navItems.slice(0, 6)
    return navItems.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 6)
  }, [query, navItems])

  // Debounced remote search. A stale response can outrun a newer one, so each
  // request records the term it was fired for and only the current one lands.
  useEffect(() => {
    if (!open) return undefined
    const q = query.trim()
    if (q.length < 2) {
      setGroups([])
      setLoading(false)
      setFailed(false)
      return undefined
    }
    setLoading(true)
    let cancelled = false
    const timer = setTimeout(() => {
      api
        .get('/admin/search', { params: { q } })
        .then((res) => {
          if (cancelled) return
          setGroups(res.data.data.groups || [])
          setFailed(false)
        })
        .catch(() => {
          if (cancelled) return
          setGroups([])
          setFailed(true)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, open])

  // One flat list behind the grouped display, so the arrow keys can walk it.
  const flat = useMemo(() => {
    const rows = pageMatches.map((p) => ({ key: `page:${p.to}`, to: p.to, title: p.label, group: 'Pages' }))
    for (const g of groups) {
      for (const item of g.items) {
        rows.push({ key: `${g.type}:${item.id}`, to: item.to, title: item.title, group: g.label })
      }
    }
    return rows
  }, [pageMatches, groups])

  useEffect(() => setCursor(0), [query])

  // Remote results arriving (or disappearing) can leave the cursor past the
  // end of the list, which would make Enter a no-op. Keep it in range.
  useEffect(() => {
    setCursor((c) => (flat.length === 0 ? 0 : Math.min(c, flat.length - 1)))
  }, [flat.length])

  useEffect(() => {
    if (open) {
      setQuery('')
      setGroups([])
      setCursor(0)
      setFailed(false)
      // Focus after paint, otherwise the element is not in the DOM yet.
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
    return undefined
  }, [open])

  // Keep the highlighted row inside the scroll viewport.
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor, flat.length])

  const go = useCallback(
    (to) => {
      if (!to) return
      onClose()
      navigate(to)
    },
    [navigate, onClose],
  )

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (flat.length ? (c + 1) % flat.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (flat.length ? (c - 1 + flat.length) % flat.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(flat[cursor]?.to)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!open) return null

  const showEmpty = !loading && query.trim().length >= 2 && flat.length === 0
  let flatIndex = -1

  return (
    <div className="cmdk-backdrop" onMouseDown={onClose} role="presentation">
      <div
        className="cmdk-panel"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search the admin panel"
      >
        <div className="cmdk-input-row">
          <Icon name="search" size={18} color="var(--muted)" />
          <input
            ref={inputRef}
            className="cmdk-input"
            type="text"
            placeholder="Search pages, blogs, help articles, messages, subscribers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Search query"
          />
          {loading && <span className="cmdk-spinner" aria-label="Searching" />}
          <button className="cmdk-esc" onClick={onClose} type="button" aria-label="Close search">
            Esc
          </button>
        </div>

        <div className="cmdk-results" ref={listRef}>
          {pageMatches.length > 0 && (
            <div className="cmdk-group">
              <div className="cmdk-group-label">Pages</div>
              {pageMatches.map((p) => {
                flatIndex += 1
                const active = flatIndex === cursor
                const myIndex = flatIndex
                return (
                  <button
                    key={`page:${p.to}`}
                    type="button"
                    className={`cmdk-row ${active ? 'active' : ''}`}
                    data-active={active}
                    onMouseEnter={() => setCursor(myIndex)}
                    onClick={() => go(p.to)}
                  >
                    <span className="cmdk-row-icon">
                      <Icon name={p.icon} size={16} />
                    </span>
                    <span className="cmdk-row-text">
                      <span className="cmdk-row-title">{p.label}</span>
                    </span>
                    <span className="cmdk-row-hint">Page</span>
                  </button>
                )
              })}
            </div>
          )}

          {groups.map((g) => (
            <div className="cmdk-group" key={g.type}>
              <div className="cmdk-group-label">{g.label}</div>
              {g.items.map((item) => {
                flatIndex += 1
                const active = flatIndex === cursor
                const myIndex = flatIndex
                return (
                  <button
                    key={`${g.type}:${item.id}`}
                    type="button"
                    className={`cmdk-row ${active ? 'active' : ''}`}
                    data-active={active}
                    onMouseEnter={() => setCursor(myIndex)}
                    onClick={() => go(item.to)}
                  >
                    <span className="cmdk-row-icon">
                      <Icon name={g.icon} size={16} />
                    </span>
                    <span className="cmdk-row-text">
                      <span className="cmdk-row-title">{item.title}</span>
                      {item.subtitle && <span className="cmdk-row-sub">{item.subtitle}</span>}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}

          {query.trim().length > 0 && query.trim().length < 2 && (
            <div className="cmdk-empty">Keep typing — at least 2 characters.</div>
          )}
          {failed && <div className="cmdk-empty">Search is unavailable right now.</div>}
          {showEmpty && !failed && (
            <div className="cmdk-empty">
              No results for “{query.trim()}”.
            </div>
          )}
        </div>

        <div className="cmdk-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const { admin, logout, can } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState({ unreadCount: 0, items: [], loaded: false, failed: false })

  const notifRef = useRef(null)
  const menuRef = useRef(null)
  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen)
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen)

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

  // Live notification feed. Polled so the bell stays honest without a reload.
  const loadNotifications = useCallback(() => {
    api
      .get('/admin/notifications')
      .then((res) => {
        const d = res.data.data
        setNotifications({ unreadCount: d.unreadCount || 0, items: d.items || [], loaded: true, failed: false })
      })
      .catch(() => setNotifications((n) => ({ ...n, loaded: true, failed: true })))
  }, [])

  useEffect(() => {
    loadNotifications()
    const id = setInterval(loadNotifications, NOTIFICATION_POLL_MS)
    return () => clearInterval(id)
  }, [loadNotifications])

  // Global Ctrl/Cmd+K opens the palette from anywhere in the admin.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && String(e.key || '').toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Any navigation closes every popover.
  useEffect(() => {
    setNotifOpen(false)
    setMenuOpen(false)
    setOpen(false)
  }, [location.pathname])

  const initials = (admin?.name || 'A')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Flattened, permission-filtered page list for the palette.
  const navItems = useMemo(
    () => NAV.flatMap((s) => s.items).filter((i) => !i.perm || can(i.perm)),
    [can],
  )

  const openNotifications = () => {
    setMenuOpen(false)
    setNotifOpen((v) => {
      if (!v) loadNotifications()
      return !v
    })
  }

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
              {items.map((i) => {
                // Only the unread-messages badge exists today, and it is a real count.
                const badgeValue = i.badge === 'unread' ? notifications.unreadCount : null
                return (
                  <NavLink
                    key={i.to}
                    to={i.to}
                    end={i.end}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon name={i.icon} size={18} />
                    <span>{i.label}</span>
                    {badgeValue > 0 && <span className="badge-pill">{badgeValue}</span>}
                  </NavLink>
                )
              })}
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

            <button
              type="button"
              className="search-box search-trigger"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search the admin panel"
            >
              <Icon name="search" size={16} color="var(--muted)" />
              <span className="search-trigger-text">Search dashboard, blogs, users...</span>
              <span className="kbd">Ctrl K</span>
            </button>
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

            <div className="popover-wrap" ref={notifRef}>
              <button
                className="icon-btn bell-btn"
                title="Notifications"
                onClick={openNotifications}
                aria-haspopup="true"
                aria-expanded={notifOpen}
                aria-label={
                  notifications.unreadCount > 0
                    ? `Notifications, ${notifications.unreadCount} unread`
                    : 'Notifications'
                }
              >
                <Icon name="bell" size={18} />
                {notifications.unreadCount > 0 && (
                  <span className="bell-count">{notifications.unreadCount > 9 ? '9+' : notifications.unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <div className="popover notif-popover" role="menu">
                  <div className="popover-head">
                    <span className="popover-title">Notifications</span>
                    {notifications.unreadCount > 0 && (
                      <span className="popover-count">{notifications.unreadCount} unread</span>
                    )}
                  </div>

                  <div className="popover-body">
                    {!notifications.loaded && <div className="popover-empty">Loading…</div>}
                    {notifications.loaded && notifications.failed && (
                      <div className="popover-empty">Could not load notifications.</div>
                    )}
                    {notifications.loaded && !notifications.failed && notifications.items.length === 0 && (
                      <div className="popover-empty">You are all caught up.</div>
                    )}
                    {notifications.items.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        className={`notif-row ${n.unread ? 'unread' : ''}`}
                        onClick={() => {
                          setNotifOpen(false)
                          navigate(n.to)
                        }}
                      >
                        <span className="notif-icon">
                          <Icon name={n.icon} size={15} />
                        </span>
                        <span className="notif-text">
                          <span className="notif-title">{n.title}</span>
                          {n.body && <span className="notif-body">{n.body}</span>}
                          <span className="notif-time">{timeAgo(n.createdAt)}</span>
                        </span>
                        {n.unread && <span className="notif-dot" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>

                  {can('contact:read') && (
                    <button
                      type="button"
                      className="popover-foot-link"
                      onClick={() => {
                        setNotifOpen(false)
                        navigate('/contact')
                      }}
                    >
                      View all messages
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="who popover-wrap" ref={menuRef}>
              <button
                type="button"
                className="who-trigger"
                onClick={() => {
                  setNotifOpen(false)
                  setMenuOpen((v) => !v)
                }}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="Account menu"
              >
                <span style={{ textAlign: 'right', lineHeight: 1.2 }}>
                  <span style={{ display: 'block', fontWeight: 700, color: 'var(--ink)', fontSize: 13.5 }}>
                    {admin?.name || 'Admin'}
                  </span>
                  <span style={{ display: 'block', fontSize: 11.5, color: 'var(--muted)', textTransform: 'capitalize' }}>
                    {admin?.role || ''}
                  </span>
                </span>
                <span className="avatar">{initials}</span>
                <Icon name="chevronDown" size={15} color="var(--muted)" />
              </button>

              {menuOpen && (
                <div className="popover account-popover" role="menu">
                  <div className="account-head">
                    <span className="avatar lg">{initials}</span>
                    <span className="account-id">
                      <span className="account-name">{admin?.name || 'Admin'}</span>
                      {admin?.email && <span className="account-email">{admin.email}</span>}
                      {admin?.role && <span className="account-role">{admin.role.replace(/_/g, ' ')}</span>}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="account-item"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/profile')
                    }}
                  >
                    <Icon name="profile" size={16} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    className="account-item"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/email-settings')
                    }}
                  >
                    <Icon name="emailSettings" size={16} />
                    <span>Email Settings</span>
                  </button>

                  <button type="button" className="account-item" onClick={toggleTheme}>
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
                    <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                  </button>

                  <div className="account-sep" />

                  <button type="button" className="account-item danger" onClick={logout}>
                    <Icon name="logout" size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button className="btn ghost sm logout-btn" onClick={logout} title="Sign Out">
              <Icon name="logout" size={15} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} navItems={navItems} />
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'

export function AboutPageAdmin() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Default values matching current page
  const [form, setForm] = useState({
    h1Title: 'About KT Messenger',
    h1Subheading: 'Stay Connected. Communicate Freely.',
    p1Text: 'Available in over 180 countries, KT Messenger provides users a combination of fast messaging, HD voice calls and video calls, instant message translation, and easy file and media sharing in one single application. KT Messenger allows its users to send instant messages, share photos, videos, send documents and contact files, share location, and send voice messages. Its in-app translation tools allow users to converse and transact with individuals of other languages making conversations more inclusive.',
    h2Title: 'One Messenger, Many Ways to Connect',
    p2Text: 'KT Messenger incorporates the most popular formats of personal and business communication. Whether for a private chat, phone/video conversation, file sharing or communicating translation services, KT Messenger provides users all of these tools to enhance global communication and reduce barriers.',
    h3Title: 'Connecting People Globally',
    p3Text: 'As an application that started with simple messaging, KT Messenger has grown to become a global communication platform. After displaying over 1 Million Google Play app downloads and after becoming available in over 180 countries and regions, KT Messenger has become a tool for people to communicate with each other.',
    seoTitle: 'About KT Messenger | Connecting People Worldwide.',
    seoDescription: 'Available in over 180 countries, KT Messenger provides users a combination of fast messaging, HD voice calls and video calls, instant message translation, and easy file and media sharing.'
  })

  useEffect(() => {
    api
      .get('/admin/website-content', { params: { page: 'about' } })
      .then((res) => {
        const items = res.data.data?.items || res.data.data || []
        const contentBlock = items.find((i) => i.key === 'about.content')
        if (contentBlock && contentBlock.data) {
          setForm((prev) => ({ ...prev, ...contentBlock.data }))
        }
      })
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Find existing block or create
      const res = await api.get('/admin/website-content', { params: { key: 'about.content' } })
      const items = res.data.data?.items || res.data.data || []
      const existing = items.find((i) => i.key === 'about.content')

      if (existing) {
        await api.put(`/admin/website-content/${existing.id}`, {
          key: 'about.content',
          page: 'about',
          label: 'About Page Complete Content',
          data: form
        })
      } else {
        await api.post('/admin/website-content', {
          key: 'about.content',
          page: 'about',
          label: 'About Page Complete Content',
          data: form
        })
      }
      toast.success('About page updated successfully!')
    } catch (e) {
      toast.error(errorMessage(e, 'Failed to update About page'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading About page settings..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="About Page Management"
        subtitle="Manage the exact headings (H1, H2, H3), lead text, paragraphs, and SEO settings for the About page."
        actions={
          <button className="btn primary" onClick={handleSave} disabled={saving}>
            <Icon name="check" size={16} />
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
          </button>
        }
      />

      <div className="grid gap-6">
        {/* H1 SECTION */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="badge-pill" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>H1 Section</span>
            <h3 className="font-extrabold text-base">Hero & H1 Heading Settings</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">H1 Title</label>
              <input
                type="text"
                name="h1Title"
                className="input w-full"
                value={form.h1Title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">H1 Subheading / Lead</label>
              <input
                type="text"
                name="h1Subheading"
                className="input w-full"
                value={form.h1Subheading}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="label">Paragraph 1 Text (Main Description)</label>
            <textarea
              name="p1Text"
              className="textarea w-full"
              rows={4}
              value={form.p1Text}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* H2 SECTION */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="badge-pill" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>H2 Section</span>
            <h3 className="font-extrabold text-base">Features & Ways to Connect</h3>
          </div>

          <div>
            <label className="label">H2 Title</label>
            <input
              type="text"
              name="h2Title"
              className="input w-full"
              value={form.h2Title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Paragraph 2 Text</label>
            <textarea
              name="p2Text"
              className="textarea w-full"
              rows={3}
              value={form.p2Text}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* H3 SECTION */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="badge-pill" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>H3 Section</span>
            <h3 className="font-extrabold text-base">Global Impact</h3>
          </div>

          <div>
            <label className="label">H3 Title</label>
            <input
              type="text"
              name="h3Title"
              className="input w-full"
              value={form.h3Title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Paragraph 3 Text</label>
            <textarea
              name="p3Text"
              className="textarea w-full"
              rows={3}
              value={form.p3Text}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SEO SECTION */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <span className="badge-pill">SEO</span>
            <h3 className="font-extrabold text-base">Page SEO & Meta Tags</h3>
          </div>

          <div>
            <label className="label">Meta Title</label>
            <input
              type="text"
              name="seoTitle"
              className="input w-full"
              value={form.seoTitle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Meta Description</label>
            <textarea
              name="seoDescription"
              className="textarea w-full"
              rows={2}
              value={form.seoDescription}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

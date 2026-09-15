import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'

// Keeps the "H1 / H2 / H3" tag on the same baseline as its section title.
const SECTION_TITLE = { display: 'flex', alignItems: 'center', gap: 8 }

export function AboutPageAdmin() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contentBlockId, setContentBlockId] = useState(null)
  const [seoBlockId, setSeoBlockId] = useState(null)

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
    // Body copy lives in `about.content`; the two SEO fields drive `seo.about`,
    // which is the block useAdminSeo() actually reads on the public page.
    Promise.all([
      api.get('/admin/website-content', { params: { key: 'about.content' } }),
      api.get('/admin/website-content', { params: { key: 'seo.about' } })
    ])
      .then(([contentRes, seoRes]) => {
        const contentItems = contentRes.data.data?.items || contentRes.data.data || []
        const contentBlock = contentItems.find((i) => i.key === 'about.content')
        if (contentBlock) {
          setContentBlockId(contentBlock.id)
          if (contentBlock.data) setForm((prev) => ({ ...prev, ...contentBlock.data }))
        }

        const seoItems = seoRes.data.data?.items || seoRes.data.data || []
        const seoBlock = seoItems.find((i) => i.key === 'seo.about')
        if (seoBlock) {
          setSeoBlockId(seoBlock.id)
          if (seoBlock.data) {
            setForm((prev) => ({
              ...prev,
              seoTitle: seoBlock.data.title || prev.seoTitle,
              seoDescription: seoBlock.data.description || prev.seoDescription
            }))
          }
        }
      })
      .catch((e) => toast.error(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Create the block on first save, update it every time after — looking it up
  // again by key when the id is not in state yet.
  const upsertBlock = async (key, label, page, data, knownId, setId) => {
    let id = knownId
    if (!id) {
      const res = await api.get('/admin/website-content', { params: { key } })
      const items = res.data.data?.items || res.data.data || []
      id = items.find((i) => i.key === key)?.id || null
    }
    const payload = { key, page, label, data }
    const res = id
      ? await api.put(`/admin/website-content/${id}`, payload)
      : await api.post('/admin/website-content', payload)
    setId(res.data?.data?.id || id)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { seoTitle, seoDescription, ...content } = form

      await upsertBlock('about.content', 'About Page Complete Content', 'about', content, contentBlockId, setContentBlockId)
      await upsertBlock(
        'seo.about',
        'About Page SEO',
        'seo',
        { title: seoTitle, description: seoDescription },
        seoBlockId,
        setSeoBlockId
      )

      toast.success('About page updated successfully!')
    } catch (e) {
      toast.error(errorMessage(e, 'Failed to update About page'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading About page settings..." />

  return (
    <>
      <PageHeader
        title="About Page Management"
        subtitle="Headings, lead text, paragraphs and SEO for the public /about page."
        actions={
          <button className="btn primary" onClick={handleSave} disabled={saving}>
            <Icon name="check" size={16} />
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
          </button>
        }
      />

      <div className="grid">
        {/* H1 SECTION */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-head-text">
              <h3 style={SECTION_TITLE}>
                <span className="badge blue">H1</span> Hero &amp; Heading
              </h3>
              <p>Top of the page — main heading, lead line and opening paragraph.</p>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="h1Title">H1 Title</label>
              <input id="h1Title" type="text" name="h1Title" className="input" value={form.h1Title} onChange={handleChange} />
            </div>

            <div className="field">
              <label htmlFor="h1Subheading">H1 Subheading / Lead</label>
              <input id="h1Subheading" type="text" name="h1Subheading" className="input" value={form.h1Subheading} onChange={handleChange} />
            </div>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="p1Text">Paragraph 1 — Main Description</label>
            <textarea id="p1Text" name="p1Text" className="textarea" rows={5} value={form.p1Text} onChange={handleChange} />
          </div>
        </div>

        {/* H2 SECTION */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-head-text">
              <h3 style={SECTION_TITLE}>
                <span className="badge blue">H2</span> Features &amp; Ways to Connect
              </h3>
              <p>Second section of the page.</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="h2Title">H2 Title</label>
            <input id="h2Title" type="text" name="h2Title" className="input" value={form.h2Title} onChange={handleChange} />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="p2Text">Paragraph 2 Text</label>
            <textarea id="p2Text" name="p2Text" className="textarea" rows={4} value={form.p2Text} onChange={handleChange} />
          </div>
        </div>

        {/* H3 SECTION */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-head-text">
              <h3 style={SECTION_TITLE}>
                <span className="badge blue">H3</span> Global Impact
              </h3>
              <p>Closing section of the page.</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="h3Title">H3 Title</label>
            <input id="h3Title" type="text" name="h3Title" className="input" value={form.h3Title} onChange={handleChange} />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="p3Text">Paragraph 3 Text</label>
            <textarea id="p3Text" name="p3Text" className="textarea" rows={4} value={form.p3Text} onChange={handleChange} />
          </div>
        </div>

        {/* SEO SECTION */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-head-text">
              <h3 style={SECTION_TITLE}>
                <span className="badge amber">SEO</span> Search &amp; Meta Tags
              </h3>
              <p>Browser tab title and the snippet Google shows for /about.</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="seoTitle">Meta Title</label>
            <input id="seoTitle" type="text" name="seoTitle" className="input" value={form.seoTitle} onChange={handleChange} />
            <span className="hint">{form.seoTitle.length} characters — around 60 keeps it from being cut off in search results.</span>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="seoDescription">Meta Description</label>
            <textarea id="seoDescription" name="seoDescription" className="textarea" rows={3} style={{ minHeight: 88 }} value={form.seoDescription} onChange={handleChange} />
            <span className="hint">{form.seoDescription.length} characters — around 155 is the usual limit.</span>
          </div>
        </div>
      </div>
    </>
  )
}

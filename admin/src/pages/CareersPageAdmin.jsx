import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'
import { Modal } from '../components/Modal.jsx'

const STATUS_TONE = { PUBLISHED: 'green', DRAFT: 'amber', ARCHIVED: 'gray' }

export function CareersPageAdmin() {
  const toast = useToast()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  // Id of the `careers.hero` content block, so every save after the first one
  // updates that row instead of trying to create a duplicate (key+locale is
  // unique, so a second create would be rejected).
  const [heroBlockId, setHeroBlockId] = useState(null)

  // Hero & Culture settings
  const [heroForm, setHeroForm] = useState({
    badge: 'Join our team 🚀',
    title: 'Build the future of private communication',
    subtitle: 'We are looking for passionate engineers, designers, and thinkers to help us build a more open, secure world.',
    cultureTitle: 'Our Culture & Values',
    cultureDesc: 'Remote-first, privacy-focused, and committed to high performance software.'
  })

  // Job Opening form
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
    description: '',
    status: 'PUBLISHED',
    order: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [jobsRes, contentRes] = await Promise.all([
        // The list endpoint pages at 10 by default, which would silently hide
        // the 11th job onwards from this screen.
        api.get('/admin/job-openings', { params: { pageSize: 100 } }),
        api.get('/admin/website-content', { params: { key: 'careers.hero' } })
      ])

      const fetchedJobs = jobsRes.data.data?.items || jobsRes.data.data || []
      setJobs(fetchedJobs)

      const items = contentRes.data.data?.items || contentRes.data.data || []
      const heroBlock = items.find((i) => i.key === 'careers.hero')
      if (heroBlock) {
        setHeroBlockId(heroBlock.id)
        if (heroBlock.data) setHeroForm((prev) => ({ ...prev, ...heroBlock.data }))
      }
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const handleHeroSave = async () => {
    setSaving(true)
    try {
      let id = heroBlockId
      if (!id) {
        const contentRes = await api.get('/admin/website-content', { params: { key: 'careers.hero' } })
        const items = contentRes.data.data?.items || contentRes.data.data || []
        id = items.find((i) => i.key === 'careers.hero')?.id || null
      }

      const payload = {
        key: 'careers.hero',
        page: 'careers',
        label: 'Careers Hero Content',
        data: heroForm
      }
      const res = id
        ? await api.put(`/admin/website-content/${id}`, payload)
        : await api.post('/admin/website-content', payload)

      setHeroBlockId(res.data?.data?.id || id)
      toast.success('Careers hero text saved!')
    } catch (e) {
      toast.error(errorMessage(e, 'Failed to save hero text'))
    } finally {
      setSaving(false)
    }
  }

  const openCreateModal = () => {
    setEditingJob(null)
    setJobForm({
      title: '',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: '',
      status: 'PUBLISHED',
      order: jobs.length + 1
    })
    setShowModal(true)
  }

  const openEditModal = (job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title || '',
      department: job.department || 'Engineering',
      location: job.location || 'Remote',
      type: job.type || 'Full-time',
      experience: job.experience || '',
      description: job.description || '',
      status: job.status || 'PUBLISHED',
      order: job.order || 0
    })
    setShowModal(true)
  }

  const handleSaveJob = async (e) => {
    e.preventDefault()
    if (!jobForm.title.trim() || !jobForm.department.trim()) {
      toast.error('Title and Department are required')
      return
    }

    setSaving(true)
    try {
      if (editingJob) {
        await api.put(`/admin/job-openings/${editingJob.id}`, jobForm)
        toast.success('Job posting updated!')
      } else {
        await api.post('/admin/job-openings', jobForm)
        toast.success('Job posting created!')
      }
      setShowModal(false)
      loadData()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to save job opening'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return
    try {
      await api.delete(`/admin/job-openings/${id}`)
      toast.success('Job posting deleted!')
      loadData()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete job opening'))
    }
  }

  if (loading) return <Loading label="Loading Careers management..." />

  return (
    <>
      <PageHeader
        title="Careers Management"
        subtitle="Manage open positions, job descriptions, departments, and hero banner content for the Careers page."
        actions={
          <button className="btn primary" onClick={openCreateModal}>
            <Icon name="plus" size={16} />
            <span>Add Job Opening</span>
          </button>
        }
      />

      <div className="grid">
        {/* HERO & HEADER SECTION */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-head-text">
              <h3>Careers Hero &amp; Header Settings</h3>
              <p>The banner at the top of the public /careers page.</p>
            </div>
            <div className="card-head-actions">
              <button className="btn primary sm" onClick={handleHeroSave} disabled={saving}>
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving…' : 'Save Banner Text'}</span>
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="hero-badge">Badge Pill</label>
              <input
                id="hero-badge"
                type="text"
                className="input"
                value={heroForm.badge}
                onChange={(e) => setHeroForm((p) => ({ ...p, badge: e.target.value }))}
              />
              <span className="hint">Small pill shown above the heading.</span>
            </div>

            <div className="field">
              <label htmlFor="hero-title">Headline</label>
              <input
                id="hero-title"
                type="text"
                className="input"
                value={heroForm.title}
                onChange={(e) => setHeroForm((p) => ({ ...p, title: e.target.value }))}
              />
              <span className="hint">Replaces the default “Careers at KT Messenger” heading. Leave empty to keep the default.</span>
            </div>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="hero-subtitle">Subtitle Description</label>
            <textarea
              id="hero-subtitle"
              className="textarea"
              rows={3}
              style={{ minHeight: 88 }}
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm((p) => ({ ...p, subtitle: e.target.value }))}
            />
          </div>
        </div>

        {/* JOB OPENINGS LIST */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-head-text">
              <h3>Job Openings ({jobs.length})</h3>
              <p>Only positions set to Published appear on /careers.</p>
            </div>
            <div className="card-head-actions">
              <button className="btn primary sm" onClick={openCreateModal}>
                <Icon name="plus" size={14} />
                <span>Add Job</span>
              </button>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state">
              <p>No job openings created yet.</p>
              <button className="btn ghost sm" onClick={openCreateModal}>Create first job posting</button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td><span className="t-title">{job.title}</span></td>
                      <td><span className="badge blue">{job.department}</span></td>
                      <td>{job.location}</td>
                      <td>{job.type}</td>
                      <td>
                        <span className={`badge ${STATUS_TONE[job.status] || 'gray'}`}>{job.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button className="btn ghost sm" onClick={() => openEditModal(job)}>Edit</button>
                          <button className="btn danger sm" onClick={() => handleDeleteJob(job.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL — the shared Modal keeps its footer pinned, so the
          save button stays reachable however long the form gets. */}
      {showModal && (
        <Modal
          title={editingJob ? 'Edit Job Opening' : 'Add New Job Opening'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button type="button" className="btn ghost" onClick={() => setShowModal(false)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" form="job-form" className="btn primary" disabled={saving}>
                {saving ? 'Saving…' : editingJob ? 'Save Changes' : 'Publish Position'}
              </button>
            </>
          }
        >
          <form id="job-form" onSubmit={handleSaveJob}>
            <div className="field">
              <label htmlFor="job-title">Job Title *</label>
              <input
                id="job-title"
                type="text"
                required
                className="input"
                value={jobForm.title}
                onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="job-dept">Department *</label>
                <input
                  id="job-dept"
                  type="text"
                  required
                  className="input"
                  value={jobForm.department}
                  onChange={(e) => setJobForm((p) => ({ ...p, department: e.target.value }))}
                  placeholder="e.g. Engineering"
                />
              </div>

              <div className="field">
                <label htmlFor="job-location">Location</label>
                <input
                  id="job-location"
                  type="text"
                  className="input"
                  value={jobForm.location}
                  onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Remote, London, NYC"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="job-type">Employment Type</label>
                <select
                  id="job-type"
                  className="select"
                  value={jobForm.type}
                  onChange={(e) => setJobForm((p) => ({ ...p, type: e.target.value }))}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="job-status">Publication Status</label>
                <select
                  id="job-status"
                  className="select"
                  value={jobForm.status}
                  onChange={(e) => setJobForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <span className="hint">Only “Published” roles are visible on the website.</span>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="job-desc">Job Summary &amp; Key Responsibilities</label>
              <textarea
                id="job-desc"
                className="textarea"
                rows={5}
                value={jobForm.description}
                onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the role responsibilities and requirements..."
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

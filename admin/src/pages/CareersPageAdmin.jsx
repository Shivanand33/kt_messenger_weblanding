import React, { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/client.js'
import { useToast } from '../components/Toast.jsx'
import { PageHeader, Loading } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'

export function CareersPageAdmin() {
  const toast = useToast()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

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
        api.get('/admin/job-openings'),
        api.get('/admin/website-content', { params: { page: 'careers' } })
      ])

      const fetchedJobs = jobsRes.data.data?.items || jobsRes.data.data || []
      setJobs(fetchedJobs)

      const items = contentRes.data.data?.items || contentRes.data.data || []
      const heroBlock = items.find((i) => i.key === 'careers.hero')
      if (heroBlock && heroBlock.data) {
        setHeroForm((prev) => ({ ...prev, ...heroBlock.data }))
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
      const contentRes = await api.get('/admin/website-content', { params: { key: 'careers.hero' } })
      const items = contentRes.data.data?.items || contentRes.data.data || []
      const existing = items.find((i) => i.key === 'careers.hero')

      if (existing) {
        await api.put(`/admin/website-content/${existing.id}`, {
          key: 'careers.hero',
          page: 'careers',
          label: 'Careers Hero Content',
          data: heroForm
        })
      } else {
        await api.post('/admin/website-content', {
          key: 'careers.hero',
          page: 'careers',
          label: 'Careers Hero Content',
          data: heroForm
        })
      }
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
      toast.error(errorMessage(err, 'Failed to delete job posting'))
    }
  }

  if (loading) return <Loading label="Loading Careers management..." />

  return (
    <div className="space-y-6">
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

      {/* HERO & HEADER SECTION */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-base">Careers Hero & Header Settings</h3>
          <button className="btn secondary sm" onClick={handleHeroSave} disabled={saving}>
            <Icon name="check" size={14} />
            <span>Save Banner Text</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Badge Pill</label>
            <input
              type="text"
              className="input w-full"
              value={heroForm.badge}
              onChange={(e) => setHeroForm((p) => ({ ...p, badge: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Headline</label>
            <input
              type="text"
              className="input w-full"
              value={heroForm.title}
              onChange={(e) => setHeroForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="label">Subtitle Description</label>
          <textarea
            className="textarea w-full"
            rows={2}
            value={heroForm.subtitle}
            onChange={(e) => setHeroForm((p) => ({ ...p, subtitle: e.target.value }))}
          />
        </div>
      </div>

      {/* JOB OPENINGS LIST */}
      <div className="card p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h3 className="font-extrabold text-base">Job Openings ({jobs.length})</h3>
            <p className="text-xs text-muted">All active job opportunities displayed on /careers</p>
          </div>
          <button className="btn primary sm" onClick={openCreateModal}>
            <Icon name="plus" size={14} />
            <span>Add Job</span>
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-10 text-muted">
            <p>No job openings created yet.</p>
            <button className="btn ghost sm mt-2" onClick={openCreateModal}>Create first job posting</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
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
                    <td className="font-extrabold text-sm">{job.title}</td>
                    <td><span className="badge-pill">{job.department}</span></td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td>
                      <span className={`badge-pill ${job.status === 'PUBLISHED' ? 'success' : 'muted'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex justify-end gap-2">
                        <button className="btn ghost sm" onClick={() => openEditModal(job)}>
                          Edit
                        </button>
                        <button className="btn ghost danger sm" onClick={() => handleDeleteJob(job.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="cmdk-backdrop" onMouseDown={() => setShowModal(false)}>
          <div className="cmdk-panel max-w-xl" onMouseDown={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveJob} className="p-6 space-y-4">
              <h3 className="font-extrabold text-lg border-b pb-3">
                {editingJob ? 'Edit Job Opening' : 'Add New Job Opening'}
              </h3>

              <div>
                <label className="label">Job Title *</label>
                <input
                  type="text"
                  required
                  className="input w-full"
                  value={jobForm.title}
                  onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Department *</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={jobForm.department}
                    onChange={(e) => setJobForm((p) => ({ ...p, department: e.target.value }))}
                    placeholder="e.g. Engineering, Design, Product"
                  />
                </div>

                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    className="input w-full"
                    value={jobForm.location}
                    onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Remote, London, NYC"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Employment Type</label>
                  <select
                    className="input w-full"
                    value={jobForm.type}
                    onChange={(e) => setJobForm((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="label">Publication Status</label>
                  <select
                    className="input w-full"
                    value={jobForm.status}
                    onChange={(e) => setJobForm((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Job Summary & Key Responsibilities</label>
                <textarea
                  className="textarea w-full"
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the role responsibilities and requirements..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

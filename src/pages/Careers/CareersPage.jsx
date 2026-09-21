import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBriefcase,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiGlobe,
  FiHeart,
  FiHome,
  FiMapPin,
  FiMessageSquare,
  FiSend,
  FiShield,
  FiUsers,
  FiVideo,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PageHero } from '../../components/feature/PageHero'
import { SectionHead } from '../../components/feature/SectionHead'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Modal } from '../../components/feature/Modal'
import { Toast } from '../../components/feature/Toast'
import { useLanguage } from '../../context/LanguageContext'
import { useSeo } from '../../hooks/useSeo'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { api } from '../../services/apiClient'
import { useRemoteContent } from '../../hooks/useRemoteContent'

const ROLES = [
  {
    id: 'eng-android',
    title: 'Senior Android Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    summary: 'Own message delivery and media handling on the Android client with a focus on performance and privacy.',
  },
  {
    id: 'eng-protocol',
    title: 'Protocol Engineer, Cryptography',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    summary: 'Extend double ratchet cryptography implementation and post-quantum key exchange mechanisms.',
  },
  {
    id: 'eng-infra',
    title: 'Site Reliability Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    summary: 'Keep message delivery at four nines while scaling distributed infrastructure across global regions.',
  },
  {
    id: 'design-product',
    title: 'Product Designer, Messaging',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    summary: 'Design intuitive, accessible chat interfaces that prioritize privacy and user control by default.',
  },
  {
    id: 'sec-research',
    title: 'Security Researcher',
    department: 'Security',
    location: 'Remote',
    type: 'Full-time',
    summary: 'Perform security audits, red-teaming, and protocol research across client applications and backend APIs.',
  },
]

const BENEFITS = [
  { icon: <FiHome />, title: 'Remote by default', desc: 'Work from anywhere with flexible hours. No commuting, no mandatory office presence.' },
  { icon: <FiUsers />, title: 'Inclusive culture', desc: 'A supportive, collaborative team focused on building high-quality, privacy-first software.' },
  { icon: <FiHeart />, title: 'Full health cover', desc: 'Comprehensive health, dental, and mental wellness insurance for you and your family.' },
  { icon: <FiBriefcase />, title: 'Professional growth', desc: 'Continuous learning support, mentorship, and opportunities to build skills across real-world systems.' },
]

const FAQS = [
  { q: 'Do you hire internationally?', a: 'Yes. Every role is 100% remote. We handle global employment wherever you are based.' },
  { q: 'What is the work environment like?', a: 'We operate as a remote-first team with flexible hours, async communication, and a focus on ownership.' },
  { q: 'How long does the hiring process take?', a: 'Typically 2 to 3 weeks from initial application review to final offer decision.' },
  { q: 'What is the interview format?', a: 'Introductory call with the hiring lead, technical/craft interview, and team culture conversations.' },
]

const RELATED = [
  { to: '/about', label: 'About', desc: 'Our mission, story and privacy charter.', icon: <FiCompass /> },
  { to: '/contact', label: 'Contact', desc: 'Reach out to our support or hiring team.', icon: <FiMessageSquare /> },
  { to: '/community', label: 'Community', desc: 'Join our user forums and discussion spaces.', icon: <FiUsers /> },
  { to: '/minis', label: 'KT Minis', desc: 'Watch, create and share short video clips.', icon: <FiVideo /> },
]

export function CareersPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  useSeo({
    title: 'Careers at KT Messenger | Join Our Global Team.',
    description: 'Join us and create something truly meaningful. Find innovative ways to chat, call, use AI, enhance security, and engage in digital experiences.',
    path: '/careers',
  })

  useAdminSeo('careers', '/careers')

  const [remoteJobs] = useRemoteContent(
    () => api.listJobs(),
    ROLES
  )
  const [heroData] = useRemoteContent(
    () => api.getContentBlock('careers.hero'),
    null
  )

  const jobsList = (Array.isArray(remoteJobs) && remoteJobs.length > 0) ? remoteJobs : ROLES
  // An admin-set headline replaces the whole title, so the split
  // "Careers at" + highlighted "KT Messenger" only shows when none is set.
  const heroTitle = heroData?.title?.trim() || ''
  const heroSubtitle = heroData?.subtitle || 'Join us and create something truly meaningful. Find innovative ways to chat, call, use AI, enhance security, and engage in digital experiences.'
  const heroBadge = heroData?.badge || 'Open roles · 100% remote'

  const [openRole, setOpenRole] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', note: '' })
  const [submitted, setSubmitted] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const submitApplication = (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setToast(t('Please add your name.'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setToast(t('Enter a valid email address.'))
      return
    }
    setSubmitted({ role: openRole.title, ref: `KT-${(openRole.id || 'JOB').toUpperCase()}-${form.name.trim().split(' ')[0].toUpperCase()}` })
    setOpenRole(null)
    setForm({ name: '', email: '', note: '' })
  }

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <PageHero
        badge={
          <>
            <FiBriefcase /> {t(heroBadge)}
          </>
        }
        title={heroTitle || t('Careers at')}
        highlight={heroTitle ? '' : 'KT Messenger'}
        description={t(heroSubtitle)}
        actions={
          <>
            <Button size="lg" variant="primary" onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('Browse open roles')} <FiChevronRight />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => { navigate('/about'); window.scrollTo(0, 0) }}>
              {t('About the company')}
            </Button>
          </>
        }
        chips={[
          { icon: <FiGlobe />, label: t('Global team') },
          { icon: <FiHome />, label: t('Remote by default') },
          { icon: <FiShield />, label: t('Equal opportunity') },
        ]}
        aside={
          <div className="rounded-[28px] border border-line bg-surface p-6 shadow-float sm:p-8 dark:bg-slate-900/90 dark:border-white/15">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-brand-ink dark:bg-sky-500/10 dark:text-sky-300 border border-brand-strong/20 dark:border-sky-400/30">
              {t('Why Work With Us')}
            </span>
            <ul className="mt-5 space-y-3.5">
              {[
                { icon: <FiHome />, text: 'Remote-first culture across all timezones.' },
                { icon: <FiUsers />, text: 'Collaborative, inclusive team environment.' },
                { icon: <FiShield />, text: 'Focus on privacy and security.' },
                { icon: <FiHeart />, text: 'Comprehensive family healthcare coverage.' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm font-semibold leading-relaxed text-ink dark:text-slate-200">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-strong dark:bg-sky-400/15 dark:text-sky-300 text-xs">
                    {item.icon}
                  </span>
                  <span>{t(item.text)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-line dark:border-white/10 pt-4 text-xs font-medium leading-relaxed text-muted dark:text-slate-400">
              {t('Every application is read by a human within five working days.')}
            </p>
          </div>
        }
      />

      {/* 2. OPEN ROLES SECTION */}
      <Section id="roles" className="bg-surface border-b border-line">
        <Container>
          <SectionHead
            eyebrow={t('Open Positions')}
            title={t('Current Opportunities')}
            description={t('Explore our open positions and join the KT Messenger team.')}
          />

          <div className="mt-10 space-y-4">
            {jobsList.map((role, index) => (
              <Reveal key={role.id || index} from="up" delay={Math.min(index * 0.05, 0.2)}>
                <div className="flex flex-col gap-4 rounded-[24px] border border-line bg-cream p-6 shadow-soft transition-all duration-300 hover:shadow-card lg:flex-row lg:items-center lg:justify-between dark:bg-cream-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                        {t(role.department)}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-xl font-extrabold text-ink">{t(role.title)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-body">{t(role.summary || role.description)}</p>

                    <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-muted">
                      <span className="flex items-center gap-1.5">
                        <FiMapPin className="text-brand-strong" /> {t(role.location)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiClock className="text-brand-strong" /> {t(role.type)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-2 lg:pt-0">
                    <Button variant="primary" onClick={() => setOpenRole(role)}>
                      {t('Apply Now')} <FiSend />
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. BENEFITS SECTION */}
      <Section className="bg-cream dark:bg-cream-2 border-b border-line">
        <Container>
          <SectionHead
            eyebrow={t('Benefits & Culture')}
            title={t('What We Offer')}
            description={t('We care deeply about our team members and offer competitive benefits to support your work and life.')}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, index) => (
              <Reveal key={b.title} from="up" delay={Math.min(index * 0.05, 0.2)}>
                <div className="flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-strong">
                    {b.icon}
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-ink">{t(b.title)}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{t(b.desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. FAQS */}
      <Section className="bg-surface border-b border-line">
        <Container>
          <SectionHead
            eyebrow={t('Hiring FAQs')}
            title={t('Frequently Asked Questions')}
            description={t('Everything you need to know about applying and working at KT Messenger.')}
          />
          <div className="mt-10 mx-auto max-w-3xl">
            <FaqAccordion items={FAQS} />
          </div>
        </Container>
      </Section>

      {/* 5. RELATED */}
      <Section className="bg-cream dark:bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
            {t('Keep Exploring')}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">
            {t('More about KT Messenger')}
          </h2>
        </div>
        <RelatedPages className="mt-10" items={RELATED} />
      </Section>

      {/* APPLICATION MODAL */}
      {openRole && (
        <Modal onClose={() => setOpenRole(null)} title={`${t('Apply for')} ${openRole.title}`}>
          <form onSubmit={submitApplication} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">{t('Full Name')}</label>
              <input
                type="text"
                required
                className="input w-full"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">{t('Email Address')}</label>
              <input
                type="email"
                required
                className="input w-full"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="sarah@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">{t('Cover Note / Portfolio Link')}</label>
              <textarea
                className="textarea w-full"
                rows={4}
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                placeholder="Tell us briefly why you are interested in this role..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpenRole(null)}>
                {t('Cancel')}
              </Button>
              <Button type="submit" variant="primary">
                {t('Submit Application')} <FiSend />
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* SUCCESS MODAL */}
      {submitted && (
        <Modal onClose={() => setSubmitted(null)} title={t('Application Received')}>
          <div className="text-center py-4 space-y-3">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 text-3xl mx-auto dark:bg-emerald-950 dark:text-emerald-400">
              ✓
            </div>
            <h3 className="text-lg font-bold text-ink">{t('Thank you for applying!')}</h3>
            <p className="text-sm text-body">
              {t('Your application for')} <strong>{submitted.role}</strong> {t('has been received. Application reference:')} <code className="font-mono text-xs bg-cream px-2 py-1 rounded">{submitted.ref}</code>
            </p>
            <Button onClick={() => setSubmitted(null)} className="mx-auto mt-4">
              {t('Done')}
            </Button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </MainLayout>
  )
}

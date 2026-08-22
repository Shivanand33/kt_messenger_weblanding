import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiAlertCircle,
  FiBriefcase,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiGlobe,
  FiHelpCircle,
  FiImage,
  FiLock,
  FiMail,
  FiMessageSquare,
  FiSend,
  FiShield,
  FiStar,
  FiUsers,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PageHero } from '../../components/feature/PageHero'
import { PageNav } from '../../components/feature/PageNav'
import { SectionHead } from '../../components/feature/SectionHead'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Modal } from '../../components/feature/Modal'
import { Toast } from '../../components/feature/Toast'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'getintouch', label: 'Get in touch', icon: <FiMail /> },
  { id: 'reasons', label: 'Pick a team', icon: <FiUsers /> },
  { id: 'form', label: 'Send a message', icon: <FiSend /> },
  { id: 'response', label: 'Response times', icon: <FiClock /> },
  { id: 'faq', label: 'FAQ', icon: <FiMessageSquare /> },
]

const TOPICS = [
  {
    id: 'support',
    icon: <FiHelpCircle />,
    title: 'Account or app support',
    desc: 'Something is broken, an account is locked, or a payment went wrong.',
    hint: 'Most answers are already in the Help Center — try there first for the fastest fix.',
    sla: 'Within 24 hours',
  },
  {
    id: 'security',
    icon: <FiShield />,
    title: 'Security disclosure',
    desc: 'You found a vulnerability and want to report it responsibly.',
    hint: 'Include reproduction steps. Reports are triaged within one business day, always by a human.',
    sla: 'Within 1 business day',
  },
  {
    id: 'business',
    icon: <FiBriefcase />,
    title: 'Business & partnerships',
    desc: 'Merchant onboarding, API access or a commercial conversation.',
    hint: 'Tell us the market, expected volume and what you are trying to build.',
    sla: 'Within 2 business days',
  },
  {
    id: 'press',
    icon: <FiImage />,
    title: 'Press & brand',
    desc: 'Interviews, statements, logos or product screenshots.',
    hint: 'Logos and colour tokens are already downloadable from the Brand Center.',
    sla: 'Within 1 business day',
  },
  {
    id: 'privacy',
    icon: <FiLock />,
    title: 'Privacy & data requests',
    desc: 'Access, export or deletion of the limited data we hold about you.',
    hint: 'We verify identity before acting on any request, then respond within the statutory window.',
    sla: 'Within 30 days (statutory)',
  },
  {
    id: 'careers',
    icon: <FiUsers />,
    title: 'Careers',
    desc: 'Questions about a role, the process, or an application already sent.',
    hint: 'Applications themselves go through the Careers page so they reach the right panel.',
    sla: 'Within 5 working days',
  },
]


const RESPONSE = [
  { label: 'Security disclosures', time: '1 business day', detail: 'Triaged by a human, never an auto-responder.', tone: 'fast' },
  { label: 'Press & brand', time: '1 business day', detail: 'Assets usually attached to the first reply.', tone: 'fast' },
  { label: 'Account support', time: '24 hours', detail: 'Faster in-app, where we can see the account context.', tone: 'normal' },
  { label: 'Business & partnerships', time: '2 business days', detail: 'Longer if it needs a regional compliance review.', tone: 'normal' },
  { label: 'Careers', time: '5 working days', detail: 'Every application read by a person on the panel.', tone: 'normal' },
  { label: 'Privacy requests', time: 'Up to 30 days', detail: 'Statutory window; identity verification comes first.', tone: 'slow' },
]

const FAQS = [
  {
    q: 'What is the fastest way to get help with my account?',
    a: 'Use the Help Center or in-app support. In the app we can see your account context, which removes most of the back-and-forth this form needs.',
    tag: 'Support',
  },
  {
    q: 'Can you read my messages to debug a problem?',
    a: 'No — and that is not a policy choice we can waive. Messages are end-to-end encrypted, so support genuinely cannot see chat content. We debug from device logs you choose to share.',
    tag: 'Privacy',
  },
  {
    q: 'How do I report a security vulnerability?',
    a: 'Pick the Security disclosure topic and include reproduction steps. We triage within one business day and run a bug bounty with published payout ranges.',
    tag: 'Security',
  },
  {
    q: 'Do you offer phone support?',
    a: 'No. Written support gives us a record both sides can refer back to, and it lets us route your message to a specialist rather than whoever picks up.',
    tag: 'Support',
  },
  {
    q: 'How do I request my data?',
    a: 'Choose Privacy & data requests. We verify identity first, then export the limited data we hold — which is far less than most people expect, because we do not collect message content.',
    tag: 'Privacy',
  },
  {
    q: 'Where do I send an invoice or billing query?',
    a: 'Use Business & partnerships and include your account or merchant ID. Billing questions are answered within two business days.',
    tag: 'Billing',
  },
  {
    q: 'Can I visit an office?',
    a: 'Offices are not open to walk-ins, but we are happy to arrange a meeting. Mention the city in your message and we will set it up.',
    tag: 'Offices',
  },
  {
    q: 'What happens to what I send through this form?',
    a: 'It is encrypted in transit and at rest, visible only to the team you selected, and deleted after twelve months unless it is part of an ongoing case.',
    tag: 'Privacy',
  },
]

const RELATED = [
  { to: '/help', label: 'Help Center', desc: 'Hundreds of articles — usually faster than writing in.', icon: <FiHelpCircle /> },
  { to: '/community', label: 'Community', desc: 'Forums, events and the ambassador programme.', icon: <FiUsers /> },
  { to: '/careers', label: 'Careers', desc: 'Open roles and how the hiring process works.', icon: <FiBriefcase /> },
]

const TONE_STYLES = {
  fast: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  normal: 'border-brand/30 bg-brand-soft text-brand-ink',
  slow: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
}

export function ContactPage() {
  const navigate = useNavigate()

  const [topic, setTopic] = useState('support')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)
  const [toast, setToast] = useState(null)

  // "Get in touch" — the two quick cards, kept independent of the routed form
  // above so neither can interfere with the other.
  const [support, setSupport] = useState({ name: '', email: '', subject: '', message: '' })
  const [supportErrors, setSupportErrors] = useState({})
  const [feedback, setFeedback] = useState({ about: '', category: 'Suggestion', details: '' })
  const [feedbackErrors, setFeedbackErrors] = useState({})
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [quickSent, setQuickSent] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const selectedTopic = TOPICS.find((item) => item.id === topic) ?? TOPICS[0]

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Tell us who you are.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.subject.trim()) next.subject = 'Add a short subject line.'
    if (form.message.trim().length < 20) next.message = 'Please give us at least 20 characters of detail.'
    return next
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setToast('Please fix the highlighted fields.')
      return
    }

    setSent({
      topic: selectedTopic.title,
      sla: selectedTopic.sla,
      ref: `KT-${selectedTopic.id.toUpperCase()}-${String(form.subject.trim().length * 7 + form.name.trim().length * 13).padStart(4, '0')}`,
      email: form.email.trim(),
    })
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
  }

  // ------------------------------------------------- Get in touch: support
  const submitSupport = (event) => {
    event.preventDefault()
    const next = {}
    if (!support.name.trim()) next.name = 'Add your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(support.email.trim())) next.email = 'Enter a valid email address.'
    if (!support.subject.trim()) next.subject = 'Add a subject line.'
    if (support.message.trim().length < 20) next.message = 'Please give us at least 20 characters.'

    setSupportErrors(next)
    if (Object.keys(next).length > 0) {
      setToast('Please fix the highlighted fields.')
      return
    }

    setQuickSent({
      kind: 'support',
      email: support.email.trim(),
      subject: support.subject.trim(),
      ref: `KT-MSG-${String(support.subject.trim().length * 31 + support.name.trim().length * 17).padStart(4, '0')}`,
    })
    setSupport({ name: '', email: '', subject: '', message: '' })
    setSupportErrors({})
  }

  // ------------------------------------------------ Get in touch: feedback
  const submitFeedback = (event) => {
    event.preventDefault()
    const next = {}
    if (!feedback.about.trim()) next.about = 'Tell us what this is about.'
    if (rating === 0) next.rating = 'Pick a rating from one to five stars.'

    setFeedbackErrors(next)
    if (Object.keys(next).length > 0) {
      setToast('Please fix the highlighted fields.')
      return
    }

    setQuickSent({
      kind: 'feedback',
      about: feedback.about.trim(),
      category: feedback.category,
      rating,
      ref: `KT-FB-${String(feedback.about.trim().length * 23 + rating * 41).padStart(4, '0')}`,
    })
    setFeedback({ about: '', category: 'Suggestion', details: '' })
    setFeedbackErrors({})
    setRating(0)
    setHoverRating(0)
  }

  /** Shared input styling for the two Get-in-touch cards. */
  const quickField = (invalid) =>
    `w-full rounded-2xl border bg-cream px-4 text-sm font-semibold text-ink outline-none transition-colors placeholder:font-medium placeholder:text-muted dark:bg-cream-2 ${
      invalid ? 'border-rose-400 focus:border-rose-500' : 'border-line focus:border-brand/60'
    }`

  const fieldClass = (key) =>
    `w-full rounded-2xl border bg-cream px-4 text-sm font-semibold text-ink outline-none transition-colors placeholder:font-medium placeholder:text-muted dark:bg-cream-2 ${
      errors[key] ? 'border-rose-400 focus:border-rose-500' : 'border-line focus:border-brand/60'
    }`

  return (
    <MainLayout>
      <PageHero
        badge={
          <>
            <FiMail /> Six teams · written support only
          </>
        }
        title="Contact"
        highlight="KT Messenger"
        description="Pick the team that fits, tell us what is going on, and a person will read it. We publish our response times below and hold ourselves to them."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}>
              Send a message <FiSend />
            </Button>
            <Button size="lg" variant="onDark" onClick={() => { navigate('/help'); window.scrollTo(0, 0) }}>
              Try the Help Center <FiChevronRight />
            </Button>
          </>
        }
        chips={[
          { icon: <FiClock />, label: 'Published response times' },
          { icon: <FiShield />, label: 'Encrypted in transit and at rest' },
          { icon: <FiGlobe />, label: '6 offices, 5 timezones' },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-300">Before you write</span>
            <ul className="mt-5 space-y-4">
              {[
                { icon: <FiHelpCircle />, text: 'Account problems are usually solved faster in the Help Center.' },
                { icon: <FiLock />, text: 'Support cannot read your messages — encryption is not waivable.' },
                { icon: <FiImage />, text: 'Logos and press assets are already in the Brand Center.' },
                { icon: <FiBriefcase />, text: 'Job applications go through the Careers page, not this form.' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                  <span className="mt-0.5 shrink-0 text-sky-400">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/10 pt-5 text-[11px] leading-relaxed text-slate-400">
              We do not offer phone support. Written support keeps a record both sides can refer back to.
            </p>
          </div>
        }
      />

      <PageNav items={NAV_ITEMS} />

      {/* ---------------------------------------------------------------- */}
      {/* GET IN TOUCH — quick support + feedback, side by side             */}
      {/* ---------------------------------------------------------------- */}
      <Section id="getintouch" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Get in touch"
          title="Get in touch"
          description="Send us a message or share feedback — no account required."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* -------------------------------------------- CONTACT SUPPORT */}
          <Reveal from="up" className="h-full">
            <form
              onSubmit={submitSupport}
              noValidate
              className="flex h-full flex-col rounded-[28px] border border-line bg-cream p-6 shadow-card transition-shadow duration-300 hover:shadow-float sm:p-8 dark:bg-cream-2"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink">
                  <FiMail />
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold text-ink">Contact support</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">
                    No account needed — we usually reply within a day.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="gt-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="gt-name"
                    type="text"
                    value={support.name}
                    onChange={(event) => setSupport({ ...support, name: event.target.value })}
                    placeholder="Your name"
                    aria-invalid={Boolean(supportErrors.name)}
                    className={`h-12 ${quickField(supportErrors.name)}`}
                  />
                  {supportErrors.name ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <FiAlertCircle /> {supportErrors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="gt-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="gt-email"
                    type="email"
                    value={support.email}
                    onChange={(event) => setSupport({ ...support, email: event.target.value })}
                    placeholder="Email address"
                    aria-invalid={Boolean(supportErrors.email)}
                    className={`h-12 ${quickField(supportErrors.email)}`}
                  />
                  {supportErrors.email ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <FiAlertCircle /> {supportErrors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="gt-subject" className="sr-only">
                  Subject
                </label>
                <input
                  id="gt-subject"
                  type="text"
                  value={support.subject}
                  onChange={(event) => setSupport({ ...support, subject: event.target.value })}
                  placeholder="Subject"
                  aria-invalid={Boolean(supportErrors.subject)}
                  className={`h-12 ${quickField(supportErrors.subject)}`}
                />
                {supportErrors.subject ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <FiAlertCircle /> {supportErrors.subject}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 flex-1">
                <label htmlFor="gt-message" className="sr-only">
                  How can we help?
                </label>
                <textarea
                  id="gt-message"
                  rows={6}
                  value={support.message}
                  onChange={(event) => setSupport({ ...support, message: event.target.value })}
                  placeholder="How can we help?"
                  aria-invalid={Boolean(supportErrors.message)}
                  className={`resize-none py-4 ${quickField(supportErrors.message)}`}
                />
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  {supportErrors.message ? (
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <FiAlertCircle /> {supportErrors.message}
                    </p>
                  ) : (
                    <span className="text-[11px] font-semibold text-muted">Minimum 20 characters.</span>
                  )}
                  <span className="shrink-0 text-[11px] font-bold text-muted">{support.message.trim().length}</span>
                </div>
              </div>

              {/* Note sits above the button so both cards' submit buttons stay
                  flush with the card bottom, whatever height the note wraps to. */}
              <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                <FiLock className="mt-0.5 shrink-0" />
                Encrypted in transit and at rest. We reply to the address you give us and nothing else.
              </p>

              <Button type="submit" size="lg" className="mt-4 w-full justify-center">
                <FiSend /> Send message
              </Button>
            </form>
          </Reveal>

          {/* --------------------------------------------- SHARE FEEDBACK */}
          <Reveal from="up" delay={0.08} className="h-full">
            <form
              onSubmit={submitFeedback}
              noValidate
              className="flex h-full flex-col rounded-[28px] border border-line bg-cream p-6 shadow-card transition-shadow duration-300 hover:shadow-float sm:p-8 dark:bg-cream-2"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink">
                  <FiStar />
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold text-ink">Share feedback</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">
                    Tell us what you love or what we can improve.
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <label htmlFor="gt-about" className="sr-only">
                  What is this about?
                </label>
                <input
                  id="gt-about"
                  type="text"
                  value={feedback.about}
                  onChange={(event) => setFeedback({ ...feedback, about: event.target.value })}
                  placeholder="What's this about? (e.g. Calls, Themes)"
                  aria-invalid={Boolean(feedbackErrors.about)}
                  className={`h-12 ${quickField(feedbackErrors.about)}`}
                />
                {feedbackErrors.about ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <FiAlertCircle /> {feedbackErrors.about}
                  </p>
                ) : null}
              </div>

              {/* STAR RATING */}
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span id="gt-rating-label" className="text-sm font-bold text-ink">
                    Your rating:
                  </span>

                  <div
                    role="radiogroup"
                    aria-labelledby="gt-rating-label"
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = star <= (hoverRating || rating)
                      return (
                        <button
                          key={star}
                          type="button"
                          role="radio"
                          aria-checked={rating === star}
                          aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onFocus={() => setHoverRating(star)}
                          onBlur={() => setHoverRating(0)}
                          className="rounded-lg p-1 transition-transform duration-200 hover:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/45"
                        >
                          <FiStar
                            className={`text-2xl transition-colors duration-200 ${
                              filled ? 'fill-amber-400 text-amber-400' : 'text-muted'
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>

                  {rating > 0 ? (
                    <span className="text-xs font-black text-brand-ink">
                      {rating}/5
                    </span>
                  ) : null}
                </div>

                {feedbackErrors.rating ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <FiAlertCircle /> {feedbackErrors.rating}
                  </p>
                ) : null}
              </div>

              <div className="mt-5">
                <label htmlFor="gt-category" className="sr-only">
                  Feedback type
                </label>
                <select
                  id="gt-category"
                  value={feedback.category}
                  onChange={(event) => setFeedback({ ...feedback, category: event.target.value })}
                  className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm font-bold text-ink outline-none transition-colors focus:border-brand/60 dark:bg-cream-2"
                >
                  {['Suggestion', 'Bug report', 'Compliment', 'Complaint', 'Feature request'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex-1">
                <label htmlFor="gt-details" className="sr-only">
                  Tell us more
                </label>
                <textarea
                  id="gt-details"
                  rows={5}
                  value={feedback.details}
                  onChange={(event) => setFeedback({ ...feedback, details: event.target.value })}
                  placeholder="Tell us more (optional)"
                  className={`resize-none py-4 ${quickField(false)}`}
                />
              </div>

              <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                <FiCheckCircle className="mt-0.5 shrink-0" />
                Feedback is anonymous unless you add contact details. Every item is read by the product team.
              </p>

              <Button type="submit" size="lg" className="mt-4 w-full justify-center">
                <FiSend /> Send feedback
              </Button>
            </form>
          </Reveal>
        </div>
      </Section>

      {/* TOPICS */}
      <Section id="reasons" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Pick a team"
          title="Routing matters more than wording"
          description="Choosing the right team is what gets you a specialist instead of a hand-off. Your selection carries into the form below."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((item, index) => {
            const active = topic === item.id
            return (
              <Reveal key={item.id} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
                <button
                  type="button"
                  onClick={() => {
                    setTopic(item.id)
                    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  aria-pressed={active}
                  className={`group flex h-full w-full flex-col rounded-[24px] border p-6 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                    active ? 'border-brand-strong bg-brand-soft' : 'border-line bg-cream hover:border-brand/35 dark:bg-cream-2'
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${active ? 'bg-brand-strong text-white' : 'bg-brand-soft text-brand-ink'}`}>
                      {item.icon}
                    </span>
                    {active ? <FiCheckCircle className="text-lg text-brand-strong" /> : null}
                  </span>

                  <span className="mt-5 text-base font-extrabold text-ink">{item.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-body">{item.desc}</span>

                  <span className="mt-5 flex items-center gap-1.5 border-t border-line/70 pt-4 text-[11px] font-black uppercase tracking-wide text-brand-ink">
                    <FiClock /> {item.sla}
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* FORM */}
      <Section id="form" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Send a message"
          title={`Writing to: ${selectedTopic.title}`}
          description={selectedTopic.hint}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal from="up">
            <form onSubmit={handleSubmit} noValidate className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Your name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Jane Doe"
                    aria-invalid={Boolean(errors.name)}
                    className={`h-12 ${fieldClass('name')}`}
                  />
                  {errors.name ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <FiAlertCircle /> {errors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className={`h-12 ${fieldClass('email')}`}
                  />
                  {errors.email ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <FiAlertCircle /> {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="c-topic" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                  Team
                </label>
                <select
                  id="c-topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-line bg-cream px-3 text-sm font-bold text-ink outline-none focus:border-brand/60 dark:bg-cream-2"
                >
                  {TOPICS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {item.sla}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label htmlFor="c-subject" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                  Subject
                </label>
                <input
                  id="c-subject"
                  type="text"
                  value={form.subject}
                  onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  placeholder="One line on what this is about"
                  aria-invalid={Boolean(errors.subject)}
                  className={`h-12 ${fieldClass('subject')}`}
                />
                {errors.subject ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <FiAlertCircle /> {errors.subject}
                  </p>
                ) : null}
              </div>

              <div className="mt-5">
                <label htmlFor="c-message" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                  Message
                </label>
                <textarea
                  id="c-message"
                  rows={6}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Include anything that helps us reproduce or understand the situation."
                  aria-invalid={Boolean(errors.message)}
                  className={`resize-none py-4 ${fieldClass('message')}`}
                />
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  {errors.message ? (
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <FiAlertCircle /> {errors.message}
                    </p>
                  ) : (
                    <span className="text-[11px] font-semibold text-muted">Minimum 20 characters.</span>
                  )}
                  <span className="shrink-0 text-[11px] font-bold text-muted">{form.message.trim().length}</span>
                </div>
              </div>

              <Button type="submit" size="lg" className="mt-7 w-full justify-center">
                Send to {selectedTopic.title} <FiSend />
              </Button>

              <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                <FiLock className="mt-0.5 shrink-0" />
                Encrypted in transit and at rest, visible only to the team you picked, and deleted after twelve months
                unless it belongs to an open case.
              </p>
            </form>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink">
                  {selectedTopic.icon}
                </span>
                <h3 className="mt-4 text-base font-extrabold text-ink">{selectedTopic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{selectedTopic.hint}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-brand-ink">
                  <FiClock /> {selectedTopic.sla}
                </span>
              </div>

              <div className="flex-1 rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                <h3 className="text-sm font-extrabold text-ink">Faster alternatives</h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    { label: 'Help Center articles', to: '/help' },
                    { label: 'Community forums', to: '/community' },
                    { label: 'Careers and open roles', to: '/careers' },
                  ].map((item) => (
                    <li key={item.to}>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(item.to)
                          window.scrollTo(0, 0)
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-left text-xs font-bold text-body transition-colors hover:border-brand/40 hover:text-ink"
                      >
                        {item.label}
                        <FiChevronRight className="shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>


      {/* RESPONSE TIMES */}
      <Section id="response" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Response times"
          title="What we commit to, in writing"
          description="Measured from when your message arrives, over the last 90 days. If we are going to miss one, you get told rather than left waiting."
        />

        <Reveal from="up" className="mt-12 overflow-hidden rounded-[26px] border border-line bg-surface shadow-card">
          <ul className="divide-y divide-line">
            {RESPONSE.map((row) => (
              <li key={row.label} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-ink">{row.label}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-body">{row.detail}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wide ${TONE_STYLES[row.tone]}`}>
                  {row.time}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Before you write to us" />
          <div className="mt-12">
            <FaqAccordion items={FAQS} placeholder="Search the FAQ…" />
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Still stuck"
        title="The Help Center answers most of this faster than we can"
        description="Hundreds of articles covering setup, privacy, payments and account recovery — searchable, and updated with every release."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => { navigate('/help'); window.scrollTo(0, 0) }}>
              Open the Help Center
            </Button>
            <Button size="lg" variant="onDark" onClick={() => document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })}>
              Write to us anyway
            </Button>
          </>
        }
        points={['Written support only', 'Human triage', 'Published response times', 'No phone queue']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More about KT Messenger" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      {/* CONFIRMATION */}
      <Modal
        open={Boolean(sent)}
        onClose={() => setSent(null)}
        eyebrow="Message sent"
        title="We have got it"
        size="sm"
        footer={<Button className="w-full justify-center" onClick={() => setSent(null)}>Done</Button>}
      >
        {sent ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/12 text-3xl text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle />
            </span>

            <h3 className="mt-5 text-lg font-extrabold text-ink">Routed to {sent.topic}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              A confirmation is on its way to <strong className="text-ink">{sent.email}</strong>. Expect a human reply{' '}
              <strong className="text-ink">{sent.sla.toLowerCase()}</strong>.
            </p>

            <p className="mt-5 rounded-2xl border border-line bg-cream px-4 py-3 font-mono text-xs font-black text-ink dark:bg-cream-2">
              {sent.ref}
            </p>
            <p className="mt-3 text-[11px] font-semibold text-muted">Quote this reference if you follow up.</p>
          </div>
        ) : null}
      </Modal>

      {/* GET IN TOUCH CONFIRMATION */}
      <Modal
        open={Boolean(quickSent)}
        onClose={() => setQuickSent(null)}
        eyebrow={quickSent?.kind === 'feedback' ? 'Feedback received' : 'Message sent'}
        title={quickSent?.kind === 'feedback' ? 'Thanks for telling us' : 'We have got it'}
        size="sm"
        footer={
          <Button className="w-full justify-center" onClick={() => setQuickSent(null)}>
            Done
          </Button>
        }
      >
        {quickSent ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/12 text-3xl text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle />
            </span>

            {quickSent.kind === 'feedback' ? (
              <>
                <div className="mt-5 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`text-xl ${star <= quickSent.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
                    />
                  ))}
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-ink">{quickSent.category}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  Your {quickSent.rating}-star note about{' '}
                  <strong className="text-ink">{quickSent.about}</strong> is with the product team. We read every item,
                  even when we cannot reply to each one.
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-5 text-lg font-extrabold text-ink">{quickSent.subject}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  A confirmation is on its way to <strong className="text-ink">{quickSent.email}</strong>. Expect a
                  human reply <strong className="text-ink">within a day</strong>.
                </p>
              </>
            )}

            <p className="mt-5 rounded-2xl border border-line bg-cream px-4 py-3 font-mono text-xs font-black text-ink dark:bg-cream-2">
              {quickSent.ref}
            </p>
            <p className="mt-3 text-[11px] font-semibold text-muted">Quote this reference if you follow up.</p>
          </div>
        ) : null}
      </Modal>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}

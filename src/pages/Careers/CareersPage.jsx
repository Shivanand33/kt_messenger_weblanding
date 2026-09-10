import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiActivity,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiDollarSign,
  FiGlobe,
  FiHeart,
  FiHome,
  FiMapPin,
  FiMessageSquare,
  FiSearch,
  FiSend,
  FiShield,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PageHero } from '../../components/feature/PageHero'
import { PageNav } from '../../components/feature/PageNav'
import { StatStrip } from '../../components/feature/StatStrip'
import { SectionHead } from '../../components/feature/SectionHead'
import { FilterBar } from '../../components/feature/FilterBar'
import { FeatureGrid } from '../../components/feature/FeatureGrid'
import { Steps } from '../../components/feature/Steps'
import { Testimonials } from '../../components/feature/Testimonials'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Modal } from '../../components/feature/Modal'
import { Toast } from '../../components/feature/Toast'
import { EmptyState } from '../../components/feature/EmptyState'
import { useLanguage } from '../../context/LanguageContext'

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Security', 'Product', 'Policy & Legal', 'Support']

const ROLES = [
  {
    id: 'eng-android',
    title: 'Senior Android Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    salary: '95–130k',
    summary: 'Own message delivery and media handling on the Android client, with a hard focus on mid range devices.',
    responsibilities: [
      'Cut cold start time on 4GB devices without dropping features.',
      'Own the offline queue and reconciliation logic end to end.',
      'Work directly with the protocol team on client side key handling.',
    ],
    requirements: ['5+ years shipping Android apps at scale', 'Kotlin and coroutines in production', 'Comfort profiling on low end hardware'],
  },
  {
    id: 'eng-protocol',
    title: 'Protocol Engineer, Cryptography',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    salary: '110–150k',
    summary: 'Extend the double ratchet implementation and drive the post quantum migration across clients.',
    responsibilities: [
      'Implement and review hybrid post quantum key agreement.',
      'Write the specs that external auditors review.',
      'Keep handshake latency under two milliseconds on target hardware.',
    ],
    requirements: ['Applied cryptography experience', 'Rust or C++ in security critical code', 'Published or audited protocol work is a plus'],
  },
  {
    id: 'eng-payments',
    title: 'Backend Engineer, Payments',
    department: 'Engineering',
    location: 'Distributed team',
    type: 'Full-time',
    level: 'Mid',
    salary: '75–105k',
    summary: 'Build the escrow and settlement services behind KT Wallet and Marketplace orders.',
    responsibilities: [
      'Design idempotent settlement flows against partner bank APIs.',
      'Own reconciliation tooling and the dispute pipeline.',
      'Keep the audit trail complete enough to survive a regulator.',
    ],
    requirements: ['Payments or ledger experience', 'Strong Go, Java or Rust', 'Instinct for exactly once semantics'],
  },
  {
    id: 'eng-infra',
    title: 'Site Reliability Engineer',
    department: 'Engineering',
    location: 'Distributed team',
    type: 'Full-time',
    level: 'Senior',
    salary: '90–125k',
    summary: 'Keep message delivery at four nines while the fleet keeps growing across regions.',
    responsibilities: [
      'Own capacity planning for regional message brokers.',
      'Run blameless incident review and drive the follow ups.',
      'Reduce alert noise so on call is genuinely sustainable.',
    ],
    requirements: ['Kubernetes at real scale', 'Observability tooling ownership', 'Been on call for something people notice'],
  },
  {
    id: 'design-product',
    title: 'Product Designer, Messaging',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid',
    salary: '65–85k',
    summary: 'Design defaults that stay safe for people who will never open the settings screen.',
    responsibilities: [
      'Own the chat and composer surfaces end to end.',
      'Run research with users on low end devices and slow networks.',
      'Prototype in code well enough to argue with engineers.',
    ],
    requirements: ['4+ years product design', 'Portfolio showing shipped mobile work', 'Comfort designing for accessibility first'],
  },
  {
    id: 'design-brand',
    title: 'Brand Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Contract · 12 months',
    level: 'Mid',
    salary: '55–70k',
    summary: 'Evolve the KT identity across product, store listings and the Brand Center.',
    responsibilities: [
      'Maintain and extend the brand system and its documentation.',
      'Produce launch assets for four product surfaces a year.',
      'Keep the Brand Center genuinely usable by partners.',
    ],
    requirements: ['Identity systems experience', 'Motion and illustration fluency', 'Meticulous about specs and spacing'],
  },
  {
    id: 'sec-research',
    title: 'Security Researcher',
    department: 'Security',
    location: 'Remote (worldwide)',
    type: 'Full-time',
    level: 'Senior',
    salary: '140–190k',
    summary: 'Break our clients before anyone else does, and turn what you find into shipped fixes.',
    responsibilities: [
      'Red team the mobile and desktop clients each release cycle.',
      'Triage bug bounty reports and set severity honestly.',
      'Publish findings, including the ones that are embarrassing.',
    ],
    requirements: ['Mobile or protocol exploitation experience', 'Track record of responsible disclosure', 'Clear technical writing'],
  },
  {
    id: 'sec-appsec',
    title: 'Application Security Engineer',
    department: 'Security',
    location: 'Distributed team',
    type: 'Full-time',
    level: 'Mid',
    salary: '90–120k',
    summary: 'Build the guardrails that keep insecure code from reaching a release branch.',
    responsibilities: [
      'Own the secure SDLC and the pre merge security checks.',
      'Threat model new surfaces before they are built.',
      'Run the internal security training that engineers actually attend.',
    ],
    requirements: ['AppSec at a product company', 'Fluency in at least two of Kotlin, Swift, Go, TypeScript', 'Pragmatism about risk'],
  },
  {
    id: 'prod-wallet',
    title: 'Product Manager, Wallet',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    salary: '100–140k',
    summary: 'Own the roadmap for payments, from peer to peer transfers to merchant settlement.',
    responsibilities: [
      'Define the limits, fees and disclosures and defend them publicly.',
      'Work with partner banks and the compliance team as one group.',
      'Decide what not to build when it needs data we refuse to collect.',
    ],
    requirements: ['Fintech product experience', 'Comfort with regulation as a design input', 'Written communication over decks'],
  },
  {
    id: 'policy-counsel',
    title: 'Privacy Counsel',
    department: 'Policy & Legal',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    salary: '100–140k',
    summary: 'Advise product teams on data minimisation and represent us in regulatory conversations.',
    responsibilities: [
      'Review new features against GDPR, DPDP and equivalents.',
      'Own the transparency report and lawful access process.',
      'Push back internally when a shortcut would cost user trust.',
    ],
    requirements: ['Qualified lawyer with privacy specialism', 'Experience with cross border data transfers', 'Plain language drafting'],
  },
  {
    id: 'policy-comms',
    title: 'Public Policy Manager',
    department: 'Policy & Legal',
    location: 'Distributed team',
    type: 'Full-time',
    level: 'Mid',
    salary: '105–140k',
    summary: 'Engage regulators worldwide on encryption, payments and platform rules.',
    responsibilities: [
      'Build relationships before there is a crisis, not during one.',
      'Translate technical constraints into policy language.',
      'Coordinate submissions on consultations that affect encryption.',
    ],
    requirements: ['Policy or regulatory affairs background', 'Multi market regulatory knowledge', 'Genuinely understands how E2EE works'],
  },
  {
    id: 'support-lead',
    title: 'Support Operations Lead',
    department: 'Support',
    location: 'Remote (flexible hours)',
    type: 'Full-time',
    level: 'Mid',
    salary: '55–75k',
    summary: 'Run the team that answers people when payments, accounts or bans go wrong.',
    responsibilities: [
      'Own first response and resolution targets across regions.',
      'Turn recurring tickets into product bugs with real owners.',
      'Keep escalation paths short enough to actually work.',
    ],
    requirements: ['Support leadership at scale', 'Data led queue management', 'Patience with genuinely hard cases'],
  },
]

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'roles', label: 'Open roles', icon: <FiBriefcase /> },
  { id: 'benefits', label: 'Benefits', icon: <FiHeart /> },
  { id: 'process', label: 'Hiring process', icon: <FiActivity /> },
  { id: 'life', label: 'Life here', icon: <FiUsers /> },
  { id: 'faq', label: 'FAQ', icon: <FiMessageSquare /> },
]

const STATS = [
  { value: 12, label: 'Open roles', icon: <FiBriefcase />, hint: 'Across six teams, every one of them remote.' },
  { value: 100, suffix: '%', label: 'Fully remote', icon: <FiHome />, hint: 'Remote is the default, not a lesser tier.' },
  { value: 14, label: 'Timezones covered', icon: <FiGlobe />, hint: 'Plus a home office stipend wherever you are based.' },
  { value: 4.6, decimals: 1, label: 'Average tenure (years)', icon: <FiAward />, hint: 'People tend to stay and finish things.' },
]

const BENEFITS = [
  { icon: <FiHome />, title: 'Remote by default', desc: 'Work from anywhere in your team’s timezone band. There is no office to commute to and no relocation attached to any role.' },
  { icon: <FiDollarSign />, title: 'Transparent bands', desc: 'Every posting shows its salary range up front, and the band does not move based on how hard you negotiate.' },
  { icon: <FiHeart />, title: 'Health cover for the family', desc: 'Comprehensive medical, dental and mental health cover for you, a partner and dependants from day one.' },
  { icon: <FiClock />, title: '30 days off, taken seriously', desc: 'Thirty days plus public holidays, with a two week minimum the company actually enforces.' },
  { icon: <FiBookOpen />, title: 'Learning budget', desc: '2,500 a year for conferences, courses or books, with no approval theatre attached to it.' },
  { icon: <FiShield />, title: 'Security first equipment', desc: 'Hardware keys, a managed laptop and a device refresh every three years, all provided.' },
  { icon: <FiUsers />, title: 'Parental leave', desc: 'Six months fully paid for any parent, plus a phased return over the following month.' },
  { icon: <FiZap />, title: 'Focus Fridays', desc: 'No recurring meetings company wide on Fridays. It has held for four years.' },
  { icon: <FiGlobe />, title: 'Home office budget', desc: 'A setup allowance for desk, chair and connectivity, plus a co working stipend wherever you are based.' },
]

const PROCESS = [
  { icon: <FiSend />, title: 'Apply', desc: 'One form, no cover letter required. A human reads every application within five working days.' },
  { icon: <FiMessageSquare />, title: 'Intro call', desc: '45 minutes with the hiring manager on what the role actually involves and what you want next.' },
  { icon: <FiActivity />, title: 'Craft interview', desc: 'A paid take home or a live session your choice. Scoped to four hours, never a weekend project.' },
  { icon: <FiCheckCircle />, title: 'Team and offer', desc: 'Two conversations with the team, then a decision within three days. The band is the band.' },
]

const VOICES = [
  { quote: 'The take home was paid and capped at four hours. That single detail told me more about the company than the careers page did.', name: 'Meera Kapoor', role: 'Android Engineer, 2 years' },
  { quote: 'I have turned down features here because they needed data we refuse to collect. Nobody overruled me. That is rare.', name: 'Anders Holm', role: 'Product Manager, 4 years' },
  { quote: 'Focus Fridays are real. Four years in and my calendar has never had a recurring Friday meeting on it.', name: 'Fatima Bello', role: 'SRE, 3 years' },
  { quote: 'Salary bands are published and fixed. I did not have to negotiate to get paid the same as the person beside me.', name: 'Diego Ramos', role: 'Designer, 1 year' },
  { quote: 'We publish audit findings including the bad ones. Being able to point at that in public is why I joined.', name: 'Yuki Tanaka', role: 'Security Researcher, 5 years' },
  { quote: 'Six months of parental leave, fully paid, and a phased return. I came back to my actual job, not a sidelined version.', name: 'Clara Nunes', role: 'Support Lead, 3 years' },
]

const FAQS = [
  { q: 'Do you hire internationally?', a: 'Yes. Every role is remote first, so there is nowhere to move to we handle employment and payroll wherever you already are, and we sort that out before you sign, not after.', tag: 'Hiring' },
  { q: 'Is the take home paid?', a: 'Always. It is scoped to four hours, we pay a flat fee at a senior contractor rate, and you can choose a live session instead if you prefer.', tag: 'Process' },
  { q: 'Can I work fully remote?', a: 'Every role is remote you only need to keep a workable overlap with your team’s timezone band. There is no office tier and no in person requirement.', tag: 'Remote' },
  { q: 'Are salary bands negotiable?', a: 'The band is published and fixed. Where you land inside it depends on levelling, not on how hard you push, and we tell you the level before the offer.', tag: 'Pay' },
  { q: 'How long does the process take?', a: 'Typically three weeks from application to offer. If it is going to take longer, your recruiter tells you why rather than going quiet.', tag: 'Process' },
  { q: 'Do you hire junior engineers?', a: 'Yes, in cohorts twice a year rather than continuously, so there is a proper mentoring structure waiting instead of a desk and good luck.', tag: 'Levels' },
  { q: 'What happens to my application data?', a: 'It is stored encrypted, visible only to the hiring panel, and deleted after twelve months unless you ask us to keep it for future roles.', tag: 'Privacy' },
  { q: 'Can I reapply if I am rejected?', a: 'After six months, or immediately for a different team. Rejection feedback is written and specific we do not send template emails.', tag: 'Hiring' },
]

const RELATED = [
  { to: '/about', label: 'About', desc: 'Our mission, story and the no ads charter.', icon: <FiCompass /> },
  { to: '/contact', label: 'Contact', desc: 'Questions about a role or the process.', icon: <FiMessageSquare /> },
  { to: '/community', label: 'Community', desc: 'Forums, events and the ambassador programme.', icon: <FiUsers /> },
  { to: '/blog', label: 'Blog', desc: 'Engineering write ups from the teams hiring.', icon: <FiBookOpen /> },
]

export function CareersPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [department, setDepartment] = useState('All')
  const [query, setQuery] = useState('')
  const [openRole, setOpenRole] = useState(null)
  const [applying, setApplying] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', link: '', note: '' })
  const [submitted, setSubmitted] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return ROLES.filter((role) => {
      const matchesDept = department === 'All' || role.department === department
      const matchesTerm =
        !term ||
        role.title.toLowerCase().includes(term) ||
        role.location.toLowerCase().includes(term) ||
        role.summary.toLowerCase().includes(term)
      return matchesDept && matchesTerm
    })
  }, [department, query])

  const chips = DEPARTMENTS.map((label) => ({
    label,
    count: label === 'All' ? ROLES.length : ROLES.filter((role) => role.department === label).length,
  }))

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
    setSubmitted({ role: openRole.title, ref: `KT-${openRole.id.toUpperCase()}-${form.name.trim().split(' ')[0].toUpperCase()}` })
    setApplying(false)
    setOpenRole(null)
    setForm({ name: '', email: '', link: '', note: '' })
  }

  return (
    <MainLayout>
      <PageHero
        badge={
          <>
            <FiBriefcase /> {t('12 open roles · fully remote')}
          </>
        }
        title={t('Careers at')}
        highlight="KT Messenger"
        description={t('Build private messaging for two billion people, at a company whose business model does not depend on reading any of it.')}
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('Browse open roles')} <FiChevronRight />
            </Button>
            <Button size="lg" variant="onDark" onClick={() => { navigate('/about'); window.scrollTo(0, 0) }}>
              {t('About the company')}
            </Button>
          </>
        }
        chips={[
          { icon: <FiDollarSign />, label: t('Published salary bands') },
          { icon: <FiHome />, label: t('Remote by default') },
          { icon: <FiCheckCircle />, label: t('Paid take home, 4h cap') },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-300">{t('Latest openings')}</span>
            <ul className="mt-5 space-y-3">
              {ROLES.slice(0, 4).map((role) => (
                <li key={role.id}>
                  <button
                    type="button"
                    onClick={() => setOpenRole(role)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-left transition-colors hover:border-sky-400/40 hover:bg-white/[0.07]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-white">{t(role.title)}</span>
                      <span className="block truncate text-[10px] font-semibold text-slate-400">
                        {t(role.department)} · {t(role.location)}
                      </span>
                    </span>
                    <FiChevronRight className="shrink-0 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-slate-400">
              {t('Every application is read by a person within five working days. Rejections come with written feedback.')}
            </p>
          </div>
        }
      >
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">
          <FiSearch className="ml-3 shrink-0 text-xl text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('Search by title, team or location…')}
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-2 shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              {t('Clear')}
            </button>
          ) : null}
        </div>
      </PageHero>

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* OPEN ROLES */}
      <div id="roles" className="scroll-mt-36">
        <FilterBar
          chips={chips}
          active={department}
          onChange={setDepartment}
          query={query}
          onQuery={setQuery}
          placeholder={t('Search roles…')}
        />

        <Section className="bg-surface">
          <SectionHead
            eyebrow={`${filtered.length} ${filtered.length === 1 ? t('role') : t('roles')}`}
            title={department === 'All' ? t('Every open position') : t(department)}
            description={t('Salary bands are published on each posting and are not adjusted by negotiation.')}
          />

          {filtered.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<FiSearch />}
                title={t('No roles match')}
                description={t('Try another team, or clear the search to see all 12 openings.')}
                action={
                  <Button variant="secondary" onClick={() => { setDepartment('All'); setQuery('') }}>
                    {t('Reset filters')}
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="mt-12 space-y-4">
              {filtered.map((role, index) => (
                <Reveal key={role.id} from="up" delay={Math.min(index * 0.04, 0.2)}>
                  <article className="group rounded-[24px] border border-line bg-cream p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-card sm:p-6 dark:bg-cream-2">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                            {t(role.department)}
                          </span>
                          <span className="rounded-full border border-line bg-surface px-3 py-1 text-[10px] font-bold text-muted">
                            {t(role.level)}
                          </span>
                        </div>

                        <h3 className="mt-3 text-lg font-extrabold leading-snug text-ink">{t(role.title)}</h3>
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-body">{t(role.summary)}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold text-muted">
                          <span className="flex items-center gap-1.5">
                            <FiMapPin /> {t(role.location)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FiClock /> {t(role.type)}
                          </span>
                          <span className="flex items-center gap-1.5 text-brand-ink">
                            <FiDollarSign /> {role.salary}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2.5">
                        <Button variant="secondary" onClick={() => setOpenRole(role)}>
                          {t('Details')}
                        </Button>
                        <Button
                          onClick={() => {
                            setOpenRole(role)
                            setApplying(true)
                          }}
                        >
                          {t('Apply')} <FiSend />
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* BENEFITS */}
      <Section id="benefits" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow={t('Benefits')}
          title={t('Nine things you get, stated precisely')}
          description={t('No vague wellness language these are the actual numbers and policies.')}
        />
        <FeatureGrid className="mt-12" items={BENEFITS} />
      </Section>

      {/* PROCESS */}
      <Section id="process" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow={t('Hiring process')}
          title={t('Four steps, about three weeks')}
          description={t('No surprise rounds, no unpaid weekend projects, no silence between stages.')}
        />
        <Steps className="mt-12" items={PROCESS} />

        <Reveal from="up" className="mx-auto mt-12 max-w-3xl rounded-[24px] border border-line bg-cream p-6 dark:bg-cream-2">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-body">
            <FiShield className="mt-0.5 shrink-0 text-lg text-brand-strong" />
            {t('Your application data is stored encrypted, visible only to the hiring panel, and deleted after twelve months unless you ask us to keep it on file. We never run it through an automated screening model.')}
          </p>
        </Reveal>
      </Section>

      {/* LIFE */}
      <Section id="life" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead eyebrow={t('Life here')} title={t('What people say six months in')} />
        <Testimonials className="mt-12" items={VOICES} />
      </Section>

      {/* FAQ */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow={t('FAQ')} title={t('Questions candidates actually ask')} />
          <div className="mt-12">
            <FaqAccordion items={FAQS} placeholder={t('Search the FAQ…')} />
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={t('Apply')}
        title={t('Nothing here fits? Tell us anyway')}
        description={t('We open roles continuously. A short note about what you do well is enough no cover letter required.')}
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('Browse open roles')}
            </Button>
            <Button size="lg" variant="onDark" onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }}>
              {t('Contact the team')}
            </Button>
          </>
        }
        points={[t('Read within 5 working days'), t('Written feedback'), t('Paid take home'), t('Published bands')]}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow={t('Keep exploring')} title={t('More about KT Messenger')} />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      {/* ROLE DETAIL MODAL */}
      <Modal
        open={Boolean(openRole) && !applying}
        onClose={() => setOpenRole(null)}
        eyebrow={openRole ? `${t(openRole.department)} · ${t(openRole.level)}` : ''}
        title={openRole ? t(openRole.title) : undefined}
        size="lg"
        footer={
          openRole ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-black text-ink">{openRole.salary}</span>
              <Button onClick={() => setApplying(true)}>
                {t('Apply for this role')} <FiSend />
              </Button>
            </div>
          ) : null
        }
      >
        {openRole ? (
          <div>
            <div className="flex flex-wrap gap-2">
              {[openRole.location, openRole.type, openRole.level].map((tag) => (
                <span key={tag} className="rounded-full border border-line bg-cream px-3 py-1 text-[11px] font-bold text-muted dark:bg-cream-2">
                  {t(tag)}
                </span>
              ))}
            </div>

            <p className="mt-5 text-base font-semibold leading-relaxed text-ink">{t(openRole.summary)}</p>

            <h4 className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-muted">{t('What you will own')}</h4>
            <ul className="mt-3 space-y-2.5">
              {openRole.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-brand-strong" />
                  {t(item)}
                </li>
              ))}
            </ul>

            <h4 className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-muted">{t('What we are looking for')}</h4>
            <ul className="mt-3 space-y-2.5">
              {openRole.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-strong" />
                  {t(item)}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-2xl border border-line bg-cream p-4 dark:bg-cream-2">
              <p className="text-xs leading-relaxed text-body">
                <strong className="text-ink">{t('Salary band:')} {openRole.salary}.</strong> {t('Published up front and fixed where you land inside it depends on levelling, which we confirm before any offer.')}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* APPLICATION MODAL */}
      <Modal
        open={applying}
        onClose={() => setApplying(false)}
        eyebrow={t('Application')}
        title={openRole ? t(openRole.title) : undefined}
        size="md"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
              <FiShield /> {t('Stored encrypted, panel only')}
            </span>
            <Button type="submit" form="application-form">
              {t('Submit application')} <FiSend />
            </Button>
          </div>
        }
      >
        <form id="application-form" onSubmit={submitApplication} noValidate>
          <label htmlFor="app-name" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
            {t('Full name')}
          </label>
          <input
            id="app-name"
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder={t('Your name')}
            className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted dark:bg-cream-2"
          />

          <label htmlFor="app-email" className="mb-1.5 mt-5 block text-[11px] font-black uppercase tracking-wide text-muted">
            {t('Email')}
          </label>
          <input
            id="app-email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
            className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted dark:bg-cream-2"
          />

          <label htmlFor="app-link" className="mb-1.5 mt-5 block text-[11px] font-black uppercase tracking-wide text-muted">
            {t('Portfolio, GitHub or LinkedIn (optional)')}
          </label>
          <input
            id="app-link"
            type="text"
            value={form.link}
            onChange={(event) => setForm({ ...form, link: event.target.value })}
            placeholder="github.com/yourname"
            className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm font-semibold text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted dark:bg-cream-2"
          />

          <label htmlFor="app-note" className="mb-1.5 mt-5 block text-[11px] font-black uppercase tracking-wide text-muted">
            {t('Anything you want the panel to know (optional)')}
          </label>
          <textarea
            id="app-note"
            rows={4}
            value={form.note}
            onChange={(event) => setForm({ ...form, note: event.target.value })}
            placeholder={t('No cover letter needed a few honest sentences is plenty.')}
            className="w-full resize-none rounded-2xl border border-line bg-cream p-4 text-sm font-semibold leading-relaxed text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted dark:bg-cream-2"
          />
        </form>
      </Modal>

      {/* CONFIRMATION MODAL */}
      <Modal
        open={Boolean(submitted)}
        onClose={() => setSubmitted(null)}
        eyebrow={t('Application received')}
        title={t('Thanks that is all we need')}
        size="sm"
        footer={<Button className="w-full justify-center" onClick={() => setSubmitted(null)}>{t('Done')}</Button>}
      >
        {submitted ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/12 text-3xl text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle />
            </span>
            <h3 className="mt-5 text-lg font-extrabold text-ink">{t(submitted.role)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              {t('A person on the hiring panel will read this within five working days. If it is not a fit you will get written feedback, not a template.')}
            </p>
            <p className="mt-5 rounded-2xl border border-line bg-cream px-4 py-3 font-mono text-xs font-black text-ink dark:bg-cream-2">
              {submitted.ref}
            </p>
          </div>
        ) : null}
      </Modal>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}

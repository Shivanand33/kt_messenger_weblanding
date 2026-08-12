import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiAward,
  FiChevronRight,
  FiCompass,
  FiEye,
  FiFlag,
  FiGlobe,
  FiHeart,
  FiLock,
  FiMapPin,
  FiMessageSquare,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PageHero } from '../../components/feature/PageHero'
import { PageNav } from '../../components/feature/PageNav'
import { StatStrip } from '../../components/feature/StatStrip'
import { SectionHead } from '../../components/feature/SectionHead'
import { FeatureGrid } from '../../components/feature/FeatureGrid'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { useModal } from '../../context/ModalContext'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'mission', label: 'Mission', icon: <FiFlag /> },
  { id: 'story', label: 'Our story', icon: <FiTrendingUp /> },
  { id: 'values', label: 'Values', icon: <FiHeart /> },
  { id: 'team', label: 'Leadership', icon: <FiUsers /> },
  { id: 'offices', label: 'Offices', icon: <FiMapPin /> },
]

const STATS = [
  { value: 2, suffix: 'B+', label: 'People reached', icon: <FiUsers />, hint: 'Messages delivered across 180 countries.' },
  { value: 180, label: 'Countries served', icon: <FiGlobe />, hint: 'Localised in 60 languages and counting.' },
  { value: 1200, label: 'People on the team', icon: <FiAward />, hint: 'Across 14 offices and fully remote roles.' },
  { value: 2018, label: 'Founded', icon: <FiFlag />, hint: 'Built independently, funded by subscriptions.' },
]

const VALUES = [
  {
    icon: <FiLock />,
    title: 'Privacy is the product',
    desc: 'Encryption is never a paid tier or a toggle buried in settings. If a feature cannot be built privately, we do not ship it.',
  },
  {
    icon: <FiEye />,
    title: 'No surveillance business model',
    desc: 'We sell subscriptions and business tools. We do not sell ads, profiles, or anything derived from your conversations.',
  },
  {
    icon: <FiShield />,
    title: 'Say what the software actually does',
    desc: 'Our security claims are specific and auditable. Where there is a tradeoff — like unrecoverable vaults — we write it down.',
  },
  {
    icon: <FiZap />,
    title: 'Fast on the phone people own',
    desc: 'We optimise for a mid-range Android on a patchy network, not a flagship on office wifi. That is the real test.',
  },
  {
    icon: <FiHeart />,
    title: 'Design for the whole family',
    desc: 'A messaging app fails if it only works for the technically confident. Defaults have to be safe for everyone.',
  },
  {
    icon: <FiGlobe />,
    title: 'Local before global',
    desc: 'Payments, languages and regulation differ everywhere. We build regionally and generalise afterwards, not the reverse.',
  },
]

const TIMELINE = [
  {
    year: '2018',
    title: 'The first prototype',
    desc: 'Four engineers, one question: could a Signal-grade encrypted messenger feel as effortless as an unencrypted one?',
  },
  {
    year: '2019',
    title: 'Public beta and a hard rule',
    desc: 'We shipped to 50,000 testers and committed publicly to never running an advertising business.',
  },
  {
    year: '2021',
    title: 'Calls, groups and multi-device',
    desc: 'Encrypted group calling launched alongside linked devices, so a laptop no longer needed the phone to be online.',
  },
  {
    year: '2023',
    title: 'Payments arrive',
    desc: 'KT Wallet launched with zero-fee peer-to-peer transfers and passkey approval on every payment.',
  },
  {
    year: '2025',
    title: 'On-device intelligence',
    desc: 'KT AI Co-Pilot shipped with translation and summaries running on the handset, keeping prompts inside the encrypted envelope.',
  },
  {
    year: '2026',
    title: 'News, Markets, Marketplace, Notes',
    desc: 'Four new surfaces landed inside chat — reading, tracking, buying and note-taking without leaving the conversation.',
  },
]

const LEADERSHIP = [
  { name: 'Kavya Trivedi', role: 'Co-founder & CEO', focus: 'Product direction and the no-ads commitment.' },
  { name: 'Tomas Lindberg', role: 'Co-founder & CTO', focus: 'Protocol design, cryptography and platform reliability.' },
  { name: 'Amara Nwosu', role: 'Chief Privacy Officer', focus: 'Data minimisation, audits and regulatory engagement.' },
  { name: 'Rohan Iyer', role: 'VP Engineering', focus: 'Client performance on low-end devices and weak networks.' },
  { name: 'Sofia Marchetti', role: 'VP Design', focus: 'Defaults that stay safe for people who never open settings.' },
  { name: 'Daniel Park', role: 'VP Payments', focus: 'Wallet, escrow and partner bank relationships.' },
  { name: 'Nadia Rahman', role: 'Head of Security Research', focus: 'Bug bounty, red-teaming and third-party audits.' },
  { name: 'Lucas Ferreira', role: 'Head of Community', focus: 'Ambassadors, forums and the beta programme.' },
]

const OFFICES = [
  { city: 'Bengaluru', country: 'India', team: 'Engineering · Payments', flag: '🇮🇳' },
  { city: 'Stockholm', country: 'Sweden', team: 'Protocol · Security', flag: '🇸🇪' },
  { city: 'Lisbon', country: 'Portugal', team: 'Design · Research', flag: '🇵🇹' },
  { city: 'Singapore', country: 'Singapore', team: 'APAC operations', flag: '🇸🇬' },
  { city: 'São Paulo', country: 'Brazil', team: 'LATAM growth', flag: '🇧🇷' },
  { city: 'Nairobi', country: 'Kenya', team: 'Africa partnerships', flag: '🇰🇪' },
  { city: 'Berlin', country: 'Germany', team: 'Policy · Legal', flag: '🇩🇪' },
  { city: 'Remote', country: 'Worldwide', team: '38% of the company', flag: '🌍' },
]

const RELATED = [
  { to: '/careers', label: 'Careers', desc: 'Open roles across engineering, design and policy.', icon: <FiUsers /> },
  { to: '/brand', label: 'Brand Center', desc: 'Logos, colours and usage guidelines.', icon: <FiAward /> },
  { to: '/privacy', label: 'Privacy', desc: 'How encryption works and what we never collect.', icon: <FiLock /> },
  { to: '/blog', label: 'Blog', desc: 'Product updates and engineering write-ups.', icon: <FiMessageSquare /> },
]

export function AboutPage() {
  const { openDownloadModal } = useModal()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const goTo = (path) => {
    navigate(path)
    window.scrollTo(0, 0)
  }

  return (
    <MainLayout>
      <PageHero
        badge={
          <>
            <FiFlag /> Independent since 2018
          </>
        }
        title="About"
        highlight="KT Messenger"
        description="We build private messaging for two billion people — and we fund it with subscriptions, not with what you say to your family."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}>
              Read our mission <FiChevronRight />
            </Button>
            <Button size="lg" variant="secondary" onClick={openDownloadModal}>
              Get the app <FiZap />
            </Button>
          </>
        }
        chips={[
          { icon: <FiLock />, label: 'End-to-end encrypted by default' },
          { icon: <FiEye />, label: 'No advertising business' },
          { icon: <FiGlobe />, label: '180 countries' },
        ]}
        aside={
          <div className="rounded-[28px] border border-line dark:border-white/10 bg-surface dark:bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-strong dark:text-sky-300">What we refuse to do</span>
            <ul className="mt-5 space-y-4">
              {[
                'Sell advertising against your conversations.',
                'Build a profile of who you talk to or when.',
                'Add a backdoor for anyone, under any label.',
                'Charge extra for encryption or safety features.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-body dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500 dark:bg-rose-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line dark:border-white/10 pt-5 text-xs leading-relaxed text-muted dark:text-slate-400">
              These four lines have been in our charter since 2019 and require a board supermajority to change.
            </p>
          </div>
        }
      />

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* MISSION */}
      <Section id="mission" className="scroll-mt-36 bg-surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHead
            align="left"
            eyebrow="Mission"
            title="Private conversation should be the default, not the upgrade"
            description="Most of the world's messaging runs on infrastructure that reads it. We think that is a design choice, not a law of physics — so we set out to prove an encrypted messenger could also be the fastest and friendliest one on the phone."
          >
            <div className="mt-8 space-y-4">
              {[
                {
                  title: 'Encryption with nothing to opt into',
                  desc: 'Every chat, call, note and payment note is end-to-end encrypted from the first message. There is no setting to find.',
                },
                {
                  title: 'A business model that stays out of the way',
                  desc: 'Subscriptions and business tools pay for the company. Nothing about your conversations is for sale.',
                },
                {
                  title: 'Built to be checked',
                  desc: 'Protocol specs are public, clients are reproducible, and third-party audits are published in full — including findings.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-line bg-cream p-5 dark:bg-cream-2">
                  <h3 className="text-sm font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{item.desc}</p>
                </div>
              ))}
            </div>
          </SectionHead>

          <Reveal from="scale" delay={0.08}>
            <div className="rounded-[28px] border border-line bg-cream p-8 shadow-card dark:bg-cream-2">
              <span className="text-6xl leading-none text-brand-strong">“</span>
              <blockquote className="-mt-4 text-lg font-semibold leading-relaxed text-ink sm:text-xl">
                We had one rule when we started: if a feature only works by reading people&apos;s messages, it does not
                get built. Eight years later that rule has cost us a lot of revenue and exactly zero customers.
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-strong text-sm font-black text-white">
                  K
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-ink">Kavya Trivedi</span>
                  <span className="block text-xs font-semibold text-muted">Co-founder &amp; CEO</span>
                </span>
              </figcaption>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* STORY / TIMELINE */}
      <Section id="story" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Our story"
          title="Eight years, one constraint"
          description="Every milestone below had to clear the same bar: does it work without us reading anything?"
        />

        <ol className="mt-14 relative mx-auto max-w-3xl">
          <span className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-line sm:left-[23px]" aria-hidden="true" />
          {TIMELINE.map((item, index) => (
            <Reveal as="li" key={item.year} from="up" delay={index * 0.05} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
              <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-brand-strong bg-surface text-[11px] font-black text-brand-ink sm:h-12 sm:w-12 sm:text-xs">
                {item.year}
              </span>
              <div className="min-w-0 flex-1 rounded-[22px] border border-line bg-surface p-5 shadow-soft">
                <h3 className="text-base font-extrabold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* VALUES */}
      <Section id="values" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Values"
          title="Six principles we actually argue about"
          description="These are the tiebreakers in real product reviews, not poster copy."
        />
        <FeatureGrid className="mt-12" items={VALUES} />
      </Section>

      {/* LEADERSHIP */}
      <Section id="team" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Leadership"
          title="Who makes the calls"
          description="A small team with long tenure — the median leader here has been building this for six years."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((person, index) => (
            <Reveal key={person.name} from="up" delay={Math.min(index * 0.04, 0.24)} className="h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-strong text-lg font-black text-white">
                  {person.name.split(' ').map((part) => part.charAt(0)).join('')}
                </span>
                <h3 className="mt-4 text-sm font-extrabold text-ink">{person.name}</h3>
                <p className="text-[11px] font-bold text-brand-ink">{person.role}</p>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-body">{person.focus}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* OFFICES */}
      <Section id="offices" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Offices"
          title="Fourteen offices, and a lot of kitchen tables"
          description="Just over a third of the company is fully remote. Where you sit has never decided what you get to work on."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((office, index) => (
            <Reveal key={office.city} from="up" delay={Math.min(index * 0.04, 0.24)} className="h-full">
              <div className="flex h-full items-start gap-4 rounded-[24px] border border-line bg-cream p-5 shadow-soft dark:bg-cream-2">
                <span className="text-3xl leading-none">{office.flag}</span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold text-ink">{office.city}</h3>
                  <p className="truncate text-[11px] font-semibold text-muted">{office.country}</p>
                  <p className="mt-1.5 text-[11px] font-bold text-brand-ink">{office.team}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        eyebrow="Join us"
        title="We are hiring across engineering, design and policy"
        description="If the constraint in our mission sounds like the interesting part of the job rather than the annoying part, we should talk."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => goTo('/careers')}>
              See open roles
            </Button>
            <Button size="lg" variant="onDark" onClick={() => goTo('/contact')}>
              Contact the team
            </Button>
          </>
        }
        points={['No-ads charter', 'Published audits', '38% fully remote', 'Founded 2018']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More about KT Messenger" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>
    </MainLayout>
  )
}

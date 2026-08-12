import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiChevronRight,
  FiCompass,
  FiFacebook,
  FiGithub,
  FiGlobe,
  FiHeart,
  FiInstagram,
  FiLinkedin,
  FiMapPin,
  FiMessageCircle,
  FiMessageSquare,
  FiMic,
  FiSearch,
  FiShield,
  FiStar,
  FiTwitter,
  FiUsers,
  FiYoutube,
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
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Toast } from '../../components/feature/Toast'
import { EmptyState } from '../../components/feature/EmptyState'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'social', label: 'Official channels', icon: <FiGlobe /> },
  { id: 'forums', label: 'Forums', icon: <FiMessageCircle /> },
  { id: 'events', label: 'Events', icon: <FiCalendar /> },
  { id: 'ambassadors', label: 'Ambassadors', icon: <FiAward /> },
  { id: 'beta', label: 'Beta programme', icon: <FiZap /> },
  { id: 'guidelines', label: 'Guidelines', icon: <FiShield /> },
  { id: 'faq', label: 'FAQ', icon: <FiMessageSquare /> },
]

const STATS = [
  { value: 480, suffix: 'k', label: 'Community members', icon: <FiUsers />, hint: 'Across forums, channels and local groups.' },
  { value: 62, label: 'Local chapters', icon: <FiMapPin />, hint: 'Volunteer-run meetups in 34 countries.' },
  { value: 340, label: 'Ambassadors', icon: <FiAward />, hint: 'Answering questions in 28 languages.' },
  { value: 26, label: 'Events this year', icon: <FiCalendar />, hint: 'Meetups, AMAs and security workshops.' },
]

// The footer's social icons deep-link into this section.
const CHANNELS = [
  { name: 'X (Twitter)', handle: '@ktmessenger', icon: <FiTwitter />, desc: 'Release notes, incident updates and the occasional protocol thread.', members: '1.2M followers' },
  { name: 'Instagram', handle: '@ktmessenger', icon: <FiInstagram />, desc: 'Product walkthroughs, design process and team introductions.', members: '640k followers' },
  { name: 'YouTube', handle: '/ktmessenger', icon: <FiYoutube />, desc: 'Feature deep-dives, conference talks and security explainers.', members: '310k subscribers' },
  { name: 'Facebook', handle: '/ktmessenger', icon: <FiFacebook />, desc: 'Regional announcements and community group coordination.', members: '890k followers' },
  { name: 'LinkedIn', handle: '/company/ktmessenger', icon: <FiLinkedin />, desc: 'Hiring updates, engineering culture and company news.', members: '215k followers' },
  { name: 'GitHub', handle: '/ktmessenger', icon: <FiGithub />, desc: 'Protocol specs, client SDKs and reproducible build tooling.', members: '48k stars' },
]

const FORUM_CATEGORIES = ['All', 'Getting started', 'Privacy & security', 'Payments', 'Developers', 'Feature requests']

const FORUMS = [
  { id: 1, title: 'How do linked devices stay encrypted?', category: 'Privacy & security', replies: 148, views: '24.1k', tag: 'Answered', author: 'nadia_r' },
  { id: 2, title: 'Best practice for storing recovery shares', category: 'Privacy & security', replies: 96, views: '18.7k', tag: 'Pinned', author: 'jonas_m' },
  { id: 3, title: 'Wallet settlement timing for merchants', category: 'Payments', replies: 72, views: '11.4k', tag: 'Answered', author: 'farhan_a' },
  { id: 4, title: 'Escrow release when a courier marks delivered early', category: 'Payments', replies: 54, views: '8.9k', tag: 'Open', author: 'divya_k' },
  { id: 5, title: 'Migrating chat history between Android and iOS', category: 'Getting started', replies: 210, views: '41.3k', tag: 'Answered', author: 'meera_n' },
  { id: 6, title: 'Notifications stop after battery optimisation kicks in', category: 'Getting started', replies: 183, views: '36.8k', tag: 'Answered', author: 'kabir_s' },
  { id: 7, title: 'Rate limits on the Business Platform API', category: 'Developers', replies: 61, views: '9.2k', tag: 'Answered', author: 'tomas_l' },
  { id: 8, title: 'Reproducible builds — verifying the Android APK', category: 'Developers', replies: 88, views: '14.6k', tag: 'Pinned', author: 'grace_w' },
  { id: 9, title: 'Webhook retries and idempotency keys', category: 'Developers', replies: 37, views: '5.8k', tag: 'Open', author: 'daniel_p' },
  { id: 10, title: 'Please add per-chat notification schedules', category: 'Feature requests', replies: 412, views: '58.2k', tag: 'Under review', author: 'ananya_i' },
  { id: 11, title: 'Scheduled messages without a background service', category: 'Feature requests', replies: 267, views: '33.9k', tag: 'Under review', author: 'oliver_g' },
  { id: 12, title: 'Multi-account support on one device', category: 'Feature requests', replies: 329, views: '47.5k', tag: 'Planned', author: 'sana_q' },
]

const EVENTS = [
  { date: '14 Aug', title: 'Encryption 101 workshop', city: 'Online', type: 'Workshop', seats: '120 seats left', desc: 'A hands-on walkthrough of the double ratchet, run by the protocol team.' },
  { date: '22 Aug', title: 'Bengaluru community meetup', city: 'Bengaluru', type: 'Meetup', seats: '38 seats left', desc: 'Talks from the payments team, then an open floor and food.' },
  { date: '05 Sep', title: 'Ask Me Anything: security research', city: 'Online', type: 'AMA', seats: 'Unlimited', desc: 'Our red team answers anything about how they break the clients.' },
  { date: '19 Sep', title: 'Developer day — Business Platform', city: 'Singapore', type: 'Conference', seats: '64 seats left', desc: 'API deep-dives, webhook patterns and a live migration clinic.' },
  { date: '02 Oct', title: 'Lisbon design jam', city: 'Lisbon', type: 'Meetup', seats: '25 seats left', desc: 'Redesign a real KT surface with the design team in the room.' },
  { date: '17 Oct', title: 'Privacy policy roundtable', city: 'Berlin', type: 'Roundtable', seats: 'Invite only', desc: 'Regulators, researchers and our policy team, on the record.' },
]

const AMBASSADOR_PERKS = [
  { icon: <FiAward />, title: 'Direct line to the product teams', desc: 'A private channel with the people who build the features you answer questions about.' },
  { icon: <FiZap />, title: 'Early builds', desc: 'Ambassador builds land two releases ahead of public beta, with a changelog that explains why.' },
  { icon: <FiMic />, title: 'A real say in the roadmap', desc: 'Quarterly sessions where ambassador feedback is read into the planning docs, with outcomes published.' },
  { icon: <FiHeart />, title: 'Event support', desc: 'Travel and venue costs covered for chapter meetups, plus swag that people actually keep.' },
  { icon: <FiUsers />, title: 'Training and materials', desc: 'Workshop decks, translated help content and a moderation playbook you can adapt locally.' },
  { icon: <FiStar />, title: 'Public recognition', desc: 'A verified ambassador badge in forums, and credit on the release notes you helped shape.' },
]

const GUIDELINES = [
  { title: 'Be useful before being right', desc: 'Answer the question that was asked. Correcting someone’s terminology without helping them is not a contribution.' },
  { title: 'Never ask for credentials', desc: 'No ambassador, moderator or employee will ever ask for a code, passphrase or recovery share. Report anyone who does.' },
  { title: 'Report bugs, do not exploit them', desc: 'Security findings go through the disclosure process, not the forums. There is a bounty for a reason.' },
  { title: 'No spam, no referral farming', desc: 'Sharing a project is welcome once. Repeat promotion, affiliate links and vote-trading are removed.' },
  { title: 'Respect privacy in screenshots', desc: 'Redact names, numbers and message content before posting. Assume the person in the screenshot did not consent.' },
  { title: 'Moderation is transparent', desc: 'Every removal comes with a stated reason and an appeal route. Moderator actions are logged publicly in aggregate.' },
]

const FAQS = [
  { q: 'Is the community run by KT Messenger?', a: 'The forums and official channels are ours and staffed by employees. Local chapters are volunteer-run — we fund and support them but do not control what they discuss.', tag: 'Structure' },
  { q: 'How do I become an ambassador?', a: 'Be helpful in the forums for a few months, then apply in the ambassador thread. We look for consistency and tone, not post count, and every applicant gets a written answer.', tag: 'Ambassadors' },
  { q: 'Are events free?', a: 'Meetups, workshops and AMAs are free. Developer days charge a small deposit to cut no-shows, refunded when you attend.', tag: 'Events' },
  { q: 'Can I start a chapter in my city?', a: 'Yes. Apply through the ambassador programme with a rough plan for the first three meetups and we will cover venue and travel costs.', tag: 'Chapters' },
  { q: 'What languages are the forums in?', a: 'English is the main forum, with active sub-forums in 12 languages. Ambassadors cover 28 languages between them for direct questions.', tag: 'Languages' },
  { q: 'Do you delete critical posts?', a: 'No. Criticism stays, including about our own decisions. We remove spam, credential phishing, doxxing and unredacted screenshots — always with a stated reason.', tag: 'Moderation' },
  { q: 'How do feature requests get picked up?', a: 'Requests are reviewed monthly by the relevant product team. Status changes to Under review, Planned or Not planned, and Not planned always comes with an explanation.', tag: 'Roadmap' },
  { q: 'Can I join the beta programme?', a: 'Yes, from the beta section below. Slots are capped per platform so the feedback stays manageable, and you can leave any time without losing data.', tag: 'Beta' },
]

const RELATED = [
  { to: '/help', label: 'Help Center', desc: 'Official articles and troubleshooting guides.', icon: <FiSearch /> },
  { to: '/contact', label: 'Contact', desc: 'Reach a specific team directly.', icon: <FiMessageSquare /> },
  { to: '/about', label: 'About', desc: 'Our mission and the no-ads charter.', icon: <FiCompass /> },
  { to: '/careers', label: 'Careers', desc: 'We hire from the community regularly.', icon: <FiUsers /> },
]

const TAG_STYLES = {
  Answered: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  Pinned: 'border-brand/30 bg-brand-soft text-brand-ink',
  Open: 'border-line bg-cream text-muted dark:bg-cream-2',
  'Under review': 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
  Planned: 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300',
}

export function CommunityPage() {
  const navigate = useNavigate()

  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [following, setFollowing] = useState(['X (Twitter)', 'GitHub'])
  const [joinedEvents, setJoinedEvents] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredThreads = useMemo(() => {
    const term = query.trim().toLowerCase()
    return FORUMS.filter((thread) => {
      const matchesCategory = category === 'All' || thread.category === category
      const matchesTerm = !term || thread.title.toLowerCase().includes(term) || thread.author.toLowerCase().includes(term)
      return matchesCategory && matchesTerm
    })
  }, [category, query])

  const chips = FORUM_CATEGORIES.map((label) => ({
    label,
    count: label === 'All' ? FORUMS.length : FORUMS.filter((thread) => thread.category === label).length,
  }))

  const toggleFollow = (name) => {
    const isFollowing = following.includes(name)
    setFollowing(isFollowing ? following.filter((item) => item !== name) : [...following, name])
    setToast(isFollowing ? `Unfollowed ${name}.` : `Following ${name}.`)
  }

  const toggleEvent = (title) => {
    const joined = joinedEvents.includes(title)
    setJoinedEvents(joined ? joinedEvents.filter((item) => item !== title) : [...joinedEvents, title])
    setToast(joined ? `Left ${title}.` : `You are on the list for ${title}.`)
  }

  return (
    <MainLayout>
      <PageHero
        badge={
          <>
            <FiUsers /> 480k members · 62 chapters
          </>
        }
        title="KT"
        highlight="Community"
        description="Forums, local chapters, ambassadors and a beta programme — run in the open, with moderation that explains itself."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('forums')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse the forums <FiChevronRight />
            </Button>
            <Button size="lg" variant="onDark" onClick={() => document.getElementById('social')?.scrollIntoView({ behavior: 'smooth' })}>
              Official channels <FiGlobe />
            </Button>
          </>
        }
        chips={[
          { icon: <FiShield />, label: 'Transparent moderation' },
          { icon: <FiGlobe />, label: '28 languages covered' },
          { icon: <FiCalendar />, label: '26 events this year' },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-300">Next up</span>
            <ul className="mt-5 space-y-3">
              {EVENTS.slice(0, 3).map((event) => (
                <li key={event.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-strong text-[10px] font-black leading-tight text-white">
                    {event.date.split(' ')[0]}
                    <br />
                    {event.date.split(' ')[1]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-white">{event.title}</span>
                    <span className="block truncate text-[10px] font-semibold text-slate-400">
                      {event.city} · {event.type}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-slate-400">
              Meetups, workshops and AMAs are free. Chapter events are volunteer-run and funded by us.
            </p>
          </div>
        }
      />

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* OFFICIAL CHANNELS — footer social icons land here */}
      <Section id="social" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Official channels"
          title="Where we actually post"
          description="These six accounts are the only official ones. Anything else claiming to be us is not, and we would like to know about it."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((channel, index) => {
            const isFollowing = following.includes(channel.name)
            return (
              <Reveal key={channel.name} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
                <div className="flex h-full flex-col rounded-[24px] border border-line bg-cream p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:bg-cream-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink">
                      {channel.icon}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                      <FiCheckCircle /> Verified
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-extrabold text-ink">{channel.name}</h3>
                  <p className="font-mono text-[11px] font-bold text-brand-ink">{channel.handle}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{channel.desc}</p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <span className="text-[11px] font-bold text-muted">{channel.members}</span>
                    <button
                      type="button"
                      onClick={() => toggleFollow(channel.name)}
                      aria-pressed={isFollowing}
                      className={`rounded-full px-4 py-2 text-[11px] font-bold transition-colors ${
                        isFollowing
                          ? 'border border-brand-strong bg-brand-soft text-brand-ink'
                          : 'bg-brand-strong text-white shadow-brand hover:bg-brand-strong-hover'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* FORUMS */}
      <div id="forums" className="scroll-mt-36">
        <FilterBar
          chips={chips}
          active={category}
          onChange={setCategory}
          query={query}
          onQuery={setQuery}
          placeholder="Search threads…"
        />

        <Section className="border-y border-line bg-cream dark:bg-cream-2">
          <SectionHead
            eyebrow={`${filteredThreads.length} ${filteredThreads.length === 1 ? 'thread' : 'threads'}`}
            title={category === 'All' ? 'Community forums' : category}
            description="Answered threads are marked by a moderator. Criticism stays up — only spam and unsafe content is removed."
          />

          {filteredThreads.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<FiSearch />}
                title="No threads match"
                description="Try another category, or clear the search to see all 12 threads."
                action={
                  <Button variant="secondary" onClick={() => { setCategory('All'); setQuery('') }}>
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <Reveal from="up" className="mt-12 overflow-hidden rounded-[26px] border border-line bg-surface shadow-card">
              <ul className="divide-y divide-line">
                {filteredThreads.map((thread) => (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => setToast(`Opening “${thread.title}” in the forums.`)}
                      className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-surface-2 sm:px-6"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-sm font-black text-brand-ink">
                        {thread.author.charAt(0).toUpperCase()}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-ink">{thread.title}</span>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${TAG_STYLES[thread.tag]}`}>
                            {thread.tag}
                          </span>
                        </span>
                        <span className="mt-1 block text-[11px] font-semibold text-muted">
                          {thread.category} · by {thread.author}
                        </span>
                      </span>

                      <span className="hidden shrink-0 text-right sm:block">
                        <span className="block text-sm font-black text-ink">{thread.replies}</span>
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">replies</span>
                      </span>

                      <span className="hidden shrink-0 text-right md:block">
                        <span className="block text-sm font-black text-ink">{thread.views}</span>
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-muted">views</span>
                      </span>

                      <FiChevronRight className="shrink-0 text-muted" />
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </Section>
      </div>

      {/* EVENTS */}
      <Section id="events" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Events"
          title="Twenty-six gatherings this year"
          description="Meetups, workshops and AMAs. Free to attend — tap to add yourself to the list."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event, index) => {
            const joined = joinedEvents.includes(event.title)
            return (
              <Reveal key={event.title} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
                <article className="flex h-full flex-col rounded-[24px] border border-line bg-cream p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:bg-cream-2">
                  <div className="flex items-start gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-strong text-xs font-black leading-tight text-white">
                      {event.date.split(' ')[0]}
                      <br />
                      {event.date.split(' ')[1]}
                    </span>
                    <div className="min-w-0">
                      <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                        {event.type}
                      </span>
                      <h3 className="mt-1.5 text-base font-extrabold leading-snug text-ink">{event.title}</h3>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-body">{event.desc}</p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
                        <FiMapPin className="shrink-0" /> {event.city}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-muted">{event.seats}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleEvent(event.title)}
                      aria-pressed={joined}
                      className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-bold transition-colors ${
                        joined
                          ? 'border border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                          : 'bg-brand-strong text-white shadow-brand hover:bg-brand-strong-hover'
                      }`}
                    >
                      {joined ? 'Going ✓' : 'Join'}
                    </button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* AMBASSADORS */}
      <Section id="ambassadors" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Ambassadors"
          title="340 people answering questions in 28 languages"
          description="Volunteers who help in the forums and run local chapters. Here is what they get for it."
        />
        <FeatureGrid className="mt-12" items={AMBASSADOR_PERKS} />

        <Reveal from="up" className="mx-auto mt-12 max-w-3xl rounded-[24px] border border-line bg-surface p-6 text-center sm:p-8">
          <h3 className="text-lg font-extrabold text-ink">Want to join them?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-body">
            Be helpful in the forums for a few months, then apply. We look at consistency and tone rather than post
            count — and every applicant gets a written answer either way.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setToast('Ambassador application thread opened.')}>
              Apply to the programme <FiAward />
            </Button>
            <Button variant="secondary" onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }}>
              Ask a question first
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* BETA */}
      <Section id="beta" className="scroll-mt-36 bg-surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHead
            align="left"
            eyebrow="Beta programme"
            title="Run the next release two versions early"
            description="Beta slots are capped per platform so feedback stays readable. You can leave at any point without losing data — the vault format is forwards and backwards compatible."
          >
            <ul className="mt-8 space-y-3">
              {[
                'Builds land roughly two weeks ahead of general release.',
                'Every build ships with a changelog explaining why, not just what.',
                'A dedicated feedback channel read by the team that wrote the code.',
                'Leaving is one tap, and your data downgrades cleanly.',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-brand-strong" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setToast('Beta slot reserved — check your chat for the build link.')}>
                Join the beta <FiZap />
              </Button>
            </div>
          </SectionHead>

          <Reveal from="scale" delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { platform: 'Android', slots: '2,400 / 3,000', pct: 80 },
                { platform: 'iOS', slots: '1,850 / 2,000', pct: 92 },
                { platform: 'Desktop', slots: '640 / 1,500', pct: 43 },
                { platform: 'Web', slots: '980 / 2,500', pct: 39 },
              ].map((item) => (
                <div key={item.platform} className="rounded-[24px] border border-line bg-cream p-5 shadow-soft dark:bg-cream-2">
                  <h3 className="text-sm font-extrabold text-ink">{item.platform}</h3>
                  <p className="mt-0.5 text-[11px] font-bold text-muted">{item.slots} slots filled</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full rounded-full ${item.pct > 85 ? 'bg-amber-500' : 'bg-brand-strong'}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] font-black text-muted">{item.pct}% full</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* GUIDELINES */}
      <Section id="guidelines" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Guidelines"
          title="Six rules, and how we enforce them"
          description="Every removal comes with a stated reason and an appeal route. Moderator actions are published in aggregate each quarter."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDELINES.map((rule, index) => (
            <Reveal key={rule.title} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-sm font-black text-brand-ink">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-extrabold leading-snug text-ink">{rule.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{rule.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow="FAQ" title="How the community works" />
          <div className="mt-12">
            <FaqAccordion items={FAQS} placeholder="Search the FAQ…" />
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Join in"
        title="480,000 people, one shared rule: be useful"
        description="Ask a question, answer one, run a meetup in your city, or just follow along on the channels above."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('forums')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse the forums
            </Button>
            <Button size="lg" variant="onDark" onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }}>
              Contact the team
            </Button>
          </>
        }
        points={['Transparent moderation', '62 local chapters', 'Free events', 'Criticism stays up']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More about KT Messenger" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}

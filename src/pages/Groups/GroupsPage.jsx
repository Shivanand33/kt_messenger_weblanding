import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiUsers,
  FiCheckCircle,
  FiPlus,
  FiVideo,
  FiShield,
  FiCalendar,
  FiBarChart2,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiZap,
  FiGlobe,
  FiLock,
  FiCheck,
  FiArrowLeft,
  FiMoreVertical
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { GroupsLoopVideo } from '../../components/common/VideoAnimations/GroupsLoopVideo'
import groupImg from '../../assets/images/group.jpg'
import familyAvatar from '../../assets/images/private.jpg'
import privateImg from '../../assets/images/private.jpg'
import userAvatar from '../../assets/images/business.jpg'
import avatarMale from '../../assets/images/avatar_male_1.png'
import avatarFemale from '../../assets/images/avatar_female_1.png'

export function GroupsPage() {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState(0)
  const [votes, setVotes] = useState([14, 7, 3])
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pollOptions = ['Friday Dinner & Movie 🍿', 'Saturday Mountain Hike 🏔️', 'Sunday Beach Brunch ☕']

  const handleVote = (idx) => {
    setSelectedOption(idx)
    setVotes((prev) => {
      const copy = [...prev]
      copy[idx] += 1
      return copy
    })
  }

  const totalVotes = votes.reduce((a, b) => a + b, 0)

  const groupTabs = [
    {
      title: 'Interactive Group Polls',
      icon: <FiBarChart2 className="text-xl" />,
      desc: 'Gather instant opinions with single or multi-choice polls. Live percentage progress bars update in real time for everyone in the chat.',
      highlights: ['Real-time live vote counts', 'Single & multiple selection mode', 'Anonymous or named poll options']
    },
    {
      title: 'Events & RSVP Tracking',
      icon: <FiCalendar className="text-xl" />,
      desc: 'Schedule group get-togethers with dates, times, pin locations, and automatic calendar reminders so no one misses out.',
      highlights: ['One-tap RSVP responses', 'Calendar sync (Google/Apple)', 'Automatic event reminders']
    },
    {
      title: 'Granular Admin Controls',
      icon: <FiShield className="text-xl" />,
      desc: 'Manage member approvals, restrict messaging rights, edit group info, and assign co-admins with flexible permissions.',
      highlights: ['New member request approvals', 'Only-Admins message mode', 'Custom invite link management']
    },
    {
      title: 'Communities Engine',
      icon: <FiGlobe className="text-xl" />,
      desc: 'Organize related group chats under one master Community (e.g. Neighborhoods, Schools, Sports Clubs) with centralized Announcement channels.',
      highlights: ['Nest up to 50 sub-groups', 'Central Announcement broadcast', 'Admin overview dashboard']
    },
    {
      title: '@Mentions & Direct Replies',
      icon: <FiUsers className="text-xl" />,
      desc: 'Keep conversation threads organized with inline direct replies and notify specific members with @mentions.',
      highlights: ['Threaded conversation view', '@mention notification bypass', 'In-chat media search']
    }
  ]

  const metrics = [
    { value: '1,024', label: 'Max Group Members' },
    { value: '32', label: 'Live Voice & Video Callers' },
    { value: '50', label: 'Sub-Groups per Community' },
    { value: '100%', label: 'Signal E2E Encrypted' }
  ]

  const useCases = [
    {
      title: 'Workplace & Project Teams',
      desc: 'Coordinate sprints, share documents, run quick voice huddles, and keep projects moving efficiently.',
      img: userAvatar
    },
    {
      title: 'Neighborhood Communities',
      desc: 'Keep residents informed with central announcements, security alerts, and local event planning.',
      img: groupImg
    },
    {
      title: 'University & Study Groups',
      desc: 'Collaborate on course assignments, create subject sub-groups, and vote on study times with polls.',
      img: familyAvatar
    },
    {
      title: 'Family & Friend Squads',
      desc: 'Share daily photos, plan weekend getaways, and stay connected across generations in privacy.',
      img: avatarFemale
    }
  ]

  const comparisonTable = [
    { feature: 'Member Capacity', kt: '1,024 Members', sms: '10 - 20 (MMS)', apps: '256 - 500' },
    { feature: 'End-to-End Encryption', kt: 'Default (100%)', sms: 'None', apps: 'Optional' },
    { feature: 'Communities Sub-Groups', kt: 'Up to 50 Groups', sms: 'Not Supported', apps: 'Paid Feature' },
    { feature: 'Interactive Group Polls', kt: 'Included Free', sms: 'Not Supported', apps: 'Third-party bot' },
    { feature: 'Event Scheduling & RSVPs', kt: 'Built-in Native', sms: 'Not Supported', apps: 'Basic Text' },
    { feature: 'Admin Approval Queue', kt: 'Granular Control', sms: 'None', apps: 'Basic Admin' }
  ]

  const faqs = [
    {
      q: 'How many members can join a single KT group?',
      a: 'A single KT group chat can host up to 1,024 participants with full administrative controls and end-to-end encryption.'
    },
    {
      q: 'Are group chats on KT encrypted?',
      a: 'Yes! All group text messages, shared photos, documents, and voice calls are fully end-to-end encrypted so only group members can access them.'
    },
    {
      q: 'How do Communities differ from regular groups?',
      a: 'Communities allow you to nest up to 50 individual sub-groups under one roof with a master Announcement channel managed by Community admins.'
    },
    {
      q: 'Can admins control who sends messages in a group?',
      a: 'Yes. Admins can restrict message sending to "Admins Only" (ideal for announcement groups) or toggle member approval requirements before new people join.'
    },
    {
      q: 'How do group polls work?',
      a: 'Any member can tap the attachments icon, select "Poll", type a question, and add options. Votes update live for everyone as members tap their choice.'
    },
    {
      q: 'Can I start a voice or video call inside a group?',
      a: 'Yes! Tap the call button inside any group to launch a group voice or video call with up to 32 participants simultaneously.'
    }
  ]

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="up">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-strong/30 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
                <FiUsers className="text-brand-strong" /> Community & Group Collaboration
              </div>
              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                Connect and get more <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  done together with groups
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                From daily family catchups to workplace teams, KT group messaging keeps all your conversations private, organized, and interactive.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  Create a Group Free <FiDownload className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/apps')}>
                  Explore Features <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> Up to 1,024 Members
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> 32-Person Voice & Video
                </span>
              </div>
            </Reveal>

            {/* MOBILE SMARTPHONE MOCKUP MATCHING USER APP SCREENSHOT EXACTLY */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[48px] border-[8px] border-slate-900 bg-slate-950 p-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] dark:border-slate-800 font-sans select-none overflow-hidden text-white flex flex-col justify-between relative group">
                {/* Smartphone Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-14 rounded-full bg-slate-900 border border-slate-800 shrink-0" />
                    <span>12:19</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    <span>📶 5G</span>
                    <span className="text-emerald-400 font-extrabold">34% ⚡</span>
                  </div>
                </div>

                {/* Mobile Group Screen Content */}
                <div className="relative flex-1 bg-[#0b141a] text-white overflow-hidden flex flex-col justify-between my-0.5 rounded-[36px] border border-slate-800/60 shadow-inner">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-3 pt-3 pb-2 text-slate-300 z-10 shrink-0 border-b border-slate-800/40">
                    <FiArrowLeft className="text-base cursor-pointer hover:text-white" />
                    <FiMoreVertical className="text-base cursor-pointer hover:text-white" />
                  </div>

                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-3 pb-3">
                    {/* Group Profile Card */}
                    <div className="text-center pt-1 pb-1 space-y-1.5">
                      <div className="grid h-16 w-16 place-items-center rounded-full bg-[#059669] text-white text-xl font-bold mx-auto shadow-lg border-2 border-emerald-400/30">
                        KD
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white tracking-tight">kt messenger discussion</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Group • 18 members</p>
                      </div>
                      <p className="text-[10px] text-slate-300 max-w-[220px] mx-auto leading-tight bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                        Use the application and share the issues over here
                      </p>
                    </div>

                    {/* Media, links, and docs Card */}
                    <div className="rounded-2xl bg-[#111b21] p-2.5 border border-slate-800/80 shadow-md">
                      <div className="flex items-center justify-between pb-2 text-[11px]">
                        <span className="font-bold text-slate-200">Media, links, and docs</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-semibold">
                          3 <FiChevronRight />
                        </span>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                        <div className="h-14 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 relative">
                          <img src={privateImg} alt="Media" className="h-full w-full object-cover" />
                          <span className="absolute bottom-1 left-1 text-[7px] bg-black/70 px-1 py-0.2 rounded font-mono text-white">Voice call</span>
                        </div>
                        <div className="h-14 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 relative">
                          <img src={groupImg} alt="Media" className="h-full w-full object-cover" />
                          <span className="absolute bottom-1 left-1 text-[7px] bg-sky-600/90 px-1 py-0.2 rounded font-mono text-white">Check notif</span>
                        </div>
                        <div className="h-14 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 relative p-1">
                          <div className="h-full w-full rounded-lg bg-slate-800 p-1 flex flex-col justify-between text-[6px] text-slate-300">
                            <div className="font-bold text-sky-400">Invite QR</div>
                            <div className="text-[5px] text-slate-400">Share</div>
                          </div>
                        </div>
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          <FiChevronRight className="text-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Members Header */}
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between px-1 pb-1.5">
                        <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">18 MEMBERS</span>
                        <span className="text-[10px] font-bold text-sky-400 cursor-pointer hover:underline">See all</span>
                      </div>

                      {/* Member List */}
                      <div className="rounded-2xl bg-[#111b21] border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-md">
                        {/* Add members */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-sky-500 text-white shadow shrink-0">
                              <FiPlus className="text-sm" />
                            </div>
                            <div>
                              <h5 className="font-bold text-[11px] text-white">Add members</h5>
                              <p className="text-[9px] text-slate-400">Add contacts from your phone</p>
                            </div>
                          </div>
                          <FiChevronRight className="text-slate-500 text-xs" />
                        </div>

                        {/* You */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <img src={avatarMale} alt="You" className="h-8 w-8 rounded-full object-cover border border-slate-700 shrink-0" />
                            <div>
                              <h5 className="font-bold text-[11px] text-white">You</h5>
                              <p className="text-[9px] text-sky-400 font-semibold">Add member tag</p>
                            </div>
                          </div>
                          <FiChevronRight className="text-slate-500 text-xs" />
                        </div>

                        {/* Farhan Bhai (Admin) */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-white font-extrabold text-[11px] shadow shrink-0">
                              FB
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h5 className="font-bold text-[11px] text-white">Farhan Bhai</h5>
                                <span className="rounded bg-sky-500/20 px-1 py-0.2 text-[8px] font-bold text-sky-400 border border-sky-500/30">Admin</span>
                              </div>
                              <p className="text-[9px] text-slate-400">Group admin</p>
                            </div>
                          </div>
                        </div>

                        {/* Irfan Bhai (Omre) */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white font-extrabold text-[11px] shadow shrink-0">
                              IO
                            </div>
                            <div>
                              <h5 className="font-bold text-[11px] text-white">Irfan Bhai (Omre)</h5>
                              <p className="text-[9px] text-slate-400">Tap for options</p>
                            </div>
                          </div>
                        </div>

                        {/* Saad Bhati */}
                        <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-600 text-white font-extrabold text-[11px] shadow shrink-0">
                              SB
                            </div>
                            <div>
                              <h5 className="font-bold text-[11px] text-white">Saad Bhati</h5>
                              <p className="text-[9px] text-slate-400">Active recently</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gesture Bar */}
                <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 z-20">
                  <div className="h-1 w-32 rounded-full bg-slate-700/80" />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2. STATS & METRICS BAR */}
      <section className="border-y border-line bg-surface py-10">
        <Container>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-strong lg:text-4xl">{m.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-body uppercase">{m.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. INTERACTIVE FEATURE SWITCHER (TABS) */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Built for Seamless Group Collaboration
          </h2>
          <p className="mt-4 text-lg text-body">
            Everything you need to lead discussions, make group decisions, and coordinate events effortlessly.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {groupTabs.map((tab, idx) => {
              const active = activeTab === idx
              return (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(idx)}
                  className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all ${
                    active
                      ? 'bg-brand-strong text-white shadow-brand'
                      : 'bg-surface text-ink hover:bg-surface-2 border border-line'
                  }`}
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? 'bg-white/20 text-white' : 'bg-brand-soft text-brand-strong'}`}>
                    {tab.icon}
                  </div>
                  <h3 className="font-bold text-base">{tab.title}</h3>
                </button>
              )
            })}
          </div>

          <div className="rounded-3xl border border-line bg-surface p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink">
                Group Power Feature
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {groupTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {groupTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {groupTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Free for up to 1,024 members</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                Start Group Now <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* INTERACTIVE ANIMATED GROUPS VIDEO DEMO */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20 border-y border-line">
        <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal from="left" className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                🎬 Interactive Groups Demo
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                1,024 Member Groups &amp; Live Polls
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                Bring up to 1,024 members together with real-time poll voting, event RSVP calendar tracking, and community sub-groups.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> 1,024 Member Capacity
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> Real-Time Poll Voting
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> Event RSVP Tracking
                </span>
              </div>
            </Reveal>

            <Reveal from="right" className="lg:col-span-7 relative flex justify-center py-2">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line text-base">
                <span>📊</span><span>📅</span><span>👥</span><span>🎉</span><span>💯</span>
              </motion.div>

              <div className="relative z-10">
                <GroupsLoopVideo />
              </div>

              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-2 left-2 sm:left-6 z-20 flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-float border border-brand-strong/30 text-xs font-bold text-brand-ink">
                <FiShield className="text-brand-strong" /> 1,024 Member Live Polls
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE SHOWCASE - EVENTS & RSVP WIDGET */}
      <section className="bg-brand-soft py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                <FiCalendar className="text-brand-strong" /> Event & RSVP Suite
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
                Plan events and keep guest RSVPs organized
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                Schedule group meetings, sports games, or birthday parties with exact dates, locations, and integrated calendar notifications right in the chat thread.
              </p>

              <div className="mt-6 space-y-3 text-sm font-semibold text-ink">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Automatic calendar sync with Google & Apple Calendar</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Live attendee counter for RSVP & Maybe responses</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>In-chat event reminders 1 hour before start</span>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="flex justify-center">
              <div className="w-full max-w-[380px] rounded-3xl bg-surface p-6 shadow-float border border-line">
                <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                  <span className="text-xs font-bold text-brand-ink flex items-center gap-1.5">
                    <FiCalendar /> Group Event
                  </span>
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold text-brand-strong">
                    Upcoming
                  </span>
                </div>
                <h4 className="text-xl font-bold text-ink">Annual Team Picnic 🏖️</h4>
                <p className="mt-1 text-xs text-body">Saturday, Aug 12 • 2:00 PM • Sunset Beach Park</p>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-cream p-3 border border-line">
                  <div className="flex -space-x-2">
                    <img src={familyAvatar} alt="" className="h-8 w-8 rounded-full border-2 border-surface object-cover" />
                    <img src={userAvatar} alt="" className="h-8 w-8 rounded-full border-2 border-surface object-cover" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-strong text-[10px] font-bold text-white border-2 border-surface">
                      +16
                    </div>
                  </div>
                  <Button size="sm">RSVP Going ✓</Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. USE CASES GRID */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Groups Tailored for Every Need
          </h2>
          <p className="mt-4 text-lg text-body">
            Discover how communities and organizations use KT Groups to stay connected.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((card) => (
            <Reveal key={card.title} from="up">
              <div className="group overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all hover:-translate-y-1">
                <div className="h-44 overflow-hidden bg-brand-soft">
                  <img src={card.img} alt={card.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-ink">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{card.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6. COMPARISON MATRIX */}
      <section className="bg-surface py-16 lg:py-24 border-y border-line">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Group Messaging Comparison
            </h2>
            <p className="mt-4 text-lg text-body">
              Compare KT Groups against traditional SMS group chats and competitor messaging platforms.
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">Feature</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT Messenger</th>
                  <th className="p-4 font-bold text-body">MMS Group Chat</th>
                  <th className="p-4 font-bold text-body">Other Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="hover:bg-cream/50 transition-colors">
                    <td className="p-4 font-semibold text-ink">{row.feature}</td>
                    <td className="p-4 font-bold text-brand-strong bg-brand-soft/30">{row.kt}</td>
                    <td className="p-4 text-body">{row.sms}</td>
                    <td className="p-4 text-body">{row.apps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 7. FAQ ACCORDION */}
      <Section className="bg-cream">
        <Container className="max-w-4xl">
          <Reveal from="up" className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
              <FiHelpCircle /> Group FAQs
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index
              return (
                <div key={faq.q} className="overflow-hidden rounded-2xl border border-line bg-surface transition-all shadow-soft">
                  <button
                    onClick={() => setFaqOpen(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-ink hover:text-brand-strong"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    <FiChevronDown className={`shrink-0 text-xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-strong' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="border-t border-line px-5 pb-5 pt-3 text-sm leading-relaxed text-body">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* 8. CTA BANNER */}
      <section className="bg-gradient-to-r from-brand-strong to-brand-ink py-16 text-white lg:py-20">
        <Container className="text-center">
          <Reveal from="up">
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white">
              Start Your First Group Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Download KT Messenger now to host 1,024 members, 32-person video calls, and interactive polls.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" onClick={() => navigate('/apps')}>
                Download Free App <FiDownload />
              </Button>
              <Button variant="onDark" size="lg" onClick={() => navigate('/apps')}>
                Launch Web App <FiChevronRight />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  )
}

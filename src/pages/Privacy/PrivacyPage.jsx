import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiLock,
  FiClock,
  FiKey,
  FiPhoneOff,
  FiUploadCloud,
  FiEye,
  FiShield,
  FiCheckCircle,
  FiDownload,
  FiArrowUpRight,
  FiChevronRight,
  FiChevronLeft,
  FiChevronDown,
  FiAlertOctagon,
  FiUserX,
  FiCheck,
  FiVideo,
  FiPhone,
  FiMoreVertical,
  FiMic,
  FiMoreHorizontal,
  FiShare2,
  FiMaximize2,
  FiPhoneCall
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { DownloadCTA } from '../../components/sections/DownloadCTA/DownloadCTA'
import { useModal } from '../../context/ModalContext'

import nadiaAvatar from '../../assets/images/nadia_avatar.png'
import maleAvatar from '../../assets/images/avatar_male_1.png'
import femaleAvatar from '../../assets/images/avatar_female_1.png'
import securityImg from '../../assets/images/security.jpg'
import privateImg from '../../assets/images/private.jpg'
import groupImg from '../../assets/images/group.jpg'
import businessImg from '../../assets/images/business.jpg'


const privacyControlsCards = [
  {
    title: 'Privacy checkup',
    desc: 'Personalize your KT Messenger privacy settings with easy step-by-step guidance to keep your account safe and private.',
    badge: 'Checkup Guide 🛡️',
    to: '/security'
  },
  {
    title: 'View once media',
    desc: 'Send photos and videos that disappear after the recipient opens them once, without leaving a trace in their phone gallery.',
    badge: 'Media Privacy 📷',
    to: '/messaging'
  },
  {
    title: 'Two-step verification',
    desc: 'Add an extra layer of protection to your phone registration with a custom 6-digit PIN and Passkey biometrics.',
    badge: 'PIN Security 🔐',
    to: '/security'
  },
  {
    title: 'Group privacy controls',
    desc: 'Decide who can add you to group chats — choose between Everyone, My Contacts, or My Contacts Except.',
    badge: 'Group Safety 👥',
    to: '/groups'
  }
]

const discoverMoreFeatures = [
  {
    title: 'Calling',
    image: privateImg,
    to: '/calling'
  },
  {
    title: 'Groups',
    image: groupImg,
    to: '/groups'
  },
  {
    title: 'KT AI',
    image: securityImg,
    to: '/ai'
  },
  {
    title: 'Channels',
    image: businessImg,
    to: '/channels'
  },
  {
    title: 'Status Stories',
    image: privateImg,
    to: '/status'
  },
  {
    title: 'KT Business',
    image: businessImg,
    to: '/business'
  },
  {
    title: 'WhatsApp Plus',
    image: groupImg,
    to: '/plus'
  }
]

export function PrivacyPage() {
  const navigate = useNavigate()
  const { openDownloadModal } = useModal()
  const [activeFaq, setActiveFaq] = useState(1)
  const [activePrivacyModal, setActivePrivacyModal] = useState('lastSeen')
  const [selectedLastSeen, setSelectedLastSeen] = useState('Everyone')
  const [selectedOnline, setSelectedOnline] = useState('Everyone')
  const [backupWifiOnly, setBackupWifiOnly] = useState(true)
  const [backupIncludeMedia, setBackupIncludeMedia] = useState(true)
  const [showSecurityNotifs, setShowSecurityNotifs] = useState(true)
  const carouselRef = useRef(null)
  const discoverRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  const scrollDiscover = (dir) => {
    if (!discoverRef.current) return
    discoverRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  const faqs = [
    {
      q: 'What is end-to-end encryption?',
      a: 'End-to-end encryption ensures that only you and the recipient hold the cryptographic keys to read your messages. Not even KT Messenger servers can decrypt your content.'
    },
    {
      q: 'What is two-step verification?',
      a: 'Two-step verification adds a required 6-digit PIN whenever your phone number is re-registered on KT Messenger, protecting you against SIM-swap attacks.'
    },
    {
      q: 'Is KT Messenger private and secure?',
      a: 'Yes. All messages, calls, photos, videos, and cloud backups are protected by default Signal Protocol 256-bit encryption.'
    },
    {
      q: 'How do I block and report spam contacts?',
      a: 'Open any contact info screen, tap "Block & Report". The last 5 messages will be securely reviewed to eliminate spam.'
    }
  ]

  return (
    <MainLayout>
      
      {/* 1. HERO SECTION: MESSAGE PRIVATELY */}
      <section className="relative overflow-hidden bg-cream dark:bg-surface border-b border-line py-16 sm:py-24 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-brand-strong/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal from="up">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-strong/20 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
                  <FiShield className="text-brand-strong" /> Default End-to-End Encryption
                </span>
                <h1 className="mt-6 text-[3rem] font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.8rem]">
                  Message <span className="text-brand-strong">privately</span>
                </h1>
              </Reveal>

              <Reveal from="up" delay={0.06}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">
                  Your privacy is our priority. With end-to-end encryption on KT Messenger, your personal messages, photos, calls and more stay between you and the people you choose, meaning not even KT Messenger can see them.
                </p>
              </Reveal>

              <Reveal from="up" delay={0.12}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" onClick={openDownloadModal}>
                    Download App <FiDownload />
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => navigate('/security')}>
                    Security Architecture <FiChevronRight />
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* SMARTPHONE MOCKUP WITH MATRIX CIPHER ENCRYPTION OVERLAY */}
            <Reveal from="scale" delay={0.1} className="relative">
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float dark:border-slate-700 font-sans select-none overflow-hidden text-white flex flex-col justify-between relative group">
                {/* Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-14 rounded-full bg-slate-900 border border-slate-800 shrink-0" />
                    <span>12:05</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    <span>📶 5G</span>
                    <span className="text-emerald-400 font-extrabold">100% ⚡</span>
                  </div>
                </div>

                {/* App Screen Content - User Signature Light Mobile Chat UI */}
                <div className="relative flex-1 bg-[#f5f8fa] dark:bg-[#0b141a] text-slate-900 dark:text-white overflow-hidden flex flex-col justify-between my-0.5 rounded-[36px] border border-slate-800/60 shadow-inner">
                  {/* Header (Blue wave gradient) */}
                  <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 p-2.5 text-white shadow-md flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img src={maleAvatar} alt="David Miller" className="h-8 w-8 rounded-full object-cover border-2 border-emerald-400 shadow" />
                      <div>
                        <h4 className="font-extrabold text-xs tracking-tight">David Miller</h4>
                        <span className="text-[9px] text-sky-200 block font-medium">online • E2EE Active</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <FiShield className="text-emerald-300" />
                      <FiLock className="text-white" />
                    </div>
                  </div>

                  {/* Chat Stream Body matching User Mobile App UI */}
                  <div className="p-3 space-y-2.5 text-[11px] flex-1 overflow-y-auto no-scrollbar relative bg-[#f5f8fa] dark:bg-[#0b141a] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:14px_14px]">
                    {/* E2EE Protocol Pill */}
                    <div className="mx-auto w-fit rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      🔒 End-to-end encrypted with Signal Protocol
                    </div>

                    {/* Received Message */}
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white max-w-[85%] shadow-sm border border-slate-200 dark:border-slate-700/80">
                        <span className="font-semibold">Good morning David! ☀️ How was your day?</span>
                        <div className="text-[8px] text-slate-400 text-right pt-0.5 font-mono">10:02 am</div>
                      </div>
                    </div>

                    {/* Sent Blue Message */}
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-sky-500 to-blue-600 p-2.5 text-white max-w-[85%] shadow-md">
                        <span className="font-semibold">Good morning! It was wonderful! Ready for our weekend coffee meetup? ☕✨</span>
                        <div className="text-[8px] text-sky-100 text-right font-mono mt-0.5">10:04 am ✓✓</div>
                      </div>
                    </div>

                    {/* Attachment Card */}
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white dark:bg-slate-800 p-1 text-slate-900 dark:text-white max-w-[85%] border border-slate-200 dark:border-slate-700 shadow-sm">
                        <img src={privateImg} alt="Strawberry Attachment" className="h-24 w-full object-cover rounded-xl" />
                        <div className="text-[8px] text-slate-400 text-right pr-2 pt-0.5 font-mono">10:05 am</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Input Pill Bar */}
                  <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shrink-0">
                    <div className="flex-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="cursor-pointer text-sm">😃</span>
                        <span className="text-slate-400 text-[11px] font-medium">Can't wait! 😊</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <span className="cursor-pointer">📎</span>
                        <span className="cursor-pointer">📷</span>
                      </div>
                    </div>
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-sky-600">
                      🎙️
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

      {/* 2. CHAT LOCK SECTION */}
      <section className="py-20 lg:py-28 bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float dark:border-slate-700 font-sans select-none overflow-hidden text-slate-900 dark:text-white flex flex-col justify-between relative group">
                {/* Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-14 rounded-full bg-slate-900 border border-slate-800 shrink-0" />
                    <span>11:32</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    <span>📶 LTE</span>
                    <span className="text-sky-400 font-bold">98%</span>
                  </div>
                </div>

                {/* Mobile App Screen Body */}
                <div className="p-3 space-y-3 flex-1 flex flex-col justify-start bg-white dark:bg-slate-900 my-0.5 rounded-[36px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <h4 className="font-extrabold text-ink text-base">KT Messenger</h4>
                      <FiLock className="text-brand-strong text-lg" />
                    </div>

                    <div className="mt-3 rounded-2xl bg-sky-50 dark:bg-slate-800 p-3.5 border border-sky-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-strong text-white text-lg shadow-md">
                          🔒
                        </div>
                        <div>
                          <h5 className="font-extrabold text-ink text-sm">Locked chats</h5>
                          <span className="text-[11px] text-brand-ink font-semibold">Biometrics Protected</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-brand-strong px-2.5 py-0.5 text-[10px] font-bold text-white">2</span>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream-2 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                        <img src={maleAvatar} alt="David Miller" className="h-10 w-10 rounded-full object-cover border border-sky-500/40" />
                        <div className="flex-1">
                          <div className="flex justify-between font-bold text-xs text-ink">
                            <span>David Miller</span>
                            <span className="text-[10px] text-muted">11:32</span>
                          </div>
                          <span className="text-[11px] text-body">Video call completed • E2EE</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream-2 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-white font-bold text-xs shadow">
                          MV
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between font-bold text-xs text-ink">
                            <span>Marcus Vance</span>
                            <span className="text-[10px] text-muted">10:04</span>
                          </div>
                          <span className="text-[11px] text-body">Who is free around 5 PM?</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-sky-50 dark:bg-slate-800/90 p-3 text-center border border-sky-200 dark:border-slate-700">
                    <span className="text-xs font-extrabold text-brand-strong block">🔐 FaceID / Fingerprint Lock</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Unlock required to view hidden messages</span>
                  </div>
                </div>

                {/* Gesture Bar */}
                <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 z-20">
                  <div className="h-1 w-32 rounded-full bg-slate-700/80" />
                </div>
              </div>
            </Reveal>

            <Reveal from="right">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                Biometric Protection
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Chat <span className="text-brand-strong">lock</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-body">
                Password protect your most personal chats so you can help keep them private and secure. Locked chats will be hidden from your chats list in the Locked Chats folder, so you can prevent anyone else using your phone from seeing them.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/security')}
                  className="group inline-flex items-center gap-2 text-base font-bold text-brand-ink hover:text-brand-strong transition-colors"
                >
                  <span>Learn more</span>
                  <FiArrowUpRight className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 3. DISAPPEARING MESSAGES SECTION */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                Ephemeral Privacy
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                <span className="text-brand-strong">Disappearing</span> messages
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-body">
                With disappearing messages, you can control which messages stick around and for how long, by setting them up to disappear after you&apos;ve sent them.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/messaging')}
                  className="group inline-flex items-center gap-2 text-base font-bold text-brand-ink hover:text-brand-strong transition-colors"
                >
                  <span>Learn more</span>
                  <FiArrowUpRight className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>

            <Reveal from="right">
              {/* FULL ULTRA-REALISTIC TALL SMARTPHONE MOCKUP MATCHING USER UPLOADED SCREENSHOT EXACTLY */}
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float dark:border-slate-700 font-sans select-none overflow-hidden text-white flex flex-col justify-between relative group">
                {/* Top Phone Speaker Notch & Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-14 rounded-full bg-slate-900 border border-slate-800 shrink-0" />
                    <span>12:05</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    <span>📶 5G</span>
                    <span className="text-emerald-400 font-extrabold">100% ⚡</span>
                  </div>
                </div>

                {/* 3. DISAPPEARING MESSAGES SMARTPHONE SCREEN */}
                <div className="relative flex-1 bg-[#f4f7f9] dark:bg-[#0c1626] text-slate-900 dark:text-white overflow-hidden flex flex-col justify-between my-0.5 rounded-[36px] border border-slate-800/60 shadow-inner">
                  {/* Header (Blue wave gradient) matching User Screenshot */}
                  <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 p-2.5 text-white shadow-md flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <FiChevronLeft className="text-lg cursor-pointer" />
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-sky-400 text-slate-950 font-extrabold text-xs shadow">
                        DM
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs tracking-tight">David Miller</h4>
                        <span className="text-[9px] text-sky-200 block font-medium">Last seen 25 min ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <FiVideo className="cursor-pointer text-base hover:text-sky-200 transition-colors" />
                      <FiPhone className="cursor-pointer text-base hover:text-sky-200 transition-colors" />
                      <FiMoreVertical className="cursor-pointer text-base hover:text-sky-200 transition-colors" />
                    </div>
                  </div>

                  {/* Chat Stream Body - Warm friendly conversation between friends */}
                  <div className="p-2.5 space-y-2.5 text-[11px] flex-1 overflow-y-auto no-scrollbar relative bg-[#f5f8fa] dark:bg-[#0b141a] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:14px_14px]">
                    {/* Date Badge Divider */}
                    <div className="text-center my-1">
                      <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono shadow-sm">Today</span>
                    </div>

                    {/* Friendly Received Message 1 */}
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white max-w-[84%] border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="font-semibold text-xs">Hey David! Check out these fresh strawberries we picked today! 🍓✨</span>
                        <div className="text-[8px] text-slate-400 text-right pt-1 font-mono">2:33 pm</div>
                      </div>
                    </div>

                    {/* Fresh Red Strawberry Image Attachment */}
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white dark:bg-slate-800 p-1 text-slate-900 dark:text-white max-w-[84%] border border-slate-200 dark:border-slate-700 shadow-sm">
                        <img src={privateImg} alt="Strawberry Attachment" className="h-32 w-full object-cover rounded-xl" />
                        <div className="text-[8px] text-slate-400 text-right pr-2 pt-0.5 font-mono">2:37 pm</div>
                      </div>
                    </div>

                    {/* Friendly Received Message 2 */}
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white max-w-[84%] border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="font-semibold text-xs">They were so sweet and delicious! We should go back next weekend 🌿☕</span>
                        <div className="text-[8px] text-slate-400 text-right pt-1 font-mono">2:38 pm</div>
                      </div>
                    </div>

                    {/* Voice Note Audio Pill */}
                    <div className="flex items-center gap-2 justify-start">
                      <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white max-w-[78%] border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 shadow-sm">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-500 text-white text-xs shadow shrink-0">▶</span>
                        <div>
                          <div className="font-extrabold text-xs">Voice Note (0:14)</div>
                          <div className="text-[8px] text-slate-400 font-mono">11:04 am</div>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs">🔊</span>
                    </div>

                    {/* Sent Blue Bubble Message */}
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-slate-400 text-xs">🔊</span>
                      <div className="rounded-2xl rounded-tr-none bg-sky-500 p-2.5 text-white max-w-[82%] shadow-md">
                        <span className="font-semibold text-xs">Good morning! That looks amazing! Hope you have a wonderful day ☀️✨</span>
                        <div className="text-[8px] text-sky-100 text-right font-mono mt-0.5">4:24 pm ✓✓</div>
                      </div>
                    </div>

                    {/* Friendly Received Message 3 */}
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white max-w-[84%] border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="font-semibold text-xs">Let's catch up over coffee this Saturday! ☕😊</span>
                        <div className="text-[8px] text-slate-400 text-right pt-1 font-mono">6:01 pm</div>
                      </div>
                    </div>

                    {/* Deno Note Card */}
                    <div className="flex justify-start pt-1">
                      <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white max-w-[85%] border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm">
                        <div className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500 text-white text-sm font-bold shadow">
                          📑
                        </div>
                        <div>
                          <div className="font-extrabold text-xs">Deno</div>
                          <span className="text-[9px] text-slate-400 font-semibold">Note</span>
                        </div>
                      </div>
                    </div>

                    {/* Floating Action Scroll-Down Button matching user screenshot */}
                    <div className="absolute right-3 bottom-12 z-20">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-sky-500 text-white font-bold shadow-lg border border-sky-400">
                        ↓
                      </div>
                    </div>
                  </div>

                  {/* Bottom Input Pill Bar */}
                  <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shrink-0">
                    <div className="flex-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="cursor-pointer text-sm">😃</span>
                        <span className="text-slate-400 text-[11px] font-medium">Message</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <span className="cursor-pointer">📎</span>
                        <span className="cursor-pointer">📷</span>
                      </div>
                    </div>
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-sky-600">
                      🎙️
                    </div>
                  </div>
                </div>

                {/* Smartphone Bottom Gesture Bar */}
                <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 z-20">
                  <div className="h-1 w-32 rounded-full bg-slate-700/80" />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4. SILENCE UNKNOWN CALLERS SECTION */}
      <section className="py-20 lg:py-28 bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float dark:border-slate-700 font-sans select-none overflow-hidden text-white flex flex-col justify-between relative group">
                {/* Dynamic Island Notch & Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3.5 w-16 rounded-full bg-slate-900 border border-slate-800 shrink-0" />
                    <span>12:06</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <span>📶 5G</span>
                    <span className="text-emerald-400 font-bold">⚡</span>
                  </div>
                </div>

                {/* Call Screen Body matching User App Screenshot 1 */}
                <div className="p-3 text-center space-y-4 flex-1 flex flex-col justify-between bg-[#f5f8fa] dark:bg-[#0b141a] my-0.5 rounded-[36px] border border-slate-200 dark:border-slate-800 relative">
                  {/* Top Bar inside call screen */}
                  <div className="flex items-center justify-between pt-1 px-1 shrink-0">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <FiMaximize2 className="text-xs" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-wide">David Miller</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block pt-0.5">00:06</span>
                    </div>
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <FiPhoneCall className="text-xs" />
                    </div>
                  </div>

                  {/* Contact Avatar Circle */}
                  <div className="my-auto py-2">
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-sky-500 text-white text-2xl font-extrabold shadow-xl border-4 border-white dark:border-slate-800 mx-auto">
                      DM
                    </div>
                    {/* Audio Waves Dots */}
                    <div className="mt-4 flex justify-center gap-1 text-slate-400 font-mono text-xs font-bold tracking-widest">
                      <span>•</span><span>•</span><span>•</span><span>•</span><span>•</span><span>•</span><span>•</span><span>•</span>
                    </div>
                  </div>

                  {/* Floating Action Controls White Card */}
                  <div className="rounded-3xl bg-white dark:bg-slate-900 p-3.5 border border-slate-200/90 dark:border-slate-800 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] grid grid-cols-3 gap-3 text-center text-xs font-semibold shrink-0">
                    <div className="space-y-1">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mx-auto transition-transform hover:scale-105 cursor-pointer">
                        <FiVideo className="text-base" />
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-medium">Video</span>
                    </div>

                    <div className="space-y-1">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mx-auto transition-transform hover:scale-105 cursor-pointer">
                        <FiPhone className="text-base" />
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-medium">Phone</span>
                    </div>

                    <div className="space-y-1">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mx-auto transition-transform hover:scale-105 cursor-pointer">
                        <FiMic className="text-base" />
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-medium">Mute</span>
                    </div>

                    <div className="space-y-1">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mx-auto transition-transform hover:scale-105 cursor-pointer">
                        <FiMoreHorizontal className="text-base" />
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-medium">More</span>
                    </div>

                    <div className="space-y-1">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mx-auto transition-transform hover:scale-105 cursor-pointer">
                        <FiShare2 className="text-base" />
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-medium">Share</span>
                    </div>

                    <div className="space-y-1">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-rose-500 text-white mx-auto shadow-md transition-transform hover:scale-105 cursor-pointer">
                        <FiPhoneOff className="text-base" />
                      </div>
                      <span className="text-[10px] text-rose-500 font-extrabold block">End</span>
                    </div>
                  </div>
                </div>

                {/* Smartphone Bottom Gesture Bar */}
                <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 z-20">
                  <div className="h-1 w-32 rounded-full bg-slate-700/80" />
                </div>
              </div>
            </Reveal>

            <Reveal from="right">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                Anti-Spam Filter
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                <span className="text-brand-strong">Silence</span> unknown callers
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-body">
                Screen out spam and unknown contacts from calling you, so you can focus on conversations that really matter to you.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/calling')}
                  className="group inline-flex items-center gap-2 text-base font-bold text-brand-ink hover:text-brand-strong transition-colors"
                >
                  <span>Learn more</span>
                  <FiArrowUpRight className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. LAST SEEN AND ONLINE SECTION */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float dark:border-slate-700 font-sans select-none overflow-hidden text-white flex flex-col justify-between relative group">
                {/* Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <span>5:31 • ...</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span>3.99 KB/s</span>
                    <span>📶 VoWiFi</span>
                    <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] text-slate-200">20</span>
                  </div>
                </div>

                {/* App Header */}
                <div className="relative rounded-t-2xl bg-gradient-to-r from-sky-600 to-blue-700 p-3 text-white shadow-md">
                  <div className="flex items-center gap-3">
                    <FiChevronLeft className="text-xl" />
                    <h4 className="font-extrabold text-base tracking-wide">Privacy</h4>
                  </div>
                </div>

                {/* Mobile Settings List Background */}
                <div className="bg-[#f5f8fa] dark:bg-[#0b141a] p-3 text-slate-900 dark:text-white space-y-3 relative text-xs flex-1 flex flex-col justify-between my-0.5 rounded-b-[36px]">
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2">
                      Who can see my personal info
                    </div>

                    <div className="rounded-2xl bg-white dark:bg-slate-800 p-2.5 space-y-2 border border-slate-200 dark:border-slate-700/80 shadow-sm">
                      <div
                        onClick={() => setActivePrivacyModal('lastSeen')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${activePrivacyModal === 'lastSeen' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-7 w-7 place-items-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-sm">
                            <FiEye />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Last seen</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedLastSeen}</div>
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-400 text-sm" />
                      </div>

                      <div
                        onClick={() => setActivePrivacyModal('online')}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${activePrivacyModal === 'online' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-7 w-7 place-items-center rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 text-sm">
                            📡
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Online</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedOnline}</div>
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-400 text-sm" />
                      </div>

                      <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-7 w-7 place-items-center rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 text-sm">
                            👤
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Profile photo</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Everyone</div>
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-400 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Modal Overlay */}
                  <div className="absolute inset-x-3 top-8 z-20 rounded-2xl bg-white dark:bg-slate-800 border border-sky-400/60 dark:border-sky-500/40 p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {activePrivacyModal === 'lastSeen' ? 'Last seen' : 'Online'}
                      </h5>
                      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-[9px] font-bold">
                        <button
                          onClick={() => setActivePrivacyModal('lastSeen')}
                          className={`px-2 py-0.5 rounded-md transition-colors ${activePrivacyModal === 'lastSeen' ? 'bg-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                          Last seen
                        </button>
                        <button
                          onClick={() => setActivePrivacyModal('online')}
                          className={`px-2 py-0.5 rounded-md transition-colors ${activePrivacyModal === 'online' ? 'bg-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                          Online
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-semibold">
                      {['Everyone', 'My contacts', 'My contacts except...', 'Nobody'].map((opt) => {
                        const isSelected = activePrivacyModal === 'lastSeen' ? selectedLastSeen === opt : selectedOnline === opt
                        return (
                          <div
                            key={opt}
                            onClick={() => {
                              if (activePrivacyModal === 'lastSeen') setSelectedLastSeen(opt)
                              else setSelectedOnline(opt)
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 border border-sky-400/50 font-bold shadow-sm'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <span>{opt}</span>
                            <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
                              isSelected ? 'bg-sky-500 text-white shadow-sm' : 'border border-slate-300 dark:border-slate-600'
                            }`}>
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1">
                      Disappearing Messages
                    </div>
                    <div className="rounded-xl bg-white dark:bg-slate-800 p-2.5 flex items-center justify-between border border-slate-200 dark:border-slate-700/80 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs">⏱️</div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Default message timer</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Off &gt;</span>
                    </div>
                  </div>
                </div>

                {/* Gesture Bar */}
                <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 z-20">
                  <div className="h-1 w-32 rounded-full bg-slate-700/80" />
                </div>
              </div>
            </Reveal>

            <Reveal from="right">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                Presence Control
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                <span className="text-brand-strong">Last seen</span> and online
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-body">
                Choose to be seen by only those you want. You can customize your privacy settings to choose who can see when you&apos;re online, and when you last used KT Messenger.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/help')}
                  className="group inline-flex items-center gap-2 text-base font-bold text-brand-ink hover:text-brand-strong transition-colors"
                >
                  <span>Learn more</span>
                  <FiArrowUpRight className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 6. END-TO-END ENCRYPTED BACKUPS SECTION */}
      <section className="py-20 lg:py-28 bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                Cloud Vault Security
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                <span className="text-brand-strong">End-to-End Encrypted</span> backups
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-body">
                Keep your online backups private. Turn on encrypted backups to extend the security of KT Messenger end-to-end encryption to your messages saved in iCloud or Google Drive.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/security')}
                  className="group inline-flex items-center gap-2 text-base font-bold text-brand-ink hover:text-brand-strong transition-colors"
                >
                  <span>Learn more</span>
                  <FiArrowUpRight className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>

            <Reveal from="right">
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float dark:border-slate-700 font-sans select-none overflow-hidden text-white flex flex-col justify-between relative group">
                {/* Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <span>5:33 • ...</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span>1.82 KB/s</span>
                    <span>📶 VoWiFi</span>
                    <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] text-slate-200">19</span>
                  </div>
                </div>

                {/* App Header */}
                <div className="relative rounded-t-2xl bg-gradient-to-r from-sky-600 to-blue-700 p-3 text-white shadow-md">
                  <div className="flex items-center gap-3">
                    <FiChevronLeft className="text-xl" />
                    <h4 className="font-extrabold text-base tracking-wide">Chat backup</h4>
                  </div>
                </div>

                <div className="bg-[#f5f8fa] dark:bg-[#0b141a] p-3 text-slate-900 dark:text-white space-y-3 text-xs flex-1 flex flex-col justify-between my-0.5 rounded-b-[36px]">
                  {/* CLOUD BACKUP CARD */}
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                      Cloud Backup
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700/80 text-center space-y-3 shadow-sm">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xl mx-auto border border-slate-200 dark:border-slate-600">
                        ☁️
                      </div>
                      <div>
                        <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">No account connected</h5>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                          Connect a Google account to back up your chats and media safely to Google Drive.
                        </p>
                      </div>
                      <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 py-2.5 text-xs font-bold text-white shadow-md transition-all">
                        <span className="text-sm">📁</span> Connect Google Drive
                      </button>
                    </div>
                  </div>

                  {/* SETTINGS CARD */}
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                      Settings
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700/80 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <FiClock className="text-sky-500 text-sm" />
                          <span className="font-bold text-xs text-slate-900 dark:text-white">Backup frequency</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold">Never &gt;</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sky-500 text-sm">📶</span>
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Back up over Wi-Fi only</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Automatic backups skip mobile data.</div>
                          </div>
                        </div>
                        <div
                          onClick={() => setBackupWifiOnly(!backupWifiOnly)}
                          className={`w-9 h-5 rounded-full p-0.5 flex cursor-pointer transition-colors ${backupWifiOnly ? 'bg-sky-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sky-500 text-sm">🖼️</span>
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">Include Photos &amp; Videos</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Adds photos, videos and voice notes.</div>
                          </div>
                        </div>
                        <div
                          onClick={() => setBackupIncludeMedia(!backupIncludeMedia)}
                          className={`w-9 h-5 rounded-full p-0.5 flex cursor-pointer transition-colors ${backupIncludeMedia ? 'bg-sky-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight px-1 text-center">
                    Backups are end-to-end encrypted and stored privately in your Google Drive.{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/help')}
                      className="text-sky-500 font-bold underline hover:text-sky-600 transition-colors"
                    >
                      Learn more
                    </button>
                  </p>
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

      {/* 7. SECURITY AND SAFETY SECTION */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="mx-auto w-full max-w-[320px] aspect-[9/19.5] rounded-[44px] border-[3px] border-slate-800 bg-slate-950 p-2 shadow-float dark:border-slate-700 font-sans select-none overflow-hidden text-white flex flex-col justify-between relative group">
                {/* Status Bar */}
                <div className="bg-slate-950 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 shrink-0 border-b border-slate-900 z-20">
                  <span>5:32 • ...</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span>5.69 KB/s</span>
                    <span>📶 VoWiFi</span>
                    <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] text-slate-200">20</span>
                  </div>
                </div>

                {/* App Header */}
                <div className="relative rounded-t-2xl bg-gradient-to-r from-sky-600 to-blue-700 p-3 text-white shadow-md">
                  <div className="flex items-center gap-3">
                    <FiChevronLeft className="text-xl" />
                    <h4 className="font-extrabold text-base tracking-wide">Encryption &amp; Security</h4>
                  </div>
                </div>

                <div className="bg-[#f5f8fa] dark:bg-[#0b141a] p-3 text-slate-900 dark:text-white space-y-3 text-xs flex-1 flex flex-col justify-between my-0.5 rounded-b-[36px]">
                  <div className="text-center pt-1">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 text-2xl mx-auto border border-sky-300 dark:border-sky-500/40 shadow-sm">
                      🔒
                    </div>
                    <h4 className="mt-2 text-sm font-extrabold text-slate-900 dark:text-white">Your chats and calls are private</h4>
                    <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[260px] mx-auto">
                      End-to-end encryption keeps your personal messages and calls between you and the people you choose. No one outside of the chat, not even KT Messenger, can read, listen to, or share them.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-[11px] shadow-sm">
                    <div className="font-bold text-slate-500 dark:text-slate-400 text-[9px] uppercase tracking-wider mb-1">This includes your:</div>
                    <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold"><span className="text-sky-500 text-sm">💬</span> Text and voice messages</div>
                    <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold"><span className="text-sky-500 text-sm">📞</span> Audio and video calls</div>
                    <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold"><span className="text-sky-500 text-sm">📎</span> Photos, videos and documents</div>
                    <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold"><span className="text-sky-500 text-sm">📍</span> Location sharing</div>
                    <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold"><span className="text-sky-500 text-sm">🔄</span> Status updates</div>
                  </div>

                  {/* Threat Shield / Block Popup Card */}
                  <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between shadow-sm">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Report &amp; Block (Marcus Vance)</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">Spam protection &amp; security filter active</div>
                    </div>
                    <div
                      onClick={() => setShowSecurityNotifs(!showSecurityNotifs)}
                      className={`w-9 h-5 rounded-full p-0.5 flex cursor-pointer shrink-0 transition-colors ${showSecurityNotifs ? 'bg-sky-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </div>
                  </div>
                </div>

                {/* Gesture Bar */}
                <div className="bg-slate-950 py-1.5 flex justify-center shrink-0 z-20">
                  <div className="h-1 w-32 rounded-full bg-slate-700/80" />
                </div>
              </div>
            </Reveal>

            <Reveal from="right">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                Scam &amp; Threat Shield
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                <span className="text-brand-strong">Security</span> and safety
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-body">
                Protect your account from hackers and scammers and stop unwanted chats.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/security')}
                  className="group inline-flex items-center gap-2 text-base font-bold text-brand-ink hover:text-brand-strong transition-colors"
                >
                  <span>Learn more</span>
                  <FiArrowUpRight className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 8. EXPLORE MORE KT PRIVACY CONTROLS CAROUSEL (Screenshot 4 - Set B) */}
      <section className="py-20 lg:py-28 bg-surface border-b border-line">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12 items-center">
            <div>
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                Complete Control
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Explore more <span className="text-brand-strong">KT privacy controls</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                Take control of your conversations with KT Messenger privacy settings. KT offers privacy features designed to keep your messaging experience safe, secure and private.
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => scrollCarousel(-1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={() => scrollCarousel(1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </div>

            <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
              {privacyControlsCards.map((card, idx) => (
                <div key={idx} className="w-[300px] shrink-0 flex flex-col justify-between rounded-[28px] border border-line bg-cream p-6 shadow-card dark:bg-surface">
                  <div>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold text-brand-ink">
                      {card.badge}
                    </span>
                    <h3 className="mt-5 text-xl font-extrabold text-ink">{card.title}</h3>
                    <p className="mt-3 text-xs text-body leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line">
                    <button
                      onClick={() => navigate(card.to)}
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink hover:text-brand-strong transition-colors"
                    >
                      <span>Learn more</span>
                      <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 9. DISCOVER MORE FEATURES CAROUSEL */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-surface border-b border-line">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Discover <span className="text-brand-strong">more features</span>
              </h2>
              <p className="mt-4 text-base text-body">
                Learn more about what you can do on KT Messenger.
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => scrollDiscover(-1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={() => scrollDiscover(1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </div>

            <div ref={discoverRef} className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
              {discoverMoreFeatures.map((item, idx) => (
                <div key={idx} className="w-[280px] shrink-0 overflow-hidden rounded-[28px] border border-line bg-surface p-4 shadow-card dark:bg-surface-2">
                  <div className="overflow-hidden rounded-[20px]">
                    <img src={item.image} alt={item.title} className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-ink">{item.title}</h3>
                  <button
                    onClick={() => navigate(item.to)}
                    className="group mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink hover:text-brand-strong transition-colors"
                  >
                    <span>Learn more</span>
                    <FiChevronRight className="text-base transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 10. NEED MORE HELP? HIGHLIGHTED PILLS FAQ ACCORDION (Screenshot 5 - Set B) */}
      <section className="py-20 bg-surface dark:bg-cream-2 border-b border-line">
        <Container maxW="max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Need more help?</h2>
            <button onClick={() => navigate('/help')} className="inline-flex items-center gap-1 text-sm font-bold text-brand-ink hover:text-brand-strong">
              <span>See all FAQs</span>
              <FiArrowUpRight />
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const open = activeFaq === idx
              return (
                <div
                  key={idx}
                  onClick={() => setActiveFaq(open ? -1 : idx)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex items-center justify-between ${
                    open
                      ? 'bg-brand-strong text-white border-brand-strong shadow-brand'
                      : 'bg-surface text-ink border-line hover:border-brand-strong/40'
                  }`}
                >
                  <span className="font-bold text-base">{f.q}</span>
                  <span className={`grid h-8 w-8 place-items-center rounded-full transition-transform ${open ? 'bg-white/20 text-white rotate-45' : 'bg-brand-soft text-brand-ink'}`}>
                    <FiArrowUpRight className="text-lg" />
                  </span>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      <DownloadCTA />
    </MainLayout>
  )
}

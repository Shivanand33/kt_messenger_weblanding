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
  FiCheck
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

const DARK = '#0b162c'

const privacyControlsCards = [
  {
    title: 'Privacy checkup',
    desc: 'Personalize your KT Messengers privacy settings with easy step-by-step guidance to keep your account safe and private.',
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
      a: 'End-to-end encryption ensures that only you and the recipient hold the cryptographic keys to read your messages. Not even KT Messengers servers can decrypt your content.'
    },
    {
      q: 'What is two-step verification?',
      a: 'Two-step verification adds a required 6-digit PIN whenever your phone number is re-registered on KT Messengers, protecting you against SIM-swap attacks.'
    },
    {
      q: 'Is KT Messengers private and secure?',
      a: 'Yes. All messages, calls, photos, videos, and cloud backups are protected by default Signal Protocol 256-bit encryption.'
    },
    {
      q: 'How do I block and report spam contacts?',
      a: 'Open any contact info screen, tap "Block & Report". The last 5 messages will be securely reviewed to eliminate spam.'
    }
  ]

  return (
    <MainLayout>
      
      {/* 1. HERO SECTION: MESSAGE PRIVATELY (Screenshot 1 - Set A) */}
      <section style={{ backgroundColor: DARK }} className="relative overflow-hidden text-white py-16 sm:py-24 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-brand-strong/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal from="up">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-sky-300">
                  <FiShield /> Default End-to-End Encryption
                </span>
                <h1 className="mt-6 text-[3rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.8rem]">
                  Message <span className="text-brand-strong">privately</span>
                </h1>
              </Reveal>

              <Reveal from="up" delay={0.06}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
                  Your privacy is our priority. With end-to-end encryption on KT Messengers, your personal messages, photos, calls and more stay between you and the people you choose, meaning not even KT Messengers can see them.
                </p>
              </Reveal>

              <Reveal from="up" delay={0.12}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" onClick={openDownloadModal}>
                    Download App <FiDownload />
                  </Button>
                  <Button variant="onDark" size="lg" onClick={() => navigate('/security')}>
                    Security Architecture <FiChevronRight />
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* SMARTPHONE MOCKUP WITH MATRIX CIPHER ENCRYPTION OVERLAY */}
            <Reveal from="scale" delay={0.1} className="relative">
              <div className="relative mx-auto max-w-sm rounded-[40px] border-[6px] border-slate-700 bg-slate-900 p-4 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-15 flex flex-col justify-around text-[10px] font-mono text-brand-strong overflow-hidden select-none">
                  <div>%^&#encrypted_message%^&#849204%^&#signal_cipher%^&#</div>
                  <div>#9942%^&#zero_knowledge_proof%^&#256bit_aes%^&#</div>
                  <div>%^&#encrypted_message%^&#849204%^&#signal_cipher%^&#</div>
                </div>

                <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3 text-white">
                  <div className="flex items-center gap-3">
                    <img src={femaleAvatar} alt="Anika" className="h-9 w-9 rounded-full object-cover border border-emerald-500" />
                    <div>
                      <h4 className="font-bold text-sm">Anika</h4>
                      <span className="text-[10px] text-sky-400 font-semibold block">online • E2EE</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-slate-400 text-sm">
                    <FiShield className="text-brand-strong" />
                    <FiLock />
                  </div>
                </div>

                <div className="relative z-10 py-8 space-y-4 text-xs font-semibold">
                  <div className="mx-auto w-fit rounded-full bg-slate-800/80 px-3 py-1 text-[10px] text-slate-300 border border-slate-700">
                    🔒 Messages are end-to-end encrypted
                  </div>

                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm bg-slate-800 p-3 text-white max-w-[80%] shadow-md">
                      Hey! Is our trip itinerary safe on KT Messengers?
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-brand-strong p-3 text-white max-w-[80%] shadow-md">
                      100%! All chats use Signal Protocol E2EE. Not even KT servers can read them! 🛡️
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 border-t border-slate-800 pt-3">
                  <input
                    type="text"
                    readOnly
                    value="Exciting news..."
                    className="w-full rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-white outline-none border border-slate-700"
                  />
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-strong text-white font-bold">
                    ✓
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2. CHAT LOCK SECTION (Screenshot 2 - Set A) */}
      <section className="py-20 lg:py-28 bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="mx-auto max-w-sm rounded-[40px] border-[6px] border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <h4 className="font-extrabold text-ink text-lg">KT Messengers</h4>
                  <FiLock className="text-brand-strong text-lg" />
                </div>

                <div className="mt-4 rounded-2xl bg-sky-50 dark:bg-slate-800 p-4 border border-sky-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-strong text-white text-lg shadow-md">
                      🔒
                    </div>
                    <div>
                      <h5 className="font-extrabold text-ink text-sm">Locked chats</h5>
                      <span className="text-[11px] text-brand-ink font-semibold">Biometrics Protected</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-strong px-2 py-0.5 text-[10px] font-bold text-white">2</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-2">
                    <img src={nadiaAvatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold text-xs text-ink">
                        <span>Ayesha</span>
                        <span className="text-[10px] text-muted">11:32</span>
                      </div>
                      <span className="text-[11px] text-body">Video call completed</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-2">
                    <img src={maleAvatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold text-xs text-ink">
                        <span>Jordan (Dog Walk)</span>
                        <span className="text-[10px] text-muted">10:04</span>
                      </div>
                      <span className="text-[11px] text-body">Who is free around 5 PM?</span>
                    </div>
                  </div>
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

      {/* 3. DISAPPEARING MESSAGES SECTION (Screenshot 3 - Set A) */}
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
              <div className="mx-auto max-w-sm rounded-[40px] border-[6px] border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                  <h4 className="font-extrabold text-base">Breakfast Club</h4>
                  <span className="text-xs text-slate-500">Group Settings</span>
                </div>

                <div className="space-y-4 text-sm font-semibold">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Mute notifications</span>
                    <div className="w-10 h-6 bg-slate-300 rounded-full p-1"><div className="w-4 h-4 bg-white rounded-full shadow-md" /></div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200 dark:bg-slate-800 dark:border-slate-700">
                    <div>
                      <span className="block font-extrabold text-brand-strong text-sm">Disappearing messages</span>
                      <span className="text-xs text-slate-500">90 days timer active ⏱️</span>
                    </div>
                    <FiClock className="text-brand-strong text-xl" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div>
                      <span className="block font-bold">Chat lock</span>
                      <span className="text-xs text-slate-500">Lock and hide on device</span>
                    </div>
                    <div className="w-10 h-6 bg-brand-strong rounded-full p-1 flex justify-end"><div className="w-4 h-4 bg-white rounded-full shadow-md" /></div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4. SILENCE UNKNOWN CALLERS SECTION (Screenshot 4 - Set A) */}
      <section className="py-20 lg:py-28 bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="mx-auto max-w-sm rounded-[40px] border-[6px] border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-center gap-2">
                  <FiPhoneOff className="text-brand-strong text-xl" />
                  <h4 className="font-extrabold text-base">Calls Settings</h4>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-brand-strong text-base">Silence unknown callers</span>
                      <div className="w-11 h-6 bg-brand-strong rounded-full p-1 flex justify-end">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Calls from unknown numbers will be silenced. They will still be shown in the Calls tab and in your notifications.
                    </p>
                  </div>
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

      {/* 5. LAST SEEN AND ONLINE SECTION (Screenshot 1 - Set B) */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="mx-auto max-w-sm rounded-[40px] border-[6px] border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                  <h4 className="font-extrabold text-base">Last seen and online</h4>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <span className="block font-bold text-slate-500 mb-2">Who can see my last seen</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border border-slate-400" /> Everyone</div>
                      <div className="flex items-center gap-2 text-brand-strong font-bold"><span className="w-3.5 h-3.5 rounded-full bg-brand-strong flex items-center justify-center text-white text-[8px]">✓</span> My contacts</div>
                      <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border border-slate-400" /> My contacts except...</div>
                      <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border border-slate-400" /> Nobody</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="block font-bold text-slate-500 mb-2">Who can see when I&apos;m online</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-brand-strong font-bold"><span className="w-3.5 h-3.5 rounded-full bg-brand-strong flex items-center justify-center text-white text-[8px]">✓</span> Everyone</div>
                      <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border border-slate-400" /> Same as last seen</div>
                    </div>
                  </div>
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
                Choose to be seen by only those you want. You can customize your privacy settings to choose who can see when you&apos;re online, and when you last used KT Messengers.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/privacy')}
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

      {/* 6. END-TO-END ENCRYPTED BACKUPS SECTION (Screenshot 5 - Set A / Screenshot 2 - Set B) */}
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
                Keep your online backups private. Turn on encrypted backups to extend the security of KT Messengers end-to-end encryption to your messages saved in iCloud or Google Drive.
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
              <div className="mx-auto max-w-sm rounded-[40px] border-[6px] border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center text-slate-900 dark:text-white">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sky-100 dark:bg-slate-800 text-brand-strong text-3xl mb-4">
                  <FiUploadCloud />
                </div>
                <h4 className="font-extrabold text-lg">Protect your backup with end-to-end encryption</h4>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your backup will be safe, even if you lose your phone. Secure your backup with a password or a 64-digit encryption key.
                </p>
                <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Your current backup size is 376 MB
                </div>
                <button className="mt-6 w-full rounded-2xl bg-brand-strong hover:bg-brand-strong-hover py-3 text-sm font-bold text-white shadow-brand transition-all">
                  Turn on Encrypted Backup
                </button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 7. SECURITY AND SAFETY SECTION (Screenshot 3 - Set B) */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-surface border-b border-line">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="relative mx-auto max-w-sm rounded-[40px] border-[6px] border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="flex items-center gap-3 border-b pb-3 mb-4">
                  <img src={nadiaAvatar} alt="Ayesha" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-extrabold text-sm">Ayesha Pawar</h5>
                    <span className="text-[10px] text-slate-500">+1 (889) 555-0094</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3 text-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-rose-600 mx-auto text-xl font-bold">
                    👎
                  </div>
                  <h5 className="font-extrabold text-sm">Report to KT Messengers</h5>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    The last 5 messages in this chat will be sent to KT Messengers. This person won&apos;t know about the report.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 pt-1">
                    <input type="checkbox" defaultChecked className="rounded accent-brand-strong" />
                    <span>Block Ayesha Pawar</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-700 py-2 text-xs font-bold">Cancel</button>
                    <button className="flex-1 rounded-xl bg-rose-600 text-white py-2 text-xs font-bold">Report</button>
                  </div>
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
                Take control of your conversations with KT Messengers privacy settings. KT offers privacy features designed to keep your messaging experience safe, secure and private.
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

      {/* 9. DISCOVER MORE FEATURES CAROUSEL (NEW SCREENSHOT MATCH) */}
      <section style={{ backgroundColor: DARK }} className="py-20 lg:py-28 text-white border-b border-slate-800">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Discover <span className="text-sky-400">more features</span>
              </h2>
              <p className="mt-4 text-base text-slate-300">
                Learn more about what you can do on KT Messengers.
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => scrollDiscover(-1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-slate-700 text-white transition-colors hover:border-brand-strong hover:bg-slate-800"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={() => scrollDiscover(1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-slate-700 text-white transition-colors hover:border-brand-strong hover:bg-slate-800"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </div>

            <div ref={discoverRef} className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
              {discoverMoreFeatures.map((item, idx) => (
                <div key={idx} className="w-[280px] shrink-0 overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 p-4 shadow-xl">
                  <div className="overflow-hidden rounded-[20px]">
                    <img src={item.image} alt={item.title} className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-white">{item.title}</h3>
                  <button
                    onClick={() => navigate(item.to)}
                    className="group mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-sky-400 hover:text-white transition-colors"
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
      <section className="py-20 bg-cream dark:bg-surface">
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

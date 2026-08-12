import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiPhone,
  FiVideo,
  FiMonitor,
  FiVolume2,
  FiShield,
  FiUsers,
  FiCheckCircle,
  FiChevronRight,
  FiChevronDown,
  FiMic,
  FiMicOff,
  FiVideoOff,
  FiPhoneOff,
  FiShare2,
  FiZap,
  FiSmile,
  FiGlobe,
  FiHelpCircle
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { CallLoopVideo } from '../../components/common/VideoAnimations/CallLoopVideo'
import multideviceImg from '../../assets/images/multidevice.jpg'
import businessImg from '../../assets/images/business.jpg'
import securityImg from '../../assets/images/security.jpg'
import groupImg from '../../assets/images/group.jpg'
import avatarMale from '../../assets/images/avatar_male_1.png'
import avatarFemale from '../../assets/images/avatar_female_1.png'

export function CallingPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const featureTabs = [
    {
      id: 'hd-video',
      title: '1-on-1 Ultra HD Video',
      icon: <FiVideo className="text-xl" />,
      tagline: 'Face-to-face quality that feels like standing in the same room.',
      desc: 'Connect with loved ones and colleagues in crystal-clear 1080p 60fps video. Built-in dynamic bandwidth management adapts smoothly even on low 3G or weak Wi-Fi networks.',
      highlights: ['Dynamic 1080p HD Resolution', 'Zero Lag WebRTC Engine', 'End-to-End Encrypted Stream']
    },
    {
      id: 'group-calls',
      title: '32-Person Group Calls',
      icon: <FiUsers className="text-xl" />,
      tagline: 'Bring the whole team or family together without time limits.',
      desc: 'Host group video calls with up to 32 participants simultaneously. Enjoy active speaker spotlighting, grid layouts, and zero duration caps.',
      highlights: ['Grid & Speaker View Modes', 'Unlimited Call Duration', 'Instant Group Link Invites']
    },
    {
      id: 'screen-share',
      title: 'Live Screen Sharing',
      icon: <FiMonitor className="text-xl" />,
      tagline: 'Present decks, apps, and photos straight from your screen.',
      desc: 'Share your phone, tablet, or desktop screen with high frame rate and low latency. Perfect for remote presentation, technical help, or watching videos together.',
      highlights: ['Full Desktop or App Window Share', 'High Frame Rate Audio Pass', 'Cross-Platform Compatibility']
    },
    {
      id: 'ai-noise',
      title: 'AI Noise Suppression',
      icon: <FiVolume2 className="text-xl" />,
      tagline: 'Silences background noise so your voice comes through clear.',
      desc: 'Advanced deep-learning audio filters remove dog barks, keyboard clatters, street traffic, and wind noise while keeping your natural voice full and crisp.',
      highlights: ['Deep Neural Network Filter', 'Acoustic Echo Cancellation', 'Low Data Bandwidth Mode']
    },
    {
      id: 'handoff',
      title: 'Multi-Device Handoff',
      icon: <FiZap className="text-xl" />,
      tagline: 'Seamlessly switch calls between phone, desktop, and tablet.',
      desc: 'Start a call on your mobile phone while commuting, and hand it off smoothly to your Mac, Windows PC, or iPad when you reach your desk with a single click.',
      highlights: ['One-Tap Device Transfer', 'Unified Call History Sync', 'Web Browser Direct Join']
    }
  ]

  const metrics = [
    { value: '32', label: 'Max Group Callers' },
    { value: '1080p', label: 'Ultra HD Video Quality' },
    { value: '99.99%', label: 'Uptime & Reliability' },
    { value: '256-bit', label: 'End-to-End Encryption' }
  ]

  const useCases = [
    {
      title: 'Family & Friends Catchups',
      desc: 'Celebrate birthdays, holidays, and everyday moments with crisp video and interactive face filters.',
      img: groupImg
    },
    {
      title: 'Remote Business Standups',
      desc: 'Conduct team meetings with HD screen sharing, noise suppression, and hands-up notifications.',
      img: businessImg
    },
    {
      title: 'Online Tutoring & Classes',
      desc: 'Share documents, slide presentations, and whiteboards seamlessly with up to 32 students.',
      img: multideviceImg
    },
    {
      title: 'Global Consultations',
      desc: 'Host secure 1-on-1 video calls with clients worldwide, fully protected by Signal protocol E2EE.',
      img: securityImg
    }
  ]

  const comparisonTable = [
    { feature: 'End-to-End Encryption', kt: 'Default (100%)', standard: 'Optional / None', apps: 'Varies' },
    { feature: 'Group Call Capacity', kt: 'Up to 32 People', standard: '4 - 8 People', apps: 'Time Limited' },
    { feature: 'Call Time Limit', kt: 'Unlimited Free', standard: '60 Min Limit', apps: '40 Min Limit' },
    { feature: 'Screen Sharing Quality', kt: '1080p 60fps', standard: 'Basic 720p', apps: 'Paid Feature' },
    { feature: 'AI Background Noise Reduction', kt: 'Included Free', standard: 'Not Available', apps: 'Premium Tier' },
    { feature: 'Cross-Device Call Handoff', kt: 'Instant 1-Tap', standard: 'Manual Rejoin', apps: 'Not Supported' }
  ]

  const faqs = [
    {
      q: 'Are video and voice calls on KT completely free?',
      a: 'Yes! All 1-on-1 and group voice and video calls on KT Messenger are 100% free with no hidden charges, subscription requirements, or annoying time limits.'
    },
    {
      q: 'Are my calls encrypted and private?',
      a: 'Absolutely. Every single voice call, video call, and screen-sharing session on KT is protected by end-to-end encryption using the Signal Protocol. Neither KT nor any third party can listen in or view your calls.'
    },
    {
      q: 'Can I make group video calls on desktop or browser?',
      a: 'Yes, KT supports native calling across Windows, macOS, iOS, Android, iPadOS, and directly inside modern web browsers like Chrome, Safari, and Edge.'
    },
    {
      q: 'How does live screen sharing work during a call?',
      a: 'While on a call, simply tap the screen share icon. You can choose to broadcast your entire screen or a specific application window to all participants in real time.'
    },
    {
      q: 'What network speeds do I need for HD calling?',
      a: 'KT automatically adjusts video resolution and audio bitrate according to your network speed. You can enjoy clear voice calls even on 3G connections, while HD video optimizes for 4G/5G and Wi-Fi.'
    },
    {
      q: 'How many participants can join a single group call?',
      a: 'You can host up to 32 participants simultaneously in a single voice or video call with unlimited duration.'
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
                <FiPhone className="text-brand-strong" /> Next-Gen HD Calling Suite
              </div>
              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                Everyone is <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  just a call away
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                Connect instantly with crystal-clear audio and 1080p video. Unlimited time, zero fees, and 100% end-to-end encrypted across mobile, desktop, and web.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  Download Free App <FiDownload className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/help')}>
                  Explore Specs <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> 32-Person Group Calls
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> End-to-End Encrypted
                </span>
              </div>
            </Reveal>

            {/* INTERACTIVE CALL MOCKUP */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="relative w-full max-w-[420px] rounded-[46px] border-[3px] border-slate-800 bg-slate-950 p-2.5 shadow-float">
                {/* Left Side Buttons (Volume keys mockup) */}
                <div className="absolute -left-[7px] top-20 h-9 w-[4px] rounded-l-md bg-slate-700" />
                <div className="absolute -left-[7px] top-32 h-9 w-[4px] rounded-l-md bg-slate-700" />
                {/* Right Side Button (Power key mockup) */}
                <div className="absolute -right-[7px] top-24 h-12 w-[4px] rounded-r-md bg-slate-700" />
                <div className="relative aspect-[9/14] overflow-hidden rounded-[36px] bg-slate-950 p-4 text-white">
                  {/* Call Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 1080p HD • 12:45
                    </span>
                    <span className="rounded-full bg-brand-strong/80 px-3 py-1 text-[11px] font-bold">
                      E2E Encrypted
                    </span>
                  </div>

                  {/* Main Call Video Preview */}
                  <div className="mt-4 relative h-[70%] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800">
                    <img
                      src={avatarFemale}
                      alt="Call partner"
                      className="h-full w-full object-cover transition-all duration-300"
                    />
                    <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
                      Emiko (Speaking...)
                    </div>

                    {/* Self Video PIP */}
                    <div className="absolute top-3 right-3 h-28 w-20 overflow-hidden rounded-xl border-2 border-white/40 bg-slate-800 shadow-lg">
                      <img src={avatarMale} alt="You" className="h-full w-full object-cover" />
                    </div>
                  </div>

                  {/* Call Controls Bar */}
                  <div className="absolute bottom-5 inset-x-5 flex items-center justify-around rounded-full bg-slate-900/90 p-3 backdrop-blur-xl border border-slate-800">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${
                        isMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      {isMuted ? <FiMicOff /> : <FiMic />}
                    </button>

                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${
                        !isVideoOn ? 'bg-red-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
                      }`}
                    >
                      {!isVideoOn ? <FiVideoOff /> : <FiVideo />}
                    </button>

                    <button className="grid h-11 w-11 place-items-center rounded-full bg-brand-strong text-white hover:bg-brand-strong-hover">
                      <FiShare2 />
                    </button>

                    <button className="grid h-11 w-11 place-items-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md">
                      <FiPhoneOff />
                    </button>
                  </div>
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
            Engineered for Perfect Communication
          </h2>
          <p className="mt-4 text-lg text-body">
            Explore the powerful calling technologies that keep your conversations crisp, private, and effortless.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Tab Navigation Column */}
          <div className="space-y-3">
            {featureTabs.map((tab, idx) => {
              const active = activeTab === idx
              return (
                <button
                  key={tab.id}
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
                  <div>
                    <h3 className="font-bold text-base leading-snug">{tab.title}</h3>
                    <p className={`text-xs mt-0.5 line-clamp-1 ${active ? 'text-white/80' : 'text-body'}`}>{tab.tagline}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Tab Showcase Display */}
          <div className="rounded-3xl border border-line bg-surface p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink">
                Feature Deep Dive
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {featureTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {featureTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {featureTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Included in all KT apps</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                Try Feature Now <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* INTERACTIVE ANIMATED VIDEO DEMO */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20 border-y border-line">
        <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal from="left" className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                🎬 Interactive Calling Demo
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                Studio 1080p Calling &amp; Screen Share
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                Opus 48kHz spatial audio, 32-participant group calling, and 1-tap 60FPS desktop screen sharing.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> 32-Person Group Calls
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> 1080p 60FPS Screen Share
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> Spatial Audio Equalizer
                </span>
              </div>
            </Reveal>

            <Reveal from="right" className="lg:col-span-7 relative flex justify-center py-2">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line text-base">
                <span>📞</span><span>📹</span><span>🎙️</span><span>✨</span><span>💯</span>
              </motion.div>

              <div className="relative z-10">
                <CallLoopVideo />
              </div>

              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-2 left-2 sm:left-6 z-20 flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-float border border-brand-strong/30 text-xs font-bold text-brand-ink">
                <FiShield className="text-brand-strong" /> 1080p HD E2EE Calling
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE SHOWCASE 1 - AUDIO & SPATIAL QUALITY */}
      <section className="bg-brand-soft py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                <FiVolume2 className="text-brand-strong" /> Low Latency Audio Architecture
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl leading-tight">
                Hear every word as if you were in the same room
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                With Opus audio codec integration and AI-assisted echo cancellation, KT calls deliver high-fidelity 48kHz audio clarity with minimal latency even over variable mobile connections.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-surface p-4 border border-line shadow-soft">
                  <h4 className="font-bold text-ink text-sm">Opus 48kHz High-Fidelity Sound</h4>
                  <p className="mt-1 text-xs text-body">Captures full vocal range, whispers, and tone subtleties with studio-grade fidelity.</p>
                </div>
                <div className="rounded-2xl bg-surface p-4 border border-line shadow-soft">
                  <h4 className="font-bold text-ink text-sm">Spatial Audio Directionality</h4>
                  <p className="mt-1 text-xs text-body">Group calls place participant voices logically across stereo space for natural listening.</p>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="flex justify-center py-4">
              {/* iPhone Mobile Phone Device Frame */}
              <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[46px] border-[3px] border-slate-800 bg-slate-950 p-2.5 shadow-float flex flex-col select-none text-slate-900 font-sans">
                {/* Left Side Buttons (Volume keys mockup) */}
                <div className="absolute -left-[7px] top-20 h-9 w-[4px] rounded-l-md bg-slate-700" />
                <div className="absolute -left-[7px] top-32 h-9 w-[4px] rounded-l-md bg-slate-700" />
                {/* Right Side Button (Power key mockup) */}
                <div className="absolute -right-[7px] top-24 h-12 w-[4px] rounded-r-md bg-slate-700" />

                {/* Phone Screen Inner Container */}
                <div className="relative w-full h-full rounded-[36px] bg-gradient-to-b from-[#f7f9fc] to-[#e9eef6] p-3.5 sm:p-4.5 flex flex-col justify-between overflow-hidden min-h-[580px] sm:min-h-[620px]">
                  
                  {/* 1. Status Bar */}
                  <div className="flex items-center justify-between px-2 pt-0.5">
                    <span className="text-[13px] font-semibold tracking-tight text-slate-900">12:06</span>
                    
                    {/* Dynamic Island Notch */}
                    <div className="relative h-6 w-24 rounded-full bg-black flex items-center justify-end px-2.5 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>

                    {/* Battery & Signal Icons */}
                    <div className="flex items-center gap-1.5 text-slate-900">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/>
                      </svg>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 17h3v4H2v-4zm5-5h3v9H7v-9zm5-4h3v13h-3V8zm5-5h3v18h-3V3z"/>
                      </svg>
                      <div className="flex items-center">
                        <div className="w-4.5 h-2.5 rounded-[3px] border border-slate-900 p-[1px] flex items-center">
                          <div className="h-full w-full rounded-[1px] bg-emerald-500" />
                        </div>
                        <div className="w-[1.5px] h-1 bg-slate-900 rounded-r-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Top Header Controls */}
                  <div className="mt-3 flex items-center justify-between px-1">
                    {/* Minimize Button */}
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200/70 text-slate-800 hover:bg-slate-50 transition-transform active:scale-95">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14h6v6" />
                        <path d="M10 14L3 21" />
                        <path d="M20 10h-6V4" />
                        <path d="M14 10l7-7" />
                      </svg>
                    </button>

                    {/* Name & Timer */}
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                        Tanmay Girkar
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">00:06</p>
                    </div>

                    {/* Add Participant Button */}
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200/70 text-slate-800 hover:bg-slate-50 transition-transform active:scale-95">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        <path d="M16 2v4" />
                        <path d="M14 4h4" />
                      </svg>
                    </button>
                  </div>

                  {/* 3. Center Avatar & Waveform Dots */}
                  <div className="my-auto py-5 flex flex-col items-center justify-center">
                    {/* Avatar Circle with animated call halos */}
                    <div className="relative flex items-center justify-center">
                      {/* Pulsing call rings */}
                      {[0, 1].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ scale: [1, 1.55], opacity: [0.4, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, delay: i * 1.1, ease: 'easeOut' }}
                          className="absolute h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-[#1da1f2]/30"
                        />
                      ))}
                      <div className="relative p-1 rounded-full bg-white/80 ring-1 ring-slate-200 shadow-[0_12px_32px_rgba(33,150,243,0.28)]">
                        <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#4bb8f8] to-[#1888e0] border-2 border-white shadow-inner">
                          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider drop-shadow-sm">
                            TG
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 7 Animated Wave Dots */}
                    <div className="mt-6 flex items-center justify-center gap-2">
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.2, 0.85] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                          className="h-2 w-2 rounded-full bg-slate-600"
                        />
                      ))}
                    </div>
                  </div>

                  {/* 4. Bottom Grid Control Card */}
                  <div className="rounded-[26px] bg-white p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100/90">
                    <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-center">
                      {/* Video */}
                      <div className="flex flex-col items-center">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f3f7] text-slate-800 hover:bg-slate-200/80 transition-colors active:scale-95">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                          </svg>
                        </button>
                        <span className="mt-1.5 text-xs font-semibold text-slate-800">Video</span>
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col items-center">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f3f7] text-slate-800 hover:bg-slate-200/80 transition-colors active:scale-95">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            <path d="M15 3a5 5 0 0 1 5 5" />
                          </svg>
                        </button>
                        <span className="mt-1.5 text-xs font-semibold text-slate-800">Phone</span>
                      </div>

                      {/* Mute */}
                      <div className="flex flex-col items-center">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f3f7] text-slate-800 hover:bg-slate-200/80 transition-colors active:scale-95">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                          </svg>
                        </button>
                        <span className="mt-1.5 text-xs font-semibold text-slate-800">Mute</span>
                      </div>

                      {/* More */}
                      <div className="flex flex-col items-center">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f3f7] text-slate-800 hover:bg-slate-200/80 transition-colors active:scale-95">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                          </svg>
                        </button>
                        <span className="mt-1.5 text-xs font-semibold text-slate-800">More</span>
                      </div>

                      {/* Share */}
                      <div className="flex flex-col items-center">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f3f7] text-slate-800 hover:bg-slate-200/80 transition-colors active:scale-95">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="12" rx="2" />
                            <path d="M10 13l4-4" />
                            <path d="M10 9h4v4" />
                          </svg>
                        </button>
                        <span className="mt-1.5 text-xs font-semibold text-slate-800">Share</span>
                      </div>

                      {/* End */}
                      <div className="flex flex-col items-center">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-md shadow-red-500/30 hover:bg-red-600 transition-colors active:scale-95">
                          <svg className="w-6 h-6 transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                          </svg>
                        </button>
                        <span className="mt-1.5 text-xs font-semibold text-slate-800">End</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom iOS Home Indicator Bar */}
                  <div className="w-32 h-1 bg-slate-900/30 rounded-full mx-auto mt-2.5 mb-0.5" />
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
            Designed for Every Conversation
          </h2>
          <p className="mt-4 text-lg text-body">
            Whether for personal warmth or corporate efficiency, KT calling fits into all aspects of life.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((card) => (
            <Reveal key={card.title} from="up">
              <div className="group overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all hover:-translate-y-1">
                <div className="h-48 overflow-hidden bg-brand-soft">
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

      {/* 6. COMPARISON TABLE */}
      <section className="bg-surface py-16 lg:py-24 border-y border-line">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Why KT Calling Outshines the Rest
            </h2>
            <p className="mt-4 text-lg text-body">
              Compare KT Messenger calling features against traditional telecom and conventional video meeting platforms.
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">Feature</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT Messenger</th>
                  <th className="p-4 font-bold text-body">Standard Phone Calls</th>
                  <th className="p-4 font-bold text-body">Video Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="hover:bg-cream/50 transition-colors">
                    <td className="p-4 font-semibold text-ink">{row.feature}</td>
                    <td className="p-4 font-bold text-brand-strong bg-brand-soft/30">{row.kt}</td>
                    <td className="p-4 text-body">{row.standard}</td>
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
              <FiHelpCircle /> Got Questions?
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
              Ready to Experience Crystal-Clear Calls?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Download KT Messenger now on mobile, desktop, or tablet and start calling completely free today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" onClick={() => navigate('/apps')}>
                Download Free App <FiDownload />
              </Button>
              <Button variant="onDark" size="lg" onClick={() => navigate('/apps')}>
                Web Call Launcher <FiGlobe />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  )
}

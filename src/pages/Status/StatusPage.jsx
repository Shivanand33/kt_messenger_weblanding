import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiClock,
  FiLock,
  FiMic,
  FiEye,
  FiHeart,
  FiPlay,
  FiCheckCircle,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiImage,
  FiSmile,
  FiEdit3,
  FiShield
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { StatusLoopVideo } from '../../components/common/VideoAnimations/StatusLoopVideo'
import sunsetImage from '../../assets/images/sunset_landscape.png'
import beachImage from '../../assets/images/beach_bicycles.png'
import familyAvatar from '../../assets/images/group.jpg'
import avatarMale from '../../assets/images/avatar_male_1.png'
import avatarFemale from '../../assets/images/avatar_female_1.png'
import { useLanguage } from '../../context/LanguageContext'

export function StatusPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeStory, setActiveStory] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const stories = [
    { name: t('My Status'), time: '10m ago', img: sunsetImage, text: t('Evening sunset run vibes! 🌄') },
    { name: 'Emiko', time: '2h ago', img: beachImage, text: t('Weekend beach bike ride 🚲') }
  ]

  const statusTabs = [
    {
      title: t('HD Photo & Short Video Stories'),
      icon: <FiImage className="text-xl" />,
      desc: t('Post high definition photos and up to 60-second video clips that automatically vanish after 24 hours.'),
      highlights: [t('Uncompressed 4K photo resolution'), t('Up to 60s video clips'), t('Auto delete in 24 hours')]
    },
    {
      title: t('30-Second Voice Status Clips'),
      icon: <FiMic className="text-xl" />,
      desc: t('Record personal voice audio notes up to 30 seconds for quick personal updates without typing.'),
      highlights: [t('1-tap audio status recording'), t('Waveform visual display'), t('Background audio playback')]
    },
    {
      title: t('Granular Privacy Exclusions'),
      icon: <FiLock className="text-xl" />,
      desc: t('Choose who sees each update: share with all contacts, exclude specific people, or share only with selected friends.'),
      highlights: [t('My Contacts (Default)'), t('My Contacts Except...'), t('Only Share With...')]
    },
    {
      title: t('Emoji Quick Reactions & Replies'),
      icon: <FiHeart className="text-xl" />,
      desc: t('Viewers can swipe up to send quick emoji reactions or reply privately straight into your 1-on-1 chat.'),
      highlights: [t('Private 1-on-1 replies'), t('Instant emoji reactions'), t('Viewer read receipt list')]
    },
    {
      title: t('Colorful Text & Link Wallpapers'),
      icon: <FiEdit3 className="text-xl" />,
      desc: t('Share thoughts, quotes, and web hyperlinks with vibrant background colors and custom font styles.'),
      highlights: [t('Custom color gradient backgrounds'), t('Hyperlinked web URLs'), t('Rich font typography options')]
    }
  ]

  const metrics = [
    { value: '24 Hours', label: t('Automatic Disappearing') },
    { value: '100%', label: t('KT E2E Encrypted') },
    { value: '60s', label: t('HD Video Clip Limit') },
    { value: '30s', label: t('Voice Status Duration') }
  ]

  const statusUseCases = [
    {
      title: t('Daily Travel & Life Updates'),
      desc: t('Share photos of your coffee, vacation views, and workout milestones with friends.'),
      img: sunsetImage
    },
    {
      title: t('Business & Promotion Updates'),
      desc: t('Post limited time offers, flash sales, new product drops, and event announcements.'),
      img: beachImage
    },
    {
      title: t('Voice Musings & Quotes'),
      desc: t('Record a quick morning voice thought or share inspiring quotes with colorful wallpapers.'),
      img: familyAvatar
    }
  ]

  const comparisonTable = [
    { feature: t('End to End Encryption'), kt: t('100% Encrypted'), social: t('Public Server Stored'), standard: t('Not Supported') },
    { feature: t('Auto Delete Duration'), kt: '24 Hours', social: '24 Hours', standard: t('Manual Delete') },
    { feature: t('Voice Status Support'), kt: t('Included Free (30s)'), social: t('Not Supported'), standard: t('Not Supported') },
    { feature: t('Audience Control'), kt: t('Granular Exclusions'), social: t('Public / Close Friends'), standard: t('None') },
    { feature: t('Private Chat Replies'), kt: t('Direct Encrypted Reply'), social: t('Public DM'), standard: t('N/A') }
  ]

  const faqs = [
    {
      q: t('What is KT Status?'),
      a: t('Status lets you share text, photo, video, and audio updates with your contacts that automatically disappear after 24 hours.')
    },
    {
      q: t('Is my Status end to end encrypted?'),
      a: t('Yes! Just like your personal messages and calls, your Status updates are protected by end to end encryption so only the contacts you choose can view them.')
    },
    {
      q: t('Can I choose who sees my Status updates?'),
      a: t('Absolutely. In Privacy Settings, you can choose between "My Contacts", "My Contacts Except...", or "Only Share With...".')
    },
    {
      q: t('How long can a video Status clip be?'),
      a: t('You can post HD video clips up to 60 seconds in length per Status upload.')
    },
    {
      q: t('Can I see who viewed my Status?'),
      a: t('Yes. Tapping the eye icon at the bottom of your Status update displays a live list of contacts who have viewed it (if Read Receipts are enabled).')
    },
    {
      q: t('How do Voice Status updates work?'),
      a: t('In the Status tab, tap the microphone icon, press and hold to record an audio clip up to 30 seconds, pick a background color, and post.')
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
                <FiClock className="text-brand-strong" /> {t('24-Hour Disappearing Stories')}
              </div>
              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                {t('Share your everyday')} <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  {t('moments with Status')}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                {t('Share photos, HD videos, text, and 30-second voice notes that vanish after 24 hours. Protected by default end to end encryption.')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  {t('Share Status Now')} <FiDownload className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/apps')}>
                  {t('Explore Features')} <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('24-Hour Expiration')}
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('Voice & Video Status')}
                </span>
              </div>
            </Reveal>

            {/* INTERACTIVE STATUS STORY MOCKUP */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="relative w-full max-w-[360px] rounded-[40px] bg-slate-950 p-3 shadow-float border-4 border-slate-800">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[30px] bg-black">
                  {/* Status Progress Rings Header */}
                  <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
                    {stories.map((s, idx) => (
                      <div
                        key={s.name}
                        onClick={() => setActiveStory(idx)}
                        className="h-1 flex-1 rounded-full bg-white/40 cursor-pointer overflow-hidden"
                      >
                        {activeStory === idx && (
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 5, ease: 'linear' }}
                            onAnimationComplete={() => setActiveStory((prev) => (prev + 1) % stories.length)}
                            className="h-full bg-brand-strong"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Status Header Bar */}
                  <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <img src={familyAvatar} alt="" className="h-8 w-8 rounded-full border border-white object-cover" />
                      <div>
                        <p className="text-xs font-bold">{stories[activeStory].name}</p>
                        <p className="text-[10px] text-white/70">{stories[activeStory].time} • {t('Encrypted')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Story Image */}
                  <img
                    src={stories[activeStory].img}
                    alt={t('Status story')}
                    className="h-full w-full object-cover"
                  />

                  {/* Caption & Reactions */}
                  <div className="absolute bottom-4 inset-x-4 z-30 text-center">
                    <p className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md inline-block border border-white/20">
                      {stories[activeStory].text}
                    </p>
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
            {t('Rich Expression with Full Privacy Control')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('Post updates your way with HD video, voice notes, wallpaper text, and strict audience controls.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {statusTabs.map((tab, idx) => {
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
                {t('Status Feature Deep Dive')}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {statusTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {statusTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {statusTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">{t('Included free in KT Messenger')}</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                {t('Share Status Now')} <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* INTERACTIVE ANIMATED STATUS VIDEO DEMO */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20 border-y border-line">
        <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal from="left" className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                🎬 {t('Interactive Status Demo')}
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                {t('Disappearing 24-Hour Stories')}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                {t('Share photos, text, and 30-second audio voice status notes that automatically vanish after 24 hours.')}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('24-Hour Auto Vanish')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('30s Voice Status Clips')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('Granular Contact Rules')}
                </span>
              </div>
            </Reveal>

            <Reveal from="right" className="lg:col-span-7 relative flex justify-center py-2">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line text-base">
                <span>📸</span><span>🎙️</span><span>⏳</span><span>🔥</span><span>💯</span>
              </motion.div>

              <div className="relative z-10">
                <StatusLoopVideo />
              </div>

              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-2 left-2 sm:left-6 z-20 flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-float border border-brand-strong/30 text-xs font-bold text-brand-ink">
                <FiShield className="text-brand-strong" /> {t('24-Hour Vanishing Encrypted Status')}
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE SHOWCASE - VOICE STATUS */}
      <section className="bg-brand-soft py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                <FiMic className="text-brand-strong" /> {t('Audio Storytelling')}
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
                {t('Record 30-second Voice Status updates')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                {t('Share personal morning thoughts, song snippets, or quick voice announcements with contacts when typing feels too formal.')}
              </p>

              <div className="mt-6 space-y-3 text-sm font-semibold text-ink">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('1-tap mic recording up to 30 seconds')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('Pick custom background colors & emoji overlays')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('Encrypted playback for authorized contacts only')}</span>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="flex justify-center">
              <div className="w-full max-w-[360px] rounded-3xl bg-surface p-6 shadow-float border border-line text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-strong text-white text-2xl mb-4 shadow-brand">
                  <FiMic />
                </div>
                <h3 className="font-bold text-lg text-ink">{t('Voice Status Update')}</h3>
                <p className="text-xs text-body mt-1">&quot;{t('Morning thoughts on our upcoming launch! ☕')}&quot;</p>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-cream p-3 border border-line">
                  <button className="grid h-8 w-8 place-items-center rounded-full bg-brand-strong text-white text-xs">
                    ▶
                  </button>
                  <div className="flex-1 h-2 rounded-full bg-brand-soft overflow-hidden">
                    <div className="h-full w-3/4 bg-brand-strong" />
                  </div>
                  <span className="text-xs font-bold text-brand-ink">0:22</span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. STATUS USE CASES GRID */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('Ways to Use Status')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('Share personal stories, product updates, or daily thoughts effortlessly.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {statusUseCases.map((card) => (
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
              {t('Status Feature Comparison')}
            </h2>
            <p className="mt-4 text-lg text-body">
              {t('How KT Status compares with public social stories and legacy status updates.')}
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">{t('Feature')}</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT Status</th>
                  <th className="p-4 font-bold text-body">{t('Social Media Stories')}</th>
                  <th className="p-4 font-bold text-body">{t('Standard SMS Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="hover:bg-cream/50 transition-colors">
                    <td className="p-4 font-semibold text-ink">{row.feature}</td>
                    <td className="p-4 font-bold text-brand-strong bg-brand-soft/30">{row.kt}</td>
                    <td className="p-4 text-body">{row.social}</td>
                    <td className="p-4 text-body">{row.standard}</td>
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
              <FiHelpCircle /> {t('Status FAQs')}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('Frequently Asked Questions')}
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
              {t('Share Your First Status Update Today')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              {t('Download KT Messenger now to share 24-hour HD video, photos, and voice status updates.')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" onClick={() => navigate('/apps')}>
                {t('Download Free App')} <FiDownload />
              </Button>
              <Button variant="onDark" size="lg" onClick={() => navigate('/apps')}>
                {t('Launch Web App')} <FiChevronRight />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiMessageSquare,
  FiLock,
  FiFilter,
  FiBookmark,
  FiGlobe,
  FiClock,
  FiImage,
  FiPaperclip,
  FiMic,
  FiSmile,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiChevronDown,
  FiChevronLeft,
  FiArrowRight,
  FiHelpCircle,
  FiZap
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { MessagingLoopVideo } from '../../components/common/VideoAnimations/MessagingLoopVideo'
import { KtChatScreen } from '../../components/common/AppScreens/KtChatScreen'
import weddingImg from '../../assets/images/wedding_grid.png'
import hdImg from '../../assets/images/hd_landscape.png'
import groupImg from '../../assets/images/group.jpg'
import securityImg from '../../assets/images/security.jpg'
import privateImg from '../../assets/images/private.jpg'
import avatarMale from '../../assets/images/avatar_male_1.png'
import avatarFemale from '../../assets/images/avatar_female_1.png'
import { useLanguage } from '../../context/LanguageContext'

export function MessagingPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)
  const [activeExpress, setActiveExpress] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)
  const carouselRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const scrollAmount = dir === 'left' ? -360 : 360
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const organizeTabs = [
    {
      title: t('Smart Inbox Filters'),
      icon: <FiFilter className="text-xl" />,
      desc: t('Quickly toggle between All, Unread, Groups, and Favorites to focus on what matters most.'),
      highlights: [t('One tap filter tabs'), t('Custom favorite chat list'), t('Unread priority counter')]
    },
    {
      title: t('Pinned & Starred Messages'),
      icon: <FiBookmark className="text-xl" />,
      desc: t('Pin up to 10 important chats at the top of your inbox and star key messages for quick reference.'),
      highlights: [t('Pin priority conversations'), t('Bookmark important notes & links'), t('Global star search')]
    },
    {
      title: t('Rich Markdown Formatting'),
      icon: <FiMessageSquare className="text-xl" />,
      desc: t('Add bold, italics, strikethrough, monospace, inline code, quotes, and bullet lists effortlessly.'),
      highlights: [t('Full markdown syntax support'), t('Clean visual formatting bar'), t('Syntax highlighting')]
    },
    {
      title: t('Live In Chat Translation'),
      icon: <FiGlobe className="text-xl" />,
      desc: t('Translate incoming and outgoing messages into 50+ languages instantly without leaving the chat thread.'),
      highlights: [t('Instant 1-tap translation'), t('50+ supported global languages'), t('Privacy preserved on device')]
    },
    {
      title: t('Disappearing Messages'),
      icon: <FiClock className="text-xl" />,
      desc: t('Set automatic expiration timers for chats ranging from 24 hours to 90 days for complete privacy.'),
      highlights: [t('Custom duration settings (24h, 7d, 90d)'), t('Default timer for new chats'), t('Sender & receiver auto wipe')]
    }
  ]

  const expressItems = [
    {
      title: t('Animated Stickers & GIFs'),
      desc: t('Express yourself with thousands of animated stickers and trending GIF integration.'),
      icon: <FiSmile className="text-xl" />
    },
    {
      title: t('Instant Emoji Reactions'),
      desc: t('React to any message with any emoji from your keyboard to show your thoughts instantly.'),
      icon: <FiZap className="text-xl" />
    },
    {
      title: t('Voice Notes with Speed Control'),
      desc: t('Send voice notes and listen back at 1.5x or 2x speed with wave scrubbing controls.'),
      icon: <FiMic className="text-xl" />
    },
    {
      title: t('60-Second Video Notes'),
      desc: t('Tap to switch from voice to video mode and send circular instant video updates.'),
      icon: <FiImage className="text-xl" />
    }
  ]

  const metrics = [
    { value: '100B+', label: t('Daily Messages Delivered') },
    { value: '< 50ms', label: t('Average Delivery Latency') },
    { value: '2 GB', label: t('Max File Attachment Limit') },
    { value: '100%', label: t('KT E2E Encrypted') }
  ]

  const comparisonTable = [
    { feature: t('End to End Encryption'), kt: t('Default (100%)'), sms: t('None (Plain Text)'), apps: t('Partial / Opt in') },
    { feature: t('File Sharing Limit'), kt: t('Up to 2 GB'), sms: t('3.5 MB Max'), apps: t('100 MB Limit') },
    { feature: t('HD Photo & Video Quality'), kt: t('Uncompressed HD'), sms: t('Heavily Compressed'), apps: t('Compressed Standard') },
    { feature: t('In Chat Translation'), kt: t('Built in (50+ languages)'), sms: t('Not Available'), apps: t('Third party required') },
    { feature: t('Disappearing Messages'), kt: t('Included Free'), sms: t('Not Supported'), apps: t('Limited Timer') },
    { feature: t('Cross Device Sync'), kt: t('Instant Cloud Sync'), sms: t('Carrier Locked'), apps: t('Manual Sync') }
  ]

  const faqs = [
    {
      q: t('Are personal messages on KT encrypted by default?'),
      a: t('Yes! Every 1-on-1 and group chat on KT Messenger is end to end encrypted by default using the industry gold KT Encryption Protocol. No one outside the chat, not even KT, can read your messages.')
    },
    {
      q: t('What is the maximum file size I can send in a message?'),
      a: t('You can send files, documents, zip archives, and uncompressed media up to 2GB per attachment directly inside any chat thread.')
    },
    {
      q: t('How does live in chat translation work?'),
      a: t('Simply press and hold any message in a chat and tap "Translate". You can select your preferred target language, and KT will render the translation inline.')
    },
    {
      q: t('Can I edit a message after sending it?'),
      a: t('Yes, you can edit sent messages within 15 minutes of sending. Simply long press the message and select "Edit". Edited messages display an "Edited" badge for transparency.')
    },
    {
      q: t('How do disappearing messages work?'),
      a: t('When enabled for a chat, messages automatically erase for both sender and recipient after the chosen duration (24 hours, 7 days, or 90 days).')
    },
    {
      q: t('Can I lock specific chats behind biometric protection?'),
      a: t('Yes! Using Chat Lock, you can move sensitive conversations into a protected folder accessible only via FaceID, Fingerprint, or a custom secret passcode.')
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
                <FiMessageSquare className="text-brand-strong" /> {t('Modern Messaging Platform')}
              </div>
              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                {t('Connect your way with')} <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  {t('lightning fast messaging')}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                {t('Expressive, private, and seamlessly synced across all your devices. Send high def media, voice notes, and large files protected by default end to end encryption.')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  {t('Download KT App')} <FiDownload className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/apps')}>
                  {t('Try Web Version')} <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('2GB File Attachments')}
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('KT Encryption Protocol E2EE')}
                </span>
              </div>
            </Reveal>

            {/* INTERACTIVE CHAT MOCKUP MATCHING SCREENSHOT 1 */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <KtChatScreen
                className="w-full max-w-[320px]"
                showControls={false}
                showProgress={false}
                showPhoto={false}
                showEncryptionNote={false}
              />
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

      {/* 3. INTERACTIVE FEATURE SWITCHER (ORGANIZATION & SMART TOOLS) */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('Organize & Control Your Conversations')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('Stay structured, filter through noise, and communicate across languages with zero friction.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {organizeTabs.map((tab, idx) => {
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
                {t('Smart Messaging Pillar')}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {organizeTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {organizeTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {organizeTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">{t('Available on iOS, Android & Desktop')}</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                {t('Get Started')} <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* INTERACTIVE ANIMATED CHAT VIDEO DEMO */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20 border-y border-line">
        <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal from="left" className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                {t('🎬 Interactive Messaging Demo')}
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                {t('Instant Messaging & 2GB Media')}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                {t('Send uncompressed 4K photos, 2GB ZIP documents, and voice notes with double blue tick delivery confirmations.')}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('Double Blue Ticks ✔✔')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('2GB Uncompressed Files')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('1.5x Speed Voice Notes')}
                </span>
              </div>
            </Reveal>

            <Reveal from="right" className="lg:col-span-7 relative flex justify-center py-2">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line text-base">
                <span>😍</span><span>😂</span><span>😮</span><span>🙏</span><span>👏</span><span>💯</span>
              </motion.div>

              <div className="relative z-10">
                <MessagingLoopVideo />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. RICH MEDIA & LARGE ATTACHMENTS CAROUSEL */}
      <section className="overflow-x-clip bg-brand-soft py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            {/* Opaque, full-height text column: the rail slides underneath it, so
                cards disappear behind the copy instead of into a visible box. */}
            <Reveal
              from="left"
              className="relative flex min-w-0 flex-col justify-between lg:z-20 lg:self-stretch lg:bg-brand-soft lg:ml-[calc(var(--edge-gutter)*-1)] lg:pl-[var(--edge-gutter)]"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                  <FiPaperclip /> {t('High Speed Media Engine')}
                </div>
                <h2 className="mt-4 max-w-md text-3xl font-extrabold leading-tight text-ink text-balance sm:text-4xl lg:text-[2.75rem]">
                  {t('Share more than just plain text')}
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-body">
                  {t('Send ultra high definition 4K photos, uncompressed videos, and massive files up to 2GB without ever exiting your chat thread.')}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </Reveal>

            <Reveal from="right" className="min-w-0">
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:ml-[calc(var(--msg-occlusion)*-1)] lg:pl-[var(--msg-occlusion)] lg:scroll-pl-[var(--msg-occlusion)] lg:mr-[calc(var(--edge-gutter)*-1)] lg:pr-[var(--edge-gutter)]"
              >
                {/* Media Card 1 */}
                <div className="w-[320px] shrink-0">
                  <div className="h-44 overflow-hidden rounded-2xl">
                    <img src={weddingImg} alt={t('Photos')} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-ink">{t('4K Photo Bundles')}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{t('Share albums of up to 100 full res photos simultaneously without loss of details.')}</p>
                </div>

                {/* Media Card 2 */}
                <div className="w-[320px] shrink-0">
                  <div className="relative h-44 overflow-hidden rounded-2xl">
                    <img src={hdImg} alt={t('HD Video')} className="h-full w-full object-cover" />
                    <span className="absolute top-2 left-2 rounded-md bg-brand-strong px-2 py-0.5 text-[10px] font-bold text-white">
                      HD 60FPS
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-ink">{t('Uncompressed HD Video')}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{t('Preserve raw video clarity and frame rates so your memories look crisp.')}</p>
                </div>

                {/* Media Card 3 */}
                <div className="w-[320px] shrink-0">
                  <div className="h-44 rounded-2xl bg-cream border border-line flex flex-col items-center justify-center p-4">
                    <div className="h-14 w-14 rounded-2xl bg-brand-soft text-brand-strong font-bold flex items-center justify-center text-lg mb-2">
                      2GB
                    </div>
                    <span className="text-xs font-semibold text-ink">Project_Archive.zip</span>
                    <span className="text-[10px] text-muted">1.85 GB • ZIP File</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-ink">{t('2 GB File Attachments')}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{t('Send PDFs, zip files, code repositories, and presentations without cloud link dependencies.')}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. EXPRESSION ENGINE SECTION */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('Express Yourself Beyond Plain Text')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('Bring fun, energy, and personality to every interaction with modern creative messaging tools.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {expressItems.map((item) => (
            <Reveal key={item.title} from="up">
              <button
                type="button"
                onClick={() => navigate('/apps')}
                className="group h-full w-full text-left rounded-3xl border border-line bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-strong/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong mb-4 transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-line flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-brand-ink">{t('Included free in KT Chat')}</span>
                  <FiArrowRight className="text-[11px] text-brand-ink transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6. COMPARISON MATRIX */}
      <section className="bg-surface py-16 lg:py-24 border-y border-line">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('How KT Messaging Compares')}
            </h2>
            <p className="mt-4 text-lg text-body">
              {t('See how KT Messenger raises the bar for speed, file handling, and encryption.')}
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">{t('Feature')}</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT Messenger</th>
                  <th className="p-4 font-bold text-body">{t('Standard SMS / MMS')}</th>
                  <th className="p-4 font-bold text-body">{t('Other Chat Apps')}</th>
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
              <FiHelpCircle /> {t('FAQs')}
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
              {t('Start Messaging Freely Today')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              {t('Download KT Messenger now across all your devices and experience private, high speed communication.')}
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

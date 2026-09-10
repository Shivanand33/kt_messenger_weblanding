import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiRadio,
  FiCheckCircle,
  FiSearch,
  FiLock,
  FiHeart,
  FiThumbsUp,
  FiStar,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiEye,
  FiShare2,
  FiTrendingUp,
  FiShield
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { ChannelsLoopVideo } from '../../components/common/VideoAnimations/ChannelsLoopVideo'
import channelImg from '../../assets/images/business.jpg'
import sportsImg from '../../assets/images/beach_bicycles.png'
import techImg from '../../assets/images/hd_landscape.png'
import newsImg from '../../assets/images/multidevice.jpg'
import { useLanguage } from '../../context/LanguageContext'

export function ChannelsPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [followerCount, setFollowerCount] = useState(148500)
  const [isFollowing, setIsFollowing] = useState(false)
  const [reactions, setReactions] = useState({ '❤️': 1420, '🔥': 980, '👏': 650, '🚀': 420 })
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1))
  }

  const handleReact = (emoji) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: prev[emoji] + 1
    }))
  }

  const channelTabs = [
    {
      title: t('One Way Broadcast Engine'),
      icon: <FiRadio className="text-xl" />,
      desc: t('Deliver announcements, photos, videos, and links to unlimited subscribers without thread clutter or noise.'),
      highlights: [t('Unlimited subscriber capacity'), t('Rich text & video attachments'), t('Instant push notifications')]
    },
    {
      title: t('Complete Identity Shield'),
      icon: <FiLock className="text-xl" />,
      desc: t('Your phone number, profile photo, and personal identity remain 100% hidden from admins and fellow subscribers.'),
      highlights: [t('Admins cannot see subscriber numbers'), t('Subscribers list is completely private'), t('Encrypted channel data')]
    },
    {
      title: t('Emoji Reactions & Polls'),
      icon: <FiHeart className="text-xl" />,
      desc: t('Gather community feedback with real time emoji reactions and channel broadcast polls without exposing user info.'),
      highlights: [t('Private emoji feedback'), t('Broadcast poll creation'), t('Live reaction metrics')]
    },
    {
      title: t('Directory & Verified Badges'),
      icon: <FiSearch className="text-xl" />,
      desc: t('Browse searchable channel categories (News, Tech, Sports, Entertainment) and identify official creators with verified ticks.'),
      highlights: [t('Searchable public directory'), t('Verified blue checkmarks'), t('Trending channel rankings')]
    },
    {
      title: t('Multi Admin Suite'),
      icon: <FiShield className="text-xl" />,
      desc: t('Assign co admins with granular posting permissions, post scheduling, and detailed reach analytics.'),
      highlights: [t('Multiple posting admins'), t('Post view counter analytics'), t('Automated link previews')]
    }
  ]

  const metrics = [
    { value: t('Unlimited'), label: t('Subscriber Capacity') },
    { value: '100%', label: t('Subscriber Privacy Shield') },
    { value: '50+', label: t('Channel Categories') },
    { value: '< 1s', label: t('Broadcast Push Speed') }
  ]

  const featuredChannels = [
    {
      name: t('KT Tech Pulse'),
      category: t('Technology & AI'),
      followers: '148.5K',
      desc: t('Daily breakdown of breakthrough tech, gadgets, and next gen AI software updates.'),
      img: techImg
    },
    {
      name: t('Global Sports Daily'),
      category: t('Sports & Football'),
      followers: '320.2K',
      desc: t('Live scores, transfer news, match highlights, and exclusive athlete commentary.'),
      img: sportsImg
    },
    {
      name: t('World News Hub'),
      category: t('News & Headlines'),
      followers: '850.1K',
      desc: t('Breaking news alerts, geopolitics, economic trends, and verified report summaries.'),
      img: newsImg
    },
    {
      name: t('Creative Studio Brief'),
      category: t('Design & Culture'),
      followers: '92.4K',
      desc: t('UI/UX inspiration, digital artwork showcases, and creative industry insights.'),
      img: channelImg
    }
  ]

  const comparisonTable = [
    { feature: t('Subscriber Privacy'), kt: t('100% Invisible'), social: t('Public Profiles'), email: t('Admins see email') },
    { feature: t('Broadcast Noise'), kt: t('Zero Clutter'), social: t('Comments Clutter'), email: t('Spam Filters') },
    { feature: t('Push Delivery Speed'), kt: t('Instant Push'), social: t('Algorithm Dependant'), email: t('Slow / Delay') },
    { feature: t('Verified Authenticity'), kt: t('Verified Ticks'), social: t('Paid Badges'), email: t('No Verification') },
    { feature: t('Subscriber Capacity'), kt: t('Unlimited Free'), social: t('Algorithm Caps'), email: t('Tiered Pricing') }
  ]

  const faqs = [
    {
      q: t('What are KT Channels?'),
      a: t('Channels are a one way broadcast tool for admins to send text updates, photos, videos, stickers, and polls to an unlimited audience of subscribers.')
    },
    {
      q: t('Can channel admins or other followers see my phone number?'),
      a: t('No. Channels are built with total privacy. Admins cannot view your phone number, profile photo, or name, and subscribers cannot see who else follows the channel.')
    },
    {
      q: t('How do I find and follow channels on KT?'),
      a: t('You can discover channels via the "Updates" tab inside KT, search by topic or keyword in the directory, or tap an invite link shared on websites or social media.')
    },
    {
      q: t('Can I create my own channel on KT?'),
      a: t('Yes! Anyone can create a channel on KT Messenger for free with no subscriber limits or hosting fees.')
    },
    {
      q: t('How do verified badges work for channels?'),
      a: t('Official figures, organizations, and news outlets can apply for a verified badge to signal authenticity to followers.')
    },
    {
      q: t('Are channel broadcasts end to end encrypted?'),
      a: t('Because channels are public broadcast tools intended for large audiences, channel updates are stored securely and encrypted in transit, while personal chats remain KT E2EE.')
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
                <FiRadio className="text-brand-strong" /> {t('Private Broadcast Channels')}
              </div>
              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                {t('Stay updated on')} <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  {t('what matters most to you')}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                {t('Follow your favorite creators, sports teams, news outlets, and organizations for private updates directly inside KT Messenger.')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  {t('Explore Directory')} <FiDownload className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/apps')}>
                  {t('Create Channel')} <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('Unlimited Audience')}
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('100% Subscriber Privacy')}
                </span>
              </div>
            </Reveal>

            {/* INTERACTIVE CHANNEL BROADCAST MOCKUP */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="relative w-full max-w-[420px] rounded-[36px] border border-line bg-surface p-6 shadow-float">
                <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={techImg} alt={t('Channel')} className="h-12 w-12 rounded-full object-cover border-2 border-brand-strong" />
                    <div>
                      <h3 className="flex items-center gap-1.5 font-bold text-ink text-base">
                        {t('KT Tech Pulse')} <FiCheckCircle className="text-brand-strong text-sm" />
                      </h3>
                      <p className="text-xs text-muted">{followerCount.toLocaleString()} {t('subscribers')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleFollow}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      isFollowing
                        ? 'bg-cream text-ink border border-line'
                        : 'bg-brand-strong text-white hover:bg-brand-strong-hover shadow-brand'
                    }`}
                  >
                    {isFollowing ? t('Following ✓') : t('Follow +')}
                  </button>
                </div>

                {/* Broadcast Post */}
                <div className="rounded-2xl bg-cream p-4 border border-line">
                  <p className="text-xs leading-relaxed text-body">
                    🚀 <strong>{t('Major Platform Update:')}</strong> {t('Next gen features are now live! Enjoy HD video notes, custom theme engines, and real time AI assistant integration across all devices.')}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                    {Object.entries(reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReact(emoji)}
                        className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink shadow-soft border border-line hover:scale-105 transition-transform"
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px] text-muted">{count}</span>
                      </button>
                    ))}
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
            {t('Powerful Publishing for Creators & Brands')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('Reach your audience directly without algorithmic suppression, privacy risks, or noisy comment sections.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {channelTabs.map((tab, idx) => {
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
                {t('Broadcast Power Pillar')}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {channelTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {channelTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {channelTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">{t('Free for all creators & channels')}</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                {t('Create Channel')} <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* INTERACTIVE ANIMATED CHANNELS VIDEO DEMO */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20 border-y border-line">
        <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal from="left" className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                {t('🎬 Interactive Channels Demo')}
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                {t('1-to Many Broadcast Channels')}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                {t('Broadcast to unlimited subscribers while keeping phone numbers & admin identity 100% private.')}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('Unlimited Subscribers')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('Identity Shield Active')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('Private Emoji Reactions')}
                </span>
              </div>
            </Reveal>

            <Reveal from="right" className="lg:col-span-7 relative flex justify-center py-2">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line text-base">
                <span>📢</span><span>🔥</span><span>❤️</span><span>👏</span><span>🚀</span>
              </motion.div>

              <div className="relative z-10">
                <ChannelsLoopVideo />
              </div>

              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-2 left-2 sm:left-6 z-20 flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-float border border-brand-strong/30 text-xs font-bold text-brand-ink">
                <FiShield className="text-brand-strong" /> {t('Subscriber Identity Shielded')}
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE SHOWCASE - ABSOLUTE PRIVACY SHIELD */}
      <section className="bg-brand-soft py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                <FiLock className="text-brand-strong" /> {t('Subscriber Identity Shield')}
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
                {t('Follow channels in complete personal privacy')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                {t('Unlike public social networks where following a page exposes your profile, phone number, and activity to strangers, KT Channels guarantee absolute anonymity.')}
              </p>

              <div className="mt-6 space-y-3 text-sm font-semibold text-ink">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('Channel admins cannot see your phone number or profile name')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('Subscribers list is completely invisible to other followers')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('30-day automatic broadcast message clearing option')}</span>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="flex justify-center">
              <div className="w-full max-w-[380px] rounded-3xl bg-surface p-6 shadow-float border border-line">
                <div className="flex items-center gap-3 text-brand-ink font-bold text-sm mb-3">
                  <FiLock className="text-brand-strong text-lg" /> {t('Privacy Firewall Active')}
                </div>
                <p className="text-xs text-body leading-relaxed">
                  {t('Your identity is protected at all times. Explore sports, news, and entertainment updates with peace of mind.')}
                </p>
                <div className="mt-4 rounded-2xl bg-cream p-4 border border-line space-y-2 text-xs">
                  <div className="flex justify-between text-ink font-semibold">
                    <span>{t('Phone Number:')}</span>
                    <span className="text-brand-strong">{t('•••••••• Hidden')}</span>
                  </div>
                  <div className="flex justify-between text-ink font-semibold">
                    <span>{t('Profile Photo:')}</span>
                    <span className="text-brand-strong">{t('Protected')}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. FEATURED CHANNELS GRID */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('Popular Channels on KT')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('Explore top verified channels across technology, sports, news, and creative arts.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredChannels.map((card) => (
            <Reveal key={card.name} from="up">
              <div className="group overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all hover:-translate-y-1">
                <div className="h-44 overflow-hidden bg-brand-soft">
                  <img src={card.img} alt={card.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold text-brand-ink uppercase tracking-wider">{card.category}</span>
                  <h3 className="text-lg font-bold text-ink mt-1 flex items-center gap-1.5">
                    {card.name} <FiCheckCircle className="text-brand-strong text-sm" />
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-body line-clamp-2">{card.desc}</p>
                  <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                    <span className="text-xs text-muted font-medium">{card.followers} {t('followers')}</span>
                    <span className="text-xs font-bold text-brand-strong group-hover:underline">{t('Follow →')}</span>
                  </div>
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
              {t('Channels vs Traditional Social Feeds')}
            </h2>
            <p className="mt-4 text-lg text-body">
              {t('Why creators and readers prefer KT Channels over algorithm driven feeds and email blasts.')}
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">{t('Feature')}</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">{t('KT Channels')}</th>
                  <th className="p-4 font-bold text-body">{t('Social Feeds')}</th>
                  <th className="p-4 font-bold text-body">{t('Email Newsletters')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="hover:bg-cream/50 transition-colors">
                    <td className="p-4 font-semibold text-ink">{row.feature}</td>
                    <td className="p-4 font-bold text-brand-strong bg-brand-soft/30">{row.kt}</td>
                    <td className="p-4 text-body">{row.social}</td>
                    <td className="p-4 text-body">{row.email}</td>
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
              <FiHelpCircle /> {t('Channel FAQs')}
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
              {t('Explore & Broadcast on Channels Today')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              {t('Download KT Messenger now to subscribe to top creators or launch your own broadcast channel.')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" onClick={() => navigate('/apps')}>
                {t('Explore Directory')} <FiDownload />
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

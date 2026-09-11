import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiPlayCircle,
  FiPlay,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiUserCheck,
  FiShield,
  FiCheckCircle,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiVideo,
  FiZap,
  FiCheck
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { KtMinisScreen } from '../../components/common/AppScreens/KtMinisScreen'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../services/apiClient'
import { useRemoteContent } from '../../hooks/useRemoteContent'
import { useAdminSeo } from '../../hooks/useAdminSeo'

export function MinisPage() {
  useAdminSeo('minis', '/minis')

  const navigate = useNavigate()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const minisTabs = [
    {
      title: t('Full Screen Vertical Feed'),
      icon: <FiVideo className="text-xl" />,
      desc: t('Scroll seamlessly through high-definition vertical clips with immersive audio and smooth transitions.'),
      highlights: [t('Full 1080p HD vertical video'), t('Swipe-up continuous infinite scrolling'), t('Fast low-latency video loading')]
    },
    {
      title: t('Like, Comment & Share'),
      icon: <FiHeart className="text-xl" />,
      desc: t('Interact with your favorite short clips using instant heart reactions, comments, and direct sharing to chat.'),
      highlights: [t('Double-tap instant like animation'), t('Private or public comment threads'), t('1-tap share directly to KT chats')]
    },
    {
      title: t('Follow Your Creators'),
      icon: <FiUserCheck className="text-xl" />,
      desc: t('Stay up to date with top creators, friends, and channels by following them with a single tap.'),
      highlights: [t('Dedicated creator profile view'), t('Instant new upload notifications'), t('Custom creator feed filter')]
    },
    {
      title: t('In-App Seamless Player'),
      icon: <FiPlayCircle className="text-xl" />,
      desc: t('Built right beside your chats and calls so you can watch trending Minis without leaving KT Messenger.'),
      highlights: [t('Zero app switching required'), t('Background audio playback support'), t('Quick picture-in-picture mode')]
    },
    {
      title: t('Private & Secure Feed'),
      icon: <FiShield className="text-xl" />,
      desc: t('Your watch history and engagement remain private with end-to-end security and no intrusive tracking.'),
      highlights: [t('Zero third-party tracking'), t('Encrypted data protection'), t('Custom content preference filters')]
    }
  ]

  const metrics = [
    { value: '1080p 60FPS', label: t('Ultra HD Video Feed') },
    { value: '100%', label: t('KT Encrypted & Private') },
    { value: '0 Ads', label: t('Uninterrupted Viewing') },
    { value: 'Instant', label: t('In-App Feed Access') }
  ]

  const comparisonTable = [
    { feature: t('In-App Chat Integration'), kt: t('Built-in Next to Chats'), social: t('Separate Apps Required'), standard: t('Not Supported') },
    { feature: t('Ad-Free Experience'), kt: t('100% Clean & Fast'), social: t('Heavy Interstitial Ads'), standard: t('Ad Supported') },
    { feature: t('Direct Chat Sharing'), kt: t('1-Tap Encrypted Share'), social: t('External Link Only'), standard: t('Limited Sharing') },
    { feature: t('Privacy Protection'), kt: t('Zero Data Harvesting'), social: t('Cross-Site Tracking'), standard: t('Basic Cookie Track') },
    { feature: t('HD Video Resolution'), kt: t('Up to 1080p 60FPS'), social: t('Compressed Quality'), standard: t('Standard Quality') }
  ]

  const localFaqs = [
    {
      q: t('What is KT Minis?'),
      a: t('KT Minis is a vertical short video feed built directly inside KT Messenger. It allows you to discover, watch, like, comment, and share entertaining short clips with your friends.')
    },
    {
      q: t('How do I open Minis in the KT Messenger app?'),
      a: t('Simply open KT Messenger and tap the Minis tab at the bottom navigation bar right beside your chats and calls.')
    },
    {
      q: t('Can I share Minis directly into my chats?'),
      a: t('Yes! Tapping the share icon on any Mini clip lets you send it instantly to any contact or group inside KT Messenger.')
    },
    {
      q: t('Are KT Minis free to watch?'),
      a: t('Yes, KT Minis is 100% free with no subscription required and no ad interruptions.')
    },
    {
      q: t('How do I follow creators on Minis?'),
      a: t('While watching a Mini, tap the "Follow" button next to the creator username to subscribe to their latest clips.')
    }
  ]

  const [remoteFaqs] = useRemoteContent(
    () => api.listFaqs('minis'),
    null,
    (rows) => Array.isArray(rows) && rows.length > 0,
  )
  const faqs = remoteFaqs ? remoteFaqs.map((r) => ({ q: r.question, a: r.answer })) : localFaqs

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-cream py-14 lg:py-20 border-b border-line dark:bg-surface">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column */}
            <Reveal from="left" className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-strong/30 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
                <FiPlay className="text-brand-strong" /> {t('Minis Experience')}
              </div>

              <h1 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                {t('Minis Short Video, Full Screen')}
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-body max-w-xl">
                {t('A vertical clip feed with likes, comments and shares, built right beside your chats and calls.')}
              </p>

              {/* Tech Specs / Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface p-2 px-3 text-xs font-bold text-ink border border-line shadow-soft">
                  <FiCheck className="text-brand-strong text-sm" />
                  <span>{t('Full Screen Vertical Feed')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface p-2 px-3 text-xs font-bold text-ink border border-line shadow-soft">
                  <FiCheck className="text-brand-strong text-sm" />
                  <span>{t('Like, Comment & Share')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface p-2 px-3 text-xs font-bold text-ink border border-line shadow-soft">
                  <FiCheck className="text-brand-strong text-sm" />
                  <span>{t('Follow Your Creators')}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  <span>{t('Explore Minis')}</span>
                  <FiChevronRight />
                </Button>
                <span className="text-xs font-bold text-brand-ink bg-brand-soft px-3 py-2 rounded-full border border-brand-strong/30">
                  {t('Short Video • In App Feed')}
                </span>
              </div>
            </Reveal>

            {/* Right Column: Phone Mockup */}
            <Reveal from="right" className="lg:col-span-6 flex justify-center relative">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              <div className="relative z-10">
                <KtMinisScreen />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2. METRICS BAR */}
      <section className="border-b border-line bg-surface py-10">
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

      {/* 3. INTERACTIVE FEATURES TABS */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('Explore Everything Minis Offers')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('From full-screen vertical clips to instant chat sharing, discover how Minis enhances your messaging experience.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {minisTabs.map((tab, idx) => {
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
                {t('Minis Feature Breakdown')}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {minisTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {minisTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {minisTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">{t('Built inside KT Messenger')}</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                {t('Explore App')} <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. COMPARISON MATRIX */}
      <section className="bg-surface py-16 lg:py-24 border-y border-line">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('Why Choose KT Minis?')}
            </h2>
            <p className="mt-4 text-lg text-body">
              {t('See how KT Minis compares with standalone video feeds and public social media platforms.')}
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">{t('Feature')}</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT Minis</th>
                  <th className="p-4 font-bold text-body">{t('Social Video Feeds')}</th>
                  <th className="p-4 font-bold text-body">{t('Standard Video Apps')}</th>
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

      {/* 5. FAQ ACCORDION */}
      <Section className="bg-cream">
        <Container className="max-w-4xl">
          <Reveal from="up" className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
              <FiHelpCircle /> {t('Minis FAQs')}
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

      {/* 6. CTA BANNER */}
      <section className="bg-gradient-to-r from-brand-strong to-brand-ink py-16 text-white lg:py-20">
        <Container className="text-center">
          <Reveal from="up">
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white">
              {t('Experience KT Minis Today')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              {t('Download KT Messenger now to watch, share, and enjoy full-screen short videos directly inside your chat app.')}
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

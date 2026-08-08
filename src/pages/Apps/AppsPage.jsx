import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiSend, FiCheck } from 'react-icons/fi'
import { FaApple, FaWindows, FaGooglePlay } from 'react-icons/fa'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { DesktopAppMockup } from '../../components/mockups/DesktopAppMockup'
import securityImg from '../../assets/images/security.jpg'
import privateImg from '../../assets/images/private.jpg'
import groupImg from '../../assets/images/group.jpg'
import businessImg from '../../assets/images/business.jpg'

const appStore = { icon: <FaApple />, top: 'Download on the', bottom: 'App Store' }

const platforms = [
  {
    type: 'Tablet',
    name: 'iPadOS',
    desc: 'All the features you love — chats, calls, status, and screen sharing — on a bigger screen with the KT Messengers iPad app.',
    req: 'Minimum: iPadOS 15.1 or newer',
    badge: appStore,
    isNew: true,
  },
  {
    type: 'Mobile / Tablet',
    name: 'iOS',
    desc: 'Chat, call, and share on the go with the KT Messengers app for iPhone.',
    req: 'Minimum: iOS 12.0 or newer',
    badge: appStore,
  },
  {
    type: 'Mobile / Tablet',
    name: 'Android',
    desc: 'Fast, reliable messaging and calling for every Android phone and tablet.',
    req: 'Minimum: Android 5.0 or newer',
    badge: { icon: <FaGooglePlay />, top: 'Get it on', bottom: 'Google Play' },
  },
  {
    type: 'Desktop',
    name: 'Mac',
    desc: 'A native Mac app with calling, screen sharing, and a faster, smoother experience.',
    req: 'Minimum: macOS 11 or newer',
    badge: { icon: <FaApple />, top: 'Download on the', bottom: 'Mac App Store' },
  },
]

const features = [
  {
    title: 'Messaging',
    desc: 'Express yourself with instant voice notes, HD photos, 4K videos, and custom sticker packs.',
    image: privateImg,
    to: '/messaging'
  },
  {
    title: 'Voice & Video Calling',
    desc: 'Crystal-clear encrypted 1-on-1 and group voice/video calls with low latency screen sharing.',
    image: privateImg,
    to: '/calling'
  },
  {
    title: 'Group Communities',
    desc: 'Organize communities up to 1024 members with admin controls, polls, and event reminders.',
    image: groupImg,
    to: '/groups'
  },
  {
    title: 'Channels & Broadcasts',
    desc: 'Follow official channels, creators, and brands for one-way updates and announcements.',
    image: businessImg,
    to: '/channels'
  },
  {
    title: 'KT AI Assistant',
    desc: 'Generate images, translate 50+ languages, and answer questions inside your chats.',
    image: securityImg,
    to: '/ai'
  },
  {
    title: 'Status Stories',
    desc: 'Share text, photo, video, and 30-second voice updates that disappear in 24 hours.',
    image: privateImg,
    to: '/status'
  },
  {
    title: 'Signal Encryption',
    desc: 'End-to-end Signal Protocol encryption keeps your personal messages confidential.',
    image: securityImg,
    to: '/security'
  },
  {
    title: 'KT Plus Customization',
    desc: 'Unlock ultra themes, custom fonts, auto-reply, and ghost mode privacy controls.',
    image: groupImg,
    to: '/plus'
  },
  {
    title: 'KT Business Suite',
    desc: 'Reach 2.5B+ customers with product catalogs, AI sales bots, and cloud API integrations.',
    image: businessImg,
    to: '/business'
  }
]

function StoreBadge({ icon, top, bottom }) {
  return (
    <a
      href="#apps-hero"
      className="inline-flex w-fit items-center gap-2.5 rounded-xl bg-[#111827] px-4 py-2.5 text-white transition-transform hover:-translate-y-0.5"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] opacity-90">{top}</span>
        <span className="block text-[15px] font-semibold">{bottom}</span>
      </span>
    </a>
  )
}

function Arrows({ onPrev, onNext }) {
  return (
    <div className="mt-8 flex gap-3">
      <button
        onClick={onPrev}
        aria-label="Previous"
        className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:bg-surface-2"
      >
        <FiChevronLeft className="text-xl" />
      </button>
      <button
        onClick={onNext}
        aria-label="Next"
        className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:bg-surface-2"
      >
        <FiChevronRight className="text-xl" />
      </button>
    </div>
  )
}

const railClass =
  'flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth'

export function AppsPage() {
  const navigate = useNavigate()
  const optionsRail = useRef(null)
  const featuresRail = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollRail = (ref, dir) => {
    if (!ref.current) return
    const currentScroll = ref.current.scrollLeft
    const maxScroll = ref.current.scrollWidth - ref.current.clientWidth

    if (dir > 0 && currentScroll >= maxScroll - 10) {
      ref.current.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (dir < 0 && currentScroll <= 10) {
      ref.current.scrollTo({ left: maxScroll, behavior: 'smooth' })
    } else {
      ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
    }
  }

  const goTo = (target) => {
    if (target.startsWith('/')) {
      navigate(target)
      window.scrollTo(0, 0)
      return
    }
    navigate('/')
    window.setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  return (
    <MainLayout>
      {/* hero */}
      <section id="apps-hero" className="bg-[#eaf2ff] dark:bg-cream-2">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Reveal from="up">
              <h1 className="text-[3rem] font-bold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Download
                <br />
                KT Messengers
              </h1>
            </Reveal>
            <Reveal from="up" delay={0.06}>
              <p className="mt-6 max-w-md text-lg leading-8 text-body">
                Start chatting and calling privately with KT Messengers across all your devices.
              </p>
            </Reveal>
            <Reveal from="up" delay={0.1}>
              <p className="mt-4 text-sm text-muted">
                By installing KT Messengers, you agree to our{' '}
                <button className="underline transition-colors hover:text-brand-ink" onClick={() => navigate('/privacy')}>
                  Terms
                </button>{' '}
                &amp;{' '}
                <button className="underline transition-colors hover:text-brand-ink" onClick={() => navigate('/privacy')}>
                  Privacy Policy
                </button>
                .
              </p>
            </Reveal>

            <Reveal from="up" delay={0.16}>
              <div className="mt-8 max-w-md rounded-[28px] border border-line bg-surface p-7 shadow-card">
                <p className="text-sm text-muted">Desktop</p>
                <h3 className="mt-1 text-2xl font-bold text-ink">Windows</h3>
                <p className="mt-3 text-[15px] leading-7 text-body">
                  Get calling, screen sharing, and a faster experience with the Windows app. Requires Windows 10 or newer.
                </p>
                <div className="mt-5">
                  <StoreBadge icon={<FaWindows />} top="Get it from" bottom="Microsoft Store" />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal from="scale" delay={0.1} className="relative">
            <DesktopAppMockup />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-3 -top-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-brand"
            >
              <FiSend />
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-3 -left-3 flex items-center rounded-full bg-surface px-3 py-2 text-brand-ink shadow-card"
            >
              <FiCheck className="-mr-1.5" />
              <FiCheck />
            </motion.div>
          </Reveal>
        </Container>
      </section>

      {/* other download options */}
      <Section className="bg-surface-2">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <div>
            <h2 className="text-[2.4rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Other download options
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-8 text-body">
              Stay connected with friends and family across all your devices.
            </p>
            <Arrows onPrev={() => scrollRail(optionsRail, -1)} onNext={() => scrollRail(optionsRail, 1)} />
          </div>

          <div ref={optionsRail} className={railClass}>
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex w-[290px] shrink-0 flex-col rounded-[28px] border border-line bg-surface p-7 shadow-soft"
              >
                {platform.isNew ? (
                  <span className="mb-3 w-fit rounded-md bg-brand-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-ink">
                    New
                  </span>
                ) : null}
                <p className="text-sm text-muted">{platform.type}</p>
                <h3 className="mt-1 text-2xl font-bold text-ink">{platform.name}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-7 text-body">{platform.desc}</p>
                <p className="mt-4 text-xs text-muted">{platform.req}</p>
                <div className="mt-4">
                  <StoreBadge {...platform.badge} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* already downloaded */}
      <Section className="bg-surface">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <div>
            <h2 className="text-[2.4rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Already downloaded?
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-8 text-body">
              Learn more about everything you can do on KT Messengers.
            </p>
            <Arrows onPrev={() => scrollRail(featuresRail, -1)} onNext={() => scrollRail(featuresRail, 1)} />
          </div>

          <div ref={featuresRail} className={railClass}>
            {features.map((feature) => (
              <div key={feature.title} className="w-[300px] shrink-0 flex flex-col justify-between rounded-[28px] border border-line bg-cream p-5 shadow-card dark:bg-surface">
                <div>
                  <div className="overflow-hidden rounded-[20px]">
                    <img src={feature.image} alt={feature.title} loading="lazy" className="h-52 w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-xs text-body leading-relaxed">{feature.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-line">
                  <button
                    onClick={() => goTo(feature.to)}
                    className="group inline-flex items-center gap-2 text-sm font-bold text-brand-ink transition-colors hover:text-brand-strong"
                  >
                    <span>Learn more</span>
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </MainLayout>
  )
}

import { img, imgAlt } from '../../utils/imageOverrides'
import { useEffect, useMemo, useRef } from 'react'
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
import privateImg from '../../assets/images/messaging-app-private-chat.jpg'
import groupImg from '../../assets/images/group-chat-app-community.jpg'
import businessImg from '../../assets/images/online-marketplace-app-business.jpg'
import { useLanguage } from '../../context/LanguageContext'
import { useModal } from '../../context/ModalContext'
import { trackDownload } from '../../services/analytics'
import { urlFor, useDownloads } from '../../services/downloads'
import { detectPlatform, isIPad } from '../../utils/openAppOrDownload'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useSeo } from '../../hooks/useSeo'
import { useFeatureNavHref } from '../../hooks/useFeatureNavHref'

const appStore = { icon: <FaApple />, top: 'Download on the', bottom: 'App Store' }

/**
 * Every platform the app ships on, in one list. The hero shows whichever one
 * the visitor is on and the rail below shows the rest, so a card is described
 * once and cannot drift between the two places.
 */
const platforms = [
  {
    type: 'Desktop',
    name: 'Windows',
    desc: 'Get calling, screen sharing, and a faster experience with the Windows app. Requires Windows 10 or newer.',
    badge: { icon: <FaWindows />, top: 'Get it from', bottom: 'Microsoft Store' },
  },
  {
    type: 'Tablet',
    name: 'iPadOS',
    desc: 'All the features you love chats, calls, status, and screen sharing on a bigger screen with the KT Messenger iPad app.',
    req: 'Minimum: iPadOS 15.1 or newer',
    badge: appStore,
    isNew: true,
  },
  {
    type: 'Mobile / Tablet',
    name: 'iOS',
    desc: 'Chat, call, and share on the go with the KT Messenger app for iPhone.',
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
    desc: 'Crystal clear encrypted 1-on-1 and group voice/video calls with low latency screen sharing.',
    image: privateImg,
    to: '/video-calling-app'
  },
  {
    title: 'Group Communities',
    desc: 'Organize communities up to 1024 members with admin controls, polls, and event reminders.',
    image: groupImg,
    to: '/group-chat-app'
  },
  {
    title: 'Channels & Broadcasts',
    desc: 'Follow official channels, creators, and brands for one way updates and announcements.',
    image: businessImg,
    to: '/social-media-platform'
  },
  {
    title: 'KT AI Assistant',
    desc: 'Generate images, translate 50+ languages, and answer questions inside your chats.',
    image: securityImg,
    to: '/ai-assistant-app'
  },
  {
    title: 'Status Stories',
    desc: 'Share text, photo, video, and 30-second voice updates that disappear in 24 hours.',
    image: privateImg,
    to: '/social-feed-app'
  },
  {
    title: 'KT Encryption',
    desc: 'End to end KT Encryption Protocol keeps your personal messages confidential.',
    image: securityImg,
    to: '/secure-messaging-app'
  },
  {
    title: 'KT Plus Customization',
    desc: 'Unlock ultra themes, custom fonts, auto reply, and ghost mode privacy controls.',
    image: groupImg,
    to: '/premium-messaging-app'
  },
  {
    title: 'KT Business Suite',
    desc: 'Reach customers globally with product catalogs, AI sales bots, and cloud API integrations.',
    image: businessImg,
    to: '/business-messaging-app'
  }
]

/**
 * The card for the device this visitor is on, and the rest for the rail.
 *
 * Windows is the fallback when the platform cannot be read — Linux, a
 * crawler, a browser that hides everything — because it is what the page
 * showed before and it is the largest desktop audience. The hero is only a
 * shortcut: every platform still has a card under "Other download options",
 * so a wrong guess costs a scroll, not the download.
 */
function splitByDevice(all, detected) {
  const wanted =
    detected === 'ANDROID' ? 'Android'
    : detected === 'IOS' ? (isIPad() ? 'iPadOS' : 'iOS')
    : detected === 'MAC' ? 'Mac'
    : 'Windows'
  const hero = all.find((p) => p.name === wanted) || all[0]
  return { hero, others: all.filter((p) => p !== hero) }
}

// Which analytics bucket a store badge belongs to. Desktop covers both the
// Mac and Windows stores.
const STORE_PLATFORM = {
  'Google Play': 'android',
  'App Store': 'ios',
  'Mac App Store': 'desktop',
  'Microsoft Store': 'desktop',
}

// The badge names the store it belongs to, which is also the platform whose
// download it should fetch. Without this a badge would fall through to the
// generic Download behaviour and hand a Windows visitor the Windows file
// even when they clicked "Google Play".
const BADGE_PLATFORM = {
  'Google Play': 'ANDROID',
  'App Store': 'IOS',
  'Mac App Store': 'MAC',
  'Microsoft Store': 'WINDOWS',
}

function StoreBadge({ icon, top, bottom, onClick, href }) {
  const { t } = useLanguage()
  const { showDownloadOptions } = useModal()
  const downloads = useDownloads()
  const target = href || urlFor(downloads, BADGE_PLATFORM[bottom])

  const handleClick = (e) => {
    // The hero badge sits inside a card that is itself a download button;
    // without this the one click fires both.
    e.stopPropagation()
    trackDownload(STORE_PLATFORM[bottom] || 'desktop', bottom)
    if (onClick) {
      e.preventDefault()
      onClick(e)
      return
    }
    // This platform has no published link yet. Show the list rather than
    // following an empty href — and rather than the local download, which
    // is not what a visitor clicking another platform's badge asked for.
    if (!target) {
      e.preventDefault()
      showDownloadOptions()
    }
  }

  return (
    <a
      href={target || '#'}
      target={target ? '_blank' : undefined}
      rel={target ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className="inline-flex w-fit items-center gap-2.5 rounded-xl bg-[#111827] px-4 py-2.5 text-white transition-transform hover:-translate-y-0.5 cursor-pointer"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] opacity-90">{t(top)}</span>
        <span className="block text-[15px] font-semibold">{bottom}</span>
      </span>
    </a>
  )
}

function Arrows({ onPrev, onNext }) {
  const { t } = useLanguage()
  return (
    <div className="mt-8 flex gap-3">
      <button
        onClick={onPrev}
        aria-label={t('Previous')}
        className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:bg-surface-2"
      >
        <FiChevronLeft className="text-xl" />
      </button>
      <button
        onClick={onNext}
        aria-label={t('Next')}
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
  // Per-page SEO from admin (Website Content -> seo.apps).
  // No block configured = unchanged behaviour.
  // Canonical for this page (follows the URL it is opened at).
  useSeo({
    title: 'Download KT Messenger App for Android, iOS, Mac & PC.',
    description: 'Get KT Messenger on every device — Android, iOS, Mac, Windows and the web. Free, fast and secure messaging and calling.',
    path: '/messaging-app-download',
  })
  useAdminSeo('apps', '/messaging-app-download')

  const navigate = useNavigate()
  const { t } = useLanguage()

  // Resolved once: the device cannot change while the tab is open. The
  // prerendered HTML carries the Windows card, which is also the fallback,
  // so the page is complete before this runs and only the hero swaps.
  const { hero, others } = useMemo(() => splitByDevice(platforms, detectPlatform()), [])
  const { downloadLink } = useModal()
  const optionsRail = useRef(null)
  const featuresRail = useRef(null)
  const featureNavHref = useFeatureNavHref()

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
        <Container className="grid items-start gap-8 pb-16 pt-6 lg:grid-cols-2 lg:gap-12 lg:pb-24 lg:pt-10">
          <div>
            <Reveal from="up">
              <h1 className="text-[3rem] font-bold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {t('Download')}
                <br />
                KT Messenger
              </h1>
            </Reveal>
            <Reveal from="up" delay={0.06}>
              <p className="mt-6 max-w-md text-lg leading-8 text-body">
                {t('Start chatting and calling privately with KT Messenger across all your devices.')}
              </p>
            </Reveal>
            <Reveal from="up" delay={0.1}>
              <p className="mt-4 text-sm text-muted">
                {t('By installing KT Messenger, you agree to our')}{' '}
                <button className="underline transition-colors hover:text-brand-ink" onClick={() => navigate('/private-messaging-app')}>
                  {t('Terms')}
                </button>{' '}
                &amp;{' '}
                <button className="underline transition-colors hover:text-brand-ink" onClick={() => navigate('/private-messaging-app')}>
                  {t('Privacy Policy')}
                </button>
                .
              </p>
            </Reveal>

            <Reveal from="up" delay={0.16}>
              {/* The whole card is a tap target for the badge it contains.
                  Not on iOS: a <div> can only navigate by script, and that
                  is exactly what makes Safari stop and ask (see
                  downloadLink). The badge inside is already a real link, so
                  there the card is just the frame around it. */}
              <div
                onClick={downloadLink.href ? undefined : downloadLink.onClick}
                className={`mt-8 max-w-md rounded-[28px] border border-line bg-surface p-7 shadow-card transition-all hover:border-brand/40 hover:shadow-lg ${
                  downloadLink.href ? '' : 'cursor-pointer'
                }`}
              >
                <p className="text-sm text-muted">{t(hero.type)}</p>
                <h3 className="mt-1 text-2xl font-bold text-ink">{hero.name}</h3>
                <p className="mt-3 text-[15px] leading-7 text-body">{t(hero.desc)}</p>
                {hero.req ? <p className="mt-3 text-xs text-muted">{t(hero.req)}</p> : null}
                <div className="mt-5">
                  {/* No onClick: the badge already links at this platform's
                      own file, which is the same thing the card does. */}
                  <StoreBadge {...hero.badge} />
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
      <Section className="bg-surface-2 overflow-x-clip">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          {/* Opaque heading on top (z-20) so cards slide BEHIND it and are hidden
              by the heading (the outer element) as they exit left — they never
              dissolve into the background, and the arrows stay clickable. */}
          <div className="relative lg:z-20 lg:bg-surface-2">
            <h2 className="text-[2.4rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {t('Other download options')}
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-8 text-body">
              {t('Stay connected with friends and family across all your devices.')}
            </p>
            <Arrows onPrev={() => scrollRail(optionsRail, -1)} onNext={() => scrollRail(optionsRail, 1)} />
          </div>

          {/* Rail extends left under the heading so exiting cards slide behind it
              and disappear off the left; breaks out to the right screen edge. */}
          <div className="relative min-w-0">
            <div
              ref={optionsRail}
              className={`${railClass} lg:ml-[calc(var(--apps-occlusion)*-1)] lg:pl-[var(--apps-occlusion)] lg:pr-8 lg:mr-[min(-2rem,calc((1200px_-_100vw)_/_2_-_2rem))]`}
            >
              {others.map((platform) => (
                <div
                  key={platform.name}
                  className="flex w-[290px] shrink-0 flex-col rounded-[28px] border border-line bg-surface p-7"
                >
                  {platform.isNew ? (
                    <span className="mb-3 w-fit rounded-md bg-brand-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-ink">
                      {t('New')}
                    </span>
                  ) : null}
                  <p className="text-sm text-muted">{t(platform.type)}</p>
                  <h3 className="mt-1 text-2xl font-bold text-ink">{platform.name}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-7 text-body">{t(platform.desc)}</p>
                  <p className="mt-4 text-xs text-muted">{t(platform.req)}</p>
                  <div className="mt-4">
                    <StoreBadge {...platform.badge} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* already downloaded */}
      <Section className="bg-surface overflow-x-clip">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          {/* Opaque heading on top (z-20) so cards slide BEHIND it and are hidden
              by the heading as they exit left. */}
          <div className="relative lg:z-20 lg:bg-surface">
            <h2 className="text-[2.4rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {t('Already downloaded?')}
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-8 text-body">
              {t('Learn more about everything you can do on KT Messenger.')}
            </p>
            <Arrows onPrev={() => scrollRail(featuresRail, -1)} onNext={() => scrollRail(featuresRail, 1)} />
          </div>

          {/* Rail extends left under the heading so exiting cards slide behind it. */}
          <div className="relative min-w-0">
            <div
              ref={featuresRail}
              className={`${railClass} snap-x snap-proximity lg:ml-[calc(var(--apps-occlusion)*-1)] lg:pl-[var(--apps-occlusion)] lg:scroll-pl-[var(--apps-occlusion)] lg:pr-8 lg:mr-[min(-2rem,calc((1200px_-_100vw)_/_2_-_2rem))]`}
            >
              {/* No card panel: the image sits directly on the
                  section background with the title + Learn more below, so a card
                  sliding off the left is just an image dissolving into the page. */}
              {features.map((feature) => (
                <div key={feature.title} className="w-[300px] shrink-0 snap-start flex flex-col justify-between">
                  <div>
                    <div className="overflow-hidden rounded-[20px]">
                      <img src={img(feature.image)} alt={imgAlt(feature.image, t(feature.title))} loading="lazy" className="h-52 w-full object-cover transition-transform duration-300 hover:scale-105" />
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold text-ink">{t(feature.title)}</h3>
                    <p className="mt-2 text-sm text-body leading-relaxed">{t(feature.desc)}</p>
                  </div>
                  <button
                    onClick={() => goTo(featureNavHref(feature.to))}
                    className="group mt-4 inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-ink transition-colors hover:text-brand-strong"
                  >
                    <span>{t('Learn more')}</span>
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </MainLayout>
  )
}

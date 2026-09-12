import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiGlobe,
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiVideo,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { useModal } from '../../context/ModalContext'
import { useLanguage } from '../../context/LanguageContext'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useSeo } from '../../hooks/useSeo'
import { api } from '../../services/apiClient'
import { useRemoteContent } from '../../hooks/useRemoteContent'

const FALLBACK_ABOUT = {
  h1Title: 'About KT Messenger',
  h1Subheading: 'Stay Connected. Communicate Freely.',
  p1Text: 'Available in over 180 countries, KT Messenger provides users a combination of fast messaging, HD voice calls and video calls, instant message translation, and easy file and media sharing in one single application. KT Messenger allows its users to send instant messages, share photos, videos, send documents and contact files, share location, and send voice messages. Its in-app translation tools allow users to converse and transact with individuals of other languages making conversations more inclusive.',
  h2Title: 'One Messenger, Many Ways to Connect',
  p2Text: 'KT Messenger incorporates the most popular formats of personal and business communication. Whether for a private chat, phone/video conversation, file sharing or communicating translation services, KT Messenger provides users all of these tools to enhance global communication and reduce barriers.',
  h3Title: 'Connecting People Globally',
  p3Text: 'As an application that started with simple messaging, KT Messenger has grown to become a global communication platform. After displaying over 1 Million Google Play app downloads and after becoming available in over 180 countries and regions, KT Messenger has become a tool for people to communicate with each other.',
}

const RELATED = [
  { to: '/careers', label: 'Careers', desc: 'Open roles across engineering, design and policy.', icon: <FiUsers /> },
  { to: '/privacy', label: 'Privacy', desc: 'How encryption works and what we never collect.', icon: <FiLock /> },
  { to: '/blog', label: 'Blog', desc: 'Product updates and engineering write ups.', icon: <FiMessageSquare /> },
  { to: '/minis', label: 'KT Minis', desc: 'Watch, create and share short video clips.', icon: <FiVideo /> },
]

export function AboutPage() {
  useSeo({
    title: 'About KT Messenger | Connecting People Worldwide.',
    description: 'Available in over 180 countries, KT Messenger provides users a combination of fast messaging, HD voice calls and video calls, instant message translation, and easy file and media sharing.',
    path: '/about',
  })

  useAdminSeo('about', '/about')

  const [aboutData] = useRemoteContent(
    () => api.getContentBlock('about.content'),
    FALLBACK_ABOUT
  )

  const content = { ...FALLBACK_ABOUT, ...aboutData }

  const { openDownloadModal } = useModal()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <MainLayout>
      {/* HERO SECTION WITH H1 */}
      <section className="relative overflow-hidden bg-cream dark:bg-surface border-b border-line py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-brand-strong/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        <Container className="relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal from="up">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-strong/20 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
                <FiGlobe className="text-brand-strong" /> {t('Global Communication Platform')}
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {t(content.h1Title)}
              </h1>
              <p className="mt-3 text-xl font-bold text-brand-ink sm:text-2xl">
                {t(content.h1Subheading)}
              </p>
            </Reveal>

            <Reveal from="up" delay={0.06}>
              <p className="mt-8 text-base sm:text-lg lg:text-xl leading-relaxed text-body max-w-4xl mx-auto text-center sm:leading-relaxed">
                {t(content.p1Text)}
              </p>
            </Reveal>

            <Reveal from="up" delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" onClick={openDownloadModal}>
                  {t('Get KT Messenger')}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/privacy')}>
                  {t('Privacy Charter')}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* SECTION WITH H2 */}
      <section className="py-14 sm:py-20 bg-surface border-b border-line">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Reveal from="up">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                {t('Features & Flexibility')}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                {t(content.h2Title)}
              </h2>
              <p className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-body sm:leading-relaxed">
                {t(content.p2Text)}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* SECTION WITH H3 */}
      <section className="py-14 sm:py-20 bg-cream dark:bg-surface border-b border-line">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Reveal from="up">
              <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
                {t('Global Impact')}
              </span>
              <h3 className="mt-4 text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                {t(content.h3Title)}
              </h3>
              <p className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-body sm:leading-relaxed">
                {t(content.p3Text)}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* MORE ABOUT KT MESSENGER (RELATED CARDS INCLUDING KT MINIS) */}
      <Section className="bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
            {t('Keep Exploring')}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">
            {t('More about KT Messenger')}
          </h2>
        </div>
        <RelatedPages className="mt-10" items={RELATED} />
      </Section>
    </MainLayout>
  )
}

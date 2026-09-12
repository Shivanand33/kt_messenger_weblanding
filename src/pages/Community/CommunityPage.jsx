import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiCheckCircle,
  FiChevronRight,
  FiCompass,
  FiGlobe,
  FiMessageCircle,
  FiMessageSquare,
  FiSearch,
  FiUsers,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { SectionHead } from '../../components/feature/SectionHead'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { useLanguage } from '../../context/LanguageContext'
import { useSeo } from '../../hooks/useSeo'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useRemoteContent } from '../../hooks/useRemoteContent'
import { api } from '../../services/apiClient'

const RELATED = [
  { to: '/help', label: 'Help Center', desc: 'Official articles and troubleshooting guides.', icon: <FiSearch /> },
  { to: '/contact', label: 'Contact', desc: 'Reach a specific team directly.', icon: <FiMessageSquare /> },
  { to: '/about', label: 'About', desc: 'Our mission and privacy-first charter.', icon: <FiCompass /> },
  { to: '/careers', label: 'Careers', desc: 'We hire from the community regularly.', icon: <FiUsers /> },
]

export function CommunityPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  useSeo({
    title: 'KT Messenger | Social Networking & Messaging App.',
    description: 'Connect, chat and grow with KT Messenger, a secure social networking and instant messaging platform for private chats, communities and business networking.',
    path: '/community',
  })

  useAdminSeo('community', '/community')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const localFaqs = [
    {
      q: t('What is KT Messenger?'),
      a: t('KT Messenger is a social networking and instant messaging platform that enables users to communicate, create connections, participate in communities, and interact online.')
    },
    {
      q: t('Is KT Messenger a social networking platform?'),
      a: t('Yes. KT Messenger combines social networking and messaging features, allowing users to connect with people and participate in online communities.')
    },
    {
      q: t('Can KT Messenger be used for private chats?'),
      a: t('KT Messenger provides private messaging functionality for users who want to communicate directly with other people.')
    }
  ]

  const [remoteFaqs] = useRemoteContent(
    () => api.listFaqs('community'),
    null,
    (rows) => Array.isArray(rows) && rows.length > 0,
  )
  const faqs = remoteFaqs ? remoteFaqs.map((r) => ({ q: r.question, a: r.answer })) : localFaqs

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="up">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-strong/30 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
                <FiUsers className="text-brand-strong" /> {t('Social & Messaging Ecosystem')}
              </div>
              <h1 className="mt-4 text-2xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                {t('KT Messenger – Social Networking and Instant Messaging Platform')}
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                {t('KT Messenger is a modern, secure social and messaging platform for real-time communication, private chats, and professional networking.')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  {t('Join KT Community')} <FiChevronRight className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/messaging')}>
                  {t('Explore Features')}
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('Social Networking')}
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('Instant Messaging')}
                </span>
              </div>
            </Reveal>

            {/* HERO ASIDE GRAPHIC */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="w-full max-w-[440px] rounded-[32px] border border-line bg-surface p-6 shadow-float sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                  <FiGlobe /> {t('Global Ecosystem')}
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">{t('Build Connections & Communities')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body">
                  {t('Join millions of users worldwide connecting through secure private chats, interactive groups, and vibrant digital spaces.')}
                </p>
                <ul className="mt-5 space-y-3">
                  <li className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-3.5 dark:bg-cream-2">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-strong text-white">
                      <FiMessageCircle className="text-lg" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-ink">{t('Real-Time Communication')}</span>
                      <span className="block text-[11px] font-medium text-muted">{t('Fast, end-to-end encrypted messaging')}</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-3.5 dark:bg-cream-2">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-strong text-white">
                      <FiUsers className="text-lg" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-ink">{t('Interactive Communities')}</span>
                      <span className="block text-[11px] font-medium text-muted">{t('Channels, groups, and live updates')}</span>
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2. SECTION H2: CONNECT AND COMMUNICATE */}
      <Section className="bg-surface border-y border-line">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1 text-xs font-bold text-brand-ink mb-4 border border-brand-strong/20">
              <FiMessageCircle className="text-brand-strong" /> {t('Seamless Connections')}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('Connect and Communicate with KT Messenger')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-body">
              {t('KT Messenger offers file sharing, live streams, interactive groups, private chats, and end-to-end messaging all within a platform that prioritizes speed.')}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* 3. SECTION H2: A SOCIAL NETWORKING PLATFORM FOR EVERYONE */}
      <Section className="bg-cream dark:bg-cream-2">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('A Social Networking Platform for Everyone')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-body">
              {t('KT Messenger consolidates social networking and messaging. KT messenger has all the tools for its users to socialize and share, as well as create meaningful relationships and communities online.')}
            </p>
          </Reveal>

          {/* H3 SUBSECTIONS GRID */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Reveal from="left" delay={0.1}>
              <div className="h-full rounded-3xl border border-line bg-surface p-8 shadow-card flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-strong mb-5">
                    <FiUsers />
                  </div>
                  <h3 className="text-2xl font-bold text-ink">
                    {t('Connect with Customers and Communities')}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-body">
                    {t('Social networking and real-time communication helps you make meaningful connections with customers, followers, professionals, and community members.')}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-line">
                  <Button variant="secondary" size="sm" onClick={() => navigate('/business')}>
                    {t('Explore Business Connections')} <FiChevronRight />
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" delay={0.15}>
              <div className="h-full rounded-3xl border border-line bg-surface p-8 shadow-card flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-strong mb-5">
                    <FiMessageSquare />
                  </div>
                  <h3 className="text-2xl font-bold text-ink">
                    {t('Messaging for Friends, Professionals, and Communities')}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-body">
                    {t('Whether you want to communicate privately, meet new people, participate in communities, or build professional connections, KT Messenger offers multiple ways to interact and stay connected.')}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-line">
                  <Button variant="secondary" size="sm" onClick={() => navigate('/messaging')}>
                    {t('Learn About Private Messaging')} <FiChevronRight />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* FAQ SECTION */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface py-16 lg:py-24">
        <Container maxW="max-w-3xl">
          <SectionHead
            eyebrow={t('FAQ')}
            title={t('Frequently Asked Questions About KT Messenger')}
          />
          <div className="mt-12">
            <FaqAccordion items={faqs} placeholder={t('Search the FAQ…')} />
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={t('Join in')}
        title={t('Connect, Chat and Grow with KT Messenger')}
        description={t('Get started with KT Messenger today to connect with friends, family, and online communities worldwide.')}
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => navigate('/apps')}>
              {t('Download App')}
            </Button>
            <Button size="lg" variant="onDark" onClick={() => { navigate('/contact'); window.scrollTo(0, 0) }}>
              {t('Contact the team')}
            </Button>
          </>
        }
        points={[t('Secure messaging'), t('Global communities'), t('Fast & reliable')]}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow={t('Keep exploring')} title={t('More about KT Messenger')} />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>
    </MainLayout>
  )
}

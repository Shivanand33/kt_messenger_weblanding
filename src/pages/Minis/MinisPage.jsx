import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiPlay,
  FiShare2,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiVideo,
  FiCheck,
  FiTrendingUp,
  FiBriefcase,
  FiUsers,
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
import { useSeo } from '../../hooks/useSeo'

export function MinisPage() {
  useSeo({
    title: 'KT Messenger Minis | Watch, Create & Share Short Videos',
    description: 'Watch, create, and share short videos with KT Messenger Minis. Discover trending content and connect with your community.',
    path: '/minis',
  })

  useAdminSeo('minis', '/minis')

  const navigate = useNavigate()
  const { t } = useLanguage()
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const localFaqs = [
    {
      q: t('What are KT Messenger Minis?'),
      a: t('KT Messenger Minis are short videos that you can watch, create, and share with your online community.')
    },
    {
      q: t('Can I create and share Minis?'),
      a: t('Yes, you can create short videos and share them with your friends, followers, and network.')
    },
    {
      q: t('Can I like and comment on Minis?'),
      a: t('Yes, Minis allow users to interact with short-form content through likes, comments, and shares.')
    },
    {
      q: t('Can businesses use Minis?'),
      a: t('Yes, businesses can use short videos to promote products, connect with audiences, and increase engagement.')
    },
    {
      q: t('Are Minis a social media feature?'),
      a: t('Yes, Minis are a short-form video feature that helps users discover content and connect with others.')
    }
  ]

  const [remoteFaqs] = useRemoteContent(
    () => api.listFaqs('minis'),
    null,
    (rows) => Array.isArray(rows) && rows.length > 0,
  )
  const faqs = remoteFaqs ? remoteFaqs.map((r) => ({ q: t(r.question), a: t(r.answer) })) : localFaqs

  return (
    <MainLayout>
      {/* 1. HERO SECTION (H1) */}
      <section className="relative overflow-hidden bg-cream py-14 lg:py-20 border-b border-line dark:bg-surface">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column */}
            <Reveal from="left" className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-strong/30 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
                <FiPlay className="text-brand-strong" /> {t('Short-Form Video Feed')}
              </div>

              <h1 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                {t('KT Messenger Minis')}
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-body max-w-xl">
                {t('Watch, create, and share short videos with KT Messenger Minis. Discover trending content and connect with your community.')}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface p-2 px-3 text-xs font-bold text-ink border border-line shadow-soft">
                  <FiCheck className="text-brand-strong text-sm" />
                  <span>{t('Watch & Discover')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface p-2 px-3 text-xs font-bold text-ink border border-line shadow-soft">
                  <FiCheck className="text-brand-strong text-sm" />
                  <span>{t('Create & Share')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface p-2 px-3 text-xs font-bold text-ink border border-line shadow-soft">
                  <FiCheck className="text-brand-strong text-sm" />
                  <span>{t('Connect with Community')}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  <span>{t('Explore Minis')}</span>
                  <FiChevronRight />
                </Button>
                <span className="text-xs font-bold text-brand-ink bg-brand-soft px-3 py-2 rounded-full border border-brand-strong/30">
                  {t('Short Video • In-App Feed')}
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

      {/* 2. SECTION: EXPLORE MINIS (H2) & CREATE & SHARE (H2) */}
      <Section className="bg-surface border-b border-line">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal from="left" delay={0.1}>
              <div className="h-full rounded-3xl border border-line bg-cream p-8 shadow-card flex flex-col justify-between dark:bg-cream-2">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-strong mb-5">
                    <FiVideo />
                  </div>
                  <h3 className="text-2xl font-bold text-ink sm:text-3xl">
                    {t('Explore Minis')}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-body">
                    {t('Discover short, engaging videos from people and communities on KT Messenger.')}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-line">
                  <Button variant="secondary" size="sm" onClick={() => navigate('/apps')}>
                    {t('Start Watching')} <FiChevronRight />
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" delay={0.15}>
              <div className="h-full rounded-3xl border border-line bg-cream p-8 shadow-card flex flex-col justify-between dark:bg-cream-2">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-strong mb-5">
                    <FiShare2 />
                  </div>
                  <h3 className="text-2xl font-bold text-ink sm:text-3xl">
                    {t('Create & Share')}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-body">
                    {t('Create your own short videos and share them with friends, followers, and your network.')}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-line">
                  <Button variant="secondary" size="sm" onClick={() => navigate('/apps')}>
                    {t('Create Minis')} <FiChevronRight />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 3. SUBSECTIONS: H3, H4, H5 */}
      <Section className="bg-cream dark:bg-cream-2 border-b border-line">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {/* H3: Trending Videos */}
            <Reveal from="up" delay={0.1}>
              <div className="h-full rounded-3xl border border-line bg-surface p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-xl text-brand-strong mb-4">
                    <FiTrendingUp />
                  </div>
                  <h3 className="text-xl font-bold text-ink">
                    {t('Trending Videos')}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">
                    {t('Find popular and engaging videos, discover new creators, and enjoy fresh content every day.')}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* H4: Connect & Engage */}
            <Reveal from="up" delay={0.15}>
              <div className="h-full rounded-3xl border border-line bg-surface p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-xl text-brand-strong mb-4">
                    <FiUsers />
                  </div>
                  <h3 className="text-xl font-bold text-ink">
                    {t('Connect & Engage')}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">
                    {t('Like, comment, share, and connect with others through short-form social content.')}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* H5: Minis for Business */}
            <Reveal from="up" delay={0.2}>
              <div className="h-full rounded-3xl border border-line bg-surface p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-xl text-brand-strong mb-4">
                    <FiBriefcase />
                  </div>
                  <h3 className="text-xl font-bold text-ink">
                    {t('Minis for Business')}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">
                    {t('Promote your brand, products, and services through engaging short videos and reach new audiences.')}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 4. FAQ ACCORDION */}
      <Section className="bg-surface">
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
                <div key={faq.q} className="overflow-hidden rounded-2xl border border-line bg-cream dark:bg-cream-2 transition-all shadow-soft">
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

      {/* 5. CTA BANNER (H2: Join KT Minis Now) */}
      <section className="bg-gradient-to-r from-brand-strong to-brand-ink py-16 text-white lg:py-20">
        <Container className="text-center">
          <Reveal from="up">
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white">
              {t('Join KT Minis Now')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              {t('Watch, create, share, and connect with KT Messenger Minis.')}
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

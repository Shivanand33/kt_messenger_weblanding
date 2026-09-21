import { api } from '../../services/apiClient'
import { useRemoteContent } from '../../hooks/useRemoteContent'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useSeo } from '../../hooks/useSeo'
import { useEffect } from 'react'
import {
  FiEdit3,
  FiLock,
  FiMic,
  FiPlus,
  FiShield,
  FiWifiOff,
  FiZap,
  FiCheckCircle,
  FiMessageSquare,
  FiBriefcase,
  FiGlobe,
  FiList,
  FiUser,
  FiHelpCircle,
  FiCompass,
  FiUsers,
  FiVideo
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { SectionHead } from '../../components/feature/SectionHead'
import { PageHero } from '../../components/feature/PageHero'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Button } from '../../components/common/Button/Button'
import { KtNotesScreen } from '../../components/common/AppScreens/KtNotesScreen'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { useModal } from '../../context/ModalContext'
import { useLanguage } from '../../context/LanguageContext'
import { notesFaqs as FALLBACK_NOTESFAQS } from './notesData'

const RELATED = [
  { to: '/about', label: 'About', desc: 'Our mission, story and privacy charter.', icon: <FiCompass /> },
  { to: '/contact', label: 'Contact', desc: 'Reach out to our support or hiring team.', icon: <FiMessageSquare /> },
  { to: '/community', label: 'Community', desc: 'Join our user forums and discussion spaces.', icon: <FiUsers /> },
  { to: '/minis', label: 'KT Minis', desc: 'Watch, create and share short video clips.', icon: <FiVideo /> },
]

export function NotesPage() {
  useSeo({
    title: 'KT Messenger Notes | Secure Messaging & Social Platform.',
    description: 'Explore KT Messenger Notes for secure messaging, social networking, and business communication, helping users and brands connect more easily.',
    path: '/notes',
  })

  useAdminSeo('notes', '/notes')

  // Admin-managed FAQs for this page (Admin -> FAQs, page='notes').
  const [notesFaqs] = useRemoteContent(
    () => api.listFaqs('notes').then((rows) => rows.map((r) => ({ q: r.question, a: r.answer }))),
    FALLBACK_NOTESFAQS,
  )
  const { openDownloadModal } = useModal()
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <PageHero
        titleTag="h2"
        badge={
          <>
            <FiLock /> {t('Encrypted vault · Notes & Self Chat')}
          </>
        }
        title={t('Welcome to')}
        highlight={t('KT Messenger Notes.')}
        description={t('KT Messenger Notes helps you save the things that matter to you. Whether it is an important message, business idea, meeting detail, reminder, personal thought, useful information, or something you do not want to forget, you can keep it organized in one place.')}
        actions={
          <>
            <Button size="lg" variant="white" onClick={openDownloadModal}>
              {t('Create a note')} <FiPlus />
            </Button>
            <Button size="lg" variant="primary" onClick={openDownloadModal}>
              {t('Get the app')} <FiZap />
            </Button>
          </>
        }
        chips={[
          { icon: <FiShield />, label: t('Sealed before sync') },
          { icon: <FiWifiOff />, label: t('Fully offline capable') },
          { icon: <FiMic />, label: t('On device transcription') },
        ]}
        aside={
          <div className="relative flex justify-center py-2">
            {/* Background Ambient Radial Glow */}
            <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />

            {/* Mobile Phone Mockup Screen */}
            <div className="relative z-10">
              <KtNotesScreen />
            </div>
          </div>
        }
      />

      {/* 2. CORE FEATURES & ORGANIZATIONAL CAPABILITIES */}
      <Section className="bg-cream">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
              <FiEdit3 className="text-brand-strong" /> {t('Organize Everything')}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('Social Media and Digital Communication')}
            </h1>
            <p className="mt-4 text-lg text-body">
              {t('From online communication to social media posts, people rely on digital platforms to store the most important information. KT Messenger Notes helps you do just that. Save helpful information from conversations instead of letting important notes slip your mind.')}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Reveal from="left">
              <div className="h-full rounded-3xl border border-line bg-surface p-8 shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong mb-4">
                    <FiBriefcase className="text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-ink">
                    {t('Business Social Media Platform to Organize Ideas')}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-body">
                    {t('With Kt Messenger, you can keep detailed notes on all aspects of your business and therefore keep everything organized and avoid forgetting anything important.')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line flex items-center gap-2 text-xs font-semibold text-brand-ink">
                  <FiCheckCircle className="text-brand-strong text-base" />
                  <span>{t('Business & Client Management')}</span>
                </div>
              </div>
            </Reveal>

            <Reveal from="right">
              <div className="h-full rounded-3xl border border-line bg-surface p-8 shadow-card flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong mb-4">
                    <FiGlobe className="text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-ink">
                    {t('Create Notes Anywhere, Anytime')}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-body">
                    {t('Have a thought, idea, or reminder while chatting, working, or generally using your phone? Room for notes is available to help capture thoughts, then store them in the cloud for easy recall later when you have time to look back.')}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line flex items-center gap-2 text-xs font-semibold text-brand-ink">
                  <FiCheckCircle className="text-brand-strong text-base" />
                  <span>{t('Cloud Sync & Offline Access')}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 3. TASKS, PERSONAL USE & CHAT REMINDERS */}
      <Section className="bg-surface border-y border-line">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <Reveal from="up" delay={0.05}>
              <div className="h-full rounded-3xl border border-line bg-cream p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-strong mb-4">
                    <FiList className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">
                    {t('Save Important Reminders and Tasks')}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">
                    {t('Use Notes to write down your to-do tasks and reminders. Whether they be appointments, plans, lists, or just something to buy at the store, writing things down is the best way to keep track and maintain order.')}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal from="up" delay={0.1}>
              <div className="h-full rounded-3xl border border-line bg-cream p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-strong mb-4">
                    <FiUser className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">
                    {t('Notes for Personal Use')}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">
                    {t('Got a lot going on? Then, store your thoughts, plans, lists, and reminders here. KT Messenger Notes provides a convenient space to help you keep track of items relevant to you.')}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal from="up" delay={0.15}>
              <div className="h-full rounded-3xl border border-line bg-cream p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-strong mb-4">
                    <FiMessageSquare className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">
                    {t('Save Important Chat Information')}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body">
                    {t('Important details, messages, and reminders may exist within a chat. Rather than navigating past screens to find information, copy and archive/save important messages in your Notes.')}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 4. NETWORKING & MESSAGING APPS HIGHLIGHTS */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Reveal from="left">
              <div className="rounded-3xl border border-line bg-brand-soft/50 p-8 shadow-card">
                <h3 className="text-2xl font-bold text-ink">
                  {t('Notes for Social Networking')}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-body">
                  {t('Social networking creates many conversations and ideas every day. Use Notes to save important information, contacts, plans, and thoughts you want to remember.')}
                </p>
              </div>
            </Reveal>

            <Reveal from="right">
              <div className="rounded-3xl border border-line bg-brand-soft/50 p-8 shadow-card">
                <h3 className="text-2xl font-bold text-ink">
                  {t('Notes While Using Messaging Apps')}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-body">
                  {t('Messaging apps are used for many conversations every day. KT Messenger Notes helps you save the information that matters instead of letting it get lost in your chats.')}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 5. FAQ SECTION */}
      <Section id="faq" container={false} className="scroll-mt-36 border-b border-line bg-cream dark:bg-cream-2">
        <Container maxW="max-w-3xl">
          <Reveal from="up" className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink mb-3">
              <FiHelpCircle /> {t('FAQ')}
            </div>
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl">
              {t('Why Use KT Messenger Notes?')}
            </h2>
            <p className="mt-3 text-base text-body max-w-xl mx-auto">
              {t('KT Messenger Notes gives you a simple way to capture information before you forget it. Save what matters, keep it organized, and access it whenever you need it.')}
            </p>
          </Reveal>
          <div className="mt-12">
            <FaqAccordion items={notesFaqs} placeholder={t('Search the FAQ…')} />
          </div>
        </Container>
      </Section>

      {/* 6. CTA BANNER */}
      <CtaBand
        eyebrow={t('Start writing')}
        title={t('A vault that only you can open')}
        description={t('Notes, checklists and voice memos sealed on your device, synced across everything you own, and readable with no signal at all.')}
        actions={
          <>
            <Button size="lg" variant="white" onClick={openDownloadModal}>
              {t('Download KT Messenger')}
            </Button>
            <Button size="lg" variant="onDark" onClick={openDownloadModal}>
              {t('Try the editor')}
            </Button>
          </>
        }
        points={[t('End to end encrypted'), t('Works fully offline'), t('On device transcription'), t('Export any time')]}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow={t('Keep exploring')} title={t('More about KT Messenger')} />
        <RelatedPages className="mt-10" items={RELATED} />
      </Section>
    </MainLayout>
  )
}

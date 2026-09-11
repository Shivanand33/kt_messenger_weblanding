import { motion } from 'framer-motion'
import { api } from '../../services/apiClient'
import { useRemoteContent } from '../../hooks/useRemoteContent'
import { useEffect } from 'react'
import {
  FiEdit3,
  FiLock,
  FiMic,
  FiPlus,
  FiShield,
  FiWifiOff,
  FiZap,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { SectionHead } from '../../components/feature/SectionHead'
import { PageHero } from '../../components/feature/PageHero'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { Button } from '../../components/common/Button/Button'
import { KtNotesScreen } from '../../components/common/AppScreens/KtNotesScreen'
import { useModal } from '../../context/ModalContext'
import { useLanguage } from '../../context/LanguageContext'
import { notesFaqs as FALLBACK_NOTESFAQS } from './notesData'

export function NotesPage() {
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
      {/* HERO */}
      <PageHero
        badge={
          <>
            <FiLock /> {t('Encrypted vault · Notes & Self Chat')}
          </>
        }
        title="KT"
        highlight={t('Notes & Self Chat')}
        description={t('Message yourself, pin what matters, record a thought while walking and keep every word sealed on your device before it ever syncs.')}
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

      {/* FAQ */}
      <Section id="faq" container={false} className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow={t('FAQ')} title={t('Encryption, sync and recovery')} />
          <div className="mt-12">
            <FaqAccordion items={notesFaqs} placeholder={t('Search the FAQ…')} />
          </div>
        </Container>
      </Section>

      {/* CTA */}
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
    </MainLayout>
  )
}

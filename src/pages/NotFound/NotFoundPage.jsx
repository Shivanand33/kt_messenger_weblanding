import { useNavigate } from 'react-router-dom'
import { FiHome, FiCompass } from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Button } from '../../components/common/Button/Button'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { useLanguage } from '../../context/LanguageContext'

// Custom 404 shown for any route that doesn't match. Wrapped in MainLayout so it
// keeps the KT Messenger nav, footer, theme toggle and brand tokens.
export function NotFoundPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <MainLayout>
      <section className="flex min-h-[70vh] items-center py-16 sm:py-24">
        <Container className="text-center">
          <Reveal from="up">
            <span
              aria-hidden
              className="block bg-gradient-to-b from-brand-strong to-brand bg-clip-text text-[5.5rem] font-extrabold leading-none tracking-tight text-transparent sm:text-[8rem] lg:text-[10rem]"
            >
              404
            </span>
          </Reveal>

          <Reveal from="up" delay={0.06}>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('404 – Page Not Found')}
            </h1>
          </Reveal>

          <Reveal from="up" delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
              {t("The page you’re looking for doesn’t exist, may have been moved, or the link is no longer available. Let’s get you back on track.")}
            </p>
          </Reveal>

          <Reveal from="up" delay={0.18}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate('/')}>
                <FiHome /> {t('Go to Home Page')}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/help')}>
                <FiCompass /> {t('Visit Help Center')}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  )
}

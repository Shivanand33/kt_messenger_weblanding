import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiCompass, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Button } from '../../components/common/Button/Button'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../services/apiClient'
import { getComponentByLabelOrHref } from '../../App'
import { img, imgAlt } from '../../utils/imageOverrides'
import securityImg from '../../assets/images/security.jpg'
import privateImg from '../../assets/images/messaging-app-private-chat.jpg'
import groupImg from '../../assets/images/group-chat-app-community.jpg'
import businessImg from '../../assets/images/online-marketplace-app-business.jpg'

// "Discover more features" carousel — the same cards, images and links as the
// one on the Privacy page, so a visitor who lands on a missing page can keep
// exploring.
const discoverMoreFeatures = [
  { title: 'Calling', image: privateImg, to: '/calling' },
  { title: 'Groups', image: groupImg, to: '/groups' },
  { title: 'KT AI', image: securityImg, to: '/ai' },
  { title: 'Channels', image: businessImg, to: '/channels' },
  { title: 'Status Stories', image: privateImg, to: '/status' },
  { title: 'KT Business', image: businessImg, to: '/business' },
  { title: 'KT Plus', image: groupImg, to: '/plus' },
]

// Custom 404 shown for any route that doesn't match. Wrapped in MainLayout so it
// keeps the KT Messenger nav, footer, theme toggle and brand tokens.
export function NotFoundPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  const [ResolvedComponent, setResolvedComponent] = useState(() => getComponentByLabelOrHref(location.pathname))
  const [checking, setChecking] = useState(() => !getComponentByLabelOrHref(location.pathname))
  const discoverRef = useRef(null)

  const scrollDiscover = (dir) => {
    if (!discoverRef.current) return
    discoverRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  useEffect(() => {
    const directComp = getComponentByLabelOrHref(location.pathname)
    if (directComp) {
      setResolvedComponent(() => directComp)
      setChecking(false)
      return
    }

    let isMounted = true
    Promise.all([
      api.getNavigation('features_menu').catch(() => []),
      api.getNavigation('header').catch(() => []),
      api.getNavigation('footer').catch(() => [])
    ]).then(([features, header, footer]) => {
      if (!isMounted) return
      const allItems = [...(features || []), ...(header || []), ...(footer || [])]
      const match = allItems.find(
        (item) => item.href === location.pathname || item.href === location.pathname.toLowerCase()
      )
      if (match) {
        const comp = getComponentByLabelOrHref(match)
        if (comp) {
          setResolvedComponent(() => comp)
        }
      }
      setChecking(false)
    }).catch(() => {
      if (isMounted) setChecking(false)
    })

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  if (ResolvedComponent) {
    return <ResolvedComponent />
  }

  if (checking) {
    return null
  }

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

      {/* DISCOVER MORE FEATURES CAROUSEL (same as the Privacy page) */}
      <section className="py-20 lg:py-28 bg-cream dark:bg-surface border-b border-line overflow-x-clip">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-12 items-center">
            {/* Opaque, full-height heading on top (z-20): cards slide behind it left. */}
            <div className="relative lg:z-20 lg:self-stretch lg:flex lg:items-center lg:bg-cream lg:dark:bg-surface lg:ml-[calc(var(--edge-gutter)*-1)] lg:pl-[var(--edge-gutter)]">
              <div className="w-full">
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {t('Discover')} <span className="text-brand-strong">{t('more features')}</span>
              </h2>
              <p className="mt-4 text-base text-body">
                {t('Learn more about what you can do on KT Messenger.')}
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => scrollDiscover(-1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={() => scrollDiscover(1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:bg-brand-soft"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
              </div>
            </div>

            <div ref={discoverRef} className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth min-w-0 lg:pl-[var(--privacy-occ-b)] lg:ml-[calc(var(--privacy-occ-b)*-1)] lg:pr-8 lg:mr-[min(-2rem,calc((1200px_-_100vw)_/_2_-_2rem))]">
              {discoverMoreFeatures.map((item, idx) => (
                <div key={idx} className="w-[280px] shrink-0">
                  <div className="overflow-hidden rounded-[20px]">
                    <img src={img(item.image)} alt={imgAlt(item.image, t(item.title))} className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-ink">{t(item.title)}</h3>
                  <button
                    onClick={() => navigate(item.to)}
                    className="group mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink hover:text-brand-strong transition-colors"
                  >
                    <span>{t('Learn more')}</span>
                    <FiChevronRight className="text-base transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  )
}

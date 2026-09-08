import { useEffect } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheck,
  FiSend,
  FiZap,
  FiUsers,
  FiBarChart2,
  FiShield,
  FiGlobe,
  FiTag,
  FiTrendingUp,
  FiLayers,
  FiCheckCircle,
  FiSmartphone,
  FiPlayCircle,
  FiLock,
  FiMessageSquare,
  FiClock,
  FiBell,
  FiShoppingBag,
  FiUserCheck,
  FiHelpCircle,
  FiTarget,
  FiImage,
  FiEye,
} from 'react-icons/fi'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Logo } from '../../components/common/Logo/Logo'
import { ThemeToggle } from '../../components/common/ThemeToggle/ThemeToggle'
import { Footer } from '../../components/layout/Footer/Footer'
import { useModal } from '../../context/ModalContext'
import { businessProducts } from './businessProducts'
import imgBusiness from '../../assets/images/business.jpg'
import imgGroup from '../../assets/images/group.jpg'
import imgPrivate from '../../assets/images/private.jpg'
import imgSecurity from '../../assets/images/security.jpg'
import imgMultidevice from '../../assets/images/multidevice.jpg'
import imgHero from '../../assets/images/hero.jpg'
import imgHeroPhoto from '../../assets/images/hero-photo.jpg'
import imgFooter from '../../assets/images/footer.jpg'
import imgCyberpunk from '../../assets/images/cyberpunk_neon_city.png'

const DARK = '#0b162c'

const ICONS = {
  FiSend, FiZap, FiUsers, FiBarChart2, FiShield, FiGlobe, FiTag, FiTrendingUp,
  FiLayers, FiCheckCircle, FiSmartphone, FiPlayCircle, FiLock, FiMessageSquare,
  FiClock, FiBell, FiShoppingBag, FiUserCheck, FiHelpCircle, FiTarget, FiImage, FiEye,
}

const IMAGES = {
  business: imgBusiness, group: imgGroup, private: imgPrivate, security: imgSecurity,
  multidevice: imgMultidevice, hero: imgHero, 'hero-photo': imgHeroPhoto,
  footer: imgFooter, cyberpunk: imgCyberpunk,
}

const NAV = ['Products', 'Resources', 'Developers', 'Partners']

// Animated hero illustration — a gently floating KT chat/feature preview with
// two floating icon badges. Uses the page's own data so it stays on-topic.
function HeroVisual({ data }) {
  const Icon1 = ICONS[data.features?.[0]?.icon] || FiZap
  const Icon2 = ICONS[data.features?.[1]?.icon] || FiSend
  const feat1 = data.features?.[0]?.title
  return (
    <div className="relative mx-auto hidden w-full max-w-md lg:block">
      <div aria-hidden className="absolute inset-6 -z-10 rounded-full bg-brand/25 blur-3xl" />
      {/* Framed content photo */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-float"
      >
        <img src={IMAGES[data.image] || imgBusiness} alt={data.title} className="h-[380px] w-full object-cover" />
      </motion.div>
      {/* Floating accent — a verified KT feature chip */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-5 top-8 flex items-center gap-2 rounded-2xl bg-surface px-3.5 py-2.5 shadow-float"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand-strong"><Icon1 /></span>
        <span className="max-w-[8rem] text-[12px] font-bold leading-tight text-ink">{feat1}</span>
      </motion.div>
      {/* Floating accent — icon badge */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-5 bottom-12 grid h-12 w-12 place-items-center rounded-2xl bg-brand-strong text-white shadow-float"
      >
        <Icon2 className="text-lg" />
      </motion.div>
    </div>
  )
}

export function BusinessSubPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { openDownloadModal } = useModal()
  const data = businessProducts[slug]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Unknown slug → send back to the Business hub.
  if (!data) return <Navigate to="/business" replace />

  return (
    <div className="min-h-screen bg-surface">
      {/* Dark KT Business header (links back to the hub with the full menu) */}
      <header style={{ backgroundColor: DARK }} className="sticky top-0 z-50 border-b border-slate-800 text-white shadow-md">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/business')} className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
              <Logo showWordmark={false} markClassName="h-9 w-9" />
              <span>KT Business</span>
            </button>
            <nav className="hidden items-center gap-7 md:flex">
              {NAV.map((item) => (
                <button
                  key={item}
                  onClick={() => navigate('/business')}
                  className="text-[15px] font-semibold text-white/90 transition-colors hover:text-sky-400"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={openDownloadModal}
            className="rounded-full bg-brand-strong px-5 py-2.5 text-sm font-bold text-white shadow-brand transition-transform hover:-translate-y-0.5"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-brand-soft/60 dark:bg-cream-2">
        <Container className="py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal from="up">
              <span className="inline-flex items-center rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">
                {data.eyebrow}
              </span>
              <h1 className="mt-5 max-w-3xl text-[2.4rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {data.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-body">{data.subtitle}</p>
              <div className="mt-8">
                <button
                  onClick={openDownloadModal}
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-strong px-6 py-3 text-sm font-bold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:bg-brand-strong-hover"
                >
                  {data.cta?.button || 'Get started'}
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>

            <Reveal from="scale" delay={0.1}>
              <HeroVisual data={data} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Feature cards */}
      {data.features?.length ? (
        <section className="bg-surface py-16 lg:py-24">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.features.map((f, i) => {
                const Icon = ICONS[f.icon] || FiZap
                return (
                  <Reveal key={f.title} from="up" delay={(i % 3) * 0.05}>
                    <div className="h-full rounded-[24px] border border-line bg-cream-2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card dark:bg-surface-2">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
                        <Icon className="text-xl" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-ink">{f.title}</h3>
                      <p className="mt-2 text-[15px] leading-7 text-body">{f.desc}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Spotlight — content image + benefit points */}
      {data.spotlight ? (
        <section className="border-t border-line bg-cream py-16 dark:bg-cream-2 lg:py-24">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal from="up">
                <div className="overflow-hidden rounded-[28px] border border-line shadow-card">
                  <img
                    src={IMAGES[data.spotlight.image] || imgBusiness}
                    alt={data.spotlight.title}
                    className="h-[300px] w-full object-cover lg:h-[420px]"
                  />
                </div>
              </Reveal>
              <Reveal from="up" delay={0.06}>
                <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">{data.spotlight.title}</h2>
                {data.spotlight.subtitle ? (
                  <p className="mt-4 text-lg leading-8 text-body">{data.spotlight.subtitle}</p>
                ) : null}
                <ul className="mt-7 space-y-4">
                  {data.spotlight.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-7 text-body">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong">
                        <FiCheck className="text-xs" />
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Steps (how-to pages) */}
      {data.steps?.length ? (
        <section className="border-t border-line bg-surface py-16 lg:py-24">
          <Container maxW="max-w-3xl">
            <Reveal from="up">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Step by step</h2>
            </Reveal>
            <ol className="mt-8 space-y-6">
              {data.steps.map((s, i) => (
                <Reveal key={s.title} from="up" delay={i * 0.04}>
                  <li className="flex gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-strong text-sm font-bold text-white shadow-brand">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-7 text-body">{s.desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {/* Optional note */}
      {data.note ? (
        <section className="bg-surface pb-4">
          <Container>
            <p className="max-w-3xl text-sm leading-6 text-muted">{data.note}</p>
          </Container>
        </section>
      ) : null}

      {/* CTA band */}
      {data.cta ? (
        <section className="bg-surface py-16 lg:py-20">
          <Container>
            <Reveal from="up">
              <div className="overflow-hidden rounded-[32px] bg-brand-soft p-8 text-center sm:p-12">
                <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{data.cta.title}</h2>
                {data.cta.desc ? <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-body">{data.cta.desc}</p> : null}
                <button
                  onClick={openDownloadModal}
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-brand-strong px-7 py-3.5 text-sm font-bold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:bg-brand-strong-hover"
                >
                  Get started
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <Footer />
      <ThemeToggle />
    </div>
  )
}

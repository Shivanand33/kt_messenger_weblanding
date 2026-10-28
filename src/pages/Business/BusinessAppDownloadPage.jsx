import { useEffect } from 'react'
import { img } from '../../utils/imageOverrides'
import { FaGooglePlay, FaApple } from 'react-icons/fa'
import {
  FiShoppingBag,
  FiZap,
  FiTag,
  FiSend,
  FiLock,
  FiUserCheck,
  FiSmartphone,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Footer } from '../../components/layout/Footer/Footer'
import { BusinessNavbar } from './BusinessNavbar'
import { useLanguage } from '../../context/LanguageContext'
import { useSeo } from '../../hooks/useSeo'
import { trackDownload } from '../../services/analytics'

import heroImg from '../../assets/images/online-marketplace-app-business.jpg'

const DARK = '#0b162c'

// KT Business app store listings (same apps the Products page links out to).
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.kalamtime.business.posh&pcampaignid=web_share'
const APP_STORE_URL = 'https://apps.apple.com/in/app/kt-business/id6769260317'

function StoreBadges({ tr, compact = false }) {
  return (
    <div className={`flex flex-wrap ${compact ? 'justify-center gap-3' : 'gap-4'}`}>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackDownload('android', PLAY_STORE_URL)}
        className="flex items-center gap-3 rounded-2xl bg-black px-6 py-3 ring-1 ring-white/25 transition-all hover:scale-105 hover:ring-white/50"
      >
        <FaGooglePlay className="text-3xl" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/70">{tr('Get it on')}</span>
          <span className="block text-lg font-extrabold">Google Play</span>
        </span>
      </a>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackDownload('ios', APP_STORE_URL)}
        className="flex items-center gap-3 rounded-2xl bg-black px-6 py-3 ring-1 ring-white/25 transition-all hover:scale-105 hover:ring-white/50"
      >
        <FaApple className="text-3xl" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/70">{tr('Download on the')}</span>
          <span className="block text-lg font-extrabold">App Store</span>
        </span>
      </a>
    </div>
  )
}

export function BusinessAppDownloadPage() {
  useSeo({
    title: 'Download KT Business App | Android & iOS.',
    description: 'Download the KT Business app for Android and iOS — connect with your customers, showcase your products and run your small business more efficiently.',
    path: '/business/app-download',
  })

  const { t: tr } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const features = [
    {
      icon: FiUserCheck,
      title: tr('Business profile'),
      desc: tr('Show your hours, address, website and catalog on a verified business profile customers can trust.'),
    },
    {
      icon: FiShoppingBag,
      title: tr('Product catalog'),
      desc: tr('Showcase your products and services right inside the chat, so customers can browse without leaving the conversation.'),
    },
    {
      icon: FiZap,
      title: tr('Quick replies & automation'),
      desc: tr('Answer common questions instantly with saved replies, greeting messages and away messages.'),
    },
    {
      icon: FiTag,
      title: tr('Labels & organization'),
      desc: tr('Organize chats and orders with color-coded labels, so follow-ups never slip through the cracks.'),
    },
    {
      icon: FiSend,
      title: tr('Broadcast messages'),
      desc: tr('Announce offers, restocks and updates to many customers at once — personally delivered to each chat.'),
    },
    {
      icon: FiLock,
      title: tr('Private by default'),
      desc: tr('Business and customer conversations stay protected with the KT Encryption Protocol, end to end.'),
    },
  ]

  const steps = [
    {
      n: '1',
      title: tr('Download the app'),
      desc: tr('Get KT Business free from Google Play or the App Store and register with your business number.'),
    },
    {
      n: '2',
      title: tr('Set up your profile'),
      desc: tr('Add your logo, hours, address and build your product catalog in minutes.'),
    },
    {
      n: '3',
      title: tr('Start connecting'),
      desc: tr('Chat with customers, share your catalog and turn conversations into orders.'),
    },
  ]

  return (
    <div className="min-h-screen font-sans text-white" style={{ background: DARK }}>
      <BusinessNavbar />

      {/* HERO */}
      <section className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-2 lg:px-8 lg:pt-20">
        <Reveal from="up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300 ring-1 ring-white/15">
            <FiSmartphone /> {tr('Business App')}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-strong sm:text-5xl lg:text-6xl">
            {tr('The KT Business app is built with the small business owner in mind')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {tr('Connect with your customers, showcase your products, and run your small business more efficiently.')}
          </p>
          <div className="mt-9">
            <StoreBadges tr={tr} />
          </div>
          <p className="mt-6 text-xs text-white/50">
            {tr('Free download for Android and iOS. Standard data rates may apply.')}
          </p>
        </Reveal>

        <Reveal from="scale" delay={0.1} className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10">
            <img
              src={img(heroImg)}
              alt={tr('KT Business app for small business owners')}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Reveal>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
        <Reveal from="up" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {tr('Everything your small business needs, in one app')}
          </h2>
          <p className="mt-4 text-white/70">
            {tr('Tools built for owners who run their business from their phone — simple to start, powerful as you grow.')}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} from="up" delay={0.05 * (i % 3)}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:border-sky-400/40 hover:bg-white/10">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-strong/20 text-sky-300 ring-1 ring-sky-400/30 transition-all group-hover:bg-brand-strong group-hover:text-white">
                  <f.icon className="text-xl" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW TO START */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-8">
          <Reveal from="up" className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {tr('Up and running in minutes')}
            </h2>
            <p className="mt-4 text-white/70">
              {tr('Three simple steps between you and your next customer.')}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} from="up" delay={0.06 * i}>
                <div className="relative h-full rounded-3xl border border-white/10 bg-[#0e1d38] p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-strong text-lg font-extrabold text-white shadow-brand">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <FiArrowRight className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-2xl text-sky-400/60 md:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 text-center lg:px-8">
        <Reveal from="scale">
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-6 py-14 sm:px-12">
            <FiCheckCircle className="mx-auto text-4xl text-sky-300" />
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {tr('Ready to turn conversations into customers?')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              {tr('Join millions of small businesses already growing with KT Business. Download the free app today.')}
            </p>
            <div className="mt-9 flex justify-center">
              <StoreBadges tr={tr} compact />
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}

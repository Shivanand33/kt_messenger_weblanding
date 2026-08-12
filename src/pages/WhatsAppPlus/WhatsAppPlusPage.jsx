import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiStar,
  FiZap,
  FiCheck,
  FiLayers,
  FiShield,
  FiUploadCloud,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiCheckCircle,
  FiMoon,
  FiUserCheck
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PlusLoopVideo } from '../../components/common/VideoAnimations/PlusLoopVideo'

function CrownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M14.232 3.676a.5.5 0 0 1 .7.127l1 1.5a.5.5 0 0 1-.168.683l-4 2.5a.5.5 0 0 1-.774-.37l-.5-4a.5.5 0 0 1 .632-.544l3.11.804zM1.768 3.676a.5.5 0 0 0-.7.127l-1 1.5a.5.5 0 0 0 .168.683l4 2.5a.5.5 0 0 0 .774-.37l.5-4a.5.5 0 0 0-.632-.544l-3.11.804zM8 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-6 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM8 4a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 4z" />
    </svg>
  )
}

export function WhatsAppPlusPage() {
  const navigate = useNavigate()
  const [selectedTheme, setSelectedTheme] = useState('Midnight Sapphire')
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const themes = [
    { name: 'Midnight Sapphire', color: 'bg-slate-950 text-blue-400 border-blue-800' },
    { name: 'Electric Cyan', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' },
    { name: 'Royal Gold', color: 'bg-amber-950 text-amber-400 border-amber-800' },
    { name: 'Neon Purple', color: 'bg-purple-950 text-purple-400 border-purple-800' }
  ]

  const plusTabs = [
    {
      title: 'Theme Engine & Custom UI Styling',
      icon: <FiLayers className="text-xl" />,
      desc: 'Personalize bubble shapes, font families, wallpaper gradients, and chat header accents with 50+ pro theme presets.',
      highlights: ['Custom color theme creator', 'Exclusive font typography pack', 'Dark mode OLED true black']
    },
    {
      title: '10GB Uncompressed File Transfers',
      icon: <FiUploadCloud className="text-xl" />,
      desc: 'Send massive video projects, RAW camera footage, zip archives, and databases up to 10GB per attachment without quality compression.',
      highlights: ['10GB single file limit', 'High-speed cloud transfer relay', 'Zero compression loss']
    },
    {
      title: 'Multi-Account Dual Space (5 Accounts)',
      icon: <FiUserCheck className="text-xl" />,
      desc: 'Switch seamlessly between up to 5 KT accounts (Work, Personal, Business, Private) on the exact same device.',
      highlights: ['Run 5 active profiles concurrently', 'Separate notification badges', 'Individual encryption keys']
    },
    {
      title: 'Stealth Privacy Control Suite',
      icon: <FiShield className="text-xl" />,
      desc: 'Freeze last seen timestamp, hide online status indicators, read messages without triggering blue ticks, and view anti-deleted messages.',
      highlights: ['Freeze last seen status', 'Hide typing & recording indicator', 'Anti-delete message retrieval']
    },
    {
      title: 'Priority Pro AI Assistant',
      icon: <FiZap className="text-xl" />,
      desc: 'Get unlimited AI text generations, 4K image outputs, and faster processing speeds powered by premium LLM models.',
      highlights: ['Unlimited AI image generations', 'Priority GPU rendering queue', 'Advanced GPT-4 class reasoning']
    }
  ]

  const metrics = [
    { value: '10 GB', label: 'Max File Attachment Limit' },
    { value: '5', label: 'Concurrent Accounts' },
    { value: '50+', label: 'Exclusive UI Themes' },
    { value: 'VIP 24/7', label: 'Priority Customer Support' }
  ]

  const plusPerks = [
    {
      title: 'Custom App Launcher Icons',
      desc: 'Choose from 20+ custom app icons (Gold, Sapphire, Stealth Black, Neon) to customize your phone home screen.',
      icon: <CrownIcon className="text-2xl" />
    },
    {
      title: 'Animated Profile Badges',
      desc: 'Show off your KT Plus status with a verified golden crown badge on your profile and group member list.',
      icon: <FiStar className="text-2xl" />
    },
    {
      title: '10,000 Member Mass Broadcasts',
      desc: 'Send broadcast messages to up to 10,000 recipients at once for marketing campaigns and business updates.',
      icon: <FiUploadCloud className="text-2xl" />
    },
    {
      title: 'VIP 24/7 Priority Support',
      desc: 'Get direct priority assistance from dedicated KT customer engineering specialists anytime.',
      icon: <FiShield className="text-2xl" />
    }
  ]

  const comparisonTable = [
    { feature: 'File Attachment Limit', free: '2 GB', plus: '10 GB (Raw Quality)' },
    { feature: 'Concurrent Accounts', free: '1 Account', plus: 'Up to 5 Accounts' },
    { feature: 'Custom Theme Engine', free: 'Basic Light/Dark', plus: '50+ Pro Custom Themes' },
    { feature: 'Stealth Privacy Suite', free: 'Standard Privacy', plus: 'Freeze Last Seen + Blue Tick Control' },
    { feature: 'KT AI Quota', free: 'Standard Quota', plus: 'Unlimited Priority AI' },
    { feature: 'Group Member Capacity', free: '1,024 Members', plus: 'Up to 10,000 Members' }
  ]

  const faqs = [
    {
      q: 'What is KT Plus?',
      a: 'KT Plus is our premium power-user subscription that unlocks advanced theme customization, 10GB file transfers, 5-account switching, stealth privacy settings, and priority AI.'
    },
    {
      q: 'Does KT Plus compromise end-to-end encryption?',
      a: 'Not at all. KT Plus operates on the exact same Signal Protocol encryption engine as the standard KT Messenger app. Your chats remain 100% encrypted and private.'
    },
    {
      q: 'Can I use KT Plus across multiple devices?',
      a: 'Yes! One KT Plus subscription activates premium features across all your connected devices including iOS, Android, Mac, Windows, and Web.'
    },
    {
      q: 'How does the Multi-Account Switcher work?',
      a: 'You can add up to 5 phone numbers or profiles inside the app settings and switch between them instantly with a single tap without logging out.'
    },
    {
      q: 'What is Stealth Privacy?',
      a: 'Stealth Privacy allows you to hide your online status, freeze your last seen timestamp, read incoming messages without triggering blue receipts, and view messages edited or deleted by senders.'
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes, you can cancel your subscription at any time with one click from app settings. You retain Plus features until the end of your billing period.'
    }
  ]

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="up">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-strong/30 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-ink">
                <CrownIcon className="text-brand-strong" /> KT Plus Premium Suite
              </div>
              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                Unlock Ultimate Power with <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  KT Plus Subscription
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                Elevate your daily messaging experience with custom themes, 10GB file transfers, stealth privacy controls, and priority Pro AI access.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  Upgrade to KT Plus <CrownIcon className="text-lg ml-1" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/apps')}>
                  Compare Plans <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> 10GB File Sharing
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> Stealth Privacy Suite
                </span>
              </div>
            </Reveal>

            {/* INTERACTIVE THEME ENGINE MOCKUP */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="relative w-full max-w-[420px] rounded-[36px] border border-line bg-surface p-6 shadow-float">
                <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CrownIcon className="text-brand-strong text-2xl" />
                    <h3 className="font-bold text-ink text-base">Theme Customizer Engine</h3>
                  </div>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-bold text-brand-ink">
                    PRO UNLOCKED
                  </span>
                </div>

                <p className="text-xs text-muted mb-3 font-medium">Select your active theme preset:</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {themes.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedTheme(t.name)}
                      className={`rounded-xl p-2.5 text-xs font-bold border transition-all ${
                        selectedTheme === t.name
                          ? 'border-brand-strong bg-brand-soft text-brand-ink shadow-soft ring-2 ring-brand-strong/30'
                          : 'border-line bg-cream hover:bg-surface text-ink'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl bg-slate-950 p-4 text-white text-xs space-y-2 border border-slate-800 shadow-card">
                  <div className="flex justify-between text-[11px] text-brand-ink font-semibold">
                    <span>Active Theme: {selectedTheme}</span>
                    <span>10GB Max File Limit</span>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-2.5 text-slate-300 border border-slate-800">
                    🚀 Exclusive Pro Badge & 4K Uncompressed Media Engine enabled!
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2. STATS & METRICS BAR */}
      <section className="border-y border-line bg-surface py-10">
        <Container>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-strong lg:text-4xl">{m.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-body uppercase">{m.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. INTERACTIVE FEATURE SWITCHER (TABS) */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Exclusive Premium Perks
          </h2>
          <p className="mt-4 text-lg text-body">
            Designed for power users, creators, and professionals who demand the absolute best messaging experience.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {plusTabs.map((tab, idx) => {
              const active = activeTab === idx
              return (
                <button
                  key={tab.title}
                  onClick={() => setActiveTab(idx)}
                  className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all ${
                    active
                      ? 'bg-brand-strong text-white shadow-brand'
                      : 'bg-surface text-ink hover:bg-surface-2 border border-line'
                  }`}
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? 'bg-white/20 text-white' : 'bg-brand-soft text-brand-strong'}`}>
                    {tab.icon}
                  </div>
                  <h3 className="font-bold text-base">{tab.title}</h3>
                </button>
              )
            })}
          </div>

          <div className="rounded-3xl border border-line bg-surface p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink">
                KT Plus Pillar Deep Dive
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {plusTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {plusTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {plusTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">Unlocked with KT Plus Subscription</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                Get KT Plus <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* INTERACTIVE ANIMATED KT PLUS VIDEO DEMO */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20 border-y border-line">
        <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal from="left" className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                🎬 Interactive KT Plus Demo
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                KT Plus Theme Engine &amp; Pro Suite
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                Custom UI themes (Midnight Sapphire, Royal Gold), 10GB file transfers, 5 dual space accounts, and stealth privacy.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> Custom UI Theme Engine
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> 10GB RAW File Engine
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> 5 Dual Space Accounts
                </span>
              </div>
            </Reveal>

            <Reveal from="right" className="lg:col-span-7 relative flex justify-center py-2">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line text-base">
                <span>👑</span><span>💎</span><span>🎨</span><span>📁</span><span>💯</span>
              </motion.div>

              <div className="relative z-10">
                <PlusLoopVideo />
              </div>

              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-2 left-2 sm:left-6 z-20 flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-float border border-brand-strong/30 text-xs font-bold text-brand-ink">
                <FiShield className="text-brand-strong" /> KT Plus Pro Suite Active
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE SHOWCASE - STEALTH PRIVACY SUITE */}
      <section className="bg-brand-soft py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                <FiShield className="text-brand-strong" /> Stealth Privacy Engine
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
                Take complete control over your online footprint
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                KT Plus gives you full stealth capability. Freeze your last seen status, read messages without triggering blue receipts, and view messages even if deleted by the sender.
              </p>

              <div className="mt-6 space-y-3 text-sm font-semibold text-ink">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Freeze last seen timestamp to a custom historical date</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Send blue ticks only after you reply to a message</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Anti-delete message recovery indicator</span>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="flex justify-center">
              <div className="w-full max-w-[380px] rounded-3xl bg-surface p-6 shadow-float border border-line text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-strong text-white text-2xl mb-4 shadow-brand">
                  <CrownIcon className="text-2xl" />
                </div>
                <h3 className="font-bold text-lg text-ink">Stealth Controls Active</h3>
                <p className="text-xs text-body mt-1">Full control over read receipts and online visibility</p>

                <div className="mt-4 rounded-2xl bg-cream p-4 border border-line space-y-2 text-xs">
                  <div className="flex justify-between text-ink font-semibold">
                    <span>Freeze Last Seen:</span>
                    <span className="text-brand-strong font-bold">ACTIVE</span>
                  </div>
                  <div className="flex justify-between text-ink font-semibold">
                    <span>Blue Tick on Reply Only:</span>
                    <span className="text-brand-strong font-bold">ENABLED</span>
                  </div>
                  <div className="flex justify-between text-ink font-semibold">
                    <span>Anti-Delete Protection:</span>
                    <span className="text-brand-strong font-bold">ENABLED</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. PLUS PERKS GRID */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            VIP Perks Included with Plus
          </h2>
          <p className="mt-4 text-lg text-body">
            Additional privileges included with every active KT Plus subscription.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plusPerks.map((card) => (
            <Reveal key={card.title} from="up">
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft hover:shadow-card transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-ink">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{card.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-line">
                  <span className="text-[11px] font-semibold text-brand-ink">Pro Perk</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6. COMPARISON MATRIX */}
      <section className="bg-surface py-16 lg:py-24 border-y border-line">
        <Container>
          <Reveal from="up" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Free vs KT Plus Comparison
            </h2>
            <p className="mt-4 text-lg text-body">
              Compare features included in the standard free version vs KT Plus subscription.
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">Feature</th>
                  <th className="p-4 font-bold text-body">Standard Free KT</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT Plus (Premium)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="hover:bg-cream/50 transition-colors">
                    <td className="p-4 font-semibold text-ink">{row.feature}</td>
                    <td className="p-4 text-body">{row.free}</td>
                    <td className="p-4 font-bold text-brand-strong bg-brand-soft/30">{row.plus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 7. FAQ ACCORDION */}
      <Section className="bg-cream">
        <Container className="max-w-4xl">
          <Reveal from="up" className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink">
              <FiHelpCircle /> Plus FAQs
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index
              return (
                <div key={faq.q} className="overflow-hidden rounded-2xl border border-line bg-surface transition-all shadow-soft">
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

      {/* 8. CTA BANNER */}
      <section className="bg-gradient-to-r from-brand-strong to-brand-ink py-16 text-white lg:py-20">
        <Container className="text-center">
          <Reveal from="up">
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white">
              Upgrade to KT Plus Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Unlock 10GB file transfers, 5-account dual space, custom themes, and stealth privacy.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" onClick={() => navigate('/apps')}>
                Get KT Plus Now <CrownIcon className="text-lg ml-1" />
              </Button>
              <Button variant="onDark" size="lg" onClick={() => navigate('/apps')}>
                Launch Web App <FiChevronRight />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  )
}

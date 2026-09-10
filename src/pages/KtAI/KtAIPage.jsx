import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload,
  FiCpu,
  FiSend,
  FiImage,
  FiHelpCircle,
  FiCheckCircle,
  FiChevronRight,
  FiChevronDown,
  FiZap,
  FiGlobe,
  FiLock,
  FiCode,
  FiEdit3,
  FiShield
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { KtAiLoopVideo } from '../../components/common/VideoAnimations/KtAiLoopVideo'
import astronautUnicornImage from '../../assets/images/astronaut_unicorn_mars.png'
import cyberpunkCityImage from '../../assets/images/cyberpunk_neon_city.png'
import crystalParrotImage from '../../assets/images/crystal_tropical_parrot.png'
import { useLanguage } from '../../context/LanguageContext'

function SparklesIcon({ className = '' }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${className}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  )
}

export function KtAIPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [promptText, setPromptText] = useState(t('An astronaut riding a unicorn on Mars 🦄'))
  const [currentImg, setCurrentImg] = useState(astronautUnicornImage)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const samplePrompts = [
    { text: t('An astronaut riding a unicorn on Mars 🦄'), img: astronautUnicornImage },
    { text: t('A futuristic neon city in cyber rain 🌧️'), img: cyberpunkCityImage },
    { text: t('A crystal clear tropical parrot 🦜'), img: crystalParrotImage }
  ]

  const handlePromptSelect = (prompt, img) => {
    setPromptText(prompt)
    setIsGenerating(true)
    setTimeout(() => {
      setCurrentImg(img)
      setIsGenerating(false)
    }, 550)
  }

  const aiTabs = [
    {
      title: t('Text to Image Studio'),
      icon: <FiImage className="text-xl" />,
      desc: t('Turn imagination into high definition digital artwork directly inside any chat thread using simple `/imagine` prompts.'),
      highlights: [t('Instant 4K image generation'), t('Multiple artistic styles (Photorealistic, Anime)'), t('Save & share in 1 tap')]
    },
    {
      title: t('Smart Q&A & Research Helper'),
      icon: <SparklesIcon className="h-5 w-5" />,
      desc: t('Ask complex questions, summarize long articles, draft professional emails, or translate foreign languages in seconds.'),
      highlights: [t('Web connected real time data'), t('Instant multi language translation'), t('Bullet point document summaries')]
    },
    {
      title: t('Group Chat Co Pilot (@KTAI)'),
      icon: <FiZap className="text-xl" />,
      desc: t('Mention `@KTAI` in any group chat to settle debates, get restaurant recommendations, plan travel itineraries, or run quick trivia.'),
      highlights: [t('Seamless @mention activation'), t('Shared group answers'), t('Context aware suggestions')]
    },
    {
      title: t('Voice Note Audio Transcriber'),
      icon: <FiCpu className="text-xl" />,
      desc: t('Convert long voice notes into clean written transcripts and bullet point summaries automatically.'),
      highlights: [t('99.2% speech recognition accuracy'), t('Summarizes 5-minute audio in 1 second'), t('Supports 40+ spoken accents')]
    },
    {
      title: t('Code & Writing Copilot'),
      icon: <FiCode className="text-xl" />,
      desc: t('Generate code snippets, debug syntax errors, rewrite essays, and format structured tables on demand.'),
      highlights: [t('Multi language code support'), t('Grammar & tone enhancement'), t('CSV & JSON data formatting')]
    }
  ]

  const metrics = [
    { value: '< 1s', label: t('Response Latency') },
    { value: '100+', label: t('Languages Supported') },
    { value: '4K', label: t('Image Output Resolution') },
    { value: '100%', label: t('Private & Secure') }
  ]

  const aiUseCases = [
    {
      title: t('Creative Art & Visuals'),
      desc: t('Generate custom wallpapers, stickers, story graphics, and concepts effortlessly with natural language prompts.'),
      img: astronautUnicornImage
    },
    {
      title: t('Futuristic Cyberpunk Renders'),
      desc: t('Create ultra detailed futuristic cityscapes, sci fi concepts, and neon digital artwork in seconds.'),
      img: cyberpunkCityImage
    },
    {
      title: t('Photorealistic Macro Artwork'),
      desc: t('Produce crystal clear nature graphics, iridescent wildlife concepts, and 3D glass renders on demand.'),
      img: crystalParrotImage
    }
  ]

  const comparisonTable = [
    { feature: t('In Chat Access'), kt: t('Built in Native'), standalone: t('Browser App Only'), traditional: t('Not Available') },
    { feature: t('Image Generation'), kt: t('Included Free'), standalone: t('Paid Upgrade'), traditional: t('Not Supported') },
    { feature: t('Group Chat Co Pilot'), kt: t('Included (@KTAI)'), standalone: t('Not Supported'), traditional: t('Not Supported') },
    { feature: t('Voice Note Summaries'), kt: t('1-Tap Automated'), standalone: t('Manual File Upload'), traditional: t('Not Supported') },
    { feature: t('Data Privacy'), kt: t('KT Encrypted Stream'), standalone: t('Data Trained on Web'), traditional: 'N/A' }
  ]

  const faqs = [
    {
      q: t('What is KT AI?'),
      a: t('KT AI is an intelligent assistant built directly into KT Messenger that helps you answer questions, generate images, write text, and summarize voice notes inside personal and group chats.')
    },
    {
      q: t('How do I generate an image using KT AI?'),
      a: t('Simply type `/imagine` followed by a description of the image you want (e.g. `/imagine A futuristic city on Mars`). KT AI will create and deliver the artwork in seconds.')
    },
    {
      q: t('Can I use KT AI inside group chats?'),
      a: t('Yes! Simply mention `@KTAI` in any group chat followed by your question (e.g. `@KTAI recommend 3 good restaurants nearby`), and KT AI will respond to the group.')
    },
    {
      q: t('Is my data used to train AI models?'),
      a: t('No. Your AI interactions and chat content are processed privately and are never stored or used to train public AI models.')
    },
    {
      q: t('Is KT AI free to use?'),
      a: t('Yes, KT AI includes a generous daily quota of free text answers, image generations, and voice transcriptions for all KT users.')
    },
    {
      q: t('Which languages does KT AI support?'),
      a: t('KT AI supports over 100 languages for text answers, translation, and speech to text voice note transcription.')
    }
  ]

  return (
    <MainLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="up">
              <div className="relative inline-flex items-center gap-3 rounded-full border border-sky-400/40 dark:border-sky-400/30 bg-gradient-to-r from-sky-500/10 via-indigo-500/15 to-purple-500/10 px-5 py-2.5 text-xs font-extrabold text-sky-600 dark:text-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.25)] backdrop-blur-xl group overflow-hidden">
                {/* Animated Shimmer Ray */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Futuristic Glowing Animated AI Logo Icon */}
                <div className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-sky-500/30 shrink-0">
                  <span className="absolute -inset-0.5 rounded-xl bg-sky-400/50 blur-sm animate-pulse" />
                  <SparklesIcon className="relative z-10 h-4 w-4 animate-spin [animation-duration:6s]" />
                </div>

                <span className="font-extrabold tracking-wide uppercase text-[11px] bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                  {t('Next Gen Artificial Intelligence')}
                </span>

                {/* Live AI Pulse Ring */}
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                </span>
              </div>

              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                {t('Meet KT AI Your')} <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  {t('personal AI assistant')}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                {t('Ask questions, generate artwork, summarize audio, and brainstorm ideas directly inside your personal and group conversations.')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  {t('Try KT AI Free')} <FiDownload className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/apps')}>
                  {t('Explore Capabilities')} <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('Text & Image Generation')}
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> {t('100+ Languages')}
                </span>
              </div>
            </Reveal>

            {/* INTERACTIVE AI GENERATOR MOCKUP */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="relative w-full max-w-[420px] rounded-[36px] border border-line bg-surface p-6 shadow-float">
                <div className="flex items-center gap-3 border-b border-line pb-4 mb-4">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 text-white font-black text-sm shadow-md shadow-sky-500/30 shrink-0">
                    <span className="absolute -inset-0.5 rounded-2xl bg-sky-400/40 blur-sm animate-pulse" />
                    <SparklesIcon className="relative z-10 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-base">{t('KT AI Studio')}</h3>
                    <p className="text-xs text-brand-ink font-semibold">{t('Online • Image Generator')}</p>
                  </div>
                </div>

                {/* AI Chat Prompt */}
                <div className="rounded-2xl bg-cream p-3 mb-3 border border-line text-xs font-medium text-body">
                  <span className="font-bold text-brand-strong">/imagine</span> {promptText}
                </div>

                {/* Generated Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 shadow-soft">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-white text-xs font-semibold">
                      <SparklesIcon className="animate-spin text-2xl mr-2 text-brand-strong" />
                      {t('Generating high res image...')}
                    </div>
                  ) : (
                    <img src={currentImg} alt={t('AI Generated')} className="h-full w-full object-cover" />
                  )}
                  <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    {t('Generated by KT AI ✨')}
                  </div>
                </div>

                {/* Sample Prompt Selector */}
                <div className="mt-4 space-y-1.5">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{t('Tap sample prompt to generate:')}</p>
                  {samplePrompts.map((p) => (
                    <button
                      key={p.text}
                      onClick={() => handlePromptSelect(p.text, p.img)}
                      className="block w-full rounded-xl bg-cream px-3 py-2 text-left text-xs font-medium text-ink hover:bg-brand-soft hover:text-brand-ink transition-colors border border-line"
                    >
                      {p.text}
                    </button>
                  ))}
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
            {t('Everything AI Can Do For You')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('Explore the multi modal artificial intelligence built directly into your everyday messaging interface.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-3">
            {aiTabs.map((tab, idx) => {
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
                {t('AI Capability Deep Dive')}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-ink lg:text-3xl">
                {aiTabs[activeTab].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-body">
                {aiTabs[activeTab].desc}
              </p>

              <div className="mt-6 space-y-3">
                {aiTabs[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <FiCheckCircle className="text-brand-strong text-lg" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted font-medium">{t('Included free on all devices')}</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                {t('Try KT AI Now')} <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* INTERACTIVE ANIMATED AI VIDEO DEMO */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20 border-y border-line">
        <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal from="left" className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                {t('🎬 Interactive KT AI Demo')}
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                {t('Neural Multimodal AI Assistant')}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                {t('Type `/imagine` prompts for 4K artwork or mention `@KTAI` in any group chat to answer questions instantly.')}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('/imagine 4K Artwork')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('Group Chat Co Pilot')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> {t('Sub second GPU Render')}
                </span>
              </div>
            </Reveal>

            <Reveal from="right" className="lg:col-span-7 relative flex justify-center py-2">
              <div className="absolute inset-0 -z-0 bg-gradient-to-tr from-brand-strong/20 via-sky-400/10 to-purple-600/10 blur-3xl rounded-full" />
              
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-2 right-2 sm:right-10 z-20 hidden sm:flex items-center gap-1 rounded-2xl bg-surface px-3 py-1.5 shadow-float border border-line text-base">
                <span>🤖</span><span>✨</span><span>🎨</span><span>🔮</span><span>💯</span>
              </motion.div>

              <div className="relative z-10">
                <KtAiLoopVideo />
              </div>

              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-2 left-2 sm:left-6 z-20 flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-float border border-brand-strong/30 text-xs font-bold text-brand-ink">
                <FiShield className="text-brand-strong" /> {t('Multi Modal Neural AI Active')}
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. DEEP-DIVE SHOWCASE - GROUP CHAT CO-PILOT */}
      <section className="bg-brand-soft py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal from="left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-brand-ink border border-brand-strong/20">
                <FiZap className="text-brand-strong" /> {t('Group Chat Assistant')}
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
                {t('Bring artificial intelligence into group discussions')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                {t('Need to settle a friendly debate, generate a quick 3-day travel schedule, or translate a message for overseas friends? Mention `@KTAI` in any group to get shared instant answers.')}
              </p>

              <div className="mt-6 space-y-3 text-sm font-semibold text-ink">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('Responds directly in the group thread for everyone to see')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('Understands chat context and previous messages')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>{t('Translates messages into 50+ languages instantly')}</span>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="flex justify-center">
              <div className="w-full max-w-[400px] rounded-3xl bg-surface p-6 shadow-float border border-line space-y-3">
                <div className="rounded-2xl bg-cream p-3 border border-line text-xs">
                  <span className="font-bold text-brand-strong">@KTAI</span> {t('What are 3 healthy 15-minute dinner recipes?')}
                </div>

                <div className="rounded-2xl bg-brand-soft p-4 border border-brand-strong/20 text-xs text-ink space-y-2">
                  <div className="flex items-center gap-2 font-bold text-brand-ink">
                    <SparklesIcon className="text-brand-strong" /> {t('KT AI Co Pilot:')}
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-body leading-relaxed">
                    <li>{t('Avocado & Poached Egg Whole grain Toast')}</li>
                    <li>{t('Herbed Chickpea & Feta Salad')}</li>
                    <li>{t('Garlic Butter Lemon Shrimp Stir fry')}</li>
                  </ol>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. AI USE CASES GRID */}
      <Section className="bg-cream">
        <Reveal from="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t('Real World AI Productivity')}
          </h2>
          <p className="mt-4 text-lg text-body">
            {t('See how KT AI powers work, creativity, and daily organization.')}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {aiUseCases.map((card) => (
            <Reveal key={card.title} from="up">
              <div className="group overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all hover:-translate-y-1">
                <div className="h-44 overflow-hidden bg-brand-soft">
                  <img src={card.img} alt={card.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-ink">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{card.desc}</p>
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
              {t('Why KT AI is Superior')}
            </h2>
            <p className="mt-4 text-lg text-body">
              {t('Comparing in chat AI assistance against web only standalone chatbots.')}
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">{t('Feature')}</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT AI</th>
                  <th className="p-4 font-bold text-body">{t('Standalone Web AI')}</th>
                  <th className="p-4 font-bold text-body">{t('Traditional Messaging')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="hover:bg-cream/50 transition-colors">
                    <td className="p-4 font-semibold text-ink">{row.feature}</td>
                    <td className="p-4 font-bold text-brand-strong bg-brand-soft/30">{row.kt}</td>
                    <td className="p-4 text-body">{row.standalone}</td>
                    <td className="p-4 text-body">{row.traditional}</td>
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
              <FiHelpCircle /> {t('AI FAQs')}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('Frequently Asked Questions')}
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
              {t('Start Using KT AI Today')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              {t('Download KT Messenger now and experience next gen AI image generation, group assistant, and search.')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" onClick={() => navigate('/apps')}>
                {t('Try KT AI Free')} <FiDownload />
              </Button>
              <Button variant="onDark" size="lg" onClick={() => navigate('/apps')}>
                {t('Launch Web Version')} <FiChevronRight />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  )
}

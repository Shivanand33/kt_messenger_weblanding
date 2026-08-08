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
import sunsetImage from '../../assets/images/sunset_landscape.png'
import beachImage from '../../assets/images/beach_bicycles.png'
import hdImage from '../../assets/images/hd_landscape.png'

function SparklesIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M7.5 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm0 12a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm7.5-6.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm-12 0a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm10.243-4.243a.5.5 0 0 1 0 .707l-2.122 2.121a.5.5 0 1 1-.707-.707l2.122-2.121a.5.5 0 0 1 .707 0zm-8.486 8.485a.5.5 0 0 1 0 .707l-2.121 2.122a.5.5 0 1 1-.707-.707l2.121-2.122a.5.5 0 0 1 .707 0zm0-8.485a.5.5 0 0 1 .707 0l2.121 2.121a.5.5 0 1 1-.707.707L4.257 3.515a.5.5 0 0 1 0-.707zm8.486 8.485a.5.5 0 0 1 .707 0l2.121 2.122a.5.5 0 1 1-.707.707l-2.121-2.122a.5.5 0 0 1 0-.707z" />
    </svg>
  )
}

export function KtAIPage() {
  const navigate = useNavigate()
  const [promptText, setPromptText] = useState('An astronaut riding a unicorn on Mars 🦄')
  const [currentImg, setCurrentImg] = useState(sunsetImage)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [faqOpen, setFaqOpen] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const samplePrompts = [
    { text: 'An astronaut riding a unicorn on Mars 🦄', img: sunsetImage },
    { text: 'A futuristic neon city in cyber rain 🌧️', img: beachImage },
    { text: 'A crystal clear tropical parrot 🦜', img: hdImage }
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
      title: 'Text-to-Image Studio',
      icon: <FiImage className="text-xl" />,
      desc: 'Turn imagination into high-definition digital artwork directly inside any chat thread using simple `/imagine` prompts.',
      highlights: ['Instant 4K image generation', 'Multiple artistic styles (Photorealistic, Anime)', 'Save & share in 1 tap']
    },
    {
      title: 'Smart Q&A & Research Helper',
      icon: <SparklesIcon className="h-5 w-5" />,
      desc: 'Ask complex questions, summarize long articles, draft professional emails, or translate foreign languages in seconds.',
      highlights: ['Web-connected real-time data', 'Instant multi-language translation', 'Bullet-point document summaries']
    },
    {
      title: 'Group Chat Co-Pilot (@KTAI)',
      icon: <FiZap className="text-xl" />,
      desc: 'Mention `@KTAI` in any group chat to settle debates, get restaurant recommendations, plan travel itineraries, or run quick trivia.',
      highlights: ['Seamless @mention activation', 'Shared group answers', 'Context-aware suggestions']
    },
    {
      title: 'Voice Note Audio Transcriber',
      icon: <FiCpu className="text-xl" />,
      desc: 'Convert long voice notes into clean written transcripts and bullet-point summaries automatically.',
      highlights: ['99.2% speech recognition accuracy', 'Summarizes 5-minute audio in 1 second', 'Supports 40+ spoken accents']
    },
    {
      title: 'Code & Writing Copilot',
      icon: <FiCode className="text-xl" />,
      desc: 'Generate code snippets, debug syntax errors, rewrite essays, and format structured tables on demand.',
      highlights: ['Multi-language code support', 'Grammar & tone enhancement', 'CSV & JSON data formatting']
    }
  ]

  const metrics = [
    { value: '< 1s', label: 'Response Latency' },
    { value: '100+', label: 'Languages Supported' },
    { value: '4K', label: 'Image Output Resolution' },
    { value: '100%', label: 'Private & Secure' }
  ]

  const aiUseCases = [
    {
      title: 'Creative Art & Visuals',
      desc: 'Generate custom wallpapers, stickers, story graphics, and concepts effortlessly with natural language prompts.',
      img: sunsetImage
    },
    {
      title: 'Travel & Dining Planning',
      desc: 'Plan 3-day vacation itineraries, find top-rated local coffee spots, and calculate budget estimates instantly.',
      img: beachImage
    },
    {
      title: 'Business & Email Writing',
      desc: 'Draft client proposals, rewrite cold emails with persuasive tone, and craft press releases in seconds.',
      img: hdImage
    }
  ]

  const comparisonTable = [
    { feature: 'In-Chat Access', kt: 'Built-in Native', standalone: 'Browser App Only', traditional: 'Not Available' },
    { feature: 'Image Generation', kt: 'Included Free', standalone: 'Paid Upgrade', traditional: 'Not Supported' },
    { feature: 'Group Chat Co-Pilot', kt: 'Included (@KTAI)', standalone: 'Not Supported', traditional: 'Not Supported' },
    { feature: 'Voice Note Summaries', kt: '1-Tap Automated', standalone: 'Manual File Upload', traditional: 'Not Supported' },
    { feature: 'Data Privacy', kt: 'Signal Encrypted Stream', standalone: 'Data Trained on Web', traditional: 'N/A' }
  ]

  const faqs = [
    {
      q: 'What is KT AI?',
      a: 'KT AI is an intelligent assistant built directly into KT Messengers that helps you answer questions, generate images, write text, and summarize voice notes inside personal and group chats.'
    },
    {
      q: 'How do I generate an image using KT AI?',
      a: 'Simply type `/imagine` followed by a description of the image you want (e.g. `/imagine A futuristic city on Mars`). KT AI will create and deliver the artwork in seconds.'
    },
    {
      q: 'Can I use KT AI inside group chats?',
      a: 'Yes! Simply mention `@KTAI` in any group chat followed by your question (e.g. `@KTAI recommend 3 Italian restaurants nearby`), and KT AI will respond to the group.'
    },
    {
      q: 'Is my data used to train AI models?',
      a: 'No. Your AI interactions and chat content are processed privately and are never stored or used to train public AI models.'
    },
    {
      q: 'Is KT AI free to use?',
      a: 'Yes, KT AI includes a generous daily quota of free text answers, image generations, and voice transcriptions for all KT users.'
    },
    {
      q: 'Which languages does KT AI support?',
      a: 'KT AI supports over 100 languages for text answers, translation, and speech-to-text voice note transcription.'
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
                <SparklesIcon className="text-brand-strong" /> Next-Gen Artificial Intelligence
              </div>
              <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
                Meet KT AI — Your <br />
                <span className="bg-gradient-to-r from-brand-strong to-brand-ink bg-clip-text text-transparent">
                  personal AI assistant
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-body">
                Ask questions, generate artwork, summarize audio, and brainstorm ideas directly inside your personal and group conversations.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => navigate('/apps')}>
                  Try KT AI Free <FiDownload className="text-lg" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/apps')}>
                  Explore Capabilities <FiChevronRight />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-sm text-body">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> Text & Image Generation
                </span>
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-brand-strong" /> 100+ Languages
                </span>
              </div>
            </Reveal>

            {/* INTERACTIVE AI GENERATOR MOCKUP */}
            <Reveal from="scale" delay={0.15} className="flex justify-center">
              <div className="relative w-full max-w-[420px] rounded-[36px] border border-line bg-surface p-6 shadow-float">
                <div className="flex items-center gap-3 border-b border-line pb-4 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-strong text-white font-bold text-sm shadow-brand">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-base">KT AI Studio</h3>
                    <p className="text-xs text-brand-ink font-semibold">Online • Image Generator</p>
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
                      Generating high-res image...
                    </div>
                  ) : (
                    <img src={currentImg} alt="AI Generated" className="h-full w-full object-cover" />
                  )}
                  <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    Generated by KT AI ✨
                  </div>
                </div>

                {/* Sample Prompt Selector */}
                <div className="mt-4 space-y-1.5">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Tap sample prompt to generate:</p>
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
            Everything AI Can Do For You
          </h2>
          <p className="mt-4 text-lg text-body">
            Explore the multi-modal artificial intelligence built directly into your everyday messaging interface.
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
                AI Capability Deep Dive
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
              <span className="text-xs text-muted font-medium">Included free on all devices</span>
              <Button size="sm" onClick={() => navigate('/apps')}>
                Try KT AI Now <FiChevronRight />
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
                🎬 Interactive KT AI Demo
              </div>
              <h2 className="text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.5rem] tracking-tight leading-tight">
                Neural Multimodal AI Assistant
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-body">
                Type `/imagine` prompts for 4K artwork or mention `@KTAI` in any group chat to answer questions instantly.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> /imagine 4K Artwork
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> Group Chat Co-Pilot
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 p-2 px-3 text-xs font-bold text-ink border border-line">
                  <FiCheckCircle className="text-brand-strong text-sm" /> Sub-second GPU Render
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
                <FiShield className="text-brand-strong" /> Multi-Modal Neural AI Active
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
                <FiZap className="text-brand-strong" /> Group Chat Assistant
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
                Bring artificial intelligence into group discussions
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                Need to settle a friendly debate, generate a quick 3-day travel schedule, or translate a message for overseas friends? Mention `@KTAI` in any group to get shared instant answers.
              </p>

              <div className="mt-6 space-y-3 text-sm font-semibold text-ink">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Responds directly in the group thread for everyone to see</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Understands chat context and previous messages</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-brand-strong text-lg" />
                  <span>Translates messages into 50+ languages instantly</span>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="flex justify-center">
              <div className="w-full max-w-[400px] rounded-3xl bg-surface p-6 shadow-float border border-line space-y-3">
                <div className="rounded-2xl bg-cream p-3 border border-line text-xs">
                  <span className="font-bold text-brand-strong">@KTAI</span> What are 3 healthy 15-minute dinner recipes?
                </div>

                <div className="rounded-2xl bg-brand-soft p-4 border border-brand-strong/20 text-xs text-ink space-y-2">
                  <div className="flex items-center gap-2 font-bold text-brand-ink">
                    <SparklesIcon className="text-brand-strong" /> KT AI Co-Pilot:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-body leading-relaxed">
                    <li>Avocado & Poached Egg Whole-grain Toast</li>
                    <li>Mediterranean Chickpea & Feta Salad</li>
                    <li>Garlic Butter Lemon Shrimp Stir-fry</li>
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
            Real-World AI Productivity
          </h2>
          <p className="mt-4 text-lg text-body">
            See how KT AI powers work, creativity, and daily organization.
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
              Why KT AI is Superior
            </h2>
            <p className="mt-4 text-lg text-body">
              Comparing in-chat AI assistance against web-only standalone chatbots.
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="p-4 font-bold text-ink">Feature</th>
                  <th className="p-4 font-bold text-brand-strong bg-brand-soft/60">KT AI</th>
                  <th className="p-4 font-bold text-body">Standalone Web AI</th>
                  <th className="p-4 font-bold text-body">Traditional Messaging</th>
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
              <FiHelpCircle /> AI FAQs
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
              Start Using KT AI Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Download KT Messengers now and experience next-gen AI image generation, group assistant, and search.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="white" size="lg" onClick={() => navigate('/apps')}>
                Try KT AI Free <FiDownload />
              </Button>
              <Button variant="onDark" size="lg" onClick={() => navigate('/apps')}>
                Launch Web Version <FiChevronRight />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </MainLayout>
  )
}

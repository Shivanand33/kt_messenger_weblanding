import {
  FiZap, FiLayers, FiMessageSquare, FiHeadphones, FiGlobe, FiGrid, FiUsers,
  FiActivity, FiPhone, FiRadio, FiCompass, FiSearch, FiCheck, FiArrowRight, FiShield, FiHeart,
  FiAtSign, FiSmartphone,
} from 'react-icons/fi'
import { Section } from '../../common/Section/Section'
import { SectionHeading } from '../../common/SectionHeading/SectionHeading'
import { IconTile } from '../../common/IconTile/IconTile'
import { Reveal } from '../../common/Reveal/Reveal'
import { Button } from '../../common/Button/Button'
import { LinkArrow } from '../../common/LinkArrow/LinkArrow'
import { useModal } from '../../../context/ModalContext'
import { useCountUp } from '../../../hooks/useCountUp'
import aiImg from '../../../assets/images/cyberpunk_neon_city.png'
import communityImg from '../../../assets/images/footer.jpg'
import contentImg from '../../../assets/images/private.jpg'
import updatesImg from '../../../assets/images/business.jpg'
import voiceImg from '../../../assets/images/multidevice.jpg'
import collabImg from '../../../assets/images/group.jpg'
import ecosystemImg from '../../../assets/images/hero.jpg'
import privacyImg from '../../../assets/images/security.jpg'

// Card chrome matched 1:1 to the site-wide <Card hover> component.
const cardBase =
  'group flex flex-col overflow-hidden rounded-card border border-line bg-cream-2 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card'

const features = [
  {
    icon: <FiMessageSquare />,
    title: 'Smart Messaging Experience',
    desc: 'Modern communication that goes far beyond basic chatting — fast, private and rich.',
    tags: ['End-to-end encrypted', 'Groups', 'Communities', 'Broadcasts'],
  },
  {
    icon: <FiHeadphones />,
    title: 'Listen To Messages Instead Of Reading',
    desc: 'Play voice messages hands-free — perfect while driving, travelling or multitasking.',
    tags: ['Hands-free', 'Accessible', 'On the go'],
  },
  {
    icon: <FiZap />,
    title: 'KT AI Integrated Inside Messenger',
    desc: 'Ask KT AI directly in your chats for instant answers — built in, not a separate tool.',
    tags: ['Ask KT AI', 'Smart search', 'Instant help'],
    accent: true,
  },
  {
    icon: <FiGlobe />,
    title: 'News Inside KT',
    desc: 'Discover stories, share them instantly and turn the day’s news into conversations.',
    tags: ['Stay updated', 'Share instantly', 'Discuss'],
  },
  {
    icon: <FiGrid />,
    title: 'Minis Ecosystem',
    desc: 'Lightweight mini experiences and saved Minis you can reach without leaving KT.',
    tags: ['Quick access', 'Saved Minis', 'Expanding'],
  },
  {
    icon: <FiUsers />,
    title: 'Communities & Groups',
    desc: 'Build interest-based communities and host large-scale conversations with ease.',
    tags: ['Community building', 'Engagement', 'Organized'],
  },
  {
    icon: <FiActivity />,
    title: 'Updates Feed',
    desc: 'Follow activity, share important moments and stay connected beyond private chats.',
    tags: ['Discover', 'Follow', 'Share'],
  },
  {
    icon: <FiPhone />,
    title: 'Calls & Communication',
    desc: 'Crystal-clear voice calls and connected tools for seamless, real-time interaction.',
    tags: ['Voice calls', 'Seamless', 'Connected'],
  },
  {
    icon: <FiLayers />,
    title: 'Everything In One Place',
    desc: 'Chats, Updates, News, Minis, Calls, AI, Communities and Broadcasts — one platform.',
    tags: ['One app', 'No switching', 'All-in-one'],
    accent: true,
  },
]

const highlights = [
  {
    image: aiImg,
    label: 'KT AI',
    title: 'Futuristic assistance, built in',
    text: 'Smart search and instant answers live right inside your conversations.',
  },
  {
    image: communityImg,
    label: 'Communities',
    title: 'Where audiences grow together',
    text: 'Interest-based communities and groups that scale to thousands.',
  },
  {
    image: contentImg,
    label: 'Content & News',
    title: 'Discover, share, discuss',
    text: 'Content and communication working side by side in one flow.',
  },
]

const ecosystem = [
  { icon: <FiMessageSquare />, label: 'Chats' },
  { icon: <FiActivity />, label: 'Updates' },
  { icon: <FiGlobe />, label: 'News' },
  { icon: <FiGrid />, label: 'Minis' },
  { icon: <FiPhone />, label: 'Calls' },
  { icon: <FiZap />, label: 'KT AI' },
  { icon: <FiUsers />, label: 'Communities' },
  { icon: <FiRadio />, label: 'Broadcasts' },
]

const capabilities = [
  { icon: <FiMessageSquare />, label: 'Messaging' },
  { icon: <FiZap />, label: 'KT AI' },
  { icon: <FiHeadphones />, label: 'Voice Message Listening' },
  { icon: <FiGlobe />, label: 'News' },
  { icon: <FiActivity />, label: 'Updates' },
  { icon: <FiGrid />, label: 'Minis' },
  { icon: <FiUsers />, label: 'Communities' },
  { icon: <FiRadio />, label: 'Broadcasts' },
  { icon: <FiPhone />, label: 'Calls' },
  { icon: <FiCompass />, label: 'Content Discovery' },
  { icon: <FiAtSign />, label: 'Smart Mentions' },
  { icon: <FiLayers />, label: 'Unified Platform Experience' },
]

const articles = [
  {
    image: communityImg, tag: 'Ecosystem', read: '4 min read',
    title: 'Why KT Messenger Is More Than Messaging',
    excerpt: 'Messaging, AI, news, updates, communities and calls — how KT brings a full digital ecosystem into one app.',
  },
  {
    image: updatesImg, tag: 'Discovery', read: '3 min read',
    title: 'Communicate, Discover, and Stay Updated',
    excerpt: 'News, updates and messaging working together so you never miss what matters to the people around you.',
  },
  {
    image: aiImg, tag: 'KT AI', read: '4 min read',
    title: 'KT AI: Smarter Conversations',
    excerpt: 'Ask KT AI right inside your chats for instant answers and smart search — intelligence built into the experience.',
  },
  {
    image: voiceImg, tag: 'Voice', read: '3 min read',
    title: 'Listen To Messages Anywhere',
    excerpt: 'Play voice messages hands-free while driving, travelling or multitasking — communication made more accessible.',
  },
  {
    image: collabImg, tag: 'Communities', read: '5 min read',
    title: 'Communities Built For Collaboration',
    excerpt: 'Groups, @mentions and organized discussions that keep teams and communities coordinated and engaged.',
  },
  {
    image: ecosystemImg, tag: 'Ecosystem', read: '4 min read',
    title: 'Everything In One Place',
    excerpt: 'Chats, AI, news, updates, calls, communities, broadcasts and minis — one seamless platform experience.',
  },
  {
    image: privacyImg, tag: 'Privacy', read: '3 min read',
    title: 'Privacy By Default: Your Chats Stay Yours',
    excerpt: 'Private conversations that stay private — security is built into every message, call and community.',
  },
  {
    image: updatesImg, tag: 'Broadcasts', read: '3 min read',
    title: 'Broadcasts That Reach Everyone',
    excerpt: 'Send announcements and reach many people at once with fast, efficient one-to-many communication.',
  },
  {
    image: voiceImg, tag: 'Calls', read: '3 min read',
    title: 'Calls That Feel Effortless',
    excerpt: 'Voice calls and connected conversations that make real-time interaction feel simple and seamless.',
  },
  {
    image: contentImg, tag: 'Minis', read: '4 min read',
    title: 'Minis: Quick Tools Inside KT',
    excerpt: 'Lightweight mini experiences and saved Minis you can reach instantly — a growing in-app ecosystem.',
  },
  {
    image: collabImg, tag: 'Updates', read: '3 min read',
    title: 'Updates: Stay In The Loop',
    excerpt: 'Follow activity, share moments and discover what’s happening beyond your private chats.',
  },
  {
    image: aiImg, tag: 'KT AI', read: '4 min read',
    title: 'Smart Search Powered By KT AI',
    excerpt: 'Find people, messages and answers faster with AI-assisted search built right into the app.',
  },
]

const stats = [
  { icon: <FiMessageSquare />, value: 100, suffix: '%', label: 'Smart Communication', hint: 'Encrypted chats, groups & broadcasts' },
  { icon: <FiZap />, value: 24, suffix: '/7', label: 'AI Assistance', hint: 'KT AI ready inside every chat' },
  { icon: <FiGlobe />, value: 1000, suffix: '+', label: 'News Discovery', hint: 'Stories and sources to explore' },
  { icon: <FiUsers />, value: 1024, label: 'Community Engagement', hint: 'Members in a single community' },
  { icon: <FiLayers />, value: 8, suffix: '-in-1', label: 'Content Experiences', hint: 'Chats, News, Minis, Calls & more' },
]

const reasons = [
  { icon: <FiMessageSquare />, title: 'Communication', items: ['Messaging', 'Calls', 'Communities', 'Broadcasts', 'Smart Mentions'] },
  { icon: <FiZap />, title: 'Intelligence', items: ['KT AI', 'Smart Search', 'Instant Assistance'] },
  { icon: <FiCompass />, title: 'Discovery', items: ['News', 'Updates', 'Content Discovery'] },
  { icon: <FiGrid />, title: 'Ecosystem', items: ['Minis', 'Saved Minis', 'Multi-service platform'] },
  { icon: <FiHeadphones />, title: 'Accessibility', items: ['Voice Message Listening', 'Hands-free communication', 'Better multitasking experience'] },
]

const journey = [
  { icon: <FiSmartphone />, title: 'Open KT' },
  { icon: <FiZap />, title: 'Ask KT AI' },
  { icon: <FiGlobe />, title: 'Read News' },
  { icon: <FiActivity />, title: 'Check Updates' },
  { icon: <FiUsers />, title: 'Join Communities' },
  { icon: <FiMessageSquare />, title: 'Chat With Friends' },
  { icon: <FiHeadphones />, title: 'Listen To Messages' },
  { icon: <FiPhone />, title: 'Make Calls' },
  { icon: <FiGrid />, title: 'Explore Minis' },
]

const onePlatform = [
  { icon: <FiMessageSquare />, label: 'Chats' },
  { icon: <FiZap />, label: 'AI' },
  { icon: <FiGlobe />, label: 'News' },
  { icon: <FiActivity />, label: 'Updates' },
  { icon: <FiPhone />, label: 'Calls' },
  { icon: <FiUsers />, label: 'Communities' },
  { icon: <FiRadio />, label: 'Broadcasts' },
  { icon: <FiGrid />, label: 'Minis' },
]

const trust = [
  { icon: <FiShield />, title: 'Secure messaging', text: 'Private by default and encrypted end to end.' },
  { icon: <FiMessageSquare />, title: 'Modern communication', text: 'Chats, calls and broadcasts that feel effortless.' },
  { icon: <FiZap />, title: 'AI-powered experience', text: 'KT AI and smart search built right in.' },
  { icon: <FiLayers />, title: 'Content ecosystem', text: 'News, updates and discovery in one flow.' },
  { icon: <FiUsers />, title: 'Community engagement', text: 'Spaces where audiences grow together.' },
]

function StatCard({ item, index }) {
  const [ref, value] = useCountUp(item.value, { duration: 1400 + index * 120 })
  return (
    <div
      ref={ref}
      className="group rounded-3xl border border-line bg-surface p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-card sm:p-6"
    >
      <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink transition-transform duration-300 group-hover:scale-110">
        {item.icon}
      </span>
      <div className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
        {Math.round(value).toLocaleString('en-US')}
        {item.suffix}
      </div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{item.label}</div>
      <p className="mt-2 text-xs leading-relaxed text-body">{item.hint}</p>
    </div>
  )
}

export function Insights() {
  const { openDownloadModal } = useModal()

  return (
    <Section id="insights" className="border-y border-line bg-surface">
      {/* Hero heading */}
      <SectionHeading
        align="center"
        eyebrow="KT Ecosystem"
        eyebrowIcon={<FiZap />}
        title="Why KT Messenger Is More Than Just Messaging"
        description="KT combines communication, AI, content discovery, communities, news, minis, calls, creator experiences, and digital engagement into one powerful ecosystem."
        className="mx-auto max-w-3xl"
      />

      {/* Feature showcase cards */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, index) => (
          <Reveal key={f.title} from="up" delay={(index % 3) * 0.06} className="h-full">
            <article
              className={`${cardBase} h-full p-6 ${f.accent ? 'bg-gradient-to-br from-brand-soft to-cream-2' : ''}`}
            >
              <IconTile>{f.icon}</IconTile>
              <h3 className="mt-5 text-lg font-bold leading-snug text-ink">{f.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-7 text-body">{f.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-ink"
                  >
                    <FiCheck className="text-[10px]" /> {tag}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Everything in one platform */}
      <Reveal from="up" className="mt-6">
        <div className="overflow-hidden rounded-card border border-line bg-cream-2 p-8 text-center shadow-soft sm:p-10">
          <h3 className="text-xl font-bold text-ink sm:text-2xl">Everything In One Platform</h3>
          <p className="mx-auto mt-2 max-w-xl text-[15px] leading-7 text-body">
            One seamless experience — no switching between several apps to get things done.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {onePlatform.map((node, index) => (
              <div key={node.label} className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 shadow-soft transition-transform duration-300 hover:-translate-y-0.5">
                  <span className="text-brand-strong">{node.icon}</span>
                  <span className="text-sm font-bold text-ink">{node.label}</span>
                </span>
                {index < onePlatform.length - 1 ? (
                  <span aria-hidden className="text-lg font-black text-brand-strong/50">+</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Large image highlights */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {highlights.map((h, index) => (
          <Reveal key={h.title} from="up" delay={index * 0.08} className="h-full">
            <article className={`${cardBase} relative h-full min-h-[300px] justify-end`}>
              <img
                src={h.image}
                alt={h.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
              <div className="relative p-6 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold backdrop-blur">
                  {h.label}
                </span>
                <h3 className="mt-3 text-xl font-bold leading-tight">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/85">{h.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Why users choose KT */}
      <div className="mt-16">
        <SectionHeading
          align="center"
          title="Why Users Choose KT"
          description="Five reasons KT feels less like a chat app and more like a complete platform."
          className="mx-auto max-w-2xl"
          titleClassName="text-[1.6rem] sm:text-3xl lg:text-4xl"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} from="up" delay={(index % 3) * 0.06} className="h-full">
              <article className={`${cardBase} h-full p-6`}>
                <IconTile>{reason.icon}</IconTile>
                <h3 className="mt-5 text-lg font-bold leading-snug text-ink">{reason.title}</h3>
                <ul className="mt-4 space-y-2">
                  {reason.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium text-body">
                      <FiCheck className="shrink-0 text-brand-strong" /> {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Ecosystem journey */}
      <div className="mt-16">
        <SectionHeading
          align="center"
          title="The KT Ecosystem Journey"
          description="A day on KT flows naturally from discovery to connection — all in one place."
          className="mx-auto max-w-2xl"
          titleClassName="text-[1.6rem] sm:text-3xl lg:text-4xl"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((step, index) => (
            <Reveal key={step.title} from="up" delay={(index % 3) * 0.06} className="h-full">
              <div className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-cream-2 p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-strong to-brand-ink text-sm font-black text-white">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-ink transition-transform duration-300 group-hover:scale-110">
                    {step.icon}
                  </span>
                  <span className="text-[14px] font-bold leading-tight text-ink">{step.title}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Everything in one place — ecosystem showcase */}
      <Reveal from="up" className="mt-6">
        <div className="overflow-hidden rounded-card border border-line bg-gradient-to-br from-brand-soft/70 to-cream-2 p-8 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h3 className="text-2xl font-bold leading-tight text-ink lg:text-[1.9rem]">
                One app, every experience
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-7 text-body">
                Access chats, updates, news, minis, calls, AI and communities from a single platform —
                no more switching between several apps to get things done.
              </p>
              <div className="mt-6">
                <LinkArrow to="/blog">Read More</LinkArrow>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ecosystem.map((node) => (
                <div
                  key={node.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface/90 p-4 text-center shadow-soft transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink">
                    {node.icon}
                  </span>
                  <span className="text-xs font-bold text-ink">{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Premium comparison — capability cards */}
      <div className="mt-16">
        <SectionHeading
          align="center"
          title="The KT Messenger Ecosystem"
          description="Everything you get in one place — a complete digital experience, not just a chat box."
          className="mx-auto max-w-2xl"
          titleClassName="text-[1.6rem] sm:text-3xl lg:text-4xl"
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {capabilities.map((c, index) => (
            <Reveal key={c.label} from="up" delay={(index % 4) * 0.05}>
              <div className="group flex items-center gap-3 rounded-2xl border border-line bg-cream-2 p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-ink transition-transform duration-300 group-hover:scale-110">
                  {c.icon}
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-bold leading-tight text-ink">{c.label}</span>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
                  <FiCheck className="text-sm" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Animated statistics */}
      <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
        {stats.map((item, index) => (
          <StatCard key={item.label} item={item} index={index} />
        ))}
      </div>

      {/* Trust */}
      <div className="mt-16">
        <SectionHeading
          align="center"
          title="Built On Trust"
          description="Secure, modern and intelligent — the foundations behind every KT experience."
          className="mx-auto max-w-2xl"
          titleClassName="text-[1.6rem] sm:text-3xl lg:text-4xl"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {trust.map((item, index) => (
            <Reveal key={item.title} from="up" delay={(index % 5) * 0.05} className="h-full">
              <div className="group h-full rounded-3xl border border-line bg-cream-2 p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-xl text-brand-ink transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <h3 className="text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-body">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* From the KT Blog */}
      <div className="mt-16">
        <SectionHeading
          align="center"
          title="From the KT Blog"
          description="Deep dives into the ideas and features that make KT a complete digital ecosystem."
          className="mx-auto max-w-2xl"
          titleClassName="text-[1.6rem] sm:text-3xl lg:text-4xl"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.title} from="up" delay={(index % 3) * 0.06} className="h-full">
              <article className={`${cardBase} h-full`}>
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="h-48 w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-line bg-surface/90 px-3 py-1 text-[11px] font-bold text-brand-ink backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">
                    {article.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{article.read}</span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-ink">{article.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-body">{article.excerpt}</p>
                  <div className="mt-5 border-t border-line pt-4">
                    <LinkArrow to="/blog">Read More</LinkArrow>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <Reveal from="up" className="mt-16">
        <div className="relative overflow-hidden rounded-block bg-gradient-to-br from-brand-strong to-brand-ink px-7 py-14 text-center text-white shadow-float sm:px-12 lg:py-16">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
          <div className="relative mx-auto max-w-2xl">
            <h3 className="text-[1.9rem] font-extrabold tracking-tight sm:text-4xl">Experience More Than Messaging</h3>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/90">
              KT Messenger brings communication, AI, content discovery, communities, news, minis, calls, and
              engagement together in one seamless experience.
            </p>
            <div className="mt-8 flex justify-center">
              <Button variant="white" size="lg" onClick={openDownloadModal}>
                Get Started <FiArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

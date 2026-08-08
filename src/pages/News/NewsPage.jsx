import { useEffect, useMemo, useState } from 'react'
import {
  FiActivity,
  FiAlertTriangle,
  FiBookmark,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiEye,
  FiFilter,
  FiGlobe,
  FiHeadphones,
  FiLayers,
  FiMail,
  FiMessageSquare,
  FiPause,
  FiPlay,
  FiRadio,
  FiSearch,
  FiShare2,
  FiShield,
  FiSliders,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiXCircle,
  FiZap,
} from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Section } from '../../components/common/Section/Section'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PageHero } from '../../components/feature/PageHero'
import { PageNav } from '../../components/feature/PageNav'
import { StatStrip } from '../../components/feature/StatStrip'
import { SectionHead } from '../../components/feature/SectionHead'
import { FilterBar } from '../../components/feature/FilterBar'
import { FeatureGrid } from '../../components/feature/FeatureGrid'
import { Steps } from '../../components/feature/Steps'
import { Testimonials } from '../../components/feature/Testimonials'
import { FaqAccordion } from '../../components/feature/FaqAccordion'
import { CtaBand } from '../../components/feature/CtaBand'
import { RelatedPages } from '../../components/feature/RelatedPages'
import { Marquee } from '../../components/feature/Marquee'
import { Modal } from '../../components/feature/Modal'
import { Toast } from '../../components/feature/Toast'
import { EmptyState } from '../../components/feature/EmptyState'
import { useModal } from '../../context/ModalContext'
import {
  breakingTicker,
  digestSchedule,
  factChecks,
  followTopics,
  newsArticles,
  newsCategories,
  newsFaqs,
  newsFeatures,
  newsSources,
  newsSteps,
  newsTestimonials,
} from './newsData'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'spotlight', label: 'Top story', icon: <FiStar /> },
  { id: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
  { id: 'feed', label: 'Feed', icon: <FiLayers /> },
  { id: 'digest', label: 'Audio brief', icon: <FiHeadphones /> },
  { id: 'topics', label: 'Topics', icon: <FiSliders /> },
  { id: 'sources', label: 'Sources', icon: <FiShield /> },
  { id: 'saved', label: 'Reading list', icon: <FiBookmark /> },
  { id: 'factcheck', label: 'Fact check', icon: <FiCheckCircle /> },
  { id: 'features', label: 'Features', icon: <FiZap /> },
  { id: 'faq', label: 'FAQ', icon: <FiMessageSquare /> },
]

const STATS = [
  { value: 40, suffix: '+', label: 'Live articles', icon: <FiLayers />, hint: 'Refreshed continuously from signed feeds.' },
  { value: 450, suffix: '+', label: 'Verified sources', icon: <FiShield />, hint: 'Every publisher signs its feed at origin.' },
  { value: 120, label: 'Countries covered', icon: <FiGlobe />, hint: 'Regional desks across six continents.' },
  { value: 50, suffix: '+', label: 'Reading languages', icon: <FiUsers />, hint: 'Translate inline, original always one tap away.' },
]

const FEATURE_ICONS = [
  <FiShield key="shield" />,
  <FiActivity key="activity" />,
  <FiHeadphones key="headphones" />,
  <FiGlobe key="globe" />,
  <FiBookmark key="bookmark" />,
  <FiCheckCircle key="check" />,
  <FiShare2 key="share" />,
  <FiFilter key="filter" />,
  <FiEye key="eye" />,
]

const STEP_ICONS = [<FiSliders key="a" />, <FiActivity key="b" />, <FiHeadphones key="c" />, <FiBookmark key="d" />]

const RELATED = [
  { to: '/markets', label: 'Markets', desc: 'Live prices, watchlists and FX conversion.', icon: <FiTrendingUp /> },
  { to: '/wallet', label: 'Wallet', desc: 'Send money in chat with zero transfer fees.', icon: <FiZap /> },
  { to: '/marketplace', label: 'Marketplace', desc: 'Shop verified stores without leaving a thread.', icon: <FiStar /> },
  { to: '/notes', label: 'Notes', desc: 'Encrypted notes, checklists and self-chat.', icon: <FiBookmark /> },
]

const DIGEST_SECONDS = 200
const PAGE_SIZE = 9

const verdictStyles = {
  true: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  warning: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
  false: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300',
}

const verdictIcons = {
  true: <FiCheckCircle />,
  warning: <FiAlertTriangle />,
  false: <FiXCircle />,
}

const readsToNumber = (reads) => parseFloat(reads) * 1000

const formatClock = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function NewsPage() {
  const { openDownloadModal } = useModal()

  const [activeCategory, setActiveCategory] = useState('All News')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Latest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [readingArticle, setReadingArticle] = useState(null)
  const [bookmarkedIds, setBookmarkedIds] = useState([1, 29])
  const [followed, setFollowed] = useState(['Artificial Intelligence', 'Indian Markets', 'Climate', 'Space'])
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Simulated playback for the daily audio brief.
  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(() => {
      setElapsed((current) => {
        if (current + 1 >= DIGEST_SECONDS) {
          setPlaying(false)
          return DIGEST_SECONDS
        }
        return current + 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [playing])

  const spotlight = newsArticles[0]
  const editorPicks = useMemo(() => newsArticles.filter((item) => item.hot && item.id !== spotlight.id).slice(0, 4), [spotlight.id])
  const trending = useMemo(
    () => [...newsArticles].sort((a, b) => readsToNumber(b.reads) - readsToNumber(a.reads)).slice(0, 8),
    [],
  )

  const filtered = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    const list = newsArticles.filter((item) => {
      const matchesCategory = activeCategory === 'All News' || item.category === activeCategory
      const matchesTerm =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term) ||
        item.tags.some((tag) => tag.toLowerCase().includes(term))
      return matchesCategory && matchesTerm
    })

    if (sortBy === 'Most read') return [...list].sort((a, b) => readsToNumber(b.reads) - readsToNumber(a.reads))
    if (sortBy === 'Quick reads') return [...list].sort((a, b) => a.readMins - b.readMins)
    return list
  }, [activeCategory, searchQuery, sortBy])

  const visible = filtered.slice(0, visibleCount)
  const bookmarked = newsArticles.filter((item) => bookmarkedIds.includes(item.id))

  const chips = newsCategories.map((label) => ({
    label,
    count: label === 'All News' ? newsArticles.length : newsArticles.filter((item) => item.category === label).length,
  }))

  const resetPaging = () => setVisibleCount(PAGE_SIZE)

  const toggleBookmark = (id) => {
    const saved = bookmarkedIds.includes(id)
    setBookmarkedIds(saved ? bookmarkedIds.filter((item) => item !== id) : [...bookmarkedIds, id])
    setToast(saved ? 'Removed from your reading list.' : 'Saved to your encrypted reading list.')
  }

  const toggleTopic = (topic) =>
    setFollowed((current) => (current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]))

  const handleSubscribe = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setToast('Enter a valid email address to subscribe.')
      return
    }
    setToast(`Daily brief confirmed for ${email.trim()}.`)
    setEmail('')
  }

  const openArticle = (article) => {
    setReadingArticle(article)
    setToast(null)
  }

  const relatedToReading = readingArticle
    ? newsArticles.filter((item) => item.category === readingArticle.category && item.id !== readingArticle.id).slice(0, 3)
    : []

  return (
    <MainLayout>
      {/* ---------------------------------------------------------------- */}
      {/* BREAKING TICKER                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center gap-0 border-b border-line bg-[#0b1626] text-white">
        <span className="flex shrink-0 items-center gap-2 bg-rose-600 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em]">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
          Breaking
        </span>
        <Marquee duration={55} className="flex-1">
          {breakingTicker.map((headline) => (
            <span key={headline} className="flex items-center gap-3 whitespace-nowrap px-6 py-2.5 text-xs font-semibold text-slate-200">
              <FiRadio className="text-sky-400" />
              {headline}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ---------------------------------------------------------------- */}
      <PageHero
        badge={
          <>
            <FiRadio className="animate-pulse text-rose-400" /> Live newsroom · 40+ stories today
          </>
        }
        title="KT"
        highlight="News & Insights"
        description="Real-time global headlines, market moves and science breakthroughs — ranked on your device, delivered inside the chats you already use."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse the feed <FiChevronRight />
            </Button>
            <Button size="lg" variant="onDark" onClick={openDownloadModal}>
              Get the app <FiZap />
            </Button>
          </>
        }
        chips={[
          { icon: <FiShield />, label: 'Signed publisher feeds' },
          { icon: <FiEye />, label: 'No reading trackers' },
          { icon: <FiHeadphones />, label: '3-minute audio brief' },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-strong text-xs font-black text-white">KT</span>
                <span className="text-sm font-extrabold text-white">Newsroom stream</span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {newsArticles.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openArticle(item)}
                    className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-sky-400/40 hover:bg-white/[0.07]"
                  >
                    <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0">
                      <span className="line-clamp-2 block text-xs font-bold leading-snug text-white">{item.title}</span>
                      <span className="mt-1 block text-[10px] font-semibold text-slate-400">
                        {item.source} · {item.time}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
              {[
                { value: '450+', label: 'Sources' },
                { value: '4×', label: 'Daily briefs' },
                { value: '50+', label: 'Languages' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-base font-black text-white">{item.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">
          <FiSearch className="ml-3 shrink-0 text-xl text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              resetPaging()
            }}
            placeholder="Search headlines, sources or tags…"
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                resetPaging()
              }}
              className="mr-2 shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Clear
            </button>
          ) : null}
        </div>
        {searchQuery ? (
          <p className="mt-3 text-xs font-semibold text-sky-300">
            {filtered.length} {filtered.length === 1 ? 'story matches' : 'stories match'} “{searchQuery}”
          </p>
        ) : null}
      </PageHero>

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* ---------------------------------------------------------------- */}
      {/* TOP STORY SPOTLIGHT                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="spotlight" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Top story"
          title="The one everybody is reading right now"
          description="Our most-opened story of the last hour, with the desk’s other picks alongside it."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <Reveal from="up">
            <article className="group h-full overflow-hidden rounded-[28px] border border-line bg-cream shadow-card dark:bg-cream-2">
              <button type="button" onClick={() => openArticle(spotlight)} className="block w-full text-left">
                <div className="relative overflow-hidden">
                  <img
                    src={spotlight.image}
                    alt={spotlight.title}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-80"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                    <FiTrendingUp /> Trending #1
                  </span>
                </div>
              </button>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-bold">
                  <span className="text-brand-strong">{spotlight.category}</span>
                  <span className="text-muted">·</span>
                  <span className="text-muted">{spotlight.source}</span>
                  <span className="text-muted">·</span>
                  <span className="flex items-center gap-1 text-muted">
                    <FiClock className="text-[13px]" /> {spotlight.readMins} min read
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{spotlight.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body sm:text-[15px]">{spotlight.summary}</p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button onClick={() => openArticle(spotlight)}>
                    Read full story <FiChevronRight />
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(spotlight.id)}
                    className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-bold transition-colors ${
                      bookmarkedIds.includes(spotlight.id)
                        ? 'border-brand-strong bg-brand-soft text-brand-ink'
                        : 'border-line text-body hover:bg-surface-2'
                    }`}
                  >
                    <FiBookmark className={bookmarkedIds.includes(spotlight.id) ? 'fill-current' : ''} />
                    {bookmarkedIds.includes(spotlight.id) ? 'Saved' : 'Save'}
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
                    <FiEye /> {spotlight.reads} reads
                  </span>
                </div>
              </div>
            </article>
          </Reveal>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-muted">Editor’s picks</h3>
            {editorPicks.map((item, index) => (
              <Reveal key={item.id} from="up" delay={index * 0.06}>
                <button
                  type="button"
                  onClick={() => openArticle(item)}
                  className="group flex w-full items-start gap-4 rounded-[22px] border border-line bg-surface p-4 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-card"
                >
                  <img src={item.image} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="text-[11px] font-black uppercase tracking-wide text-brand-strong">{item.category}</span>
                    <span className="mt-1 line-clamp-2 block text-sm font-extrabold leading-snug text-ink group-hover:text-brand-strong">
                      {item.title}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold text-muted">
                      <FiClock /> {item.readMins} min · {item.reads} reads
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TRENDING RAIL                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Section id="trending" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Trending now"
          title="Most-read across every desk"
          description="Ranked by opens in the last six hours. Swipe to see the full list."
          align="left"
        />

        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
          {trending.map((item, index) => (
            <article
              key={item.id}
              className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card sm:w-[320px]"
            >
              <button type="button" onClick={() => openArticle(item)} className="block w-full text-left">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-xl bg-slate-950/70 text-sm font-black text-white backdrop-blur">
                    {index + 1}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-black uppercase tracking-wide text-brand-strong">{item.category}</span>
                  <h3 className="mt-2 line-clamp-2 text-sm font-extrabold leading-snug text-ink group-hover:text-brand-strong">
                    {item.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[11px] font-bold text-muted">
                    <span>{item.source}</span>
                    <span className="flex items-center gap-1">
                      <FiEye /> {item.reads}
                    </span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* MAIN FEED                                                         */}
      {/* ---------------------------------------------------------------- */}
      <div id="feed" className="scroll-mt-36">
        <FilterBar
          chips={chips}
          active={activeCategory}
          onChange={(label) => {
            setActiveCategory(label)
            resetPaging()
          }}
          query={searchQuery}
          onQuery={(value) => {
            setSearchQuery(value)
            resetPaging()
          }}
          placeholder="Search this feed…"
          right={
            <div className="flex shrink-0 items-center gap-1 rounded-xl border border-line bg-cream p-1 dark:bg-cream-2">
              {['Latest', 'Most read', 'Quick reads'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSortBy(option)
                    resetPaging()
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                    sortBy === option ? 'bg-brand-strong text-white' : 'text-body hover:text-ink'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          }
        />

        <Section className="bg-surface">
          <SectionHead
            eyebrow={`${filtered.length} stories`}
            title={activeCategory === 'All News' ? 'The full feed' : activeCategory}
            description="Tap any card to open the reader — full text, tags and related coverage, with no third-party trackers."
          />

          {visible.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<FiSearch />}
                title="No stories match those filters"
                description="Try a broader category, or clear the search term to see all 40 stories."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveCategory('All News')
                      resetPaging()
                    }}
                  >
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((article, index) => {
                const isBookmarked = bookmarkedIds.includes(article.id)
                return (
                  <Reveal key={article.id} from="up" delay={Math.min((index % 3) * 0.06, 0.18)} className="h-full">
                    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-cream shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card dark:bg-cream-2">
                      <button type="button" onClick={() => openArticle(article)} className="relative block overflow-hidden text-left">
                        <img
                          src={article.image}
                          alt=""
                          loading="lazy"
                          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {article.hot ? (
                          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                            🔥 Trending
                          </span>
                        ) : null}
                        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                          <FiClock /> {article.readMins} min
                        </span>
                      </button>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-brand-strong">{article.category}</span>
                          <span className="text-muted">{article.time}</span>
                        </div>

                        <h3
                          role="link"
                          tabIndex={0}
                          onClick={() => openArticle(article)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') openArticle(article)
                          }}
                          className="mt-2.5 cursor-pointer text-base font-extrabold leading-snug text-ink transition-colors hover:text-brand-strong"
                        >
                          {article.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-body">{article.summary}</p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[10px] font-bold text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                          <button
                            type="button"
                            onClick={() => openArticle(article)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-ink transition-colors hover:text-brand-strong"
                          >
                            Read story <FiChevronRight />
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleBookmark(article.id)}
                              aria-label={isBookmarked ? 'Remove bookmark' : 'Save article'}
                              className={`grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-surface-2 ${
                                isBookmarked ? 'text-brand-strong' : 'text-muted'
                              }`}
                            >
                              <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setToast(`Preview of “${article.title}” ready to share.`)}
                              aria-label="Share article"
                              className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                            >
                              <FiShare2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          )}

          {visibleCount < filtered.length ? (
            <div className="mt-12 flex flex-col items-center gap-3">
              <Button variant="secondary" size="lg" onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}>
                Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more stories
              </Button>
              <span className="text-xs font-semibold text-muted">
                Showing {visible.length} of {filtered.length}
              </span>
            </div>
          ) : null}
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* AUDIO DIGEST                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section id="digest" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="AI audio brief"
          title="Catch up in three minutes flat"
          description="KT AI Co-Pilot writes a script from the day’s verified stories and reads it out. Every segment links back to its source."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal from="up">
            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-strong text-2xl text-white shadow-brand">
                  <FiHeadphones />
                </span>
                <div className="min-w-0">
                  <span className="rounded-md bg-brand-soft px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                    Today’s edition
                  </span>
                  <h3 className="mt-1.5 text-lg font-extrabold text-ink">Executive briefing · 7 August</h3>
                  <p className="mt-1 text-xs text-body">Synthesised from 450+ verified sources in 12 languages.</p>
                </div>
              </div>

              <div className="mt-7">
                <div
                  className="h-2 w-full cursor-pointer overflow-hidden rounded-full bg-surface-2"
                  role="progressbar"
                  aria-valuenow={Math.round((elapsed / DIGEST_SECONDS) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Audio brief progress"
                >
                  <div
                    className="h-full rounded-full bg-brand-strong transition-[width] duration-300"
                    style={{ width: `${(elapsed / DIGEST_SECONDS) * 100}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-muted">
                  <span>{formatClock(elapsed)}</span>
                  <span>{formatClock(DIGEST_SECONDS)}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (elapsed >= DIGEST_SECONDS) setElapsed(0)
                    setPlaying((current) => !current)
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-strong px-6 text-sm font-bold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:bg-brand-strong-hover"
                >
                  {playing ? <FiPause /> : <FiPlay />}
                  {playing ? 'Pause brief' : elapsed > 0 ? 'Resume brief' : 'Play brief'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false)
                    setElapsed(0)
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 text-sm font-bold text-body transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  Restart
                </button>

                <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
                  <FiActivity className={playing ? 'animate-pulse text-emerald-500' : ''} />
                  {playing ? 'Now playing' : 'Paused'}
                </span>
              </div>

              <ul className="mt-7 space-y-2 border-t border-line pt-6">
                {newsArticles.slice(0, 4).map((item, index) => {
                  const segmentStart = (DIGEST_SECONDS / 4) * index
                  const isCurrent = elapsed >= segmentStart && elapsed < segmentStart + DIGEST_SECONDS / 4
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => openArticle(item)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                          isCurrent && playing ? 'border-brand/40 bg-brand-soft' : 'border-transparent hover:bg-surface-2'
                        }`}
                      >
                        <span className="w-10 shrink-0 text-[11px] font-black text-muted">{formatClock(segmentStart)}</span>
                        <span className="line-clamp-1 flex-1 text-xs font-bold text-ink">{item.title}</span>
                        <FiChevronRight className="shrink-0 text-muted" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {digestSchedule.map((slot, index) => (
              <Reveal key={slot.slot} from="up" delay={index * 0.05}>
                <div className="flex items-start gap-4 rounded-[22px] border border-line bg-surface p-5 shadow-soft">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xs font-black text-brand-ink">
                    {slot.time}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-ink">{slot.slot}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-body">{slot.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TOPICS                                                            */}
      {/* ---------------------------------------------------------------- */}
      <Section id="topics" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Personalise"
          title={`You follow ${followed.length} ${followed.length === 1 ? 'topic' : 'topics'}`}
          description="Tap to follow or unfollow. Ranking runs on your device, so this list never leaves your phone."
        />

        <Reveal from="up" className="mt-10">
          <div className="flex flex-wrap justify-center gap-2.5">
            {followTopics.map((topic) => {
              const active = followed.includes(topic)
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'border-brand-strong bg-brand-strong text-white shadow-brand'
                      : 'border-line bg-cream text-body hover:border-brand/40 hover:text-ink dark:bg-cream-2'
                  }`}
                >
                  {active ? <FiCheckCircle /> : <FiZap className="text-muted" />}
                  {topic}
                </button>
              )
            })}
          </div>

          <div className="mx-auto mt-8 max-w-2xl rounded-[24px] border border-line bg-cream p-6 text-center dark:bg-cream-2">
            <p className="text-sm font-semibold text-body">
              {followed.length === 0
                ? 'No topics followed — your feed will show a broad general mix until you pick a few.'
                : `Your feed is currently weighted toward ${followed.slice(0, 3).join(', ')}${
                    followed.length > 3 ? ` and ${followed.length - 3} more` : ''
                  }.`}
            </p>
            {followed.length > 0 ? (
              <button
                type="button"
                onClick={() => setFollowed([])}
                className="mt-4 text-xs font-bold text-brand-ink underline-offset-4 hover:underline"
              >
                Clear all topics
              </button>
            ) : null}
          </div>
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SOURCES                                                           */}
      {/* ---------------------------------------------------------------- */}
      <Section id="sources" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Verified publishers"
          title="Every feed is signed at the source"
          description="If a signature fails validation, the story is dropped before it reaches your device — no exceptions for a scoop."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newsSources.map((source, index) => (
            <Reveal key={source.name} from="up" delay={Math.min(index * 0.03, 0.2)} className="h-full">
              <div className="flex h-full items-center gap-4 rounded-[22px] border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-strong text-base font-black text-white">
                  {source.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-extrabold text-ink">{source.name}</h3>
                    {source.verified ? <FiCheckCircle className="shrink-0 text-sm text-brand-strong" /> : null}
                  </div>
                  <p className="truncate text-[11px] font-semibold text-muted">{source.focus}</p>
                  <p className="mt-0.5 text-[11px] font-bold text-brand-ink">{source.articles} stories this month</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* READING LIST                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section id="saved" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Reading list"
          title={`${bookmarked.length} ${bookmarked.length === 1 ? 'story' : 'stories'} saved for later`}
          description="Bookmarks sync encrypted across your devices and stay readable offline, images included."
        />

        <div className="mt-12">
          {bookmarked.length === 0 ? (
            <EmptyState
              icon={<FiBookmark />}
              title="Your reading list is empty"
              description="Tap the bookmark icon on any story and it lands here, cached for offline reading."
              action={
                <Button variant="secondary" onClick={() => document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })}>
                  Browse the feed
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarked.map((item, index) => (
                <Reveal key={item.id} from="up" delay={index * 0.05} className="h-full">
                  <div className="flex h-full flex-col rounded-[22px] border border-line bg-cream p-5 shadow-soft dark:bg-cream-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[11px] font-black uppercase tracking-wide text-brand-strong">{item.category}</span>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(item.id)}
                        aria-label="Remove from reading list"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-strong transition-colors hover:bg-surface-2"
                      >
                        <FiBookmark className="fill-current" />
                      </button>
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-sm font-extrabold leading-snug text-ink">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-body">{item.summary}</p>

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
                        <FiClock /> {item.readMins} min · offline ready
                      </span>
                      <button
                        type="button"
                        onClick={() => openArticle(item)}
                        className="text-xs font-bold text-brand-ink hover:text-brand-strong"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FACT CHECK                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section id="factcheck" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Trust layer"
          title="Claims get a verdict, not a shrug"
          description="Widely-forwarded claims are routed to partner fact-checking organisations. The verdict travels with the claim wherever it goes."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {factChecks.map((item, index) => (
            <Reveal key={item.claim} from="up" delay={index * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wide ${
                    verdictStyles[item.tone]
                  }`}
                >
                  {verdictIcons[item.tone]} {item.verdict}
                </span>

                <p className="mt-4 text-sm font-extrabold leading-snug text-ink">{item.claim}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{item.detail}</p>

                <span className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-[11px] font-bold text-muted">
                  <FiShield /> Reviewed by an independent partner desk
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FEATURES + HOW IT WORKS                                           */}
      {/* ---------------------------------------------------------------- */}
      <Section id="features" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="What you get"
          title="A newsroom that respects your attention"
          description="Nine things KT News does differently from a conventional feed."
        />

        <FeatureGrid
          className="mt-12"
          items={newsFeatures.map((item, index) => ({ ...item, icon: FEATURE_ICONS[index] }))}
        />

        <div className="mt-20">
          <SectionHead eyebrow="How it works" title="From topic picks to a personal front page in four steps" />
          <Steps className="mt-12" items={newsSteps.map((item, index) => ({ ...item, icon: STEP_ICONS[index] }))} />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TESTIMONIALS                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead eyebrow="Readers" title="What people say after a month" description="Verified reviews from the app stores and in-app surveys." />
        <Testimonials className="mt-12" items={newsTestimonials} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* NEWSLETTER                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section container={false} className="bg-surface">
        <Container maxW="max-w-3xl">
          <Reveal from="up" className="rounded-[28px] border border-line bg-cream p-7 text-center shadow-card sm:p-10 dark:bg-cream-2">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-strong text-2xl text-white shadow-brand">
              <FiMail />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">Get the brief in your inbox too</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-body">
              One email each morning with the five stories that matter. No tracking pixels, unsubscribe in one tap.
            </p>

            <form onSubmit={handleSubscribe} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-12 w-full rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink outline-none transition-colors focus:border-brand/60 placeholder:font-medium placeholder:text-muted"
              />
              <Button type="submit" className="shrink-0">
                Subscribe <FiChevronRight />
              </Button>
            </form>

            <p className="mt-4 text-[11px] font-semibold text-muted">Joined by 2.4 million readers across 120 countries.</p>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="faq" container={false} className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Questions readers actually ask" description="Ten answers about sourcing, privacy and how the feed is put together." />
          <div className="mt-12">
            <FaqAccordion items={newsFaqs} placeholder="Search the FAQ…" />
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA + RELATED                                                     */}
      {/* ---------------------------------------------------------------- */}
      <CtaBand
        eyebrow="Start reading"
        title="Your front page, rebuilt around what you actually care about"
        description="Follow a few topics and KT News does the rest — ranked on your device, delivered where you already chat."
        actions={
          <>
            <Button size="lg" variant="white" onClick={openDownloadModal}>
              Download KT Messengers
            </Button>
            <Button size="lg" variant="onDark" onClick={() => document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore the feed
            </Button>
          </>
        }
        points={['No reading trackers', 'Signed publisher feeds', 'Offline reading vault', 'Free forever']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More of KT Messengers" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* READER MODAL                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={Boolean(readingArticle)}
        onClose={() => setReadingArticle(null)}
        eyebrow={readingArticle?.category}
        title={readingArticle?.source}
        size="lg"
        footer={
          readingArticle ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleBookmark(readingArticle.id)}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-xs font-bold transition-colors ${
                  bookmarkedIds.includes(readingArticle.id)
                    ? 'border-brand-strong bg-brand-soft text-brand-ink'
                    : 'border-line text-body hover:bg-surface-2'
                }`}
              >
                <FiBookmark className={bookmarkedIds.includes(readingArticle.id) ? 'fill-current' : ''} />
                {bookmarkedIds.includes(readingArticle.id) ? 'Saved to list' : 'Save for later'}
              </button>

              <Button onClick={() => setToast(`“${readingArticle.title}” shared to your chat.`)}>
                Share to chat <FiShare2 />
              </Button>
            </div>
          ) : null
        }
      >
        {readingArticle ? (
          <article>
            <h2 className="text-2xl font-extrabold leading-tight text-ink">{readingArticle.title}</h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line pb-4 text-[11px] font-bold text-muted">
              <span>By {readingArticle.author}</span>
              <span>·</span>
              <span>{readingArticle.time}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <FiClock /> {readingArticle.readMins} min read
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <FiEye /> {readingArticle.reads} reads
              </span>
            </div>

            <img
              src={readingArticle.image}
              alt=""
              className="mt-5 h-56 w-full rounded-2xl object-cover sm:h-72"
            />

            <p className="mt-5 text-base font-semibold leading-relaxed text-ink">{readingArticle.summary}</p>

            {readingArticle.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 text-sm leading-relaxed text-body">
                {paragraph}
              </p>
            ))}

            <div className="mt-6 flex flex-wrap gap-2">
              {readingArticle.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold text-brand-ink">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-cream p-4 dark:bg-cream-2">
              <FiShield className="mt-0.5 shrink-0 text-lg text-brand-strong" />
              <p className="text-xs leading-relaxed text-body">
                Rendered in the sanitised reader: third-party trackers, auto-playing scripts and cross-site cookies are
                stripped before this page reaches your device.
              </p>
            </div>

            {relatedToReading.length > 0 ? (
              <div className="mt-8 border-t border-line pt-6">
                <h4 className="text-xs font-black uppercase tracking-[0.16em] text-muted">More in {readingArticle.category}</h4>
                <ul className="mt-4 space-y-2">
                  {relatedToReading.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => openArticle(item)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-line p-3 text-left transition-colors hover:border-brand/40 hover:bg-surface-2"
                      >
                        <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                        <span className="line-clamp-2 flex-1 text-xs font-bold text-ink">{item.title}</span>
                        <FiChevronRight className="shrink-0 text-muted" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ) : null}
      </Modal>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}

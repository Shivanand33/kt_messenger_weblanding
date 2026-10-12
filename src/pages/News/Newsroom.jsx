import { useEffect, useMemo, useRef, useState } from 'react'
import { FiArrowUpRight, FiClock, FiDownload, FiRefreshCw, FiSearch, FiX } from 'react-icons/fi'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { CtaBand } from '../../components/feature/CtaBand'
import { useLanguage } from '../../context/LanguageContext'
import { useModal } from '../../context/ModalContext'
import { fill } from '../../i18n/fill'
import { api } from '../../services/apiClient'

/**
 * The News page: one newsroom, nothing else.
 *
 * Every story here is a real one, pulled live from the KT news service while
 * the page is open. The page used to be a marketing page illustrated with
 * written sample articles — a spotlight, a trending rail, a filterable demo
 * feed, an audio brief, fact checks, invented publishers — and all of it was
 * removed: a newsroom should not be illustrated with headlines nobody
 * published.
 *
 * Each card opens the publisher's own article. We show the headline, one line
 * of summary and the picture; the full text stays with the publisher it
 * belongs to.
 *
 * The page is a front page, not the whole wire: it leads with the story of the
 * moment, prints a front page of the rest, and sends anyone who wants more to
 * the app, where the full feed lives.
 */

/**
 * How many stories to hold. Far more than the front page prints, because the
 * publisher chips filter this whole set — picking a masthead has to be able to
 * show everything it filed, not only what fitted on the front page.
 */
const LIMIT = 100

/** The front page: one lead, three beside it, a grid under them. */
const SIDE_COUNT = 3
const GRID_COUNT = 12

/** Re-ask while the tab stays open, so a long-lived page does not go stale. */
const REFRESH_MS = 5 * 60 * 1000

/* ── helpers ──────────────────────────────────────────────────────────── */

/**
 * "12 mins ago" from a timestamp. Returns null for anything unparseable or in
 * the future, and the caller then shows nothing rather than a wrong age.
 */
function timeAgo(iso, t) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return null
  const seconds = Math.floor((Date.now() - then) / 1000)
  if (seconds < 0) return null
  if (seconds < 60) return t('Just now')
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins} ${mins === 1 ? t('min ago') : t('mins ago')}`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? t('hour ago') : t('hours ago')}`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? t('day ago') : t('days ago')}`
}

/**
 * Today's date for the dateline, written the way the reader's language writes
 * it. An unknown or malformed language tag makes toLocaleDateString throw, so
 * it falls back to the browser's own formatting rather than losing the line.
 */
function dateline(lang) {
  const now = new Date()
  const iso = now.toISOString().slice(0, 10)
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  try {
    return { iso, label: now.toLocaleDateString(lang || undefined, options) }
  } catch {
    return { iso, label: now.toLocaleDateString(undefined, options) }
  }
}

/** A publisher's picture that fails to load leaves a broken frame; drop it instead. */
function Thumb({ article, className }) {
  const [failed, setFailed] = useState(false)
  if (!article.image || failed) return null
  return (
    <img
      src={article.image}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

/**
 * Publisher and age, the line under every headline. `onImage` is for the
 * featured card, where this sits over the photograph rather than on a surface.
 */
function Meta({ article, t, className = '', onImage = false }) {
  const age = timeAgo(article.publishedAt, t)
  return (
    <div className={`flex items-center gap-2 text-[11px] font-bold ${onImage ? 'text-white/75' : 'text-muted'} ${className}`}>
      {/* A masthead is a name, not copy: never translated. */}
      {article.source ? <span className="truncate">{article.source}</span> : null}
      {article.source && age ? <span aria-hidden="true">·</span> : null}
      {age ? (
        <span className="flex shrink-0 items-center gap-1">
          <FiClock aria-hidden="true" /> {age}
        </span>
      ) : null}
    </div>
  )
}

/* ── data ─────────────────────────────────────────────────────────────── */

/**
 * Fetches the headlines and keeps them fresh.
 *
 * `sources` is who filed them, busiest first, counted by the API over exactly
 * the articles it returned — so a publisher's number always matches what
 * filtering by it will show.
 */
function useLiveNews() {
  const [articles, setArticles] = useState([])
  const [sources, setSources] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | empty
  const [refreshing, setRefreshing] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)
  // Survives re-renders so an in-flight response from before an unmount, or
  // from a refresh triggered twice, cannot overwrite newer state.
  const live = useRef(true)

  useEffect(() => {
    live.current = true
    return () => {
      live.current = false
    }
  }, [])

  const load = async (isRefresh) => {
    if (isRefresh) setRefreshing(true)
    try {
      const data = await api.listLiveNews(LIMIT)
      if (!live.current) return
      const rows = Array.isArray(data?.articles) ? data.articles : []
      setArticles(rows)
      setSources(Array.isArray(data?.sources) ? data.sources : [])
      setUpdatedAt(new Date().toISOString())
      setStatus(rows.length ? 'ready' : 'empty')
    } catch {
      // A wire going down must not blank the page. Keep whatever is on screen;
      // only a first failure leaves the page with nothing to show.
      if (live.current) setStatus((current) => (current === 'ready' ? 'ready' : 'empty'))
    } finally {
      if (live.current) setRefreshing(false)
    }
  }

  useEffect(() => {
    load(false)
    const timer = setInterval(() => load(true), REFRESH_MS)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { articles, sources, status, refreshing, updatedAt, refresh: () => load(true) }
}

/* ── cards ────────────────────────────────────────────────────────────── */

const CARD =
  'group block overflow-hidden rounded-[24px] border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand-strong/30 hover:shadow-card'

/**
 * The story of the moment, printed the way a front page prints it: the
 * photograph fills the card and the headline sits on top of it.
 *
 * The dark gradient is not decoration — it is what keeps white text legible
 * over a photograph nobody chose for its contrast. It stays even when the
 * picture is missing, so the card reads the same either way.
 */
function FeaturedStory({ article, t }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-[28px] border border-line bg-slate-900 shadow-card transition-all duration-300 hover:-translate-y-1 sm:min-h-[30rem]"
    >
      <Thumb
        article={article}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/10"
        aria-hidden="true"
      />

      <div className="relative p-6 sm:p-9">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur">
          {t('Top story')}
        </span>
        <h2 className="mt-4 text-2xl font-black leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-[2.6rem]">
          {article.title}
        </h2>
        {article.summary ? (
          <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {article.summary}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
          <Meta article={article} t={t} onImage />
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-white">
            {t('Read')} <FiArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </div>
    </a>
  )
}

/** Compact row for the column beside the lead story. */
function StoryRow({ article, t }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className={`${CARD} flex gap-4 p-3 shadow-soft`}>
      <Thumb article={article} className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover" />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-ink group-hover:text-brand-strong">
          {article.title}
        </h3>
        <Meta article={article} t={t} className="mt-2" />
      </div>
    </a>
  )
}

/** The repeating card in the main grid. */
function StoryCard({ article, t }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className={`${CARD} flex h-full flex-col shadow-soft`}>
      <div className="overflow-hidden">
        <Thumb
          article={article}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-3 text-[15px] font-extrabold leading-snug text-ink group-hover:text-brand-strong">
          {article.title}
        </h3>
        {article.summary ? <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{article.summary}</p> : null}
        <Meta article={article} t={t} className="mt-auto pt-4" />
      </div>
    </a>
  )
}

/* ── page ─────────────────────────────────────────────────────────────── */

export function Newsroom() {
  const { t, lang } = useLanguage()
  const { articles, sources, status, refreshing, updatedAt, refresh } = useLiveNews()

  const { openDownloadModal } = useModal()
  const today = useMemo(() => dateline(lang), [lang])
  // Counted from the stories actually held, not from the chips: the API sends
  // only the busiest mastheads, so the chips are a shortlist, not the total.
  const publisherCount = useMemo(
    () => new Set(articles.map((a) => a.source).filter(Boolean)).size,
    [articles],
  )
  const [publisher, setPublisher] = useState(null) // null = every publisher
  const [query, setQuery] = useState('')

  // A publisher that disappears from a refreshed feed would otherwise filter
  // the page down to nothing with no obvious way back.
  useEffect(() => {
    if (publisher && sources.length && !sources.some((s) => s.name === publisher)) setPublisher(null)
  }, [sources, publisher])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return articles.filter((article) => {
      if (publisher && article.source !== publisher) return false
      if (!term) return true
      return (
        article.title.toLowerCase().includes(term) ||
        article.summary.toLowerCase().includes(term) ||
        article.source.toLowerCase().includes(term)
      )
    })
  }, [articles, publisher, query])

  const loading = status === 'loading'
  const [lead, ...rest] = filtered
  const side = rest.slice(0, SIDE_COUNT)
  const grid = rest.slice(SIDE_COUNT, SIDE_COUNT + GRID_COUNT)
  // What the front page could not fit. The app is where the rest of it is, so
  // this number is the honest reason to go and get the app.
  const remaining = filtered.length - (lead ? 1 : 0) - side.length - grid.length

  return (
    <div className="bg-cream dark:bg-cream-2">
      {/* ---------------------------------------------------------------- */}
      {/* MASTHEAD                                                          */}
      {/* ---------------------------------------------------------------- */}
      <header className="border-b border-line bg-surface">
        {/* Dateline strip — status, today's date, refresh. The thin rule above
            the masthead is what makes a news page read as a news page. */}
        <div className="border-b border-line">
          <Container>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="flex min-w-0 items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="shrink-0">{t('Live')}</span>
                {updatedAt ? (
                  <span className="truncate normal-case tracking-normal">
                    <span aria-hidden="true">· </span>
                    {t('Updated')} {timeAgo(updatedAt, t)}
                  </span>
                ) : null}
              </span>

              <time dateTime={today.iso} className="hidden shrink-0 text-[11px] font-bold text-muted md:block">
                {today.label}
              </time>

              <button
                type="button"
                onClick={refresh}
                disabled={refreshing || loading}
                className="inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand-strong disabled:opacity-60"
              >
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
                {t('Refresh')}
              </button>
            </div>
          </Container>
        </div>

        {/* Masthead — title on the left, the tools for it on the right. */}
        <Container className="py-9 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
            <div className="min-w-0">
              <h1 className="text-[2.75rem] font-black leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                KT <span className="text-brand-strong">{t('News')}</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {t('Headlines as they break, from newsrooms around the world. Every story opens at the publisher that wrote it.')}
              </p>
            </div>

            <div className="lg:pb-1">
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-cream p-2 transition-colors focus-within:border-brand-strong/40 dark:bg-cream-2">
                <FiSearch className="ml-2 shrink-0 text-lg text-muted" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('Search headlines and publishers…')}
                  aria-label={t('Search headlines and publishers…')}
                  className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-muted"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('Clear search')}
                    className="shrink-0 rounded-xl p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    <FiX aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              {status === 'ready' ? (
                <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
                  {fill(t('{stories} stories · {publishers} publishers'), {
                    stories: articles.length,
                    publishers: publisherCount,
                  })}
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* PUBLISHERS — the real mastheads filing right now                  */}
      {/* ---------------------------------------------------------------- */}
      {sources.length ? (
        <div className="sticky top-16 z-40 border-b border-line bg-cream/90 backdrop-blur-xl lg:top-[72px] dark:bg-cream-2/90">
          <Container>
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3" role="group" aria-label={t('Filter by publisher')}>
              <Chip active={!publisher} count={articles.length} label={t('All')} onClick={() => setPublisher(null)} />
              {sources.map((source) => (
                <Chip
                  key={source.name}
                  active={publisher === source.name}
                  count={source.count}
                  label={source.name}
                  onClick={() => setPublisher(publisher === source.name ? null : source.name)}
                />
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* STORIES                                                           */}
      {/* ---------------------------------------------------------------- */}
      <Container className="pb-20 pt-10 sm:pt-14">
        {loading ? <Skeleton /> : null}

        {!loading && status === 'empty' ? (
          <Notice
            title={t('No headlines right now')}
            body={t('The newsroom could not be reached. It will try again on its own, or you can refresh.')}
            action={
              <button
                type="button"
                onClick={refresh}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-strong px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-brand"
              >
                <FiRefreshCw aria-hidden="true" /> {t('Refresh')}
              </button>
            }
          />
        ) : null}

        {!loading && status === 'ready' && !filtered.length ? (
          <Notice
            title={t('Nothing matches that')}
            body={t('Try a different publisher, or clear the search to see everything again.')}
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setPublisher(null)
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-strong px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-brand"
              >
                {t('Show everything')}
              </button>
            }
          />
        ) : null}

        {!loading && lead ? (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Reveal from="up">
                <FeaturedStory article={lead} t={t} />
              </Reveal>
              {side.length ? (
                <div className="grid content-start gap-4">
                  {side.map((article, index) => (
                    <Reveal key={article.id} from="up" delay={0.05 * index}>
                      <StoryRow article={article} t={t} />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>

            {grid.length ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {grid.map((article, index) => (
                  <Reveal key={article.id} from="up" delay={Math.min(0.04 * index, 0.2)} className="h-full">
                    <StoryCard article={article} t={t} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* THE REST OF THE WIRE — only the app has it                        */}
      {/* ---------------------------------------------------------------- */}
      {!loading && status === 'ready' ? (
        <div className="mt-20">
          {/* Wrapped in t() at the call site even though CtaBand translates
              these itself: that is what puts them in front of the string
              scanner in scripts/i18n-translate.mjs, which only sees literals
              inside t(). Same pattern as the other pages' CTA bands. */}
          <CtaBand
            eyebrow={t('Keep reading')}
            title={t('The rest of the newsroom is in the app')}
            description={t('This page prints the front page. KT Messenger carries the whole wire as it breaks, ranked for you, inside the chats you already use.')}
            actions={
              <div className="flex flex-col items-center gap-3">
                <Button size="lg" variant="primary" onClick={openDownloadModal}>
                  {t('Download KT Messenger')} <FiDownload />
                </Button>
                {remaining > 0 ? (
                  <p className="text-xs font-bold text-slate-400">
                    {fill(t('{count} more stories waiting right now.'), { count: remaining })}
                  </p>
                ) : null}
              </div>
            }
          />
        </div>
      ) : null}
    </div>
  )
}

/* ── small pieces ─────────────────────────────────────────────────────── */

function Chip({ active, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
        active
          ? 'border-transparent bg-brand-strong text-white shadow-brand'
          : 'border-line bg-surface text-body hover:border-brand-strong/30 hover:text-ink'
      }`}
    >
      {label}
      <span className={active ? 'text-white/70' : 'text-muted'}>{count}</span>
    </button>
  )
}

function Notice({ title, body, action }) {
  return (
    <div className="mx-auto max-w-md rounded-[28px] border border-line bg-surface px-8 py-14 text-center shadow-soft">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
      {action}
    </div>
  )
}

function Skeleton() {
  return (
    <div aria-hidden="true">
      <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <div className="h-[420px] animate-pulse rounded-[24px] border border-line bg-surface" />
        <div className="grid content-start gap-4">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="h-[96px] animate-pulse rounded-[24px] border border-line bg-surface" />
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="h-[300px] animate-pulse rounded-[24px] border border-line bg-surface" />
        ))}
      </div>
    </div>
  )
}

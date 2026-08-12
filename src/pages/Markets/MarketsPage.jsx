import { useEffect, useMemo, useState } from 'react'
import {
  FiActivity,
  FiAlertCircle,
  FiArrowDown,
  FiArrowUp,
  FiBarChart2,
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiChevronRight,
  FiCompass,
  FiDownload,
  FiGrid,
  FiInfo,
  FiLayers,
  FiMessageSquare,
  FiPieChart,
  FiPlus,
  FiRefreshCw,
  FiRepeat,
  FiSearch,
  FiShare2,
  FiShield,
  FiStar,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
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
import { Sparkline } from '../../components/feature/Sparkline'
import { useModal } from '../../context/ModalContext'
import {
  economicCalendar,
  fxRates,
  marketAssets,
  marketCategories,
  marketFaqs,
  marketLearn,
  marketSteps,
  marketTestimonials,
  marketTools,
} from './marketsData'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'movers', label: 'Movers', icon: <FiTrendingUp /> },
  { id: 'watchlist', label: 'Watchlist', icon: <FiStar /> },
  { id: 'heatmap', label: 'Heatmap', icon: <FiGrid /> },
  { id: 'converter', label: 'Converter', icon: <FiRepeat /> },
  { id: 'portfolio', label: 'Portfolio', icon: <FiPieChart /> },
  { id: 'alerts', label: 'Alerts', icon: <FiBell /> },
  { id: 'calendar', label: 'Calendar', icon: <FiCalendar /> },
  { id: 'tools', label: 'Tools', icon: <FiZap /> },
  { id: 'learn', label: 'Learn', icon: <FiBookOpen /> },
  { id: 'faq', label: 'FAQ', icon: <FiMessageSquare /> },
]

const STATS = [
  { value: 44, label: 'Instruments tracked', icon: <FiLayers />, hint: 'Crypto, equities, indices, FX and commodities.' },
  { value: 10, label: 'Currencies in converter', icon: <FiRepeat />, hint: 'Mid-market rates with no spread added.' },
  { value: 100, label: 'Watchlist slots', icon: <FiStar />, hint: 'Synced encrypted across all your devices.' },
  { value: 24, suffix: '/7', label: 'Alert coverage', icon: <FiBell />, hint: 'Crypto never sleeps — neither do alerts.' },
]

const TOOL_ICONS = [
  <FiStar key="star" />,
  <FiBell key="bell" />,
  <FiRepeat key="repeat" />,
  <FiPieChart key="pie" />,
  <FiCalendar key="cal" />,
  <FiGrid key="grid" />,
  <FiBarChart2 key="bar" />,
  <FiUsers key="users" />,
  <FiDownload key="download" />,
]

const STEP_ICONS = [<FiSearch key="a" />, <FiStar key="b" />, <FiBell key="c" />, <FiShare2 key="d" />]

const RELATED = [
  { to: '/wallet', label: 'Wallet', desc: 'Send money and hold crypto with passkey security.', icon: <FiZap /> },
  { to: '/news', label: 'News', desc: 'Market headlines and a three-minute audio brief.', icon: <FiActivity /> },
  { to: '/marketplace', label: 'Marketplace', desc: 'Buy from verified stores inside a chat.', icon: <FiGrid /> },
  { to: '/notes', label: 'Notes', desc: 'Keep trade journals in an encrypted vault.', icon: <FiBookOpen /> },
]

const CURRENCY_CODES = Object.keys(fxRates)

const IMPACT_STYLES = {
  High: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300',
  Medium:
    'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
  Low: 'border-line bg-cream text-muted dark:bg-cream-2',
}

const formatPrice = (asset) => {
  const value = asset.price.toLocaleString('en-US', {
    minimumFractionDigits: asset.decimals,
    maximumFractionDigits: asset.decimals,
  })
  return `${asset.prefix ?? ''}${value}${asset.suffix ?? ''}`
}

const formatChange = (change) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`

const openPriceOf = (asset) => asset.price / (1 + asset.change / 100)

const heatClass = (change) => {
  if (change >= 3) return 'bg-emerald-600 text-white'
  if (change >= 1) return 'bg-emerald-500/80 text-white'
  if (change > 0) return 'bg-emerald-500/30 text-emerald-900 dark:text-emerald-100'
  if (change === 0) return 'bg-slate-400/25 text-ink'
  if (change > -1) return 'bg-rose-500/30 text-rose-900 dark:text-rose-100'
  if (change > -3) return 'bg-rose-500/80 text-white'
  return 'bg-rose-600 text-white'
}

function ChangeBadge({ change, className = '' }) {
  const up = change >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
        up
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-300'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-500/12 dark:text-rose-300'
      } ${className}`}
    >
      {up ? <FiTrendingUp /> : <FiTrendingDown />}
      {formatChange(change)}
    </span>
  )
}

export function MarketsPage() {
  const { openDownloadModal } = useModal()

  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('change')
  const [sortDir, setSortDir] = useState('desc')
  const [watchlist, setWatchlist] = useState(['BTC', 'NIFTY 50', 'NVDA', 'GOLD'])
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  const [fxAmount, setFxAmount] = useState('1000')
  const [fxFrom, setFxFrom] = useState('USD')
  const [fxTo, setFxTo] = useState('INR')

  const [holdings, setHoldings] = useState([
    { symbol: 'BTC', qty: 0.35 },
    { symbol: 'NVDA', qty: 40 },
    { symbol: 'RELIANCE', qty: 25 },
  ])
  const [holdingSymbol, setHoldingSymbol] = useState('ETH')
  const [holdingQty, setHoldingQty] = useState('1')

  const [alerts, setAlerts] = useState([
    { id: 1, symbol: 'BTC', direction: 'above', target: 70000 },
    { id: 2, symbol: 'NIFTY 50', direction: 'below', target: 24000 },
  ])
  const [alertSymbol, setAlertSymbol] = useState('ETH')
  const [alertDirection, setAlertDirection] = useState('above')
  const [alertTarget, setAlertTarget] = useState('4000')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const assetBySymbol = useMemo(
    () => Object.fromEntries(marketAssets.map((asset) => [asset.symbol, asset])),
    [],
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = marketAssets.filter((asset) => {
      const matchesCategory = activeCategory === 'All' || asset.category === activeCategory
      const matchesTerm =
        !term || asset.name.toLowerCase().includes(term) || asset.symbol.toLowerCase().includes(term)
      return matchesCategory && matchesTerm
    })

    const direction = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name) * direction
      if (sortKey === 'price') return (a.price - b.price) * direction
      return (a.change - b.change) * direction
    })
  }, [activeCategory, query, sortKey, sortDir])

  const gainers = useMemo(() => [...marketAssets].sort((a, b) => b.change - a.change).slice(0, 5), [])
  const losers = useMemo(() => [...marketAssets].sort((a, b) => a.change - b.change).slice(0, 5), [])
  const widestRange = useMemo(
    () => [...marketAssets].sort((a, b) => (b.high - b.low) / b.low - (a.high - a.low) / a.low).slice(0, 5),
    [],
  )

  const chips = marketCategories.map((label) => ({
    label,
    count: label === 'All' ? marketAssets.length : marketAssets.filter((asset) => asset.category === label).length,
  }))

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDir(key === 'name' ? 'asc' : 'desc')
  }

  const toggleWatch = (symbol) => {
    const watched = watchlist.includes(symbol)
    setWatchlist(watched ? watchlist.filter((item) => item !== symbol) : [...watchlist, symbol])
    setToast(watched ? `${symbol} removed from your watchlist.` : `${symbol} added to your watchlist.`)
  }

  // ---------------------------------------------------------------- FX maths
  const parsedAmount = parseFloat(fxAmount)
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount >= 0
  const converted = amountValid ? (parsedAmount / fxRates[fxFrom].rate) * fxRates[fxTo].rate : 0
  const unitRate = fxRates[fxTo].rate / fxRates[fxFrom].rate

  const swapCurrencies = () => {
    setFxFrom(fxTo)
    setFxTo(fxFrom)
  }

  // --------------------------------------------------------- Portfolio maths
  const portfolio = useMemo(() => {
    const rows = holdings
      .map((holding) => {
        const asset = assetBySymbol[holding.symbol]
        if (!asset) return null
        const value = asset.price * holding.qty
        const dayPL = (asset.price - openPriceOf(asset)) * holding.qty
        return { ...holding, asset, value, dayPL }
      })
      .filter(Boolean)

    const total = rows.reduce((sum, row) => sum + row.value, 0)
    const dayPL = rows.reduce((sum, row) => sum + row.dayPL, 0)
    return { rows, total, dayPL }
  }, [holdings, assetBySymbol])

  const addHolding = (event) => {
    event.preventDefault()
    const qty = parseFloat(holdingQty)
    if (!Number.isFinite(qty) || qty <= 0) {
      setToast('Enter a quantity greater than zero.')
      return
    }
    setHoldings((current) => {
      const existing = current.find((item) => item.symbol === holdingSymbol)
      if (existing) {
        return current.map((item) => (item.symbol === holdingSymbol ? { ...item, qty: item.qty + qty } : item))
      }
      return [...current, { symbol: holdingSymbol, qty }]
    })
    setToast(`${qty} ${holdingSymbol} added to the portfolio view.`)
    setHoldingQty('1')
  }

  // ------------------------------------------------------------ Alert maths
  const addAlert = (event) => {
    event.preventDefault()
    const target = parseFloat(alertTarget)
    if (!Number.isFinite(target) || target <= 0) {
      setToast('Enter a target price greater than zero.')
      return
    }
    setAlerts((current) => [...current, { id: Date.now(), symbol: alertSymbol, direction: alertDirection, target }])
    setToast(`Alert set: ${alertSymbol} ${alertDirection} ${target}.`)
  }

  return (
    <MainLayout>
      {/* ---------------------------------------------------------------- */}
      {/* PRICE TICKER TAPE                                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center border-b border-line bg-[#0b1626] text-white">
        <span className="flex shrink-0 items-center gap-2 bg-brand-strong px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em]">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
          Live
        </span>
        <Marquee duration={60} className="flex-1">
          {marketAssets.slice(0, 18).map((asset) => (
            <span key={asset.symbol} className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 text-xs font-bold">
              <span className="text-slate-400">{asset.symbol}</span>
              <span className="text-white">{formatPrice(asset)}</span>
              <span className={asset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {formatChange(asset.change)}
              </span>
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
            <FiTrendingUp className="text-emerald-400" /> 44 instruments · 5 asset classes
          </>
        }
        title="KT"
        highlight="Markets"
        description="Track equities, crypto, indices, currencies and commodities from the same app you chat in — with alerts that arrive as messages, not another push notification."
        actions={
          <>
            <Button
              size="lg"
              variant="white"
              onClick={() => document.getElementById('watchlist')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Open the watchlist <FiChevronRight />
            </Button>
            <Button size="lg" variant="onDark" onClick={openDownloadModal}>
              Get the app <FiZap />
            </Button>
          </>
        }
        chips={[
          { icon: <FiShield />, label: 'Encrypted watchlists' },
          { icon: <FiRepeat />, label: 'Mid-market FX, zero spread' },
          { icon: <FiBell />, label: 'Alerts delivered in chat' },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm font-extrabold text-white">Index snapshot</span>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Streaming
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {marketAssets
                .filter((asset) => asset.category === 'Indices')
                .slice(0, 4)
                .map((asset) => (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => setSelected(asset)}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-sky-400/40 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400">{asset.symbol}</span>
                      <span className={asset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatChange(asset.change)}
                      </span>
                    </div>
                    <div className="mt-1 text-base font-black text-white">{formatPrice(asset)}</div>
                    <Sparkline data={asset.series} up={asset.change >= 0} width={120} height={28} className="mt-2 w-full" />
                  </button>
                ))}
            </div>

            <p className="mt-4 border-t border-white/10 pt-4 text-[10px] font-semibold leading-relaxed text-slate-400">
              Illustrative sample data for this product page. Live quotes inside the app carry a source and timestamp.
            </p>
          </div>
        }
      >
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">
          <FiSearch className="ml-3 shrink-0 text-xl text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Bitcoin, NIFTY, USD/INR, Gold…"
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-2 shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Clear
            </button>
          ) : null}
        </div>
        {query ? (
          <p className="mt-3 text-xs font-semibold text-sky-300">
            {filtered.length} {filtered.length === 1 ? 'instrument matches' : 'instruments match'} “{query}”
          </p>
        ) : null}
      </PageHero>

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* ---------------------------------------------------------------- */}
      {/* MOVERS                                                            */}
      {/* ---------------------------------------------------------------- */}
      <Section id="movers" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Today’s movers"
          title="What is actually moving right now"
          description="The strongest and weakest instruments of the session, plus the widest intraday ranges."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            { title: 'Top gainers', icon: <FiTrendingUp />, rows: gainers, tone: 'up' },
            { title: 'Top losers', icon: <FiTrendingDown />, rows: losers, tone: 'down' },
            { title: 'Widest ranges', icon: <FiActivity />, rows: widestRange, tone: 'neutral' },
          ].map((group, groupIndex) => (
            <Reveal key={group.title} from="up" delay={groupIndex * 0.08} className="h-full">
              <div className="flex h-full flex-col rounded-[26px] border border-line bg-cream p-5 shadow-soft dark:bg-cream-2">
                <div className="flex items-center gap-2.5 border-b border-line pb-4">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-2xl text-lg ${
                      group.tone === 'up'
                        ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                        : group.tone === 'down'
                          ? 'bg-rose-500/12 text-rose-600 dark:text-rose-400'
                          : 'bg-brand-soft text-brand-ink'
                    }`}
                  >
                    {group.icon}
                  </span>
                  <h3 className="text-base font-extrabold text-ink">{group.title}</h3>
                </div>

                <ul className="mt-2 divide-y divide-line">
                  {group.rows.map((asset) => (
                    <li key={asset.symbol}>
                      <button
                        type="button"
                        onClick={() => setSelected(asset)}
                        className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:text-brand-strong"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-extrabold text-ink">{asset.symbol}</span>
                          <span className="block truncate text-[11px] font-semibold text-muted">{asset.name}</span>
                        </span>
                        <Sparkline data={asset.series} up={asset.change >= 0} width={64} height={26} className="shrink-0" />
                        <span className="shrink-0 text-right">
                          <span className="block text-sm font-black text-ink">{formatPrice(asset)}</span>
                          <span
                            className={`block text-[11px] font-extrabold ${
                              asset.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {group.tone === 'neutral'
                              ? `${(((asset.high - asset.low) / asset.low) * 100).toFixed(2)}% range`
                              : formatChange(asset.change)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* WATCHLIST TABLE                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div id="watchlist" className="scroll-mt-36">
        <FilterBar
          chips={chips}
          active={activeCategory}
          onChange={setActiveCategory}
          query={query}
          onQuery={setQuery}
          placeholder="Filter instruments…"
          right={
            <span className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-line bg-cream px-3 py-2 text-[11px] font-bold text-muted sm:flex dark:bg-cream-2">
              <FiStar className="text-brand-strong" />
              {watchlist.length} watched
            </span>
          }
        />

        <Section className="bg-surface">
          <SectionHead
            eyebrow={`${filtered.length} instruments`}
            title="Your market watchlist"
            description="Sort by any column, star what you follow, and tap a row for the full instrument card."
          />

          {filtered.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<FiSearch />}
                title="Nothing matches those filters"
                description="Try another category, or clear the search box to see all 44 instruments."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('')
                      setActiveCategory('All')
                    }}
                  >
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="mt-12 hidden overflow-hidden rounded-[26px] border border-line bg-cream shadow-card md:block dark:bg-cream-2">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-surface text-[11px] uppercase tracking-wide text-muted">
                    <tr>
                      <th scope="col" className="w-12 py-4 pl-5" />
                      <th scope="col" className="py-4">
                        <button
                          type="button"
                          onClick={() => toggleSort('name')}
                          className="flex items-center gap-1 font-black uppercase hover:text-ink"
                        >
                          Instrument
                          {sortKey === 'name' ? sortDir === 'asc' ? <FiArrowUp /> : <FiArrowDown /> : null}
                        </button>
                      </th>
                      <th scope="col" className="py-4 font-black">Class</th>
                      <th scope="col" className="py-4">Trend</th>
                      <th scope="col" className="py-4">
                        <button
                          type="button"
                          onClick={() => toggleSort('price')}
                          className="flex items-center gap-1 font-black uppercase hover:text-ink"
                        >
                          Price
                          {sortKey === 'price' ? sortDir === 'asc' ? <FiArrowUp /> : <FiArrowDown /> : null}
                        </button>
                      </th>
                      <th scope="col" className="py-4">
                        <button
                          type="button"
                          onClick={() => toggleSort('change')}
                          className="flex items-center gap-1 font-black uppercase hover:text-ink"
                        >
                          24h
                          {sortKey === 'change' ? sortDir === 'asc' ? <FiArrowUp /> : <FiArrowDown /> : null}
                        </button>
                      </th>
                      <th scope="col" className="py-4 pr-5 text-right font-black">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-line">
                    {filtered.map((asset) => {
                      const watched = watchlist.includes(asset.symbol)
                      return (
                        <tr key={asset.symbol} className="transition-colors hover:bg-surface">
                          <td className="py-3.5 pl-5">
                            <button
                              type="button"
                              onClick={() => toggleWatch(asset.symbol)}
                              aria-label={watched ? `Remove ${asset.symbol} from watchlist` : `Add ${asset.symbol} to watchlist`}
                              className={`grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-surface-2 ${
                                watched ? 'text-amber-500' : 'text-muted'
                              }`}
                            >
                              <FiStar className={watched ? 'fill-current' : ''} />
                            </button>
                          </td>
                          <td className="py-3.5">
                            <div className="font-extrabold text-ink">{asset.symbol}</div>
                            <div className="text-xs font-medium text-muted">{asset.name}</div>
                          </td>
                          <td className="py-3.5">
                            <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[11px] font-bold text-muted">
                              {asset.category}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <Sparkline data={asset.series} up={asset.change >= 0} width={92} height={30} />
                          </td>
                          <td className="py-3.5 font-black text-ink">{formatPrice(asset)}</td>
                          <td className="py-3.5">
                            <ChangeBadge change={asset.change} />
                          </td>
                          <td className="py-3.5 pr-5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelected(asset)}
                              className="inline-flex items-center gap-1 rounded-xl bg-brand-strong px-3.5 py-2 text-[11px] font-bold text-white shadow-brand transition-colors hover:bg-brand-strong-hover"
                            >
                              View <FiChevronRight />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mt-12 space-y-3 md:hidden">
                {filtered.map((asset) => {
                  const watched = watchlist.includes(asset.symbol)
                  return (
                    <div key={asset.symbol} className="rounded-[22px] border border-line bg-cream p-4 shadow-soft dark:bg-cream-2">
                      <div className="flex items-start justify-between gap-3">
                        <button type="button" onClick={() => setSelected(asset)} className="min-w-0 flex-1 text-left">
                          <div className="truncate text-sm font-extrabold text-ink">{asset.symbol}</div>
                          <div className="truncate text-[11px] font-semibold text-muted">{asset.name}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWatch(asset.symbol)}
                          aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                            watched ? 'text-amber-500' : 'text-muted'
                          }`}
                        >
                          <FiStar className={watched ? 'fill-current' : ''} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-end justify-between gap-3">
                        <div>
                          <div className="text-lg font-black text-ink">{formatPrice(asset)}</div>
                          <ChangeBadge change={asset.change} className="mt-1" />
                        </div>
                        <Sparkline data={asset.series} up={asset.change >= 0} width={90} height={34} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* HEATMAP                                                           */}
      {/* ---------------------------------------------------------------- */}
      <Section id="heatmap" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Session heatmap"
          title="One glance tells you what kind of day it is"
          description="Colour intensity tracks the size of the move. Tap any tile to open the instrument card."
        />

        <Reveal from="up" className="mt-12">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {marketAssets.map((asset) => (
              <button
                key={asset.symbol}
                type="button"
                onClick={() => setSelected(asset)}
                className={`rounded-2xl p-3 text-left transition-transform duration-200 hover:scale-[1.03] ${heatClass(asset.change)}`}
              >
                <div className="truncate text-[11px] font-black uppercase tracking-wide opacity-90">{asset.symbol}</div>
                <div className="mt-1 text-sm font-black">{formatChange(asset.change)}</div>
                <div className="truncate text-[10px] font-semibold opacity-80">{formatPrice(asset)}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-muted">
            <span>Weakest</span>
            {[-4, -2, -0.5, 0, 0.5, 2, 4].map((step) => (
              <span key={step} className={`h-4 w-8 rounded ${heatClass(step)}`} />
            ))}
            <span>Strongest</span>
          </div>
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FX CONVERTER                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section id="converter" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Currency converter"
          title="Mid-market rates, nothing added on top"
          description="The rate you see is the rate used in the calculation. Ten currencies, no spread, no hidden margin."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <Reveal from="up">
            <div className="rounded-[28px] border border-line bg-cream p-6 shadow-card sm:p-8 dark:bg-cream-2">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="text-lg font-extrabold text-ink">Convert an amount</h3>
                <FiRefreshCw className="text-lg text-brand-strong" />
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="fx-amount" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Amount
                  </label>
                  <input
                    id="fx-amount"
                    type="number"
                    min="0"
                    step="any"
                    value={fxAmount}
                    onChange={(event) => setFxAmount(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-line bg-surface px-4 text-xl font-black text-ink outline-none transition-colors focus:border-brand/60"
                  />
                  {!amountValid ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <FiAlertCircle /> Enter a positive number to convert.
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                  <div>
                    <label htmlFor="fx-from" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                      From
                    </label>
                    <select
                      id="fx-from"
                      value={fxFrom}
                      onChange={(event) => setFxFrom(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-line bg-surface px-3 text-sm font-bold text-ink outline-none focus:border-brand/60"
                    >
                      {CURRENCY_CODES.map((code) => (
                        <option key={code} value={code}>
                          {code} — {fxRates[code].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={swapCurrencies}
                    aria-label="Swap currencies"
                    className="mb-0.5 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface text-lg text-brand-strong transition-colors hover:bg-surface-2"
                  >
                    <FiRepeat />
                  </button>

                  <div>
                    <label htmlFor="fx-to" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                      To
                    </label>
                    <select
                      id="fx-to"
                      value={fxTo}
                      onChange={(event) => setFxTo(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-line bg-surface px-3 text-sm font-bold text-ink outline-none focus:border-brand/60"
                    >
                      {CURRENCY_CODES.map((code) => (
                        <option key={code} value={code}>
                          {code} — {fxRates[code].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-brand/25 bg-brand-soft p-6 text-center">
                  <span className="block text-[11px] font-black uppercase tracking-wide text-brand-ink">Converted amount</span>
                  <span className="mt-2 block text-3xl font-black tracking-tight text-brand-ink sm:text-4xl">
                    {fxRates[fxTo].symbol}
                    {converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="mt-2 block text-xs font-bold text-brand-ink/80">
                    1 {fxFrom} = {unitRate.toLocaleString('en-US', { maximumFractionDigits: 4 })} {fxTo}
                  </span>
                </div>

                <Button
                  className="w-full justify-center"
                  onClick={() =>
                    setToast(
                      `${fxRates[fxFrom].symbol}${amountValid ? parsedAmount.toLocaleString('en-US') : 0} → ${fxRates[fxTo].symbol}${converted.toFixed(2)} shared to chat.`,
                    )
                  }
                >
                  Share this rate to a chat <FiShare2 />
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="h-full rounded-[28px] border border-line bg-cream p-6 shadow-soft sm:p-8 dark:bg-cream-2">
              <h3 className="text-base font-extrabold text-ink">Rate table · 1 {fxFrom} buys</h3>
              <ul className="mt-5 divide-y divide-line">
                {CURRENCY_CODES.filter((code) => code !== fxFrom).map((code) => (
                  <li key={code} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-ink">{code}</span>
                      <span className="block truncate text-[11px] font-semibold text-muted">{fxRates[code].label}</span>
                    </span>
                    <span className="shrink-0 text-sm font-black text-ink">
                      {(fxRates[code].rate / fxRates[fxFrom].rate).toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 flex items-start gap-2 border-t border-line pt-5 text-[11px] leading-relaxed text-muted">
                <FiInfo className="mt-0.5 shrink-0" />
                Sample mid-market rates for illustration. Live rates inside the app update continuously and are stamped
                with the time they were quoted.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* PORTFOLIO SIMULATOR                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="portfolio" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Portfolio view"
          title="Track holdings without linking a broker"
          description="Enter quantities by hand. Nothing connects to an exchange, and nothing leaves your device."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Reveal from="up">
            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wide text-muted">Portfolio value</span>
                  <div className="mt-1 text-3xl font-black tracking-tight text-ink sm:text-4xl">
                    ${portfolio.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black uppercase tracking-wide text-muted">Day P/L</span>
                  <div
                    className={`mt-1 text-xl font-black ${
                      portfolio.dayPL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {portfolio.dayPL >= 0 ? '+' : '−'}$
                    {Math.abs(portfolio.dayPL).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              {portfolio.rows.length === 0 ? (
                <p className="py-10 text-center text-sm font-semibold text-muted">
                  No holdings yet — add one below to see the breakdown.
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-line">
                  {portfolio.rows.map((row) => {
                    const share = portfolio.total > 0 ? (row.value / portfolio.total) * 100 : 0
                    return (
                      <li key={row.symbol} className="py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-extrabold text-ink">
                              {row.symbol}
                              <span className="ml-2 text-[11px] font-bold text-muted">
                                {row.qty} × {formatPrice(row.asset)}
                              </span>
                            </div>
                            <div className="truncate text-[11px] font-semibold text-muted">{row.asset.name}</div>
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="text-sm font-black text-ink">
                              ${row.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </div>
                            <div
                              className={`text-[11px] font-extrabold ${
                                row.dayPL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {row.dayPL >= 0 ? '+' : '−'}${Math.abs(row.dayPL).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setHoldings((current) => current.filter((item) => item.symbol !== row.symbol))}
                            aria-label={`Remove ${row.symbol}`}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                          >
                            <FiTrash2 />
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                            <div className="h-full rounded-full bg-brand-strong" style={{ width: `${share}%` }} />
                          </div>
                          <span className="w-12 shrink-0 text-right text-[11px] font-black text-muted">
                            {share.toFixed(1)}%
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <form
              onSubmit={addHolding}
              className="h-full rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-8"
            >
              <h3 className="text-base font-extrabold text-ink">Add a holding</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-body">
                Pick an instrument and a quantity. Adding a symbol you already hold increases that position.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="holding-symbol" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Instrument
                  </label>
                  <select
                    id="holding-symbol"
                    value={holdingSymbol}
                    onChange={(event) => setHoldingSymbol(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-line bg-cream px-3 text-sm font-bold text-ink outline-none focus:border-brand/60 dark:bg-cream-2"
                  >
                    {marketAssets.map((asset) => (
                      <option key={asset.symbol} value={asset.symbol}>
                        {asset.symbol} — {asset.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="holding-qty" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Quantity
                  </label>
                  <input
                    id="holding-qty"
                    type="number"
                    min="0"
                    step="any"
                    value={holdingQty}
                    onChange={(event) => setHoldingQty(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm font-bold text-ink outline-none focus:border-brand/60 dark:bg-cream-2"
                  />
                </div>

                <Button type="submit" className="w-full justify-center">
                  Add to portfolio <FiPlus />
                </Button>

                <p className="flex items-start gap-2 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
                  <FiShield className="mt-0.5 shrink-0" />
                  Nothing here is a recommendation. This view is informational only and holds no assets on your behalf.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* PRICE ALERTS                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section id="alerts" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Price alerts"
          title="Alerts that arrive as a message"
          description="Set a level once. When it prints, KT AI sends it to your chat — no separate app to install or mute."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1fr]">
          <Reveal from="up">
            <form onSubmit={addAlert} className="rounded-[28px] border border-line bg-cream p-6 shadow-card sm:p-8 dark:bg-cream-2">
              <h3 className="text-base font-extrabold text-ink">Create an alert</h3>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="alert-symbol" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Instrument
                  </label>
                  <select
                    id="alert-symbol"
                    value={alertSymbol}
                    onChange={(event) => setAlertSymbol(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-line bg-surface px-3 text-sm font-bold text-ink outline-none focus:border-brand/60"
                  >
                    {marketAssets.map((asset) => (
                      <option key={asset.symbol} value={asset.symbol}>
                        {asset.symbol} — {formatPrice(asset)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">Condition</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['above', 'below'].map((direction) => (
                      <button
                        key={direction}
                        type="button"
                        onClick={() => setAlertDirection(direction)}
                        aria-pressed={alertDirection === direction}
                        className={`h-12 rounded-2xl border text-sm font-bold capitalize transition-colors ${
                          alertDirection === direction
                            ? 'border-brand-strong bg-brand-strong text-white shadow-brand'
                            : 'border-line bg-surface text-body hover:bg-surface-2'
                        }`}
                      >
                        {direction === 'above' ? <FiArrowUp className="mr-1 inline" /> : <FiArrowDown className="mr-1 inline" />}
                        Goes {direction}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="alert-target" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Target price
                  </label>
                  <input
                    id="alert-target"
                    type="number"
                    min="0"
                    step="any"
                    value={alertTarget}
                    onChange={(event) => setAlertTarget(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm font-bold text-ink outline-none focus:border-brand/60"
                  />
                </div>

                <Button type="submit" className="w-full justify-center">
                  Set alert <FiBell />
                </Button>
              </div>
            </form>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="h-full rounded-[28px] border border-line bg-cream p-6 shadow-soft sm:p-8 dark:bg-cream-2">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="text-base font-extrabold text-ink">Active alerts</h3>
                <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-black text-brand-ink">
                  {alerts.length} live
                </span>
              </div>

              {alerts.length === 0 ? (
                <p className="py-12 text-center text-sm font-semibold text-muted">
                  No alerts yet. Create one on the left and it appears here instantly.
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-line">
                  {alerts.map((alert) => {
                    const asset = assetBySymbol[alert.symbol]
                    const distance = asset ? ((alert.target - asset.price) / asset.price) * 100 : 0
                    const triggered = asset
                      ? alert.direction === 'above'
                        ? asset.price >= alert.target
                        : asset.price <= alert.target
                      : false

                    return (
                      <li key={alert.id} className="flex items-center gap-3 py-4">
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${
                            triggered
                              ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                              : 'bg-brand-soft text-brand-ink'
                          }`}
                        >
                          <FiBell />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-extrabold text-ink">
                            {alert.symbol} {alert.direction}{' '}
                            {alert.target.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                          </div>
                          <div className="truncate text-[11px] font-semibold text-muted">
                            {triggered
                              ? 'Condition already met — you would have been messaged.'
                              : `${Math.abs(distance).toFixed(2)}% ${distance > 0 ? 'above' : 'below'} the current price`}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAlerts((current) => current.filter((item) => item.id !== alert.id))}
                          aria-label="Delete alert"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        >
                          <FiTrash2 />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* ECONOMIC CALENDAR                                                 */}
      {/* ---------------------------------------------------------------- */}
      <Section id="calendar" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Economic calendar"
          title="Know what is scheduled before it moves the tape"
          description="Every release that reliably moves prices, with the forecast and prior value side by side."
        />

        <Reveal from="up" className="mt-12 overflow-hidden rounded-[26px] border border-line bg-surface shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-cream text-[11px] font-black uppercase tracking-wide text-muted dark:bg-cream-2">
                <tr>
                  <th scope="col" className="px-5 py-4">Time</th>
                  <th scope="col" className="py-4">Region</th>
                  <th scope="col" className="py-4">Event</th>
                  <th scope="col" className="py-4">Impact</th>
                  <th scope="col" className="py-4">Forecast</th>
                  <th scope="col" className="py-4 pr-5">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {economicCalendar.map((row) => (
                  <tr key={`${row.time}-${row.event}`} className="transition-colors hover:bg-surface-2">
                    <td className="px-5 py-4 font-black text-ink">{row.time}</td>
                    <td className="py-4">
                      <span className="rounded-lg border border-line bg-cream px-2 py-0.5 text-[11px] font-black text-muted dark:bg-cream-2">
                        {row.region}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-ink">{row.event}</td>
                    <td className="py-4">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-black ${IMPACT_STYLES[row.impact]}`}>
                        {row.impact}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-body">{row.forecast}</td>
                    <td className="py-4 pr-5 font-bold text-muted">{row.previous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TOOLS + STEPS                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Section id="tools" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Toolkit"
          title="Everything you need to follow a market"
          description="Nine tools that live inside the chat app you already have open."
        />

        <FeatureGrid className="mt-12" items={marketTools.map((tool, index) => ({ ...tool, icon: TOOL_ICONS[index] }))} />

        <div className="mt-20">
          <SectionHead eyebrow="How it works" title="From search to alert in four steps" />
          <Steps className="mt-12" items={marketSteps.map((step, index) => ({ ...step, icon: STEP_ICONS[index] }))} />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* LEARN                                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section id="learn" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Learn"
          title="Short reads that make the numbers make sense"
          description="Plain-language explainers written by the markets desk — no jargon for its own sake."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {marketLearn.map((item, index) => (
            <Reveal key={item.title} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
              <article className="group flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-black uppercase tracking-wide text-brand-ink">
                    {item.level}
                  </span>
                  <span className="text-[11px] font-bold text-muted">{item.minutes} min</span>
                </div>

                <h3 className="mt-4 text-base font-extrabold leading-snug text-ink">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{item.desc}</p>

                <span className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-4 text-xs font-bold text-brand-ink">
                  Read explainer <FiChevronRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TESTIMONIALS                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="bg-surface">
        <SectionHead eyebrow="Traders & investors" title="Why people keep it open all day" />
        <Testimonials className="mt-12" items={marketTestimonials} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* DISCLAIMER                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section container={false} className="border-y border-line bg-cream dark:bg-cream-2">
        <Container maxW="max-w-3xl">
          <Reveal from="up" className="flex items-start gap-4 rounded-[24px] border border-amber-300 bg-amber-50 p-6 dark:border-amber-500/30 dark:bg-amber-500/10">
            <FiAlertCircle className="mt-0.5 shrink-0 text-2xl text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="text-base font-extrabold text-ink">Not investment advice</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                KT Markets is an information and tracking tool. Prices on this page are illustrative samples, nothing here
                is a recommendation to buy or sell, and KT Messenger does not execute orders or custody assets. Markets
                carry risk — speak to a licensed adviser before investing.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Questions about data, privacy and scope" />
          <div className="mt-12">
            <FaqAccordion items={marketFaqs} placeholder="Search the FAQ…" />
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA + RELATED                                                     */}
      {/* ---------------------------------------------------------------- */}
      <CtaBand
        eyebrow="Start tracking"
        title="Your markets, in the app you already have open"
        description="Star a few instruments, set one alert, and let the moves come to you as ordinary encrypted messages."
        actions={
          <>
            <Button size="lg" variant="white" onClick={openDownloadModal}>
              Download KT Messenger
            </Button>
            <Button
              size="lg"
              variant="onDark"
              onClick={() => document.getElementById('watchlist')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore instruments
            </Button>
          </>
        }
        points={['Encrypted watchlists', 'Zero-spread FX', 'No brokerage link required', 'Free forever']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More of KT Messenger" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* INSTRUMENT MODAL                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        eyebrow={selected ? `${selected.category} · ${selected.pair}` : ''}
        title={selected?.name}
        size="lg"
        footer={
          selected ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleWatch(selected.symbol)}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-xs font-bold transition-colors ${
                  watchlist.includes(selected.symbol)
                    ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                    : 'border-line text-body hover:bg-surface-2'
                }`}
              >
                <FiStar className={watchlist.includes(selected.symbol) ? 'fill-current' : ''} />
                {watchlist.includes(selected.symbol) ? 'On your watchlist' : 'Add to watchlist'}
              </button>

              <Button
                onClick={() => {
                  setAlertSymbol(selected.symbol)
                  setAlertTarget(String(Number(selected.price.toFixed(selected.decimals))))
                  setSelected(null)
                  document.getElementById('alerts')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Set an alert <FiBell />
              </Button>
            </div>
          ) : null
        }
      >
        {selected ? (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wide text-muted">Last price</span>
                <div className="text-3xl font-black tracking-tight text-ink">{formatPrice(selected)}</div>
              </div>
              <ChangeBadge change={selected.change} className="text-sm" />
            </div>

            <div className="mt-5 rounded-2xl border border-line bg-cream p-4 dark:bg-cream-2">
              <Sparkline data={selected.series} up={selected.change >= 0} width={600} height={120} className="w-full" />
              <p className="mt-2 text-center text-[11px] font-bold text-muted">Last 24 intervals</p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: '24h high', value: `${selected.prefix ?? ''}${selected.high.toLocaleString('en-US')}` },
                { label: '24h low', value: `${selected.prefix ?? ''}${selected.low.toLocaleString('en-US')}` },
                { label: 'Market cap', value: selected.marketCap },
                { label: 'Volume', value: selected.volume },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-line bg-cream p-4 text-center dark:bg-cream-2">
                  <dt className="text-[10px] font-black uppercase tracking-wide text-muted">{item.label}</dt>
                  <dd className="mt-1 text-sm font-black text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>

            <h4 className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-muted">About</h4>
            <p className="mt-2 text-sm leading-relaxed text-body">{selected.about}</p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-cream p-4 dark:bg-cream-2">
              <FiInfo className="mt-0.5 shrink-0 text-lg text-brand-strong" />
              <p className="text-xs leading-relaxed text-body">
                Sample data shown for this product page. Nothing here is a recommendation — KT Markets tracks prices, it
                does not execute trades or hold assets.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}

import { useEffect, useMemo, useState } from 'react'
import {
  FiActivity,
  FiAward,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiCreditCard,
  FiFileText,
  FiHeart,
  FiLock,
  FiMapPin,
  FiMessageSquare,
  FiMinus,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
  FiStar,
  FiTag,
  FiTrash2,
  FiTrendingUp,
  FiTruck,
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
import { Modal } from '../../components/feature/Modal'
import { Toast } from '../../components/feature/Toast'
import { EmptyState } from '../../components/feature/EmptyState'
import { useModal } from '../../context/ModalContext'
import {
  marketplaceFaqs,
  marketplaceFeatures,
  marketplaceReviews,
  marketplaceSteps,
  productCategories,
  products,
  protectionPoints,
  sellers,
  trackingStages,
} from './marketplaceData'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'deals', label: 'Flash deals', icon: <FiZap /> },
  { id: 'categories', label: 'Categories', icon: <FiTag /> },
  { id: 'shop', label: 'Shop', icon: <FiShoppingBag /> },
  { id: 'wishlist', label: 'Wishlist', icon: <FiHeart /> },
  { id: 'sellers', label: 'Sellers', icon: <FiAward /> },
  { id: 'tracking', label: 'Tracking', icon: <FiTruck /> },
  { id: 'protection', label: 'Protection', icon: <FiShield /> },
  { id: 'sell', label: 'Sell with us', icon: <FiUsers /> },
  { id: 'faq', label: 'FAQ', icon: <FiMessageSquare /> },
]

const STATS = [
  { value: 40, suffix: '+', label: 'Sample products', icon: <FiShoppingBag />, hint: 'Across eight browsable categories.' },
  { value: 50, suffix: 'k', label: 'Verified stores', icon: <FiAward />, hint: 'GST and identity checked before listing.' },
  { value: 7, label: 'Day return window', icon: <FiRotateCcw />, hint: 'Pickup scheduled from the order card.' },
  { value: 2, suffix: '%', label: 'Flat seller commission', icon: <FiTag />, hint: 'No listing fees, no paid placement.' },
]

const CATEGORY_TILES = [
  { name: 'Electronics', emoji: '🎧', blurb: 'Audio, displays and desk tech' },
  { name: 'Gadgets', emoji: '⌚', blurb: 'Wearables, power and accessories' },
  { name: 'Home', emoji: '🪴', blurb: 'Kitchen, air, sleep and plants' },
  { name: 'Fashion', emoji: '🧥', blurb: 'Everyday apparel and carry' },
  { name: 'Beauty', emoji: '🧴', blurb: 'Skincare backed by ingredients' },
  { name: 'Sports', emoji: '🏋️', blurb: 'Training, recovery and cycling' },
  { name: 'Grocery', emoji: '🫙', blurb: 'Pantry staples, honestly labelled' },
  { name: 'All', emoji: '🛍️', blurb: 'Browse the whole catalogue' },
]

const FEATURE_ICONS = [
  <FiMessageSquare key="a" />,
  <FiLock key="b" />,
  <FiAward key="c" />,
  <FiTruck key="d" />,
  <FiRotateCcw key="e" />,
  <FiShield key="f" />,
  <FiHeart key="g" />,
  <FiUsers key="h" />,
  <FiTag key="i" />,
]

const PROTECTION_ICONS = [
  <FiRotateCcw key="a" />,
  <FiLock key="b" />,
  <FiCheckCircle key="c" />,
  <FiShield key="d" />,
  <FiClock key="e" />,
  <FiTag key="f" />,
]

const STEP_ICONS = [<FiSearch key="a" />, <FiShoppingCart key="b" />, <FiCreditCard key="c" />, <FiTruck key="d" />]

const RELATED = [
  { to: '/wallet', label: 'Wallet', desc: 'Pay in one tap and split orders with friends.', icon: <FiCreditCard /> },
  { to: '/markets', label: 'Markets', desc: 'Live prices and zero-spread currency conversion.', icon: <FiTrendingUp /> },
  { to: '/news', label: 'News', desc: 'Business headlines and a daily audio brief.', icon: <FiActivity /> },
  { to: '/notes', label: 'Notes', desc: 'Keep receipts and wish lists in an encrypted vault.', icon: <FiFileText /> },
]

const SORT_OPTIONS = ['Popular', 'Price: low', 'Price: high', 'Top rated', 'Biggest discount']
const PAGE_SIZE = 12
const DEAL_WINDOW = 6 * 60 * 60 // six hours, in seconds

const rupees = (value) => `₹${Number(value).toLocaleString('en-IN')}`

const discountOf = (product) => Math.round(((product.mrp - product.price) / product.mrp) * 100)

const formatCountdown = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [hrs, mins, secs].map((part) => String(part).padStart(2, '0'))
}

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-1">
      <FiStar className="fill-current text-amber-400" />
      <span className="text-[11px] font-black text-ink">{rating.toFixed(1)}</span>
    </span>
  )
}

export function MarketplacePage() {
  const { openDownloadModal } = useModal()

  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('Popular')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [wishlist, setWishlist] = useState([1, 25])
  const [cart, setCart] = useState([{ id: 7, qty: 1 }])
  const [quickView, setQuickView] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const [toast, setToast] = useState(null)
  const [remaining, setRemaining] = useState(DEAL_WINDOW)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Flash-deal countdown. Loops back to the top of the window when it expires.
  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((current) => (current <= 1 ? DEAL_WINDOW : current - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const productById = useMemo(() => Object.fromEntries(products.map((item) => [item.id, item])), [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.seller.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      return matchesCategory && matchesTerm
    })

    if (sortBy === 'Price: low') return [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'Price: high') return [...list].sort((a, b) => b.price - a.price)
    if (sortBy === 'Top rated') return [...list].sort((a, b) => b.rating - a.rating)
    if (sortBy === 'Biggest discount') return [...list].sort((a, b) => discountOf(b) - discountOf(a))
    return [...list].sort((a, b) => b.reviews - a.reviews)
  }, [activeCategory, query, sortBy])

  const visible = filtered.slice(0, visibleCount)
  const flashDeals = useMemo(() => products.filter((product) => product.tag === 'Flash sale'), [])
  const wishlisted = wishlist.map((id) => productById[id]).filter(Boolean)

  const chips = productCategories.map((label) => ({
    label,
    count: label === 'All' ? products.length : products.filter((product) => product.category === label).length,
  }))

  const cartRows = cart
    .map((line) => ({ ...line, product: productById[line.id] }))
    .filter((line) => Boolean(line.product))

  const cartCount = cartRows.reduce((sum, line) => sum + line.qty, 0)
  const cartSubtotal = cartRows.reduce((sum, line) => sum + line.product.price * line.qty, 0)
  const cartSaved = cartRows.reduce((sum, line) => sum + (line.product.mrp - line.product.price) * line.qty, 0)
  const deliveryFee = cartSubtotal > 0 && cartSubtotal < 999 ? 49 : 0
  const cartTotal = cartSubtotal + deliveryFee

  const resetPaging = () => setVisibleCount(PAGE_SIZE)

  const addToCart = (product, quiet = false) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id)
      if (existing) return current.map((line) => (line.id === product.id ? { ...line, qty: line.qty + 1 } : line))
      return [...current, { id: product.id, qty: 1 }]
    })
    if (!quiet) setToast(`${product.name} added to your cart.`)
  }

  const changeQty = (id, delta) =>
    setCart((current) =>
      current
        .map((line) => (line.id === id ? { ...line, qty: line.qty + delta } : line))
        .filter((line) => line.qty > 0),
    )

  const toggleWishlist = (id) => {
    const saved = wishlist.includes(id)
    setWishlist(saved ? wishlist.filter((item) => item !== id) : [...wishlist, id])
    setToast(saved ? 'Removed from your wishlist.' : 'Saved to your wishlist.')
  }

  const checkout = () => {
    if (cartRows.length === 0) {
      setToast('Your cart is empty — add something first.')
      return
    }
    setOrder({
      id: `KT${Math.floor(cartTotal)}${cartRows.length}${cartCount}`,
      items: cartRows.length,
      units: cartCount,
      total: cartTotal,
    })
    setCart([])
    setCartOpen(false)
  }

  const [hrs, mins, secs] = formatCountdown(remaining)

  return (
    <MainLayout>
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ---------------------------------------------------------------- */}
      <PageHero
        badge={
          <>
            <FiShoppingBag /> In-chat commerce · escrow on every order
          </>
        }
        title="KT"
        highlight="Marketplace"
        description="Browse verified stores, check out in one tap and track the parcel — all inside the conversation, with your money held in escrow until it arrives."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              Start shopping <FiChevronRight />
            </Button>
            <Button size="lg" variant="onDark" onClick={openDownloadModal}>
              Get the app <FiZap />
            </Button>
          </>
        }
        chips={[
          { icon: <FiLock />, label: 'Escrow until delivery' },
          { icon: <FiRotateCcw />, label: '7-day easy returns' },
          { icon: <FiTag />, label: 'No hidden checkout fees' },
        ]}
        aside={
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm font-extrabold text-white">Your cart</span>
              <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-[10px] font-black uppercase text-sky-300">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {cartRows.length === 0 ? (
              <p className="py-10 text-center text-xs font-semibold text-slate-400">
                Nothing here yet. Add a product below and it appears instantly.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {cartRows.slice(0, 3).map((line) => (
                  <li key={line.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <img src={line.product.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 block text-xs font-bold text-white">{line.product.name}</span>
                      <span className="text-[10px] font-semibold text-slate-400">Qty {line.qty}</span>
                    </span>
                    <span className="shrink-0 text-xs font-black text-white">{rupees(line.product.price * line.qty)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-bold text-slate-400">Subtotal</span>
              <span className="text-lg font-black text-white">{rupees(cartSubtotal)}</span>
            </div>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-strong text-sm font-bold text-white shadow-brand transition-colors hover:bg-brand-strong-hover"
            >
              <FiShoppingCart /> Open cart
            </button>
          </div>
        }
      >
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">
          <FiSearch className="ml-3 shrink-0 text-xl text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              resetPaging()
            }}
            placeholder="Search headphones, skincare, coffee, yoga mats…"
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                resetPaging()
              }}
              className="mr-2 shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Clear
            </button>
          ) : null}
        </div>
        {query ? (
          <p className="mt-3 text-xs font-semibold text-sky-300">
            {filtered.length} {filtered.length === 1 ? 'product matches' : 'products match'} “{query}”
          </p>
        ) : null}
      </PageHero>

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* ---------------------------------------------------------------- */}
      {/* FLASH DEALS                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section id="deals" className="scroll-mt-36 bg-surface">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead
            align="left"
            eyebrow="Flash deals"
            title="Today’s biggest discounts"
            description="Deal pricing holds until the timer runs out. No countdown tricks — the clock is the real window."
          />

          <Reveal from="up" delay={0.1}>
            <div className="flex items-center gap-2">
              {[
                { value: hrs, label: 'hrs' },
                { value: mins, label: 'min' },
                { value: secs, label: 'sec' },
              ].map((unit) => (
                <div key={unit.label} className="w-16 rounded-2xl border border-line bg-cream p-3 text-center shadow-soft dark:bg-cream-2">
                  <div className="text-xl font-black tabular-nums text-ink">{unit.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-wide text-muted">{unit.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
          {flashDeals.map((product) => (
            <article
              key={product.id}
              className="group w-[260px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-line bg-cream shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card sm:w-[300px] dark:bg-cream-2"
            >
              <button type="button" onClick={() => setQuickView(product)} className="relative block w-full overflow-hidden">
                <img
                  src={product.image}
                  alt=""
                  loading="lazy"
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                  −{discountOf(product)}%
                </span>
              </button>

              <div className="p-5">
                <span className="text-[11px] font-bold text-brand-ink">{product.seller}</span>
                <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-ink">{product.name}</h3>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-lg font-black text-ink">{rupees(product.price)}</div>
                    <div className="text-[11px] font-semibold text-muted line-through">{rupees(product.mrp)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="shrink-0 rounded-xl bg-brand-strong px-3.5 py-2 text-[11px] font-bold text-white shadow-brand transition-colors hover:bg-brand-strong-hover"
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CATEGORIES                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section id="categories" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Browse"
          title="Eight categories, no filler"
          description="Pick a shelf and the catalogue below filters instantly."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORY_TILES.map((tile, index) => (
            <Reveal key={tile.name} from="up" delay={Math.min(index * 0.04, 0.24)} className="h-full">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(tile.name)
                  resetPaging()
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`group flex h-full w-full flex-col items-start rounded-[24px] border p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                  activeCategory === tile.name ? 'border-brand-strong bg-brand-soft' : 'border-line bg-surface hover:border-brand/35'
                }`}
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">{tile.emoji}</span>
                <span className="mt-3 text-base font-extrabold text-ink">{tile.name}</span>
                <span className="mt-1 text-[11px] font-semibold leading-relaxed text-muted">{tile.blurb}</span>
                <span className="mt-3 text-[11px] font-black text-brand-ink">
                  {tile.name === 'All' ? products.length : products.filter((p) => p.category === tile.name).length} items
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SHOP GRID                                                         */}
      {/* ---------------------------------------------------------------- */}
      <div id="shop" className="scroll-mt-36">
        <FilterBar
          chips={chips}
          active={activeCategory}
          onChange={(label) => {
            setActiveCategory(label)
            resetPaging()
          }}
          query={query}
          onQuery={(value) => {
            setQuery(value)
            resetPaging()
          }}
          placeholder="Search the catalogue…"
          right={
            <div className="flex shrink-0 items-center gap-2">
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value)
                  resetPaging()
                }}
                aria-label="Sort products"
                className="h-10 rounded-xl border border-line bg-cream px-2.5 text-[11px] font-bold text-ink outline-none focus:border-brand/60 dark:bg-cream-2"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-brand-strong px-3.5 text-[11px] font-bold text-white shadow-brand transition-colors hover:bg-brand-strong-hover"
              >
                <FiShoppingCart /> Cart
                {cartCount > 0 ? (
                  <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-black text-brand-strong">
                    {cartCount}
                  </span>
                ) : null}
              </button>
            </div>
          }
        />

        <Section className="bg-surface">
          <SectionHead
            eyebrow={`${filtered.length} products`}
            title={activeCategory === 'All' ? 'The full catalogue' : activeCategory}
            description="Tap a card for the full description, specs and seller rating."
          />

          {visible.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<FiSearch />}
                title="No products match those filters"
                description="Try another category, or clear the search box to see all 40 products."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('')
                      setActiveCategory('All')
                      resetPaging()
                    }}
                  >
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((product, index) => {
                const saved = wishlist.includes(product.id)
                const inCart = cart.find((line) => line.id === product.id)
                return (
                  <Reveal key={product.id} from="up" delay={Math.min((index % 4) * 0.05, 0.2)} className="h-full">
                    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-cream shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card dark:bg-cream-2">
                      <div className="relative">
                        <button type="button" onClick={() => setQuickView(product)} className="block w-full overflow-hidden">
                          <img
                            src={product.image}
                            alt=""
                            loading="lazy"
                            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </button>

                        <span className="absolute left-3 top-3 rounded-full bg-brand-strong px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow">
                          {product.tag}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-colors ${
                            saved ? 'bg-rose-600 text-white' : 'bg-slate-950/45 text-white hover:bg-slate-950/70'
                          }`}
                        >
                          <FiHeart className={saved ? 'fill-current' : ''} />
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex min-w-0 items-center gap-1 text-[11px] font-bold text-brand-ink">
                            <span className="truncate">{product.seller}</span>
                            <FiCheckCircle className="shrink-0 text-brand-strong" />
                          </span>
                          <Stars rating={product.rating} />
                        </div>

                        <h3
                          role="link"
                          tabIndex={0}
                          onClick={() => setQuickView(product)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') setQuickView(product)
                          }}
                          className="mt-2 line-clamp-2 cursor-pointer text-sm font-extrabold leading-snug text-ink transition-colors hover:text-brand-strong"
                        >
                          {product.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                          <FiTruck className="shrink-0" /> {product.delivery}
                        </div>

                        <div className="mt-auto pt-4">
                          <div className="flex items-end justify-between gap-2">
                            <div>
                              <div className="text-base font-black text-ink">{rupees(product.price)}</div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-muted line-through">{rupees(product.mrp)}</span>
                                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                  −{discountOf(product)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className={`mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-colors ${
                              inCart
                                ? 'border border-brand-strong bg-brand-soft text-brand-ink'
                                : 'bg-brand-strong text-white shadow-brand hover:bg-brand-strong-hover'
                            }`}
                          >
                            {inCart ? (
                              <>
                                <FiCheckCircle /> In cart ({inCart.qty})
                              </>
                            ) : (
                              <>
                                <FiShoppingCart /> Add to cart
                              </>
                            )}
                          </button>
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
                Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more products
              </Button>
              <span className="text-xs font-semibold text-muted">
                Showing {visible.length} of {filtered.length}
              </span>
            </div>
          ) : null}
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* WISHLIST                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section id="wishlist" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Wishlist"
          title={`${wishlisted.length} ${wishlisted.length === 1 ? 'item' : 'items'} saved`}
          description="Your wishlist syncs across devices, and nudges you only when a price genuinely drops."
        />

        <div className="mt-12">
          {wishlisted.length === 0 ? (
            <EmptyState
              icon={<FiHeart />}
              title="Nothing saved yet"
              description="Tap the heart on any product and it lands here, price-tracked across devices."
              action={
                <Button variant="secondary" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
                  Browse the catalogue
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlisted.map((product, index) => (
                <Reveal key={product.id} from="up" delay={index * 0.05} className="h-full">
                  <div className="flex h-full items-center gap-4 rounded-[22px] border border-line bg-surface p-4 shadow-soft">
                    <img src={product.image} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-ink">{product.name}</h3>
                      <div className="mt-1 text-sm font-black text-ink">{rupees(product.price)}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="rounded-lg bg-brand-strong px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-brand-strong-hover"
                        >
                          Add to cart
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label="Remove from wishlist"
                          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SELLERS                                                           */}
      {/* ---------------------------------------------------------------- */}
      <Section id="sellers" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Verified stores"
          title="Merchants who cleared the checks"
          description="GST verification, identity confirmation and a review audit before a badge is issued — and re-audits after."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sellers.map((seller, index) => (
            <Reveal key={seller.name} from="up" delay={Math.min(index * 0.04, 0.24)} className="h-full">
              <button
                type="button"
                onClick={() => {
                  setQuery(seller.name)
                  setActiveCategory('All')
                  resetPaging()
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group flex h-full w-full flex-col rounded-[24px] border border-line bg-cream p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-card dark:bg-cream-2"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-strong text-base font-black text-white">
                    {seller.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-extrabold text-ink">{seller.name}</h3>
                      <FiCheckCircle className="shrink-0 text-sm text-brand-strong" />
                    </div>
                    <p className="truncate text-[11px] font-semibold text-muted">{seller.focus}</p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
                  {[
                    { label: 'Rating', value: seller.rating.toFixed(1) },
                    { label: 'Orders', value: seller.orders },
                    { label: 'Since', value: seller.since },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-[9px] font-black uppercase tracking-wide text-muted">{item.label}</dt>
                      <dd className="mt-0.5 text-xs font-black text-ink">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* ORDER TRACKING                                                    */}
      {/* ---------------------------------------------------------------- */}
      <Section id="tracking" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Order tracking"
          title="Every update lands as a message"
          description="No tracking page to bookmark and no email you will never open — the parcel reports into the thread."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <Reveal from="up">
            <ol className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8">
              {trackingStages.map((stage, index) => (
                <li key={stage.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm ${
                        stage.done
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-dashed border-line bg-surface text-muted'
                      }`}
                    >
                      {stage.done ? <FiCheckCircle /> : index + 1}
                    </span>
                    {index < trackingStages.length - 1 ? (
                      <span className={`my-1 w-0.5 flex-1 ${stage.done ? 'bg-emerald-500/40' : 'bg-line'}`} />
                    ) : null}
                  </div>

                  <div className={`pb-8 ${index === trackingStages.length - 1 ? 'pb-0' : ''}`}>
                    <h3 className={`text-sm font-extrabold ${stage.done ? 'text-ink' : 'text-muted'}`}>{stage.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-body">{stage.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="flex h-full flex-col rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-8">
              <h3 className="text-base font-extrabold text-ink">Order card preview</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-body">How the live order looks inside your chat thread.</p>

              <div className="mt-6 rounded-[22px] border border-line bg-cream p-4 dark:bg-cream-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink">
                    <FiPackage />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-ink">Order #KT-84920</div>
                    <div className="text-[11px] font-semibold text-muted">Acme Electronics · 2 items</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-line pt-4 text-[11px] font-semibold">
                  {[
                    { icon: <FiTruck />, text: 'Shipped · arriving Friday' },
                    { icon: <FiMapPin />, text: 'Currently at Bengaluru hub' },
                    { icon: <FiLock />, text: '₹6,498 held in escrow' },
                  ].map((row) => (
                    <div key={row.text} className="flex items-center gap-2 text-body">
                      <span className="text-brand-strong">{row.icon}</span>
                      {row.text}
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setToast('Live tracking opened in the order thread.')}
                    className="h-10 rounded-xl bg-brand-strong text-[11px] font-bold text-white transition-colors hover:bg-brand-strong-hover"
                  >
                    Track live
                  </button>
                  <button
                    type="button"
                    onClick={() => setToast('Return started — pickup scheduled for tomorrow.')}
                    className="h-10 rounded-xl border border-line text-[11px] font-bold text-body transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    Start a return
                  </button>
                </div>
              </div>

              <p className="mt-6 flex items-start gap-2 border-t border-line pt-5 text-[11px] leading-relaxed text-muted">
                <FiRefreshCw className="mt-0.5 shrink-0" />
                Status changes push into the thread as they happen. Nothing is buried in a separate app.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* BUYER PROTECTION                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Section id="protection" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Buyer protection"
          title="Six guarantees, written plainly"
          description="What actually protects you when an order goes wrong — no asterisks."
        />

        <FeatureGrid
          className="mt-12"
          items={protectionPoints.map((item, index) => ({ ...item, icon: PROTECTION_ICONS[index] }))}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FEATURES + STEPS                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead eyebrow="What you get" title="Shopping that fits in a conversation" />
        <FeatureGrid
          className="mt-12"
          items={marketplaceFeatures.map((item, index) => ({ ...item, icon: FEATURE_ICONS[index] }))}
        />

        <div className="mt-20">
          <SectionHead eyebrow="How it works" title="Browse, pay, track, return" />
          <Steps className="mt-12" items={marketplaceSteps.map((item, index) => ({ ...item, icon: STEP_ICONS[index] }))} />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SELL WITH US                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section id="sell" className="scroll-mt-36 bg-surface">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHead
            align="left"
            eyebrow="For sellers"
            title="Open a store without building a website"
            description="Upload a catalogue, verify your business and start taking orders in the chats you already answer. Flat 2% on settled orders, nothing else."
          >
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={openDownloadModal}>
                Start selling <FiChevronRight />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setToast('Seller guide sent to your chat.')}>
                Read the seller guide
              </Button>
            </div>
          </SectionHead>

          <Reveal from="up" delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: '2%', label: 'Flat commission', desc: 'No listing fees, no ad auction, no paid ranking.' },
                { value: '48h', label: 'Time to go live', desc: 'Most stores clear verification within two days.' },
                { value: 'T+1', label: 'Settlement', desc: 'Money lands the next business day after delivery.' },
                { value: '0', label: 'Website needed', desc: 'Your catalogue lives in your business profile.' },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-line bg-cream p-5 shadow-soft dark:bg-cream-2">
                  <div className="text-3xl font-black tracking-tight text-brand-strong">{item.value}</div>
                  <div className="mt-1 text-sm font-extrabold text-ink">{item.label}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-body">{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* REVIEWS                                                           */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead eyebrow="Buyers & sellers" title="What both sides say" />
        <Testimonials className="mt-12" items={marketplaceReviews} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Buying, selling and everything in between" />
          <div className="mt-12">
            <FaqAccordion items={marketplaceFaqs} placeholder="Search the FAQ…" />
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA + RELATED                                                     */}
      {/* ---------------------------------------------------------------- */}
      <CtaBand
        eyebrow="Start shopping"
        title="A storefront that lives inside your conversations"
        description="Verified sellers, escrow on every order and returns that take two taps — with no hidden fee at checkout."
        actions={
          <>
            <Button size="lg" variant="white" onClick={openDownloadModal}>
              Download KT Messengers
            </Button>
            <Button size="lg" variant="onDark" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse the catalogue
            </Button>
          </>
        }
        points={['Escrow until delivery', '7-day returns', 'Verified sellers only', 'No checkout surprises']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More of KT Messengers" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* QUICK VIEW MODAL                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={Boolean(quickView)}
        onClose={() => setQuickView(null)}
        eyebrow={quickView ? `${quickView.category} · ${quickView.seller}` : ''}
        title={quickView?.name}
        size="lg"
        footer={
          quickView ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xl font-black text-ink">{rupees(quickView.price)}</div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <span className="text-muted line-through">{rupees(quickView.mrp)}</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">−{discountOf(quickView)}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickView.id)}
                  aria-label="Toggle wishlist"
                  className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                    wishlist.includes(quickView.id)
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : 'border-line text-body hover:bg-surface-2'
                  }`}
                >
                  <FiHeart className={wishlist.includes(quickView.id) ? 'fill-current' : ''} />
                </button>
                <Button
                  onClick={() => {
                    addToCart(quickView)
                    setQuickView(null)
                  }}
                >
                  Add to cart <FiShoppingCart />
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {quickView ? (
          <div>
            <img src={quickView.image} alt="" className="h-56 w-full rounded-2xl object-cover sm:h-72" />

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Stars rating={quickView.rating} />
              <span className="text-[11px] font-semibold text-muted">{quickView.reviews.toLocaleString('en-IN')} reviews</span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                <FiTruck /> {quickView.delivery}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                  quickView.stock < 20
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/12 dark:text-amber-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-300'
                }`}
              >
                {quickView.stock} in stock
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-body">{quickView.desc}</p>

            <h4 className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-muted">Highlights</h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {quickView.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2.5 text-xs font-bold text-ink dark:bg-cream-2">
                  <FiCheckCircle className="shrink-0 text-brand-strong" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-cream p-4 dark:bg-cream-2">
              <FiLock className="mt-0.5 shrink-0 text-lg text-brand-strong" />
              <p className="text-xs leading-relaxed text-body">
                Your payment is held in escrow until this order is marked delivered, and your address is shared
                end-to-end encrypted with {quickView.seller} alone.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* ---------------------------------------------------------------- */}
      {/* CART MODAL                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        eyebrow={`${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
        title="Your cart"
        size="md"
        footer={
          <div className="space-y-3">
            <div className="space-y-1.5 text-xs font-bold">
              <div className="flex items-center justify-between text-body">
                <span>Subtotal</span>
                <span className="text-ink">{rupees(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-body">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink'}>
                  {deliveryFee === 0 ? 'Free' : rupees(deliveryFee)}
                </span>
              </div>
              {cartSaved > 0 ? (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>You save</span>
                  <span>{rupees(cartSaved)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between border-t border-line pt-2 text-base font-black text-ink">
                <span>Total</span>
                <span>{rupees(cartTotal)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full justify-center" onClick={checkout}>
              Pay {rupees(cartTotal)} in chat <FiLock />
            </Button>
          </div>
        }
      >
        {cartRows.length === 0 ? (
          <EmptyState
            icon={<FiShoppingCart />}
            title="Your cart is empty"
            description="Add a product from the catalogue and it shows up here."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setCartOpen(false)
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Browse products
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {cartRows.map((line) => (
              <li key={line.id} className="flex items-center gap-4 py-4 first:pt-0">
                <img src={line.product.image} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-extrabold leading-snug text-ink">{line.product.name}</h4>
                  <p className="mt-0.5 text-[11px] font-semibold text-muted">{line.product.seller}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => changeQty(line.id, -1)}
                        aria-label="Decrease quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-body transition-colors hover:bg-surface-2 hover:text-ink"
                      >
                        <FiMinus />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-ink">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(line.id, 1)}
                        aria-label="Increase quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-body transition-colors hover:bg-surface-2 hover:text-ink"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCart((current) => current.filter((item) => item.id !== line.id))}
                      aria-label="Remove item"
                      className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <span className="shrink-0 text-sm font-black text-ink">{rupees(line.product.price * line.qty)}</span>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* ---------------------------------------------------------------- */}
      {/* ORDER CONFIRMATION MODAL                                          */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={Boolean(order)}
        onClose={() => setOrder(null)}
        eyebrow="Order placed"
        title="Confirmation"
        size="sm"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setOrder(null)
                document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-xs font-bold text-body transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <FiTruck /> Track order
            </button>
            <Button onClick={() => setOrder(null)}>Done</Button>
          </div>
        }
      >
        {order ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/12 text-3xl text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle />
            </span>

            <h3 className="mt-5 text-xl font-extrabold text-ink">Order confirmed</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              The invoice card is now in your chat. Delivery updates will arrive in the same thread.
            </p>

            <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-cream text-left dark:bg-cream-2">
              {[
                { label: 'Order ID', value: order.id },
                { label: 'Items', value: `${order.items} products · ${order.units} units` },
                { label: 'Total paid', value: rupees(order.total) },
                { label: 'Escrow', value: 'Released on delivery' },
                { label: 'Returns', value: '7 days from delivery' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-[11px] font-black uppercase tracking-wide text-muted">{row.label}</dt>
                  <dd className="truncate text-xs font-bold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </Modal>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}

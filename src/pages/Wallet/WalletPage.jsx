import { useEffect, useMemo, useState } from 'react'
import {
  FiActivity,
  FiAlertCircle,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiBell,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiCopy,
  FiCreditCard,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiGift,
  FiGrid,
  FiLock,
  FiMessageSquare,
  FiSend,
  FiShield,
  FiSliders,
  FiTarget,
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
  billCategories,
  cards,
  contacts,
  cryptoHoldings,
  initialGoals,
  initialTransactions,
  limitsTable,
  paymentMethods,
  rewards,
  securityFeatures,
  transactionCategories,
  walletFaqs,
  walletFeatures,
  walletSteps,
  walletTestimonials,
} from './walletData'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiCompass /> },
  { id: 'send', label: 'Send & request', icon: <FiSend /> },
  { id: 'split', label: 'Split bill', icon: <FiUsers /> },
  { id: 'activity', label: 'Activity', icon: <FiActivity /> },
  { id: 'cards', label: 'Cards', icon: <FiCreditCard /> },
  { id: 'bills', label: 'Bills', icon: <FiFileText /> },
  { id: 'goals', label: 'Goals', icon: <FiTarget /> },
  { id: 'rewards', label: 'Rewards', icon: <FiGift /> },
  { id: 'crypto', label: 'Crypto vault', icon: <FiZap /> },
  { id: 'limits', label: 'Limits & fees', icon: <FiSliders /> },
  { id: 'security', label: 'Security', icon: <FiShield /> },
  { id: 'faq', label: 'FAQ', icon: <FiMessageSquare /> },
]

const STATS = [
  { value: 0, label: 'Fee on P2P transfers', prefix: '₹', icon: <FiSend />, hint: 'UPI and bank transfers are free, always.' },
  { value: 8, label: 'Payment methods', icon: <FiCreditCard />, hint: 'UPI, cards, net banking, wallets and crypto.' },
  { value: 12, label: 'Bill categories', icon: <FiFileText />, hint: 'Autopay with a confirmation before every debit.' },
  { value: 3, suffix: 's', label: 'Typical settlement', icon: <FiZap />, hint: 'Peer-to-peer UPI clears in about three seconds.' },
]

const FEATURE_ICONS = [
  <FiSend key="a" />,
  <FiBell key="b" />,
  <FiUsers key="c" />,
  <FiCreditCard key="d" />,
  <FiFileText key="e" />,
  <FiTarget key="f" />,
  <FiZap key="g" />,
  <FiGift key="h" />,
  <FiDownload key="i" />,
]

const STEP_ICONS = [<FiMessageSquare key="a" />, <FiSend key="b" />, <FiLock key="c" />, <FiCheckCircle key="d" />]

const SECURITY_ICONS = [
  <FiLock key="lock" />,
  <FiShield key="shield" />,
  <FiCreditCard key="card" />,
  <FiSliders key="sliders" />,
  <FiMessageSquare key="message" />,
  <FiAlertCircle key="alert" />,
]

const RELATED = [
  { to: '/markets', label: 'Markets', desc: 'Track prices and convert currencies at mid-market.', icon: <FiTrendingUp /> },
  { to: '/marketplace', label: 'Marketplace', desc: 'Buy from verified stores and pay in one tap.', icon: <FiGrid /> },
  { to: '/news', label: 'News', desc: 'Business headlines and a daily audio brief.', icon: <FiActivity /> },
  { to: '/notes', label: 'Notes', desc: 'Keep receipts and budgets in an encrypted vault.', icon: <FiFileText /> },
]

const QUICK_AMOUNTS = [100, 500, 1000, 2500]

const rupees = (value, decimals = 2) =>
  `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`

export function WalletPage() {
  const { openDownloadModal } = useModal()

  const [balance, setBalance] = useState(148500)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [toast, setToast] = useState(null)
  const [receipt, setReceipt] = useState(null)

  // Send / request
  const [mode, setMode] = useState('send')
  const [recipient, setRecipient] = useState(contacts[0].name)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  // Split bill
  const [billTotal, setBillTotal] = useState('4800')
  const [people, setPeople] = useState('4')
  const [tip, setTip] = useState(10)

  // Activity
  const [activityFilter, setActivityFilter] = useState('All')
  const [activityQuery, setActivityQuery] = useState('')

  // Cards
  const [frozen, setFrozen] = useState([])
  const [revealed, setRevealed] = useState([])

  // Goals
  const [goals, setGoals] = useState(initialGoals)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const selectedContact = contacts.find((contact) => contact.name === recipient) ?? contacts[0]

  // ------------------------------------------------------------ Send / request
  const handleSubmit = (event) => {
    event.preventDefault()
    const value = parseFloat(amount)

    if (!Number.isFinite(value) || value <= 0) {
      setToast('Enter an amount greater than zero.')
      return
    }

    if (mode === 'send' && value > balance) {
      setToast(`Not enough balance — you have ${rupees(balance)} available.`)
      return
    }

    const entry = {
      id: `t${Date.now()}`,
      name: recipient,
      note: note.trim() || (mode === 'send' ? 'Sent from chat' : 'Requested in chat'),
      category: mode === 'send' ? 'Sent' : 'Received',
      direction: mode === 'send' ? 'out' : 'in',
      amount: value,
      date: 'Just now',
      method: 'UPI',
      status: mode === 'send' ? 'Completed' : 'Pending',
    }

    if (mode === 'send') {
      setBalance((current) => current - value)
      setTransactions((current) => [entry, ...current])
      setReceipt({ ...entry, contact: selectedContact })
    } else {
      setTransactions((current) => [entry, ...current])
      setToast(`Request for ${rupees(value)} sent to ${recipient}.`)
    }

    setAmount('')
    setNote('')
  }

  // ---------------------------------------------------------------- Split bill
  const split = useMemo(() => {
    const total = parseFloat(billTotal)
    const heads = parseInt(people, 10)
    if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(heads) || heads <= 0) {
      return { valid: false, withTip: 0, each: 0, heads: 0, tipValue: 0 }
    }
    const tipValue = (total * tip) / 100
    const withTip = total + tipValue
    return { valid: true, withTip, each: withTip / heads, heads, tipValue }
  }, [billTotal, people, tip])

  // ----------------------------------------------------------------- Activity
  const filteredTransactions = useMemo(() => {
    const term = activityQuery.trim().toLowerCase()
    return transactions.filter((item) => {
      const matchesFilter = activityFilter === 'All' || item.category === activityFilter
      const matchesTerm =
        !term || item.name.toLowerCase().includes(term) || item.note.toLowerCase().includes(term)
      return matchesFilter && matchesTerm
    })
  }, [transactions, activityFilter, activityQuery])

  const monthIn = transactions.filter((item) => item.direction === 'in').reduce((sum, item) => sum + item.amount, 0)
  const monthOut = transactions.filter((item) => item.direction === 'out').reduce((sum, item) => sum + item.amount, 0)

  // -------------------------------------------------------------------- Cards
  const toggleFreeze = (id) => {
    const isFrozen = frozen.includes(id)
    setFrozen(isFrozen ? frozen.filter((item) => item !== id) : [...frozen, id])
    setToast(isFrozen ? 'Card unfrozen — payments will go through again.' : 'Card frozen. New payments are declined instantly.')
  }

  const toggleReveal = (id) => setRevealed((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  // -------------------------------------------------------------------- Goals
  const addToGoal = (id, value) => {
    if (value > balance) {
      setToast(`Not enough balance — you have ${rupees(balance)} available.`)
      return
    }
    let goalName = ''
    setGoals((current) =>
      current.map((goal) => {
        if (goal.id !== id) return goal
        goalName = goal.name
        return { ...goal, saved: Math.min(goal.saved + value, goal.target) }
      }),
    )
    setBalance((current) => current - value)
    setToast(`${rupees(value, 0)} moved into ${goalName || 'your goal'}.`)
  }

  const cryptoTotal = cryptoHoldings.reduce((sum, item) => sum + item.value, 0)

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setToast(`Code ${code} copied to your clipboard.`)
    } catch {
      setToast(`Use code ${code} at checkout.`)
    }
  }

  return (
    <MainLayout>
      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ---------------------------------------------------------------- */}
      <PageHero
        badge={
          <>
            <FiShield /> Bank-grade security · zero-fee transfers
          </>
        }
        title="KT"
        highlight="Wallet & Pay"
        description="Send money, split a bill, pay a merchant and hold crypto — all from inside the conversation you are already having."
        actions={
          <>
            <Button size="lg" variant="white" onClick={() => document.getElementById('send')?.scrollIntoView({ behavior: 'smooth' })}>
              Try a live transfer <FiSend />
            </Button>
            <Button size="lg" variant="onDark" onClick={openDownloadModal}>
              Get the app <FiZap />
            </Button>
          </>
        }
        chips={[
          { icon: <FiLock />, label: 'Passkey on every payment' },
          { icon: <FiZap />, label: '~3 second settlement' },
          { icon: <FiShield />, label: 'PCI-DSS Level 1 partners' },
        ]}
        aside={
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[28px] border border-blue-400/25 bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 p-6 text-white shadow-2xl sm:p-8">
              <div className="kt-hero-grid absolute inset-0 opacity-30" aria-hidden="true" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white text-sm font-black text-brand-strong">KT</span>
                  <span className="text-sm font-extrabold">KT Pay Virtual Card</span>
                </div>
                <FiGrid className="text-2xl opacity-70" />
              </div>

              <div className="relative mt-7">
                <span className="text-xs font-semibold text-blue-200">Available balance</span>
                <div className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{rupees(balance)}</div>
              </div>

              <div className="relative mt-7 flex items-center justify-between border-t border-white/15 pt-4 font-mono text-xs opacity-85">
                <span>•••• •••• •••• 8492</span>
                <span>EXP 12/29</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'In this month', value: rupees(monthIn, 0), tone: 'text-emerald-400' },
                { label: 'Out this month', value: rupees(monthOut, 0), tone: 'text-rose-400' },
                { label: 'Crypto vault', value: rupees(cryptoTotal, 0), tone: 'text-sky-400' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur">
                  <div className={`truncate text-sm font-black ${item.tone}`}>{item.value}</div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <StatStrip items={STATS} />

      <PageNav items={NAV_ITEMS} />

      {/* ---------------------------------------------------------------- */}
      {/* SEND & REQUEST                                                    */}
      {/* ---------------------------------------------------------------- */}
      <Section id="send" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Send & request"
          title="Move money without leaving the chat"
          description="Pick a contact, enter an amount, approve with a passkey. This demo updates the balance and activity below in real time."
        />

        {/* [&>*]:min-w-0 lets the grid tracks shrink below the contact rail's
            min-content width — without it the rail stretches the whole column
            past the viewport on small screens. */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.85fr] [&>*]:min-w-0">
          <Reveal from="up">
            <form onSubmit={handleSubmit} className="rounded-[28px] border border-line bg-cream p-6 shadow-card sm:p-8 dark:bg-cream-2">
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-line bg-surface p-1">
                {[
                  { key: 'send', label: 'Send money', icon: <FiArrowUpRight /> },
                  { key: 'request', label: 'Request money', icon: <FiArrowDownLeft /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setMode(tab.key)}
                    aria-pressed={mode === tab.key}
                    className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors ${
                      mode === tab.key ? 'bg-brand-strong text-white shadow-brand' : 'text-body hover:text-ink'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <span className="mb-2.5 block text-[11px] font-black uppercase tracking-wide text-muted">Choose a contact</span>
                <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
                  {contacts.map((contact) => {
                    const active = contact.name === recipient
                    return (
                      <button
                        key={contact.name}
                        type="button"
                        onClick={() => setRecipient(contact.name)}
                        aria-pressed={active}
                        aria-label={`${mode === 'send' ? 'Pay' : 'Request from'} ${contact.name}`}
                        className={`w-20 shrink-0 rounded-2xl border p-2.5 text-center transition-all ${
                          active
                            ? 'border-brand-strong bg-brand-soft shadow-soft'
                            : 'border-line bg-surface hover:border-brand/40'
                        }`}
                      >
                        <span
                          className={`mx-auto grid h-11 w-11 place-items-center rounded-full text-sm font-black ${
                            active ? 'bg-brand-strong text-white' : 'bg-surface-2 text-ink'
                          }`}
                        >
                          {contact.name.charAt(0)}
                        </span>
                        <span className="mt-1.5 block truncate text-[10px] font-bold text-ink">
                          {contact.name.split(' ')[0]}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-[11px] font-semibold text-muted">
                  Paying <span className="font-black text-ink">{selectedContact.name}</span> · {selectedContact.upi}
                </p>
              </div>

              <div className="mt-6">
                <label htmlFor="pay-amount" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                  Amount
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 focus-within:border-brand/60">
                  <span className="text-2xl font-black text-muted">₹</span>
                  <input
                    id="pay-amount"
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0"
                    className="h-14 w-full bg-transparent text-2xl font-black text-ink outline-none placeholder:text-muted"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(String(value))}
                      className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-bold text-body transition-colors hover:border-brand/40 hover:text-ink"
                    >
                      +{rupees(value, 0)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="pay-note" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                  Note (end-to-end encrypted)
                </label>
                <input
                  id="pay-note"
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={60}
                  placeholder="Dinner, rent share, tickets…"
                  className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm font-semibold text-ink outline-none focus:border-brand/60 placeholder:font-medium placeholder:text-muted"
                />
              </div>

              <Button type="submit" size="lg" className="mt-6 w-full justify-center">
                {mode === 'send' ? 'Send money now' : 'Send the request'}
                {mode === 'send' ? <FiSend /> : <FiArrowDownLeft />}
              </Button>

              <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                <FiLock className="mt-0.5 shrink-0" />
                In the app a passkey confirms this step. Peer-to-peer transfers carry no fee, and the note travels
                end-to-end encrypted.
              </p>
            </form>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-[28px] border border-line bg-cream p-6 shadow-soft dark:bg-cream-2">
                <span className="text-[11px] font-black uppercase tracking-wide text-muted">Available balance</span>
                <div className="mt-1 text-3xl font-black tracking-tight text-ink">{rupees(balance)}</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-line bg-surface p-3">
                    <div className="text-[10px] font-black uppercase tracking-wide text-muted">Received</div>
                    <div className="mt-0.5 text-sm font-black text-emerald-600 dark:text-emerald-400">{rupees(monthIn, 0)}</div>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface p-3">
                    <div className="text-[10px] font-black uppercase tracking-wide text-muted">Spent</div>
                    <div className="mt-0.5 text-sm font-black text-rose-600 dark:text-rose-400">{rupees(monthOut, 0)}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 rounded-[28px] border border-line bg-cream p-6 shadow-soft dark:bg-cream-2">
                <h3 className="text-sm font-extrabold text-ink">Latest activity</h3>
                <ul className="mt-3 divide-y divide-line">
                  {transactions.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-3">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                          item.direction === 'in'
                            ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/12 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {item.direction === 'in' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-extrabold text-ink">{item.name}</span>
                        <span className="block truncate text-[10px] font-semibold text-muted">{item.date}</span>
                      </span>
                      <span
                        className={`shrink-0 text-xs font-black ${
                          item.direction === 'in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {item.direction === 'in' ? '+' : '−'}
                        {rupees(item.amount, 0)}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-ink hover:text-brand-strong"
                >
                  See all {transactions.length} entries <FiChevronRight />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SPLIT BILL                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section id="split" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Split a bill"
          title="Everyone pays their share without the maths"
          description="Add the total, the headcount and a tip. One tap sends the request to every person in the group."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Reveal from="up">
            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="bill-total" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Total bill (₹)
                  </label>
                  <input
                    id="bill-total"
                    type="number"
                    min="0"
                    step="any"
                    value={billTotal}
                    onChange={(event) => setBillTotal(event.target.value)}
                    className="h-13 w-full rounded-2xl border border-line bg-cream px-4 py-3 text-lg font-black text-ink outline-none focus:border-brand/60 dark:bg-cream-2"
                  />
                </div>

                <div>
                  <label htmlFor="bill-people" className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-muted">
                    Number of people
                  </label>
                  <input
                    id="bill-people"
                    type="number"
                    min="1"
                    step="1"
                    value={people}
                    onChange={(event) => setPeople(event.target.value)}
                    className="h-13 w-full rounded-2xl border border-line bg-cream px-4 py-3 text-lg font-black text-ink outline-none focus:border-brand/60 dark:bg-cream-2"
                  />
                </div>
              </div>

              <div className="mt-5">
                <span className="mb-2 block text-[11px] font-black uppercase tracking-wide text-muted">Tip</span>
                <div className="flex flex-wrap gap-2">
                  {[0, 5, 10, 15, 20].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTip(value)}
                      aria-pressed={tip === value}
                      className={`h-10 min-w-[64px] rounded-full border px-4 text-xs font-bold transition-colors ${
                        tip === value
                          ? 'border-brand-strong bg-brand-strong text-white shadow-brand'
                          : 'border-line bg-cream text-body hover:border-brand/40 hover:text-ink dark:bg-cream-2'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>

              {!split.valid ? (
                <p className="mt-5 flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <FiAlertCircle /> Enter a positive bill amount and at least one person.
                </p>
              ) : (
                <>
                  <dl className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Bill', value: rupees(parseFloat(billTotal), 0) },
                      { label: `Tip ${tip}%`, value: rupees(split.tipValue, 0) },
                      { label: 'Total', value: rupees(split.withTip, 0) },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-line bg-cream p-4 text-center dark:bg-cream-2">
                        <dt className="text-[10px] font-black uppercase tracking-wide text-muted">{item.label}</dt>
                        <dd className="mt-1 text-sm font-black text-ink">{item.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 rounded-2xl border border-brand/25 bg-brand-soft p-6 text-center">
                    <span className="block text-[11px] font-black uppercase tracking-wide text-brand-ink">Each person pays</span>
                    <span className="mt-2 block text-4xl font-black tracking-tight text-brand-ink">{rupees(split.each)}</span>
                    <span className="mt-1.5 block text-xs font-bold text-brand-ink/80">
                      across {split.heads} {split.heads === 1 ? 'person' : 'people'}
                    </span>
                  </div>

                  <Button
                    className="mt-5 w-full justify-center"
                    onClick={() => setToast(`Request for ${rupees(split.each)} sent to ${split.heads - 1 > 0 ? split.heads - 1 : split.heads} friends.`)}
                  >
                    Send requests to the group <FiUsers />
                  </Button>
                </>
              )}
            </div>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="h-full rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-8">
              <h3 className="text-base font-extrabold text-ink">Who owes what</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-body">
                A preview of the request card each person receives in their chat.
              </p>

              <ul className="mt-6 space-y-3">
                {contacts.slice(0, Math.max(Math.min(split.heads || 1, 6), 1)).map((contact, index) => (
                  <li
                    key={contact.name}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-4 dark:bg-cream-2"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-strong text-sm font-black text-white">
                      {contact.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-ink">{contact.name}</span>
                      <span className="block truncate text-[11px] font-semibold text-muted">{contact.upi}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-black text-ink">{split.valid ? rupees(split.each) : '—'}</span>
                      <span
                        className={`block text-[10px] font-black uppercase ${
                          index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {index === 0 ? 'Paid' : 'Pending'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex items-start gap-2 border-t border-line pt-5 text-[11px] leading-relaxed text-muted">
                <FiClock className="mt-0.5 shrink-0" />
                One polite reminder goes out automatically after 48 hours. Nobody gets nagged more than that.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* ACTIVITY                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section id="activity" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Activity"
          title={`${transactions.length} transactions on record`}
          description="Filter by type, search a merchant or note, and export any range for accounting."
        />

        <Reveal from="up" className="mt-12 overflow-hidden rounded-[28px] border border-line bg-cream shadow-card dark:bg-cream-2">
          <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
              {transactionCategories.map((category) => {
                const count =
                  category === 'All'
                    ? transactions.length
                    : transactions.filter((item) => item.category === category).length
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActivityFilter(category)}
                    aria-pressed={activityFilter === category}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                      activityFilter === category
                        ? 'border-brand-strong bg-brand-strong text-white'
                        : 'border-line bg-surface text-body hover:text-ink'
                    }`}
                  >
                    {category} <span className={activityFilter === category ? 'text-white/70' : 'text-muted'}>{count}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <input
                type="text"
                value={activityQuery}
                onChange={(event) => setActivityQuery(event.target.value)}
                placeholder="Search name or note…"
                aria-label="Search transactions"
                className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink outline-none focus:border-brand/60 lg:w-52 placeholder:font-medium placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setToast('Statement export queued — you will get the CSV in chat.')}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-body transition-colors hover:text-ink"
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<FiActivity />}
                title="No transactions match"
                description="Try a different category, or clear the search box to see everything."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setActivityFilter('All')
                      setActivityQuery('')
                    }}
                  >
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {filteredTransactions.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-surface sm:px-6">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg ${
                      item.direction === 'in'
                        ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/12 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.direction === 'in' ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-extrabold text-ink">{item.name}</span>
                      <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] font-black uppercase text-muted">
                        {item.category}
                      </span>
                      {item.status === 'Pending' ? (
                        <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                          Pending
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] font-semibold text-muted">
                      {item.note} · {item.date} · {item.method}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 text-sm font-black ${
                      item.direction === 'in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.direction === 'in' ? '+' : '−'}
                    {rupees(item.amount, 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CARDS                                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section id="cards" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Your cards"
          title="Three cards, independent controls"
          description="Freeze any card in one tap, reveal its details when you need them, and cap what it can spend each month."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {cards.map((card, index) => {
            const isFrozen = frozen.includes(card.id)
            const isRevealed = revealed.includes(card.id)
            const usage = (card.spent / card.monthlyLimit) * 100

            return (
              <Reveal key={card.id} from="up" delay={index * 0.07} className="h-full">
                <div className="flex h-full flex-col rounded-[26px] border border-line bg-surface p-5 shadow-soft">
                  <div
                    className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${card.gradient} p-5 text-white transition-all duration-300 ${
                      isFrozen ? 'opacity-55 saturate-50' : ''
                    }`}
                  >
                    <div className="kt-hero-grid absolute inset-0 opacity-25" aria-hidden="true" />

                    <div className="relative flex items-start justify-between">
                      <div>
                        <div className="text-sm font-extrabold">{card.label}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-white/70">{card.kind}</div>
                      </div>
                      {isFrozen ? (
                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black uppercase backdrop-blur">
                          Frozen
                        </span>
                      ) : (
                        <FiCreditCard className="text-xl opacity-70" />
                      )}
                    </div>

                    <div className="relative mt-8 font-mono text-sm tracking-wider">
                      {isRevealed ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}
                    </div>

                    <div className="relative mt-4 flex items-center justify-between font-mono text-[11px] text-white/80">
                      <span>EXP {card.expiry}</span>
                      <span>CVV {isRevealed ? card.cvv : '•••'}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted">
                      <span>Monthly spend</span>
                      <span className="text-ink">
                        {rupees(card.spent, 0)} / {rupees(card.monthlyLimit, 0)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={`h-full rounded-full ${usage > 80 ? 'bg-rose-500' : 'bg-brand-strong'}`}
                        style={{ width: `${Math.min(usage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleReveal(card.id)}
                      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line text-xs font-bold text-body transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      {isRevealed ? <FiEyeOff /> : <FiEye />}
                      {isRevealed ? 'Hide' : 'Reveal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFreeze(card.id)}
                      className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isFrozen
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-brand-strong text-white shadow-brand hover:bg-brand-strong-hover'
                      }`}
                    >
                      <FiLock /> {isFrozen ? 'Unfreeze' : 'Freeze'}
                    </button>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-14">
          <SectionHead eyebrow="Payment methods" title="Every way you might want to pay" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paymentMethods.map((method, index) => (
              <Reveal key={method.name} from="up" delay={Math.min(index * 0.04, 0.2)} className="h-full">
                <div className="flex h-full flex-col rounded-[22px] border border-line bg-surface p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <span className="text-3xl">{method.icon}</span>
                  <h3 className="mt-3 text-sm font-extrabold text-ink">{method.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-body">{method.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* BILLS                                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section id="bills" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Bills & recharges"
          title="Twelve categories, one reminder each"
          description="Set autopay where it makes sense and get a confirmation before every debit — never a surprise."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {billCategories.map((bill, index) => (
            <Reveal key={bill.name} from="up" delay={Math.min(index * 0.03, 0.2)} className="h-full">
              <button
                type="button"
                onClick={() => setToast(`${bill.name} opened — biller list and due dates loaded.`)}
                className="group flex h-full w-full flex-col items-start rounded-[22px] border border-line bg-cream p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-card dark:bg-cream-2"
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{bill.icon}</span>
                <span className="mt-3 text-sm font-extrabold text-ink">{bill.name}</span>
                <span className="mt-1 text-[11px] font-semibold leading-relaxed text-muted">{bill.due}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* GOALS                                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section id="goals" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Savings goals"
          title="Ring-fence money for the thing you are saving for"
          description="Allocated money is kept out of your spending balance — and you can pull it back whenever you like."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {goals.map((goal, index) => {
            const progress = (goal.saved / goal.target) * 100
            const complete = goal.saved >= goal.target
            return (
              <Reveal key={goal.id} from="up" delay={index * 0.06} className="h-full">
                <div className="flex h-full flex-col rounded-[26px] border border-line bg-surface p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-2xl">
                      {goal.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-extrabold text-ink">{goal.name}</h3>
                      <p className="text-[11px] font-bold text-muted">
                        {rupees(goal.saved, 0)} of {rupees(goal.target, 0)}
                      </p>
                    </div>
                    {complete ? (
                      <span className="shrink-0 rounded-full bg-emerald-500/12 px-3 py-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        Reached
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${complete ? 'bg-emerald-500' : 'bg-brand-strong'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-black text-muted">
                      <span>{progress.toFixed(0)}% funded</span>
                      <span>{complete ? 'Goal met' : `${rupees(goal.target - goal.saved, 0)} to go`}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                    {[500, 1000, 5000].map((value) => (
                      <button
                        key={value}
                        type="button"
                        disabled={complete}
                        onClick={() => addToGoal(goal.id, value)}
                        className="rounded-full border border-line px-4 py-2 text-xs font-bold text-body transition-colors hover:border-brand/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Add {rupees(value, 0)}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* REWARDS                                                           */}
      {/* ---------------------------------------------------------------- */}
      <Section id="rewards" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Rewards"
          title="Cashback with the caps written on the front"
          description="Plain offers, visible limits, real expiry dates. No points system to decode."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward, index) => (
            <Reveal key={reward.code} from="up" delay={Math.min(index * 0.05, 0.25)} className="h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-line bg-cream p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:bg-cream-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink">
                    <FiGift />
                  </span>
                  <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-black uppercase text-muted">
                    Ends {reward.expires}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-ink">{reward.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{reward.desc}</p>

                <button
                  type="button"
                  onClick={() => copyCode(reward.code)}
                  className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-brand/40 bg-brand-soft px-4 py-3 text-left transition-colors hover:bg-brand-soft/70"
                >
                  <span className="font-mono text-sm font-black tracking-wider text-brand-ink">{reward.code}</span>
                  <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-brand-ink">
                    <FiCopy /> Copy
                  </span>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CRYPTO VAULT                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section id="crypto" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Crypto vault"
          title="Non-custodial, behind your device passkey"
          description="Signing keys live in the secure element on your phone. Nobody else can move these assets — including us."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Reveal from="up">
            <div className="rounded-[28px] border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wide text-muted">Vault value</span>
                  <div className="mt-1 text-3xl font-black tracking-tight text-ink sm:text-4xl">{rupees(cryptoTotal, 0)}</div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-3 py-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                  <FiTrendingUp /> +3.42% today
                </span>
              </div>

              <ul className="mt-2 divide-y divide-line">
                {cryptoHoldings.map((holding) => (
                  <li key={holding.symbol} className="flex items-center gap-4 py-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-xs font-black text-brand-ink">
                      {holding.symbol}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-ink">{holding.name}</div>
                      <div className="truncate text-[11px] font-semibold text-muted">
                        {holding.qty} {holding.symbol}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-black text-ink">{rupees(holding.value, 0)}</div>
                      <div
                        className={`text-[11px] font-extrabold ${
                          holding.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {holding.change >= 0 ? '+' : ''}
                        {holding.change.toFixed(2)}%
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal from="up" delay={0.08}>
            <div className="flex h-full flex-col gap-4">
              {[
                {
                  icon: <FiLock />,
                  title: 'Keys never leave your device',
                  desc: 'Signing happens inside the secure element. No server ever sees a private key.',
                },
                {
                  icon: <FiShield />,
                  title: 'Passkey approval per transfer',
                  desc: 'Face or fingerprint authorises each transaction, with the destination shown in full.',
                },
                {
                  icon: <FiAlertCircle />,
                  title: 'Recovery is on you',
                  desc: 'Non-custodial means we cannot restore access if every recovery share is lost. Store them apart.',
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-1 items-start gap-4 rounded-[24px] border border-line bg-surface p-6 shadow-soft">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-lg text-brand-ink">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* LIMITS & FEES                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Section id="limits" className="scroll-mt-36 bg-surface">
        <SectionHead
          eyebrow="Limits & fees"
          title="Published in full, not buried in a PDF"
          description="Every limit and every charge that can apply to your account, on one page."
        />

        <Reveal from="up" className="mt-12 overflow-hidden rounded-[26px] border border-line bg-cream shadow-card dark:bg-cream-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-[11px] font-black uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-5 py-4">Action</th>
                  <th scope="col" className="py-4">Limit</th>
                  <th scope="col" className="py-4">Fee</th>
                  <th scope="col" className="py-4 pr-5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {limitsTable.map((row) => (
                  <tr key={row.action} className="transition-colors hover:bg-surface">
                    <td className="px-5 py-4 font-extrabold text-ink">{row.action}</td>
                    <td className="py-4 font-bold text-body">{row.limit}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                          row.fee === 'Free' || row.fee === 'Free for you'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/12 dark:text-amber-300'
                        }`}
                      >
                        {row.fee}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-[13px] font-semibold text-muted">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* SECURITY                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section id="security" className="scroll-mt-36 border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead
          eyebrow="Security"
          title="Six controls doing the real work"
          description="Not badges on a page — switches and defaults that change what an attacker can actually do."
        />

        <FeatureGrid
          className="mt-12"
          items={securityFeatures.map((item, index) => ({ ...item, icon: SECURITY_ICONS[index] }))}
        />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FEATURES + STEPS                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Section className="bg-surface">
        <SectionHead eyebrow="What you get" title="A wallet that fits inside a conversation" />
        <FeatureGrid className="mt-12" items={walletFeatures.map((item, index) => ({ ...item, icon: FEATURE_ICONS[index] }))} />

        <div className="mt-20">
          <SectionHead eyebrow="How a payment works" title="Four steps, about three seconds" />
          <Steps className="mt-12" items={walletSteps.map((item, index) => ({ ...item, icon: STEP_ICONS[index] }))} />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TESTIMONIALS                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-y border-line bg-cream dark:bg-cream-2">
        <SectionHead eyebrow="Customers" title="What changed after switching" />
        <Testimonials className="mt-12" items={walletTestimonials} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="faq" container={false} className="scroll-mt-36 bg-surface">
        <Container maxW="max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Money questions, answered plainly" />
          <div className="mt-12">
            <FaqAccordion items={walletFaqs} placeholder="Search the FAQ…" />
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA + RELATED                                                     */}
      {/* ---------------------------------------------------------------- */}
      <CtaBand
        eyebrow="Get started"
        title="Payments that live where your conversations already do"
        description="Zero-fee transfers, passkey approval and encrypted notes — set up in under two minutes."
        actions={
          <>
            <Button size="lg" variant="white" onClick={openDownloadModal}>
              Download KT Messengers
            </Button>
            <Button size="lg" variant="onDark" onClick={() => document.getElementById('send')?.scrollIntoView({ behavior: 'smooth' })}>
              Try the demo transfer
            </Button>
          </>
        }
        points={['₹0 on P2P transfers', 'Passkey on every payment', 'Instant card freeze', 'Exportable statements']}
      />

      <Section className="bg-surface">
        <SectionHead eyebrow="Keep exploring" title="More of KT Messengers" />
        <RelatedPages className="mt-12" items={RELATED} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* RECEIPT MODAL                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Modal
        open={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        eyebrow="Payment successful"
        title="Receipt"
        size="sm"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setToast('Receipt saved to your encrypted notes.')}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-xs font-bold text-body transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <FiDownload /> Save receipt
            </button>
            <Button onClick={() => setReceipt(null)}>Done</Button>
          </div>
        }
      >
        {receipt ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/12 text-3xl text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle />
            </span>

            <div className="mt-5 text-3xl font-black tracking-tight text-ink">{rupees(receipt.amount)}</div>
            <p className="mt-1.5 text-sm font-semibold text-body">
              sent to <span className="font-extrabold text-ink">{receipt.name}</span>
            </p>

            <dl className="mt-7 divide-y divide-line rounded-2xl border border-line bg-cream text-left dark:bg-cream-2">
              {[
                { label: 'To', value: receipt.contact?.upi ?? receipt.name },
                { label: 'Note', value: receipt.note },
                { label: 'Method', value: `${receipt.method} · zero fee` },
                { label: 'Reference', value: receipt.id.toUpperCase() },
                { label: 'Status', value: 'Completed' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-[11px] font-black uppercase tracking-wide text-muted">{row.label}</dt>
                  <dd className="truncate text-xs font-bold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 flex items-start gap-2 text-left text-[11px] leading-relaxed text-muted">
              <FiLock className="mt-0.5 shrink-0" />
              A signed copy of this receipt is delivered into the chat thread. The note stays end-to-end encrypted.
            </p>
          </div>
        ) : null}
      </Modal>

      <Toast message={toast} onClose={() => setToast(null)} />
    </MainLayout>
  )
}

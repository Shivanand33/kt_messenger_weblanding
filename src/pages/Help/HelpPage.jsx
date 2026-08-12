import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown, FiSearch, FiLink, FiX, FiFlag, FiShield, FiCloud, FiMessageCircle, FiUsers, FiBriefcase } from 'react-icons/fi'
import {
  MdArticle, MdFileDownload, MdHowToReg, MdAlternateEmail, MdDevices, MdHelpOutline, MdContacts, MdRadioButtonChecked,
  MdFlag, MdChat, MdStorefront, MdCall, MdGroups, MdCampaign, MdLock, MdPerson, MdCreditCard, MdBusinessCenter,
} from 'react-icons/md'
import { FaAndroid, FaApple, FaWindows } from 'react-icons/fa'
import { ThemeToggle } from '../../components/common/ThemeToggle/ThemeToggle'
import { Logo } from '../../components/common/Logo/Logo'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { PhoneChatMockup } from '../../components/mockups/PhoneChatMockup'
import { useSwipeTheme } from '../../hooks/useSwipeTheme'

const D = <MdArticle />

const helpTree = [
  {
    label: 'Get Started', icon: <MdFlag />, subs: [
      { label: 'Download and Installation', icon: <MdFileDownload />, articles: ['How to download or uninstall KT Messenger', 'About supported operating systems', 'About supported devices', 'About rooted phones and custom ROMs', 'Ending support for legacy phones'] },
      { label: 'Registration', icon: <MdHowToReg />, articles: ['Parent-Managed Accounts', 'How to register your phone number', 'About registration and two-step verification', 'How to register with a phone call', 'About automatic phone number verification', "Can't complete registration"] },
      { label: 'Usernames', icon: <MdAlternateEmail />, articles: ['About usernames', 'How to set a username', 'Username privacy'] },
      { label: 'Linked Devices', icon: <MdDevices />, articles: ['About linked devices', 'How to link a device', 'Log out of a linked device'] },
      { label: 'Troubleshooting', icon: <MdHelpOutline />, articles: ['App keeps crashing', 'Notifications are not working', "Can't send messages"] },
      { label: 'Contacts', icon: <MdContacts />, articles: ['How to add a contact', 'A contact is not showing', 'Blocking a contact'] },
      { label: 'Status', icon: <MdRadioButtonChecked />, articles: ['About Status', 'How to post a Status', 'Status privacy'] },
    ],
  },
  {
    label: 'Chats', icon: <MdChat />, subs: [
      { label: 'Sending Messages', icon: D, articles: ['How to send a message', 'Formatting your messages', 'Message reactions'] },
      { label: 'Photos, Videos & Files', icon: D, articles: ['Sending photos and videos', 'Sending documents'] },
      { label: 'Voice Messages', icon: D, articles: ['How to send a voice message', 'Playback speed'] },
      { label: 'Disappearing Messages', icon: D, articles: ['About disappearing messages', 'Turning it on or off'] },
      { label: 'Chat Backup', icon: D, articles: ['How to back up your chats', 'How to restore a backup'] },
    ],
  },
  {
    label: 'Connect with Businesses', icon: <MdStorefront />, subs: [
      { label: 'Messaging a Business', icon: D, articles: ['About business messaging', 'How business messaging works'] },
      { label: 'Business Payments', icon: D, articles: ['Paying a business', 'Payment safety'] },
      { label: 'Managing Business Chats', icon: D, articles: ['Muting a business', 'Reporting a business'] },
    ],
  },
  {
    label: 'Voice and Video Calls', icon: <MdCall />, subs: [
      { label: 'Making a Call', icon: D, articles: ['How to make a voice call', 'How to make a video call'] },
      { label: 'Group Calls', icon: D, articles: ['Starting a group call', 'Adding people to a call'] },
      { label: 'Call Links', icon: D, articles: ['About call links', 'Creating a call link'] },
      { label: 'Troubleshooting Calls', icon: D, articles: ['Call quality issues', "Can't make calls"] },
    ],
  },
  {
    label: 'Communities', icon: <MdGroups />, subs: [
      { label: 'About Communities', icon: D, articles: ['What is a community', 'Community guidelines'] },
      { label: 'Creating a Community', icon: D, articles: ['How to create a community', 'Adding groups'] },
      { label: 'Managing Members', icon: D, articles: ['Adding members', 'Removing members'] },
    ],
  },
  {
    label: 'Channels', icon: <MdCampaign />, subs: [
      { label: 'About Channels', icon: D, articles: ['What are channels', 'Channel privacy'] },
      { label: 'Following Channels', icon: D, articles: ['How to follow a channel', 'Muting a channel'] },
      { label: 'Creating a Channel', icon: D, articles: ['How to create a channel', 'Posting updates'] },
    ],
  },
  {
    label: 'Privacy, Safety, and Security', icon: <MdLock />, subs: [
      { label: 'Privacy Settings', icon: D, articles: ['Managing your privacy', 'Last seen and online'] },
      { label: 'Blocking Contacts', icon: D, articles: ['How to block a contact', 'How to unblock a contact'] },
      { label: 'Two-Step Verification', icon: D, articles: ['About two-step verification', 'Turning it on'] },
      { label: 'Staying Safe', icon: D, articles: ['Avoiding scams', 'Reporting a problem'] },
    ],
  },
  {
    label: 'Accounts and Account Bans', icon: <MdPerson />, subs: [
      { label: 'Managing Your Account', icon: D, articles: ['Changing your number', 'Updating your profile'] },
      { label: 'Deleting Your Account', icon: D, articles: ['How to delete your account', 'What happens when you delete'] },
      { label: 'Banned Accounts', icon: D, articles: ['About banned accounts', 'Requesting a review'] },
    ],
  },
  {
    label: 'Payments', icon: <MdCreditCard />, subs: [
      { label: 'Sending Payments', icon: D, articles: ['How to send a payment', 'Adding a payment method'] },
      { label: 'Payment History', icon: D, articles: ['Viewing your history', 'Payment receipts'] },
      { label: 'Payment Security', icon: D, articles: ['Keeping payments secure', 'Reporting an issue'] },
    ],
  },
  {
    label: 'KT for Business', icon: <MdBusinessCenter />, subs: [
      { label: 'Business App', icon: D, articles: ['About the Business app', 'Setting up your catalog'] },
      { label: 'Business Platform', icon: D, articles: ['About the Business Platform', 'Getting started'] },
      { label: 'Get Verified', icon: D, articles: ['About verification', 'How to get verified'] },
    ],
  },
]

const topics = [
  { icon: <FiFlag />, title: 'Get Started', desc: 'Learn how to set up and start using KT Messenger.', to: '/' },
  { icon: <FiShield />, title: 'Safety and Security', desc: 'Your privacy and security matter. Learn how to stay safe on KT Messenger.', to: '/privacy' },
  { icon: <FiCloud />, title: 'Back Up or Restore Chats', desc: 'Learn how to back up and restore your chat history across devices.', to: null },
  { icon: <FiMessageCircle />, title: 'Chats', desc: 'Send messages, media, and voice notes, and manage every conversation.', to: null },
  { icon: <FiUsers />, title: 'Communities & Channels', desc: 'Create and manage groups, communities, and channels with ease.', to: '#groups' },
  { icon: <FiBriefcase />, title: 'KT for Business', desc: 'Tools to connect with customers and grow your business.', to: '#business' },
]

const popularArticles = [
  'How to make a video call',
  'How to stay safe on KT Messenger',
  'About temporarily restricted accounts',
  'About two-step verification',
  'How to restore your chat history',
  'Received a verification code you did not request',
  'Managing your notifications and privacy',
]

const platformTabs = [
  { label: 'Android', icon: <FaAndroid /> },
  { label: 'iOS', icon: <FaApple /> },
  { label: 'Mac', icon: <FaApple /> },
  { label: 'Windows', icon: <FaWindows /> },
]

const tabbedArticles = ['How to download or uninstall KT Messenger']

// Every entry resolves to a route, or to a route plus a section id — nothing
// is left as a dead anchor. Social links open the Community page's verified
// channels section, where the official accounts are listed.
const footerColumns = [
  {
    title: 'Use KT Messenger',
    links: [
      { label: 'Features', to: '#features' },
      { label: 'KT Web', to: 'https://web.ktmessenger.com/auth/qr' },
      { label: 'Download', to: '/apps' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Business', to: '#business' },
      { label: 'Security', to: '/security' },
      { label: 'Privacy & Terms', to: '/privacy' },
    ],
  },
  {
    title: 'Get In Touch',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Facebook', to: '/community#social' },
      { label: 'X (Twitter)', to: '/community#social' },
    ],
  },
]

const proseClass = 'space-y-5 text-[15px] leading-7 text-body'

function ArticleBody({ title, tab }) {
  if (title === 'How to download or uninstall KT Messenger') {
    const store = { Android: 'Google Play Store', iOS: 'App Store', Mac: 'Mac App Store', Windows: 'Microsoft Store' }[tab]
    const action = tab === 'Android' || tab === 'Windows' ? 'Install' : 'Get'
    return (
      <div className={proseClass}>
        <h3 className="text-xl font-bold text-ink">Download KT Messenger</h3>
        <p>Open the {store} on your {tab} device and search for KT Messenger, then tap {action} to begin the download.</p>
        <div className="grid h-44 w-44 place-items-center rounded-2xl border-2 border-dashed border-line bg-surface-2 text-center text-sm font-medium text-muted">
          Scan to download<br />KT Messenger
        </div>
        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-ink">
          <li>Find KT Messenger in the {store}, then tap {action}.</li>
          <li>Open the app and review the Terms of Service, then tap <strong>Agree and continue</strong>.</li>
          <li>Register your phone number to start chatting.</li>
        </ol>
        <h3 className="text-xl font-bold text-ink">Uninstall KT Messenger</h3>
        <p>Press and hold the KT Messenger icon on your {tab} device, then choose <strong>Uninstall</strong> or <strong>Remove</strong>. Back up your chats first if you want to keep them.</p>
      </div>
    )
  }
  if (title === 'Parent-Managed Accounts') {
    return (
      <div className={proseClass}>
        <div className="rounded-2xl bg-surface-2 p-6">
          <p className="text-ink">
            Parent-managed accounts let a parent or guardian help a young person set up and look after their KT
            Messenger account. This experience is rolling out in stages and may not be available in your region yet.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Keep KT Messenger updated to the latest version from your app store.</li>
            <li>Follow our blog and Help Center for updates on when it reaches you.</li>
          </ul>
        </div>
        <p>When it becomes available, you can turn it on during registration or from <strong>Settings → Account</strong>.</p>
      </div>
    )
  }
  return (
    <div className={proseClass}>
      <p>This article explains <strong>{title.charAt(0).toLowerCase() + title.slice(1)}</strong> on KT Messenger. Follow the steps below to get set up.</p>
      <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-ink">
        <li>Open KT Messenger and go to <strong>Settings</strong>.</li>
        <li>Select the option related to this topic and follow the on-screen instructions.</li>
        <li>Confirm your choice to save any changes.</li>
      </ol>
      <p>Still need help? Contact our support team from the Help Center and we will be happy to assist.</p>
    </div>
  )
}

function FeedbackWidget() {
  const [state, setState] = useState('ask')
  if (state === 'hidden') return null
  return (
    <div className="fixed bottom-24 right-4 z-40 w-[calc(100%-2rem)] rounded-2xl border border-line bg-surface p-4 shadow-float sm:right-6 sm:w-[340px]">
      <button onClick={() => setState('hidden')} aria-label="Dismiss" className="absolute right-3 top-3 text-muted transition-colors hover:text-ink">
        <FiX />
      </button>
      {state === 'ask' ? (
        <>
          <p className="pr-6 font-bold text-ink">Does this answer your question?</p>
          <div className="mt-3 flex gap-3">
            <button onClick={() => setState('done')} className="flex-1 rounded-lg bg-surface-2 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand-ink">
              🙂 Yes
            </button>
            <button onClick={() => setState('done')} className="flex-1 rounded-lg bg-surface-2 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand-ink">
              🙁 No
            </button>
          </div>
        </>
      ) : (
        <p className="pr-6 font-semibold text-ink">Thanks for your feedback! 💙</p>
      )}
    </div>
  )
}

function HelpFooter({ onNav }) {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="px-5 py-14 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-muted">{column.title}</p>
              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => onNav(link.to)}
                      className="text-left text-[15px] text-ink transition-colors hover:text-brand-ink"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => onNav('/')} aria-label="KT Messenger home" className="self-start">
            <Logo />
          </button>
          <p className="text-sm text-muted">© 2026 KT Messenger</p>
        </div>
      </div>
    </footer>
  )
}

export function HelpPage() {
  const navigate = useNavigate()
  const { handlers } = useSwipeTheme()
  // Sidebar starts fully collapsed — no category or sub-category is opened
  // for the reader. Opening an article still expands its branch via
  // selectArticle() below.
  const [expandedCat, setExpandedCat] = useState(null)
  const [expandedSub, setExpandedSub] = useState(null)
  const [activeArticle, setActiveArticle] = useState(null)
  const [activeTab, setActiveTab] = useState('Android')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const goTo = (target) => {
    if (!target) return

    // External URL (e.g. the KT Web app) — leave the SPA.
    if (target.startsWith('http')) {
      window.location.href = target
      return
    }

    // Bare "#section" — a block on the home page.
    if (target.startsWith('#')) {
      navigate('/')
      window.setTimeout(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
      return
    }

    // "/route" or "/route#section" — navigate, then scroll once it has mounted.
    const [path, hash] = target.split('#')
    navigate(path)

    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 320)
    }
  }

  const goHelpHome = () => {
    setActiveArticle(null)
    window.scrollTo(0, 0)
  }

  const selectArticle = (catLabel, subLabel, title) => {
    if (catLabel) setExpandedCat(catLabel)
    if (subLabel) setExpandedSub(subLabel)
    setActiveArticle({ title })
    setActiveTab('Android')
    setCopied(false)
    window.scrollTo(0, 0)
  }

  const copyLink = () => {
    const url = `${window.location.origin}/help`
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }).catch(() => {})
    }
  }

  const hasTabs = activeArticle && tabbedArticles.includes(activeArticle.title)

  return (
    <div {...handlers} className="min-h-screen overflow-x-clip bg-cream text-body">
      {/* help header */}
      <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/')} aria-label="KT Messenger home">
              <Logo showWordmark={false} />
            </button>
            <button onClick={goHelpHome} className="text-lg font-bold text-ink">Help Center</button>
          </div>
          <div className="flex items-center gap-3">
            {activeArticle ? (
              <label className="hidden items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 md:flex">
                <FiSearch className="text-muted" />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  aria-label="Search help articles"
                  className="w-44 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </label>
            ) : null}
            <button className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-body transition-colors hover:text-ink">
              English (US)
            </button>
          </div>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[360px_1fr]">
        {/* sidebar */}
        <aside className="border-b border-line lg:border-b-0 lg:border-r">
          <nav className="px-4 py-6 lg:sticky lg:top-16 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:px-5">
            {helpTree.map((category) => {
              const catOpen = expandedCat === category.label
              return (
                <div key={category.label}>
                  <button
                    onClick={() => setExpandedCat(catOpen ? null : category.label)}
                    aria-expanded={catOpen}
                    className={`flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors ${catOpen ? 'bg-surface-2' : 'hover:bg-surface-2'}`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-[20px] text-cream">{category.icon}</span>
                    <span className="flex-1 text-[15px] font-bold text-ink">{category.label}</span>
                    <FiChevronDown className={`shrink-0 text-base text-muted transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {catOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="overflow-hidden pl-2"
                      >
                        {category.subs.map((sub) => {
                          const subOpen = expandedSub === sub.label
                          return (
                            <div key={sub.label}>
                              <button
                                onClick={() => setExpandedSub(subOpen ? null : sub.label)}
                                aria-expanded={subOpen}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
                              >
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-base text-ink">{sub.icon}</span>
                                <span className="flex-1 text-[14px] font-semibold text-ink">{sub.label}</span>
                                <FiChevronDown className={`shrink-0 text-xs text-muted transition-transform duration-200 ${subOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence initial={false}>
                                {subOpen ? (
                                  <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                    className="overflow-hidden"
                                  >
                                    {sub.articles.map((title) => {
                                      const active = activeArticle?.title === title
                                      return (
                                        <li key={title}>
                                          <button
                                            onClick={() => selectArticle(category.label, sub.label, title)}
                                            className={`block w-full rounded-lg py-2 pl-[3.25rem] pr-3 text-left text-sm transition-colors ${active ? 'bg-brand-soft font-semibold text-brand-ink' : 'text-body hover:text-brand-ink'}`}
                                          >
                                            {title}
                                          </button>
                                        </li>
                                      )
                                    })}
                                  </motion.ul>
                                ) : null}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>
        </aside>

        {/* main content + footer (right column) */}
        <div className="min-w-0">
          <main className="px-5 py-10 lg:px-12 lg:py-12">
            {activeArticle ? (
              <Reveal from="up" key={activeArticle.title}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-ink lg:text-4xl">{activeArticle.title}</h1>
                  <button
                    onClick={copyLink}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
                  >
                    <FiLink /> {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>

                {hasTabs ? (
                  <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 border-b border-line">
                    {platformTabs.map((tab) => (
                      <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${activeTab === tab.label ? 'border-brand text-brand-ink' : 'border-transparent text-body hover:text-ink'}`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-8 max-w-3xl">
                  <ArticleBody title={activeArticle.title} tab={activeTab} />
                </div>
              </Reveal>
            ) : (
              <>
                <Reveal from="up">
                  <h1 className="text-[1.9rem] font-bold tracking-tight text-ink sm:text-3xl">How can we help you?</h1>
                  <label className="mt-6 flex items-center gap-3 rounded-2xl bg-surface-2 px-5 py-4 transition-colors focus-within:ring-2 focus-within:ring-brand/40">
                    <FiSearch className="text-xl text-muted" />
                    <input
                      type="text"
                      placeholder="Search help articles..."
                      aria-label="Search help articles"
                      className="flex-1 bg-transparent text-ink outline-none placeholder:text-muted"
                    />
                  </label>
                </Reveal>

                <h2 className="mt-12 text-2xl font-bold text-ink">Popular Topics</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {topics.map((topic, index) => (
                    <Reveal key={topic.title} from="up" delay={index * 0.04} className="h-full">
                      <button
                        onClick={() => goTo(topic.to)}
                        className="flex h-full w-full flex-col rounded-2xl border border-transparent bg-surface-2 p-6 text-left transition duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-card"
                      >
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-ink">{topic.icon}</span>
                        <h3 className="mt-5 text-lg font-bold text-ink">{topic.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-body">{topic.desc}</p>
                      </button>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-14">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-ink">Popular Articles</h2>
                    <ul className="mt-6 space-y-4">
                      {popularArticles.map((article) => (
                        <li key={article}>
                          <button
                            onClick={() => selectArticle(null, null, article)}
                            className="text-left text-[15px] font-semibold text-brand-ink transition-colors hover:text-brand-strong hover:underline"
                          >
                            {article}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <PhoneChatMockup className="mx-auto hidden lg:block lg:w-[220px]" />
                </div>
              </>
            )}
          </main>
          <HelpFooter onNav={goTo} />
        </div>
      </div>

      {activeArticle ? <FeedbackWidget key={activeArticle.title} /> : null}
      <ThemeToggle />
    </div>
  )
}

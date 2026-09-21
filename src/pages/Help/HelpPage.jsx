import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronDown, FiSearch, FiLink, FiX, FiFlag, FiShield, FiCloud, FiMessageCircle, FiUsers, FiBriefcase, FiChevronRight } from 'react-icons/fi'
import {
  MdArticle, MdFileDownload, MdHowToReg, MdAlternateEmail, MdDevices, MdHelpOutline, MdContacts, MdRadioButtonChecked,
  MdFlag, MdChat, MdStorefront, MdCall, MdGroups, MdCampaign, MdLock, MdPerson, MdCreditCard, MdBusinessCenter,
} from 'react-icons/md'
import { FaAndroid, FaApple, FaWindows } from 'react-icons/fa'
import { ThemeToggle } from '../../components/common/ThemeToggle/ThemeToggle'
import { Logo } from '../../components/common/Logo/Logo'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { Button } from '../../components/common/Button/Button'
import { PhoneChatMockup } from '../../components/mockups/PhoneChatMockup'
import { useSwipeTheme } from '../../hooks/useSwipeTheme'
import { useLanguage } from '../../context/LanguageContext'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { useSeo } from '../../hooks/useSeo'
import { useRemoteContent } from '../../hooks/useRemoteContent'
import { api } from '../../services/apiClient'
import { parseBody } from '../../utils/parseBody'
import { useModal } from '../../context/ModalContext'
import qrAndroid from '../../assets/images/help/qr-android.svg'
import qrIos from '../../assets/images/help/qr-ios.svg'

const D = <MdArticle />

// Help Center categories are managed in admin, where the icon is a free-text
// name. Anything not listed here (including a blank one) falls back to the
// generic article glyph, so an unknown name can never break the sidebar.
const HELP_ICONS = {
  flag: <MdFlag />,
  chat: <MdChat />,
  call: <MdCall />,
  lock: <MdLock />,
  groups: <MdGroups />,
  campaign: <MdCampaign />,
  person: <MdPerson />,
  storefront: <MdStorefront />,
  business: <MdBusinessCenter />,
  payments: <MdCreditCard />,
  devices: <MdDevices />,
  contacts: <MdContacts />,
  help: <MdHelpOutline />,
}

const helpIcon = (name) => HELP_ICONS[String(name || '').trim().toLowerCase()] || D

/**
 * Reshape GET /help/tree into exactly the structure the sidebar already
 * renders: icons become elements and articles become plain titles, so the
 * markup below is identical whether the data came from admin or the
 * hardcoded fallback.
 */
function normalizeHelpTree(remote) {
  return remote.map((category, ci) => ({
    // Two categories may legitimately share a label, so the position makes the
    // key unique — otherwise React collides and both branches expand together.
    key: `c${ci}-${category.slug || category.label}`,
    label: category.label,
    icon: helpIcon(category.icon),
    subs: (category.subs || []).map((sub, si) => ({
      key: `s${ci}-${si}-${sub.slug || sub.label}`,
      label: sub.label,
      icon: helpIcon(sub.icon),
      articles: (sub.articles || []).map((a) => a.title),
      // Kept by position so each article opens at its own admin slug, even
      // when two articles share a title.
      slugs: (sub.articles || []).map((a) => a.slug || ''),
    })),
  }))
}

/**
 * Same rules as the backend's slugify(), so the URL built here for a title is
 * the slug the admin stores for it. Used for the hardcoded fallback articles.
 */
function slugify(input = '') {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Give the hardcoded fallback the same key shape as the admin tree. */
function withKeys(local) {
  return local.map((category, ci) => ({
    ...category,
    key: `c${ci}-${category.label}`,
    subs: category.subs.map((sub, si) => ({ ...sub, key: `s${ci}-${si}-${sub.label}` })),
  }))
}

/** title -> slug, so selecting an admin article can fetch its real body. */
function buildSlugIndex(remote) {
  const index = {}
  for (const category of remote) {
    for (const sub of category.subs || []) {
      for (const a of sub.articles || []) {
        if (a.title && a.slug) index[a.title] = a.slug
      }
    }
  }
  return index
}

const helpTree = [
  {
    label: 'Get Started', icon: <MdFlag />, subs: [
      { label: 'Download and Installation', icon: <MdFileDownload />, articles: ['How to download or uninstall KT Messenger', 'About supported operating systems', 'About supported devices', 'About rooted phones and custom ROMs', 'Ending support for legacy phones'] },
      { label: 'Registration', icon: <MdHowToReg />, articles: ['Parent Managed Accounts', 'How to register your phone number', 'About registration and two step verification', 'How to register with a phone call', 'About automatic phone number verification', "Can't complete registration"] },
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
      { label: 'Two Step Verification', icon: D, articles: ['About two step verification', 'Turning it on'] },
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
  'About two step verification',
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

// Articles shown with platform tabs, and which tabs each one offers.
const tabbedArticles = {
  'How to download or uninstall KT Messenger': ['Android', 'iOS', 'Mac', 'Windows'],
  'About supported devices': ['Android', 'iOS'],
}

// Per-platform copy for the download / uninstall article. Phones get a store
// QR code to scan; computers get the download button instead, because a
// computer's own camera cannot scan a code shown on its own screen.
const downloadGuides = {
  Android: {
    store: 'Google Play Store',
    url: 'https://play.google.com/store/apps/details?id=com.ogoul.kalamtime',
    qr: qrAndroid,
    install: ['Scan the QR code above, or open the Google Play Store and search for KT Messenger.', 'Tap Install and wait for the download to finish.'],
    uninstall: [
      'Touch and hold the KT Messenger icon on your home screen or in your app drawer.',
      'Tap Uninstall (or drag the icon to Uninstall).',
      'Tap OK to confirm.',
    ],
  },
  iOS: {
    store: 'App Store',
    url: 'https://apps.apple.com/in/app/kt-messenger/id6478195913',
    qr: qrIos,
    install: ['Scan the QR code above, or open the App Store and search for KT Messenger.', 'Tap Get, then confirm with Face ID, Touch ID or your Apple ID password.'],
    uninstall: [
      'Touch and hold the KT Messenger icon on your home screen.',
      'Tap Remove App.',
      'Tap Delete App, then tap Delete to confirm.',
    ],
  },
  Mac: {
    install: ['Click Download for Mac above to see the official download options.', 'Open the downloaded file and move KT Messenger to your Applications folder.'],
    uninstall: [
      'Quit KT Messenger.',
      'Open Finder and go to Applications.',
      'Drag KT Messenger to the Bin, or right-click it and choose Move to Bin.',
    ],
  },
  Windows: {
    install: ['Click Download for Windows above to download the KT Messenger installer.', 'Open the downloaded file and follow the on-screen steps to install.'],
    uninstall: [
      'Open Start, then go to Settings > Apps > Installed apps.',
      'Find KT Messenger in the list and click the ... (more) button next to it.',
      'Click Uninstall, then click Uninstall again to confirm.',
    ],
  },
}

const supportedSystems = [
  'Android 10.0 and later',
  'iOS 16.6 and later',
  'iPadOS 16.6 and later',
  'macOS 13.5 and later (Mac devices with Apple Silicon)',
  'visionOS 1.0 and later',
]

// Articles whose built-in guide is kept on screen instead of the backend seed
// text used for articles the admin has not written yet; any real body written
// in admin still takes over.
const builtInGuides = ['How to download or uninstall KT Messenger', 'About supported operating systems', 'About supported devices', 'About rooted phones and custom ROMs', 'Ending support for legacy phones']
const isSeedPlaceholder = (body) => /Manage the full content from the admin panel/i.test(body)

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
    ],
  },
]

const proseClass = 'space-y-5 text-[15px] leading-7 text-body'

/**
 * Body written in the admin Help Center. Bodies arrive as one string that may
 * be HTML or markdown-ish, so they go through the same parser the Blog uses —
 * which strips every tag rather than injecting raw HTML.
 */
function AdminArticleBody({ body }) {
  const blocks = parseBody(body)
  if (!blocks.length) return null

  return (
    <div className={proseClass}>
      {blocks.map((block, i) => {
        if (block.type === 'h') {
          return <h3 key={i} className="text-xl font-bold text-ink">{block.text}</h3>
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5">
              {block.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          )
        }
        return <p key={i}>{block.text}</p>
      })}
    </div>
  )
}

/** Grey "Related Resources" box; each link opens another Help Center article. */
function RelatedResources({ links, onOpenArticle }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-6">
      <h2 className="text-xl font-bold text-ink">Related Resources</h2>
      {/* `!` because the unlayered global `ul` reset outranks Tailwind utilities. */}
      <ul className="mt-3! list-disc! space-y-2 pl-5!">
        {links.map(([label, article]) => (
          <li key={article}>
            <button
              type="button"
              onClick={() => onOpenArticle?.(article)}
              className="text-left font-semibold text-brand-ink transition-colors hover:text-brand-strong hover:underline"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ArticleBody({ title, tab, onOpenArticle }) {
  const { openDownloadModal } = useModal()
  const { t } = useLanguage()
  if (title === 'How to download or uninstall KT Messenger') {
    const guide = downloadGuides[tab] || downloadGuides.Android
    return (
      <div className={proseClass}>
        <h3 className="text-xl font-bold text-ink">{t('Download KT Messenger')}</h3>

        {guide.qr ? (
          <>
            <p>Scan the QR code with your phone&apos;s camera and tap the link to be taken to the KT Messenger download page on the {guide.store}.</p>
            {/* Always black on white, so the code stays scannable in dark mode. */}
            <div className="my-4 inline-block rounded-2xl border border-line bg-white p-3">
              <img
                src={guide.qr}
                alt={`QR code to download KT Messenger from the ${guide.store}`}
                width="200"
                height="200"
                loading="lazy"
                className="block h-[200px] w-[200px]"
              />
            </div>
            <p>
              Already on your {tab} device?{' '}
              <a href={guide.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-ink hover:underline">
                Open KT Messenger on the {guide.store}
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <p>Download KT Messenger for your {tab} computer from the official download options.</p>
            <div className="my-4">
              <Button variant="primary" size="lg" onClick={openDownloadModal}>
                {t('Download for')} {tab} <FiChevronRight />
              </Button>
            </div>
          </>
        )}

        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-ink">
          {guide.install.map((step) => <li key={step}>{step}</li>)}
          <li>Open the app and review the Terms of Service, then {guide.qr ? 'tap' : 'click'} <strong>{t('Agree and continue')}</strong>.</li>
          <li>{guide.qr ? t('Register your phone number to start chatting.') : 'Follow the on-screen steps to log in to your KT Messenger account.'}</li>
        </ol>

        <h3 className="text-xl font-bold text-ink">{t('Uninstall KT Messenger')}</h3>
        <p>Uninstalling removes KT Messenger and its chats from this {tab} device. Back up your chats first if you want to keep them.</p>
        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-ink">
          {guide.uninstall.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p>You can reinstall KT Messenger at any time by following the download steps above.</p>
      </div>
    )
  }
  if (title === 'About supported operating systems') {
    return (
      <div className={proseClass}>
        <p>Currently, KT Messenger supports the following operating systems:</p>
        {/* `!` because the unlayered global `ul` reset outranks Tailwind utilities. */}
        <ul className="list-disc! space-y-2 pl-5! mb-5!">
          {supportedSystems.map((system) => <li key={system}>{system}</li>)}
        </ul>
        <p>Once you have a supported device, download KT Messenger from the appropriate app store and complete the registration process using your phone number.</p>
        <p><strong>Note:</strong> An internet connection is required during registration and verification. We recommend keeping your device and KT Messenger updated to the latest available version.</p>
        <h3 className="text-xl font-bold text-ink">How We Choose What to Support</h3>
        <p>Devices and operating systems change over time, so we regularly review the versions supported by KT Messenger.</p>
        <p>Older operating systems may not support the latest security updates, bug fixes, or features available in newer versions of KT Messenger.</p>
        <h3 className="text-xl font-bold text-ink">What Happens If Your Operating System Is No Longer Supported</h3>
        <p>If your operating system is no longer supported, you may not be able to install or update KT Messenger.</p>
        <p>To continue using KT Messenger, update your device to a supported operating system version.</p>
        <p>We update this article whenever our supported operating system requirements change.</p>
      </div>
    )
  }
  if (title === 'About supported devices') {
    return (
      <div className={proseClass}>
        <p>KT Messenger works on supported Android and Apple devices.</p>
        {tab === 'iOS' ? (
          <>
            <h3 className="text-xl font-bold text-ink">Apple Devices</h3>
            <p>Supported Apple devices include:</p>
            {/* `!` because the unlayered global `ul` reset outranks Tailwind utilities. */}
            <ul className="list-disc! space-y-2 pl-5! mb-5!">
              <li>iPhones running iOS 16.6 and later.</li>
              <li>iPads running iPadOS 16.6 and later.</li>
              <li>Mac devices running macOS 13.5 and later with Apple Silicon (M1 or later).</li>
              <li>Apple Vision devices running visionOS 1.0 and later.</li>
            </ul>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-ink">Android</h3>
            <p>Supported Android devices include:</p>
            {/* `!` because the unlayered global `ul` reset outranks Tailwind utilities. */}
            <ul className="list-disc! space-y-2 pl-5! mb-5!">
              <li>Android phones running Android 10.0 and later.</li>
              <li>Android devices with access to the Google Play Store.</li>
              <li>Android devices with an active internet connection.</li>
            </ul>
          </>
        )}
        <p>We regularly review the devices and operating systems supported by KT Messenger.</p>
        <p>As technology evolves, older devices and operating systems may no longer support the latest KT Messenger features, security updates, and performance improvements.</p>
        <p>If support for your device or operating system changes, we&apos;ll update this article with the latest requirements.</p>
        <div className="rounded-2xl bg-surface-2 p-6">
          <h2 className="text-xl font-bold text-ink">Related Resources</h2>
          <p className="mt-3">
            <button
              type="button"
              onClick={() => onOpenArticle?.('About supported operating systems')}
              className="text-left font-semibold text-brand-ink transition-colors hover:text-brand-strong hover:underline"
            >
              About Supported Operating Systems
            </button>
          </p>
        </div>
      </div>
    )
  }
  if (title === 'Ending support for legacy phones') {
    return (
      <div className={proseClass}>
        <h2 className="text-xl font-bold text-ink">End of Support for Older Operating Systems</h2>
        <p>KT Messenger may discontinue support for older operating system versions over time.</p>
        <p>Our goal is to provide a secure, reliable, and high-quality messaging experience. As technology evolves, older operating systems may no longer support the latest security standards, performance improvements, and features required by KT Messenger.</p>
        <p>When an operating system is no longer supported, users may be unable to install new versions of KT Messenger or receive future updates. To keep using KT Messenger, update your device to a supported operating system version.</p>
        <p>If our support requirements change, the latest supported operating systems will be listed in About Supported Operating Systems.</p>
        <RelatedResources
          onOpenArticle={onOpenArticle}
          links={[
            ['About Supported Operating Systems', 'About supported operating systems'],
            ['About Supported Devices', 'About supported devices'],
          ]}
        />
      </div>
    )
  }
  if (title === 'About rooted phones and custom ROMs') {
    return (
      <div className={proseClass}>
        <h2 className="text-xl font-bold text-ink">About Rooted Android Devices and Custom ROMs</h2>
        <p>Rooted Android devices and custom ROMs are not officially supported by KT Messenger.</p>
        <p>Because device modifications vary significantly, we cannot guarantee that KT Messenger will function correctly on rooted devices or devices running modified operating systems.</p>
        <p>Using a rooted device or custom ROM may affect app security, stability, performance, and compatibility with KT Messenger features.</p>
        <p>For the best experience, we recommend using the official operating system provided by your device manufacturer and keeping your device updated to the latest available version.</p>
        <RelatedResources
          onOpenArticle={onOpenArticle}
          links={[
            ['About Supported Devices', 'About supported devices'],
            ['About Supported Operating Systems', 'About supported operating systems'],
            ['How to Download or Uninstall KT Messenger', 'How to download or uninstall KT Messenger'],
          ]}
        />
      </div>
    )
  }
  if (title === 'Parent Managed Accounts') {
    return (
      <div className={proseClass}>
        <div className="rounded-2xl bg-surface-2 p-6">
          <p className="text-ink">
            {t('Parent managed accounts let a parent or guardian help a young person set up and look after their KT Messenger account. This experience is rolling out in stages and may not be available in your region yet.')}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t('Keep KT Messenger updated to the latest version from your app store.')}</li>
            <li>{t('Follow our blog and Help Center for updates on when it reaches you.')}</li>
          </ul>
        </div>
        <p>{t('When it becomes available, you can turn it on during registration or from')} <strong>Settings → Account</strong>.</p>
      </div>
    )
  }
  return (
    <div className={proseClass}>
      <p>{t('This step-by-step guide explains')} <strong>{title.charAt(0).toLowerCase() + title.slice(1)}</strong> {t('on KT Messenger. Follow the steps below to get set up.')}</p>
      <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-brand-ink">
        <li>{t('Open KT Messenger and go to')} <strong>{t('Settings')}</strong>.</li>
        <li>{t('Select the option related to this topic and follow the on screen instructions.')}</li>
        <li>{t('Confirm your choice to save any changes.')}</li>
      </ol>
      <p>{t('Still need help? Contact our support team from the Help Center and we will be happy to assist.')}</p>
    </div>
  )
}

function FeedbackWidget() {
  const { t } = useLanguage()
  const [state, setState] = useState('ask')
  if (state === 'hidden') return null
  return (
    <div className="fixed bottom-24 right-4 z-40 w-[calc(100%-2rem)] rounded-2xl border border-line bg-surface p-4 shadow-float sm:right-6 sm:w-[340px]">
      <button onClick={() => setState('hidden')} aria-label={t('Dismiss')} className="absolute right-3 top-3 text-muted transition-colors hover:text-ink">
        <FiX />
      </button>
      {state === 'ask' ? (
        <>
          <p className="pr-6 font-bold text-ink">{t('Does this answer your question?')}</p>
          <div className="mt-3 flex gap-3">
            <button onClick={() => setState('done')} className="flex-1 rounded-lg bg-surface-2 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand-ink">
              🙂 {t('Yes')}
            </button>
            <button onClick={() => setState('done')} className="flex-1 rounded-lg bg-surface-2 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand-ink">
              🙁 {t('No')}
            </button>
          </div>
        </>
      ) : (
        <p className="pr-6 font-semibold text-ink">{t('Thanks for your feedback!')} 💙</p>
      )}
    </div>
  )
}

function HelpFooter({ onNav }) {
  const { t } = useLanguage()
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="px-5 py-14 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-muted">{t(column.title)}</p>
              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => onNav(link.to)}
                      className="text-left text-[15px] text-ink transition-colors hover:text-brand-ink"
                    >
                      {link.label === 'KT Web' ? link.label : t(link.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => onNav('/')} aria-label={t('KT Messenger home')} className="self-start">
            <Logo />
          </button>
          <p className="text-sm text-muted">© 2026 KT Messenger</p>
        </div>
      </div>
    </footer>
  )
}

export function HelpPage() {
  // Per-page SEO from admin (Website Content -> seo.help).
  // No block configured = unchanged behaviour.
  // Canonical for this page (follows the URL it is opened at).
  useSeo({ path: '/help' })
  useAdminSeo('help', '/help')

  const navigate = useNavigate()
  const { pathname, state: navState } = useLocation()
  // Each article has its own URL: <help path>/<article slug>. The help path is
  // /help or an admin navigation alias, so it is read from the URL itself.
  const { slug } = useParams()
  const trimmedPath = pathname.replace(/\/+$/, '')
  const basePath = (slug ? trimmedPath.slice(0, trimmedPath.lastIndexOf('/')) : trimmedPath) || '/help'
  const { handlers } = useSwipeTheme()
  const { t } = useLanguage()
  // Sidebar starts fully collapsed — no category or sub-category is opened
  // for the reader. Opening an article still expands its branch (see the
  // effect below that follows the URL).
  const [expandedCat, setExpandedCat] = useState(null)
  const [expandedSub, setExpandedSub] = useState(null)
  const [activeTab, setActiveTab] = useState('Android')
  const [copied, setCopied] = useState(false)

  // Help Center content from admin. Both fall back to the hardcoded copy, so
  // an empty table or an unreachable API leaves the page exactly as it was.
  const [remoteTree] = useRemoteContent(() => api.getHelpTree(), null)
  const [remotePopular] = useRemoteContent(() => api.getPopularArticles(), null)

  const tree = useMemo(
    () => (Array.isArray(remoteTree) && remoteTree.length > 0 ? normalizeHelpTree(remoteTree) : withKeys(helpTree)),
    [remoteTree],
  )
  const slugIndex = useMemo(
    () => (Array.isArray(remoteTree) && remoteTree.length > 0 ? buildSlugIndex(remoteTree) : {}),
    [remoteTree],
  )
  // Admin slug for a title when there is one, otherwise the same slug the
  // backend would generate for it.
  const slugFor = (title) => slugIndex[title] || slugify(title)
  const popular = useMemo(
    () =>
      Array.isArray(remotePopular) && remotePopular.length > 0
        ? remotePopular.filter((a) => a?.title).map((a) => ({ title: a.title, slug: a.slug || slugIndex[a.title] || slugify(a.title), remote: Boolean(a.slug) }))
        : popularArticles.map((title) => ({ title, slug: slugIndex[title] || slugify(title), remote: Boolean(slugIndex[title]) })),
    [remotePopular, slugIndex],
  )

  // slug -> article, for every article the page can open. `remote` marks the
  // slugs that came from admin, i.e. the ones with a body to fetch.
  const articleIndex = useMemo(() => {
    const index = {}
    for (const category of tree) {
      for (const sub of category.subs) {
        sub.articles.forEach((title, ai) => {
          const adminSlug = sub.slugs?.[ai]
          const key = adminSlug || slugIndex[title] || slugify(title)
          if (key && !index[key]) index[key] = { title, catKey: category.key, subKey: sub.key, remote: Boolean(adminSlug || slugIndex[title]) }
        })
      }
    }
    for (const article of popular) {
      if (article.slug && !index[article.slug]) index[article.slug] = { title: article.title, catKey: null, subKey: null, remote: article.remote }
    }
    return index
  }, [tree, popular, slugIndex])

  // The open article is whatever the URL names. An unknown slug (or one the
  // admin tree has not delivered yet) shows the Help Center home.
  const current = slug ? articleIndex[slug] : null
  const activeArticle = useMemo(() => (current ? { title: current.title } : null), [current])

  // Body of the selected article, when it is one the admin manages.
  const [articleBody, setArticleBody] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Every article change starts on the first tab at the top of the page.
  useEffect(() => {
    setActiveTab('Android')
    setCopied(false)
    window.scrollTo(0, 0)
  }, [slug])

  // Expand the sidebar branch of the article in the URL — on a direct visit,
  // a refresh, or Back/Forward. Opening from Popular Help Steps or a related
  // link leaves the sidebar as it is, as it always has.
  const keepSidebar = navState?.helpSidebar === 'keep'
  useEffect(() => {
    if (!current || keepSidebar) return
    if (current.catKey) setExpandedCat(current.catKey)
    if (current.subKey) setExpandedSub(current.subKey)
  }, [current, keepSidebar])

  // Admin-managed articles carry a slug; fetch the body the editor wrote.
  // Anything else keeps rendering the built-in ArticleBody.
  const bodySlug = current?.remote ? slug : null
  useEffect(() => {
    setArticleBody('')
    if (!bodySlug) return undefined
    let alive = true
    api
      .getHelpArticle(bodySlug)
      .then((article) => {
        if (alive && article?.body && String(article.body).trim()) setArticleBody(String(article.body))
      })
      .catch(() => {
        /* no body from admin — the built-in guide stays on screen */
      })
    return () => {
      alive = false
    }
  }, [bodySlug])

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
    if (slug) navigate(basePath)
    else window.scrollTo(0, 0)
  }

  // Opening an article changes the URL; the effects above follow it.
  // `keepSidebar` is for links outside the sidebar (Popular Help Steps,
  // related articles), which never expanded it.
  const openArticle = (articleSlug, { keepSidebar: keep = false } = {}) => {
    if (!articleSlug) return
    if (articleSlug === slug) {
      // Already open: same as before — back to the first tab, at the top.
      setActiveTab('Android')
      setCopied(false)
      window.scrollTo(0, 0)
      return
    }
    navigate(`${basePath}/${encodeURIComponent(articleSlug)}`, keep ? { state: { helpSidebar: 'keep' } } : undefined)
  }

  const copyLink = () => {
    const url = `${window.location.origin}${trimmedPath || '/help'}`
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }).catch(() => {})
    }
  }

  const articleTabs = activeArticle ? tabbedArticles[activeArticle.title] : null
  const hasTabs = Boolean(articleTabs)

  return (
    <div {...handlers} className="min-h-screen overflow-x-clip bg-cream text-body">
      {/* help header */}
      <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/')} aria-label={t('KT Messenger home')}>
              <Logo showWordmark={false} />
            </button>
            <button onClick={goHelpHome} className="text-lg font-bold text-ink">{t('Help Center')}</button>
          </div>
          <div className="flex items-center gap-3">
            {activeArticle ? (
              <label className="hidden items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 md:flex">
                <FiSearch className="text-muted" />
                <input
                  type="text"
                  placeholder={t('Search help steps...')}
                  aria-label={t('Search help steps')}
                  className="w-44 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </label>
            ) : null}
            <button className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-body transition-colors hover:text-ink">
              {t('English (US)')}
            </button>
          </div>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[360px_1fr]">
        {/* sidebar */}
        <aside className="border-b border-line lg:border-b-0 lg:border-r">
          <nav className="px-4 py-6 lg:sticky lg:top-16 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:px-5">
            {tree.map((category) => {
              const catOpen = expandedCat === category.key
              return (
                <div key={category.key}>
                  <button
                    onClick={() => setExpandedCat(catOpen ? null : category.key)}
                    aria-expanded={catOpen}
                    className={`flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors ${catOpen ? 'bg-surface-2' : 'hover:bg-surface-2'}`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-[20px] text-cream">{category.icon}</span>
                    <span className="flex-1 text-[15px] font-bold text-ink">{t(category.label)}</span>
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
                          const subOpen = expandedSub === sub.key
                          return (
                            <div key={sub.key}>
                              <button
                                onClick={() => setExpandedSub(subOpen ? null : sub.key)}
                                aria-expanded={subOpen}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
                              >
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-base text-ink">{sub.icon}</span>
                                <span className="flex-1 text-[14px] font-semibold text-ink">{t(sub.label)}</span>
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
                                    {sub.articles.map((title, ai) => {
                                      const articleSlug = sub.slugs?.[ai] || slugFor(title)
                                      const active = Boolean(slug) && articleSlug === slug
                                      return (
                                        <li key={`${title}-${ai}`}>
                                          <button
                                            onClick={() => openArticle(articleSlug)}
                                            className={`block w-full rounded-lg py-2 pl-[3.25rem] pr-3 text-left text-sm transition-colors ${active ? 'bg-brand-soft font-semibold text-brand-ink' : 'text-body hover:text-brand-ink'}`}
                                          >
                                            {t(title)}
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
                  <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-ink lg:text-4xl">{t(activeArticle.title)}</h1>
                  <button
                    onClick={copyLink}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
                  >
                    <FiLink /> {copied ? t('Copied!') : t('Copy link')}
                  </button>
                </div>

                {hasTabs ? (
                  <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 border-b border-line">
                    {platformTabs.filter((tab) => articleTabs.includes(tab.label)).map((tab) => (
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
                  {articleBody && !(builtInGuides.includes(activeArticle.title) && isSeedPlaceholder(articleBody)) ? (
                    <AdminArticleBody body={articleBody} />
                  ) : (
                    <ArticleBody title={activeArticle.title} tab={activeTab} onOpenArticle={(title) => openArticle(slugFor(title), { keepSidebar: true })} />
                  )}
                </div>
              </Reveal>
            ) : (
              <>
                <Reveal from="up">
                  <h1 className="text-[1.9rem] font-bold tracking-tight text-ink sm:text-3xl">{t('How can we help you?')}</h1>
                  <label className="mt-6 flex items-center gap-3 rounded-2xl bg-surface-2 px-5 py-4 transition-colors focus-within:ring-2 focus-within:ring-brand/40">
                    <FiSearch className="text-xl text-muted" />
                    <input
                      type="text"
                      placeholder={t('Search help steps...')}
                      aria-label={t('Search help steps')}
                      className="flex-1 bg-transparent text-ink outline-none placeholder:text-muted"
                    />
                  </label>
                </Reveal>

                <h2 className="mt-12 text-2xl font-bold text-ink">{t('Popular Topics')}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {topics.map((topic, index) => (
                    <Reveal key={topic.title} from="up" delay={index * 0.04} className="h-full">
                      <button
                        onClick={() => goTo(topic.to)}
                        className="flex h-full w-full flex-col rounded-2xl border border-transparent bg-surface-2 p-6 text-left transition duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-card"
                      >
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-ink">{topic.icon}</span>
                        <h3 className="mt-5 text-lg font-bold text-ink">{t(topic.title)}</h3>
                        <p className="mt-2 text-sm leading-6 text-body">{t(topic.desc)}</p>
                      </button>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-14">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-ink">{t('Popular Help Steps')}</h2>
                    <ul className="mt-6 space-y-4">
                      {popular.map((article) => (
                        <li key={article.title}>
                          <button
                            onClick={() => openArticle(article.slug, { keepSidebar: true })}
                            className="text-left text-[15px] font-semibold text-brand-ink transition-colors hover:text-brand-strong hover:underline"
                          >
                            {t(article.title)}
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

/**
 * Extra source strings for the translation pipeline.
 *
 * The generator (scripts/i18n-translate.mjs) scans the code for literal
 * t('…') calls. Strings passed to t() through a VARIABLE (e.g. a mapped list
 * like `points.map(p => t(p))`) can't be seen by that scan, so list them here
 * and the pipeline will translate them into every language too.
 *
 * Keep each entry identical to the English source string used at runtime.
 */
import { ALT_KEYWORDS } from '../utils/imageAlt.js'

export default [
  // Keyword ALT text used for images without an admin ALT (utils/imageAlt.js)
  ...ALT_KEYWORDS,

  // DownloadCTA checklist
  'No ads',
  'No subscription',
  'Encrypted by default',

  // TrustBar stats
  'People connected',
  'Messages every day',
  'Countries',
  'Uptime',

  // Features grid
  'Instant messaging',
  'Texts, photos, voice notes, and files that arrive the moment you hit send.',
  'Voice & video calls',
  'Free calls that stay clear, whether it is one friend or a full group.',
  'End to end encryption',
  'Privacy that is on by default, for every chat and every call you make.',
  'Synced everywhere',
  'Pick up any conversation on your phone, tablet, or computer instantly.',
  'Calm notifications',
  'Meaningful alerts you can shape, so you stay present and in control.',
  'Fast & lightweight',
  'Built to feel instant, even on older phones and slower networks.',

  // MultiDevice surface chips
  'iOS & Android',
  'Tablet',
  'Mac & Windows',

  // Download page: Microsoft Store badge (AppsPage <StoreBadge top="…">)
  'Get it from',

  // KT Plus theme names (PlusLoopVideo)
  'Midnight Sapphire',
  'Electric Cyan',
  'Royal Gold',
  'Neon Purple',

  // FaqAccordion default search placeholder; blog "All" category
  'Search questions…',
  'All',

  // Site-wide title and description from index.html (translated in main.jsx)
  'KT Messenger · messaging & calling',
  'KT Messenger — simple, secure messaging and calling for everyone. Private by default, delightfully fast, and in sync on every device.',

  // Help page: downloadGuides install/uninstall steps, rendered via t(step)
  'Scan the QR code above, or open the Google Play Store and search for KT Messenger.',
  'Tap Install and wait for the download to finish.',
  'Touch and hold the KT Messenger icon on your home screen or in your app drawer.',
  'Tap Uninstall (or drag the icon to Uninstall).',
  'Tap OK to confirm.',
  'Scan the QR code above, or open the App Store and search for KT Messenger.',
  'Tap Get, then confirm with Face ID, Touch ID or your Apple ID password.',
  'Touch and hold the KT Messenger icon on your home screen.',
  'Tap Remove App.',
  'Tap Delete App, then tap Delete to confirm.',
  'Click Download for Mac above to see the official download options.',
  'Open the downloaded file and move KT Messenger to your Applications folder.',
  'Quit KT Messenger.',
  'Open Finder and go to Applications.',
  'Drag KT Messenger to the Bin, or right-click it and choose Move to Bin.',
  'Click Download for Windows above to download the KT Messenger installer.',
  'Open the downloaded file and follow the on-screen steps to install.',
  'Open Start, then go to Settings > Apps > Installed apps.',
  'Find KT Messenger in the list and click the ... (more) button next to it.',
  'Click Uninstall, then click Uninstall again to confirm.',

  // Help page: supportedSystems list, rendered via t(system)
  'Android 10.0 and later',
  'iOS 16.6 and later',
  'iPadOS 16.6 and later',
  'macOS 13.5 and later (Mac devices with Apple Silicon)',
  'visionOS 1.0 and later',

  // Products page: product.category values, rendered via t(product.category)
  'Communication',
  'Business',
  'Entertainment',
  'Social',
  'Education',

  // News page: the useSeo() title and description. Every other page's SEO copy
  // is picked up because its file also calls useLanguage(), which is what makes
  // the scanner read that file's plain string literals. NewsPage.jsx is a thin
  // wrapper with no copy of its own, so its two SEO strings are listed here.
  'KT News | Live World Headlines & Breaking Stories',
  'Read live headlines from newsrooms around the world on KT News. Every story opens at the publisher that wrote it, inside KT Messenger.',
]

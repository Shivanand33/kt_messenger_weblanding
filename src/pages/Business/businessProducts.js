// Content for the KT Business "Products" mega-menu sub-pages. Each key is a URL
// slug under /business/:slug and is rendered by the shared BusinessSubPage
// component. Icons (`icon`) and images (`image`) are referenced by name and
// mapped to real imports inside the page. All copy is KT Messenger branded.

export const businessProducts = {
  // ── Business Platform ────────────────────────────────────────
  features: {
    eyebrow: 'Business Platform',
    title: 'Everything in the KT Business Platform',
    subtitle:
      'A programmable messaging platform for medium and large businesses — send notifications, run support, and automate conversations at scale over KT Messenger.',
    image: 'multidevice',
    features: [
      { icon: 'FiSend', title: 'Programmable messaging API', desc: 'Send and receive messages through a simple, well-documented REST API built for high volume.' },
      { icon: 'FiZap', title: 'Automation & chatbots', desc: 'Route conversations, trigger auto-replies, and connect flows to your own systems and CRM.' },
      { icon: 'FiUsers', title: 'Shared team inbox', desc: 'Let agents collaborate on one number with assignments, labels, and internal notes.' },
      { icon: 'FiBarChart2', title: 'Delivery & engagement analytics', desc: 'Track sent, delivered, read, and reply rates for every template and campaign.' },
      { icon: 'FiShield', title: 'Signal-grade encryption', desc: 'Every conversation is protected end-to-end with the Signal Protocol by default.' },
      { icon: 'FiGlobe', title: 'Global scale & reliability', desc: 'Reach 2.5B+ users with regional infrastructure and 99.9% delivery uptime.' },
    ],
    spotlight: {
      title: 'Built for developers and teams',
      subtitle: 'A platform that fits the way you already work — from first API call to full-scale automation.',
      image: 'business',
      points: [
        'REST and webhook APIs with SDKs for every major language',
        'Message templates approved once and reused across campaigns',
        'Role-based team access with full audit logs',
        'Connect your CRM, helpdesk, and commerce stack',
      ],
    },
    cta: { title: 'Ready to build on KT Business?', desc: 'Get started with the platform in minutes.' },
  },

  pricing: {
    eyebrow: 'Business Platform',
    title: 'Simple, conversation-based pricing',
    subtitle:
      'Pay only for the conversations you have. No setup fees, no per-message surprises — choose the plan that fits your team and scale as you grow.',
    image: 'business',
    features: [
      { icon: 'FiTag', title: 'Free tier', desc: '1,000 service conversations every month, free — perfect for getting started and testing.' },
      { icon: 'FiZap', title: 'Growth', desc: 'Metered per conversation with volume discounts, shared inbox, and standard support.' },
      { icon: 'FiTrendingUp', title: 'Scale', desc: 'Committed-use rates, higher throughput, and priority routing for high-volume senders.' },
      { icon: 'FiShield', title: 'Enterprise', desc: 'Custom pricing, SLAs, dedicated onboarding, and a named account manager.' },
    ],
    spotlight: {
      title: 'Only pay for conversations',
      subtitle: 'Transparent, usage-based billing with no lock-in and no surprises on your invoice.',
      image: 'multidevice',
      points: [
        'First 1,000 service conversations free every month',
        'Volume discounts that grow as you scale',
        'Separate, clear rates per message category and region',
        'No setup fees and no hidden per-message charges',
      ],
    },
    note: 'Conversations are 24-hour message threads. Marketing, utility, authentication, and service categories are billed separately per region.',
    cta: { title: 'See pricing for your region', desc: 'Talk to us for a quote tailored to your volume.' },
  },

  flows: {
    eyebrow: 'Business Platform',
    title: 'KT Flows — rich, interactive forms inside chat',
    subtitle:
      'Build structured, multi-step experiences that run entirely inside a KT conversation — sign-ups, bookings, surveys, and checkouts, with no app switching.',
    image: 'private',
    features: [
      { icon: 'FiLayers', title: 'Drag-and-drop builder', desc: 'Design multi-screen flows visually — text, dropdowns, date pickers, and more.' },
      { icon: 'FiCheckCircle', title: 'Validated inputs', desc: 'Collect clean data with built-in validation, required fields, and conditional logic.' },
      { icon: 'FiZap', title: 'Connect to your backend', desc: 'Post responses to your API in real time and branch the flow on the result.' },
      { icon: 'FiSmartphone', title: 'Native in-chat experience', desc: 'Flows open as a smooth sheet inside the chat — familiar, fast, and mobile-first.' },
    ],
    spotlight: {
      title: 'From question to completed action',
      subtitle: 'Guide customers through structured steps without ever leaving the conversation.',
      image: 'group',
      points: [
        'Multi-screen forms for sign-ups, bookings, surveys, and checkouts',
        'Conditional logic that adapts to each answer',
        'Real-time validation for clean, reliable data',
        'Post responses straight to your backend systems',
      ],
    },
    cta: { title: 'Turn conversations into completed forms', desc: 'Launch your first flow today.' },
  },

  // ── Message categories ───────────────────────────────────────
  'msg-marketing': {
    eyebrow: 'Message categories',
    title: 'Marketing messages',
    subtitle:
      'Promotions, offers, product launches, and re-engagement — reach opted-in customers with rich, personalised campaigns they actually open.',
    image: 'group',
    features: [
      { icon: 'FiTag', title: 'Offers & promotions', desc: 'Send targeted deals, discount codes, and seasonal campaigns with images and buttons.' },
      { icon: 'FiUsers', title: 'Audience segments', desc: 'Personalise by customer attributes and past behaviour for higher conversion.' },
      { icon: 'FiPlayCircle', title: 'Rich media', desc: 'Add photos, videos, catalogs, and call-to-action buttons to every broadcast.' },
      { icon: 'FiBarChart2', title: 'Campaign analytics', desc: 'Measure opens, clicks, and conversions to refine your next send.' },
    ],
    spotlight: {
      title: 'Campaigns customers actually open',
      subtitle: 'Rich, personalised marketing at scale — with the engagement rates messaging is known for.',
      image: 'business',
      points: [
        'Broadcast offers, launches, and re-engagement campaigns',
        'Segment audiences so every message stays relevant',
        'Add images, video, catalogs, and tappable buttons',
        'Track opens, clicks, and conversions in real time',
      ],
    },
    cta: { title: 'Launch a marketing campaign', desc: 'Reach customers where they already are.' },
  },
  'msg-authentication': {
    eyebrow: 'Message categories',
    title: 'Authentication messages',
    subtitle:
      'Deliver one-time passcodes and verification prompts over KT Messenger — faster and more secure than SMS, with higher delivery rates.',
    image: 'security',
    features: [
      { icon: 'FiShield', title: 'One-time passcodes', desc: 'Send OTPs for sign-in, sign-up, and account recovery with auto-expiry.' },
      { icon: 'FiCheckCircle', title: 'One-tap verification', desc: 'Let users copy or confirm codes with a single tap for a smoother login.' },
      { icon: 'FiZap', title: 'Higher deliverability', desc: 'Skip SMS carrier delays and reach users instantly, worldwide.' },
      { icon: 'FiLock', title: 'Encrypted by default', desc: 'Codes travel end-to-end encrypted, protecting every authentication.' },
    ],
    spotlight: {
      title: 'Secure logins, higher conversion',
      subtitle: 'Deliver passcodes people trust, and stop losing users to failed or slow SMS.',
      image: 'private',
      points: [
        'One-time passcodes for sign-in, sign-up, and recovery',
        'One-tap copy and automatic code expiry',
        'Instant, worldwide delivery — no carrier delays',
        'End-to-end encrypted by default',
      ],
    },
    cta: { title: 'Improve sign-up conversion', desc: 'Send secure passcodes over KT.' },
  },
  'msg-utility': {
    eyebrow: 'Message categories',
    title: 'Utility messages',
    subtitle:
      'Transactional updates your customers expect — order confirmations, shipping alerts, appointment reminders, and account notifications.',
    image: 'multidevice',
    features: [
      { icon: 'FiCheckCircle', title: 'Order & payment updates', desc: 'Confirm purchases, payments, and refunds the moment they happen.' },
      { icon: 'FiSend', title: 'Delivery tracking', desc: 'Share dispatch, out-for-delivery, and delivered notifications with tracking links.' },
      { icon: 'FiClock', title: 'Reminders', desc: 'Reduce no-shows with appointment, booking, and renewal reminders.' },
      { icon: 'FiBell', title: 'Account alerts', desc: 'Notify customers of important changes to their account in real time.' },
    ],
    spotlight: {
      title: 'The updates customers expect',
      subtitle: 'Keep people informed at every step — and cut inbound "where is my order?" queries.',
      image: 'group',
      points: [
        'Order, payment, and refund confirmations',
        'Shipping and live delivery tracking',
        'Appointment, booking, and renewal reminders',
        'Real-time account and security alerts',
      ],
    },
    cta: { title: 'Keep customers informed', desc: 'Send the updates they actually want.' },
  },
  'msg-service': {
    eyebrow: 'Message categories',
    title: 'Service messages',
    subtitle:
      'Two-way support conversations — answer questions, resolve issues, and help customers in real time with a shared team inbox.',
    image: 'private',
    features: [
      { icon: 'FiMessageSquare', title: 'Real-time support', desc: 'Reply to customer questions instantly in an ongoing conversation.' },
      { icon: 'FiUsers', title: 'Shared team inbox', desc: 'Assign chats, add internal notes, and collaborate without losing context.' },
      { icon: 'FiZap', title: 'Automated first response', desc: 'Greet customers instantly and route them to the right agent or bot.' },
      { icon: 'FiCheckCircle', title: 'Faster resolution', desc: 'Quick replies, saved answers, and history cut your response time dramatically.' },
    ],
    spotlight: {
      title: 'Support that resolves faster',
      subtitle: 'Real conversations, not tickets — with everything your team needs in one thread.',
      image: 'group',
      points: [
        'Two-way chat with the full customer history',
        'Shared inbox with assignments and internal notes',
        'Automated greetings and smart routing',
        'Quick replies and saved answers for common questions',
      ],
    },
    cta: { title: 'Deliver support customers love', desc: 'Turn conversations into resolutions.' },
  },

  // ── Business App ─────────────────────────────────────────────
  'app-features': {
    eyebrow: 'Business App',
    title: 'KT Business App features',
    subtitle:
      'A free app for small business owners — showcase products, greet customers automatically, and manage chats from your phone.',
    image: 'hero-photo',
    features: [
      { icon: 'FiShoppingBag', title: 'Product catalog', desc: 'Display your products and services with images, prices, and descriptions.' },
      { icon: 'FiUserCheck', title: 'Business profile', desc: 'Add your address, hours, website, and a verified business identity.' },
      { icon: 'FiZap', title: 'Away & greeting messages', desc: 'Reply automatically when you are busy or welcome new customers instantly.' },
      { icon: 'FiTag', title: 'Quick replies & labels', desc: 'Answer FAQs in a tap and organise chats with custom labels.' },
    ],
    spotlight: {
      title: 'Everything a small business needs',
      subtitle: 'Run your whole business from the phone in your pocket — no extra tools required.',
      image: 'business',
      points: [
        'A product catalog with prices and photos',
        'A verified, professional business profile',
        'Greeting and away messages for instant replies',
        'Quick replies and labels to stay organised',
      ],
    },
    cta: { title: 'Grow your small business on KT', desc: 'Download the free Business app.' },
  },
  'get-started': {
    eyebrow: 'Business App',
    title: 'How to get started',
    subtitle:
      'Set up KT Business in a few minutes and start talking to customers today. Here is everything you need to go live.',
    image: 'hero',
    steps: [
      { title: 'Download the KT Business app', desc: 'Get it free from the App Store or Google Play and open it on your business phone.' },
      { title: 'Verify your business number', desc: 'Register with your business phone number and confirm the one-time passcode.' },
      { title: 'Build your profile', desc: 'Add your logo, business hours, category, and a short description of what you do.' },
      { title: 'Add products & greetings', desc: 'Upload your catalog and set up greeting and away messages for instant replies.' },
      { title: 'Start chatting', desc: 'Share your KT link or QR code and welcome your first customers.' },
    ],
    features: [
      { icon: 'FiSmartphone', title: 'No new hardware', desc: 'Everything runs on the phone you already use.' },
      { icon: 'FiCheckCircle', title: 'Free to start', desc: 'The Business app is free, with 1,000 service conversations a month.' },
      { icon: 'FiHelpCircle', title: 'Guided setup', desc: 'In-app tips walk you through every step.' },
    ],
    spotlight: {
      title: 'Live in minutes, not weeks',
      subtitle: 'No new hardware and no complex setup — you can be talking to customers today.',
      image: 'multidevice',
      points: [
        'Works on the phone you already use',
        'Free to start — 1,000 conversations every month',
        'Guided in-app onboarding at every step',
        'Share your link or QR code to begin',
      ],
    },
    cta: { title: 'Set up in minutes', desc: 'Download the app and go live today.' },
  },
  agent: {
    eyebrow: 'Business App',
    title: 'KT Business Agent',
    subtitle:
      'An AI assistant that handles conversations for you — answering questions, recommending products, and personalising every reply at scale.',
    image: 'cyberpunk',
    features: [
      { icon: 'FiZap', title: 'Always-on responses', desc: 'Answer common questions instantly, 24/7, so no customer waits.' },
      { icon: 'FiUsers', title: 'Personalised at scale', desc: 'Tailor each reply using order history and customer context.' },
      { icon: 'FiShoppingBag', title: 'Smart recommendations', desc: 'Suggest the right products and guide customers to checkout.' },
      { icon: 'FiUserCheck', title: 'Seamless human handoff', desc: 'Escalate to a live agent with full conversation context when needed.' },
    ],
    spotlight: {
      title: 'AI that works like your best rep',
      subtitle: 'Personalised, helpful, and always available — in every KT conversation.',
      image: 'security',
      points: [
        'Answers common questions instantly, around the clock',
        'Uses order history and context for every reply',
        'Recommends products and guides customers to checkout',
        'Hands off to a human with full context when needed',
      ],
    },
    cta: { title: 'Meet the KT Business Agent', desc: 'Personalisation in every conversation.' },
  },

  // ── Ads that click to KT ─────────────────────────────────────
  ads: {
    eyebrow: 'Ads that click to KT',
    title: 'Ads that click to KT',
    subtitle:
      'Run ads on the platforms you already use that open a KT conversation in one tap — turning clicks into real, two-way conversations.',
    image: 'business',
    features: [
      { icon: 'FiTarget', title: 'One-tap to chat', desc: 'People who tap your ad land directly in a KT chat with your business — no forms.' },
      { icon: 'FiZap', title: 'Warm, qualified leads', desc: 'Start a conversation while intent is high and answer questions instantly.' },
      { icon: 'FiBarChart2', title: 'Measurable results', desc: 'Attribute conversations and conversions back to each ad and campaign.' },
      { icon: 'FiMessageSquare', title: 'Automated follow-up', desc: 'Greet every lead with an instant reply and route them to the right place.' },
    ],
    spotlight: {
      title: 'Clicks become conversations',
      subtitle: 'Meet customers the moment their intent is highest — inside a real conversation.',
      image: 'group',
      points: [
        'Ads open a KT chat with your business in one tap',
        'Warm, qualified leads with no forms to fill',
        'Automated first reply and instant routing',
        'Attribute every conversation back to its campaign',
      ],
    },
    cta: { title: 'Turn ad clicks into conversations', desc: 'Launch your first click-to-KT ad.' },
  },
  'ads-create': {
    eyebrow: 'Ads that click to KT',
    title: 'How to create an ad',
    subtitle:
      'Set up a click-to-KT ad in a few steps and start receiving conversations from customers who tap through.',
    image: 'group',
    steps: [
      { title: 'Choose your objective', desc: 'Pick a click-to-message goal and connect your KT Business number.' },
      { title: 'Design your creative', desc: 'Add your image or video, headline, and a clear call to action.' },
      { title: 'Set your greeting', desc: 'Write the first message customers see when the chat opens.' },
      { title: 'Target & budget', desc: 'Define your audience, placements, schedule, and daily budget.' },
      { title: 'Publish & track', desc: 'Launch the ad and watch conversations and conversions roll in.' },
    ],
    features: [
      { icon: 'FiImage', title: 'Rich creatives', desc: 'Use images, video, and carousels to stop the scroll.' },
      { icon: 'FiTarget', title: 'Precise targeting', desc: 'Reach the right people by interest, location, and behaviour.' },
      { icon: 'FiBarChart2', title: 'Live performance', desc: 'Optimise as results come in with real-time reporting.' },
    ],
    spotlight: {
      title: 'Launch in a few simple steps',
      subtitle: 'From creative to conversation, fast — no agency required.',
      image: 'business',
      points: [
        'Pick a click-to-message objective',
        'Design rich image or video creatives',
        'Set the opening message customers see',
        'Target, budget, publish, and track results',
      ],
    },
    cta: { title: 'Create your first ad', desc: 'From click to conversation in minutes.' },
  },
  'ads-status-channels': {
    eyebrow: 'Ads that click to KT',
    title: 'Ads in Status and Channels',
    subtitle:
      'Reach engaged audiences right where they browse — place ads in KT Status and Channels that open a conversation with your business.',
    image: 'footer',
    features: [
      { icon: 'FiEye', title: 'Ads in Status', desc: 'Appear between full-screen Status updates where attention is highest.' },
      { icon: 'FiSend', title: 'Ads in Channels', desc: 'Get discovered by people following topics and creators relevant to you.' },
      { icon: 'FiTarget', title: 'Click straight to chat', desc: 'Every ad opens a KT conversation — no landing page, no drop-off.' },
      { icon: 'FiBarChart2', title: 'Transparent reporting', desc: 'See reach, taps, and conversations for every placement.' },
    ],
    spotlight: {
      title: 'Reach people where they browse',
      subtitle: 'High-attention placements in Status and Channels that turn discovery into conversations.',
      image: 'group',
      points: [
        'Full-screen ads between Status updates',
        'Discovery in the Channels people already follow',
        'Every ad opens a KT conversation instantly',
        'Transparent reach and tap reporting',
      ],
    },
    cta: { title: 'Get discovered in Status & Channels', desc: 'Reach new customers where they browse.' },
  },

  // ── Developers ───────────────────────────────────────────────
  'developer-hub': {
    eyebrow: 'Developers',
    title: 'KT Developer Hub',
    subtitle:
      'Everything you need to build on KT Messenger — full API reference, SDKs, webhooks, and a free sandbox to test before you ship.',
    image: 'multidevice',
    features: [
      { icon: 'FiLayers', title: 'Complete API reference', desc: 'Every endpoint documented with request and response examples you can copy and run.' },
      { icon: 'FiZap', title: 'Official SDKs', desc: 'First-party libraries for Node.js, Python, PHP, Java, and Go to move fast.' },
      { icon: 'FiSend', title: 'Webhooks', desc: 'Subscribe to message, delivery, and status events and react to them in real time.' },
      { icon: 'FiSmartphone', title: 'Free sandbox', desc: 'Test flows, templates, and automations end-to-end before going live.' },
      { icon: 'FiShield', title: 'Secure by design', desc: 'Signed requests, scoped API keys, and end-to-end encryption on every message.' },
      { icon: 'FiBarChart2', title: 'Rate limits & logs', desc: 'Transparent quotas and request logs so you always know what your app is doing.' },
    ],
    spotlight: {
      title: 'From first call to production',
      subtitle: 'A developer experience designed to get you from "hello world" to a live integration fast.',
      image: 'business',
      points: [
        'Interactive API reference with copy-paste examples',
        'SDKs and starter templates for every major language',
        'Webhook events for messages, delivery, and status',
        'A free sandbox number to test before you launch',
      ],
    },
    cta: { title: 'Start building on KT', desc: 'Explore the docs and make your first API call.' },
  },
  'developer-quickstart': {
    eyebrow: 'Developers',
    title: 'How to get started',
    subtitle:
      'Send your first message over the KT Business Platform in minutes. Follow these steps to go from sign-up to a live integration.',
    image: 'hero',
    steps: [
      { title: 'Create a developer account', desc: 'Sign up for KT Business and open the developer console to access your workspace.' },
      { title: 'Generate an API key', desc: 'Create a scoped API key and connect a sandbox number to test against.' },
      { title: 'Send your first message', desc: 'Use a code sample or SDK to send a test message and confirm delivery.' },
      { title: 'Set up webhooks', desc: 'Point a webhook URL at your server to receive incoming messages and status events.' },
      { title: 'Go live', desc: 'Register your production number, submit templates for approval, and switch keys.' },
    ],
    features: [
      { icon: 'FiZap', title: 'Minutes to first message', desc: 'The sandbox lets you send a test message right away.' },
      { icon: 'FiLayers', title: 'Copy-paste samples', desc: 'Working code snippets for every SDK and endpoint.' },
      { icon: 'FiHelpCircle', title: 'Guided setup', desc: 'Step-by-step docs walk you through going live.' },
    ],
    spotlight: {
      title: 'A quickstart that actually starts quick',
      subtitle: 'No sales calls to send a test message — sign up, grab a key, and build.',
      image: 'multidevice',
      points: [
        'Self-serve sandbox with instant test messaging',
        'Scoped API keys you can rotate anytime',
        'Webhook setup with signature verification',
        'A clear path from sandbox to production',
      ],
    },
    cta: { title: 'Send your first message', desc: 'Set up a sandbox and start in minutes.' },
  },
  community: {
    eyebrow: 'Developers',
    title: 'KT Developer Community',
    subtitle:
      'Join thousands of builders on KT Messenger — ask questions, share what you build, and learn from the people shipping on the platform every day.',
    image: 'group',
    features: [
      { icon: 'FiUsers', title: 'Community forum', desc: 'Ask questions and get answers from experienced KT developers and our team.' },
      { icon: 'FiMessageSquare', title: 'Discussion channels', desc: 'Talk APIs, SDKs, and best practices with builders working on similar problems.' },
      { icon: 'FiTrendingUp', title: 'Events & meetups', desc: 'Join webinars, workshops, and community calls to level up your skills.' },
      { icon: 'FiGlobe', title: 'Open-source samples', desc: 'Browse and contribute to starter apps, demos, and integrations.' },
    ],
    spotlight: {
      title: 'Build alongside a community',
      subtitle: 'You are never stuck alone — thousands of KT developers share what works.',
      image: 'private',
      points: [
        'A searchable forum with answers to common questions',
        'Topic channels for APIs, SDKs, and integrations',
        'Regular webinars, workshops, and community calls',
        'Open-source samples you can fork and contribute to',
      ],
    },
    cta: { title: 'Join the community', desc: 'Connect with builders shipping on KT.' },
  },
  'developer-support': {
    eyebrow: 'Developers',
    title: 'Developer Support',
    subtitle:
      'Get unblocked fast. From detailed docs to priority engineering support, KT gives your team the help it needs at every stage.',
    image: 'security',
    features: [
      { icon: 'FiHelpCircle', title: 'Help center & guides', desc: 'Searchable docs, troubleshooting guides, and answers to common integration issues.' },
      { icon: 'FiMessageSquare', title: 'Ticketed support', desc: 'Open a ticket and track it to resolution with our developer support team.' },
      { icon: 'FiClock', title: 'Priority SLAs', desc: 'Guaranteed response times on Scale and Enterprise plans when it matters most.' },
      { icon: 'FiUserCheck', title: 'Dedicated engineers', desc: 'Enterprise teams get a named technical contact and onboarding support.' },
    ],
    spotlight: {
      title: 'Support that keeps you shipping',
      subtitle: 'The right level of help for every team — from self-serve docs to dedicated engineers.',
      image: 'multidevice',
      points: [
        'Comprehensive help center and troubleshooting guides',
        'Ticketed support with clear status tracking',
        'Priority response SLAs on higher plans',
        'A named technical contact for enterprise teams',
      ],
    },
    cta: { title: 'Get developer support', desc: 'Reach our team and stay unblocked.' },
  },
  'api-status': {
    eyebrow: 'Developers',
    title: 'KT API Status',
    subtitle:
      'Real-time visibility into the health of the KT Business Platform — live status, uptime history, and instant incident notifications.',
    image: 'cyberpunk',
    features: [
      { icon: 'FiCheckCircle', title: 'Live service status', desc: 'See the current health of messaging, webhooks, media, and the dashboard at a glance.' },
      { icon: 'FiBarChart2', title: '99.9% uptime', desc: 'Track historical uptime across every region with transparent monthly reports.' },
      { icon: 'FiBell', title: 'Incident alerts', desc: 'Subscribe to updates and be notified the moment an incident is detected.' },
      { icon: 'FiClock', title: 'Incident history', desc: 'Review past incidents with timelines, root-cause notes, and resolutions.' },
    ],
    spotlight: {
      title: 'Always know what is happening',
      subtitle: 'Full transparency on platform health, so your team is never guessing.',
      image: 'security',
      points: [
        'Live status for every KT platform service',
        'Historical uptime and monthly reliability reports',
        'Email and webhook alerts for new incidents',
        'A public incident history with clear resolutions',
      ],
    },
    note: 'Status reflects the KT Business Platform across all regions. Enterprise customers can request a dedicated status feed.',
    cta: { title: 'Subscribe to status updates', desc: 'Stay informed about platform health.' },
  },

  // ── Partners ─────────────────────────────────────────────────
  'become-partner': {
    eyebrow: 'Partners',
    title: 'Become a KT Partner',
    subtitle:
      'Grow your business with KT Messenger. Join the partner program to build solutions, resell the platform, and reach millions of businesses worldwide.',
    image: 'business',
    features: [
      { icon: 'FiLayers', title: 'Solution partners', desc: 'Build and sell software on the KT Business Platform to your own customers.' },
      { icon: 'FiShoppingBag', title: 'Reseller program', desc: 'Package and resell KT Business with your own pricing, branding, and support.' },
      { icon: 'FiTrendingUp', title: 'Co-marketing', desc: 'Get listed in our directory and grow with joint campaigns and referrals.' },
      { icon: 'FiUserCheck', title: 'Partner enablement', desc: 'Access training, certification, and a dedicated partner manager.' },
    ],
    spotlight: {
      title: 'A program built to grow with you',
      subtitle: 'Whether you build, resell, or refer, KT gives partners the tools and support to scale.',
      image: 'group',
      points: [
        'Technical enablement, sandbox access, and certification',
        'Revenue share and reseller pricing options',
        'A listing in the KT partner directory',
        'A dedicated partner manager and co-marketing support',
      ],
    },
    cta: { title: 'Apply to the partner program', desc: 'Start building and growing with KT.' },
  },
  'find-partner': {
    eyebrow: 'Partners',
    title: 'Find a KT Partner',
    subtitle:
      'Work with a verified expert. Browse trusted KT partners — solution providers, agencies, and resellers who can help you launch and scale on KT Business.',
    image: 'private',
    features: [
      { icon: 'FiLayers', title: 'Solution providers', desc: 'Certified partners who build and integrate KT Business into your systems.' },
      { icon: 'FiTarget', title: 'Marketing agencies', desc: 'Specialists who design and run high-performing KT messaging campaigns.' },
      { icon: 'FiShoppingBag', title: 'Resellers', desc: 'Local partners who provide KT Business with regional pricing and support.' },
      { icon: 'FiCheckCircle', title: 'Verified & certified', desc: 'Every listed partner is vetted and certified on the KT Business Platform.' },
    ],
    spotlight: {
      title: 'The right expert for your project',
      subtitle: 'Filter by expertise, region, and industry to find a partner that fits your needs.',
      image: 'multidevice',
      points: [
        'A directory of vetted, certified KT partners',
        'Solution providers, agencies, and resellers',
        'Filter by region, industry, and expertise',
        'Reviews and specialisations for every partner',
      ],
    },
    cta: { title: 'Browse the partner directory', desc: 'Find a certified KT expert near you.' },
  },
}

export const businessProductSlugs = Object.keys(businessProducts)

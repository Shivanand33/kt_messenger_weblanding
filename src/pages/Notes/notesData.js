// ---------------------------------------------------------------------------
// KT Notes — page content.
// Sample vault used to demonstrate the encrypted notes interface.
// ---------------------------------------------------------------------------

export const noteCategories = ['All', 'Work', 'Personal', 'Security', 'Finance', 'Travel', 'Ideas']

export const noteColors = ['default', 'amber', 'emerald', 'rose', 'violet', 'sky']

export const initialNotes = [
  // -------------------------------------------------------------------- WORK
  {
    id: 1,
    title: 'Q4 product roadmap',
    content:
      'Ship KT AI Co-Pilot in 12 languages.\nFinalise end-to-end encrypted backup key generation.\nMove the payments SDK to the new escrow flow before the festive peak.',
    category: 'Work',
    pinned: true,
    color: 'sky',
    updated: 'Today, 09:12',
    tags: ['roadmap', 'planning'],
  },
  {
    id: 2,
    title: 'Q3 revenue & conversion notes',
    content:
      'In-chat checkout conversion grew 340% after one-tap UPI landed.\nBiggest lift came from orders under ₹5,000 — high-consideration categories barely moved.',
    category: 'Work',
    pinned: false,
    color: 'default',
    updated: 'Today, 08:40',
    tags: ['metrics'],
  },
  {
    id: 3,
    title: 'Client onboarding checklist',
    content:
      'Verify GST documentation.\nIssue API authentication keys.\nAssign a dedicated technical account manager.\nSchedule the 30-day health check.',
    category: 'Work',
    pinned: false,
    color: 'emerald',
    updated: 'Yesterday, 17:20',
    tags: ['process', 'clients'],
  },
  {
    id: 4,
    title: 'Architecture decisions — messaging',
    content:
      'Migrate the media service to Kubernetes with regional routing.\nKeep the WebRTC gateway on bare metal for latency.\nRevisit in six months once the traffic mix settles.',
    category: 'Work',
    pinned: true,
    color: 'default',
    updated: 'Yesterday, 14:05',
    tags: ['architecture'],
  },
  {
    id: 5,
    title: 'Board meeting summary',
    content:
      'Approved a $15M expansion budget for LEO satellite connectivity testing across Asia-Pacific.\nNext review scheduled for the January board.',
    category: 'Work',
    pinned: false,
    color: 'amber',
    updated: '05 Aug 2026',
    tags: ['board'],
  },
  {
    id: 6,
    title: 'Design system guidelines',
    content:
      'Keep the dark-mode tokens in HSL.\n16px base scale, 1.25 type ratio.\nSpring physics on entrances only — never on exits.',
    category: 'Work',
    pinned: false,
    color: 'violet',
    updated: '04 Aug 2026',
    tags: ['design'],
  },

  // ---------------------------------------------------------------- PERSONAL
  {
    id: 7,
    title: 'Weekly grocery list',
    content: 'Pothos plant 🪴\nCoffee beans (single origin)\nAlmond milk\nAvocados\nGreek yoghurt\nOlive oil',
    category: 'Personal',
    pinned: false,
    color: 'emerald',
    updated: 'Today, 07:55',
    tags: ['shopping'],
  },
  {
    id: 8,
    title: 'Books to read this year',
    content:
      '1. Designing Data-Intensive Applications\n2. The Pragmatic Programmer\n3. Thinking in Systems\n4. The Making of the Atomic Bomb',
    category: 'Personal',
    pinned: true,
    color: 'amber',
    updated: 'Yesterday, 22:10',
    tags: ['reading'],
  },
  {
    id: 9,
    title: 'Training split',
    content:
      'Mon — chest & triceps\nWed — back & biceps\nFri — legs & core\nSat — easy 5k\nProtein within 45 minutes after lifting.',
    category: 'Personal',
    pinned: false,
    color: 'rose',
    updated: '05 Aug 2026',
    tags: ['fitness'],
  },
  {
    id: 10,
    title: 'Espresso ratios that worked',
    content: '18g in → 36g out in 28 seconds at 9 bar.\nGrind two clicks finer for the Ethiopian.\nWater at 93°C, not 96°C.',
    category: 'Personal',
    pinned: false,
    color: 'default',
    updated: '04 Aug 2026',
    tags: ['coffee'],
  },
  {
    id: 11,
    title: 'Plant watering schedule',
    content: 'Monstera — twice weekly.\nSnake plant — once every 14 days.\nTerrarium — mist monthly, no more.',
    category: 'Personal',
    pinned: false,
    color: 'emerald',
    updated: '03 Aug 2026',
    tags: ['home'],
  },
  {
    id: 12,
    title: 'Gift ideas',
    content: 'Mum — noise-cancelling headphones.\nDad — leather watch strap.\nSister — Kindle, the one with the warm light.',
    category: 'Personal',
    pinned: false,
    color: 'violet',
    updated: '01 Aug 2026',
    tags: ['gifts'],
  },

  // ---------------------------------------------------------------- SECURITY
  {
    id: 13,
    title: 'Recovery share locations',
    content:
      'Share 1 — home safe.\nShare 2 — sealed envelope with sibling.\nShare 3 — bank locker.\nAny two reconstruct the key. Never store two in one place.',
    category: 'Security',
    pinned: true,
    color: 'rose',
    updated: 'Today, 10:30',
    tags: ['keys', 'recovery'],
  },
  {
    id: 14,
    title: 'Passkey inventory',
    content:
      'Phone — primary passkey.\nHardware key — travel backup.\nLaptop — platform passkey.\nAudit quarterly and revoke anything unrecognised.',
    category: 'Security',
    pinned: true,
    color: 'default',
    updated: 'Yesterday, 19:45',
    tags: ['passkeys'],
  },
  {
    id: 15,
    title: 'Home network hardening',
    content:
      'WPA3 on the main SSID.\nGuest network isolated from LAN.\nIoT devices on their own VLAN.\nRotate the router admin credential quarterly.',
    category: 'Security',
    pinned: false,
    color: 'sky',
    updated: '05 Aug 2026',
    tags: ['network'],
  },
  {
    id: 16,
    title: 'Cold wallet verification steps',
    content:
      'Verify the receiving address on the device screen, never the laptop.\nSend a test transaction first.\nConfirm the change address belongs to you.',
    category: 'Security',
    pinned: false,
    color: 'amber',
    updated: '02 Aug 2026',
    tags: ['crypto'],
  },
  {
    id: 17,
    title: 'Travel device checklist',
    content:
      'Full-disk encryption on.\nBiometrics off at borders, PIN only.\nBackup taken and verified before leaving.\nBurner-mode profile ready.',
    category: 'Security',
    pinned: false,
    color: 'default',
    updated: '30 Jul 2026',
    tags: ['travel', 'devices'],
  },
  {
    id: 18,
    title: 'Emergency protocol',
    content:
      'Panic wipe clears local cache while preserving the encrypted cloud backup.\nTrusted contact knows where share 2 lives.\nReview this note every six months.',
    category: 'Security',
    pinned: false,
    color: 'rose',
    updated: '28 Jul 2026',
    tags: ['emergency'],
  },

  // ----------------------------------------------------------------- FINANCE
  {
    id: 19,
    title: 'Portfolio allocation target',
    content:
      'Index funds 55%\nBonds 20%\nCrypto 15%\nCash 10%\nRebalance if any sleeve drifts more than five points.',
    category: 'Finance',
    pinned: true,
    color: 'emerald',
    updated: 'Today, 11:15',
    tags: ['investing'],
  },
  {
    id: 20,
    title: 'Bill calendar',
    content: 'HDFC card — 15th.\nSBI card autopay — 22nd.\nRent — 1st.\nKeep utilisation under 15% before the statement date.',
    category: 'Finance',
    pinned: false,
    color: 'default',
    updated: 'Yesterday, 09:00',
    tags: ['bills'],
  },
  {
    id: 21,
    title: 'Home loan tracking',
    content: 'Fixed at 8.35% p.a.\nNext prepayment in Q4 — target ₹2,00,000.\nCheck whether the reset clause applies after 36 months.',
    category: 'Finance',
    pinned: false,
    color: 'sky',
    updated: '04 Aug 2026',
    tags: ['loan'],
  },
  {
    id: 22,
    title: 'Tax documents to collect',
    content: '80C proofs done.\nMedical insurance premium receipt — pending.\nRent receipts for Q1 and Q2 — pending.\nCapital gains statement in March.',
    category: 'Finance',
    pinned: false,
    color: 'amber',
    updated: '02 Aug 2026',
    tags: ['tax'],
  },
  {
    id: 23,
    title: 'SIP schedule',
    content: '₹25,000 monthly — Nifty 50 index ₹15,000, smallcap ₹6,000, international ₹4,000.\nStep up 10% each April.',
    category: 'Finance',
    pinned: false,
    color: 'emerald',
    updated: '01 Aug 2026',
    tags: ['sip'],
  },
  {
    id: 24,
    title: 'Travel budget 2026',
    content: 'Japan — ₹1,50,000 set aside.\nFlights booked.\nRemaining: accommodation ₹60,000, food and rail ₹45,000.',
    category: 'Finance',
    pinned: false,
    color: 'violet',
    updated: '29 Jul 2026',
    tags: ['budget', 'travel'],
  },

  // ------------------------------------------------------------------ TRAVEL
  {
    id: 25,
    title: 'Japan itinerary',
    content:
      'Days 1–4 — Tokyo, Shibuya base.\nDays 5–8 — Kyoto, traditional ryokan.\nDays 9–10 — Osaka, street food.\nJR Pass activates on day 5.',
    category: 'Travel',
    pinned: true,
    color: 'sky',
    updated: 'Today, 12:40',
    tags: ['japan', 'itinerary'],
  },
  {
    id: 26,
    title: 'Flight confirmation',
    content: 'JL-748 departing 12:40, Terminal 3.\nPassport valid until 2031.\nSeat 32A, aisle side on the return.',
    category: 'Travel',
    pinned: false,
    color: 'default',
    updated: 'Yesterday, 16:00',
    tags: ['flights'],
  },
  {
    id: 27,
    title: 'Mountain packing list',
    content: 'Thermal base layers ×3\nWaterproof boots\nPower bank 20,000mAh\nFirst aid kit\nEnergy bars\nHeadlamp with spare cells',
    category: 'Travel',
    pinned: false,
    color: 'emerald',
    updated: '03 Aug 2026',
    tags: ['packing'],
  },
  {
    id: 28,
    title: 'Paris booking reference',
    content: 'Le Marais boutique hotel, reservation #84920.\nCheck-in 15:00, late arrival noted.\nBreakfast not included.',
    category: 'Travel',
    pinned: false,
    color: 'rose',
    updated: '31 Jul 2026',
    tags: ['hotels'],
  },
  {
    id: 29,
    title: 'Road trip playlist',
    content: 'Classic rock for the highway.\nAcoustic indie for the hills.\nSynthwave for night driving.\nDownload all three — patchy signal past hour two.',
    category: 'Travel',
    pinned: false,
    color: 'violet',
    updated: '28 Jul 2026',
    tags: ['music'],
  },
  {
    id: 30,
    title: 'Offline maps saved',
    content: 'Tokyo, Kyoto and Osaka transit downloaded.\nSuica added to the phone wallet.\nSave the ryokan address in Japanese too.',
    category: 'Travel',
    pinned: false,
    color: 'default',
    updated: '27 Jul 2026',
    tags: ['maps'],
  },

  // ------------------------------------------------------------------- IDEAS
  {
    id: 31,
    title: 'App idea — receipt parser',
    content:
      'Photograph a receipt in chat, get a structured expense entry back.\nHard part is the long tail of thermal-printer fonts, not the parsing.',
    category: 'Ideas',
    pinned: false,
    color: 'amber',
    updated: 'Today, 13:22',
    tags: ['product'],
  },
  {
    id: 32,
    title: 'Essay outline — attention',
    content:
      'Thesis: feeds optimise for the next second, not the next hour.\nEvidence: session-length data versus recall studies.\nCounterpoint: people do choose this.',
    category: 'Ideas',
    pinned: false,
    color: 'default',
    updated: 'Yesterday, 21:05',
    tags: ['writing'],
  },
  {
    id: 33,
    title: 'Side project shortlist',
    content:
      'A CLI that diffs two JSON schemas readably.\nA plant-watering reminder that reads the weather.\nPick one. Finish it. Then pick the next.',
    category: 'Ideas',
    pinned: false,
    color: 'emerald',
    updated: '05 Aug 2026',
    tags: ['projects'],
  },
  {
    id: 34,
    title: 'Talk proposal — encryption',
    content:
      'Working title: "Why your metadata is the message."\n25 minutes, no slides after the first five.\nEnd on what a reader can change this week.',
    category: 'Ideas',
    pinned: false,
    color: 'sky',
    updated: '03 Aug 2026',
    tags: ['speaking'],
  },
  {
    id: 35,
    title: 'Home automation wish list',
    content:
      'Lights that dim on the last calendar event of the day.\nDoor sensor that pings the family group, not a cloud service.\nEverything local-first.',
    category: 'Ideas',
    pinned: false,
    color: 'violet',
    updated: '01 Aug 2026',
    tags: ['home'],
  },
  {
    id: 36,
    title: 'Questions worth asking',
    content:
      'What would this look like if it were easy?\nWhat am I optimising that nobody asked for?\nWhat would I cut if I had half the time?',
    category: 'Ideas',
    pinned: true,
    color: 'rose',
    updated: '30 Jul 2026',
    tags: ['thinking'],
  },
]

export const noteTemplates = [
  {
    name: 'Meeting notes',
    emoji: '📋',
    category: 'Work',
    body: 'Attendees:\n\nDecisions:\n\nAction items:\n\nNext review:',
  },
  {
    name: 'Daily standup',
    emoji: '🗓️',
    category: 'Work',
    body: 'Yesterday:\n\nToday:\n\nBlockers:',
  },
  {
    name: 'Packing list',
    emoji: '🧳',
    category: 'Travel',
    body: 'Documents:\n\nClothing:\n\nElectronics:\n\nMedication:',
  },
  {
    name: 'Grocery run',
    emoji: '🛒',
    category: 'Personal',
    body: 'Fresh:\n\nPantry:\n\nHousehold:',
  },
  {
    name: 'Budget review',
    emoji: '💰',
    category: 'Finance',
    body: 'Income:\n\nFixed costs:\n\nVariable:\n\nSaved this month:',
  },
  {
    name: 'Recovery plan',
    emoji: '🔐',
    category: 'Security',
    body: 'Where each share lives:\n\nWho to contact:\n\nLast verified:',
  },
  {
    name: 'Reading notes',
    emoji: '📚',
    category: 'Personal',
    body: 'Book:\n\nKey idea:\n\nQuotes:\n\nWhat I will do differently:',
  },
  {
    name: 'Idea capture',
    emoji: '💡',
    category: 'Ideas',
    body: 'The idea in one line:\n\nWhy now:\n\nSmallest first version:',
  },
]

export const initialChecklist = [
  { id: 'c1', text: 'Renew passport before December', done: true },
  { id: 'c2', text: 'Book the Kyoto ryokan', done: true },
  { id: 'c3', text: 'Verify recovery share with sibling', done: false },
  { id: 'c4', text: 'Submit medical insurance receipt', done: false },
  { id: 'c5', text: 'Step up SIP by 10%', done: false },
  { id: 'c6', text: 'Back up the photo library', done: false },
]

export const voiceMemos = [
  { title: 'Standup recap — payments', duration: '1:24', when: 'Today, 10:05', size: '412 KB' },
  { title: 'Idea while walking', duration: '0:38', when: 'Today, 07:42', size: '186 KB' },
  { title: 'Call notes — vendor quote', duration: '3:12', when: 'Yesterday, 16:20', size: '902 KB' },
  { title: 'Grocery list, spoken', duration: '0:22', when: 'Yesterday, 08:15', size: '104 KB' },
  { title: 'Book passage worth keeping', duration: '1:51', when: '05 Aug 2026', size: '540 KB' },
  { title: 'Interview question drafts', duration: '2:47', when: '03 Aug 2026', size: '798 KB' },
]

export const reminders = [
  { title: 'Verify recovery share', when: 'Tomorrow, 18:00', repeat: 'Every 6 months', tone: 'security' },
  { title: 'Pay the HDFC card', when: '15 Aug, 10:00', repeat: 'Monthly', tone: 'finance' },
  { title: 'Water the monstera', when: 'Thursday, 08:00', repeat: 'Twice weekly', tone: 'personal' },
  { title: 'Japan visa appointment', when: '22 Aug, 11:30', repeat: 'One-off', tone: 'travel' },
  { title: 'Quarterly passkey audit', when: '01 Sep, 09:00', repeat: 'Quarterly', tone: 'security' },
  { title: 'Submit tax proofs', when: '10 Sep, 17:00', repeat: 'Yearly', tone: 'finance' },
]

export const syncDevices = [
  { name: 'iPhone 16 Pro', kind: 'Primary phone', status: 'Synced just now', icon: '📱' },
  { name: 'MacBook Pro', kind: 'Desktop app', status: 'Synced 4 minutes ago', icon: '💻' },
  { name: 'iPad Air', kind: 'Tablet', status: 'Synced 2 hours ago', icon: '📓' },
  { name: 'Windows desktop', kind: 'Office machine', status: 'Synced yesterday', icon: '🖥️' },
  { name: 'Web (Chrome)', kind: 'Browser session', status: 'Active now', icon: '🌐' },
  { name: 'Pixel Watch', kind: 'Voice capture only', status: 'Synced 1 hour ago', icon: '⌚' },
]

export const shortcuts = [
  { keys: 'Ctrl / ⌘ + N', action: 'Create a new note' },
  { keys: 'Ctrl / ⌘ + K', action: 'Search the whole vault' },
  { keys: 'Ctrl / ⌘ + P', action: 'Pin or unpin the open note' },
  { keys: 'Ctrl / ⌘ + E', action: 'Toggle edit mode' },
  { keys: 'Ctrl / ⌘ + Shift + C', action: 'Insert a checklist' },
  { keys: 'Ctrl / ⌘ + Shift + V', action: 'Start a voice memo' },
  { keys: 'Ctrl / ⌘ + D', action: 'Duplicate the note' },
  { keys: 'Ctrl / ⌘ + Backspace', action: 'Move to trash' },
  { keys: 'Ctrl / ⌘ + 1…6', action: 'Jump to a category' },
  { keys: 'Esc', action: 'Close the editor' },
]

export const notesTips = [
  {
    title: 'Message yourself first',
    desc: 'Your self-chat is the fastest capture surface there is. Sort it into notes later, when you have a minute.',
  },
  {
    title: 'Pin no more than five',
    desc: 'Pinning everything is the same as pinning nothing. Five is about the limit before the top of the vault stops helping.',
  },
  {
    title: 'Colour by urgency, not topic',
    desc: 'Categories already carry the topic. Colour is more useful as a signal for what needs attention this week.',
  },
  {
    title: 'Write the next action, not the summary',
    desc: 'A note that ends in a verb is a note you can act on six weeks later without re-reading the whole thing.',
  },
  {
    title: 'Voice for capture, text for thinking',
    desc: 'Speak the raw idea while walking, then edit it into shape at a keyboard. Do not try to do both at once.',
  },
  {
    title: 'Review security notes twice a year',
    desc: 'Recovery instructions rot quietly. Put a recurring reminder on them the day you write them.',
  },
]

export const notesFeatures = [
  { title: 'End-to-end encrypted', desc: 'Notes are sealed on your device before they sync. The server stores ciphertext it cannot read.' },
  { title: 'Message yourself', desc: 'Your personal thread doubles as a scratchpad for links, photos and half-formed thoughts.' },
  { title: 'Checklists that count', desc: 'Tick items off and watch the progress bar move. Completed items collapse out of the way.' },
  { title: 'Voice memos', desc: 'Record a thought while walking. Transcription runs on-device, so the audio never leaves your phone.' },
  { title: 'Templates', desc: 'Eight starting points for the notes you write repeatedly, so you never face a blank page.' },
  { title: 'Reminders', desc: 'Attach a time to any note and it comes back to you as a message when it matters.' },
  { title: 'Colour and pin', desc: 'Six colours and a pin for the handful of notes you actually open every day.' },
  { title: 'Cross-device sync', desc: 'Phone, tablet, desktop and web stay in step, with sync state visible per device.' },
  { title: 'Offline first', desc: 'Everything works with no signal. Changes reconcile the moment you reconnect.' },
]

export const notesSteps = [
  { title: 'Capture it fast', desc: 'Type, dictate or forward something into your self-chat. Do not sort it yet.' },
  { title: 'Give it a home', desc: 'Drop it into a category, add a colour if it needs attention this week.' },
  { title: 'Add the next action', desc: 'End every note with a verb, so future-you knows what to do with it.' },
  { title: 'Let it find you', desc: 'Attach a reminder and the note comes back as a message at the right moment.' },
]

export const notesFaqs = [
  {
    q: 'Are my notes end-to-end encrypted?',
    a: 'Yes. Every note, voice memo and checklist is encrypted on your device before it syncs. The server holds ciphertext and has no key to read it.',
    tag: 'Encryption',
  },
  {
    q: 'Can I use notes on desktop and web?',
    a: 'Yes. The vault syncs across iOS, Android, macOS, Windows and the web client. You can see when each device last synced.',
    tag: 'Sync',
  },
  {
    q: 'How does “message yourself” work?',
    a: 'Your own chat thread acts as a capture inbox. Forward a link, dictate a voice note or paste a photo, then file it into a note whenever you get to it.',
    tag: 'Self-chat',
  },
  {
    q: 'What happens if I lose my phone?',
    a: 'Sign in on another device with your recovery shares and the vault restores from encrypted backup. Without enough shares nobody — including us — can decrypt it.',
    tag: 'Recovery',
  },
  {
    q: 'Do notes work offline?',
    a: 'Fully. Create, edit and search with no connection. Changes reconcile automatically when you are back online, with conflicts kept side by side rather than overwritten.',
    tag: 'Offline',
  },
  {
    q: 'Is voice transcription sent to a server?',
    a: 'No. Transcription runs on-device using the local model. The audio and the transcript both stay inside your encrypted vault.',
    tag: 'Voice',
  },
  {
    q: 'Can I share a note with someone?',
    a: 'Yes, into a chat. The note is re-encrypted for that recipient, and you can revoke access later — which removes it from their vault too.',
    tag: 'Sharing',
  },
  {
    q: 'Is there a limit on notes or attachments?',
    a: 'No note count limit. Individual attachments are capped at 100MB, and the vault is included with your account at no extra cost.',
    tag: 'Limits',
  },
  {
    q: 'What happens when I delete a note?',
    a: 'It goes to trash for 30 days, then is purged from every synced device. Purged notes are unrecoverable by design.',
    tag: 'Deleting',
  },
  {
    q: 'Can I export everything?',
    a: 'Yes. Export the whole vault as Markdown files with attachments in a single archive, any time you want it.',
    tag: 'Export',
  },
]

export const notesTestimonials = [
  {
    quote: 'Self-chat became my inbox for everything. I stopped emailing links to myself years ago and never looked back.',
    name: 'Riya Malhotra',
    role: 'Journalist, Delhi',
  },
  {
    quote: 'On-device voice transcription is the reason I trust it with call notes. The audio genuinely never leaves.',
    name: 'Peter Nilsson',
    role: 'Lawyer, Stockholm',
  },
  {
    quote: 'The checklist collapse for finished items is a tiny thing that made me actually use checklists.',
    name: 'Ananya Desai',
    role: 'PhD student, Ahmedabad',
  },
  {
    quote: 'I keep my recovery instructions here, with a six-monthly reminder. That combination is the whole system.',
    name: 'Jonas Meyer',
    role: 'Security engineer, Zurich',
  },
  {
    quote: 'Offline editing on a plane, reconciled by the time I landed. No conflict, no lost paragraph.',
    name: 'Grace Oyelaran',
    role: 'Consultant, Accra',
  },
  {
    quote: 'Templates removed the blank-page problem from my standup notes. Two minutes, done.',
    name: 'Tomás Herrera',
    role: 'Engineering manager, Bogotá',
  },
]

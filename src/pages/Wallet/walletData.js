// ---------------------------------------------------------------------------
// KT Wallet — page content.
//
// This file used to carry the sample data the page's interactive demo ran on:
// contacts, transactions, cards, payment methods, bill categories, rewards,
// savings goals, crypto holdings and the limits table. That demo is gone, so
// the data went with it. What is left is the marketing copy the page renders.
//
// backend/scripts/import-datafile-copy.mjs reads the arrays below by name to
// seed the admin text overrides, so renaming one means editing that list too.
// ---------------------------------------------------------------------------

export const securityFeatures = [
  { title: 'Passkey approval on every payment', desc: 'Face or fingerprint confirms each transfer. There is no password to phish or reuse.' },
  { title: 'PCI DSS Level 1 partner banks', desc: 'Card details are tokenised at the bank. KT Messenger never stores a full card number.' },
  { title: 'Instant card freeze', desc: 'Freeze and unfreeze any card from the app in one tap no call centre, no waiting.' },
  { title: 'Per card spending caps', desc: 'Set a monthly ceiling for each card. Spend above it is declined, not merely flagged.' },
  { title: 'Encrypted payment notes', desc: 'The note you attach to a transfer is end to end encrypted, exactly like a message.' },
  { title: 'Scam pattern warnings', desc: 'First time recipients and unusual amounts trigger a confirmation step before money moves.' },
]

export const walletFeatures = [
  { title: 'Send money in a chat', desc: 'Pay anyone in your contacts without leaving the conversation. Settles in seconds on KT Instant Transfer.' },
  { title: 'Request and remind', desc: 'Send a payment request with a note. One gentle reminder goes out automatically after 48 hours.' },
  { title: 'Split any bill', desc: 'Split evenly or by share, add a tip, and the request lands in everyone’s chat at once.' },
  { title: 'Three cards, one wallet', desc: 'Virtual, metal and multi currency travel cards with independent limits and freeze switches.' },
  { title: 'Bills on autopay', desc: 'Twelve bill categories with due date reminders and a confirmation before every debit.' },
  { title: 'Savings goals', desc: 'Ring fence money toward a target and watch the progress bar fill as you add to it.' },
  { title: 'Non custodial crypto vault', desc: 'Hold KTC, KTT and KTX behind a device passkey. Your keys stay in the secure element.' },
  { title: 'Cashback that is not a maze', desc: 'Plain offers with visible caps and expiry dates no points to decode.' },
  { title: 'Exportable statements', desc: 'Download any date range as CSV or PDF whenever you need it for accounting.' },
]

export const walletSteps = [
  { title: 'Open a chat', desc: 'Tap the payment icon in any conversation with a contact on KT Pay.' },
  { title: 'Enter the amount', desc: 'Add an optional encrypted note so both sides remember what it was for.' },
  { title: 'Confirm with a passkey', desc: 'Face or fingerprint approves the transfer. Nothing moves without it.' },
  { title: 'Both sides get a receipt', desc: 'A signed receipt lands in the thread, and the money settles in seconds.' },
]

export const walletFaqs = [
  {
    q: 'Is KT Wallet safe for sending money?',
    a: 'Every payment is approved with a device passkey and settled through PCI DSS Level 1 partner banks. Card numbers are tokenised at the bank, so the app never holds one.',
    tag: 'Security',
  },
  {
    q: 'Are there hidden fees on transfers?',
    a: 'No. Peer to peer KT transfers and bank transfers are free with no cap on value beyond the daily limits. Fees that do apply international card spend, extra ATM withdrawals are listed in full on this page.',
    tag: 'Fees',
  },
  {
    q: 'Which payment methods are supported?',
    a: 'KT Instant Transfer, KT Card, KT Card Plus, net banking, KT Pay and a non custodial crypto vault. You can hold and spend ten currencies from the travel card.',
    tag: 'Methods',
  },
  {
    q: 'What happens if I send money to the wrong person?',
    a: 'A first time recipient triggers a confirmation step showing the verified name before anything moves. Once an instant transfer settles it cannot be reversed unilaterally, so you would raise a dispute from the receipt.',
    tag: 'Mistakes',
  },
  {
    q: 'Can I freeze a card instantly?',
    a: 'Yes. Freeze and unfreeze from the cards section in one tap. A frozen card declines every new authorisation immediately, including recurring ones.',
    tag: 'Cards',
  },
  {
    q: 'Who can see my payment notes?',
    a: 'Only you and the recipient. Payment notes are end to end encrypted like any other message, and are not used for advertising or profiling.',
    tag: 'Privacy',
  },
  {
    q: 'Does the crypto vault hold my keys?',
    a: 'No it is non custodial. Signing keys live in your device secure element behind a passkey. That also means nobody, including us, can restore access if you lose every recovery share.',
    tag: 'Crypto',
  },
  {
    q: 'How do savings goals work?',
    a: 'Money you allocate to a goal is ring fenced from your spending balance. You can withdraw it back at any time there is no lock in and no penalty.',
    tag: 'Savings',
  },
  {
    q: 'Can I get a statement for accounting?',
    a: 'Yes. Export any date range as CSV or PDF from the activity section. Statements include the method, status and reference for every entry.',
    tag: 'Statements',
  },
  {
    q: 'What are the daily limits?',
    a: 'KT Instant Transfer is capped at ₹1,00,000 across 20 transactions a day, bank transfers at ₹5,00,000 and merchant payments at ₹2,00,000. The full table is in the limits section above.',
    tag: 'Limits',
  },
]

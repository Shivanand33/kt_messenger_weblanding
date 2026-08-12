// ---------------------------------------------------------------------------
// KT Wallet — page content.
// All balances, contacts and transactions are illustrative sample data used to
// demonstrate the interface. Nothing here touches a real payment rail.
// ---------------------------------------------------------------------------

export const contacts = [
  { name: 'Anika Sharma', handle: '@anika.kt', upi: 'anika@ktpay', recent: true },
  { name: 'Rohit Verma', handle: '@rohitv', upi: 'rohit@ktpay', recent: true },
  { name: 'Meera Nair', handle: '@meera.n', upi: 'meera@ktpay', recent: true },
  { name: 'Arjun Patel', handle: '@arjunp', upi: 'arjun@ktpay', recent: true },
  { name: 'Sana Qureshi', handle: '@sanaq', upi: 'sana@ktpay', recent: false },
  { name: 'Dev Malhotra', handle: '@devm', upi: 'dev@ktpay', recent: false },
  { name: 'Ishita Roy', handle: '@ishitar', upi: 'ishita@ktpay', recent: false },
  { name: 'Kabir Singh', handle: '@kabirs', upi: 'kabir@ktpay', recent: false },
]

export const transactionCategories = ['All', 'Sent', 'Received', 'Shopping', 'Bills', 'Food', 'Travel']

export const initialTransactions = [
  { id: 't1', name: 'Anika Sharma', note: 'Dinner split', category: 'Sent', direction: 'out', amount: 500, date: 'Today, 2:45 PM', method: 'UPI', status: 'Completed' },
  { id: 't2', name: 'Nova Bank', note: 'Failed order refund', category: 'Received', direction: 'in', amount: 1200, date: 'Today, 11:02 AM', method: 'IMPS', status: 'Completed' },
  { id: 't3', name: 'Blue Tokai Coffee', note: 'Cold brew ×2', category: 'Food', direction: 'out', amount: 340, date: 'Today, 9:18 AM', method: 'Scan & pay', status: 'Completed' },
  { id: 't4', name: 'Rohit Verma', note: 'Trip fuel share', category: 'Received', direction: 'in', amount: 450, date: 'Yesterday, 8:30 PM', method: 'UPI', status: 'Completed' },
  { id: 't5', name: 'Amazon India', note: 'Mechanical keyboard', category: 'Shopping', direction: 'out', amount: 1599, date: 'Yesterday, 6:12 PM', method: 'KT Card', status: 'Completed' },
  { id: 't6', name: 'Airtel Broadband', note: 'August bill', category: 'Bills', direction: 'out', amount: 1099, date: 'Yesterday, 10:40 AM', method: 'Autopay', status: 'Completed' },
  { id: 't7', name: 'Staking rewards', note: 'Monthly payout', category: 'Received', direction: 'in', amount: 890, date: '05 Aug 2026', method: 'KT Vault', status: 'Completed' },
  { id: 't8', name: 'Uber India', note: 'Airport drop', category: 'Travel', direction: 'out', amount: 742, date: '05 Aug 2026', method: 'UPI', status: 'Completed' },
  { id: 't9', name: 'Meera Nair', note: 'Concert tickets', category: 'Sent', direction: 'out', amount: 2400, date: '04 Aug 2026', method: 'UPI', status: 'Completed' },
  { id: 't10', name: 'Swiggy', note: 'Weekend order', category: 'Food', direction: 'out', amount: 618, date: '04 Aug 2026', method: 'KT Card', status: 'Completed' },
  { id: 't11', name: 'Freelance invoice #218', note: 'Design retainer', category: 'Received', direction: 'in', amount: 42000, date: '03 Aug 2026', method: 'NEFT', status: 'Completed' },
  { id: 't12', name: 'Tata Power', note: 'Electricity bill', category: 'Bills', direction: 'out', amount: 2340, date: '03 Aug 2026', method: 'Autopay', status: 'Completed' },
  { id: 't13', name: 'IndiGo Airlines', note: 'BLR → DEL', category: 'Travel', direction: 'out', amount: 5480, date: '02 Aug 2026', method: 'KT Card', status: 'Completed' },
  { id: 't14', name: 'Arjun Patel', note: 'Gift pool', category: 'Sent', direction: 'out', amount: 1000, date: '02 Aug 2026', method: 'UPI', status: 'Completed' },
  { id: 't15', name: 'BigBasket', note: 'Weekly groceries', category: 'Shopping', direction: 'out', amount: 2860, date: '01 Aug 2026', method: 'UPI', status: 'Completed' },
  { id: 't16', name: 'Jio Mobile', note: 'Recharge — 84 days', category: 'Bills', direction: 'out', amount: 859, date: '01 Aug 2026', method: 'Autopay', status: 'Completed' },
  { id: 't17', name: 'Sana Qureshi', note: 'Book club fund', category: 'Received', direction: 'in', amount: 600, date: '31 Jul 2026', method: 'UPI', status: 'Completed' },
  { id: 't18', name: 'Cult.fit', note: 'Quarterly membership', category: 'Bills', direction: 'out', amount: 4499, date: '30 Jul 2026', method: 'KT Card', status: 'Completed' },
  { id: 't19', name: 'Third Wave Coffee', note: 'Team catch-up', category: 'Food', direction: 'out', amount: 1240, date: '29 Jul 2026', method: 'Scan & pay', status: 'Completed' },
  { id: 't20', name: 'Cashback — August', note: 'Card spend reward', category: 'Received', direction: 'in', amount: 318, date: '28 Jul 2026', method: 'KT Rewards', status: 'Completed' },
  { id: 't21', name: 'Dev Malhotra', note: 'Rent share', category: 'Sent', direction: 'out', amount: 12500, date: '28 Jul 2026', method: 'UPI', status: 'Completed' },
  { id: 't22', name: 'Croma Electronics', note: 'USB-C hub', category: 'Shopping', direction: 'out', amount: 3299, date: '27 Jul 2026', method: 'KT Card', status: 'Completed' },
  { id: 't23', name: 'IRCTC', note: 'Train booking', category: 'Travel', direction: 'out', amount: 1865, date: '26 Jul 2026', method: 'UPI', status: 'Pending' },
  { id: 't24', name: 'Ishita Roy', note: 'Photography deposit', category: 'Received', direction: 'in', amount: 3500, date: '25 Jul 2026', method: 'UPI', status: 'Completed' },
]

export const cards = [
  {
    id: 'virtual',
    label: 'KT Virtual Card',
    kind: 'Virtual · Visa',
    number: '4829 7712 0043 8492',
    expiry: '12/29',
    cvv: '318',
    gradient: 'from-blue-700 via-indigo-800 to-indigo-950',
    monthlyLimit: 200000,
    spent: 42680,
  },
  {
    id: 'physical',
    label: 'KT Metal Card',
    kind: 'Physical · Mastercard',
    number: '5218 4460 9931 1207',
    expiry: '08/30',
    cvv: '904',
    gradient: 'from-slate-800 via-slate-900 to-black',
    monthlyLimit: 500000,
    spent: 118400,
  },
  {
    id: 'travel',
    label: 'KT Travel Card',
    kind: 'Multi-currency · Visa',
    number: '4712 3390 5527 6641',
    expiry: '04/29',
    cvv: '552',
    gradient: 'from-teal-600 via-emerald-700 to-emerald-950',
    monthlyLimit: 300000,
    spent: 26150,
  },
]

export const paymentMethods = [
  { icon: '🇮🇳', name: 'UPI 1-tap', desc: 'Direct bank transfers with zero fee on peer-to-peer payments.' },
  { icon: '💳', name: 'Visa & Mastercard', desc: 'Add any Indian or international debit and credit card.' },
  { icon: '🏦', name: 'Net banking', desc: 'Every major bank supported, with instant account verification.' },
  { icon: '⚡', name: 'KT Web3 Vault', desc: 'Non-custodial BTC, ETH and SOL held behind a device passkey.' },
  { icon: '📲', name: 'Apple & Google Pay', desc: 'Biometric one-touch checkout wherever contactless is accepted.' },
  { icon: '🧾', name: 'RuPay & autopay', desc: 'Set standing instructions for bills you never want to think about.' },
  { icon: '🌍', name: 'Multi-currency', desc: 'Hold and spend ten currencies at interbank conversion rates.' },
  { icon: '🎁', name: 'Gift balance', desc: 'Redeem vouchers and gift cards straight into your wallet balance.' },
]

export const billCategories = [
  { icon: '💡', name: 'Electricity', due: '₹2,340 due in 4 days' },
  { icon: '📱', name: 'Mobile recharge', due: 'Plan expires in 12 days' },
  { icon: '📺', name: 'DTH & cable', due: 'Paid for this month' },
  { icon: '🔥', name: 'Piped gas', due: '₹618 due in 9 days' },
  { icon: '💧', name: 'Water', due: 'Paid for this month' },
  { icon: '🌐', name: 'Broadband', due: 'Autopay on the 5th' },
  { icon: '🛡️', name: 'Insurance', due: '₹8,400 due in 21 days' },
  { icon: '🏦', name: 'Credit card', due: '₹18,240 due in 6 days' },
  { icon: '🏠', name: 'Rent', due: 'Autopay on the 1st' },
  { icon: '🎓', name: 'Education fees', due: 'Next term in 40 days' },
  { icon: '🚗', name: 'FASTag', due: 'Balance ₹420 — low' },
  { icon: '🎬', name: 'Subscriptions', due: '3 active · ₹1,297/mo' },
]

export const rewards = [
  { title: '5% back on fuel', desc: 'Up to ₹300 a month at any partner fuel station when you pay by scan.', code: 'FUEL5', expires: '31 Aug' },
  { title: '₹150 off food orders', desc: 'On orders above ₹499 with the KT Card at partner restaurants.', code: 'EAT150', expires: '18 Aug' },
  { title: '10% travel cashback', desc: 'Flights and hotels booked through partner apps, capped at ₹2,000.', code: 'FLY10', expires: '30 Sep' },
  { title: 'Zero-fee ATM month', desc: 'Unlimited free withdrawals for 30 days after your first card spend.', code: 'ATMFREE', expires: '25 Aug' },
  { title: '₹500 referral bonus', desc: 'For you and your friend once they complete their first transfer.', code: 'BRING500', expires: 'Ongoing' },
  { title: '2× rewards on groceries', desc: 'Double points at supermarkets and grocery apps every weekend.', code: 'GROC2X', expires: '29 Aug' },
]

export const initialGoals = [
  { id: 'g1', name: 'Japan trip', emoji: '🇯🇵', target: 150000, saved: 92400 },
  { id: 'g2', name: 'Emergency fund', emoji: '🛟', target: 300000, saved: 214500 },
  { id: 'g3', name: 'New laptop', emoji: '💻', target: 180000, saved: 47300 },
  { id: 'g4', name: 'Wedding gift pool', emoji: '🎁', target: 40000, saved: 38600 },
]

export const cryptoHoldings = [
  { symbol: 'BTC', name: 'Bitcoin', qty: 0.084, value: 476320, change: 4.25 },
  { symbol: 'ETH', name: 'Ethereum', qty: 1.42, value: 427180, change: 2.8 },
  { symbol: 'SOL', name: 'Solana', qty: 22.5, value: 348920, change: 8.15 },
  { symbol: 'USDC', name: 'USD Coin', qty: 1850, value: 155310, change: 0.01 },
  { symbol: 'MATIC', name: 'Polygon', qty: 940, value: 56840, change: 1.95 },
]

export const limitsTable = [
  { action: 'UPI peer-to-peer transfer', limit: '₹1,00,000 per day', fee: 'Free', notes: '20 transactions daily' },
  { action: 'Bank account transfer (IMPS)', limit: '₹5,00,000 per day', fee: 'Free', notes: 'Settles in seconds' },
  { action: 'Merchant payment', limit: '₹2,00,000 per day', fee: 'Free for you', notes: 'Merchant pays 0.4%' },
  { action: 'Card spend — domestic', limit: 'Per-card monthly cap', fee: 'Free', notes: 'Adjust the cap any time' },
  { action: 'Card spend — international', limit: '₹2,50,000 per month', fee: '1.5% FX markup', notes: 'Waived on the Travel Card' },
  { action: 'ATM withdrawal', limit: '₹25,000 per day', fee: '5 free, then ₹21', notes: 'Free with the metal card' },
  { action: 'Crypto vault transfer', limit: 'No platform limit', fee: 'Network fee only', notes: 'Passkey approval required' },
  { action: 'Add money to wallet', limit: '₹2,00,000 per day', fee: 'Free', notes: 'UPI, netbanking or card' },
]

export const securityFeatures = [
  { title: 'Passkey approval on every payment', desc: 'Face or fingerprint confirms each transfer. There is no password to phish or reuse.' },
  { title: 'PCI-DSS Level 1 partner banks', desc: 'Card details are tokenised at the bank. KT Messenger never stores a full card number.' },
  { title: 'Instant card freeze', desc: 'Freeze and unfreeze any card from the app in one tap — no call centre, no waiting.' },
  { title: 'Per-card spending caps', desc: 'Set a monthly ceiling for each card. Spend above it is declined, not merely flagged.' },
  { title: 'Encrypted payment notes', desc: 'The note you attach to a transfer is end-to-end encrypted, exactly like a message.' },
  { title: 'Scam-pattern warnings', desc: 'First-time recipients and unusual amounts trigger a confirmation step before money moves.' },
]

export const walletFeatures = [
  { title: 'Send money in a chat', desc: 'Pay anyone in your contacts without leaving the conversation. Settles in seconds on UPI.' },
  { title: 'Request and remind', desc: 'Send a payment request with a note. One gentle reminder goes out automatically after 48 hours.' },
  { title: 'Split any bill', desc: 'Split evenly or by share, add a tip, and the request lands in everyone’s chat at once.' },
  { title: 'Three cards, one wallet', desc: 'Virtual, metal and multi-currency travel cards with independent limits and freeze switches.' },
  { title: 'Bills on autopay', desc: 'Twelve bill categories with due-date reminders and a confirmation before every debit.' },
  { title: 'Savings goals', desc: 'Ring-fence money toward a target and watch the progress bar fill as you add to it.' },
  { title: 'Non-custodial crypto vault', desc: 'Hold BTC, ETH and SOL behind a device passkey. Your keys stay in the secure element.' },
  { title: 'Cashback that is not a maze', desc: 'Plain offers with visible caps and expiry dates — no points to decode.' },
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
    a: 'Every payment is approved with a device passkey and settled through PCI-DSS Level 1 partner banks. Card numbers are tokenised at the bank, so the app never holds one.',
    tag: 'Security',
  },
  {
    q: 'Are there hidden fees on transfers?',
    a: 'No. Peer-to-peer UPI and bank transfers are free with no cap on value beyond the daily limits. Fees that do apply — international card spend, extra ATM withdrawals — are listed in full on this page.',
    tag: 'Fees',
  },
  {
    q: 'Which payment methods are supported?',
    a: 'UPI, Visa, Mastercard, RuPay, net banking, Apple Pay, Google Pay and a non-custodial crypto vault. You can hold and spend ten currencies from the travel card.',
    tag: 'Methods',
  },
  {
    q: 'What happens if I send money to the wrong person?',
    a: 'A first-time recipient triggers a confirmation step showing the verified name before anything moves. Once a UPI transfer settles it cannot be reversed unilaterally, so you would raise a dispute from the receipt.',
    tag: 'Mistakes',
  },
  {
    q: 'Can I freeze a card instantly?',
    a: 'Yes. Freeze and unfreeze from the cards section in one tap. A frozen card declines every new authorisation immediately, including recurring ones.',
    tag: 'Cards',
  },
  {
    q: 'Who can see my payment notes?',
    a: 'Only you and the recipient. Payment notes are end-to-end encrypted like any other message, and are not used for advertising or profiling.',
    tag: 'Privacy',
  },
  {
    q: 'Does the crypto vault hold my keys?',
    a: 'No — it is non-custodial. Signing keys live in your device secure element behind a passkey. That also means nobody, including us, can restore access if you lose every recovery share.',
    tag: 'Crypto',
  },
  {
    q: 'How do savings goals work?',
    a: 'Money you allocate to a goal is ring-fenced from your spending balance. You can withdraw it back at any time — there is no lock-in and no penalty.',
    tag: 'Savings',
  },
  {
    q: 'Can I get a statement for accounting?',
    a: 'Yes. Export any date range as CSV or PDF from the activity section. Statements include the method, status and reference for every entry.',
    tag: 'Statements',
  },
  {
    q: 'What are the daily limits?',
    a: 'UPI is capped at ₹1,00,000 across 20 transactions a day, bank transfers at ₹5,00,000 and merchant payments at ₹2,00,000. The full table is in the limits section above.',
    tag: 'Limits',
  },
]

export const walletTestimonials = [
  {
    quote: 'Splitting a dinner bill used to take three apps and a screenshot. Now it is one message and everyone pays.',
    name: 'Nikhil Rao',
    role: 'Software engineer, Hyderabad',
  },
  {
    quote: 'The freeze switch saved me. Card gone, frozen in ten seconds, unfrozen when it turned up in the sofa.',
    name: 'Elena Petrova',
    role: 'Consultant, Berlin',
  },
  {
    quote: 'Zero-fee transfers are genuinely zero. I checked three months of statements before I believed it.',
    name: 'Farhan Ahmed',
    role: 'Small business owner, Kochi',
  },
  {
    quote: 'Savings goals with a visible progress bar did more for my discipline than any budgeting app.',
    name: 'Chloe Bernard',
    role: 'Teacher, Lyon',
  },
  {
    quote: 'Per-card monthly caps mean my team card literally cannot overspend. That is the whole feature.',
    name: 'Sandeep Gupta',
    role: 'Operations lead, Delhi',
  },
  {
    quote: 'Encrypted payment notes sound like a small thing until you remember what people write in them.',
    name: 'Amara Okafor',
    role: 'Privacy researcher, Lagos',
  },
]

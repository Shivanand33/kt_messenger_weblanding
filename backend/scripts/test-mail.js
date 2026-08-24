// Verify the email settings in .env actually work.
//   npm run mail:test                -> sends to SMTP_USER (yourself)
//   npm run mail:test you@gmail.com  -> sends to that address
import dotenv from 'dotenv'
import { sendMail } from '../src/services/email.service.js'

dotenv.config()

// SMTP_USER is a real address for Gmail, but the literal word "apikey" for
// SendGrid — in that case fall back to the address inside EMAIL_FROM.
const fromAddr = (process.env.EMAIL_FROM || '').match(/<([^>]+)>/)?.[1] || process.env.EMAIL_FROM
const userAsAddr = (process.env.SMTP_USER || '').includes('@') ? process.env.SMTP_USER : null
const to = process.argv[2] || userAsAddr || fromAddr
const provider = process.env.EMAIL_PROVIDER || 'log'

console.log('\n──── KT Messenger · email settings test ────')
console.log(`EMAIL_PROVIDER : ${provider}`)
console.log(`EMAIL_FROM     : ${process.env.EMAIL_FROM || '(not set)'}`)
console.log(`SMTP_HOST      : ${process.env.SMTP_HOST || '(not set)'}`)
console.log(`SMTP_PORT      : ${process.env.SMTP_PORT || '(not set)'}`)
console.log(`SMTP_USER      : ${process.env.SMTP_USER || '(not set)'}`)
console.log(`SMTP_PASS      : ${process.env.SMTP_PASS ? `set (${process.env.SMTP_PASS.length} chars)` : 'EMPTY  <-- this is what you need to fill'}`)
console.log(`Sending to     : ${to || '(no recipient)'}`)
console.log('────────────────────────────────────────────\n')

if (!to) {
  console.error('❌ No recipient. Set SMTP_USER in .env or run: npm run mail:test you@example.com')
  process.exit(1)
}

if (provider === 'smtp' && process.env.SMTP_PASS && process.env.SMTP_PASS.includes(' ')) {
  console.log('⚠️  SMTP_PASS contains spaces. Google shows the App Password as "abcd efgh ijkl mnop"')
  console.log('    but you must paste it WITHOUT spaces: "abcdefghijklmnop"\n')
}

try {
  const result = await sendMail({
    to,
    subject: 'KT Messenger — test email',
    text: 'If you are reading this, your KT Messenger email settings work.\n\nAdmin replies to contact messages will now be delivered.',
    html: '<p>If you are reading this, your KT Messenger email settings work.</p><p>Admin replies to contact messages will now be delivered.</p>',
  })

  if (result.delivered) {
    console.log(`✅ SUCCESS — email delivered to ${to} via ${result.provider}.`)
    console.log('   Check that inbox (and the spam folder). Admin replies will now work.\n')
  } else {
    console.log(`ℹ️  Provider is "${result.provider}" — the email was printed above, not delivered.`)
    console.log('   Set EMAIL_PROVIDER="smtp" and fill SMTP_PASS in .env to really send.\n')
  }
} catch (err) {
  console.error(`❌ FAILED — ${err.message}\n`)
  process.exit(1)
}

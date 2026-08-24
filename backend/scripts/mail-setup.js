// One-shot: save the SMTP password AND send a real test.
//   npm run mail:setup <password>          (uses SMTP_USER as recipient)
//   npm run mail:setup <password> to@x.com (custom recipient)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const DIR = path.dirname(fileURLToPath(import.meta.url))
const ENV = path.join(DIR, '..', '.env')

const args = process.argv.slice(2)
// last arg that looks like an email is the recipient; everything else is the password
let recipient = null
if (args.length && /@/.test(args[args.length - 1])) recipient = args.pop()
const pass = args.join('').replace(/\s+/g, '').replace(/^["']|["']$/g, '')

if (!pass) { console.error('\n❌ Usage: npm run mail:setup <app-password> [recipient@email.com]\n'); process.exit(1) }
if (/^replace_with_app_password$/i.test(pass)) { console.error('\n❌ That is the placeholder, not a real password.\n'); process.exit(1) }

// write it
let env = fs.readFileSync(ENV, 'utf8')
env = /^SMTP_PASS=.*$/m.test(env) ? env.replace(/^SMTP_PASS=.*$/m, `SMTP_PASS="${pass}"`) : `${env.trimEnd()}\nSMTP_PASS="${pass}"\n`
fs.writeFileSync(ENV, env)
console.log(`\n✅ Saved to backend/.env  (SMTP_PASS = ${pass.length} characters)`)

// reload + test
dotenv.config({ path: ENV, override: true })
const host = process.env.SMTP_HOST, user = process.env.SMTP_USER
const to = recipient || (String(user).includes('@') ? user : (process.env.EMAIL_FROM || '').match(/<([^>]+)>/)?.[1])
console.log(`   Host: ${host}  User: ${user}`)
console.log(`   Sending real test to: ${to}\n`)

const { sendMail } = await import('../src/services/email.service.js')
try {
  const r = await sendMail({ to, subject: 'KT Messenger — setup test', text: 'Your email settings work. Admin replies will now be delivered.', html: '<p>Your email settings work. Admin replies will now be delivered.</p>' })
  console.log(r.delivered ? `✅✅ SUCCESS — email delivered to ${to} via ${r.provider}.\n   Check that inbox (also Spam). Admin "Send reply" will now work.\n` : `ℹ️ provider="${r.provider}" (nothing actually sent).\n`)
} catch (e) {
  console.error(`❌ FAILED — ${e.message}\n`)
  process.exit(1)
}

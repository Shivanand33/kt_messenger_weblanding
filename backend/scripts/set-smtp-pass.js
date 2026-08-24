// Safely write the Gmail App Password into backend/.env — no editor needed.
//   npm run mail:pass            -> asks for the password
//   npm run mail:pass abcd efgh  -> takes it from the arguments
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'

const ENV = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env')

function write(raw) {
  const pass = String(raw).replace(/\s+/g, '').replace(/^["']|["']$/g, '')

  if (!pass) { console.error('\n❌ Koi password nahi mila. Dobara chalao.\n'); process.exit(1) }
  if (/^replace_with_(app|mailbox)_password$/i.test(pass)) { console.error('\n❌ Ye placeholder hai, asli password daalo.\n'); process.exit(1) }
  if (pass.length < 6) {
    console.error(`
❌ Password bahut chhota lagta hai (${pass.length} chars). Dobara check karo.
`)
    process.exit(1)
  }

  let env = fs.existsSync(ENV) ? fs.readFileSync(ENV, 'utf8') : ''
  env = /^SMTP_PASS=.*$/m.test(env)
    ? env.replace(/^SMTP_PASS=.*$/m, `SMTP_PASS="${pass}"`)
    : `${env.trimEnd()}\nSMTP_PASS="${pass}"\n`
  fs.writeFileSync(ENV, env)

  console.log(`\n✅ Password backend/.env me save ho gaya (${pass.length} characters).`)
  console.log('   Ab test karo:   npm run mail:test\n')
}

const fromArgs = process.argv.slice(2).join('')
if (fromArgs) { write(fromArgs); process.exit(0) }

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question('Gmail App Password paste karo (spaces chalega): ', (answer) => { rl.close(); write(answer) })

import { createApp } from './app.js'
import { env } from './config/env.js'
import { prisma, checkDbConnection } from './config/db.js'

const app = createApp()

const server = app.listen(env.port, async () => {
  const db = await checkDbConnection()
  // eslint-disable-next-line no-console
  console.log(`✅ KT Messenger API listening on http://localhost:${env.port}`)
  // eslint-disable-next-line no-console
  console.log(`   Database: ${db ? 'connected' : 'NOT connected (run migrations / start Postgres)'}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(`❌ Port ${env.port} is already in use by another process. Please free port ${env.port} or stop previous node instance.`)
  } else {
    // eslint-disable-next-line no-console
    console.error('❌ Server error:', err)
  }
})

async function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received — shutting down...`)
  await prisma.$disconnect().catch(() => {})
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(1), 5000).unref()
}

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => shutdown(sig))


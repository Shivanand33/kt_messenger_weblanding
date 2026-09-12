import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const R2_PATTERN = /https:\/\/pub-[a-zA-Z0-9_-]+\.r2\.dev\//g
  const TARGET = 'http://localhost:4000/uploads/'

  // 1. Update WebsiteContent
  const contents = await prisma.websiteContent.findMany()
  let wcUpdated = 0
  for (const c of contents) {
    if (c.data && typeof c.data === 'object') {
      let changed = false
      const newData = { ...c.data }
      for (const [k, v] of Object.entries(newData)) {
        if (typeof v === 'string' && R2_PATTERN.test(v)) {
          newData[k] = v.replace(R2_PATTERN, TARGET)
          changed = true
        }
      }
      if (changed) {
        await prisma.websiteContent.update({
          where: { id: c.id },
          data: { data: newData },
        })
        wcUpdated++
      }
    }
  }

  // 2. Update Media
  const medias = await prisma.media.findMany()
  let mUpdated = 0
  for (const m of medias) {
    if (typeof m.url === 'string' && R2_PATTERN.test(m.url)) {
      const newUrl = m.url.replace(R2_PATTERN, TARGET)
      await prisma.media.update({
        where: { id: m.id },
        data: { url: newUrl },
      })
      mUpdated++
    }
  }

  console.log(`Cleaned ${wcUpdated} WebsiteContent rows and ${mUpdated} Media rows.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

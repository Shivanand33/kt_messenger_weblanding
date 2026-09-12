import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const wc = await prisma.websiteContent.findMany()
  const m = await prisma.media.findMany()
  console.log('WebsiteContent:', JSON.stringify(wc, null, 2))
  console.log('Media count:', m.length)
  if (m.length > 0) {
    console.log('Media sample:', JSON.stringify(m.slice(0, 5), null, 2))
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())

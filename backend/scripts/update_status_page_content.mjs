import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "Status Updates & Stories Feature | KT Messenger App.",
  description: "Share moments, updates, and stories with KT Messenger Status. Enjoy a secure messaging experience with instant sharing and real-time connections.",
  h1: "Share Your Moments With KT Messenger Status",
  content: "Stay connected by sharing updates, photos, and moments with your friends, family, and communities. KT Messenger Status makes communication more engaging with a simple and secure way to express yourself."
}

async function main() {
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.status' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.status',
        page: 'status',
        label: 'Status SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }
  console.log('Successfully updated DB SEO for status page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

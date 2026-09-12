import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "KT Messenger | Secure Messaging App End-to-End Encryption.",
  description: "KT Messenger provides secure messaging with end-to-end encryption, private chats, protected calls, and advanced privacy features to keep conversations safe.",
  h1: "Your Privacy Comes First With Secure Messaging",
  content: "KT Messenger keeps your conversations private with end-to-end encryption, secure chats, and protected communication. Send messages, make calls, and connect confidently knowing your conversations stay between you and the people you choose."
}

async function main() {
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.security' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.security',
        page: 'security',
        label: 'Security SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }
  console.log('Successfully updated DB SEO for security page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "KTMessenger | Secure Messaging App For Private Messaging.",
  description: "KT Messenger is a secure messaging app for private chats, calls, AI features, and communities. Connect safely and privately across all your devices."
}

async function main() {
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.home' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.home',
        page: 'home',
        label: 'Homepage SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }
  console.log('Homepage SEO updated in DB.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

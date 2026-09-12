import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "KT Messenger | AI Assistant for Smart & Private Chats.",
  description: "KT Messenger AI helps you chat smarter with instant answers, AI-powered features, smart search, and seamless communication in one messaging app.",
  h1: "Meet KT AI, The Future of Smart Messaging",
  content: "Experience smarter conversations with KT AI. Get helpful answers, AI-powered assistance, and seamless communication inside a modern messaging platform."
}

async function main() {
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.ai' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.ai',
        page: 'ai',
        label: 'AI SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }
  console.log('Successfully updated DB SEO for ai page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

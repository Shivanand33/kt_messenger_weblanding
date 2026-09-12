import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "KT Messenger Plus | Advanced Messaging & Premium Features.",
  description: "Upgrade your communication with KT Messenger Plus. Enjoy advanced messaging, secure chats, enhanced privacy, smart features, and seamless connections.",
  h1: "More Features. More Privacy. More Ways to Connect.",
  content: "KT Messenger Plus enhances your everyday communication with smarter chats, improved privacy controls, and powerful messaging tools that help you stay connected easily."
}

const faqs = [
  {
    question: "What is KT Messenger Plus?",
    answer: "KT Messenger Plus is an upgraded version of the KT Messenger app that gives users a better messaging app experience with enhanced features, smoother communication, and more ways to stay connected with people."
  },
  {
    question: "Why should I use KT Messenger Plus?",
    answer: "KT Messenger Plus helps you communicate more easily with improved messaging features, secure conversations, and smart tools. It is designed for users who want a simple yet powerful smart messaging app."
  },
  {
    question: "What extra features do I get with KT Messenger Plus?",
    answer: "KT Messenger Plus offers advanced communication features that improve your chatting experience. You can enjoy smarter conversations, better connectivity, and additional tools that make everyday messaging easier."
  },
  {
    question: "Is KT Messenger Plus safe for private chats?",
    answer: "Yes, KT Messenger Plus focuses on privacy and secure communication. It works as a secure messaging app where you can enjoy private conversations with confidence."
  },
  {
    question: "Why choose KT Messenger Plus in 2026?",
    answer: "KT Messenger Plus is designed for users who want a modern KT Messenger app experience with smarter features, secure communication, and improved messaging tools. It can be a strong choice for users looking for the best messaging app for Android 2026."
  }
]

async function main() {
  // 1. Update SEO
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.plus' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.plus',
        page: 'plus',
        label: 'Plus SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }

  // 2. Update FAQs in DB
  try {
    await prisma.faq.deleteMany({ where: { page: 'plus' } })
    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: {
          page: 'plus',
          question: faqs[i].question,
          answer: faqs[i].answer,
          order: i + 1,
          status: 'PUBLISHED',
          locale: 'en-US'
        }
      })
    }
    console.log('Successfully updated DB FAQs for plus page.')
  } catch (err) {
    console.log('Faq table update error:', err.message)
  }

  console.log('Successfully updated DB SEO for plus page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

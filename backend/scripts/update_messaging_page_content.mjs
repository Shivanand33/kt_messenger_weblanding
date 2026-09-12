import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const newFaqs = [
  {
    question: "What is KT Messenger?",
    answer: "KT Messenger is a modern communication feature that allows users to make voice calls, video calls, and send instant messages from one platform. The KT Messenger app works as an all-in-one instant messaging app designed for fast, private, and reliable communication."
  },
  {
    question: "Is KT Messenger a free messaging and calling app?",
    answer: "Yes, KT Messenger is a free messaging app that allows users to send messages and make voice or video calls through an internet connection. As a free instant messaging app, it helps users stay connected without paying traditional calling charges."
  },
  {
    question: "Is KT Messenger a secure messaging app?",
    answer: "Yes, KT Messenger is designed as a secure instant messaging app that focuses on private and protected communication. Users looking for a safe messaging app can use KT Messenger to enjoy secure conversations with better privacy."
  },
  {
    question: "Can I make private chats using KT Messenger?",
    answer: "Yes, KT Messenger works as a private chat app that allows users to communicate securely with individuals and groups. It is a suitable app for private chat where users can exchange messages and stay connected."
  },
  {
    question: "Does KT Messenger support real-time messaging?",
    answer: "Yes, KT Messenger provides a real time messaging app experience where users can instantly send and receive messages. It works as an online messaging platform that helps people communicate quickly from anywhere."
  },
  {
    question: "Can I use KT Messenger for voice and video calls?",
    answer: "Yes, KT Messenger combines messaging and calling features in one platform. Users can enjoy free texting app and calling features, making it easier to chat, share updates, and connect through voice or video calls."
  }
]

const seoData = {
  title: "Free Video Calling App & Secure Messaging | KT Messenger.",
  description: "KT Messenger is a free video calling app and secure messaging platform for private chats, voice calls, real-time messaging, and seamless communication across devices."
}

async function main() {
  // 1. Delete existing published FAQs for messaging page
  await prisma.faq.deleteMany({ where: { page: 'messaging' } })

  // 2. Insert new FAQs for messaging page
  for (let i = 0; i < newFaqs.length; i++) {
    await prisma.faq.create({
      data: {
        page: 'messaging',
        question: newFaqs[i].question,
        answer: newFaqs[i].answer,
        order: i,
        status: 'PUBLISHED',
        locale: 'en-US'
      }
    })
  }

  // 3. Upsert WebsiteContent for seo.messaging
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.messaging' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.messaging',
        page: 'messaging',
        label: 'Messaging SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }

  console.log('Successfully updated DB FAQs and SEO for messaging page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

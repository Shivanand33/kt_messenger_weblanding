import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const newFaqs = [
  {
    question: "What is KT Messenger and why should I use it?",
    answer: "KT Messenger is an all-in-one messaging app that lets you send messages, make voice and video calls, and stay connected with people anytime. The KT Messenger app is designed for users who want a simple, secure, and reliable instant messaging app for personal and professional communication."
  },
  {
    question: "Is KT Messenger free to use?",
    answer: "Yes, KT Messenger is a free messaging app that allows users to send messages and communicate online. As a free instant messaging app, it helps you stay connected without expensive SMS or traditional calling charges."
  },
  {
    question: "Can I have private chats on KT Messenger?",
    answer: "Yes, KT Messenger works as a private chat app where you can have personal conversations with your contacts. It is an easy-to-use app for private chat designed for secure and comfortable communication."
  },
  {
    question: "Is KT Messenger available for Android users?",
    answer: "KT Messenger is designed to provide Android users with a smooth communication experience. If you are searching for the best messaging app for Android 2026, KT Messenger offers messaging, calling, and privacy-focused features."
  },
  {
    question: "Is KT Messenger better than regular chat apps?",
    answer: "KT Messenger provides more than a basic chat app by combining messaging, calling, and secure communication features. It works as a complete mobile chat platform for everyday conversations."
  },
  {
    question: "Does KT Messenger have AI features?",
    answer: "KT Messenger includes smart communication features that improve the user experience. As an AI powered chat app, it helps users enjoy a smarter and more connected way of communicating."
  },
  {
    question: "Can I use KT Messenger internationally?",
    answer: "Yes, KT Messenger allows users to communicate globally through an online free messaging app experience. It works as an online messaging platform for connecting with people anywhere."
  }
]

const seoData = {
  title: "Best Video Calling App for Private Chats | KT Messenger.",
  description: "Looking for the best video calling app? KT Messenger offers private chats, secure voice calls, instant messaging, and smooth online communication."
}

async function main() {
  // 1. Delete existing published FAQs for calling page
  await prisma.faq.deleteMany({ where: { page: 'calling' } })

  // 2. Insert new FAQs for calling page
  for (let i = 0; i < newFaqs.length; i++) {
    await prisma.faq.create({
      data: {
        page: 'calling',
        question: newFaqs[i].question,
        answer: newFaqs[i].answer,
        order: i,
        status: 'PUBLISHED',
        locale: 'en-US'
      }
    })
  }

  // 3. Upsert WebsiteContent for seo.calling
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.calling' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.calling',
        page: 'calling',
        label: 'Calling SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }

  console.log('Successfully updated DB FAQs and SEO for calling page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

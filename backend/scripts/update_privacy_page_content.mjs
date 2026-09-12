import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "KT Messenger Privacy Policy | Secure Messaging App.",
  description: "Learn how KT Messenger protects your privacy with secure messaging, private chats, encryption, privacy controls, and safe communication features.",
  h1: "KT Messenger Privacy – Secure Messaging App",
  content: "KT Messenger is a secure messaging app designed to help users communicate, connect, and share information online. Learn how privacy, secure communication, and private chat features can support a safer messaging experience."
}

const faqs = [
  {
    question: "Is KT Messenger a secure messaging app?",
    answer: "KT Messenger provides privacy and security features designed to support secure online communication. Users can review the Privacy Policy to understand how information is handled."
  },
  {
    question: "Is KT Messenger a private chat app?",
    answer: "KT Messenger provides features for private communication and messaging. Users can review the privacy information to understand how their information and conversations are handled."
  },
  {
    question: "What makes a safe messaging app?",
    answer: "A safe messaging app should consider areas such as encryption, account protection, privacy controls, data handling, and transparency about how information is used."
  },
  {
    question: "What information does a messaging app collect?",
    answer: "The information collected can vary by platform and how its features are used. KT Messenger's Privacy Policy explains the types of information that may be collected and how it may be handled."
  },
  {
    question: "How can I protect my privacy when using a messaging app?",
    answer: "Use available privacy settings, protect your account credentials, review permissions, and understand the platform's Privacy Policy before sharing sensitive information."
  }
]

async function main() {
  // 1. Update SEO
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.privacy' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.privacy',
        page: 'privacy',
        label: 'Privacy SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }

  // 2. Update FAQs in DB
  try {
    await prisma.faq.deleteMany({ where: { page: 'privacy' } })
    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: {
          page: 'privacy',
          question: faqs[i].question,
          answer: faqs[i].answer,
          order: i + 1,
          status: 'PUBLISHED',
          locale: 'en-US'
        }
      })
    }
    console.log('Successfully updated DB FAQs for privacy page.')
  } catch (err) {
    console.log('Faq table update error:', err.message)
  }

  console.log('Successfully updated DB SEO for privacy page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "KT Messenger Notes | Secure Messaging & Social Platform.",
  description: "Explore KT Messenger Notes for secure messaging, social networking, and business communication, helping users and brands connect more easily.",
  h1: "Welcome to KT Messenger Notes.",
  content: "KT Messenger Notes helps you save the things that matter to you. Whether it is an important message, business idea, meeting detail, reminder, personal thought, useful information, or something you do not want to forget, you can keep it organized in one place."
}

const faqs = [
  {
    question: "What is KT Messenger Notes?",
    answer: "KT Messenger Notes is a simple feature that lets you save important information, ideas, reminders, tasks, lists, and personal thoughts in one place."
  },
  {
    question: "Why should I use KT Messenger Notes?",
    answer: "KT Messenger Notes helps you remember important things without relying only on your memory. You can quickly write something down and come back to it whenever you need it."
  },
  {
    question: "What can I save in KT Messenger Notes?",
    answer: "You can save ideas, reminders, tasks, shopping lists, meeting points, business information, customer details, personal thoughts, and anything else you want to remember."
  },
  {
    question: "Can I use KT Messenger Notes for business?",
    answer: "Yes. Businesses and professionals can use Notes to save customer requirements, meeting details, business ideas, tasks, follow-ups, and other important work information."
  },
  {
    question: "Can I use KT Messenger Notes for personal use?",
    answer: "Yes. You can use Notes for personal reminders, plans, shopping lists, events, ideas, daily tasks, and other information you want to keep organized."
  },
  {
    question: "How do KT Messenger Notes help me stay organized?",
    answer: "Notes give you one place to keep important information instead of keeping everything in your memory or scattered across different conversations and apps."
  },
  {
    question: "Can I save important information from chats?",
    answer: "Yes. If a conversation contains an important idea, task, reminder, or detail, you can save that information as a note so you can refer to it later."
  }
]

async function main() {
  // 1. Update SEO
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.notes' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.notes',
        page: 'notes',
        label: 'Notes SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }

  // 2. Update FAQs in DB
  try {
    await prisma.faq.deleteMany({ where: { page: 'notes' } })
    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: {
          page: 'notes',
          question: faqs[i].question,
          answer: faqs[i].answer,
          order: i + 1,
          status: 'PUBLISHED',
          locale: 'en-US'
        }
      })
    }
    console.log('Successfully updated DB FAQs for notes page.')
  } catch (err) {
    console.log('Faq table update error:', err.message)
  }

  console.log('Successfully updated DB SEO for notes page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

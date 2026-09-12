import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Syncing Community page FAQs to DB...')

  // Clear old FAQs for 'community'
  await prisma.faq.deleteMany({
    where: { page: 'community' }
  })

  const newFaqs = [
    {
      page: 'community',
      question: 'What is KT Messenger?',
      answer: 'KT Messenger is a social networking and instant messaging platform that enables users to communicate, create connections, participate in communities, and interact online.',
      order: 1,
      status: 'PUBLISHED',
      locale: 'en-US'
    },
    {
      page: 'community',
      question: 'Is KT Messenger a social networking platform?',
      answer: 'Yes. KT Messenger combines social networking and messaging features, allowing users to connect with people and participate in online communities.',
      order: 2,
      status: 'PUBLISHED',
      locale: 'en-US'
    },
    {
      page: 'community',
      question: 'Can KT Messenger be used for private chats?',
      answer: 'KT Messenger provides private messaging functionality for users who want to communicate directly with other people.',
      order: 3,
      status: 'PUBLISHED',
      locale: 'en-US'
    }
  ]

  for (const faq of newFaqs) {
    await prisma.faq.create({ data: faq })
  }

  console.log('Successfully inserted 3 Community FAQs into DB.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

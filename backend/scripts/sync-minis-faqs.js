import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const faqs = [
  {
    question: 'What are KT Messenger Minis?',
    answer: 'KT Messenger Minis are short videos that you can watch, create, and share with your online community.',
    page: 'minis',
    status: 'PUBLISHED',
    order: 1,
  },
  {
    question: 'Can I create and share Minis?',
    answer: 'Yes, you can create short videos and share them with your friends, followers, and network.',
    page: 'minis',
    status: 'PUBLISHED',
    order: 2,
  },
  {
    question: 'Can I like and comment on Minis?',
    answer: 'Yes, Minis allow users to interact with short-form content through likes, comments, and shares.',
    page: 'minis',
    status: 'PUBLISHED',
    order: 3,
  },
  {
    question: 'Can businesses use Minis?',
    answer: 'Yes, businesses can use short videos to promote products, connect with audiences, and increase engagement.',
    page: 'minis',
    status: 'PUBLISHED',
    order: 4,
  },
  {
    question: 'Are Minis a social media feature?',
    answer: 'Yes, Minis are a short-form video feature that helps users discover content and connect with others.',
    page: 'minis',
    status: 'PUBLISHED',
    order: 5,
  },
]

async function main() {
  console.log('Syncing Minis FAQs to database...')
  
  await prisma.faq.deleteMany({
    where: { page: 'minis' },
  })

  for (const f of faqs) {
    const created = await prisma.faq.create({
      data: f,
    })
    console.log(`Created FAQ [minis]: ${created.question}`)
  }

  console.log('Done syncing Minis FAQs!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const faqs = await prisma.faq.findMany({ where: { page: 'calling' } })
  const seo = await prisma.websiteContent.findFirst({ where: { key: 'seo.calling' } })
  console.log('Calling DB FAQs count:', faqs.length)
  console.log('Calling DB FAQs:', JSON.stringify(faqs, null, 2))
  console.log('Calling DB SEO:', JSON.stringify(seo, null, 2))
}
main().catch(console.error).finally(() => prisma.$disconnect())

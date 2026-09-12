import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "Group Chat App & Messaging Platform | KT Messenger.",
  description: "KT Messenger builds private group chat solutions that help teams, communities, friends, and family collaborate and discuss group chat topics."
}

async function main() {
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.groups' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.groups',
        page: 'groups',
        label: 'Groups SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }
  console.log('Successfully updated DB SEO for groups page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

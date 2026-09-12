import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const seoData = {
  title: "Broadcast Channels & Community Updates | KT Messenger.",
  description: "KT Messenger Channels help you share updates, announcements, and content with communities. Build connections through secure broadcast messaging and engagement.",
  h1: "Create Channels and Share Updates With Your Community",
  content: "Share updates, announcements, and content with your audience through KT Messenger Channels. Build communities, engage followers, and communicate easily with a secure messaging platform."
}

async function main() {
  const existingSeo = await prisma.websiteContent.findFirst({ where: { key: 'seo.channels' } })
  if (existingSeo) {
    await prisma.websiteContent.update({
      where: { id: existingSeo.id },
      data: { data: seoData }
    })
  } else {
    await prisma.websiteContent.create({
      data: {
        key: 'seo.channels',
        page: 'channels',
        label: 'Channels SEO',
        data: seoData,
        locale: 'en-US'
      }
    })
  }
  console.log('Successfully updated DB SEO for channels page.')
}

main().catch(console.error).finally(() => prisma.$disconnect())

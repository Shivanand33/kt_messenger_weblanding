import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { ALL_PERMISSIONS, ROLE_PRESETS } from '../src/config/permissions.js'
import { env } from '../src/config/env.js'

const prisma = new PrismaClient()

async function main() {
  console.log('› Seeding permissions...')
  for (const p of ALL_PERMISSIONS) {
    await prisma.permission.upsert({ where: { key: p.key }, update: { description: p.description }, create: p })
  }

  console.log('› Seeding roles...')
  for (const [name, preset] of Object.entries(ROLE_PRESETS)) {
    const connect = preset.permissions.map((key) => ({ key }))
    await prisma.role.upsert({
      where: { name },
      update: { description: preset.description, isSystem: preset.isSystem, permissions: { set: connect } },
      create: { name, description: preset.description, isSystem: preset.isSystem, permissions: { connect } },
    })
  }

  console.log('› Seeding super admin...')
  const superRole = await prisma.role.findUnique({ where: { name: 'super_admin' } })
  const passwordHash = await bcrypt.hash(env.seedAdmin.password, 12)
  await prisma.admin.upsert({
    where: { email: env.seedAdmin.email },
    update: { roleId: superRole.id, status: 'ACTIVE' },
    create: { email: env.seedAdmin.email, name: env.seedAdmin.name, passwordHash, roleId: superRole.id, status: 'ACTIVE' },
  })

  console.log('› Seeding locales...')
  await prisma.locale.upsert({ where: { code: 'en-US' }, update: {}, create: { code: 'en-US', label: 'English (US)', enabled: true, isDefault: true } })

  console.log('› Seeding blog...')
  const cats = {}
  for (const c of [
    { name: 'Product', slug: 'product' },
    { name: 'Privacy', slug: 'privacy' },
    { name: 'Guides', slug: 'guides' },
  ]) cats[c.slug] = await prisma.blogCategory.upsert({ where: { slug: c.slug }, update: {}, create: c })

  const tags = {}
  for (const t of [
    { name: 'Updates', slug: 'updates' },
    { name: 'Security', slug: 'security' },
    { name: 'Business', slug: 'business' },
    { name: 'Tips', slug: 'tips' },
  ]) tags[t.slug] = await prisma.blogTag.upsert({ where: { slug: t.slug }, update: {}, create: t })

  const posts = [
    { slug: 'group-chats-upgraded', title: 'Group chats, upgraded: smarter polls, @all, and side chats', excerpt: 'Planning a birthday, a trip, or dinner with friends just got easier.', featured: true, category: 'product', tags: ['updates'] },
    { slug: 'feature-roundup-tablet-car', title: 'Feature roundup: tablet sign-in, KT in your car, and more', excerpt: 'Everything new this month, from tablet sign-in to hands-free chats on the road.', category: 'product', tags: ['updates', 'tips'] },
    { slug: 'reserve-your-username', title: 'Reserve your username and keep your number private', excerpt: 'Connect on KT while keeping your phone number to yourself.', category: 'privacy', tags: ['security'] },
    { slug: 'calls-big-screen', title: 'Calls on the big screen, reimagined', excerpt: 'A cleaner, faster calling experience for desktop.', category: 'product', tags: ['updates'] },
    { slug: 'how-encryption-works', title: 'How end-to-end encryption keeps every chat private', excerpt: 'A plain-English look at what end-to-end encryption really means.', category: 'privacy', tags: ['security'] },
    { slug: 'building-communities', title: 'Building communities that actually feel welcoming', excerpt: 'Tips and tools for growing a group into a thriving community.', category: 'guides', tags: ['business', 'tips'] },
  ]
  for (const p of posts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug, title: p.title, excerpt: p.excerpt,
        body: `<p>${p.excerpt}</p><p>This article is managed from the KT Messenger admin panel. Replace this body with the full post content.</p>`,
        status: 'PUBLISHED', featured: !!p.featured, publishedAt: new Date(),
        authorName: 'KT Messenger Team',
        categoryId: cats[p.category].id,
        tags: { connect: p.tags.map((t) => ({ id: tags[t].id })) },
      },
    })
  }

  console.log('› Seeding help center...')
  const helpTree = [
    {
      slug: 'get-started', title: 'Get Started', icon: 'flag',
      subs: [
        { slug: 'download-installation', title: 'Download and Installation', articles: ['How to download or uninstall KT Messenger', 'About supported operating systems', 'About supported devices'] },
        { slug: 'registration', title: 'Registration', articles: ['How to register your phone number', 'About registration and two-step verification'] },
        { slug: 'linked-devices', title: 'Linked Devices', articles: ['About linked devices', 'How to link a device'] },
      ],
    },
    {
      slug: 'chats', title: 'Chats', icon: 'chat',
      subs: [
        { slug: 'sending-messages', title: 'Sending Messages', articles: ['How to send a message', 'Formatting your messages', 'Message reactions'] },
        { slug: 'chat-backup', title: 'Chat Backup', articles: ['How to back up your chats', 'How to restore a backup'] },
      ],
    },
    {
      slug: 'calls', title: 'Voice and Video Calls', icon: 'call',
      subs: [
        { slug: 'making-a-call', title: 'Making a Call', articles: ['How to make a voice call', 'How to make a video call'] },
        { slug: 'group-calls', title: 'Group Calls', articles: ['Starting a group call', 'Adding people to a call'] },
      ],
    },
    {
      slug: 'privacy', title: 'Privacy, Safety, and Security', icon: 'lock',
      subs: [
        { slug: 'privacy-settings', title: 'Privacy Settings', articles: ['Managing your privacy', 'Two-step verification'] },
        { slug: 'blocking', title: 'Blocking Contacts', articles: ['How to block a contact', 'How to unblock a contact'] },
      ],
    },
  ]
  let catOrder = 0
  for (const cat of helpTree) {
    const category = await prisma.helpCategory.upsert({ where: { slug: cat.slug }, update: { title: cat.title, icon: cat.icon, order: catOrder }, create: { slug: cat.slug, title: cat.title, icon: cat.icon, order: catOrder } })
    catOrder++
    let subOrder = 0
    for (const sub of cat.subs) {
      const subcategory = await prisma.helpSubcategory.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: sub.slug } },
        update: { title: sub.title, order: subOrder },
        create: { categoryId: category.id, slug: sub.slug, title: sub.title, order: subOrder },
      })
      subOrder++
      let artOrder = 0
      for (const title of sub.articles) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)
        await prisma.helpArticle.upsert({
          where: { slug },
          update: {},
          create: {
            subcategoryId: subcategory.id, slug, title,
            body: `<p>This article explains <strong>${title.toLowerCase()}</strong> on KT Messenger. Manage the full content from the admin panel.</p>`,
            platforms: ['Android', 'iOS', 'Mac', 'Windows'], popular: artOrder === 0, status: 'PUBLISHED', order: artOrder++,
          },
        })
      }
    }
  }

  console.log('› Seeding FAQs...')
  const faqs = [
    { page: 'calling', question: 'Are video and voice calls on KT free?', answer: 'Yes — all one-on-one and group calls are free with no time limits.' },
    { page: 'calling', question: 'Are my calls encrypted?', answer: 'Every call is protected by end-to-end encryption by default.' },
    { page: 'calling', question: 'How many people can join a group call?', answer: 'Up to 32 participants in a single call with unlimited duration.' },
    { page: 'messaging', question: 'Are personal messages encrypted by default?', answer: 'Yes — every chat is end-to-end encrypted by default.' },
    { page: 'messaging', question: 'What is the maximum file size I can send?', answer: 'You can send files up to 2 GB per attachment.' },
    { page: 'messaging', question: 'Can I edit a message after sending it?', answer: 'Yes, sent messages can be edited within 15 minutes.' },
  ]
  let faqOrder = 0
  for (const f of faqs) {
    const existing = await prisma.faq.findFirst({ where: { page: f.page, question: f.question } })
    if (!existing) await prisma.faq.create({ data: { ...f, order: faqOrder++, status: 'PUBLISHED' } })
  }

  console.log('› Seeding success stories...')
  const stories = [
    { slug: 'greenleaf-grocers', company: 'GreenLeaf Grocers', summary: 'Turning catalog browsing into checkout with rich messaging on KT.', metrics: { orders: '+21%' } },
    { slug: 'meridian-travel', company: 'Meridian Travel', summary: 'Handling booking questions instantly with an automated assistant.', metrics: { responseTime: '-70%' } },
  ]
  let storyOrder = 0
  for (const s of stories) {
    await prisma.successStory.upsert({ where: { slug: s.slug }, update: {}, create: { ...s, status: 'PUBLISHED', order: storyOrder++ } })
  }

  console.log('› Seeding app releases...')
  const releases = [
    { platform: 'IOS', version: '2.26.1', minOs: 'iOS 12.0 or newer', storeUrl: 'https://apps.apple.com/', isCurrent: true },
    { platform: 'ANDROID', version: '2.26.1', minOs: 'Android 5.0 or newer', storeUrl: 'https://play.google.com/', isCurrent: true },
    { platform: 'MAC', version: '2.26.1', minOs: 'macOS 11 or newer', storeUrl: 'https://apps.apple.com/', isCurrent: true },
    { platform: 'WINDOWS', version: '2.26.1', minOs: 'Windows 10 or newer', storeUrl: 'https://apps.microsoft.com/', isCurrent: true },
  ]
  for (const rel of releases) {
    await prisma.appRelease.upsert({ where: { platform_version: { platform: rel.platform, version: rel.version } }, update: { ...rel }, create: { ...rel, releaseDate: new Date() } })
  }

  console.log('› Seeding website content blocks...')
  const blocks = [
    { key: 'home.hero', page: 'home', label: 'Home hero', data: { eyebrow: 'Private messaging & calling', title: 'Stay close, stay private.', subtitle: 'Simple, secure messaging and calling for everyone — free, encrypted, and in sync across all your devices.', primaryCta: 'Download', note: '*Standard data rates may apply.' } },
    { key: 'calling.hero', page: 'calling', label: 'Calling hero', data: { title: 'Everyone is a call away', subtitle: 'KT voice and video calls are free, have no time limits, and are end-to-end encrypted.' } },
    { key: 'messaging.hero', page: 'messaging', label: 'Messaging hero', data: { title: 'Connect your way', subtitle: 'On KT, every conversation can be expressive, playful, and entirely yours.' } },
    { key: 'business.hero', page: 'business', label: 'Business hero', data: { title: 'Turn conversations into customers', subtitle: 'Reach and engage more than 2 billion people with AI-powered messaging built for business.' } },
  ]
  for (const b of blocks) {
    await prisma.websiteContent.upsert({ where: { key_locale: { key: b.key, locale: 'en-US' } }, update: { data: b.data, page: b.page, label: b.label }, create: { ...b, locale: 'en-US' } })
  }

  console.log('› Seeding navigation & footer...')
  const navItems = [
    { label: 'Features', href: '#features', location: 'header', order: 0 },
    { label: 'Privacy', href: '/privacy', location: 'header', order: 1 },
    { label: 'Blog', href: '/blog', location: 'header', order: 2 },
    { label: 'Apps', href: '/apps', location: 'header', order: 3 },
    { label: 'Help Center', href: '/help', location: 'header', order: 4 },
    { label: 'For Business', href: '/business', location: 'header', order: 5 },
  ]
  for (const item of navItems) {
    const existing = await prisma.navigationItem.findFirst({ where: { label: item.label, location: item.location } })
    if (!existing) await prisma.navigationItem.create({ data: item })
  }

  const footer = [
    { title: 'Product', links: ['Features', 'Calls', 'Groups', 'Privacy', 'Business'] },
    { title: 'Company', links: ['About', 'Careers', 'Brand Center', 'Blog'] },
    { title: 'Get KT Messenger', links: ['Android', 'iPhone', 'Mac & PC', 'KT Web'] },
    { title: 'Support', links: ['Help Center', 'Contact Us', 'Community', 'Status'] },
  ]
  let secOrder = 0
  for (const sec of footer) {
    const existing = await prisma.footerSection.findFirst({ where: { title: sec.title } })
    if (!existing) {
      const section = await prisma.footerSection.create({ data: { title: sec.title, order: secOrder++ } })
      await prisma.footerLink.createMany({ data: sec.links.map((label, i) => ({ sectionId: section.id, label, href: '#', order: i })) })
    }
  }

  console.log('✅ Seed complete.')
  console.log(`   Admin login: ${env.seedAdmin.email} / ${env.seedAdmin.password}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

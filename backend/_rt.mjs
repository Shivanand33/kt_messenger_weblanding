import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
const p = new PrismaClient()
const a = await p.admin.findFirst({ where: { status: 'ACTIVE' } })
const TOKEN = jwt.sign({ sub: a.id }, process.env.JWT_SECRET, { expiresIn: '5m' })
const H = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
const BASE = 'http://localhost:4000/api'

// 1. read the block exactly as admin does
const list = await fetch(`${BASE}/admin/website-content`, { headers: H }).then(r => r.json())
const rows = list.data?.items || list.data
const block = rows.find(r => r.key === 'text.home')
console.log('1. admin GET  -> key:', block.key, '| data type:', typeof block.data, '| keys:', Object.keys(block.data).length)

// 2. simulate the admin form save: edit one value, PUT the whole row back
const edited = { ...block.data, 'Stay close,': 'ADMIN UI ROUNDTRIP 5521' }
const put = await fetch(`${BASE}/admin/website-content/${block.id}`, {
  method: 'PUT', headers: H,
  body: JSON.stringify({ key: block.key, page: block.page, label: block.label, data: edited }),
})
console.log('2. admin PUT  -> status:', put.status)

// 3. read back from DB
const after = await p.websiteContent.findFirst({ where: { key: 'text.home', locale: 'en-US' } })
console.log('3. DB value   ->', JSON.stringify(after.data['Stay close,']))
console.log('   keys kept  ->', Object.keys(after.data).length)

// 4. read the PUBLIC endpoint the website uses
const pub = await fetch(`${BASE}/page-content/text`).then(r => r.json())
console.log('4. public API ->', JSON.stringify(pub.data['text.home']?.['Stay close,']))
await p.$disconnect()

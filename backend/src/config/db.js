import { PrismaClient } from '@prisma/client'
import { env } from './env.js'

// Single shared Prisma client (avoids exhausting connections on watch/reload).
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.__ktPrisma ||
  new PrismaClient({
    log: env.isProd ? ['error'] : ['error', 'warn'],
  })

if (!env.isProd) globalForPrisma.__ktPrisma = prisma

export async function checkDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

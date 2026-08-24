import dotenv from 'dotenv'

dotenv.config()

const required = ['DATABASE_URL', 'JWT_SECRET']
const missing = required.filter((k) => !process.env[k])
if (missing.length && process.env.NODE_ENV === 'production') {
  // Fail fast in production only; dev falls back to sane defaults below.
  throw new Error(`Missing required env vars: ${missing.join(', ')}`)
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 4000),

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5174,http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5174',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',

  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    localDir: process.env.STORAGE_LOCAL_DIR || 'uploads',
    publicUrl: process.env.MEDIA_PUBLIC_URL || 'http://localhost:4000/uploads',
    maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  },

  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL || 'admin@ktmessenger.local',
    password: process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!',
    name: process.env.SEED_ADMIN_NAME || 'Super Admin',
  },

  email: {
    provider: process.env.EMAIL_PROVIDER || 'log',
    from: process.env.EMAIL_FROM || 'KT Messenger <no-reply@ktmessenger.local>',
  },
}

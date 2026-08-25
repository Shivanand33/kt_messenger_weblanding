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
    // Cloudflare R2 (S3-compatible). Used when STORAGE_PROVIDER="r2".
    r2: {
      accountId: process.env.R2_ACCOUNT_ID || '',
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      // Accept either R2_BUCKET or R2_BUCKET_NAME.
      bucket: process.env.R2_BUCKET || process.env.R2_BUCKET_NAME || '',
      // Defaults to the standard account endpoint when R2_ENDPOINT is unset.
      endpoint:
        process.env.R2_ENDPOINT ||
        (process.env.R2_ACCOUNT_ID
          ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
          : ''),
      // Public base URL for served objects. Accept R2_PUBLIC_URL or R2_PUBLIC_DOMAIN
      // (the r2.dev URL or a custom domain).
      publicUrl: (process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_DOMAIN || '').replace(/\/+$/, ''),
    },
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

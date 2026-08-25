import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'

// Storage abstraction so the provider can be swapped without touching
// controllers. Supported: "local" (disk) and "r2" (Cloudflare R2, S3-compatible).
const localDir = path.resolve(process.cwd(), env.storage.localDir)

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export function safeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase().replace(/[^.a-z0-9]/g, '')
  const base = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
  return `${base || 'file'}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`
}

// ── Cloudflare R2 (S3-compatible) ─────────────────────────
// The client is created lazily so a missing/invalid R2 config only fails when
// an upload is actually attempted, never at server startup.
let r2Client = null
function getR2Client() {
  if (r2Client) return r2Client
  const { endpoint, accessKeyId, secretAccessKey } = env.storage.r2
  const missing = []
  if (!endpoint) missing.push('R2_ENDPOINT (or R2_ACCOUNT_ID)')
  if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID')
  if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY')
  if (missing.length) {
    throw new Error(`R2 storage selected but missing: ${missing.join(', ')}`)
  }
  r2Client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })
  return r2Client
}

export const storage = {
  provider: env.storage.provider,

  // Persist a buffer and return a public URL + storage key.
  async save({ buffer, filename, folder = 'general', contentType }) {
    const key = `${folder}/${filename}`

    if (env.storage.provider === 'r2') {
      const { bucket, publicUrl } = env.storage.r2
      if (!bucket) throw new Error('R2 storage selected but R2_BUCKET is not set')
      if (!publicUrl) throw new Error('R2 storage selected but R2_PUBLIC_URL is not set')
      await getR2Client().send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType || 'application/octet-stream',
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      )
      return { key, url: `${publicUrl}/${key}` }
    }

    // Default: local disk.
    const dir = path.join(localDir, folder)
    ensureDir(dir)
    fs.writeFileSync(path.join(localDir, key), buffer)
    return { key, url: `${env.storage.publicUrl}/${folder}/${filename}` }
  },

  async remove(key) {
    if (env.storage.provider === 'r2') {
      const { bucket } = env.storage.r2
      if (!bucket) return
      try {
        await getR2Client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
      } catch {
        /* best-effort */
      }
      return
    }
    const full = path.join(localDir, key)
    if (fs.existsSync(full)) fs.unlinkSync(full)
  },

  localRoot() {
    ensureDir(localDir)
    return localDir
  },
}

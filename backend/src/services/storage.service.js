import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { env } from '../config/env.js'

// Storage abstraction so the provider (local disk today) can be swapped for
// S3 / R2 later without touching controllers. Only `local` is implemented now.
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

export const storage = {
  provider: env.storage.provider,

  // Persist a buffer and return a public URL + storage key.
  async save({ buffer, filename, folder = 'general' }) {
    if (env.storage.provider !== 'local') {
      throw new Error(`Storage provider "${env.storage.provider}" not implemented`)
    }
    const dir = path.join(localDir, folder)
    ensureDir(dir)
    const key = path.join(folder, filename)
    fs.writeFileSync(path.join(localDir, key), buffer)
    return { key, url: `${env.storage.publicUrl}/${folder}/${filename}` }
  },

  async remove(key) {
    if (env.storage.provider !== 'local') return
    const full = path.join(localDir, key)
    if (fs.existsSync(full)) fs.unlinkSync(full)
  },

  localRoot() {
    ensureDir(localDir)
    return localDir
  },
}

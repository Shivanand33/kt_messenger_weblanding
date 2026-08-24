import multer from 'multer'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiResponse.js'

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
])

// Keep files in memory; the storage service decides where they land.
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.storage.maxUploadMb * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new ApiError(415, `Unsupported file type: ${file.mimetype}`, 'UNSUPPORTED_MEDIA_TYPE'))
    }
    cb(null, true)
  },
}).single('file')

// Wrap multer so its errors become consistent ApiErrors.
export function handleUpload(req, res, next) {
  uploadImage(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(413, `File exceeds ${env.storage.maxUploadMb}MB limit`, 'PAYLOAD_TOO_LARGE'))
      }
      return next(err instanceof ApiError ? err : new ApiError(400, err.message, 'UPLOAD_ERROR'))
    }
    next()
  })
}

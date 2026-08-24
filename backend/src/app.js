import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { storage } from './services/storage.service.js'

export function createApp() {
  const app = express()
  app.set('trust proxy', 1)

  // Security headers; allow media to be embedded cross-origin by the website.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

  // Restrict CORS to the known website + admin origins.
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true)
        // In development, accept any localhost / 127.0.0.1 origin so the site
        // works no matter which port Vite picks (5173, 5174, 5175, …).
        if (!env.isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return cb(null, true)
        return cb(new Error(`Origin ${origin} not allowed by CORS`))
      },
      credentials: true,
    }),
  )

  app.use(compression())
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true, limit: '2mb' }))
  app.use(cookieParser())
  if (!env.isProd) app.use(morgan('dev'))

  // Serve locally-stored uploaded media.
  if (env.storage.provider === 'local') {
    app.use('/uploads', express.static(storage.localRoot()))
  }

  app.get('/', (_req, res) => res.json({ name: 'KT Messenger Website API', health: '/api/health' }))
  app.use('/api', apiLimiter, routes)

  app.use(notFound)
  app.use(errorHandler)
  return app
}

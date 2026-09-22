import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import routes from './routes/index.js'
import sitemapRoutes from './routes/sitemap.routes.js'
import llmsRoutes from './routes/llms.routes.js'
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

  // Serve uploaded media (local disk or R2 stream).
  app.use('/uploads', async (req, res, next) => {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const localPath = path.join(storage.localRoot(), req.path)
    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
      return express.static(storage.localRoot())(req, res, next)
    }

    if (env.storage.provider === 'r2') {
      try {
        const key = req.path.replace(/^\/+/, '')
        const r2Obj = await storage.getObjectStream(key)
        if (r2Obj && r2Obj.stream) {
          if (r2Obj.contentType) res.setHeader('Content-Type', r2Obj.contentType)
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          if (typeof r2Obj.stream.pipe === 'function') {
            return r2Obj.stream.pipe(res)
          } else {
            const { Readable } = await import('node:stream')
            return Readable.fromWeb(r2Obj.stream).pipe(res)
          }
        }
      } catch {
        /* fallback */
      }
    }
    return express.static(storage.localRoot())(req, res, next)
  })

  // XML sitemap and llms.txt of the public website, at the root and under /api
  // so the website host can proxy either path. Mounted before the API rate
  // limiter; responses are cached, so crawlers never reach the database directly.
  app.use(sitemapRoutes)
  app.use('/api', sitemapRoutes)
  app.use(llmsRoutes)
  app.use('/api', llmsRoutes)

  app.get('/', (_req, res) => res.json({ name: 'KT Messenger Website API', health: '/api/health' }))
  app.use('/api', apiLimiter, routes)

  app.use(notFound)
  app.use(errorHandler)
  return app
}

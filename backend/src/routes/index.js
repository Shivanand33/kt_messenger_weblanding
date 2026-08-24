import { Router } from 'express'
import publicRoutes from './public.routes.js'
import adminRoutes from './admin.routes.js'
import { checkDbConnection } from '../config/db.js'

const r = Router()

// GET /api/health — used by uptime checks & deploy readiness probes.
r.get('/health', async (_req, res) => {
  const db = await checkDbConnection()
  return res.status(db ? 200 : 503).json({
    success: db,
    status: db ? 'ok' : 'degraded',
    db: db ? 'up' : 'down',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

r.use('/admin', adminRoutes)
r.use('/', publicRoutes)

export default r

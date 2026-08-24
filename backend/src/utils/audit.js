import { prisma } from '../config/db.js'

// Best-effort audit trail for sensitive admin actions. Never throws.
export async function writeAudit({ req, action, entity, entityId, meta }) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: req?.admin?.id || null,
        action,
        entity: entity || null,
        entityId: entityId ? String(entityId) : null,
        meta: meta || undefined,
        ip: req ? clientIp(req) : null,
      },
    })
  } catch {
    // swallow — auditing must never break the request
  }
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim()
  return req.ip || req.socket?.remoteAddress || null
}

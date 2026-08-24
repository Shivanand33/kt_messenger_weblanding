import { ApiError } from '../utils/apiResponse.js'

// Enforce a permission key (e.g. "blog:write"). Super admins bypass all checks.
// Backend authorization is the source of truth — the admin UI only hides things.
export function requirePermission(...keys) {
  return (req, _res, next) => {
    if (!req.admin) return next(ApiError.unauthorized())
    if (req.admin.isSuperAdmin) return next()
    const has = keys.every((k) => req.admin.permissions.includes(k))
    if (!has) return next(ApiError.forbidden(`Missing permission: ${keys.join(', ')}`))
    next()
  }
}

// Require any one of the given permissions.
export function requireAnyPermission(...keys) {
  return (req, _res, next) => {
    if (!req.admin) return next(ApiError.unauthorized())
    if (req.admin.isSuperAdmin) return next()
    const has = keys.some((k) => req.admin.permissions.includes(k))
    if (!has) return next(ApiError.forbidden())
    next()
  }
}

export function requireSuperAdmin(req, _res, next) {
  if (!req.admin) return next(ApiError.unauthorized())
  if (!req.admin.isSuperAdmin) return next(ApiError.forbidden('Super admin only'))
  next()
}

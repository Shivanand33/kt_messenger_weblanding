import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { ApiError, fail } from '../utils/apiResponse.js'
import { env } from '../config/env.js'

export function notFound(req, res) {
  return fail(res, { status: 404, message: `Route not found: ${req.method} ${req.originalUrl}`, error: 'NOT_FOUND' })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Known, intentional API errors
  if (err instanceof ApiError) {
    return fail(res, { status: err.status, message: err.message, error: err.code, details: err.details })
  }

  // Validation errors (Zod)
  if (err instanceof ZodError) {
    return fail(res, {
      status: 422,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    })
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target
      return fail(res, { status: 409, message: `A record with this ${field || 'value'} already exists`, error: 'CONFLICT' })
    }
    if (err.code === 'P2025') {
      return fail(res, { status: 404, message: 'Record not found', error: 'NOT_FOUND' })
    }
    if (err.code === 'P2003') {
      return fail(res, { status: 409, message: 'Related record constraint failed', error: 'FK_CONSTRAINT' })
    }
  }

  if (err?.type === 'entity.too.large') {
    return fail(res, { status: 413, message: 'Request payload too large', error: 'PAYLOAD_TOO_LARGE' })
  }

  // Unknown / unexpected — never leak internals in production
  if (!env.isProd) {
    // eslint-disable-next-line no-console
    console.error('[unhandled error]', err)
  }
  return fail(res, {
    status: 500,
    message: env.isProd ? 'Something went wrong' : err.message || 'Internal server error',
    error: 'INTERNAL_ERROR',
  })
}

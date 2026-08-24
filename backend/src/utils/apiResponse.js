// Consistent API envelope used by every endpoint.
export function ok(res, data = null, meta = undefined, status = 200) {
  const body = { success: true, data }
  if (meta) body.meta = meta
  return res.status(status).json(body)
}

export function created(res, data) {
  return ok(res, data, undefined, 201)
}

export function fail(res, { status = 400, message = 'Request failed', error = 'ERROR', details = undefined }) {
  const body = { success: false, message, error }
  if (details) body.details = details
  return res.status(status).json(body)
}

// A throwable error carrying an HTTP status + machine code.
export class ApiError extends Error {
  constructor(status, message, code = 'ERROR', details = undefined) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND')
  }
  static badRequest(message = 'Invalid request', details) {
    return new ApiError(400, message, 'BAD_REQUEST', details)
  }
  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, message, 'UNAUTHORIZED')
  }
  static forbidden(message = 'You do not have permission to do that') {
    return new ApiError(403, message, 'FORBIDDEN')
  }
  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message, 'CONFLICT')
  }
}

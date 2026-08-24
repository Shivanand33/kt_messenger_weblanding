import rateLimit from 'express-rate-limit'

const json = (res, message) =>
  res.status(429).json({ success: false, message, error: 'RATE_LIMITED' })

// Generous default for read APIs
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => json(res, 'Too many requests, please slow down'),
})

// Strict limiter for public write endpoints (forms/feedback) — spam protection
export const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => json(res, 'Too many submissions, please try again later'),
})

// Brute-force protection for admin login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => json(res, 'Too many login attempts, please try again in a few minutes'),
})

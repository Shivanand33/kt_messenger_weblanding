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

/*
 * The second step of a 2FA sign-in, limited per account rather than per IP.
 *
 * loginLimiter counts by address, which an attacker rotates for free. The
 * account is what is actually under attack here — a six-digit code is a
 * million guesses — so the budget belongs to the account. The stored code is
 * also destroyed after five wrong tries (see services/twofactor.service.js);
 * this is the outer wall that stops someone replaying new challenges to reset
 * that counter over and over.
 *
 * Requests arriving without a readable challenge token fall back to the
 * address, so they cannot escape a limit entirely by omitting it.
 */
const ipKey = (req) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  // Group an IPv6 caller by its /64, the block a single subscriber is given,
  // so rotating the host part is not a way around the limit.
  return ip.includes(':') ? `ip:${ip.split(':').slice(0, 4).join(':')}` : `ip:${ip}`
}

export const mfaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  // Set by the route's challenge guard, which has already verified the token.
  keyGenerator: (req) => (req.mfaAdminId ? `admin:${req.mfaAdminId}` : ipKey(req)),
  handler: (_req, res) => json(res, 'Too many attempts. Please sign in again in a few minutes.'),
})

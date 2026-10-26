import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

/**
 * Tokens carry a `purpose` so one kind can never be spent as another.
 *
 * The half-finished sign-in of an admin with 2FA on holds a real signed token
 * — without a purpose it would open every admin endpoint before the second
 * factor was ever checked, and the whole feature would be decoration. See
 * requireAuth in ../middleware/auth.js, which accepts SESSION only.
 */
export const TOKEN_PURPOSE = {
  SESSION: 'session',
  MFA: 'mfa',
}

export function signToken(payload, { expiresIn = env.jwtExpiresIn } = {}) {
  return jwt.sign({ purpose: TOKEN_PURPOSE.SESSION, ...payload }, env.jwtSecret, { expiresIn })
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

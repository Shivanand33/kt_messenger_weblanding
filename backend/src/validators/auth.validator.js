import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, 'Password is required'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

/* ── Two-factor authentication ────────────────────────────────────────── */

// Spaces and dashes are stripped before the length check: people paste codes
// out of an email the way the email printed them.
const sixDigits = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^\d{6}$/, 'Enter the 6-digit code from your email'))

const challengeToken = z.string().trim().min(1, 'Sign in again to continue')

export const twoFactorVerifySchema = z.object({
  challengeToken,
  code: sixDigits,
})

export const twoFactorResendSchema = z.object({ challengeToken })

export const twoFactorRecoverySchema = z.object({
  challengeToken,
  recoveryCode: z.string().trim().min(1, 'Enter one of your recovery codes'),
})

export const twoFactorTestSchema = z.object({
  // Omitted means "use the account's own email".
  email: z.string().trim().toLowerCase().email().optional(),
})

export const twoFactorEnableSchema = z.object({
  code: sixDigits,
  email: z.string().trim().toLowerCase().email().optional(),
})

export const twoFactorDisableSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  code: sixDigits,
})

import { z } from 'zod'

export const adminCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.string().min(1),
  status: z.enum(['ACTIVE', 'DISABLED']).optional(),
})

export const adminUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  password: z.string().min(8).optional(),
  roleId: z.string().min(1).optional(),
  status: z.enum(['ACTIVE', 'DISABLED']).optional(),
})

export const roleCreateSchema = z.object({
  name: z.string().trim().min(1).max(60),
  description: z.string().trim().max(300).optional(),
  permissionKeys: z.array(z.string()).default([]),
})

export const roleUpdateSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  description: z.string().trim().max(300).optional(),
  permissionKeys: z.array(z.string()).optional(),
})

import z from 'zod'

export const PasswordZ = z.string().min(8).max(64)

import z from 'zod'

export const PasswordZ = z.string().min(8).max(64)

export const CrecenciaisZ = z.object({
  usuario: z.string().nonempty({ error: 'Digite um usuário válido.' }),
  senha: z
    .string()
    .min(8, { error: 'A senha é inválida.' })
    .max(64, { error: 'A senha é nválida.' }),
})

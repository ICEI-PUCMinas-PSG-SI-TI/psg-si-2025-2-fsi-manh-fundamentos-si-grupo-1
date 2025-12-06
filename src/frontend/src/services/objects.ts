import * as z4 from 'zod/v4'

export const PasswordZ = z4.string().min(8).max(64)

export const CrecenciaisZ = z4.object({
  usuario: z4.string().nonempty({ error: 'Digite um usuário válido.' }),
  senha: z4
    .string()
    .min(8, { error: 'A senha é inválida.' })
    .max(64, { error: 'A senha é nválida.' }),
})

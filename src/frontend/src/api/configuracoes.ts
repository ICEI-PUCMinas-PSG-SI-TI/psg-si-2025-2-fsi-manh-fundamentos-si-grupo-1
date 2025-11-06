import z from 'zod'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/api/v1/configuracoes`

// TODO: Criar biblioteca compartilhada e re-utilizar tipos
const ConfiguracoesEnvioZ = z.object({
  nomeCliente: z.string().nullish(),
  cpfCnpj: z.string().nullish(),
  endereco: z.string().nullish(),
})

export type ConfiguracoesEnvioSchema = z.infer<typeof ConfiguracoesEnvioZ>

export type ConfiguracoesReceber = {
  id?: string
  nomeCliente: string | null
  cpfCnpj: string | null
  endereco: string | null
  createdAt?: Date
  updatedAt?: Date
}

export class ApiConfiguracoes {
  obterTodos() {
    return fetchW<ConfiguracoesReceber>(endpoint_path)
  }

  // TODO: Como retornar status? 400, 500, ...
  atualizar(opts: ConfiguracoesEnvioSchema) {
    const bodyContent = ConfiguracoesEnvioZ.parse(opts)
    return fetchW(endpoint_path, {
      method: HttpMethods.Patch,
      body: bodyContent,
    })
  }
}

import z from 'zod'

// TODO: Alterar 'localhost' para ENV
const backend_uri = 'http://localhost:5173'
const backend_path = `${backend_uri}/api/v1/configuracoes`

// TODO: Criar biblioteca compartilhada e re-utilizar tipos
const ConfiguracoesEnvioZ = z.object({
  nomeCliente: z.string().nullish(),
  cpfCnpj: z.string().nullish(),
  endereco: z.string().nullish(),
})

export type ConfiguracoesEnvioSchema = z.infer<typeof ConfiguracoesEnvioZ>

type ConfiguracoesReceber = {
  id: string
  nomeCliente: string | null
  cpfCnpj: string | null
  endereco: string | null
  createdAt: Date
  updatedAt: Date
}

interface RespostaApi extends Response {
  data?: ConfiguracoesReceber | null
}

export class ApiConfiguracoes {
  obterTodos(): Promise<RespostaApi> {
    return fetch(backend_path, {
      method: 'GET',
    })
  }

  // TODO: Como retornar status? 400, 500, ...
  atualizar(opts: ConfiguracoesEnvioSchema) {
    const obj = ConfiguracoesEnvioZ.parse(opts)
    return fetch(backend_path, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
  }
}

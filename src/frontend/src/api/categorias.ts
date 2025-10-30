import z from 'zod'

// TODO: Alterar 'localhost' para ENV
const backend_uri = 'http://localhost:5173'
const backend_path = `${backend_uri}/api/v1/categorias`

const ParamIdSchemaZ = z.uuid()

const NomeEnvioZ = z.string().nonempty()

export type Categorias = {
  id: string
  nome: string
}

type ConfiguracoesReceber = {
  id: string
  createdAt: Date
  nome: string
}

interface RespostaApi extends Response {
  data?: ConfiguracoesReceber[] | null
}

export class ApiCategorias {
  obterTodos(): Promise<RespostaApi> {
    return fetch(backend_path, {
      method: 'GET',
    })
  }

  criar(nome: string) {
    const _nome = NomeEnvioZ.parse(nome)
    return fetch(backend_path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: _nome,
      }),
    })
  }

  excluir(id: string) {
    const uuid = ParamIdSchemaZ.parse(id)
    return fetch(`${backend_path}/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

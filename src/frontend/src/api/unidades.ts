import z from 'zod'

// TODO: Alterar 'localhost' para ENV
const backend_uri = 'http://localhost:5173'
const backend_path = `${backend_uri}/api/v1/unidades`

const ParamIdSchemaZ = z.uuid()

const UnidadeMedidaEnvioZ = z.object({
  nome: z.string().nonempty(),
  abreviacao: z.string().nonempty(),
})

export type UnidadeMedida = {
  id: string
  nome: string
  abreviacao: string
}

export class ApiUnidadesMedida {
  obterTodos(): Promise<Response> {
    return fetch(backend_path, {
      method: 'GET',
    })
  }

  criar(nome: string, abreviacao: string) {
    const unidade = UnidadeMedidaEnvioZ.parse({
      nome,
      abreviacao,
    })
    return fetch(backend_path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unidade),
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

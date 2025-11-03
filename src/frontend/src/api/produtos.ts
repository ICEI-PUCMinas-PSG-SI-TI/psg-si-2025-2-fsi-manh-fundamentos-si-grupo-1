import z from 'zod'

// TODO: Alterar 'localhost' para ENV
const backend_uri = 'http://localhost:5173'
const backend_path = `${backend_uri}/api/v1/produtos`

const ParamIdSchemaZ = z.uuid()

export class ApiProdutos {
  obter(id: string): Promise<Response> {
    const _id = ParamIdSchemaZ.parse(id)
    return fetch(`${backend_path}/${_id}`, {
      method: 'GET',
    })
  }
}

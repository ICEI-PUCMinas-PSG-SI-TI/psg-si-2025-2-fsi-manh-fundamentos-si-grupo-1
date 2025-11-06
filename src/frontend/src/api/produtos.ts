import z from 'zod'
import { fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/produtos`

const ParamIdSchemaZ = z.uuid()

export class ApiProdutos {
  obter(id: string) {
    const _id = ParamIdSchemaZ.parse(id)
    return fetchW(`${endpoint_path}/${_id}`)
  }
}

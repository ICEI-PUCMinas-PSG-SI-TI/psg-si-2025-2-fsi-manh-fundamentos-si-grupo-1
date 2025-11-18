import * as z4 from 'zod/v4'
import { fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/lotes`

const ParamIdSchemaZ = z4.uuid()

export class ApiLotes {
  obter(id: string) {
    const _id = ParamIdSchemaZ.parse(id)
    return fetchW(`${endpoint_path}/${_id}`)
  }
}

import type { GetLoteDTO } from '../../../backend'
import { UuidParseZ } from './common'
import { fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/lotes`

export class ApiLotes {
  obter(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW<GetLoteDTO>(`${endpoint_path}/${_id}`)
  }
}

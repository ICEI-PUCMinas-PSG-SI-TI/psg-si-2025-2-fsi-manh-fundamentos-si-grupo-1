import { fetchW } from './fetchWrapper'
import { UuidParseZ } from './common'
import type { GetLoteDTO } from '../../../backend'

const endpoint_path = `/api/v1/lotes`

export class ApiLotes {
  obter(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW<GetLoteDTO>(`${endpoint_path}/${_id}`)
  }
}

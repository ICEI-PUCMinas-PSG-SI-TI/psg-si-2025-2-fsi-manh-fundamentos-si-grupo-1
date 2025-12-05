import type { ConsultaLoteParams, GetLoteDTO, SetLoteDTO } from '../../../backend'
import { UuidParseZ } from './common'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/api/v1/lotes`

export class ApiLotes {
  criar(opts: SetLoteDTO) {
    return fetchW<{ id: string }>(endpoint_path, {
      method: HttpMethods.Post,
      body: opts,
    })
  }

  obter(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW<GetLoteDTO>(`${endpoint_path}/${_id}`)
  }

  consultar(opts: ConsultaLoteParams) {
    return fetchW<GetLoteDTO[]>(endpoint_path, {
      method: HttpMethods.Get,
      params: opts,
    })
  }
}

const apiLotes = new ApiLotes()
export default apiLotes

import { fetchW, HttpMethods } from './fetchWrapper'
import type {
  ParamsConsultaProdutos,
  SetProdutoDto,
  GetProdutoDto,
  GetConsultaProdutoDto,
} from '../../../backend'
import { UuidParseZ, type IdRegistro } from './common'

const endpoint_path = `/api/v1/produtos`

export class ApiProdutos {
  criar(opts: SetProdutoDto) {
    return fetchW<IdRegistro>(endpoint_path, {
      method: HttpMethods.Post,
      body: opts,
    })
  }

  obterPorId(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW<GetProdutoDto | null>(`${endpoint_path}/${_id}`)
  }

  obterTodos(params?: ParamsConsultaProdutos) {
    return fetchW<GetConsultaProdutoDto[]>(endpoint_path, {
      params: params,
    })
  }
}

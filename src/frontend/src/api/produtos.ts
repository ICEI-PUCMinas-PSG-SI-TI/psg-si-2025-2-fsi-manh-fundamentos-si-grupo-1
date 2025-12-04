import type {
  GetConsultaProdutoDto,
  GetProdutoDto,
  ParamsConsultaProdutos,
  SetProdutoDto,
} from '../../../backend'
import { UuidParseZ, type IdRegistro } from './common'
import { fetchW, HttpMethods } from './fetchWrapper'

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

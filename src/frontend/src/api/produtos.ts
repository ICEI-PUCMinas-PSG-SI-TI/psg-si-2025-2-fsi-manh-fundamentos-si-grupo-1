import z from 'zod'
import { fetchW, HttpMethods } from './fetchWrapper'
import type { UuidResult, ParamsConsultaProdutos, ParamsInserirProdutos } from '../../../backend'
import type { SelectProdutosSchema } from '../../../backend/src/db/schema/produtos'

const endpoint_path = `/api/v1/produtos`

const ParamIdSchemaZ = z.uuid()

export class ApiProdutos {
  criar(opts: ParamsInserirProdutos) {
    return fetchW<UuidResult>(endpoint_path, {
      method: HttpMethods.Post,
      body: opts,
    })
  }

  obterPorId(id: string) {
    const _id = ParamIdSchemaZ.parse(id)
    return fetchW(`${endpoint_path}/${_id}`)
  }

  obterTodos(params?: ParamsConsultaProdutos) {
    return fetchW<SelectProdutosSchema[]>(endpoint_path, {
      params: params,
    })
  }
  static obterTodos(): Promise<Response> {
    return fetch(`${backend_path}`, {
       method: 'GET',
    })
  }
}

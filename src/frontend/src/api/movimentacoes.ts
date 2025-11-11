import type { ParamsConsultaTransacoes } from '../../../backend'
import { fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/transacoes`

export class ApiMovimentacoes {
  obterTodos(params?: ParamsConsultaTransacoes) {
    return fetchW(endpoint_path, {
      params: params,
    })
  }
}

import type { ConsultaMovimentacoesParams } from '../../../backend'
import { fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/transacoes`

export class ApiMovimentacoes {
  obterTodos(params?: ConsultaMovimentacoesParams) {
    return fetchW(endpoint_path, {
      params: params,
    })
  }
}


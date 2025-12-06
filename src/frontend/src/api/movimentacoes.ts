import type { ConsultaMovimentacoesParams, GetConsultaMovimentacaoDto } from '../../../backend'
import { fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/transacoes`

export class ApiMovimentacoes {
  obterTodos(params?: ConsultaMovimentacoesParams) {
    return fetchW<GetConsultaMovimentacaoDto[]>(endpoint_path, {
      params: params,
    })
  }
}

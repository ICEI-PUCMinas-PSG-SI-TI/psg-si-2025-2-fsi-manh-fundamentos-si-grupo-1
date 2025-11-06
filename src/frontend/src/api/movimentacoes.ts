import { fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/transacoes`

export class ApiMovimentacoes {
  obterTodos() {
    return fetchW(endpoint_path)
  }
}

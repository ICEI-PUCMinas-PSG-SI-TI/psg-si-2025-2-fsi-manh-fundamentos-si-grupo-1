// TODO: Alterar 'localhost' para ENV
const backend_uri = 'http://localhost:5173'
const backend_path = `${backend_uri}/api/v1/transacoes`

export class ApiMovimentacoes {
  obterTodos(): Promise<Response> {
    return fetch(backend_path, {
      method: 'GET',
    })
  }
}

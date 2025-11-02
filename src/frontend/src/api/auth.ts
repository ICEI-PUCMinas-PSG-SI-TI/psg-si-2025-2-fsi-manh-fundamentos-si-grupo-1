const backend_url = 'http://localhost:5173'
const backend_path = `${backend_url}/auth`

export class ApiAutenticacao {
  // TODO: Adicionar tipagem de retorno
  login(login: string, senha: string) {
    return fetch(`${backend_path}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        senha,
      }),
    })
  }

  // TODO: Adicionar tipagem de retorno
  sessao() {
    return fetch(`${backend_path}/sessao`, {
      method: 'GET',
    })
  }

  logout() {
    return fetch(`${backend_path}/logout`, {
      method: 'POST',
    })
  }

  logoutAll() {
    return fetch(`${backend_path}/logout-all`, {
      method: 'POST',
    })
  }
}

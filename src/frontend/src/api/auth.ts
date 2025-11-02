const backend_url = 'http://localhost:5173'
const backend_path = `${backend_url}/auth`

export class ApiAutenticacao {
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
}

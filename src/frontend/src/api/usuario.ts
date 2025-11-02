const backend_url = 'http://localhost:5173'
const backend_path = `${backend_url}/api/v1/usuarios`

export class ApiUsuario {
  // TODO: Unificar funções e utilizar opts
  alterarLoginNome(login?: string, nome?: string) {
    return fetch(`${backend_path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        nome,
      }),
    })
  }

  alterarSenha(senhaAntiga: string, senhaNova: string) {
    return fetch(`${backend_path}/alterar-senha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senhaAntiga,
        senhaNova,
      }),
    })
  }
}

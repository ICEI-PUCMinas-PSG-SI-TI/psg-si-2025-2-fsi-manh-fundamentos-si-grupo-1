import z from 'zod'

const backend_url = 'http://localhost:5173'
const backend_path = `${backend_url}/api/v1/usuarios`

const ParamIdSchemaZ = z.uuid()

export class ApiUsuario {
  obter(id: string): Promise<Response> {
    const _id = ParamIdSchemaZ.parse(id)
    return fetch(`${backend_path}/${_id}`, {
      method: 'GET',
    })
  }

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

  alterarSenha(senhaAnterior: string, senhaNova: string) {
    return fetch(`${backend_path}/alterar-senha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senhaAnterior,
        senhaNova,
      }),
    })
  }
}

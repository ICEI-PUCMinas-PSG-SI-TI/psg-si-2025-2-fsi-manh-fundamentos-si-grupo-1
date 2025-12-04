import { UuidParseZ } from './common'
import { HttpMethods, fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/usuarios`

export class ApiPerfil {
  obterPorId(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW(`${endpoint_path}/${_id}`)
  }

  // TODO: Unificar funções e utilizar opts
  alterarLoginNome(login?: string, nome?: string) {
    return fetchW(`${endpoint_path}`, {
      method: HttpMethods.Patch,
      body: {
        login,
        nome,
      },
    })
  }

  alterarSenha(senhaAnterior: string, senhaNova: string) {
    return fetchW(`${endpoint_path}/alterar-senha`, {
      method: HttpMethods.Post,
      body: {
        senhaAnterior,
        senhaNova,
      },
    })
  }
}

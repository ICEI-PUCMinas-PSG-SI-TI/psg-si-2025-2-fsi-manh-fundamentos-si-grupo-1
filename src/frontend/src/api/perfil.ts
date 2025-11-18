import * as z4 from 'zod/v4'
import { HttpMethods, fetchW } from './fetchWrapper'

const endpoint_path = `/api/v1/usuarios`

const ParamIdSchemaZ = z4.uuid()

export class ApiPerfil {
  obterPorId(id: string) {
    const _id = ParamIdSchemaZ.parse(id)
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

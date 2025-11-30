import { fetchW, HttpMethods } from './fetchWrapper'
import type { GetUsuarioDto, SetUsuarioDto, UpdateUsuarioDto } from '../../../backend'
import { UuidParseZ, type IdRegistro } from './common'

const endpoint_path = `/api/v1/admin/usuarios`

export class ApiUsuario {
  criar(opts: SetUsuarioDto) {
    return fetchW<IdRegistro>(endpoint_path, {
      method: HttpMethods.Post,
      body: opts,
    })
  }

  obterPorId(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW<GetUsuarioDto>(`${endpoint_path}/${_id}`)
  }

  obter() {
    return fetchW<GetUsuarioDto[]>(endpoint_path)
  }

  alterarSenha(usuarioId: string, senha: string) {
    const _id = UuidParseZ.parse(usuarioId)
    return fetchW(`${endpoint_path}/alterar-senha/${_id}`, {
      method: HttpMethods.Post,
      body: {
        senha,
      },
    })
  }

  atualizar(usuarioId: string, body: UpdateUsuarioDto) {
    const _id = UuidParseZ.parse(usuarioId)
    return fetchW(`${endpoint_path}/${_id}`, {
      method: HttpMethods.Patch,
      body: body,
    })
  }
}

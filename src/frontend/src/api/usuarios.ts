import * as z4 from 'zod/v4'
import { fetchW, HttpMethods } from './fetchWrapper'
import type {
  SelectUsuarioSchema,
  UpdateUsuarioSchema,
} from '../../../backend/src/db/schema/usuarios'
import type { InsertUsuarioSchemaReq } from '../../../backend/src/services/servicoUsuarios'
import type { UuidResult } from '../../../backend'

const endpoint_path = `/api/v1/admin/usuarios`

const ParamIdSchemaZ = z4.uuid()

export class ApiUsuario {
  criar(opts: InsertUsuarioSchemaReq) {
    return fetchW<UuidResult>(endpoint_path, {
      method: HttpMethods.Post,
      body: opts,
    })
  }

  obterPorId(id: string) {
    const _id = ParamIdSchemaZ.parse(id)
    return fetchW(`${endpoint_path}/${_id}`)
  }

  obter() {
    return fetchW<SelectUsuarioSchema[]>(endpoint_path)
  }

  alterarSenha(usuarioId: string, senha: string) {
    const _id = ParamIdSchemaZ.parse(usuarioId)
    return fetchW(`${endpoint_path}/alterar-senha/${_id}`, {
      method: HttpMethods.Post,
      body: {
        senha,
      },
    })
  }

  atualizar(usuarioId: string, body: UpdateUsuarioSchema) {
    const _id = ParamIdSchemaZ.parse(usuarioId)
    return fetchW(`${endpoint_path}/${_id}`, {
      method: HttpMethods.Patch,
      body: body,
    })
  }
}

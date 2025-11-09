import type { Permissoes } from '../../../backend/src/db/schema/permissoes'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/api/v1/permissoes`

export class ApiPermissoes {
  visualizar(usuarioId: string) {
    return fetchW<Permissoes[]>(`${endpoint_path}/ver/${usuarioId}`, {
      method: HttpMethods.Get,
    })
  }

  adicionar(usuarioId: string, perms: Permissoes[]) {
    return fetchW(`${endpoint_path}/add/${usuarioId}`, {
      method: HttpMethods.Patch,
      body: perms,
    })
  }

  definir(usuarioId: string, perms: Permissoes[]) {
    return fetchW(`${endpoint_path}/set/${usuarioId}`, {
      method: HttpMethods.Patch,
      body: perms,
    })
  }

  remover(usuarioId: string, perms: Permissoes[]) {
    return fetchW(`${endpoint_path}/del/${usuarioId}`, {
      method: HttpMethods.Patch,
      body: perms,
    })
  }
}

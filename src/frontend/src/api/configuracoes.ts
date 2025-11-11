import { fetchW, HttpMethods } from './fetchWrapper'
import type { ParamsInserirConfiguracoes } from '../../../backend'
import type { SelectConfiguracaoSchema } from '../../../backend/src/db/schema/configuracoes'

const endpoint_path = `/api/v1/configuracoes`

export class ApiConfiguracoes {
  obterTodos() {
    return fetchW<SelectConfiguracaoSchema>(endpoint_path)
  }

  // TODO: Como retornar status? 400, 500, ...
  atualizar(opts: ParamsInserirConfiguracoes) {
    return fetchW(endpoint_path, {
      method: HttpMethods.Patch,
      body: opts,
    })
  }

  ping() {
    return fetchW('/ping')
  }
}

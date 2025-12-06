import type { GetConfiguracaoDto, Identificador, UpdateConfiguracaoDto } from '../../../backend'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/api/v1/configuracoes`

export class ApiConfiguracoes {
  obterTodos() {
    return fetchW<GetConfiguracaoDto>(endpoint_path)
  }

  // TODO: Como retornar status? 400, 500, ...
  atualizar(opts: UpdateConfiguracaoDto) {
    return fetchW(endpoint_path, {
      method: HttpMethods.Patch,
      body: opts,
    })
  }

  ping() {
    return fetchW('/ping')
  }

  alterarIdentificador(identificador: Identificador) {
    return fetchW(`${endpoint_path}/codigo`, {
      method: HttpMethods.Patch,
      body: { identificador },
    })
  }
}

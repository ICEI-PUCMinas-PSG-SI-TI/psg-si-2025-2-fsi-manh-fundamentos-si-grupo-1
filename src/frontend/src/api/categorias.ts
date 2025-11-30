import * as z4 from 'zod/v4'
import { fetchW, HttpMethods as HttpMethods } from './fetchWrapper'
import type { GetCategoriaDTO, SetCategoriaDTO } from '../../../backend'
import { UuidParseZ, type IdRegistro } from './common'

const endpoint_path = `/api/v1/categorias`

const NomeEnvioZ = z4.string().nonempty()

export class ApiCategorias {
  obterTodos() {
    return fetchW<GetCategoriaDTO[]>(endpoint_path)
  }

  criar(nome: string) {
    const _nome = NomeEnvioZ.parse(nome)
    return fetchW<IdRegistro>(endpoint_path, {
      method: HttpMethods.Post,
      body: { nome: _nome } as SetCategoriaDTO,
    })
  }

  excluir(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW(`${endpoint_path}/${_id}`, {
      method: HttpMethods.Delete,
    })
  }
}

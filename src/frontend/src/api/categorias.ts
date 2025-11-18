import * as z4 from 'zod/v4'
import { fetchW, HttpMethods as HttpMethods } from './fetchWrapper'
import type { UuidResult } from '../../../backend'
import type { SelectCategoriaSchema } from '../../../backend/src/db/schema/categorias'

const endpoint_path = `/api/v1/categorias`

const ParamIdSchemaZ = z4.uuid()

const NomeEnvioZ = z4.string().nonempty()

export type Categorias = {
  id: string
  nome: string
}

export class ApiCategorias {
  obterTodos() {
    return fetchW<SelectCategoriaSchema[]>(endpoint_path)
  }

  criar(nome: string) {
    const _nome = NomeEnvioZ.parse(nome)
    return fetchW<UuidResult>(endpoint_path, {
      method: HttpMethods.Post,
      body: { nome: _nome },
    })
  }

  excluir(id: string) {
    const uuid = ParamIdSchemaZ.parse(id)
    return fetchW(`${endpoint_path}/${uuid}`, {
      method: HttpMethods.Delete,
    })
  }
}

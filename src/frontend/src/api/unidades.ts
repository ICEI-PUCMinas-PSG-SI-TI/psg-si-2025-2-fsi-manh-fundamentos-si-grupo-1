import * as z4 from 'zod/v4'
import { fetchW, HttpMethods } from './fetchWrapper'
import type { GetUnidadeDto, SetUnidadeDTO } from '../../../backend'
import { UuidParseZ, type IdRegistro } from './common'

const endpoint_path = `/api/v1/unidades`

const UnidadeMedidaEnvioZ = z4.object({
  nome: z4.string().nonempty(),
  abreviacao: z4.string().nonempty(),
})

export class ApiUnidadesMedida {
  obterTodos() {
    return fetchW<GetUnidadeDto[]>(endpoint_path)
  }

  criar(nome: string, abreviacao: string) {
    const bodyContent = UnidadeMedidaEnvioZ.parse({
      nome,
      abreviacao,
    } as SetUnidadeDTO)
    return fetchW<IdRegistro>(endpoint_path, {
      method: HttpMethods.Post,
      body: bodyContent,
    })
  }

  excluir(id: string) {
    const uuid = UuidParseZ.parse(id)
    return fetchW<undefined>(`${endpoint_path}/${uuid}`, {
      method: HttpMethods.Delete,
    })
  }
}

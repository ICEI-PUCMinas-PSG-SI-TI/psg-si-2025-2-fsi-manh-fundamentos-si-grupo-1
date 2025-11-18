import * as z4 from 'zod/v4'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/api/v1/unidades`

const ParamIdSchemaZ = z4.uuid()

const UnidadeMedidaEnvioZ = z4.object({
  nome: z4.string().nonempty(),
  abreviacao: z4.string().nonempty(),
})

export type UnidadeMedida = {
  id: string
  nome: string
  abreviacao: string
}

export class ApiUnidadesMedida {
  obterTodos() {
    return fetchW<UnidadeMedida[]>(endpoint_path)
  }

  criar(nome: string, abreviacao: string) {
    const bodyContent = UnidadeMedidaEnvioZ.parse({
      nome,
      abreviacao,
    })
    return fetchW(endpoint_path, {
      method: HttpMethods.Post,
      body: bodyContent,
    })
  }

  excluir(id: string) {
    const uuid = ParamIdSchemaZ.parse(id)
    return fetchW(`${endpoint_path}/${uuid}`, {
      method: HttpMethods.Delete,
    })
  }
}

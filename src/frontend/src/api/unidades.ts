import z from 'zod'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/api/v1/unidades`

const ParamIdSchemaZ = z.uuid()

const UnidadeMedidaEnvioZ = z.object({
  nome: z.string().nonempty(),
  abreviacao: z.string().nonempty(),
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

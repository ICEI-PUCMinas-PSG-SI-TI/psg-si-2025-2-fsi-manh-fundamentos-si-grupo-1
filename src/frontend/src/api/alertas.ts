import type { GetAlertasDto, GetConsultaAlertasDto, ParamsConsultaAlertas } from '../../../backend'
import { UuidParseZ } from './common'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/api/v1/alertas`

export class ApiAlertas {
  obter() {
    return fetchW<GetAlertasDto[]>(endpoint_path, {
      method: HttpMethods.Get,
    })
  }

  consultar(opts?: ParamsConsultaAlertas) {
    return fetchW<GetConsultaAlertasDto[]>(endpoint_path, {
      method: HttpMethods.Get,
      params: opts,
    })
  }

  obterQuantidadeAtivos() {
    return fetchW<{ quantidade: number }>(`${endpoint_path}/quantidade-nao-mutado`, {
      method: HttpMethods.Get,
    })
  }

  silenciar(id: string) {
    const _id = UuidParseZ.parse(id)
    return fetchW<GetAlertasDto[]>(`${endpoint_path}/silenciar/${_id}`, {
      method: HttpMethods.Patch,
    })
  }

  verificar() {
    return fetchW<string[]>(`${endpoint_path}/verificar`, {
      method: HttpMethods.Post,
    })
  }
}

const apiAlertas = new ApiAlertas()

export default apiAlertas

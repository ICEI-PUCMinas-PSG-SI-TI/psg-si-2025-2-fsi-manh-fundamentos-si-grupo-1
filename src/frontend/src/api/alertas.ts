import { fetchW, HttpMethods } from './fetchWrapper'
import type { GetAlertasDto } from '../../../backend'
import { UuidParseZ } from './common'

const endpoint_path = `/api/v1/alertas`

export class ApiAlertas {
  obterAlertas() {
    return fetchW<GetAlertasDto[]>(endpoint_path, {
      method: HttpMethods.Get,
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

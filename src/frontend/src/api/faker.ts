import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = (entidade: string) => `/api/v1/admin/faker/${entidade}`

export class ApiFaker {
  criarMovimentacoes(canRecurse: boolean = false, quant: number = 10) {
    return fetchW(endpoint_path('movimentacoes'), {
      method: HttpMethods.Post,
      body: {
        canRecurse,
        quant,
      },
    })
  }

  criarLotes(canRecurse: boolean = false, quant: number = 10) {
    return fetchW(endpoint_path('lotes'), {
      method: HttpMethods.Post,
      body: {
        canRecurse,
        quant,
      },
    })
  }

  criarProdutos(canRecurse: boolean = false, quant: number = 10) {
    return fetchW(endpoint_path('produtos'), {
      method: HttpMethods.Post,
      body: {
        canRecurse,
        quant,
      },
    })
  }

  criarUsuarios(canRecurse: boolean = false, quant: number = 10) {
    return fetchW(endpoint_path('usuarios'), {
      method: HttpMethods.Post,
      body: {
        canRecurse,
        quant,
      },
    })
  }

  criarUnidadesMedida(canRecurse: boolean = false, quant: number = 10) {
    return fetchW(endpoint_path('unidades-medida'), {
      method: HttpMethods.Post,
      body: {
        canRecurse,
        quant,
      },
    })
  }
}

const apiFaker = new ApiFaker()

export default apiFaker

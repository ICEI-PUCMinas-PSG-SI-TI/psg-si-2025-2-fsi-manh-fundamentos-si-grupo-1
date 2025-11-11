import type { UserSessionInfo } from '../../../backend'
import { fetchW, HttpMethods } from './fetchWrapper'

const endpoint_path = `/auth`

// TODO: Adicionar tipagem de retorno
export class ApiAutenticacao {
  login(login: string, senha: string) {
    return fetchW<UserSessionInfo>(`${endpoint_path}/login`, {
      method: HttpMethods.Post,
      body: {
        login,
        senha,
      },
    })
  }

  sessao() {
    return fetchW<UserSessionInfo>(`${endpoint_path}/sessao`, {
      method: HttpMethods.Get,
      muteNotifications: true,
    })
  }

  logout() {
    return fetchW(`${endpoint_path}/logout`, {
      method: HttpMethods.Post,
    })
  }

  logoutAll() {
    return fetchW(`${endpoint_path}/logout-all`, {
      method: HttpMethods.Post,
    })
  }
}

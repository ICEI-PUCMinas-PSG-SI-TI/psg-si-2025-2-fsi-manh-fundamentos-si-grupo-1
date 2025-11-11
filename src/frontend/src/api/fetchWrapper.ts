// import { useNotificationStore } from '@/store/config/toast'
// const notificacoes = useNotificationStore()

import { notificacoes } from '@/main'

export enum HttpMethods {
  Get = 'GET',
  Post = 'POST',
  Delete = 'DELETE',
  Patch = 'PATCH',
}

// TODO: Alterar 'localhost' para ENV
// const backend_url = 'http://localhost:5173'
const backend_url = `http://${window.location.host}`

export async function fetchW<T>(
  path: string,
  opts?: {
    method?: string
    body?: string | object
    params?: object
    muteNotifications?: true
  },
): Promise<{
  // TODO: retornar resposta de uma vez?
  ok: boolean
  responseBody?: T
  resStatus: number
  statusText: string
}> {
  const url = new URL(backend_url)
  url.pathname = path
  let _body = undefined
  let _headers = undefined
  if (opts) {
    if (opts.params) {
      Object.entries(opts.params).forEach((k) => {
        url.searchParams.append(k[0], k[1].toString())
      })
    }
    if (typeof opts.body === 'string') {
      _body = opts.body
    } else if (typeof opts.body === 'object') {
      _body = JSON.stringify(opts.body)
      _headers = {
        'Content-Type': 'application/json',
      }
    }
  }
  try {
    const response = await fetch(url, {
      method: opts?.method || 'GET',
      headers: _headers,
      body: _body,
    })
    if (response.ok) {
      let data: T | undefined = undefined
      if (response.headers.get('Content-Type')?.startsWith('application/json'))
        data = await response.json()
      return {
        ok: true,
        responseBody: data,
        resStatus: response.status,
        statusText: response.statusText,
      }
    } else {
      if (!opts?.muteNotifications) {
        notificacoes.addNotification(response.statusText, { isError: true })
      }
      return {
        ok: false,
        resStatus: response.status,
        statusText: response.statusText,
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      notificacoes.addNotification(err.message, { isError: true, title: 'Request Error' })
    } else {
      console.error(err)
    }
  }
  return { ok: false, resStatus: -1, statusText: '' }
}

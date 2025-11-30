import { ApiAutenticacao } from '@/api/auth'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { type GetSessaoDto } from '../../../../backend'
import { Permissoes } from '../../../../backend'

const autenticacao = new ApiAutenticacao()

// TODO: Armazenar informações separadamente?
const refUserInfo: Ref<GetSessaoDto | null> = ref(null)
const refDidFetch = ref(false)

async function isUserLoggedIn(): Promise<boolean> {
  const res = await autenticacao.sessao()
  refDidFetch.value = true
  if (res.ok) {
    if (res.responseBody) refUserInfo.value = res.responseBody
    return true
  }
  return false
}

export const useSessaoStore = defineStore('sessao', {
  state: () => ({ isLoggedIn: false, didFetch: refDidFetch }),
  getters: {
    getUserInfo(): GetSessaoDto | null {
      return refUserInfo.value
    },
  },
  actions: {
    possuiPermissao(permissao: Permissoes): boolean {
      return refUserInfo.value?.permissoes.includes(permissao) || false
    },
    logout() {
      refUserInfo.value = null
      this.isLoggedIn = false
    },
    async checkLogin() {
      this.isLoggedIn = await isUserLoggedIn()
    },
  },
})

import { ApiAutenticacao } from '@/api/auth'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { UserSessionInfo } from '../../../../backend'

const autenticacao = new ApiAutenticacao()

// TODO: Armazenar informações separadamente?
const refUserInfo: Ref<UserSessionInfo | null> = ref(null)

async function isUserLoggedIn(): Promise<boolean> {
  const res = await autenticacao.sessao()
  if (res.ok) {
    if (res.responseBody) refUserInfo.value = res.responseBody
    return true
  }
  return false
}

export const useSessaoStore = defineStore('sessao', {
  state: () => ({ isLoggedIn: false }),
  getters: {
    getUserInfo(): UserSessionInfo | null {
      return refUserInfo.value
    },
  },
  actions: {
    logout() {
      refUserInfo.value = null
      this.isLoggedIn = false
    },
    async checkLogin() {
      this.isLoggedIn = await isUserLoggedIn()
    },
  },
})

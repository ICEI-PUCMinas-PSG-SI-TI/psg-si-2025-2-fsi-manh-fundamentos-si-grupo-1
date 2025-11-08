import { ApiAutenticacao } from '@/api/auth'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { UserSessionInfo } from '../../../../backend'

const autenticacao = new ApiAutenticacao()

// TODO: Armazenar informações separadamente?
const refUserInfo: Ref<UserSessionInfo | null> = ref(null)

async function isUserLoggedIn(): Promise<boolean> {
  const res = await autenticacao.sessao()
  return res.ok
}

export const useSessaoStore = defineStore('sessao', {
  state: () => ({ isLoggedIn: false }),
  getters: {
    async getUserInfo(): Promise<UserSessionInfo | null> {
      if (this.isLoggedIn) {
        return refUserInfo.value
      } else {
        await isUserLoggedIn()
        return refUserInfo.value
      }
    },
  },
  actions: {
    async checkLogin() {
      this.isLoggedIn = await isUserLoggedIn()
    },
  },
})

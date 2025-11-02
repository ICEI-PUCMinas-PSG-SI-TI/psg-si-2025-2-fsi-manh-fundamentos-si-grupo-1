import { CONFIG_KEY_DARK_THEME } from '@/services/storage'
import { defineStore } from 'pinia'

// TODO: View if system has any type of "light", "dark", "other"
function isSystemDarkModePreferred() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function isUserDarkModePrefered() {
  const item = localStorage.getItem(CONFIG_KEY_DARK_THEME)
  if (item === null) return null
  return item === 'true'
}

// INFO: Se o usuário alterar o tema uma única vez, a configuração fica dessincronizada com o sistema
export const useTemaStore = defineStore('tema', {
  state: () => ({
    isSystemDarkModePreferred: isSystemDarkModePreferred() as boolean,
    isUserDarkModePrefered: isUserDarkModePrefered() as boolean | null,
  }),
  getters: {
    isDarkModePreferred: (state) => {
      if (state.isUserDarkModePrefered === null && state.isSystemDarkModePreferred) return true
      else if (state.isUserDarkModePrefered) return true
      return false
    },
  },
  actions: {
    setUserDarkMode(isPreferred: boolean) {
      // TODO: Utilizar API do frontend para salvar informação
      this.isUserDarkModePrefered = isPreferred
      localStorage.setItem(CONFIG_KEY_DARK_THEME, this.isUserDarkModePrefered.toString())
    },
  },
})

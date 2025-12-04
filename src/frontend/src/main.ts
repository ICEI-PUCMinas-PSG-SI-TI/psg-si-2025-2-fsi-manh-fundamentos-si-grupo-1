import { createPinia } from 'pinia'
import { createApp } from 'vue'
import * as z4 from 'zod/v4'
import App from './App.vue'
import './assets/css/main.css'
import router from './router'

z4.config(z4.locales.pt())

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

// Permite a utilização do pinia fora de componentes
import { useSessaoStore } from './store/config/sessao'
import { useNotificationStore } from './store/config/toast'

export const notificacoes = useNotificationStore()
export const sessao = useSessaoStore()

sessao.checkLogin()

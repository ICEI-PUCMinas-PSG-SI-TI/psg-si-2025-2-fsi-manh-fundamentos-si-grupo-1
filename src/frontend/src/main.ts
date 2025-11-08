import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

// Permite a utilização do pinia fora de componentes
import { useNotificationStore } from './store/config/toast'
import { useSessaoStore } from './store/config/sessao'
export const notificacoes = useNotificationStore()
export const sessao = useSessaoStore()

sessao.checkLogin()

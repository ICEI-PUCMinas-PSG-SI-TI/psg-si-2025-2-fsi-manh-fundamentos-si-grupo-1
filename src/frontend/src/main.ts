import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')

// Permite a utilização do pinia fora de componentes
import { useNotificationStore } from './store/config/toast'
export const notificacoes = useNotificationStore()

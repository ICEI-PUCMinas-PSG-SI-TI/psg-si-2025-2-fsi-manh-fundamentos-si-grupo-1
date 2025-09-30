import DashboardView from '@/views/DashboardView.vue'
import ExampleView from '@/views/NotImplementedView.vue'
import LoginView from '@/views/LoginView.vue'
import MovimentacoesView from '@/views/MovimentacoesView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import NotImplementedView from '@/views/NotImplementedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ExampleView,
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      component: DashboardView,
    },
    {
      path: '/movimentacoes',
      component: MovimentacoesView,
    },
    {
      path: '/produtos',
      component: NotImplementedView,
    },
    {
      path: '/relatorio_1',
      component: NotImplementedView,
    },
    {
      path: '/relatorio_2',
      component: NotImplementedView,
    },
    {
      path: '/relatorio_3',
      component: NotImplementedView,
    },
    {
      path: '/usuarios',
      component: NotImplementedView,
    },
    {
      path: '/configuracoes',
      component: NotImplementedView,
    },
  ],
})

export default router

import DashboardView from '@/views/DashboardView.vue'
import ExampleView from '@/views/NotImplementedView.vue'
import LoginView from '@/views/LoginView.vue'
import MovimentacoesView from '@/views/MovimentacoesView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import NotImplementedView from '@/views/NotImplementedView.vue'
import { CONFIG_KEY_ID } from '@/services/storage'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      name: 'login',
      path: '/login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      // Página de controle de estoque (registra entradas e saidas).
      path: '/operacoes',
      component: NotImplementedView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      // Página de visualização de registro (histórico de movimentações).
      path: '/movimentacoes',
      component: MovimentacoesView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      path: '/produtos',
      component: ExampleView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      path: '/relatorio_1',
      component: NotImplementedView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      path: '/relatorio_2',
      component: NotImplementedView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      path: '/relatorio_3',
      component: NotImplementedView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      path: '/usuarios',
      component: NotImplementedView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
    {
      path: '/configuracoes',
      component: NotImplementedView,
      meta: {
        autenticacaoNecessaria: true,
      },
    },
  ],
})

// TODO: Invalidar rotas em caso de erros 401
router.beforeEach((to, _, next) => {
  // TODO: Realizar autenticação mais elegante
  if (
    to.matched.some((record) => record.meta.autenticacaoNecessaria) &&
    !localStorage.getItem(CONFIG_KEY_ID)
  ) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router

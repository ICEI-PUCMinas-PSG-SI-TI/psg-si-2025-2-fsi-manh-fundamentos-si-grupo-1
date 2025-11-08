import DashboardView from '@/views/DashboardView.vue'
import ExampleView from '@/views/NotImplementedView.vue'
import LoginView from '@/views/LoginView.vue'
import MovimentacoesView from '@/views/MovimentacoesView.vue'
import { createRouter, createWebHistory, type NavigationGuardNext } from 'vue-router'
import NotImplementedView from '@/views/NotImplementedView.vue'
import ConfiguracoesView from '@/views/ConfiguracoesView.vue'
import { sessao } from '@/main'

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
      name: 'dashboard',
      path: '/dashboard',
      component: DashboardView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      // Página de controle de estoque (registra entradas e saidas).
      name: 'operacoes',
      path: '/operacoes',
      component: NotImplementedView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      // Página de visualização de registro (histórico de movimentações).
      name: 'movimentacoes',
      path: '/movimentacoes',
      component: MovimentacoesView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      name: 'produtos',
      path: '/produtos',
      component: ExampleView,
      meta: {
        requerAutenticacao: true,
      },
    },
    // TODO: Funcionalidade não será implementada no momento (sprint 3)
    /*
    {
      path: '/relatorio_1',
      component: NotImplementedView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      path: '/relatorio_2',
      component: NotImplementedView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      path: '/relatorio_3',
      component: NotImplementedView,
      meta: {
        requerAutenticacao: true,
      },
    },
    */
    {
      name: 'usuarios',
      path: '/usuarios',
      component: NotImplementedView,
      meta: {
        requerAutenticacao: true,
        requerAdmin: true,
      },
    },
    {
      name: 'configuracoes',
      path: '/configuracoes',
      component: ConfiguracoesView,
      meta: {
        requerAutenticacao: true,
      },
    },
  ],
})

// TODO: Invalidar rotas em caso de erros 401
router.beforeEach((to, from, next: NavigationGuardNext) => {
  // TODO: Realizar autenticação mais elegante
  if (to.matched.some((record) => record.meta.requerAutenticacao)) {
    if (sessao.isLoggedIn) {
      next()
    } else {
      if (to.name) {
        next({ name: 'login', query: { nextPage: to.name.toString() } })
      } else {
        next({ name: 'login' })
      }
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next: NavigationGuardNext) => {
  // TODO: Realizar autenticação mais elegante
  if (to.matched.some((record) => record.meta.requerAdmin)) {
    if (sessao.getUserInfo?.nivelPermissoes === 0) {
      next()
    } else {
      next({ name: 'dashboard' })
    }
  } else {
    next()
  }
})

export default router

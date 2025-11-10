import PesquisaProdutosView from '@/views/PesquisaProdutosView.vue'
import LoginView from '@/views/LoginView.vue'
import MovimentacoesView from '@/views/MovimentacoesView.vue'
import { createRouter, createWebHistory, type NavigationGuardNext } from 'vue-router'
import ConfiguracoesView from '@/views/ConfiguracoesView.vue'
import { sessao } from '@/main'
import { Permissoes } from '../../../backend'
import DesenvolvedorView from '@/views/DesenvolvedorView.vue'
import CadastroUsuariosView from '@/views/CadastroUsuariosView.vue'
import LoadingView from '@/views/LoadingView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import OperacoesDiariasView from '@/views/OperacoesDiariasView.vue'
import ProdutosView from '@/views/ProdutosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'start',
      path: '/',
      redirect: '/operacoes',
    },
    {
      name: 'loading',
      path: '/loading',
      component: LoadingView,
    },
    {
      name: 'login',
      path: '/login',
      component: LoginView,
    },
    {
      // Página de controle de estoque (registra entradas e saidas).
      name: 'operacoes',
      path: '/operacoes',
      component: OperacoesDiariasView,
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
      component: PesquisaProdutosView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      path: '/informacoes_produtos',
      component: ProdutosView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      name: 'usuarios',
      path: '/usuarios',
      meta: {
        requerAutenticacao: true,
        requerPermissoes: [[Permissoes.Administrador], [Permissoes.Desenvolvedor]],
      },
      component: CadastroUsuariosView,
    },
    {
      name: 'configuracoes',
      path: '/configuracoes',
      component: ConfiguracoesView,
      meta: {
        requerAutenticacao: true,
      },
    },
    {
      name: 'desenvolvedor',
      path: '/desenvolvedor',
      component: DesenvolvedorView,
      meta: {
        requerAutenticacao: true,
        requerPermissoes: [[Permissoes.Desenvolvedor]],
      },
    },
    {
      // Matches any path not previously matched
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFoundView,
    },
  ],
})

// TODO: Invalidar rotas em caso de erros 401
router.beforeEach((to, _from, next: NavigationGuardNext) => {
  // TODO: Realizar autenticação mais elegante
  if (to.matched.some((record) => record.meta.requerAutenticacao)) {
    if (sessao.isLoggedIn) {
      next()
    } else {
      if (to.name) {
        next({ name: 'loading', query: { nextPage: to.name.toString() } })
      } else {
        next({ name: 'loading' })
      }
    }
  } else {
    next()
  }
})

router.beforeEach((to, _from, next: NavigationGuardNext) => {
  // TODO: Realizar autenticação mais elegante
  if (to.matched.some((record) => record.meta.requerPermissoes)) {
    const permissoes = to.meta.requerPermissoes
    // Permissoes[][] -> [Or][And]
    let permitido = false
    if (Array.isArray(permissoes) && permissoes.length !== 0) {
      permitido = (permissoes as Permissoes[][]).reduce(
        (okOr, permsAnd) =>
          okOr ||
          permsAnd.reduce((okAnd, needPerm) => okAnd && sessao.possuiPermissao(needPerm), true),
        permitido,
      )
    }
    if (permitido) {
      next()
    } else {
      next({ name: 'operacoes' })
    }
  } else {
    next()
  }
})

export default router

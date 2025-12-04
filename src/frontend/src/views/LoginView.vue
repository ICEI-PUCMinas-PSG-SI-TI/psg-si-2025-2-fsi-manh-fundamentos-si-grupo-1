<template>
  <div class="relative flex h-screen w-screen items-center justify-center overflow-hidden p-4">
    <div class="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:-mt-16">
      <LogoLoginItem
        class="absolute -top-5 left-1/2 h-45 w-30 -translate-x-1/2 transform sm:w-45 md:h-45 md:w-42"
      />

      <!-- Formulário -->
      <div class="flex justify-center">
        <form
          @submit.prevent="login"
          class="bg-opacity-90 mt-20 flex h-100 w-105 flex-col gap-4 rounded-3xl bg-gray-300 p-8 pt-25 text-white shadow-xl"
        >
          <!-- Usuário -->
          <div
            class="rounded- focus-within:rin flex items-center bg-neutral-600 px-3 py-2 transition"
          >
            <UserIcon class="mr-2 h-7 w-6 text-white" />
            <input
              v-model="refFormulario.usuario"
              type="text"
              placeholder="USUÁRIO"
              class="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              required
            />
          </div>

          <!-- Senha -->
          <div class="focus-within:rin flex items-center bg-neutral-600 px-3 py-2 transition">
            <LockClosedIcon class="mr-2 h-7 w-6 text-white" />
            <input
              v-model="refFormulario.senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="SENHA"
              class="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              required
            />
          </div>

          <!-- Checkbox para mostrar senha -->
          <div class="flex items-center">
            <input type="checkbox" id="mostrarSenha" class="mr-2" v-model="mostrarSenha" />
            <label for="mostrarSenha" class="cursor-pointer text-gray-700">Mostrar senha</label>
          </div>

          <p v-if="erro" class="mt-2 text-center text-sm text-red-500 sm:text-base">{{ erro }}</p>

          <!-- Botão -->
          <button
            type="submit"
            class="mt-4 w-full transform cursor-pointer bg-rose-600 py-2 font-bold text-white shadow-xl transition hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ApiAutenticacao } from '@/api/auth'
import LogoLoginItem from '@/components/login/LogoLoginItem.vue'
import { CrecenciaisZ } from '@/services/objects'
import { CONFIG_KEY_DARK_THEME } from '@/services/storage'
import { useSessaoStore } from '@/store/config/sessao'
import { useNotificationStore } from '@/store/config/toast'
import { LockClosedIcon, UserIcon } from '@heroicons/vue/24/outline'
import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const useNotifications = useNotificationStore()

const refFormulario: Ref<{
  usuario: string
  senha: string
}> = ref({
  usuario: '',
  senha: '',
})
const erro = ref('')
const mostrarSenha = ref(false)

const autenticacao = new ApiAutenticacao()

async function login() {
  const credenciais = CrecenciaisZ.safeParse(refFormulario.value)
  if (credenciais.error) {
    erro.value = credenciais.error.issues[0].message
  } else {
    const res = await autenticacao.login(credenciais.data.usuario, credenciais.data.senha)
    if (res.ok && res.responseBody) {
      const data = res.responseBody
      // TODO: Realizar ligação entre configurações do frontend e backend
      localStorage.setItem(CONFIG_KEY_DARK_THEME, data.modoEscuro.toString())
      useSessao.checkLogin()
    } else if (res.resStatus >= 400 && res.resStatus < 500) {
      erro.value = 'Credenciais inválidas!'
    } else {
      useNotifications.addNotification(res.statusText, { isError: true })
    }
  }
}

const useSessao = useSessaoStore()
useSessao.$subscribe((_, state) => {
  if (state.isLoggedIn) {
    if (typeof route.query.nextPage === 'string' && router.hasRoute(route.query.nextPage)) {
      router.push(route.query.nextPage)
    } else {
      router.push({ name: 'operacoes' })
    }
  }
})
</script>

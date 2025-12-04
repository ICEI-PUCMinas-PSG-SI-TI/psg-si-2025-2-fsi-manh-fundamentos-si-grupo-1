<template>
  <div class="relative flex justify-center items-center w-full h-full overflow-hidden p-4">
    <div class="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:-mt-16">
      <LogoLoginItem
        class="absolute -top-5 left-1/2 transform -translate-x-1/2 w-30 h-45 sm:w-45 md:w-42 md:h-45"
      />

      <!-- Formulário -->
      <div class="flex justify-center">
        <form
          @submit.prevent="login"
          class="w-105 pt-25 mt-20 bg-gray-300 bg-opacity-90 rounded-3xl shadow-xl p-8 flex flex-col gap-4 text-white"
        >
          <!-- Usuário -->
          <div
            class="flex items-center bg-neutral-600 rounded- px-3 py-2 focus-within:rin transition rounded"
          >
            <UserIcon class="w-6 h-7 mr-2 text-white" />
            <input
              v-model="refFormulario.usuario"
              type="text"
              placeholder="Usuário"
              class="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
              required
            />
          </div>

          <!-- Senha -->
          <div
            class="flex items-center bg-neutral-600 px-3 py-2 focus-within:rin transition rounded"
          >
            <LockClosedIcon class="w-6 h-7 mr-2 text-white" />
            <input
              v-model="refFormulario.senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="Senha"
              class="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
              required
            />
          </div>

          <!-- Checkbox para mostrar senha -->
          <fieldset class="fieldset rounded-box w-64">
            <label class="label text-gray-700">
              <input type="checkbox" class="checkbox checkbox-neutral" v-model="mostrarSenha" />
              Mostrar senha
            </label>
          </fieldset>

          <p v-if="erro" class="text-red-500 mt-2 text-center text-sm sm:text-base">{{ erro }}</p>

          <!-- Botão -->
          <button
            type="submit"
            class="shadow-xl cursor-pointer mt-4 w-full bg-green-700 text-white font-bold py-2 transition transform hover:scale-105 rounded"
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

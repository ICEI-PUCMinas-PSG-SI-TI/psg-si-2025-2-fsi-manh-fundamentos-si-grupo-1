<template>
  <div class="relative flex justify-center items-center w-screen h-screen overflow-hidden p-4">
    <div class="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:-mt-16">
      <LogoLoginItem
        class="absolute -top-5 left-1/2 transform -translate-x-1/2 w-30 h-45 sm:w-45 md:w-42 md:h-45"
      />

      <!-- Formulário -->
      <div class="flex justify-center">
        <form
          @submit.prevent="login"
          class="w-105 h-100 pt-25 mt-20 bg-gray-300 bg-opacity-90 rounded-3xl shadow-xl p-8 flex flex-col gap-4 text-white"
        >
          <!-- Usuário -->
          <div
            class="flex items-center bg-neutral-600 rounded- px-3 py-2 focus-within:rin transition"
          >
            <UserIcon class="w-6 h-7 mr-2 text-white" />
            <input
              v-model="refFormulario.usuario"
              type="text"
              placeholder="USUÁRIO"
              class="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
              required
            />
          </div>

          <!-- Senha -->
          <div class="flex items-center bg-neutral-600 px-3 py-2 focus-within:rin transition">
            <LockClosedIcon class="w-6 h-7 mr-2 text-white" />
            <input
              v-model="refFormulario.senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="SENHA"
              class="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
              required
            />
          </div>

          <!-- Checkbox para mostrar senha -->
          <div class="flex items-center">
            <input type="checkbox" id="mostrarSenha" class="mr-2" v-model="mostrarSenha" />
            <label for="mostrarSenha" class="text-gray-700 cursor-pointer">Mostrar senha</label>
          </div>

          <p v-if="erro" class="text-red-500 mt-2 text-center text-sm sm:text-base">{{ erro }}</p>

          <!-- Botão -->
          <button
            type="submit"
            class="shadow-xl cursor-pointer mt-4 w-full bg-rose-600 text-white font-bold py-2 transition transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoLoginItem from '@/components/login/LogoLoginItem.vue'
import { LockClosedIcon, UserIcon } from '@heroicons/vue/24/outline'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const refFormulario: Ref<{
  usuario: string
  senha: string
}> = ref({
  usuario: '',
  senha: '',
})
const erro = ref('')
const mostrarSenha = ref(false)

interface Usuario {
  id: string
  nome: string
  login: string
  salted_password: string
  [key: string]: string
}
function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
function login() {
  if (!validarEmail(refFormulario.value.usuario)) {
    erro.value = 'Digite um email válido'
    return
  }
  fetch('http://localhost:3000/usuarios')
    .then((res) => {
      if (!res.ok) throw new Error('Não foi possível carregar os usuários')
      return res.json()
    })
    .then((usuarios: Usuario[]) => {
      const { usuario, senha } = refFormulario.value
      const encontrado = usuarios.find((u) => u.email === usuario && u.login === senha)
      if (encontrado) {
        erro.value = ''
        alert(`Bem-vindo, ${encontrado.nome}!`)
        router.push('/dashboard')
      } else {
        erro.value = 'Login ou senha incorretos'
        refFormulario.value.senha = ''
        refFormulario.value.usuario = ''
      }
    })
    .catch((e) => {
      erro.value = e.message
    })
}
</script>

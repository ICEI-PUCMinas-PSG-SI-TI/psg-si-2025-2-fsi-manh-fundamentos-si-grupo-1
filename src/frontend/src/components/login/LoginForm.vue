<template>
  <div class="relative flex justify-center items-center w-screen h-screen overflow-hidden p-4">
    <div class="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:-mt-16">
      <logo-login-item class="  absolute -top-5 left-1/2 transform -translate-x-1/2 w-30 h-45 sm:w-32 sm:w-45 md:w-42 md:h-45"  />

      <!-- Formulário -->
      <div class="flex justify-center">
        <form @submit.prevent ="login"
          class="w-105 h-100 pt-25 mt-20 bg-gray-300 bg-opacity-90 rounded-3xl shadow-xl p-8 flex flex-col gap-4 text-white"
        >
          <!-- Usuário -->

          <div
            class="flex items-center bg-neutral-600  rounded- px-3 py-2 focus-within:rin  transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-7 mr-2 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <input
              v-model="usuario"
              type="text"
              placeholder="USUÁRIO"
              class="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
              required
            />
          </div>

          <!-- Senha -->
          <div
            class="flex items-center bg-neutral-600  px-3 py-2 focus-within:rin  transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-7 mr-2 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>

            <input
              v-model="senha"
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
            class="shadow-xl cursor-pointer mt-4 w-full bg-rose-600  text-white font-bold py-2 transition transform hover:scale-105"
            >
            Login
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoLoginItem from './LogoLoginItem.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref('')
const senha = ref('')
const erro = ref('')
const mostrarSenha = ref(false)

interface Usuario{
  id:string;
  nome: string;
  login: string;
  salted_password: string;
  [key: string]: string;
}
function validarEmail(email:string):boolean{
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
function login() {
  if(!validarEmail(usuario.value)){
    erro.value = 'Digite um email válido'
    return;
  }
  fetch('http://localhost:3000/usuarios')
    .then(res => {
      if (!res.ok) throw new Error('Não foi possível carregar os usuários')
      return res.json()
    })
    .then((usuarios: Usuario[]) => {
      const encontrado = usuarios.find(
        u => u.email === usuario.value && u.login === senha.value
      );
      if (encontrado) {
        erro.value = ''
        alert(`Bem-vindo, ${encontrado.nome}!`)
        router.push('/dashboard')

      } else {
        erro.value = 'Login ou senha incorretos'
        usuario.value = ''
        senha.value =  ''
      }
    })
    .catch(e => {
      erro.value = e.message
    });
}


</script>

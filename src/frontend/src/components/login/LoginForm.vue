<template>
  <div class="relative flex justify-center items-center w-screen h-screen overflow-hidden">

    <div class="relative w-full max-w-lg">

      <logo-login-item class="absolute -top-5 left-1/2 transform -translate-x-1/2 w-45 h-45" />

      <!-- Formulário -->
      <div class="flex justify-center  ">
      <form  class=" w-100 h-100 pt-25 mt-20 bg-gray-300 bg-opacity-90 rounded- shadow-xl p-8 flex flex-col gap-4 text-white ">

        <!-- Usuário -->
        <div class="flex items-center bg-gray-700 px-3 py-2  focus-within:ring-2 focus-within:ring-blue-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <input  type="text" placeholder="USUÁRIO" class="bg-transparent outline-none flex-1 text-white placeholder-gray-400" required />
        </div>

        <!-- Senha -->
        <div class="flex items-center bg-gray-700 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2 text-white">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
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
<div class="flex items-center  ">
  <input
    type="checkbox"
    id="mostrarSenha"
    class="mr-2"
    v-model="mostrarSenha"
  />
  <label for="mostrarSenha" class="text-gray-700   cursor-pointer">Mostrar senha</label>
</div>


        <!-- Botão -->
        <button type="submit" class="cursor-pointer mt-4 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 transition transform hover:scale-105">
          Login
        </button>

      </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoLoginItem from './LogoLoginItem.vue';
import { ref } from 'vue';

const senha = ref('');
const mostrarSenha = ref(false);

</script>


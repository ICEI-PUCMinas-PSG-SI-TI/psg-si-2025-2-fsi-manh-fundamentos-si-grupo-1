<template>
  <div class="w-full min-h-screen p-6 overflow-x-hidden">
    <h1 class="text-5xl font-bold mb-4">Cadastro de usuários</h1>

    <!-- Formulário -->
    <div class="bg-base-200 p-6 rounded-2xl mb-8">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!--Primeira coluna-->
        <div class="flex flex-col gap-4 h-full">
          <div class="flex flex-col items-center mt-10">
            <img
              src="https://img.daisyui.com/images/profile/demo/3@94.webp"
              alt="avatar"
              class="w-30 h-30 rounded-full"
            />
          </div>
          <div class="flex flex-col justify-between mt-auto">
            <label class="block text-sm opacity-80">Login</label>
            <input type="text" class="input input-bordered w-full" placeholder="login" />
          </div>
        </div>

        <!-- Coluna Inputs -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center row-3 gap-4">
            <div class="flex-1">
              <label class="block text-sm opacity-80">Nome do usuário</label>
              <input type="text" class="input input-bordered w-full" placeholder="nome" />
            </div>
          </div>
          <div class="mt-auto">
            <label class="block text-sm opacity-80">Informações adicionais</label>
            <textarea
              class="textarea textarea-bordered w-full"
              placeholder="Ex: Gestor de estoque"
            ></textarea>
          </div>

          <div></div>

          <div class="mt-auto">
            <label class="block text-sm opacity-80">Senha</label>
            <input
              type="password"
              class="input input-bordered w-full"
              placeholder="Insira uma nova senha"
            />
          </div>
        </div>

        <!-- Coluna Permissões -->
        <div class="">
          <h2 class="text-xl font-semibold mb-4 flex flex-col items-center">Permissões</h2>
          <div class="flex flex-col gap-1">
            <label
              ><input type="checkbox" v-model="permissoes.admin" @change="aoMarcarAdmin" />
              Administrador</label
            >
            <p class="text-sm opacity-70 mb-2">Acesso total ao sistema.</p>

            <label :class="permissoes.admin ? 'text-gray-400' : ''"
              ><input type="checkbox" v-model="permissoes.cadastro" :disabled="permissoes.admin" />
              Cadastro</label
            >
            <p :class="permissoes.admin ? 'text-gray-400 text-sm' : 'text-sm opacity-70'">
              Permite cadastrar produtos.
            </p>

            <label :class="permissoes.admin ? 'text-gray-400' : ''"
              ><input
                type="checkbox"
                v-model="permissoes.movimentacoes"
                :disabled="permissoes.admin"
              />
              Movimentações</label
            >
            <p :class="permissoes.admin ? 'text-gray-400 text-sm' : 'text-sm opacity-70'">
              Permite realizar movimentações.
            </p>

            <label :class="permissoes.admin ? 'text-gray-400' : ''"
              ><input type="checkbox" v-model="permissoes.consulta" :disabled="permissoes.admin" />
              Consulta</label
            >
            <p :class="permissoes.admin ? 'text-gray-400 text-sm' : 'text-sm opacity-70'">
              Apenas visualiza informações.
            </p>
          </div>
        </div>
        <!--Coluna 4-->
        <div class="m-auto">
          <div class="flex flex-col items-end gap-4">
            <button
              class="btn bg-green-600 w-32 rounded-4xl hover:scale-105 transition-transform duration-100"
            >
              Confirmar
            </button>
            <button
              class="btn bg-blue-500 w-32 rounded-4xl hover:scale-105 transition-transform duration-100"
            >
              Alterar
            </button>
            <button
              class="btn bg-red-500 w-32 rounded-4xl hover:scale-105 transition-transform duration-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de usuários -->
    <div class="flex flex-col gap-4 w-full">
      <!-- Card 1 -->
      <div class="flex items-center justify-between bg-base-200 rounded-2xl p-3 shadow">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="rounded-full w-12 h-12">
              <img src="https://img.daisyui.com/images/profile/demo/2@94.webp" alt="Avatar" />
            </div>
          </div>
          <div>
            <p class="font-bold">Funcionário 01</p>
            <p class="text-sm text-gray-500">Gestor de estoque</p>
          </div>
        </div>

        <div class="flex items-center gap-10">
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <pencil-icon class="w-6 h-6"></pencil-icon>
          </button>
          <button class="hover:scale-105 transition-transform">
            <input type="checkbox"  class="toggle scale-85" />
          </button>
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <trash-icon class="w-6 h-6"></trash-icon>
          </button>
        </div>
      </div>
      <!-- Card 2 -->
      <div class="flex items-center justify-between bg-base-200 rounded-2xl p-3 shadow">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="rounded-full w-12 h-12">
              <img src="https://img.daisyui.com/images/profile/demo/1@94.webp" alt="Avatar" />
            </div>
          </div>
          <div>
            <p class="font-bold ">Funcionário 02</p>
            <p class="text-sm text-gray-500">Gestor de estoque</p>
          </div>
        </div>

        <div class="flex items-center gap-10">
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <pencil-icon class="w-6 h-6"></pencil-icon>
          </button>
          <button class="hover:scale-105 transition-transform">
            <input type="checkbox"  class="toggle scale-85" />
          </button>
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <trash-icon class="w-6 h-6"></trash-icon>
          </button>
        </div>
      </div>
      <!-- Card 3 -->
      <div class="flex items-center justify-between bg-base-200 rounded-2xl p-3 shadow">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="rounded-full w-12 h-12">
              <img src="https://img.daisyui.com/images/profile/demo/4@94.webp" alt="Avatar" />
            </div>
          </div>
          <div>
            <p class="font-bold">Funcionário 03</p>
            <p class="text-sm text-gray-500">Gestor de estoque</p>
          </div>
        </div>

        <div class="flex items-center gap-10">
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <pencil-icon class="w-6 h-6"></pencil-icon>
          </button>
          <button class="hover:scale-105 transition-transform">
            <input type="checkbox"  class="toggle scale-85" />
          </button>
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <trash-icon class="w-6 h-6"></trash-icon>
          </button>
        </div>
      </div>
      <!-- Card 4 -->
      <div class="flex items-center justify-between bg-base-200 rounded-2xl p-3 shadow">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="rounded-full w-12 h-12">
              <img src="https://img.daisyui.com/images/profile/demo/5@94.webp" alt="Avatar" />
            </div>
          </div>
          <div>
            <p class="font-bold">Funcionário 04</p>
            <p class="text-sm text-gray-500">Gestor de estoque</p>
          </div>
        </div>

        <div class="flex items-center gap-10">
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <pencil-icon class="w-6 h-6"></pencil-icon>
          </button>
          <button class="hover:scale-105 transition-transform">
            <input type="checkbox"  class="toggle scale-85" />
          </button>
          <button class="hover:scale-110 transition-transform cursor-pointer">
            <trash-icon class="w-6 h-6"></trash-icon>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const permissoes = ref({
  admin: false,
  cadastro: false,
  movimentacoes: false,
  consulta: false,
})

function aoMarcarAdmin() {
  if (permissoes.value.admin) {
    permissoes.value.cadastro = false
    permissoes.value.movimentacoes = false
    permissoes.value.consulta = false
  }
}
</script>

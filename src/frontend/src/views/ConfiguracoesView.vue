<template>
  <div class="flex flex-col w-full h-full p-4">
    <!-- Perfil do usuário -->
    <h1 class="p-4 bg-base-200 rounded mb-4">Perfil do usuário</h1>
    <form class="flex flex-col">
      <div class="flex flex-col justify-center items-center mb-4">
        <img
          class="avatar rounded-full border"
          width="100px"
          height="100px"
          src="../assets/profile.png"
          alt=""
        />
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Escolha uma imagem</legend>
          <input type="file" class="file-input" />
          <label class="label">Tamanho máximo de 2MB</label>
        </fieldset>
      </div>
      <div class="flex mb-4 justify-between">
        <label class="floating-label me-2">
          <span>Login</span>
          <input type="text" placeholder="Login" class="input" />
        </label>
        <label class="floating-label me-2">
          <span>Nome</span>
          <input type="text" placeholder="Nome" class="input" />
        </label>
        <label class="floating-label me-2">
          <span>Senha</span>
          <input type="password" placeholder="Senha" class="input" />
        </label>
        <label class="floating-label">
          <span>Senha (Confirmação)</span>
          <input type="password" placeholder="Senha (Confirmação)" class="input input-md" />
        </label>
      </div>
      <button class="btn btn-accent mb-4">Salvar</button>
    </form>
    <!-- Configurações do sistema -->
    <h1 class="p-4 bg-base-200 rounded mb-4">Configurações do sistema</h1>
    <form class="flex flex-col">
      <div class="flex mb-4 justify-between">
        <label class="floating-label me-2">
          <span>Nome da empresa</span>
          <input type="text" placeholder="Nome da empresa" class="input" />
        </label>
        <label class="floating-label me-2">
          <span>cnpj/cpf</span>
          <input type="text" placeholder="cnpj/cpf" class="input" />
        </label>
        <label class="floating-label">
          <span>Endereço</span>
          <input type="text" placeholder="Endereço" class="input" />
        </label>
      </div>
      <button class="btn btn-accent mb-4">Salvar</button>
    </form>
    <!-- Categorias -->
    <h1 class="p-4 bg-base-200 rounded mb-4">Categorias</h1>
    <div class="flex w-full">
      <form class="w-50 me-4">
        <label class="floating-label mb-4">
          <span>Categoria</span>
          <input type="text" placeholder="Categoria" class="input" />
        </label>
        <button class="btn btn-accent mb-4">Adicionar</button>
      </form>
      <div class="w-50">
        <div
          class="flex flex-row justify-between items-center border-full rounded bg-info px-2 mb-2"
          v-for="value in categorias"
          :key="value"
        >
          <p>{{ value }}</p>
          <XMarkIcon class="size-8" />
        </div>
      </div>
    </div>
    <!-- Unidades de medida -->
    <h1 class="p-4 bg-base-200 rounded mb-4">Unidades de medida</h1>
    <div class="flex w-full">
      <form class="w-50 me-4">
        <label class="floating-label mb-4">
          <span>Unidade de Medida</span>
          <input type="text" placeholder="Unidade de Medida" class="input" />
        </label>
        <label class="floating-label mb-4">
          <span>Abreviação</span>
          <input type="text" placeholder="Abreviação" class="input" />
        </label>
        <button class="btn btn-accent mb-4">Adicionar</button>
      </form>
      <div class="w-50">
        <div
          class="flex flex-row justify-between items-center border-full rounded bg-info px-2 mb-2"
          v-for="unidade in unidadesMedida"
          :key="unidade.nome"
        >
          <div class="flex flex-col">
            <p>{{ unidade.nome }}</p>
            <p>{{ unidade.abrev }}</p>
          </div>
          <XMarkIcon class="size-8" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const categorias = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'])
const unidadesMedida = ref([
  {
    nome: 'Metro',
    abrev: 'm',
  },
  {
    nome: 'Litro',
    abrev: 'L',
  },
  {
    nome: 'Bytes',
    abrev: 'B',
  },
  {
    nome: 'bits',
    abrev: 'b',
  },
])
</script>
